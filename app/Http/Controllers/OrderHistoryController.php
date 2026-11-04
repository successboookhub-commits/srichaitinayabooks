<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderHistoryController extends Controller
{
    /**
     * GET /order-history
     * Shows the search form, and — if a phone number was submitted —
     * the list of orders that belong to that phone number.
     */
    public function index(Request $request)
    {
        $orders   = collect();
        $searched = false;
        $phone    = trim((string) $request->query('phone'));

        if ($phone !== '') {
            $searched = true;

            $validator = Validator::make(['phone' => $phone], [
                'phone' => ['required', 'digits_between:10,15'],
            ], [
                'phone.digits_between' => 'Please enter a valid mobile number (10-15 digits).',
            ]);

            if ($validator->fails()) {
                return redirect()
                    ->route('order-history.index')
                    ->withErrors($validator);
            }

            // Save phone to session for seamless navigation to details/invoice
            session(['verified_phone' => $phone]);

            $customerIds = Customer::where('phone', $phone)->pluck('id');

            if ($customerIds->isNotEmpty()) {
                $orders = Order::whereIn('customer_id', $customerIds)
                    ->withCount('items')
                    ->orderByDesc('created_at')
                    ->get();
            }
        }

        return view('order-history.history', compact('orders', 'searched', 'phone'));
    }

    /**
     * GET /order-history/{order_code}
     * Full order details. Phone verification prevents IDOR access.
     */
    public function show(string $order_code, Request $request)
    {
        $phone = $request->query('phone') ?? session('verified_phone');

        $order = Order::with(['items', 'customer'])
            ->where('order_code', $order_code)
            ->firstOrFail();

        $this->authorizeOrderAccess($order, $phone);

        return view('order-history.history-details', compact('order', 'phone'));
    }

    /**
     * GET /order-history/{order_code}/invoice
     * Printable invoice view with phone verification.
     */
    public function invoice(string $order_code, Request $request)
    {
        $phone = $request->query('phone') ?? session('verified_phone');

        $order = Order::with(['items', 'customer'])
            ->where('order_code', $order_code)
            ->firstOrFail();

        $this->authorizeOrderAccess($order, $phone);

        return view('order-history.invoice', compact('order'));
    }

    /**
     * Requires the phone number to match the order's customer,
     * unless the user is logged in as an administrator.
     */
    protected function authorizeOrderAccess(Order $order, ?string $phone): void
    {
        // Admin always has access
        if (Auth::check() && Auth::user()->role === 'admin') {
            return;
        }

        if (empty($phone) || !$order->customer || $order->customer->phone !== $phone) {
            abort(403, 'Unauthorized access. A valid matching mobile number is required to view this order.');
        }
    }
}
