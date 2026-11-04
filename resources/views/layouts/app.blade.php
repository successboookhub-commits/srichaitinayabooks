<!DOCTYPE html>
<html>
<head>
  <title>Sri Chaitanya Book Centre</title>

    <!-- Basic Meta -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta -->
    <meta name="title" content="Sri Chaitanya Book Centre">
    <meta name="description" content="Buy competitive exam books online for UPSC, SSC, TSPSC, APPSC and more at Sri Chaitanya Book Centre. Best prices, quality books, and fast delivery in Hyderabad.">
    <meta name="keywords" content="UPSC books, SSC books, TSPSC books, APPSC books, competitive exam books, online book store Hyderabad, Sri Chaitanya Book Centre">
    <meta name="author" content="Sri Chaitanya Book Centre">

    <!-- Open Graph (for Google & Social Media) -->
    <meta property="og:title" content="Sri Chaitanya Book Centre">
    <meta property="og:description" content="Best place to buy UPSC, SSC, TSPSC, APPSC books online with fast delivery.">
    <meta property="og:image" content="{{ asset('images/mini_logo.png') }}">
    <meta property="og:url" content="https://srichaitanybookscenter.com/">
    <meta property="og:type" content="website">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Favicon (IMPORTANT for logo in browser & Google) -->
    <link rel="icon" type="image/png" href="{{ asset('images/mini_logo.png') }}">
    <link rel="shortcut icon" href="{{ asset('images/mini_logo.png') }}">
    <meta name="google-site-verification" content="phfxjjW4qtCcnGJ8ZMjpet8qy_AGabiX22Hgv99uBxY" />

    <!-- CSS -->
    <link rel="stylesheet" href="{{ asset('css/navbar.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>

@include('layouts.navbar')


        @yield('content')   <!-- ONLY ONCE -->

    @stack('scripts')

    <!-- Floating Sticky Quick Actions (WhatsApp, Direct Call, Scroll To Top) -->
    <div id="sticky-floating-actions" style="position:fixed; right:20px; bottom:24px; z-index:99999; display:flex; flex-direction:column; align-items:center; gap:12px;">
      <!-- Scroll To Top -->
      <button id="btn-scroll-top" onclick="window.scrollTo({top:0, behavior:'smooth'})" title="Back to Top" style="display:none; width:44px; height:44px; border-radius:50%; background:#1e293b; color:#fff; border:1px solid #334155; box-shadow:0 8px 20px rgba(0,0,0,0.25); cursor:pointer; align-items:center; justify-content:center; transition:all 0.3s ease;">
        <svg style="width:20px; height:20px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
      </button>

      <!-- Direct Call -->
      <a href="tel:09177110134" title="Call Helpline: 09177110134" style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, #e11d48, #d72c35); color:#fff; border:2px solid #fff; box-shadow:0 8px 24px rgba(215,44,53,0.45); display:flex; align-items:center; justify-content:center; text-decoration:none; transition:transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        <svg style="width:22px; height:22px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
      </a>

      <!-- WhatsApp Sticky Button -->
      <a href="https://wa.me/919177110134?text=Hello%20Sri%20Chaitanya%20Books,%20I%20have%20an%20enquiry%20regarding%20books" target="_blank" rel="noreferrer" title="Chat on WhatsApp" style="position:relative; width:54px; height:54px; border-radius:50%; background:#25D366; color:#fff; border:2px solid #fff; box-shadow:0 10px 28px rgba(37,211,102,0.5); display:flex; align-items:center; justify-content:center; text-decoration:none; transition:transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        <svg style="width:28px; height:28px; fill:#fff;" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.074-1.921-.462-1.644-.683-2.697-2.355-2.778-2.464-.082-.109-.661-.88-.661-1.68 0-.799.414-1.192.56-1.353.148-.162.324-.202.433-.202.109 0 .216.002.31.007.1.005.234-.038.366.279.135.324.461 1.127.502 1.209.041.082.068.179.014.288-.054.108-.082.176-.162.27-.082.095-.172.211-.246.284-.082.081-.168.169-.072.333.095.165.424.7.912 1.134.629.56 1.161.733 1.326.815.164.081.26.072.357-.04.097-.113.414-.482.524-.648.11-.165.22-.138.368-.083.149.055.946.446 1.109.528.163.082.272.122.312.19.04.068.04.394-.104.799z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.659 1.442 5.168L2.054 22l4.98-1.309A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.053c-1.614 0-3.137-.47-4.428-1.282l-.317-.199-2.955.776.789-2.881-.218-.348A8.04 8.04 0 013.947 12C3.947 7.558 7.558 3.947 12 3.947c4.442 0 8.053 3.611 8.053 8.053 0 4.442-3.611 8.053-8.053 8.053z"/></svg>
      </a>
    </div>

    <script>
      window.addEventListener('scroll', function() {
        var btn = document.getElementById('btn-scroll-top');
        if (btn) {
          btn.style.display = window.scrollY > 280 ? 'flex' : 'none';
        }
      }, { passive: true });
    </script>
</body>
</html>
