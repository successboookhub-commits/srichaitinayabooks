<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order #{{ $order->order_code }} — Order Details</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gray-50 min-h-screen">

    <header class="bg-white border-b border-gray-200">
        <div class="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
            <a href="/" class="text-xl font-extrabold text-gray-900">📚 SRI CHAITANYA BOOK CENTRE</a>
            <a href="{{ route('order-history.index', ['phone' => $phone]) }}" class="text-sm font-medium text-gray-500 hover:text-gray-900">&larr; Back to Order History</a>
        </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-10">

        {{-- ============ Title + status ============ --}}
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900">Order #{{ $order->order_code }}</h1>
                <p class="text-gray-500 text-sm mt-1">Placed on {{ optional($order->created_at)->format('d M Y, h:i A') }}</p>
            </div>
            <div class="flex gap-2">
                <span class="px-3 py-1 rounded-full text-sm font-semibold border {{ $order->status_badge_color }}">
                    {{ $order->order_status_label }}
                </span>
                <span class="px-3 py-1 rounded-full text-sm font-semibold border {{ $order->payment_badge_color }}">
                    Payment: {{ $order->payment_status_label }}
                </span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {{-- ============ Customer Information ============ --}}
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 class="font-bold text-gray-900 mb-4">Customer Information</h2>
                <dl class="space-y-2 text-sm">
                    <div class="flex justify-between"><dt class="text-gray-400">Name</dt><dd class="font-medium text-gray-700">{{ $order->customer->name ?? '—' }}</dd></div>
                    <div class="flex justify-between"><dt class="text-gray-400">Phone</dt><dd class="font-medium text-gray-700">{{ $order->customer->phone ?? '—' }}</dd></div>
                    <div class="flex justify-between"><dt class="text-gray-400">Email</dt><dd class="font-medium text-gray-700">{{ $order->customer->email ?? '—' }}</dd></div>
                </dl>
            </div>

            {{-- ============ Shipping Address ============ --}}
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 class="font-bold text-gray-900 mb-4">Shipping Address</h2>
                @if($order->customer)
                    <p class="text-sm text-gray-700 leading-relaxed">
                        {{ $order->customer->door_no }}, {{ $order->customer->address }}<br>
                        {{ $order->customer->mandal }}, {{ $order->customer->district }}<br>
                        {{ $order->customer->state }}, {{ $order->customer->country }} — {{ $order->customer->pincode }}
                    </p>
                @else
                    <p class="text-sm text-gray-400">No address on file.</p>
                @endif
            </div>
        </div>

        {{-- ============ Ordered Products ============ --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div class="px-6 py-4 border-b border-gray-100">
                <h2 class="font-bold text-gray-900">Ordered Products</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 text-gray-500 text-left">
                            <th class="px-6 py-3 font-semibold">Product</th>
                            <th class="px-6 py-3 font-semibold text-center">Price</th>
                            <th class="px-6 py-3 font-semibold text-center">Qty</th>
                            <th class="px-6 py-3 font-semibold text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($order->items as $item)
                            <tr>
                                <td class="px-6 py-4 font-medium text-gray-800">{{ $item->product_name }}</td>
                                <td class="px-6 py-4 text-center text-gray-600">₹{{ number_format($item->price, 2) }}</td>
                                <td class="px-6 py-4 text-center text-gray-600">{{ $item->qty }}</td>
                                <td class="px-6 py-4 text-right font-semibold text-gray-800">₹{{ number_format($item->total, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        {{-- ============ Order Summary ============ --}}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 class="font-bold text-gray-900 mb-4">Payment Information</h2>
                <dl class="space-y-2 text-sm">
                    <div class="flex justify-between"><dt class="text-gray-400">Payment ID</dt><dd class="font-medium text-gray-700">{{ $order->razorpay_payment_id ?? 'N/A' }}</dd></div>
                    <div class="flex justify-between"><dt class="text-gray-400">Payment Status</dt><dd class="font-medium text-gray-700">{{ $order->payment_status_label }}</dd></div>
                    <div class="flex justify-between"><dt class="text-gray-400">Order Status</dt><dd class="font-medium text-gray-700">{{ $order->order_status_label }}</dd></div>
                </dl>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 class="font-bold text-gray-900 mb-4">Order Summary</h2>
                <dl class="space-y-2 text-sm">
                    <div class="flex justify-between"><dt class="text-gray-400">Subtotal</dt><dd class="text-gray-700">₹{{ number_format($order->subtotal, 2) }}</dd></div>
                    <div class="flex justify-between"><dt class="text-gray-400">Shipping</dt><dd class="text-gray-700">₹{{ number_format($order->shipping, 2) }}</dd></div>
                    <div class="flex justify-between pt-2 border-t border-gray-100"><dt class="font-bold text-gray-900">Grand Total</dt><dd class="font-bold text-gray-900">₹{{ number_format($order->total, 2) }}</dd></div>
                </dl>
            </div>
        </div>

        <div class="mt-8 flex justify-center">
            <a href="{{ route('order-history.invoice', ['order_code' => $order->order_code, 'phone' => $phone]) }}"
               target="_blank"
               class="px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm">
                Download Invoice
            </a>
        </div>

    </main>

    <footer class="text-center text-xs text-gray-400 py-8">
        &copy; {{ date('Y') }} BookCom. All rights reserved.
    </footer>

</body>
</html>
