@extends('layouts.app')

@section('content')

<div class="product-page">

    <!-- LEFT : IMAGES -->
    <div class="product-images">

        <!-- BIG IMAGE -->
        <div class="main-image">
            <img id="mainProductImage"
                 src="{{ asset('storage/'.$product->main_photo) }}"
                 alt="{{ $product->name }}">
        </div>

       {{-- THUMBNAILS --}}
@php
$relatedPhotos = $product->related_photos;

if (is_string($relatedPhotos)) {
    $relatedPhotos = json_decode($relatedPhotos, true);
}

$relatedPhotos = is_array($relatedPhotos) ? $relatedPhotos : [];
@endphp

@if(count($relatedPhotos))
<div class="thumb-images">

    <img src="{{ asset('storage/'.$product->main_photo) }}"
         class="thumb active"
         onclick="changeImage(this)"
         alt="">

    @foreach($relatedPhotos as $photo)

        @php
            if (is_array($photo)) {
                $photo = $photo['image'] ?? reset($photo);
            }
        @endphp

        <img src="{{ asset('storage/'.$photo) }}"
             class="thumb"
             onclick="changeImage(this)"
             alt="">

    @endforeach

</div>
@endif

    </div>

    <!-- RIGHT : DETAILS -->
    <div class="product-details">

        <h1>{{ $product->name }}</h1>
        
          <div class="price-box">
            <span class="price-new">₹{{ $product->total_price }}</span>

            @if($product->old_price)
                <span class="price-old">₹{{ $product->old_price }}</span>
            @endif

            @if($product->discount)
                <span class="price-discount">{{ $product->discount }}% OFF</span>
            @endif
        </div>

       <div class="categories">

@php
    $categories = $product->category_list ?? [];
@endphp

@if(is_iterable($categories))

    @forelse($categories as $index => $cat)

        <span class="category-item {{ $index >= 5 ? 'extra-category d-none' : '' }}">
            {{ is_array($cat) ? ($cat['name'] ?? '') : ($cat->name ?? '') }}
        </span>

    @empty

        <span>No Category</span>

    @endforelse

    @if(count($categories) > 5)
        <button type="button" class="view-all-btn">
            View All ({{ count($categories) - 5 }})
        </button>
    @endif

@else

    <span>No Category</span>

@endif

</div>

      

        <p class="description">
            {!! nl2br(e($product->description)) !!}
        </p>

        <div class="qty-cart">
            <input type="number" class="qty-input" min="1" value="1">

            <button class="add-cart-btn" data-id="{{ $product->id }}">
                <i class="fa fa-cart-plus"></i> Add to Cart
            </button>

            <button class="buy-now-btn" data-id="{{ $product->id }}">
                <i class="fa fa-bolt"></i> Buy Now
            </button>
        </div>

    </div>
</div>

<hr>

{{-- RELATED PRODUCTS --}}
@if($relatedProducts->count())
<h2 class="section-title">🔁 Related Books</h2>

<div class="product-scroll">
@foreach($relatedProducts as $item)

<div class="product-card">

    <a href="{{ route('product.show', $item->slug) }}" class="product-link">
        <span class="discount">
            {{ $item->discount ? $item->discount.'% OFF' : 'HOT' }}
        </span>

        <img src="{{ asset('storage/'.$item->main_photo) }}" alt="{{ $item->name }}">

        <h4 class="product-title">{{ Str::limit($item->name, 25) }}</h4>

        <div class="category-tags">
            @foreach($item->category_list as $cat)
                <span>{{ $cat->name }}</span>
            @endforeach
        </div>

        <div class="price">
            <span class="new">₹{{ $item->total_price }}</span>
            @if($item->old_price)
                <span class="price-old">₹{{ $item->old_price }}</span>
            @endif
        </div>
    </a>

    <div class="card-actions">
        <button class="add-cart-btn" data-id="{{ $item->id }}">
            <i class="fa fa-cart-plus"></i> Add
        </button>

        <button class="buy-now-btn" data-id="{{ $item->id }}">
            <i class="fa fa-bolt"></i> Buy Now
        </button>
    </div>

</div>

@endforeach
</div>
@endif

@endsection
<style>
.product-page{
    max-width:1200px;
    margin:120px auto;
    display:flex;
    gap:40px;
    padding:0 15px;
}

/* IMAGE SECTION */
.product-images{
    flex:1;
    width:100%;
}

.main-image{
    background:#fff;
    border-radius:16px;
    padding:15px;
    box-shadow:0 10px 30px rgba(0,0,0,.1);
}

