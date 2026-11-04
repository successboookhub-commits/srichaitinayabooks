<?php
// app/Providers/AppServiceProvider.php
//
// Add this inside the boot() method so EVERY paginator in the app
// (not just the shop page) uses the custom Font-Awesome pagination
// view instead of Laravel's default Tailwind view. This is what
// prevents the oversized broken arrow icon from appearing anywhere
// else in the site.

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Paginator::defaultView('vendor.pagination.custom');
        Paginator::defaultSimpleView('vendor.pagination.custom');
    }
}
