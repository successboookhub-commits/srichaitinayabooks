ku ala books ala proper gaa ravali gani <style>

:root{
  --primary:#d72c35;
  --primary-dark:#b8232b;
  --primary-light:#fff5f5;
  --dark:#111827;
  --gray-600:#4b5563;
  --gray-200:#e5e7eb;
  --gray-100:#f3f4f6;
  --gray-50:#f9fafb;
  --light:#f5f5f5;
  --radius:12px;
  --header-desktop-h: 70px;
  --header-tablet-h: 56px;
  --header-mobile-h: 56px;
  --bottom-nav-h: 58px;
}

*{box-sizing:border-box}

body{
  font-family:'Poppins',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
  margin:0;
  background:#fff;
  color:#1f2937;
  -webkit-font-smoothing:antialiased;
}

a{text-decoration:none;color:inherit}

/* ================= DESKTOP NAV (> 1024px) ================= */

.desktop-nav{
  position:fixed !important;
  top:0 !important;
  left:0 !important;
  right:0 !important;
  width:100% !important;
  height:var(--header-desktop-h);
  background:#fff;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 24px;
  border-bottom:1px solid #eee;
  z-index:99999 !important;
  gap:16px;
  box-shadow:0 1px 4px rgba(0,0,0,.03);
  box-sizing:border-box !important;
}

.desktop-nav .logo{
  display:flex;
  align-items:center;
  flex-shrink:0;
}

.desktop-nav .logo img{
  height:44px;
  width:auto;
  object-fit:contain;
}

.desktop-nav .menu{
  display:flex;
  align-items:center;
  gap:22px;
  flex-shrink:0;
}

.desktop-nav .menu a{
  font-size:14px;
  font-weight:500;
  color:#374151;
  padding:6px 2px;
  position:relative;
  transition:color .2s ease;
}

.desktop-nav .menu a:hover{
  color:var(--primary);
}

.desktop-nav .menu a.active{
  color:var(--primary);
  font-weight:600;
}

.desktop-nav .menu a.active::after{
  content:'';
  position:absolute;
  bottom:-4px;
  left:0;
  right:0;
  height:2.5px;
  background:var(--primary);
  border-radius:2px;
}

/* ================= SEARCH BOX (DESKTOP) ================= */

.desktop-nav .shop-search-wrap{
  position:relative;
  flex:1;
  max-width:320px;
}

.desktop-nav .shop-search-wrap form{
  display:flex;
  align-items:center;
  border:1.5px solid #e5e7eb;
  border-radius:30px;
  background:#fff;
  overflow:hidden;
  transition:border-color .2s, box-shadow .2s;
}

.desktop-nav .shop-search-wrap form:focus-within{
  border-color:var(--primary);
  box-shadow:0 0 0 3px rgba(215,44,53,.12);
}

.desktop-nav .shop-search-wrap input{
  border:none;
  padding:8px 14px;
  width:100%;
  outline:none;
  font-size:13.5px;
  background:transparent;
  color:#111;
}

.desktop-nav .shop-search-wrap input::placeholder{
  color:#9ca3af;
}

.desktop-nav .shop-search-wrap button{
  border:none;
  background:var(--primary);
  color:#fff;
  padding:8px 14px;
  cursor:pointer;
  flex-shrink:0;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:background .2s;
}

.desktop-nav .shop-search-wrap button:hover{
  background:var(--primary-dark);
}

/* Suggestions Dropdown */
.search-suggest{
  position:absolute;
  top:calc(100% + 8px);
  left:0;
  right:0;
  background:#fff;
  border-radius:12px;
  box-shadow:0 12px 30px rgba(0,0,0,.15);
  border:1px solid #eee;
  overflow:hidden;
  display:none;
  z-index:1100;
  max-height:400px;
  overflow-y:auto;
}

.search-suggest.show{display:block}

.search-suggest .suggest-item{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border-bottom:1px solid #f3f4f6;
  transition:background .15s;
}

.search-suggest .suggest-item:hover{
  background:#f9fafb;
}

