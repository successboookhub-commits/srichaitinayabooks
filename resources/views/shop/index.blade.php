@extends('layouts.app')

@section('content')

{{-- =========================================================
     SHOP PAGE
========================================================= --}}

<div class="shop-page">

    <div class="shop-layout">

        <!-- =================================================
             PRODUCTS SECTION
        ================================================== -->
        <section class="shop-products">

            <!-- =================================================
                 SEARCH BAR
            ================================================== -->
            <div class="shop-search">

                <form method="GET" action="{{ route('shop.search') }}">

                    <input
                        type="text"
                        name="q"
                        value="{{ request('q') }}"
                        placeholder="Search books..."
                        autocomplete="off"
                    >

                    <button type="submit">
                        <i class="fa fa-search"></i>
                    </button>

                </form>

            </div>


            <!-- =================================================
                 SEARCH RESULT TITLE
            ================================================== -->
            @if(request('q'))

                <h3 class="search-title">

                    Search Results for:
                    "{{ request('q') }}"

                    <span class="search-count">
                        ({{ $products->count() }} found)
                    </span>

                </h3>

            @endif


            <!-- =================================================
                 CATEGORY HORIZONTAL SCROLL
            ================================================== -->

            <div class="mobile-category-scroll">

                <!-- ALL -->
                <a
                    href="{{ url('/shop') }}"
                    class="filter-link {{ !request('category') ? 'active' : '' }}"
                >
                    All
                </a>


                <!-- CATEGORIES -->
                @if(isset($categories) && $categories->count())

                    @foreach($categories as $category)

                        <a
                            href="{{ url('/shop') }}?category={{ $category->id }}"
                            class="filter-link {{ request('category') == $category->id ? 'active' : '' }}"
                        >
                            {{ $category->name }}
                        </a>

                    @endforeach

                @endif

            </div>


            <!-- =================================================
                 PRODUCTS GRID
            ================================================== -->

            <div class="products-grid">

                @forelse($products as $product)

                    <!-- =================================================
                         PRODUCT CARD
                    ================================================== -->

                    <div class="product-card">

                        <!-- PRODUCT LINK -->
                        <a
                            href="{{ route('product.show', $product->slug) }}"
                            class="product-link"
                        >

                            <!-- DISCOUNT -->
                            @if($product->discount)

                                <span class="discount">
                                    {{ (int)$product->discount }}% OFF
                                </span>

                            @endif


                            <!-- PRODUCT IMAGE -->
                            <div class="product-image-box">

                                <img
                                    src="{{ asset('storage/'.$product->main_photo) }}"
                                    alt="{{ $product->name }}"
                                    loading="lazy"
                                >

                            </div>


                            <!-- PRODUCT NAME -->
                            <h4 class="product-title">

                                {{ Str::limit($product->name, 45) }}

                            </h4>


                            <!-- PRICE -->
                            <div class="price">

                                <span class="new">
                                    ₹{{ number_format($product->total_price, 2) }}
                                </span>


                                @if($product->old_price)

                                    <span class="old">
                                        ₹{{ number_format($product->old_price, 2) }}
                                    </span>

                                @endif

                            </div>

                        </a>


                        <!-- =================================================
                             ACTION BUTTONS
                        ================================================== -->

                        <div class="card-actions">

                            <!-- ADD CART -->
                            <button
                                type="button"
                                class="add-cart"
                                data-id="{{ $product->id }}"
                            >

                                <i class="fa fa-cart-plus"></i>

                                <span>
                                    Add Cart
                                </span>

                            </button>


                            <!-- BUY NOW -->
                            <button
                                type="button"
                                class="buy-now"
                                data-id="{{ $product->id }}"
                            >

                                <i class="fa fa-bolt"></i>

                                <span>
                                    Buy Now
                                </span>

                            </button>

                        </div>

                    </div>

                @empty

                    <!-- =================================================
                         NO RESULTS
                    ================================================== -->

                    <div class="no-results">

                        <i class="fa fa-book-open"></i>

                        @if(request('q'))

                            <p>
                                No books found for
                                <strong>
                                    "{{ request('q') }}"
                                </strong>
                            </p>

                            <small>
                                Try a shorter or different keyword.
                            </small>

                        @else

                            <p>
                                No products found.
                            </p>

                        @endif

                    </div>

                @endforelse

            </div>

        </section>

    </div>

