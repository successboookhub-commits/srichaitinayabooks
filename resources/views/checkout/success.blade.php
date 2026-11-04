    @extends('layouts.app')
    @section('content')
    <div style="max-width:800px;margin:50px auto;background:#fff;padding:30px;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,.1);text-align:center;">
        <h2 style="color:green;">🎉 Order Placed Successfully!</h2>
        <p><strong>Order ID:</strong> #{{ $order->order_code }}</p>
        <p><strong>Total Paid:</strong> ₹{{ $order->total }}</p>
        <p><strong>Status:</strong> {{ $order->status }}</p>
        <hr>
        <h4>Ordered Items</h4>
        @foreach($items as $item)
            <p>
                {{ $item->product_name }} × {{ $item->qty }}
                = ₹{{ $item->total }}
            </p>
        @endforeach

        <br>
        <a href="{{ $invoiceUrl }}"
        target="_blank"
        id="invoiceBtn"
        style="display:inline-block;padding:12px 25px;background:#0d6efd;color:#fff;border-radius:25px;text-decoration:none;margin-right:10px;">
            📄 Download Invoice
        </a>
        <a href="/" id="continueBtn" style="padding:12px 25px;background:#16a34a;color:#fff;border-radius:25px;text-decoration:none;">
            Continue Shopping
        </a>
    </div>

    <script>
    /* =========================================================
    ✅ This page is always fully interactive by default (fresh
    page load). The only thing worth doing here is making sure
    pressing Back from this page doesn't re-open the checkout
    form / re-trigger a payment.
    ========================================================= */
    history.replaceState({page:'order-success'}, '', location.href);
    </script>
    @endsection