.search-suggest .suggest-item img{
  width:38px;
  height:38px;
  object-fit:contain;
  border-radius:6px;
  background:#f5f5f5;
  flex-shrink:0;
}

.search-suggest .suggest-name{
  font-size:13px;
  font-weight:500;
  color:#1f2937;
  flex:1;
  line-height:1.3;
}

.search-suggest .suggest-price{
  font-size:13px;
  font-weight:700;
  color:var(--primary);
  white-space:nowrap;
}

.search-suggest .suggest-viewall{
  display:block;
  text-align:center;
  padding:11px;
  font-size:13px;
  font-weight:600;
  color:var(--primary);
  background:#fff7f7;
}

.search-suggest .suggest-viewall:hover{
  background:#ffeceb;
}

.search-suggest .suggest-empty{
  padding:14px;
  font-size:13px;
  color:#888;
  text-align:center;
}

/* ================= DESKTOP ICONS ================= */

.desktop-nav .icons{
  display:flex;
  gap:16px;
  font-size:17px;
  align-items:center;
  flex-shrink:0;
}

.desktop-nav .icons a,
.desktop-nav .icons span{
  color:#374151;
  transition:color .2s;
  cursor:pointer;
  display:flex;
  align-items:center;
}

.desktop-nav .icons a:hover,
.desktop-nav .icons span:hover{
  color:var(--primary);
}

.desktop-nav .cart-icon{
  position:relative;
  display:inline-flex;
  align-items:center;
  justify-content:center;
}

.desktop-nav .cart-count{
  position:absolute;
  top:-7px;
  right:-9px;
  background:var(--primary);
  color:#fff;
  font-size:10.5px;
  font-weight:700;
  padding:2px 5px;
  min-width:18px;
  height:18px;
  border-radius:9px;
  line-height:14px;
  text-align:center;
  box-shadow:0 1px 3px rgba(0,0,0,.2);
}

/* ================= MEDIUM DESKTOP / COMPACT (1025px - 1199px) ================= */

@media (min-width: 1025px) and (max-width: 1199px){
  .desktop-nav{
    padding:0 14px;
    gap:10px;
    height:var(--header-tablet-h);
  }
  .desktop-nav .logo img{
    height:36px;
  }
  .desktop-nav .menu{
    gap:14px;
  }
  .desktop-nav .menu a{
    font-size:13px;
  }
  .desktop-nav .shop-search-wrap{
    max-width:210px;
  }
  .desktop-nav .shop-search-wrap input{
    padding:6px 10px;
    font-size:12.5px;
  }
  .desktop-nav .icons{
    gap:12px;
    font-size:16px;
  }
}

/* ================= MOBILE & TABLET HEADER (<= 1024px) ================= */

.mobile-header{
  display:none;
  position:fixed !important;
  top:0 !important;
  left:0 !important;
  right:0 !important;
  width:100% !important;
  height:var(--header-mobile-h) !important; /* 56px */
  background:#ffffff !important;
  z-index:99999 !important;
  box-shadow:0 1px 4px rgba(0,0,0,.06) !important;
  border-bottom:1px solid #e5e7eb !important;
  box-sizing:border-box !important;
  padding:0 8px !important;
  align-items:center !important;
  justify-content:space-between !important;
  gap:8px !important;
}

.mobile-menu-btn{
  background:transparent !important;
  border:none !important;
  padding:0 !important;
  margin:0 !important;
  font-size:18px !important;
  color:#1f2937 !important;
  cursor:pointer !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  border-radius:8px !important;
  flex-shrink:0 !important;
  width:36px !important;
  height:36px !important;
  min-width:36px !important;
  transition:background .15s;
}

.mobile-menu-btn:active{
  background:#f3f4f6 !important;
}

.mobile-logo{
  display:flex !important;
  align-items:center !important;
  flex-shrink:0 !important;
  max-width:130px !important;
}

.mobile-logo img{
  height:28px !important;
  max-width:130px !important;
  width:auto !important;
  object-fit:contain !important;
  display:block !important;
}

.mobile-search-wrap{
  flex:1 !important;
  min-width:0 !important;
  position:relative !important;
}

