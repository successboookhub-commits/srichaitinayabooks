@extends('layouts.app')

@section('content')

<!-- =========================================================
     PUBLICATIONS PAGE
========================================================= -->

<div class="publication-page">

    <div class="shop-layout">

        <!-- =================================================
             PUBLICATION SIDEBAR
        ================================================== -->

        <aside class="shop-sidebar">

            <!-- DESKTOP HEADER -->
            <div class="publication-sidebar-header">

                <div class="publication-icon">
                    <i class="fa fa-book"></i>
                </div>

                <div>
                    <h3>Publications</h3>
                    <span>Select your publication</span>
                </div>

            </div>


            <!-- MOBILE FILTER BUTTON -->
            <div class="mobile-filter-toggle">

                <button
                    type="button"
                    id="filterToggleBtn"
                    aria-expanded="false"
                >

                    <span class="mobile-filter-left">

                        <i class="fa fa-book"></i>

                        <span>

                            @if(isset($publication))

                                {{ $publication->name }}

                            @else

                                All Publications

                            @endif

                        </span>

                    </span>


                    <i
                        class="fa fa-chevron-down filter-arrow"
                        id="filterArrow"
                    ></i>

                </button>

            </div>


            <!-- =================================================
                 PUBLICATION LIST
            ================================================== -->

            <div
                class="filter-list"
                id="filterList"
            >

                <!-- ALL PUBLICATIONS -->

                <a
                    href="{{ route('publications.index') }}"
                    class="filter-link
                    {{ request()->routeIs('publications.index') ? 'active' : '' }}"
                >

                    <span class="filter-link-icon">
                        <i class="fa fa-th-large"></i>
                    </span>

                    <span class="filter-link-text">
                        All Publications
                    </span>


                    @if(request()->routeIs('publications.index'))

                        <span class="filter-check">
                            <i class="fa fa-check"></i>
                        </span>

                    @endif

                </a>


                <!-- =================================================
                     PUBLICATIONS
                ================================================== -->

                @foreach($publications as $pub)

                    <a
                        href="{{ route('publications.show', $pub->id) }}"
                        class="filter-link
                        {{ isset($publication) && $publication->id == $pub->id ? 'active' : '' }}"
                    >

                        <span class="filter-link-icon">
                            <i class="fa fa-book"></i>
                        </span>

                        <span class="filter-link-text">
                            {{ $pub->name }}
                        </span>


                        @if(
                            isset($publication)
                            &&
                            $publication->id == $pub->id
                        )

                            <span class="filter-check">
                                <i class="fa fa-check"></i>
                            </span>

                        @endif

                    </a>

                @endforeach

            </div>

        </aside>


        <!-- =================================================
             PRODUCTS SECTION
        ================================================== -->

        <section class="shop-products">


            <!-- =================================================
                 PUBLICATION HEADING
            ================================================== -->

            @if(isset($publication))

                <div class="publication-heading">

                    <div>

                        <h2>
                            {{ $publication->name }}
                        </h2>

                        <p>
                            Books & Study Materials
                        </p>

                    </div>

                    <span>
                        {{ $products->count() }} Books
                    </span>

                </div>

            @else

                <div class="publication-heading">

                    <div>

                        <h2>
                            All Publications
                        </h2>

                        <p>
                            Explore our books and study materials
                        </p>

                    </div>

                    <span>
                        {{ $products->count() }} Books
                    </span>

                </div>

            @endif


            <!-- =================================================
                 PRODUCTS GRID
            ================================================== -->

            <div class="products-grid">

                @forelse($products as $product)

                    <!-- =================================================
                         PRODUCT CARD
                    ================================================== -->

                    <div class="product-card">


                        <!-- PRODUCT DETAILS LINK -->

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
                             BUTTONS
                        ================================================== -->

                        <div class="card-actions">


                            <!-- ADD TO CART -->

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
                         NO PRODUCTS
                    ================================================== -->

                    <div class="no-products">

                        <div class="no-products-icon">

                            <i class="fa fa-book-open"></i>

                        </div>

                        <h3>
                            No Books Found
                        </h3>

                        <p>
                            No books are available in this publication.
                        </p>

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

    overflow-x: hidden !important;

}


.publication-page {

    width: 100%;

    max-width: 100%;

    overflow-x: hidden;

}


.publication-page *,
.publication-page *::before,
.publication-page *::after {

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

    display: flex;

    align-items: flex-start;

    gap: 25px;

}


