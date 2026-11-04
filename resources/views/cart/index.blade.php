@extends('layouts.app')

@section('content')
<div class="cart-container">

<!-- LEFT -->
<div class="cart-left">
<h2 class="cart-title">Shopping Cart</h2>

@forelse($cart as $item)
<div class="cart-card" data-id="{{ $item['id'] }}">
    <img src="{{ asset('storage/'.$item['image']) }}" class="cart-img">

    <div class="cart-details">
        
        <p class="price">₹{{ $item['price'] }}</p>

        <div class="qty-box">
            <button class="qty-btn minus">−</button>
            <span class="qty">{{ $item['qty'] }}</span>
            <button class="qty-btn plus">+</button>
        </div>
    </div>

    <div class="cart-right">
        <p class="item-total">
            ₹<span>{{ $item['price'] * $item['qty'] }}</span>
        </p>

        <form method="POST" action="{{ route('cart.remove') }}">
            @csrf
            <input type="hidden" name="id" value="{{ $item['id'] }}">
            <button class="delete-btn">🗑</button>
        </form>
    </div>
</div>
@empty
<p>Your cart is empty</p>
@endforelse
</div>

<!-- RIGHT -->
<div class="cart-summary">
<h3>Order Summary</h3>

{{--
    FIX: subtotal/shipping/total are now calculated server-side in
    CartController (via App\Services\ShippingCalculator) instead of
    the naive collect($cart)->sum(...) that used to live here. That
    old version had no idea about "Weight Less" products, so it always
    charged full per-item shipping for every item — this is what makes
    the ₹15-per-additional-weightless-item rule actually apply.
--}}

<div class="summary-row">
<span>Subtotal</span>
<span id="subtotal">₹{{ $subtotal }}</span>
</div>

<div class="summary-row">
<span>Shipping</span>
<span id="shipping">₹{{ $shipping }}</span>
</div>

<hr>

<div class="summary-total">
<span>Total</span>
<span id="total">₹{{ $total }}</span>
</div>

<a href="{{ route('checkout') }}" class="checkout-btn">Checkout →</a>
</div>

</div>
@endsection




<style>
    .cart-container{
    display:flex;
    gap:30px;
    max-width:1200px;
    margin:50px auto;
    padding:10px;
}

/* LEFT */
.cart-left{
    flex:2;
}

.cart-title{
    font-size:26px;
    margin-bottom:20px;
}

.cart-card{
    display:flex;
    align-items:center;
    gap:20px;
    background:#fff;
    padding:15px;
    border-radius:12px;
    margin-bottom:15px;
    box-shadow:0 2px 8px rgba(0,0,0,0.05);
}

.cart-img{
    width:90px;
    height:120px;
    object-fit:contain;
}

.cart-details{
    flex:1;
}

.cart-details h4{
    font-size:13px;
    margin-bottom:5px;
    display:flex;
    align-items:center;
    gap:8px;
}

.tag-weightless{
    font-size:11px;
    font-weight:600;
    color:#0d6efd;
    background:#e8f0fe;
    padding:2px 8px;
    border-radius:20px;
}

.price{
    color:#1a7f37;
    font-weight:600;
    margin-bottom:10px;
}

.qty-box{
    display:flex;
    align-items:center;
    gap:10px;
}

.qty-box button{
    width:32px;
    height:32px;
    border:1px solid #ccc;
    background:#fff;
    border-radius:6px;
    cursor:pointer;
}

.cart-right{
    text-align:right;
}

.item-total{
    font-weight:600;
    margin-bottom:8px;
}

.delete-btn{
    background:none;
    border:none;
    color:red;
    font-size:18px;
    cursor:pointer;
}

/* RIGHT */
.cart-summary{
    flex:1;
    background:#fff;
    padding:20px;
    border-radius:14px;
    height:fit-content;
    box-shadow:0 2px 10px rgba(0,0,0,0.06);
}

.cart-summary h3{
    margin-bottom:20px;
}

.summary-row{
    display:flex;
    justify-content:space-between;
    margin-bottom:12px;
    color:#555;
}

.summary-total{
    display:flex;
    justify-content:space-between;
    font-size:20px;
    font-weight:700;
    margin:15px 0;
}

.checkout-btn{
    display:block;
    background:#0a7a0a;
    color:#fff;
    text-align:center;
    padding:14px;
    border-radius:30px;
    font-size:18px;
    text-decoration:none;
    transition:.3s;
}

.checkout-btn:hover{
    background:#066406;
}

/* MOBILE */
@media(max-width:900px){
    .cart-container{
        flex-direction:column;
    }
}

</style>

<script>
document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.qty-btn').forEach(btn => {

        btn.addEventListener('click', function () {

            let card  = this.closest('.cart-card');
            let id    = card.dataset.id;
            let qtyEl = card.querySelector('.qty');
            let qty   = parseInt(qtyEl.innerText);

            if (this.classList.contains('plus')) {
                qty++;
            }

            if (this.classList.contains('minus') && qty > 1) {
                qty--;
            }

            fetch("{{ route('cart.update') }}", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": "{{ csrf_token() }}",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id, qty: qty })
            })
            .then(res => res.json())
            .then(data => {
                qtyEl.innerText = qty;
                card.querySelector('.item-total span').innerText = data.itemTotal;

                document.getElementById('subtotal').innerText = '₹' + data.subtotal;
                document.getElementById('shipping').innerText = '₹' + data.shipping;
                document.getElementById('total').innerText    = '₹' + data.total;
            });

        });

    });

});
</script>