</div>


<!-- =========================================================
     CSS
========================================================= -->

<style>

/* =========================================================
   GLOBAL
========================================================= */

html,
body {

    width: 100%;
    max-width: 100%;

}

body {

    overflow-x: hidden !important;

}


.shop-page {

    width: 100%;
    max-width: 100%;

    overflow-x: hidden;

}


.shop-page *,
.shop-page *::before,
.shop-page *::after {

    box-sizing: border-box;

}


/* =========================================================
   MAIN LAYOUT
========================================================= */

.shop-layout {

    width: 100%;
    max-width: 1400px;

    margin: 0 auto;

    padding: 20px;

}


.shop-products {

    width: 100%;
    max-width: 100%;

    min-width: 0;

}


/* =========================================================
   SEARCH
========================================================= */

.shop-search {

    width: 100%;

    display: flex;

    justify-content: flex-end;

    margin-bottom: 18px;

}


.shop-search form {

    width: 100%;
    max-width: 380px;

    display: flex;

    gap: 8px;

}


.shop-search input {

    width: 100%;
    min-width: 0;

    height: 44px;

    padding: 10px 14px;

    border: 1px solid #ddd;

    border-radius: 10px;

    outline: none;

    background: #fff;

    font-size: 14px;

}


.shop-search input:focus {

    border-color: #d72c35;

    box-shadow:
        0 0 0 3px rgba(215,44,53,.10);

}


.shop-search button {

    width: 46px;
    height: 44px;

    flex-shrink: 0;

    border: none;

    border-radius: 10px;

    background: #d72c35;

    color: #fff;

    cursor: pointer;

    font-size: 16px;

}


.shop-search button:hover {

    background: #b8232b;

}


/* =========================================================
   SEARCH TITLE
========================================================= */

.search-title {

    margin: 10px 0 15px;

    font-size: 18px;

    font-weight: 600;

    color: #222;

}


.search-count {

    color: #888;

    font-size: 13px;

    font-weight: 400;

}


/* =========================================================
   CATEGORY SCROLL
========================================================= */

.mobile-category-scroll {

    width: 100%;
    max-width: 100%;

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 5px 2px 14px;

    overflow-x: auto;

    overflow-y: hidden;

    white-space: nowrap;

    scrollbar-width: none;

    -webkit-overflow-scrolling: touch;

}


.mobile-category-scroll::-webkit-scrollbar {

    display: none;

}


/* =========================================================
   CATEGORY BUTTON
========================================================= */

.filter-link {

    flex: 0 0 auto;

    display: inline-flex;

    align-items: center;

    justify-content: center;

    min-height: 38px;

    padding: 8px 17px;

    border-radius: 22px;

    background: #f5f5f5;

    border: 1px solid #eeeeee;

    color: #333;

    text-decoration: none;

    font-size: 13px;

    font-weight: 500;

    white-space: nowrap;

    transition: .25s ease;

}


.filter-link:hover {

    background: #d72c35;

    border-color: #d72c35;

    color: #fff;

}


.filter-link.active {

    background: #d72c35;

    border-color: #d72c35;

    color: #fff;

}


/* =========================================================
   PRODUCT GRID
========================================================= */

.products-grid {

    width: 100%;
    max-width: 100%;

    min-width: 0;

    display: grid;

    grid-template-columns:
        repeat(auto-fill, minmax(220px, 1fr));

    gap: 20px;

    align-items: stretch;

}