/* =========================================================
   SIDEBAR
========================================================= */

.shop-sidebar {

    width: 240px;

    flex: 0 0 240px;

    background: #fff;

    border-radius: 16px;

    padding: 18px;

    box-shadow:
        0 8px 25px rgba(0,0,0,.08);

    position: sticky;

    top: 100px;

    height: fit-content;

}


/* =========================================================
   SIDEBAR HEADER
========================================================= */

.publication-sidebar-header {

    display: flex;

    align-items: center;

    gap: 12px;

    padding-bottom: 16px;

    margin-bottom: 10px;

    border-bottom: 1px solid #eeeeee;

}


.publication-icon {

    width: 42px;

    height: 42px;

    flex-shrink: 0;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 10px;

    background: #fff0f1;

    color: #d72c35;

    font-size: 18px;

}


.publication-sidebar-header h3 {

    margin: 0;

    font-size: 18px;

    font-weight: 700;

    color: #222;

}


.publication-sidebar-header span {

    display: block;

    margin-top: 3px;

    font-size: 11px;

    color: #999;

}


/* =========================================================
   FILTER LIST
========================================================= */

.filter-list {

    width: 100%;

    display: flex;

    flex-direction: column;

    gap: 5px;

}


/* =========================================================
   FILTER LINK
========================================================= */

.filter-link {

    width: 100%;

    min-height: 44px;

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 9px 10px;

    border-radius: 10px;

    color: #333;

    background: transparent;

    text-decoration: none;

    font-size: 13px;

    font-weight: 500;

    transition: all .25s ease;

}


.filter-link:hover {

    background: #fff0f1;

    color: #d72c35;

}


.filter-link.active {

    background: #d72c35;

    color: #fff;

    box-shadow:
        0 4px 12px rgba(215,44,53,.20);

}


/* =========================================================
   FILTER ICON
========================================================= */

.filter-link-icon {

    width: 30px;

    height: 30px;

    flex-shrink: 0;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 8px;

    background: #f5f5f5;

    color: #777;

    font-size: 12px;

}


.filter-link:hover .filter-link-icon {

    background: #d72c35;

    color: #fff;

}


.filter-link.active .filter-link-icon {

    background: rgba(255,255,255,.18);

    color: #fff;

}


/* =========================================================
   FILTER TEXT
========================================================= */

.filter-link-text {

    flex: 1;

    min-width: 0;

    line-height: 1.3;

    word-break: break-word;

}


/* =========================================================
   ACTIVE CHECK
========================================================= */

.filter-check {

    width: 22px;

    height: 22px;

    flex-shrink: 0;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 50%;

    background: rgba(255,255,255,.18);

    font-size: 10px;

}


/* =========================================================
   MOBILE FILTER BUTTON
========================================================= */

.mobile-filter-toggle {

    display: none;

}


.mobile-filter-toggle button {

    width: 100%;

    min-height: 46px;

    padding: 10px 13px;

    border: none;

    border-radius: 11px;

    background: #d72c35;

    color: #fff;

    cursor: pointer;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 8px;

    font-size: 13px;

    font-weight: 600;

}


.mobile-filter-left {

    min-width: 0;

    display: flex;

    align-items: center;

    gap: 9px;

}


.mobile-filter-left > span {

    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;

}


.mobile-filter-left i {

    flex-shrink: 0;

}


.filter-arrow {

    flex-shrink: 0;

    transition: transform .25s ease;

}


.mobile-filter-toggle button.open
.filter-arrow {

    transform: rotate(180deg);

}


/* =========================================================
   PRODUCTS SECTION
========================================================= */

.shop-products {

    width: 100%;

    min-width: 0;

    flex: 1;

}


/* =========================================================
   PUBLICATION HEADING
========================================================= */

.publication-heading {

    width: 100%;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;

    margin-bottom: 18px;

}


.publication-heading h2 {

    margin: 0;

    font-size: 22px;

    line-height: 1.2;

    font-weight: 700;

    color: #222;

}


.publication-heading p {

    margin: 5px 0 0;

    color: #888;

    font-size: 13px;

}


.publication-heading > span {

    flex-shrink: 0;

    background: #f5f5f5;

    color: #777;

    padding: 6px 12px;

    border-radius: 20px;

    font-size: 12px;

}


/* =========================================================
   PRODUCT GRID
========================================================= */