.mobile-search-wrap form{
  border:1.5px solid #e5e7eb !important;
  background:#f3f4f6 !important;
  border-radius:20px !important;
  padding:0 10px !important;
  height:34px !important;
  display:flex !important;
  align-items:center !important;
  width:100% !important;
  min-width:0 !important;
  box-sizing:border-box !important;
  transition:border-color .15s, background .15s, box-shadow .15s !important;
}

.mobile-search-wrap form:focus-within{
  background:#ffffff !important;
  border-color:var(--primary) !important;
  box-shadow:0 0 0 3px rgba(215,44,53,.12) !important;
}

.mobile-search-wrap .search-icon{
  color:#9ca3af !important;
  font-size:12px !important;
  margin-right:6px !important;
  flex-shrink:0 !important;
}

.mobile-search-wrap input{
  font-size:12px !important;
  padding:0 !important;
  width:100% !important;
  min-width:0 !important;
  flex:1 !important;
  border:none !important;
  outline:none !important;
  background:transparent !important;
  color:#111827 !important;
}

.mobile-search-wrap input::placeholder{
  color:#9ca3af !important;
}

.mobile-search-wrap .search-suggest{
  position:absolute !important;
  top:calc(100% + 6px) !important;
  left:0 !important;
  right:0 !important;
  width:100% !important;
  max-height:60vh !important;
  box-shadow:0 10px 25px rgba(0,0,0,0.18) !important;
  border-radius:12px !important;
  z-index:999999 !important;
}

.mobile-cart-btn{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  width:36px !important;
  height:36px !important;
  min-width:36px !important;
  border-radius:50% !important;
  color:#1f2937 !important;
  position:relative !important;
  flex-shrink:0 !important;
  text-decoration:none !important;
  transition:background .15s;
  -webkit-tap-highlight-color:transparent;
}

.mobile-cart-btn:active{
  background:#f3f4f6 !important;
}

.mobile-cart-btn i{
  font-size:18px !important;
  color:#1f2937 !important;
}

.mobile-cart-btn .cart-count{
  position:absolute !important;
  top:-2px !important;
  right:-3px !important;
  background:var(--primary) !important;
  color:#fff !important;
  font-size:10px !important;
  font-weight:700 !important;
  padding:1px 5px !important;
  min-width:17px !important;
  height:17px !important;
  border-radius:9px !important;
  line-height:15px !important;
  text-align:center !important;
  box-shadow:0 1px 3px rgba(215,44,53,.35) !important;
  border:1.5px solid #fff !important;
  box-sizing:border-box !important;
}

@media (max-width: 360px){
  .mobile-logo{
    max-width:95px !important;
  }
  .mobile-logo img{
    height:24px !important;
  }
  .mobile-search-wrap form{
    height:32px !important;
    padding:0 8px !important;
  }
  .mobile-search-wrap input{
    font-size:11px !important;
  }
}

/* ================= SIDE MENU DRAWER ================= */

.side-menu-backdrop{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);
  backdrop-filter:blur(2px);
  z-index:9998;
  opacity:0;
  visibility:hidden;
  transition:opacity .25s ease, visibility .25s ease;
}

.side-menu-backdrop.show{
  opacity:1;
  visibility:visible;
}

.side-menu{
  position:fixed;
  top:0;
  left:0;
  width:290px;
  max-width:85vw;
  height:100%;
  background:#fff;
  box-shadow:4px 0 24px rgba(0,0,0,.18);
  transform:translateX(-100%);
  transition:transform .3s cubic-bezier(0.16,1,0.3,1);
  z-index:9999;
  display:flex;
  flex-direction:column;
  overflow-y:auto;
}

.side-menu.open{
  transform:translateX(0);
}