/* =========================================================
   PRODUCT CARD
========================================================= */

.product-card {

    position: relative;

    width: 100%;
    min-width: 0;

    background: #fff;

    border-radius: 16px;

    padding: 12px;

    box-shadow:
        0 5px 20px rgba(0,0,0,.07);

    display: flex;

    flex-direction: column;

    overflow: hidden;

    transition:
        transform .25s ease,
        box-shadow .25s ease;

}


.product-card:hover {

    transform: translateY(-4px);

    box-shadow:
        0 10px 28px rgba(0,0,0,.12);

}


/* =========================================================
   PRODUCT LINK
========================================================= */

.product-link {

    display: block;

    width: 100%;

    min-width: 0;

    color: inherit;

    text-decoration: none;

}


/* =========================================================
   IMAGE BOX
========================================================= */

.product-image-box {

    width: 100%;

    height: 240px;

    display: flex;

    align-items: center;

    justify-content: center;

    background: #fff;

    overflow: hidden;

    border-radius: 12px;

    margin-bottom: 10px;

}


.product-card img {

    width: 100%;

    height: 100%;

    display: block;

    object-fit: contain;

}


/* =========================================================
   PRODUCT TITLE
========================================================= */

.product-title {

    width: 100%;

    margin: 5px 0;

    font-size: 14px;

    line-height: 1.35;

    font-weight: 600;

    color: #111;

    min-height: 38px;

    display: -webkit-box;

    -webkit-line-clamp: 2;

    -webkit-box-orient: vertical;

    overflow: hidden;

    word-break: break-word;

}


/* =========================================================
   DISCOUNT
========================================================= */

.discount {

    position: absolute;

    top: 12px;

    left: 12px;

    z-index: 5;

    background: #e63946;

    color: #fff;

    padding: 4px 8px;

    border-radius: 15px;

    font-size: 10px;

    font-weight: 700;

    white-space: nowrap;

}


/* =========================================================
   PRICE
========================================================= */

.price {

    width: 100%;

    display: flex;

    align-items: center;

    gap: 6px;

    margin-top: 5px;

    overflow: hidden;

}


.price .new {

    font-size: 17px;

    font-weight: 700;

    color: #d72c35;

    white-space: nowrap;

}


.price .old {

    font-size: 12px;

    color: #999;

    text-decoration: line-through;

    white-space: nowrap;

}


/* =========================================================
   BUTTONS
========================================================= */

.card-actions {

    width: 100%;

    display: flex;

    gap: 7px;

    margin-top: 12px;

}


.add-cart,
.buy-now {

    flex: 1;

    min-width: 0;

    height: 40px;

    padding: 0 7px;

    border: none;

    border-radius: 22px;

    color: #fff;

    cursor: pointer;

    font-size: 12px;

    font-weight: 600;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 4px;

    white-space: nowrap;

    transition: .25s ease;

}


.add-cart {

    background: #2ecc71;

}


.add-cart:hover {

    background: #27ae60;

}


.add-cart.added {

    background: #3498db;

}


.buy-now {

    background: #ff9800;

}


.buy-now:hover {

    background: #e68900;

}


.add-cart:disabled,
.buy-now:disabled {

    opacity: .75;

    cursor: not-allowed;

}


/* =========================================================
   NO RESULTS
========================================================= */

.no-results {

    grid-column: 1 / -1;

    text-align: center;

    padding: 60px 20px;

    color: #888;

}


.no-results i {

    display: block;

    font-size: 45px;

    color: #d72c35;

    margin-bottom: 15px;

}


