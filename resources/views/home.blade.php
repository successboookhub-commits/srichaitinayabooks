@extends('layouts.app')

@section('content')

<!-- Banner Slider Section -->
<div class="home-banner">
    <div class="slider-container">

     @foreach($banners as $banner)
    <div class="slide">
        <img src="{{ asset($banner->image) }}" alt="Banner" />
    </div>
@endforeach

        <!-- Navigation Arrows -->
        <a class="prev">&#10094;</a>
        <a class="next">&#10095;</a>

        <!-- Dots -->
        <div class="dots">
            @foreach($banners as $key => $banner)
                <span class="dot" onclick="currentSlide({{ $key }})"></span>
            @endforeach
        </div>
    </div>
</div>

<style>
/* ======================
   BANNER WRAPPER
====================== */
.home-banner{
    width:100%;
    position:relative;
    overflow:hidden;
    background:#fff;
}

/* DESKTOP */
/* DESKTOP (> 1024px) */
@media (min-width:1025px){
    .home-banner{
        margin-top: 72px;
        height: auto;
        aspect-ratio: 2.6 / 1;
        max-height: 520px;
        min-height: 320px;
    }

    .slide{
        position:absolute;
        inset:0;
    }
}

/* TABLET (769px - 1024px) */
@media (min-width:769px) and (max-width:1024px){
    .home-banner{
        margin-top: 56px;
        height: auto;
        aspect-ratio: 2.6 / 1;
        max-height: 420px;
        min-height: 240px;
    }

    .slide{
        position:absolute;
        inset:0;
    }
}

/* MOBILE */
@media (max-width:768px){
    .home-banner{
        margin-top: 56px !important;
        height: auto;
        aspect-ratio: 2.55 / 1;
        width: 100%;
    }

    .slide{
        position:relative;
        width: 100%;
        height: 100%;
    }
}

/* ======================
   SLIDER
====================== */
.slider-container{
    width:100%;
    height:100%;
    position:relative;
}

/* SLIDE */
.slide{
    display:none;
}

/* IMAGE */
.slide img{
    width:100%;
    height:100%;
    object-fit:contain;
    object-position: center;
    display:block;
    background:#fff;
}

/* ======================
   ARROWS
====================== */
.prev, .next{
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    width:44px;
    height:44px;
    background:rgba(0,0,0,.45);
    color:#fff;
    font-size:26px;
    border-radius:50%;
    text-align:center;
    line-height:44px;
    cursor:pointer;
    z-index:10;
    transition:.3s;
}

.prev{ left:12px; }
.next{ right:12px; }

.prev:hover, .next:hover{
    background:rgba(0,0,0,.8);
    transform:translateY(-50%) scale(1.15);
}

/* ======================
   DOTS
====================== */
.dots{
    position:absolute;
    bottom:12px;
    width:100%;
    text-align:center;
    z-index:10;
}

.dot{
    width:10px;
    height:10px;
    margin:0 4px;
    background:rgba(255,255,255,.6);
    border-radius:50%;
    display:inline-block;home-banner
    cursor:pointer;
    transition:.3s;
}

.dot.active{
    background:#d72c35;
}

/* MOBILE TUNING */
@media (max-width:768px){
    .prev, .next{
        width:34px;
        height:34px;
        font-size:20px;
        line-height:34px;
    }

    .dot{
        width:8px;
        height:8px;
    }
}
</style>


