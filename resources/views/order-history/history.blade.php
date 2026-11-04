<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order History</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gray-50 min-h-screen">

    {{-- ============ Header ============ --}}
    <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
            <a href="/" class="text-xl font-extrabold text-gray-900">📚 SRI CHAITANYA BOOK CENTRE</a>
            <a href="/" class="text-sm font-medium text-gray-500 hover:text-gray-900">&larr; Back to Home</a>
        </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-10">

        {{-- ============ Page Title ============ --}}
        <div class="text-center mb-10">
            <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900">Order History</h1>
            <p class="mt-2 text-gray-500">Enter the mobile number you used while placing your order to view your orders.</p>
        </div>

        {{-- ============ Search Form ============ --}}
        <div class="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-10">
            <form action="{{ route('order-history.index') }}" method="GET" class="space-y-4">
                <div>
                    <label for="phone" class="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value="{{ $phone ?? old('phone') }}"
                        placeholder="e.g. 9876543210"
                        pattern="[0-9]{10,15}"
                        maxlength="15"
                        required
                        class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                    >
                    @error('phone')
                        <p class="mt-1.5 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                <button
                    type="submit"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-sm hover:shadow-md"
                >
                    Search Orders
                </button>
            </form>
        </div>

        {{-- ============ Results ============ --}}
        @if($searched)
            @if($orders->isEmpty())
                <div class="max-w-md mx-auto text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
                    <div class="text-5xl mb-3">🔍</div>
                    <p class="text-gray-600 font-medium">No orders found for this mobile number.</p>
                    <p class="text-sm text-gray-400 mt-1">Please double-check the number and try again.</p>
                </div>
            @else
                <div class="mb-4 text-sm text-gray-500 font-medium">
                    {{ $orders->count() }} order{{ $orders->count() > 1 ? 's' : '' }} found
                </div>

                <div class="space-y-5">
                    @foreach($orders as $order)
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 md:p-6">
                            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                {{-- Left: order info --}}
                                <div class="flex-1">
                                    <div class="flex flex-wrap items-center gap-2 mb-2">
                                        <span class="font-bold text-gray-900 text-lg">#{{ $order->order_code }}</span>
                                        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border {{ $order->status_badge_color }}">
                                            {{ $order->order_status_label }}
                                        </span>
                                        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border {{ $order->payment_badge_color }}">
                                            Payment: {{ $order->payment_status_label }}
                                        </span>
                                    </div>
                                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm text-gray-500">
                                        <div><span class="text-gray-400">Date:</span> {{ optional($order->created_at)->format('d M Y') }}</div>
                                        <div><span class="text-gray-400">Items:</span> {{ $order->items_count }}</div>
                                        <div><span class="text-gray-400">Total:</span> <span class="font-semibold text-gray-700">₹{{ number_format($order->total, 2) }}</span></div>
                                    </div>
                                </div>

                                {{-- Right: actions --}}
                                <div class="flex gap-2 shrink-0">
                                    <a href="{{ route('order-history.invoice', ['order_code' => $order->order_code, 'phone' => $phone]) }}"
                                       target="_blank"
                                       class="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                                        Download Invoice
                                    </a>
                                    <a href="{{ route('order-history.show', ['order_code' => $order->order_code, 'phone' => $phone]) }}"
                                       class="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition">
                                        View Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        @endif

    </main>

    <footer class="text-center text-xs text-gray-400 py-8">
        &copy; {{ date('Y') }} BookCom. All rights reserved.
    </footer>

</body>
</html>