.no-results p {

    margin: 5px 0;

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 992px) {

    .shop-layout {

        padding: 15px;

    }


    .products-grid {

        grid-template-columns:
            repeat(3, minmax(0, 1fr));

        gap: 14px;

    }


    .product-image-box {

        height: 210px;

    }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 768px) {

    html,
    body {

        width: 100% !important;

        max-width: 100% !important;

        overflow-x: hidden !important;

    }


    .shop-page {

        width: 100% !important;

        max-width: 100% !important;

        overflow-x: hidden !important;

    }


    .shop-layout {

        width: 100% !important;

        max-width: 100% !important;

        margin: 0;

        padding: 10px;

        overflow: hidden;

    }


    .shop-products {

        width: 100%;

        max-width: 100%;

        min-width: 0;

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    .shop-search {

        width: 100%;

        margin-bottom: 10px;

        justify-content: stretch;

    }


    .shop-search form {

        width: 100%;

        max-width: 100%;

    }


    .shop-search input {

        min-width: 0;

        height: 42px;

        font-size: 13px;

    }


    .shop-search button {

        width: 42px;

        height: 42px;

    }


    /* =====================================================
       CATEGORY SCROLL
    ===================================================== */

    .mobile-category-scroll {

        width: 100%;

        max-width: 100%;

        display: flex;

        flex-wrap: nowrap;

        gap: 8px;

        padding: 5px 2px 12px;

        margin-bottom: 8px;

        overflow-x: auto;

        overflow-y: hidden;

        scrollbar-width: none;

    }


    .mobile-category-scroll::-webkit-scrollbar {

        display: none;

    }


    .filter-link {

        flex: 0 0 auto;

        min-height: 36px;

        padding: 7px 15px;

        font-size: 12px;

    }


    /* =====================================================
       EXACTLY 2 CARDS
    ===================================================== */

    .products-grid {

        width: 100% !important;

        max-width: 100% !important;

        min-width: 0 !important;

        display: grid !important;

        grid-template-columns:
            repeat(2, minmax(0, 1fr)) !important;

        gap: 10px !important;

        overflow: visible;

    }


    /* =====================================================
       MOBILE CARD
    ===================================================== */

    .product-card {

        width: 100% !important;

        max-width: 100% !important;

        min-width: 0 !important;

        padding: 8px;

        border-radius: 12px;

        overflow: hidden;

    }


    /* =====================================================
       MOBILE IMAGE
    ===================================================== */

    .product-image-box {

        width: 100%;

        height: 145px;

        margin-bottom: 7px;

        border-radius: 9px;

    }


    .product-card img {

        width: 100%;

        height: 100%;

        object-fit: contain;

    }


    /* =====================================================
       DISCOUNT
    ===================================================== */

    .discount {

        top: 8px;

        left: 8px;

        padding: 3px 6px;

        font-size: 8px;

        border-radius: 12px;

    }


    /* =====================================================
       TITLE
    ===================================================== */

    .product-title {

        font-size: 11px;

        line-height: 1.3;

        min-height: 29px;

        margin: 4px 0;

        -webkit-line-clamp: 2;

    }


    /* =====================================================
       PRICE
    ===================================================== */

    .price {

        margin-top: 4px;

        gap: 4px;

        flex-wrap: nowrap;

    }


    .price .new {

        font-size: 14px;

    }


    .price .old {

        font-size: 9px;

    }


    /* =====================================================
       BUTTONS SIDE BY SIDE
    ===================================================== */

    .card-actions {

        width: 100%;

        display: flex;

        flex-direction: row;

        gap: 5px;

        margin-top: 8px;

    }


    .add-cart,
    .buy-now {

        width: 50%;

        flex: 1;

        min-width: 0;

        height: 34px;

        padding: 0 3px;

        border-radius: 18px;

        font-size: 9px;

        gap: 2px;

    }


    .add-cart i,
    .buy-now i {

        font-size: 9px;

    }


    /* =====================================================
       SEARCH TITLE
    ===================================================== */

    .search-title {

        font-size: 15px;

        margin: 8px 0 10px;

    }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 380px) {

    .shop-layout {

        padding: 7px;

    }


    .products-grid {

        gap: 8px !important;

    }


    .product-card {

        padding: 6px;

        border-radius: 10px;

    }


    .product-image-box {

        height: 120px;

    }


    .product-title {

        font-size: 10px;

        min-height: 27px;

    }


    .price .new {

        font-size: 13px;

    }


    .price .old {

        font-size: 8px;

    }


    .add-cart,
    .buy-now {

        height: 31px;

        font-size: 8px;

    }

}


/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 330px) {

    .product-image-box {

        height: 105px;

    }


    .add-cart span,
    .buy-now span {

        display: none;

    }


    .add-cart,
    .buy-now {

        width: 50%;

        font-size: 11px;

    }

}