.main-image img{
    width:100%;
    height:420px;
    object-fit:contain;
    border-radius:10px;
}

/* THUMBNAILS */
.thumb-images{
    display:flex;
    gap:10px;
    margin-top:15px;
    overflow-x:auto;
    padding-bottom:5px;
}

.thumb-images::-webkit-scrollbar{
    height:5px;
}

.thumb{
    width:70px;
    height:70px;
    min-width:70px;
    object-fit:contain;
    border-radius:10px;
    cursor:pointer;
    border:2px solid transparent;
    background:#fff;
    padding:5px;
    box-shadow:0 3px 8px rgba(0,0,0,.1);
}

.thumb.active{
    border-color:#22c55e;
}

/* DETAILS */
.product-details{
    flex:1;
    width:100%;
}

.product-details h1{
    font-size:30px;
    font-weight:700;
    margin-bottom:10px;
}

/* CATEGORY */
.categories{
    margin-bottom:10px;
}

.categories span{
    display:inline-block;
    background:#eef2ff;
    color:#3730a3;
    padding:4px 12px;
    border-radius:20px;
    margin-right:6px;
    margin-bottom:6px;
    font-size:12px;
}

.view-all-btn{
    background:none;
    border:none;
    color:#2563eb;
    font-size:12px;
    cursor:pointer;
    font-weight:600;
    padding:4px 8px;
}

.view-all-btn:hover{
    text-decoration:underline;
}

.d-none{
    display:none !important;
}
/* PRICE */
.price-box{
    margin:20px 0;
}

.price-new{
    font-size:28px;
    color:#16a34a;
    font-weight:700;
}

.price-old{
    text-decoration:line-through;
    color:#999;
    margin-left:8px;
}

.price-discount{
    color:#dc2626;
    margin-left:8px;
    font-weight:600;
}

/* DESCRIPTION */
.description{
    line-height:1.7;
    color:#374151;
    margin-bottom:25px;
}

/* CART SECTION */
.qty-cart{
    display:flex;
    gap:12px;
    flex-wrap:wrap;
}

.qty-input{
    width:80px;
    padding:12px;
    border-radius:10px;
    border:1px solid #ddd;
    text-align:center;
}