<script>
document.addEventListener('DOMContentLoaded', function(){

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if(slides.length === 0) return;

    let slideIndex = 0;
    let timer;

    function showSlide(n){
        slides.forEach((s,i)=>{
            s.style.display = 'none';
            if(dots[i]) dots[i].classList.remove('active');
        });

        slides[n].style.display = 'block';
        if(dots[n]) dots[n].classList.add('active');
    }

    function nextSlide(){
        slideIndex = (slideIndex + 1) % slides.length;
        showSlide(slideIndex);
    }

    function prevSlide(){
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        showSlide(slideIndex);
    }

    function resetTimer(){
        clearInterval(timer);
        timer = setInterval(nextSlide, 5000);
    }

    document.querySelector('.prev').onclick = () => {
        prevSlide();
        resetTimer();
    };

    document.querySelector('.next').onclick = () => {
        nextSlide();
        resetTimer();
    };

    dots.forEach((dot, index)=>{
        dot.onclick = () => {
            slideIndex = index;
            showSlide(slideIndex);
            resetTimer();
        };
    });

    showSlide(slideIndex);
    timer = setInterval(nextSlide, 5000);
});
</script>




<!-- Category Slider (Centered with Premium Hover & Border Effects) -->
<div class="category-slider-wrapper">
    <div class="category-slider_2">

        <a href="{{ route('shop.category','si-constable') }}" class="category-card">
            <div class="icon-wrap">
                <img src="{{ asset('images/categories/polic.png') }}" alt="Police Department">
            </div>
            <p>Police Department</p>
        </a>

        <a href="{{ route('shop.category','rrbrailway-recruitment-board') }}" class="category-card">
            <div class="icon-wrap">
                <img src="{{ asset('images/categories/rrb.png') }}" alt="RRB">
            </div>
            <p>RRB</p>
        </a>

        <a href="{{ route('shop.category','sscstaff-selection-comitee') }}" class="category-card">
            <div class="icon-wrap">
                <img src="{{ asset('images/categories/ssc.png') }}" alt="SSC">
            </div>
            <p>SSC</p>
        </a>

        <a href="{{ route('shop.category','tgpsc') }}" class="category-card">
            <div class="icon-wrap">
                <img src="{{ asset('images/categories/tgpsc.png') }}" alt="TGPSC">
            </div>
            <p>TGPSC</p>
        </a>

        <a href="{{ route('shop.category','upsc') }}" class="category-card">
            <div class="icon-wrap">
                <img src="{{ asset('images/categories/upsc.png') }}" alt="UPSC">
            </div>
            <p>UPSC</p>
        </a>

        <a href="{{ route('shop.category','value-bundles') }}" class="category-card">
            <div class="icon-wrap">
                <img src="{{ asset('images/categories/value.webp') }}" alt="Value Bundles">
            </div>
            <p>Value Bundles</p>
        </a>

        <a href="{{ route('shop.category','defence') }}" class="category-card">
            <div class="icon-wrap">
                <img src="{{ asset('images/categories/defenace_logo.png') }}" alt="Defence">
            </div>
            <p>Defence</p>
        </a>

        <a href="{{ route('shop.category','tet') }}" class="category-card">
            <div class="icon-wrap">
                <img src="{{ asset('images/categories/education.png') }}" alt="Teaching">
            </div>
            <p>Teaching</p>
        </a>

        <a href="{{ route('shop.category','banking') }}" class="category-card">
            <div class="icon-wrap">
                <img src="{{ asset('images/categories/banking.png') }}" alt="Banking">
            </div>
            <p>Banking</p>
        </a>

    </div>
</div>

<!-- Category Cards CSS -->
<style>
.category-slider-wrapper {
    width: 100%;
    max-width: 1360px;
    margin: 22px auto 10px;
    padding: 0 15px;
    box-sizing: border-box;
}

.category-slider_2 {
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 14px;
    padding: 10px 4px 18px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
}
.category-slider_2::-webkit-scrollbar {
    display: none;
}

.category-card {
    flex: 0 0 auto;
    width: 124px;
    text-align: center;
    background: #ffffff;
    border: 1.5px solid #edf0f5;
    border-radius: 16px;
    padding: 14px 8px 12px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
    transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-sizing: border-box;
}

/* Top Accent Line on Hover */
.category-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #d72c35, #ff5757);
    opacity: 0;
    transform: scaleX(0);
    transition: all 0.25s ease;
}

