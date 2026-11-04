<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Dedicated controller for the Excel integration. Kept separate from
| OrderController so the admin UI code and the Excel API code don't get
| tangled together.
|
| NOTE ON MODELS: this app's schema (as built throughout this project)
| does not have separate Product or Payment models/tables — order_items
| stores product_name directly as text (no product_id / SKU column),
| and payment status/method lives on the orders table itself
| (status, razorpay_payment_id). Fields your database genuinely doesn't
| have (discount, tax, SKU, a dedicated transaction "method" other than
| Razorpay) are returned as 0/null rather than invented. If you add
| those columns later, wire them in below — the response shape won't
| need to change.
|--------------------------------------------------------------------------
*/
class ExcelOrderController extends Controller
{
    public function getOrderForExcel(Request $request, $orderCode)
    {
        // -------- Token check --------
        // Accepts either ?token=xxx or an Authorization: Bearer xxx header.
        $providedToken = $request->bearerToken() ?? $request->query('token');
        $expectedToken = config('services.excel_api.token');

        if (!$expectedToken || $providedToken !== $expectedToken) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or missing API token.',
            ], 401);
        }

        $orderCode = trim($orderCode);

        $order = Order::with(['customer', 'items'])
            ->where('order_code', $orderCode)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => "No order found for code: {$orderCode}",
            ], 404);
        }

        $customer = $order->customer;

        // Fold door number into the address line, since this schema
        // doesn't have a separate "street"/"door_no" column in the
        // Excel sheet design — everything ships in "address".
        $fullAddress = trim(implode(', ', array_filter([
            $customer->door_no ?? '',
            $customer->address ?? '',
        ])), ', ');

        $isPaid = strtolower((string) $order->status) === 'paid';
        $paidAmount = $isPaid ? $order->total : 0;
        $pendingAmount = $isPaid ? 0 : $order->total;

        $items = $order->items->map(function ($item) {
            $qty = (float) ($item->quantity ?? $item->qty ?? $item->order_qty ?? 0);
            $price = $item->price ?? null;
            $itemTotal = $item->total ?? ($price !== null ? $price * $qty : null);

            return [
                'product_name' => $item->product_name,
                'sku'          => $item->sku ?? $item->product_code ?? null,  // not a current column — null if absent
                'quantity'     => (int) $qty,
                'price'        => $price,
                'discount'     => $item->discount ?? 0,   // not a current column
                'total'        => $itemTotal,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [

                'order' => [
                    'id'              => $order->id,
                    'order_code'      => $order->order_code,
                    'order_date'      => $order->created_at->format('Y-m-d H:i:s'),
                    'status'          => $order->order_status,
                    'payment_status'  => $order->status,
                    'subtotal'        => $order->subtotal,
                    'discount'        => $order->discount ?? 0,       // not a current column
                    'shipping_charge' => $order->shipping,
                    'tax'             => $order->tax ?? $order->gst ?? 0,  // not a current column
                    'total'           => $order->total,
                ],

                'customer' => [
                    'name'    => $customer->name ?? '',
                    'phone'   => $customer->phone ?? '',
                    'email'   => $customer->email ?? '',
                    'address' => $fullAddress,
                    'mandal'  => $customer->mandal ?? '',
                    'district'=> $customer->district ?? '',
                    'state'   => $customer->state ?? '',
                    'pincode' => $customer->pincode ?? '',
                ],

                'items' => $items,

                'payment' => [
                    'method'         => $order->razorpay_payment_id ? 'Online' : '-',
                    'status'         => $order->status,
                    'transaction_id' => $order->razorpay_payment_id ?? '',
                    'paid_amount'    => $paidAmount,
                    'pending_amount' => $pendingAmount,
                ],

            ],
        ]);
    }
}