.side-menu .drawer-header{
  background:linear-gradient(135deg, var(--primary) 0%, #b8232b 100%);
  color:#fff;
  padding:16px 18px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.side-menu .drawer-title{
  font-size:15px;
  font-weight:700;
  letter-spacing:.3px;
  display:flex;
  align-items:center;
  gap:8px;
}

.side-menu .drawer-close-btn{
  background:rgba(255,255,255,.2);
  border:none;
  color:#fff;
  width:32px;
  height:32px;
  border-radius:50%;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  font-size:14px;
  transition:background .2s;
}

.side-menu .drawer-close-btn:hover{
  background:rgba(255,255,255,.35);
}

.side-menu .drawer-nav{
  flex:1;
  padding:10px 0;
}

.side-menu .drawer-nav a{
  display:flex;
  align-items:center;
  gap:14px;
  padding:13px 20px;
  font-size:14px;
  font-weight:500;
  color:#374151;
  border-bottom:1px solid #f3f4f6;
  transition:background .15s, color .15s;
}

.side-menu .drawer-nav a i{
  width:20px;
  font-size:16px;
  color:var(--primary);
  text-align:center;
}

.side-menu .drawer-nav a:hover,
.side-menu .drawer-nav a:active{
  background:var(--primary-light);
  color:var(--primary);
}

.side-menu .drawer-footer{
  padding:16px;
  background:#f9fafb;
  border-top:1px solid #eee;
}

.side-menu .helpline-box{
  background:#fff;
  border:1px solid #e5e7eb;
  border-radius:10px;
  padding:12px;
  text-align:center;
}

.side-menu .helpline-box p{
  margin:0 0 8px 0;
  font-size:11px;
  font-weight:600;
  color:#6b7280;
  text-transform:uppercase;
  letter-spacing:.5px;
}

.side-menu .helpline-box a{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  font-size:13px;
  font-weight:700;
  color:var(--primary);
}

/* ================= STICKY MOBILE BOTTOM NAV (<= 768px ONLY) ================= */

.mobile-bottom-nav{
  position:fixed !important;
  bottom:0 !important;
  left:0 !important;
  right:0 !important;
  width:100% !important;
  height:56px !important;
  min-height:56px !important;
  max-height:56px !important;
  background:#ffffff !important;
  border-top:1px solid #e5e7eb !important;
  display:none;
  align-items:center !important;
  justify-content:space-around !important;
  padding:0 !important;
  margin:0 !important;
  z-index:999999 !important;
  box-shadow:0 -2px 10px rgba(0,0,0,.08) !important;
  box-sizing:border-box !important;
}

.mobile-bottom-nav .nav-item{
  flex:1 !important;
  height:56px !important;
  display:flex !important;
  flex-direction:column !important;
  align-items:center !important;
  justify-content:center !important;
  gap:2px !important;
  color:#64748b !important;
  font-size:11px !important;
  font-weight:600 !important;
  text-decoration:none !important;
  transition:all .15s ease !important;
  position:relative !important;
  padding:4px 0 !important;
  box-sizing:border-box !important;
  -webkit-tap-highlight-color:transparent;
}

.mobile-bottom-nav .nav-item i{
  font-size:19px !important;
  line-height:1 !important;
  display:block !important;
  transition:transform .15s ease, color .15s ease !important;
}

.mobile-bottom-nav .nav-item span{
  font-size:11px !important;
  font-weight:600 !important;
  line-height:1.2 !important;
  display:block !important;
}

.mobile-bottom-nav .nav-item:hover,
.mobile-bottom-nav .nav-item.active{
  color:var(--primary) !important;
}

.mobile-bottom-nav .nav-item.active i{
  color:var(--primary) !important;
  transform:scale(1.08) !important;
}

.mobile-bottom-nav .cart-nav-wrap{
  position:relative !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
}

.mobile-bottom-nav .cart-count-badge{
  position:absolute !important;
  top:-6px !important;
  right:-10px !important;
  background:var(--primary) !important;
  color:#fff !important;
  font-size:9.5px !important;
  font-weight:700 !important;
  padding:1px 4px !important;
  min-width:16px !important;
  height:16px !important;
  border-radius:8px !important;
  line-height:14px !important;
  text-align:center !important;
  box-shadow:0 1px 3px rgba(215,44,53,.35) !important;
  border:1.5px solid #fff !important;
  box-sizing:border-box !important;
}

/* ================= CATEGORY SUB-NAV (.category-slider) ================= */

.category-slider{
  position:sticky;
  top:var(--header-desktop-h);
  background:#fff;
  border-bottom:1px solid #eee;
  z-index:999;
  box-shadow:0 2px 4px rgba(0,0,0,.02);
}

.category-scroll{
  display:flex;
  gap:10px;
  overflow-x:auto;
  padding:10px 16px;
  -webkit-overflow-scrolling:touch;
}

.category-scroll::-webkit-scrollbar{
  display:none;
}

.category-btn{
  white-space:nowrap;
  padding:6px 14px;
  border:1px solid #e5e7eb;
  border-radius:20px;
  font-size:12.5px;
  font-weight:500;
  color:#4b5563;
  background:#fff;
  transition:all .15s ease;
  flex-shrink:0;
}

.category-btn.active,
.category-btn:hover{
  background:var(--primary);
  border-color:var(--primary);
  color:#fff;
}

/* ================= RESPONSIVE SWITCH RULES ================= */

@media (max-width: 1024px){
  .desktop-nav{
    display:none !important;
  }
  .mobile-header{
    display:flex !important;
    flex-direction:row !important;
    position:fixed !important;
    top:0 !important;
    left:0 !important;
    right:0 !important;
    width:100% !important;
    height:var(--header-mobile-h) !important;
    z-index:99999 !important;
  }
  .category-slider{
    top:var(--header-mobile-h) !important;
  }
}

@media (max-width: 768px){
  .mobile-bottom-nav{
    display:flex !important;
  }
  .category-scroll{
    padding:8px 12px;
  }
  /* Reserve bottom space on mobile so fixed bottom nav never covers page content */
  body{
    padding-bottom: 70px !important;
  }
}

</style>

<!-- ================= DESKTOP NAV (> 1024px) ================= -->

<nav class="desktop-nav" aria-label="Desktop Navigation">

  <a href="/" class="logo" title="Sri Chaitanya Book Centre">
    <img src="{{ asset('images/ebook_logo.png') }}" alt="Sri Chaitanya Book Centre">
  </a>

  <div class="menu">
    <a href="/" class="{{ request()->is('/') ? 'active' : '' }}">Home</a>
    <a href="{{ route('shop.all') }}" class="{{ request()->routeIs('shop*') ? 'active' : '' }}">Shop</a>
    <a href="{{ route('publications.index') }}" class="{{ request()->routeIs('publications*') ? 'active' : '' }}">Publications</a>
    <a href="{{ route('order-history.index') }}" class="{{ request()->routeIs('order-history*') ? 'active' : '' }}">Order History</a>
    <a href="/about" class="{{ request()->is('about') ? 'active' : '' }}">About</a>
    <a href="/contact" class="{{ request()->is('contact') ? 'active' : '' }}">Contact</a>
  </div>

  <!-- SEARCH -->
  <div class="shop-search-wrap" data-search-box>
    <form method="GET" action="{{ route('shop.search') }}" autocomplete="off">
      <input type="text" name="q" value="{{ request('q') }}"
             placeholder="Search books..." data-search-input minlength="1" aria-label="Search books">
      <button type="submit" aria-label="Search"><i class="fa fa-search"></i></button>
    </form>
    <div class="search-suggest" data-search-suggest></div>
  </div>

  <!-- ICONS -->
  <div class="icons">
    <a href="#" title="Wishlist" aria-label="Wishlist"><i class="fa fa-heart"></i></a>
    <a href="{{ route('order-history.index') }}" title="Order History / Account" aria-label="Account"><i class="fa fa-user"></i></a>
    <a href="{{ route('cart.index') }}" class="cart-icon" title="View Cart" aria-label="Shopping Cart">
      <i class="fa fa-shopping-cart"></i>
      <span class="cart-count">
        {{ session('cart') ? array_sum(array_column(session('cart'),'qty')) : 0 }}
      </span>
    </a>
  </div>

</nav>

<!-- ================= MOBILE & TABLET HEADER (<= 1024px) ================= -->

<header class="mobile-header" aria-label="Mobile and Tablet Navigation">

  <button type="button" class="mobile-menu-btn" onclick="openMenu()" aria-label="Open Menu">
    <i class="fa fa-bars"></i>
  </button>

  <a href="/" class="mobile-logo" title="Sri Chaitanya Book Centre">
    <img src="{{ asset('images/ebook_logo.png') }}" alt="Sri Chaitanya Book Centre">
  </a>

  <!-- Centered Search Bar -->
  <div class="mobile-search-wrap" data-search-box>
    <form method="GET" action="{{ route('shop.search') }}" autocomplete="off">
      <i class="fa fa-search search-icon"></i>
      <input type="text" name="q" value="{{ request('q') }}"
             placeholder="Search books..." data-search-input minlength="1" aria-label="Search books">
    </form>
    <div class="search-suggest" data-search-suggest></div>
  </div>

  <!-- Right Side Cart Button -->
  <a href="{{ route('cart.index') }}" class="mobile-cart-btn" title="View Cart" aria-label="Shopping Cart">
    <i class="fa fa-shopping-cart"></i>
    <span class="cart-count">
      {{ session('cart') ? array_sum(array_column(session('cart'),'qty')) : 0 }}
    </span>
  </a>

</header>

<!-- ================= SIDE MENU DRAWER (Mobile & Tablet) ================= -->

<div class="side-menu-backdrop" onclick="closeMenu()" aria-hidden="true"></div>

<aside class="side-menu" id="sideMenu" aria-label="Side Menu Drawer">

  <div class="drawer-header">
    <div class="drawer-title">
      <i class="fa fa-book-open-reader"></i>
      <span>Sri Chaitanya Books</span>
    </div>
    <button type="button" class="drawer-close-btn" onclick="closeMenu()" aria-label="Close Menu">
      <i class="fa fa-times"></i>
    </button>
  </div>

  <nav class="drawer-nav">
    <a href="/" onclick="closeMenu()"><i class="fa fa-home"></i> Home</a>
    <a href="{{ route('shop.all') }}" onclick="closeMenu()"><i class="fa fa-book-open"></i> All Books / Shop</a>
    <a href="{{ route('publications.index') }}" onclick="closeMenu()"><i class="fa fa-layer-group"></i> Publications</a>
    <a href="{{ route('order-history.index') }}" onclick="closeMenu()"><i class="fa fa-clock-rotate-left"></i> Track Orders & History</a>
    <a href="{{ route('cart.index') }}" onclick="closeMenu()">
      <i class="fa fa-shopping-cart"></i>
      <span>My Cart</span>
      @php $sideCartCount = session('cart') ? array_sum(array_column(session('cart'),'qty')) : 0; @endphp
      @if($sideCartCount > 0)
        <span style="margin-left:auto;background:var(--primary);color:#fff;font-size:11px;padding:2px 8px;border-radius:12px;font-weight:700;">
          {{ $sideCartCount }}
        </span>
      @endif
    </a>
    <a href="/about" onclick="closeMenu()"><i class="fa fa-circle-info"></i> About Us</a>
    <a href="/contact" onclick="closeMenu()"><i class="fa fa-phone"></i> Contact Us</a>
  </nav>

  <div class="drawer-footer">
    <div class="helpline-box">
      <p>Customer Support</p>
      <a href="tel:9177110134">
        <i class="fa fa-phone-volume"></i> 9177110134
      </a>
    </div>
  </div>

</aside>

<!-- ================= STICKY MOBILE BOTTOM NAV (<= 768px: HOME, SHOP, ACCOUNT, CART) ================= -->

<nav class="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">

  <!-- 1. Home -->
  <a href="/" class="nav-item {{ request()->is('/') ? 'active' : '' }}">
    <i class="fa fa-home"></i>
    <span>Home</span>
  </a>

  <!-- 2. Shop -->
  <a href="{{ route('shop.all') }}" class="nav-item {{ request()->routeIs('shop*') ? 'active' : '' }}">
    <i class="fa fa-book-open"></i>
    <span>Shop</span>
  </a>

  <!-- 3. Account -->
  <a href="{{ route('order-history.index') }}" class="nav-item {{ request()->routeIs('order-history*') ? 'active' : '' }}">
    <i class="fa fa-user"></i>
    <span>Account</span>
  </a>

  <!-- 4. Cart -->
  <a href="{{ route('cart.index') }}" class="nav-item {{ request()->routeIs('cart*') ? 'active' : '' }}">
    <div class="cart-nav-wrap">
      <i class="fa fa-shopping-cart"></i>
      @php $cartQty = session('cart') ? array_sum(array_column(session('cart'), 'qty')) : 0; @endphp
      @if($cartQty > 0)
        <span class="cart-count-badge">{{ $cartQty }}</span>
      @endif
    </div>
    <span>Cart</span>
  </a>

</nav>

<!-- ================= CATEGORY SUB-NAV (when categories are present) ================= -->

@isset($categories)
<div class="category-slider">
  <div class="category-scroll">
    <a href="{{ route('shop.all') }}" class="category-btn {{ !isset($category) ? 'active' : '' }}">All</a>
    @foreach($categories as $cat)
      @if($cat->slug)
        <a href="{{ route('shop.category',$cat->slug) }}" class="category-btn {{ (isset($category) && $category->id == $cat->id) ? 'active' : '' }}">
          {{ $cat->name }}
        </a>
      @endif
    @endforeach
  </div>
</div>
@endisset

<!-- ================= JAVASCRIPT ================= -->

<script>
function openMenu(){
  const menu = document.getElementById('sideMenu');
  const backdrop = document.querySelector('.side-menu-backdrop');
  if(menu) menu.classList.add('open');
  if(backdrop) backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMenu(){
  const menu = document.getElementById('sideMenu');
  const backdrop = document.querySelector('.side-menu-backdrop');
  if(menu) menu.classList.remove('open');
  if(backdrop) backdrop.classList.remove('show');
  document.body.style.overflow = '';
}

// Close side menu with ESC key
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    closeMenu();
  }
});