/* Hover & Active Elevation */
.category-card:hover {
    transform: translateY(-5px);
    border-color: #d72c35;
    box-shadow: 0 12px 24px -4px rgba(215, 44, 53, 0.16), 0 4px 10px rgba(0, 0, 0, 0.04);
    background: #ffffff;
}

.category-card:hover::before {
    opacity: 1;
    transform: scaleX(1);
}

.category-card .icon-wrap {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    transition: all 0.25s ease;
}

.category-card:hover .icon-wrap {
    background: #fff5f5;
    border-color: #fecdd3;
    transform: scale(1.08);
}

.category-card img {
    width: 42px;
    height: 42px;
    object-fit: contain;
    transition: transform 0.25s ease;
}

.category-card p {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    line-height: 1.25;
    transition: color 0.2s ease;
    text-align: center;
}

.category-card:hover p {
    color: #d72c35;
}

/* =========================
   RESPONSIVE (MOBILE & TABLET)
========================= */
@media (max-width: 991px) {
    .category-slider_2 {
        justify-content: flex-start;
        padding: 8px 10px 14px;
        gap: 10px;
    }

    .category-card {
        width: 92px;
        padding: 10px 6px 8px;
        border-radius: 12px;
    }

    .category-card .icon-wrap {
        width: 46px;
        height: 46px;
        margin-bottom: 6px;
    }

    .category-card img {
        width: 32px;
        height: 32px;
    }

    .category-card p {
        font-size: 11px;
    }
}
</style>

<!-- JS (optional for auto-scroll) -->
<script>
const slider = document.querySelector('.category-slider');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', e => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    slider.scrollLeft = scrollLeft - walk;
});
</script>


<!-- ================= NEW ARRIVALS ================= -->

<div class="products-container">

<h2 class="section-title">🔥 New Arrivals</h2>

@if($trending->count())
<div class="product-scroll">
@foreach($trending as $product)

<div class="product-card">

<a href="{{ !empty($product->slug) ? route('product.show',['slug'=>$product->slug]) : 'javascript:void(0)' }}" class="product-link">

<span class="discount">
{{ $product->discount ? number_format($product->discount,0).'%' : 'HOT' }}
</span>

<img src="{{ asset('storage/'.$product->main_photo) }}" alt="{{ $product->name }}">

<div class="card-content">

<h4 class="product-title">
{{ Str::limit($product->name, 40) }}
</h4>

<div class="category-tags">
<div class="marquee">
@forelse($product->category_list as $category)
<span>{{ $category->name }}</span>
@empty
<span>No Category</span>
@endforelse
</div>
</div>

<div class="price">
<span class="new">₹{{ $product->total_price }}</span>
<span class="old">₹{{ $product->old_price }}</span>
</div>

</div>
</a>

<div class="card-actions">
<button class="add-cart" data-id="{{ $product->id }}">
<i class="fa fa-cart-plus"></i> Add
</button>
<button class="buy-now" data-id="{{ $product->id }}">
<i class="fa fa-bolt"></i> Buy Now
</button>
</div>

</div>

@endforeach
</div>
@endif



<h2 class="section-title">⭐ Featured Books</h2>

@if($featured->count())
<div class="product-scroll">
@foreach($featured as $product)

<div class="product-card">

<a href="{{ !empty($product->slug) ? route('product.show',['slug'=>$product->slug]) : 'javascript:void(0)' }}" class="product-link">

<span class="discount">
{{ $product->discount ? number_format($product->discount,0).'%' : 'HOT' }}
</span>

<img src="{{ asset('storage/'.$product->main_photo) }}" alt="{{ $product->name }}">

<div class="card-content">

<h4 class="product-title">
{{ Str::limit($product->name, 40) }}
</h4>

<div class="category-tags">
<div class="marquee">
@forelse($product->category_list as $category)
<span>{{ $category->name }}</span>
@empty
<span>No Category</span>
@endforelse
</div>
</div>

<div class="price">
<span class="new">₹{{ $product->total_price }}</span>
<span class="old">₹{{ $product->old_price }}</span>
</div>