.products-grid {

    width: 100%;

    min-width: 0;

    display: grid;

    grid-template-columns:
        repeat(auto-fill, minmax(220px, 1fr));

    gap: 20px;

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
        0 7px 25px rgba(0,0,0,.07);

    display: flex;

    flex-direction: column;

    overflow: hidden;

    transition:
        transform .25s ease,
        box-shadow .25s ease;

}


.product-card:hover {

    transform: translateY(-5px);

    box-shadow:
        0 12px 30px rgba(0,0,0,.12);

}


/* =========================================================
   PRODUCT LINK
========================================================= */

.product-link {

    width: 100%;

    min-width: 0;

    display: block;

    color: inherit;

    text-decoration: none;

}


/* =========================================================
   PRODUCT IMAGE
========================================================= */

.product-image-box {

    width: 100%;

    height: 240px;

    display: flex;

    align-items: center;

    justify-content: center;

    background: #fff;

    border-radius: 12px;

    overflow: hidden;

    margin-bottom: 10px;

}


.product-card img {

    display: block;

    width: 100%;

    height: 100%;

    object-fit: contain;

}


/* =========================================================
   PRODUCT TITLE
========================================================= */

.product-title {

    width: 100%;

    margin: 4px 0;

    color: #111;

    font-size: 14px;

    line-height: 1.35;

    font-weight: 600;

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

    top: 10px;

    left: 10px;

    z-index: 5;

    background: #e63946;

    color: #fff;

    padding: 4px 8px;

    border-radius: 20px;

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

    color: #d72c35;

    font-size: 17px;

    font-weight: 700;

    white-space: nowrap;

}


.price .old {

    color: #999;

    font-size: 12px;

    text-decoration: line-through;

    white-space: nowrap;

}


/* =========================================================
   ACTION BUTTONS
========================================================= */

.card-actions {

    width: 100%;

    display: flex;

    gap: 7px;

    margin-top: 11px;

}


