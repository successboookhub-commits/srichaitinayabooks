<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderHistoryController;
use App\Http\Controllers\PageController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/admin', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');

/*
|--------------------------------------------------------------------------
| Protected Admin Routes (Requires Authentication & Admin Role)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('banners', BannerController::class);

    Route::prefix('admin')->group(function () {
        // Categories
        Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::get('categories/{id}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
        Route::put('categories/{id}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');

        // Publications
        Route::get('/publications', [PublicationController::class, 'adminIndex'])->name('admin.publications.index');
        Route::post('/publications/store', [PublicationController::class, 'store'])->name('admin.publications.store');
        Route::get('/publications/edit/{id}', [PublicationController::class, 'edit'])->name('admin.publications.edit');
        Route::post('/publications/update/{id}', [PublicationController::class, 'update'])->name('admin.publications.update');
        Route::delete('/publications/delete/{id}', [PublicationController::class, 'destroy'])->name('admin.publications.destroy');
    });

    Route::prefix('admin')->name('admin.')->group(function () {
        // Products
        Route::resource('products', ProductController::class);

        // Orders
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/scan', [OrderController::class, 'scanForm'])->name('orders.scan');
        Route::get('/orders/scan/lookup', [OrderController::class, 'scanLookup'])->name('orders.scanLookup');
        Route::get('/orders/scan-courier', [OrderController::class, 'scanLookupCourier'])->name('orders.scanLookupCourier');
        Route::get('/orders/print-labels', [OrderController::class, 'printLabelsBulk'])->name('orders.printLabelsBulk');
        Route::post('/orders/bulk-status', [OrderController::class, 'bulkUpdateStatus'])->name('orders.bulkStatus');
        Route::post('/orders/bulk-status-by-date', [OrderController::class, 'bulkUpdateStatusByDate'])->name('orders.bulkStatusByDate');
        Route::get('/orders/print-label/{id}', [OrderController::class, 'printLabel'])->name('orders.printLabel');
        Route::put('/orders/update-status/{id}', [OrderController::class, 'updateOrderStatus'])->name('orders.updateOrderStatus');

        Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');
        Route::get('/orders/{id}/download', [OrderController::class, 'download'])->name('orders.download');
        Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
        Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->name('orders.destroy');
    });
});

/*
|--------------------------------------------------------------------------
| Cart
|--------------------------------------------------------------------------
*/
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');

Route::get('/clear-cart', function () {
    session()->forget('cart');
    return 'Cart cleared';
});

/*
|--------------------------------------------------------------------------
| Checkout & Razorpay
|--------------------------------------------------------------------------
*/
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout/pay', [CheckoutController::class, 'pay'])->name('checkout.pay');
Route::post('/razorpay/callback', [CheckoutController::class, 'callback'])->name('razorpay.callback');
Route::post('/razorpay/webhook', [CheckoutController::class, 'webhook'])->name('razorpay.webhook');

Route::get('/order-success/{order}', [CheckoutController::class, 'orderSuccess'])->name('order.success');
Route::get('/invoice/{orderCode}', [CheckoutController::class, 'downloadInvoice'])->name('invoice.download');
Route::get('/order-processing/{paymentId}', [CheckoutController::class, 'processing'])->name('order.processing');

/*
|--------------------------------------------------------------------------
| Shop & Search
|--------------------------------------------------------------------------
*/
Route::get('/shop', [ShopController::class, 'all'])->name('shop.all');
Route::get('/shop/search', [ShopController::class, 'search'])->name('shop.search');
Route::get('/shop/search-suggest', [ShopController::class, 'searchSuggest'])->name('shop.search.suggest');
Route::get('/category/{slug}', [ShopController::class, 'category'])->name('shop.category');

/*
|--------------------------------------------------------------------------
| Publications (Public)
|--------------------------------------------------------------------------
*/
Route::get('/publications', [PublicationController::class, 'index'])->name('publications.index');
Route::get('/publications/{id}', [PublicationController::class, 'show'])->name('publications.show');

/*
|--------------------------------------------------------------------------
| Order History (Customer-facing with Phone Auth)
|--------------------------------------------------------------------------
*/
Route::prefix('order-history')->name('order-history.')->group(function () {
    Route::get('/', [OrderHistoryController::class, 'index'])->name('index');
    Route::get('/{order_code}/invoice', [OrderHistoryController::class, 'invoice'])->name('invoice');
    Route::get('/{order_code}', [OrderHistoryController::class, 'show'])->name('show');
});

/*
|--------------------------------------------------------------------------
| Static Pages
|--------------------------------------------------------------------------
*/
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