</div>
</a>

<div class="card-actions">
<button class="add-cart" data-id="{{ $product->id }}">
<i class="fa fa-cart-plus"></i> Add
</button>
<button class="buy-now" data-id="{{ $product->id }}">
<i class="fa fa-bolt"></i> Buy Now
</button>
</div>

</div>

@endforeach
</div>
@endif


@foreach($publications as $pub)

@if($pub->products->count())

<h2 class="section-title">📚 {{ $pub->name }}</h2>

<div class="product-scroll">

@foreach($pub->products as $product)

<div class="product-card">

<a href="{{ route('product.show',$product->slug) }}" class="product-link">

<span class="discount">
{{ $product->discount ? number_format($product->discount,0).'%' : 'HOT' }}
</span>

<img src="{{ asset('storage/'.$product->main_photo) }}" alt="{{ $product->name }}">

<div class="card-content">

<h4 class="product-title">
{{ Str::limit($product->name,40) }}
</h4>

<div class="category-tags">
@forelse($product->category_list as $category)
<span>{{ $category->name }}</span>
@empty
<span>No Category</span>
@endforelse
</div>

<div class="price">
<span class="new">₹{{ $product->total_price }}</span>
<span class="old">₹{{ $product->old_price }}</span>
</div>

</div>
</a>

<div class="card-actions">
<button class="add-cart" data-id="{{ $product->id }}">
<i class="fa fa-cart-plus"></i> Add
</button>
<button class="buy-now" data-id="{{ $product->id }}">
<i class="fa fa-bolt"></i> Buy Now
</button>
</div>

</div>

@endforeach

</div>

@endif

@endforeach


</div>




<style>

.section-title{
    font-size:26px;
    margin:30px 0 15px;
    font-weight:700;
    margin: auto;
}
.product-link{
    text-decoration:none;
    color:inherit;
}


.section-title{
    font-size:26px;
    margin:30px 0 15px;
    font-weight:700;
}

/* Horizontal Scroll */
.product-scroll{
    display:flex;
    gap:18px;
    overflow-x:auto;
    scroll-behavior:smooth;
    padding-bottom:10px;
}

.product-scroll::-webkit-scrollbar{
    height:6px;
}
.product-scroll::-webkit-scrollbar-thumb{
    background:#ccc;
    border-radius:10px;
}

/* CARD */
.product-card{
    min-width:220px;
    width:220px;
    height:460px;
    background:#fff;
    border-radius:14px;
    box-shadow:0 6px 18px rgba(0,0,0,0.08);
    padding:12px;
    position:relative;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    transition:.3s;
}

.product-card:hover{
    transform:translateY(-6px);
}

/* Discount */
.discount{
    position:absolute;
    top:10px;
    left:10px;
    background:#e63946;
    color:#fff;
    padding:4px 10px;
    font-size:12px;
    border-radius:20px;
}

/* Image */
.product-card img{
    width:100%;
    height:200px;
    object-fit:contain;
    border-radius:10px;
}

/* Card Content */
.card-content{
    flex-grow:1;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
}

/* Title */
.product-title{
    font-size:14px;
    font-weight:600;
    height:40px;
    overflow:hidden;
}

/* Category Marquee */
.category-tags{
    overflow:hidden;
    white-space:nowrap;
    width:100%;
    height:28px;
    position:relative;
}

.category-tags .marquee{
    display:inline-block;
    padding-left:100%;
    animation:categoryScroll 12s linear infinite;
}

.category-tags span{
    font-size:11px;
    background:#f1f3f5;
    padding:3px 8px;
    border-radius:12px;
    margin-right:6px;
    display:inline-block;
}

@keyframes categoryScroll{
    0%{ transform:translateX(0); }
    100%{ transform:translateX(-100%); }
}

/* Price */
.price{
    margin-top:6px;
}

.price .new{
    font-size:18px;
    font-weight:700;
    color:#1d3557;
}