/* ================= LIVE SEARCH AUTO-SUGGEST ================= */
(function(){
  const SUGGEST_URL = "{{ route('shop.search.suggest') }}";
  const boxes = document.querySelectorAll('[data-search-box]');
  let debounceTimer = null;
  let activeController = null;

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  function renderResults(box, data, query){
    const panel = box.querySelector('[data-search-suggest]');
    if(!panel) return;
    panel.innerHTML = '';

    if(!data.results || data.results.length === 0){
      panel.innerHTML = '<div class="suggest-empty">No books found for "'+escapeHtml(query)+'"</div>';
      panel.classList.add('show');
      return;
    }

    data.results.forEach(item => {
      const a = document.createElement('a');
      a.href = item.url;
      a.className = 'suggest-item';
      a.innerHTML =
        (item.image ? '<img src="'+item.image+'" alt="">' : '') +
        '<span class="suggest-name">'+escapeHtml(item.name)+'</span>' +
        '<span class="suggest-price">₹'+item.price+'</span>';
      panel.appendChild(a);
    });

    if(data.view_all){
      const all = document.createElement('a');
      all.href = data.view_all;
      all.className = 'suggest-viewall';
      all.textContent = 'View all results for "'+query+'"';
      panel.appendChild(all);
    }

    panel.classList.add('show');
  }

  boxes.forEach(box => {
    const input = box.querySelector('[data-search-input]');
    const panel = box.querySelector('[data-search-suggest]');
    if(!input || !panel) return;

    input.addEventListener('input', function(){
      const query = input.value.trim();
      clearTimeout(debounceTimer);

      if(query.length < 3){
        panel.classList.remove('show');
        panel.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(() => {
        if(activeController) activeController.abort();
        activeController = new AbortController();

        fetch(SUGGEST_URL + '?q=' + encodeURIComponent(query), {
          signal: activeController.signal,
          headers: {'Accept':'application/json'}
        })
        .then(res => res.json())
        .then(data => renderResults(box, data, query))
        .catch(err => { if(err.name !== 'AbortError') console.error(err); });
      }, 300);
    });

    document.addEventListener('click', function(e){
      if(!box.contains(e.target)){
        panel.classList.remove('show');
      }
    });

    input.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        panel.classList.remove('show');
      }
    });
  });
})();
</script>
