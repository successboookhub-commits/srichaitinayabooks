<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Order;
use App\Services\ShippingCalculator;
use App\Services\WhatsAppService;
use Barryvdh\DomPDF\Facade\Pdf;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = session('cart', []);

        $calc = ShippingCalculator::calculate($cart);

        return view('checkout.index', [
            'cart'     => $cart,
            'subtotal' => $calc['subtotal'],
            'shipping' => $calc['shipping'],
            'total'    => $calc['total'],
        ]);
    }

    public function pay(Request $request)
    {
        $cart = session('cart', []);

        if (empty($cart)) {
            return response()->json(['error' => 'Your cart is empty.'], 400);
        }

        // Validate available stock for each item before creating payment
        foreach ($cart as $item) {
            $product = Product::find($item['id'] ?? 0);
            if (!$product || $product->quantity < ($item['qty'] ?? 1)) {
                return response()->json([
                    'error' => 'Sorry, "' . ($item['name'] ?? 'an item') . '" has insufficient stock available.'
                ], 400);
            }
        }

        session(['checkout_data' => $request->all()]);

        $calc  = ShippingCalculator::calculate($cart);
        $total = $calc['total'];

        $amountInPaise = (int) round($total * 100);

        $api = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );

        $razorOrder = $api->order->create([
            'receipt'  => 'ORD-' . Str::random(10),
            'amount'   => $amountInPaise,
            'currency' => 'INR'
        ]);

        Cache::store('file')->put(
            'checkout_' . $razorOrder['id'],
            [
                'checkout_data' => $request->all(),
                'cart'          => $cart,
            ],
            now()->addMinutes(45)
        );

        return response()->json([
            'order_id' => $razorOrder['id'],
            'amount'   => $amountInPaise,
            'key'      => config('services.razorpay.key')
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | RAZORPAY REDIRECT CALLBACK
    |--------------------------------------------------------------------------
    */
    public function callback(Request $request)
    {
        $attributes = [
            'razorpay_order_id'   => $request->input('razorpay_order_id'),
            'razorpay_payment_id' => $request->input('razorpay_payment_id'),
            'razorpay_signature'  => $request->input('razorpay_signature'),
        ];

        if (!$attributes['razorpay_payment_id'] || !$attributes['razorpay_signature']) {
            return redirect()->route('checkout')
                ->with('error', 'Payment was not completed. Please try again.');
        }

        $api = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );

        try {
            $api->utility->verifyPaymentSignature($attributes);
        } catch (\Exception $e) {
            Log::error('Razorpay signature verification failed: ' . $e->getMessage());

            return redirect()->route('checkout')->with(
                'error',
                'Payment verification failed. If money was deducted, contact support with Payment ID: ' . $attributes['razorpay_payment_id']
            );
        }

        // Avoid duplicate order creation if already processed
        $existingOrder = Order::where('razorpay_payment_id', $attributes['razorpay_payment_id'])->first();
        if ($existingOrder) {
            return redirect()->route('order.success', $existingOrder->id);
        }

        $pending = Cache::store('file')->get('checkout_' . $attributes['razorpay_order_id']);
        $checkout = $pending['checkout_data'] ?? session('checkout_data');
        $cart     = $pending['cart'] ?? session('cart', []);

        if (empty($checkout) || empty($cart)) {
            return redirect()->route('checkout')->with(
                'error',
                'Your session expired. If money was deducted, contact support with Payment ID: ' . $attributes['razorpay_payment_id']
            );
        }

        DB::beginTransaction();

        try {
            $today = now();

            // Collision-proof unique order code generator
            do {
                $orderCode = 'ORD' . $today->format('Ym') . str_pad(random_int(100, 9999), 4, '0', STR_PAD_LEFT);
            } while (DB::table('orders')->where('order_code', $orderCode)->exists());

            // Customer Deduplication: update or create based on mobile number
            $customer = Customer::firstOrNew(['phone' => trim($checkout['phone'])]);
            $customer->name     = $checkout['name'];
            $customer->email    = $checkout['email'];
            $customer->country  = 'India';
            $customer->state    = $checkout['state'];
            $customer->district = $checkout['district'];
            $customer->mandal   = $checkout['mandal'] ?? '';
            $customer->door_no  = $checkout['door_no'];
            $customer->address  = $checkout['address'];
            $customer->pincode  = $checkout['pincode'];
            $customer->save();

            $calc = ShippingCalculator::calculate($cart);

            $orderId = DB::table('orders')->insertGetId([
                'customer_id'         => $customer->id,
                'order_code'          => $orderCode,
                'subtotal'            => $calc['subtotal'],
                'shipping'            => $calc['shipping'],
                'total'               => $calc['total'],
                'status'              => 'Paid',
                'order_status'        => 'Ordered',
                'razorpay_payment_id' => $attributes['razorpay_payment_id'],
                'created_at'          => now(),
                'updated_at'          => now(),
            ]);

            foreach ($cart as $item) {
                $productId = $item['id'] ?? null;
                $qty = (int) ($item['qty'] ?? 1);

                DB::table('order_items')->insert([
                    'order_id'     => $orderId,
                    'product_id'   => $productId,
                    'product_name' => $item['name'],
                    'price'        => $item['price'],
                    'qty'          => $qty,
                    'total'        => $item['price'] * $qty,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);

                // Decrement stock in inventory
                if ($productId) {
                    Product::where('id', $productId)
                        ->where('quantity', '>=', $qty)
                        ->decrement('quantity', $qty);
                }
            }

            DB::commit();

            Cache::store('file')->forget('checkout_' . $attributes['razorpay_order_id']);
            session()->forget(['cart', 'checkout_data']);

            // Post-order processing (PDF invoice & WhatsApp)
            try {
                $order = DB::table('orders')->where('id', $orderId)->first();
                $items = DB::table('order_items')->where('order_id', $orderId)->get();

                $invoiceRelativePath = $this->ensureInvoicePdf($order, $items);
                $invoiceFullPath = public_path($invoiceRelativePath);

                if (file_exists($invoiceFullPath)) {
                    $invoiceUrl = asset($invoiceRelativePath);

                    $phone = preg_replace('/[^0-9]/', '', $checkout['phone']);
                    if (strlen($phone) == 10) {
                        $phone = '91' . $phone;
                    }

                    WhatsAppService::sendOrderConfirmation($phone, $order, $invoiceUrl);
                }
            } catch (\Exception $e) {
                Log::error('Post-order invoice/WhatsApp step failed: ' . $e->getMessage());
            }

            return redirect()->route('order.success', $orderId);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Razorpay callback order creation failed: ' . $e->getMessage());

            return redirect()->route('checkout')->with(
                'error',
                'Something went wrong confirming your order. If money was deducted, contact support with Payment ID: ' . $attributes['razorpay_payment_id']
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | RAZORPAY WEBHOOK (Guarantees order creation even if browser drops)
    |--------------------------------------------------------------------------
    */
    public function webhook(Request $request)
    {
        $payload   = $request->getContent();
        $signature = $request->header('X-Razorpay-Signature');
        $secret    = config('services.razorpay.webhook_secret') ?? config('services.razorpay.secret');

        if (!$signature) {
            return response()->json(['status' => 'Missing signature'], 400);
        }

        try {
            $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
            $api->utility->verifyWebhookSignature($payload, $signature, $secret);
        } catch (\Exception $e) {
            Log::error('Razorpay webhook signature failed: ' . $e->getMessage());
            return response()->json(['status' => 'Invalid signature'], 400);
        }

        $data = json_decode($payload, true);
        $event = $data['event'] ?? '';

        if (in_array($event, ['payment.captured', 'order.paid'])) {
            $payment = $data['payload']['payment']['entity'] ?? [];
            $razorpayOrderId = $payment['order_id'] ?? null;
            $paymentId = $payment['id'] ?? null;

            if ($paymentId && !Order::where('razorpay_payment_id', $paymentId)->exists()) {
                $pending = Cache::store('file')->get('checkout_' . $razorpayOrderId);
                if ($pending && !empty($pending['checkout_data']) && !empty($pending['cart'])) {
                    $checkout = $pending['checkout_data'];
                    $cart = $pending['cart'];

                    DB::beginTransaction();
                    try {
                        $today = now();
                        do {
                            $orderCode = 'ORD' . $today->format('Ym') . str_pad(random_int(100, 9999), 4, '0', STR_PAD_LEFT);
                        } while (DB::table('orders')->where('order_code', $orderCode)->exists());

                        $customer = Customer::firstOrNew(['phone' => trim($checkout['phone'])]);
                        $customer->name     = $checkout['name'];
                        $customer->email    = $checkout['email'];
                        $customer->country  = 'India';
                        $customer->state    = $checkout['state'];
                        $customer->district = $checkout['district'];
                        $customer->mandal   = $checkout['mandal'] ?? '';
                        $customer->door_no  = $checkout['door_no'];
                        $customer->address  = $checkout['address'];
                        $customer->pincode  = $checkout['pincode'];
                        $customer->save();

                        $calc = ShippingCalculator::calculate($cart);

                        $orderId = DB::table('orders')->insertGetId([
                            'customer_id'         => $customer->id,
                            'order_code'          => $orderCode,
                            'subtotal'            => $calc['subtotal'],
                            'shipping'            => $calc['shipping'],
                            'total'               => $calc['total'],
                            'status'              => 'Paid',
                            'order_status'        => 'Ordered',
                            'razorpay_payment_id' => $paymentId,
                            'created_at'          => now(),
                            'updated_at'          => now(),
                        ]);

                        foreach ($cart as $item) {
                            $productId = $item['id'] ?? null;
                            $qty = (int) ($item['qty'] ?? 1);

                            DB::table('order_items')->insert([
                                'order_id'     => $orderId,
                                'product_id'   => $productId,
                                'product_name' => $item['name'],
                                'price'        => $item['price'],
                                'qty'          => $qty,
                                'total'        => $item['price'] * $qty,
                                'created_at'   => now(),
                                'updated_at'   => now(),
                            ]);

                            if ($productId) {
                                Product::where('id', $productId)->decrement('quantity', $qty);
                            }
                        }

                        DB::commit();
                        Cache::store('file')->forget('checkout_' . $razorpayOrderId);
                        Log::info("Order successfully created via webhook for Payment ID: {$paymentId}");

                    } catch (\Exception $e) {
                        DB::rollBack();
                        Log::error("Failed to process order via webhook: " . $e->getMessage());
                    }
                }
            }
        }

        return response()->json(['status' => 'success']);
    }

    public function orderSuccess($orderId)
    {
        $order = DB::table('orders')->where('id', $orderId)->first();

        if (!$order) {
            return redirect('/');
        }

        $items = DB::table('order_items')
                    ->where('order_id', $orderId)
                    ->get();

        $invoiceRelativePath = $this->ensureInvoicePdf($order, $items);
        $invoiceUrl = asset($invoiceRelativePath);

        return view('checkout.success', compact('order', 'items', 'invoiceUrl'));
    }

    protected function ensureInvoicePdf($order, $items)
    {
        $folder = public_path('invoices');

        if (!file_exists($folder)) {
            mkdir($folder, 0755, true);
        }

        $fileName = $order->order_code . '.pdf';
        $fullPath = $folder . '/' . $fileName;

        $pdf = Pdf::loadView('checkout.invoice', [
            'order' => $order,
            'items' => $items,
        ]);

        $pdf->save($fullPath);

        return 'invoices/' . $fileName;
    }

    public function downloadInvoice(string $orderCode, Request $request)
    {
        $order = Order::with(['items', 'customer'])->where('order_code', $orderCode)->firstOrFail();

        // Security check: Must be admin or have matching phone
        $phone = $request->query('phone') ?? session('verified_phone');
        $isAdmin = Auth::check() && Auth::user()->role === 'admin';

        if (!$isAdmin && (!$phone || !$order->customer || $order->customer->phone !== $phone)) {
            abort(403, 'Unauthorized access to invoice.');
        }

        $items = DB::table('order_items')->where('order_id', $order->id)->get();
        $relativePath = $this->ensureInvoicePdf($order, $items);

        return response()->download(
            public_path($relativePath),
            $orderCode . '.pdf'
        );
    }
}