.price .old{
    font-size:14px;
    text-decoration:line-through;
    color:#999;
    margin-left:6px;
}

/* Button group holding Add to Cart + Buy Now */
.card-actions{
    display:flex;
    gap:8px;
    margin-top:10px;
}

/* Button */
.add-cart{
    flex:1;
    background:#2ecc71;
    color:#fff;
    border:none;
    padding:8px 6px;
    border-radius:25px;
    cursor:pointer;
    font-size:13px;
    white-space:nowrap;
    transition:.3s;
}

.add-cart:hover{
    background:#27ae60;
}

.add-cart.added{
    background:#3498db;
}

/* Buy Now Button */
.buy-now{
    flex:1;
    background:#ff9800;
    color:#fff;
    border:none;
    padding:8px 6px;
    border-radius:25px;
    cursor:pointer;
    font-size:13px;
    white-space:nowrap;
    transition:.3s;
}

.buy-now:hover{
    background:#e68900;
}

.buy-now:disabled,
.add-cart:disabled{
    opacity:.7;
    cursor:not-allowed;
}

/* Responsive */
@media(max-width:576px){
    .product-card{
        min-width:170px;
        width:170px;
        height:440px;
    }
    .product-card img{
        height:160px;
    }

    .card-actions{
        flex-direction:column;
        gap:6px;
    }

    .add-cart,
    .buy-now{
        width:100%;
        font-size:12px;
        padding:9px 4px;
    }
}
/* Responsive */

</style>

<script>
document.querySelectorAll('.product-scroll').forEach(container => {

    let scrollAmount = 0;
    let autoScroll;
    let isUserInteracting = false;

    function startAutoScroll() {

        autoScroll = setInterval(() => {

            if (isUserInteracting) return;

            scrollAmount += 220;

            if (scrollAmount >= container.scrollWidth - container.clientWidth) {
                scrollAmount = 0;
            }

            container.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });

        }, 3000);
    }

    function stopAutoScroll() {
        isUserInteracting = true;
    }

    function resumeAutoScroll() {
        isUserInteracting = false;
    }

    // Start auto scroll
    startAutoScroll();

    // Stop on touch / mouse down
    container.addEventListener('touchstart', stopAutoScroll);
    container.addEventListener('mousedown', stopAutoScroll);

    // Resume after user stops touching
    container.addEventListener('touchend', () => {
        setTimeout(resumeAutoScroll, 2000);
    });

    container.addEventListener('mouseup', () => {
        setTimeout(resumeAutoScroll, 2000);
    });

});
</script>


<script>
document.querySelectorAll('.add-cart').forEach(btn => {

    btn.addEventListener('click', function () {

        let productId = this.dataset.id;

        fetch("{{ route('cart.add') }}", {

            method: "POST",

            headers: {
                "X-CSRF-TOKEN": "{{ csrf_token() }}",
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                product_id: productId
            })

        })

        .then(res => res.json())

        .then(data => {

            document.querySelectorAll('.cart-count').forEach(function(item){
                item.innerText = data.count;
            });

            btn.classList.add('added');
            btn.innerHTML = '<i class="fa fa-check"></i> Added';

        });

    });

});
</script>

<!-- BUY NOW: add to cart, then go straight to the cart page -->
<script>
document.querySelectorAll('.buy-now').forEach(btn => {

    btn.addEventListener('click', function () {

        let productId = this.dataset.id;
        let button = this;

        button.disabled = true;
        let originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Please wait...';

        fetch("{{ route('cart.add') }}", {

            method: "POST",

            headers: {
                "X-CSRF-TOKEN": "{{ csrf_token() }}",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })

        })

        .then(res => res.json())

        .then(data => {

            if (data.success) {

                document.querySelectorAll('.cart-count').forEach(function(item){
                    item.innerText = data.count;
                });

                // straight to cart page
                window.location.href = "{{ route('cart.index') }}";

            } else {
                button.disabled = false;
                button.innerHTML = originalHtml;
            }

        })

        .catch(error => {
            console.log(error);
            button.disabled = false;
            button.innerHTML = originalHtml;
        });

    });

});
</script>