.add-cart,
.buy-now {

    flex: 1;

    min-width: 0;

    height: 40px;

    padding: 0 6px;

    border: none;

    border-radius: 22px;

    color: #fff;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 4px;

    font-size: 12px;

    font-weight: 600;

    white-space: nowrap;

    cursor: pointer;

    transition: all .25s ease;

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
   NO PRODUCTS
========================================================= */

.no-products {

    grid-column: 1 / -1;

    width: 100%;

    text-align: center;

    padding: 70px 20px;

    color: #777;

}


.no-products-icon {

    width: 70px;

    height: 70px;

    margin: 0 auto 15px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 50%;

    background: #fff0f1;

    color: #d72c35;

    font-size: 30px;

}


.no-products h3 {

    margin: 0 0 8px;

    color: #333;

}


.no-products p {

    margin: 0;

    font-size: 14px;

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 992px) {

    .shop-layout {

        gap: 18px;

        padding: 15px;

    }


    .shop-sidebar {

        width: 210px;

        flex-basis: 210px;

        padding: 14px;

    }


    .publication-sidebar-header h3 {

        font-size: 16px;

    }


    .filter-link {

        font-size: 12px;

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


    .publication-page {

        width: 100% !important;

        max-width: 100% !important;

        overflow-x: hidden !important;

    }


    /* =====================================================
       MAIN LAYOUT
    ===================================================== */

    .shop-layout {

        width: 100% !important;

        max-width: 100% !important;

        display: block;

        margin: 0;

        padding: 10px;

        overflow: hidden;

    }


    /* =====================================================
       SIDEBAR
    ===================================================== */

    .shop-sidebar {

        width: 100% !important;

        max-width: 100% !important;

        flex: none;

        padding: 0;

        margin: 0 0 12px;

        background: transparent;

        border-radius: 0;

        box-shadow: none;

        position: static;
                margin-top: 73px;

    }


    /* Hide desktop header */

    .publication-sidebar-header {

        display: none;

    }


    /* =====================================================
       MOBILE PUBLICATION BUTTON
    ===================================================== */

    .mobile-filter-toggle {

        display: block;

        width: 100%;

    }


    .mobile-filter-toggle button {

        width: 100%;

        min-height: 46px;

    }


    /* =====================================================
       FILTER LIST
    ===================================================== */

    .filter-list {

        display: none;

        width: 100%;

        max-height: 300px;

        margin-top: 8px;

        padding: 8px;

        background: #fff;

        border: 1px solid #eee;

        border-radius: 12px;

        box-shadow:
            0 7px 20px rgba(0,0,0,.10);

        overflow-y: auto;

        overflow-x: hidden;

    }


    .filter-list.active {

        display: flex;

        flex-direction: column;

    }


    .filter-link {

        width: 100%;

        min-height: 43px;

        padding: 8px 10px;

        border-radius: 9px;

        font-size: 12px;

    }


    .filter-link-icon {

        width: 28px;

        height: 28px;

        font-size: 11px;

    }


    .filter-check {

        width: 20px;

        height: 20px;

    }


    /* =====================================================
       PRODUCTS
    ===================================================== */

    .shop-products {

        width: 100% !important;

        max-width: 100% !important;

        min-width: 0 !important;

    }


    /* =====================================================
       HEADING
    ===================================================== */

    .publication-heading {

        width: 100%;

        margin-bottom: 12px;

        padding: 0 2px;

    }


    .publication-heading h2 {

        font-size: 17px;

    }


    .publication-heading p {

        font-size: 10px;

        margin-top: 3px;

    }


    .publication-heading > span {

        font-size: 10px;

        padding: 5px 9px;

    }


    /* =====================================================
       EXACTLY 2 COLUMNS
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
       PRODUCT CARD
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
       PRODUCT IMAGE
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

        top: 7px;

        left: 7px;

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
       ADD CART + BUY NOW
       SIDE BY SIDE
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
       PUBLICATION FILTER
    ===================================================== */

    const toggleBtn =
        document.getElementById("filterToggleBtn");

    const filterList =
        document.getElementById("filterList");


    if (toggleBtn && filterList) {

        toggleBtn.addEventListener(
            "click",
            function () {

                const isOpen =
                    filterList.classList.toggle("active");


                toggleBtn.classList.toggle(
                    "open",
                    isOpen
                );


                toggleBtn.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

            }
        );


        /* Close after selecting publication */

        document
            .querySelectorAll(".filter-link")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        filterList.classList.remove(
                            "active"
                        );

                        toggleBtn.classList.remove(
                            "open"
                        );

                        toggleBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            });


        /* Close when clicking outside */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    window.innerWidth <= 768 &&
                    !toggleBtn.contains(event.target) &&
                    !filterList.contains(event.target)
                ) {

                    filterList.classList.remove(
                        "active"
                    );

                    toggleBtn.classList.remove(
                        "open"
                    );

                    toggleBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }



    /* =====================================================
       ADD TO CART / BUY NOW
    ===================================================== */

    function addToCart(button, redirectToCart) {


        if (button.disabled) {

            return;

        }


        const productId =
            button.dataset.id;


        const originalHtml =
            button.innerHTML;


        /* Disable */

        button.disabled = true;


        /* Loading */

        if (redirectToCart) {

            button.innerHTML =
                '<i class="fa fa-spinner fa-spin"></i> <span>Wait...</span>';

        } else {

            button.innerHTML =
                '<i class="fa fa-spinner fa-spin"></i> <span>Adding...</span>';

        }


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
                    "Cart request failed"
                );

            }

            return response.json();

        })


        .then(function (data) {


            /* =================================================
               SUCCESS
            ================================================= */

            if (data.success) {


                /* Update cart count */

                document
                    .querySelectorAll(".cart-count")
                    .forEach(function (item) {

                        item.innerText =
                            data.count;

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

                button.classList.add("added");

                button.innerHTML =
                    '<i class="fa fa-check"></i> <span>Added</span>';


                setTimeout(function () {

                    button.disabled = false;

                    button.classList.remove(
                        "added"
                    );

                    button.innerHTML =
                        originalHtml;

                }, 1500);


            } else {


                /* Failed */

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
       ADD TO CART
    ===================================================== */

    document
        .querySelectorAll(".add-cart")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    addToCart(
                        this,
                        false
                    );

                }
            );

        });



    /* =====================================================
       BUY NOW
    ===================================================== */

    document
        .querySelectorAll(".buy-now")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    addToCart(
                        this,
                        true
                    );

                }
            );

        });

});

</script>



<!-- =========================================================
     MOBILE VIEWPORT
========================================================= -->

<script>

(function () {

    var viewport =
        document.querySelector(
            'meta[name="viewport"]'
        );


    if (!viewport) {

        viewport =
            document.createElement(
                'meta'
            );

        viewport.name =
            'viewport';

        document.head.appendChild(
            viewport
        );

    }


    viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0'
    );

})();

</script>

@endsection