</style>


<!-- =========================================================
     JAVASCRIPT
========================================================= -->

<script>

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ADD TO CART / BUY NOW
    ===================================================== */

    function addToCart(button, redirectToCart) {

        if (button.disabled) {

            return;

        }


        let productId = button.dataset.id;

        let originalHtml = button.innerHTML;


        /* Disable */

        button.disabled = true;


        /* Loading */

        button.innerHTML = redirectToCart

            ? '<i class="fa fa-spinner fa-spin"></i> <span>Please wait...</span>'

            : '<i class="fa fa-spinner fa-spin"></i> <span>Adding...</span>';


        /* =================================================
           AJAX
        ================================================= */

        fetch("{{ route('cart.add') }}", {

            method: "POST",

            headers: {

                "X-CSRF-TOKEN":
                    "{{ csrf_token() }}",

                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json"

            },

            body: JSON.stringify({

                product_id: productId,

                quantity: 1

            })

        })


        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Network response was not OK"
                );

            }

            return response.json();

        })


        .then(function (data) {


            /* =================================================
               SUCCESS
            ================================================= */

            if (data.success) {


                /* UPDATE CART COUNT */

                document
                    .querySelectorAll('.cart-count')
                    .forEach(function (item) {

                        item.innerText = data.count;

                    });


                /* =================================================
                   BUY NOW
                ================================================= */

                if (redirectToCart) {

                    window.location.href =
                        "{{ route('cart.index') }}";

                    return;

                }


                /* =================================================
                   ADD CART SUCCESS
                ================================================= */

                button.classList.add('added');

                button.innerHTML =
                    '<i class="fa fa-check"></i> <span>Added</span>';


                setTimeout(function () {

                    button.disabled = false;

                    button.classList.remove('added');

                    button.innerHTML =
                        originalHtml;

                }, 1500);


            } else {


                /* FAILURE */

                button.disabled = false;

                button.innerHTML =
                    originalHtml;

            }

        })


        .catch(function (error) {

            console.error(
                "Cart Error:",
                error
            );

            button.disabled = false;

            button.innerHTML =
                originalHtml;

        });

    }


    /* =====================================================
       ADD CART BUTTONS
    ===================================================== */

    document
        .querySelectorAll('.add-cart')
        .forEach(function (button) {

            button.addEventListener(
                'click',
                function () {

                    addToCart(
                        this,
                        false
                    );

                }
            );

        });


    /* =====================================================
       BUY NOW BUTTONS
    ===================================================== */

    document
        .querySelectorAll('.buy-now')
        .forEach(function (button) {

            button.addEventListener(
                'click',
                function () {

                    addToCart(
                        this,
                        true
                    );

                }
            );

        });


    /* =====================================================
       CATEGORY SCROLL
       Only category bar moves horizontally.
    ===================================================== */

    const categoryScroll =
        document.querySelector(
            '.mobile-category-scroll'
        );


    if (categoryScroll) {

        categoryScroll.addEventListener(
            'wheel',
            function (event) {

                if (window.innerWidth <= 768) {

                    if (
                        Math.abs(event.deltaY) >
                        Math.abs(event.deltaX)
                    ) {

                        event.preventDefault();

                        categoryScroll.scrollLeft +=
                            event.deltaY;

                    }

                }

            },
            {
                passive: false
            }
        );

    }

});

</script>


@endsection