/* BUTTON */
.add-cart-btn{
    background:linear-gradient(135deg,#22c55e,#16a34a);
    color:#fff;
    border:none;
    padding:12px 25px;
    border-radius:30px;
    font-size:15px;
    cursor:pointer;
    transition:0.3s;
}

.add-cart-btn:hover{
    transform:scale(1.05);
}

.add-cart-btn.added{
    background:linear-gradient(135deg,#3b82f6,#2563eb);
    transform:none;
}

.add-cart-btn:disabled{
    opacity:.8;
    cursor:not-allowed;
}

/* BUY NOW BUTTON */
.buy-now-btn{
    background:linear-gradient(135deg,#ff9800,#f57c00);
    color:#fff;
    border:none;
    padding:12px 25px;
    border-radius:30px;
    font-size:15px;
    cursor:pointer;
    transition:0.3s;
}

.buy-now-btn:hover{
    transform:scale(1.05);
}

.buy-now-btn:disabled{
    opacity:.8;
    cursor:not-allowed;
    transform:none;
}

/* RELATED PRODUCTS */
.product-scroll{
    display:flex;
    gap:16px;
    overflow-x:auto;
    padding:10px 15px;
}

.product-card{
    min-width:200px;
    background:#fff;
    border-radius:14px;
    box-shadow:0 5px 15px rgba(0,0,0,.08);
    padding:12px;
    text-align:center;
    position:relative;
}

.product-card img{
    width:100%;
    height:180px;
    object-fit:contain;
}

.product-title{
    font-size:14px;
    margin-top:10px;
}

.category-tags span{
    font-size:11px;
    background:#eef2ff;
    padding:2px 8px;
    border-radius:10px;
}

.price{
    margin:10px 0;
}

.discount{
    position:absolute;
    top:10px;
    left:10px;
    background:#ef4444;
    color:#fff;
    padding:4px 10px;
    font-size:11px;
    border-radius:20px;
}

/* Button row under related product cards */
.card-actions{
    display:flex;
    gap:8px;
    margin-top:8px;
}

.card-actions .add-cart-btn,
.card-actions .buy-now-btn{
    flex:1;
    padding:8px 10px;
    font-size:12px;
}

/* ---------------- MOBILE ---------------- */

@media (max-width:768px){

.product-page{
    /* FIX: removed the old margin-top:80px hack that was on
       .main-image img. The fixed mobile header already reserves
       space via body { padding-top } in the navbar styles, so
       stacking another 80px here pushed the image too far down /
       caused inconsistent spacing. A small top margin here is
       enough for breathing room under the nav. */
    margin-top:10px;
    flex-direction:column;
    gap:16px;
    padding:0 12px;
}

.main-image{
    padding:10px;
    border-radius:12px;
}

.main-image img{
    height:230px;
    margin-top: 35%;
}

.thumb{
    width:55px;
    height:55px;
    min-width:55px;
    padding:3px;
}

.product-details h1{
    font-size:17px;
    margin-bottom:6px;
}

.categories span{
    font-size:11px;
    padding:3px 10px;
}

.price-box{
    margin:12px 0;
}

.price-new{
    font-size:20px;
}

.price-old{
    font-size:12px;
}

.price-discount{
    font-size:12px;
}

.description{
    font-size:13px;
    line-height:1.55;
    margin-bottom:16px;
}

.qty-cart{
    flex-direction:column;
    align-items:stretch;
    gap:8px;
}

.qty-input{
    width:100%;
    padding:8px;
    font-size:13px;
}

.add-cart-btn,
.buy-now-btn{
    width:100%;
    padding:10px 14px;
    font-size:13px;
}

.section-title{
    font-size:15px;
    padding:0 12px;
}

.product-card{
    min-width:150px;
    padding:8px;
}

.product-card img{
    height:130px;
}

.product-title{
    font-size:12px;
    margin-top:6px;
}

.category-tags span{
    font-size:9px;
    padding:1px 6px;
}

.price .new{
    font-size:13px;
}

.product-scroll .card-actions{
    flex-direction:column;
    gap:5px;
}

.product-scroll .add-cart-btn,
.product-scroll .buy-now-btn{
    padding:6px 10px;
    font-size:11px;
    width:100%;
}

}

</style>


@push('scripts')
<script>
document.addEventListener("DOMContentLoaded", function () {

    function addToCart(button, redirectToCart) {

        if (button.disabled) return;

        let productId = button.dataset.id;
        let originalHtml = button.innerHTML;

        // The main product block has a quantity input next to its
        // buttons; the related-product cards don't. Use it if present,
        // otherwise default to 1.
        let wrapper  = button.closest('.qty-cart') || button.closest('.product-card');
        let qtyInput = wrapper ? wrapper.querySelector('.qty-input') : null;
        let quantity = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

        button.disabled = true;
        button.innerHTML = redirectToCart
            ? '<i class="fa fa-spinner fa-spin"></i> Please wait...'
            : '<i class="fa fa-spinner fa-spin"></i> Adding...';

        fetch("{{ route('cart.add') }}", {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": "{{ csrf_token() }}",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity
            })
        })
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                document.querySelectorAll('.cart-count').forEach(function (item) {
                    item.innerText = data.count;
                });

                if (redirectToCart) {
                    // Buy Now -> straight to the cart page
                    window.location.href = "{{ route('cart.index') }}";
                    return;
                }

                button.classList.add('added');
                button.innerHTML = '<i class="fa fa-check"></i> Added';

                setTimeout(function () {
                    button.disabled = false;
                    button.classList.remove('added');
                    button.innerHTML = originalHtml;
                }, 1500);

            } else {
                button.disabled = false;
                button.innerHTML = originalHtml;
            }

        })
        .catch(function (error) {
            console.log(error);
            button.disabled = false;
            button.innerHTML = originalHtml;
        });
    }

    // FIX: this was querying '.add-cart' but every button on this page
    // uses class "add-cart-btn" — so nothing ever matched and the click
    // listener never got attached. Selecting '.add-cart-btn' fixes it.
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            addToCart(this, false);
        });
    });

    // BUY NOW: add to cart, then redirect straight to the cart page.
    document.querySelectorAll('.buy-now-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            addToCart(this, true);
        });
    });

});
</script>

<script>
function changeImage(el){
    document.getElementById('mainProductImage').src = el.src;

    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}
</script>


<script>
document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.categories').forEach(function(categoryBox){

        const btn = categoryBox.querySelector('.view-all-btn');

        if(btn){

            btn.addEventListener('click', function(){

                categoryBox.querySelectorAll('.extra-category').forEach(function(item){
                    item.classList.remove('d-none');
                });

                btn.remove();
            });

        }

    });

});
</script>


@endpush
