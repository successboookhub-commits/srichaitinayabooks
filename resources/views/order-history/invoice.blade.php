<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $order->order_code }}</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; margin: 0; padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
        .brand { font-size: 22px; font-weight: 800; color: #111827; }
        .invoice-title { text-align: right; }
        .invoice-title h1 { margin: 0; font-size: 26px; color: #4f46e5; }
        .invoice-title p { margin: 4px 0 0; color: #6b7280; font-size: 13px; }
        .grid { display: flex; justify-content: space-between; gap: 30px; margin-bottom: 30px; }
        .box { flex: 1; }
        .box h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 8px; }
        .box p { margin: 2px 0; font-size: 14px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f3f4f6; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; color: #6b7280; }
        td { padding: 12px; font-size: 14px; border-bottom: 1px solid #f3f4f6; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .totals { width: 280px; margin-left: auto; }
        .totals div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
        .totals .grand { border-top: 2px solid #111827; margin-top: 6px; padding-top: 10px; font-weight: 800; font-size: 16px; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9ca3af; }
        @media print {
            body { padding: 0; }
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="brand">📚 BookCom</div>
        <div class="invoice-title">
            <h1>INVOICE</h1>
            <p>Order #{{ $order->order_code }}</p>
            <p>{{ optional($order->created_at)->format('d M Y, h:i A') }}</p>
        </div>
    </div>

    <div class="grid">
        <div class="box">
            <h3>Billed To</h3>
            <p><strong>{{ $order->customer->name ?? '—' }}</strong></p>
            <p>{{ $order->customer->phone ?? '' }}</p>
            <p>{{ $order->customer->email ?? '' }}</p>
        </div>
        <div class="box">
            <h3>Shipping Address</h3>
            @if($order->customer)
                <p>{{ $order->customer->door_no }}, {{ $order->customer->address }}</p>
                <p>{{ $order->customer->mandal }}, {{ $order->customer->district }}</p>
                <p>{{ $order->customer->state }}, {{ $order->customer->country }} — {{ $order->customer->pincode }}</p>
            @endif
        </div>
        <div class="box">
            <h3>Payment</h3>
            <p>Payment ID: {{ $order->razorpay_payment_id ?? 'N/A' }}</p>
            <p>Payment Status: {{ $order->payment_status_label }}</p>
            <p>Order Status: {{ $order->order_status_label }}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th class="text-center">Price</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td class="text-center">₹{{ number_format($item->price, 2) }}</td>
                    <td class="text-center">{{ $item->qty }}</td>
                    <td class="text-right">₹{{ number_format($item->total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <div><span>Subtotal</span><span>₹{{ number_format($order->subtotal, 2) }}</span></div>
        <div><span>Shipping</span><span>₹{{ number_format($order->shipping, 2) }}</span></div>
        <div class="grand"><span>Grand Total</span><span>₹{{ number_format($order->total, 2) }}</span></div>
    </div>

    <div class="footer">
        Thank you for shopping with BookCom! This is a system-generated invoice.
    </div>

    <script>
        // Auto-open the browser print dialog so the customer can "Save as PDF".
        window.onload = function () { window.print(); };
    </script>

</body>
</html>