<!-- end products -->


<!-- top public -->





<!-- =========================
 SRI CHAITANYA BOOK CENTRE
========================= -->
<section class="scbc-section">
  <div class="container">
    <h2 class="main-title">SRI CHAITANYA BOOK CENTRE</h2>
    <p class="subtitle">
      All competitive books available at low price with high discounts
      <br>
      <strong>Group-1, Group-2, SI, Constable</strong>
    </p>

    <!-- WHY CHOOSE US -->
    <div class="why-grid">
      <div class="why-card">
        <i class="fas fa-book"></i>
        <h4>Authentic Books</h4>
        <p>100% original books directly from publishers</p>
      </div>

      <div class="why-card">
        <i class="fas fa-truck-fast"></i>
        <h4>Fast Delivery</h4>
        <p>Quick & safe delivery across India in 3-5 days</p>
      </div>

      <div class="why-card">
        <i class="fas fa-tags"></i>
        <h4>Best Prices</h4>
        <p>Lowest prices with regular discounts & offers</p>
      </div>

      <div class="why-card">
        <i class="fas fa-headset"></i>
        <h4>Expert Support</h4>
        <p>24/7 support to guide your preparation</p>
      </div>
    </div>
  </div>
</section>
<style>
    .scbc-section {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  padding: 80px 20px;
  color: #fff;
}

.container {
  max-width: 1200px;
  margin: auto;
  text-align: center;
}

.main-title {
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 50px;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 25px;
}

.why-card {
  background: #fff;
  color: #333;
  padding: 30px 20px;
  border-radius: 16px;
  transition: 0.4s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.why-card i {
  font-size: 40px;
  color: #ff9800;
  margin-bottom: 15px;
}

.why-card h4 {
  font-size: 20px;
  margin-bottom: 10px;
}

.why-card p {
  font-size: 15px;
  color: #666;
}

.why-card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

</style>



<!-- =========================
 CONTACT & SUPPORT
========================= -->
<section class="contact-section">
  <div class="container contact-grid">

    <!-- LEFT CONTENT -->
    <div class="contact-info">
      <h2>Have Questions?</h2>
      <p>
        We’re here to help.
        Whether you need details about test series, study materials,
        or just want to say hello.
      </p>

      <div class="support-box">
        <i class="fas fa-clock"></i>
        <div>
          <h4>Quick Support</h4>
          <p>Get answers within 24 hours</p>
        </div>
      </div>
    </div>

    <!-- FORM -->
    <form class="contact-form">
      <h3>Send Us a Message</h3>

      <input type="text" placeholder="Full Name *" required>
      <input type="email" placeholder="Email *" required>
      <input type="text" placeholder="Phone Number">
      <input type="text" placeholder="Subject *" required>
      <textarea placeholder="How can we help?"></textarea>

      <button type="submit">Submit Message</button>
    </form>

  </div>
</section>
<style>
    .contact-section {
  padding: 80px 20px;
  background: #f7f9fc;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  align-items: center;
}

.contact-info h2 {
  font-size: 34px;
  margin-bottom: 15px;
}

.contact-info p {
  font-size: 16px;
  color: #555;
  margin-bottom: 25px;
}

.support-box {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.support-box i {
  font-size: 32px;
  color: #007bff;
}

.contact-form {
  background: #fff;
  padding: 35px;
  border-radius: 18px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.contact-form h3 {
  margin-bottom: 20px;
  font-size: 24px;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.contact-form textarea {
  height: 110px;
  resize: none;
}

.contact-form button {
  width: 100%;
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: #fff;
  border: none;
  padding: 14px;
  font-size: 16px;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s;
}

.contact-form button:hover {
  background: linear-gradient(135deg, #0056b3, #0099cc);
}

</style>


@include('layouts.footer')

@endsection
