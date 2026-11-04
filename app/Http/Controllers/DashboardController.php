<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $totalBooks      = Product::count();
        $totalCategories = Category::count();
        $totalOrders     = Order::count();
        $totalUsers      = User::count();

        // Last 12 months order stats for the chart
        $monthlyOrders = Order::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->pluck('total', 'month');

        $chartLabels = [];
        $chartData   = [];
        for ($m = 1; $m <= 12; $m++) {
            $chartLabels[] = date('M', mktime(0, 0, 0, $m, 1));
            $chartData[]   = $monthlyOrders[$m] ?? 0;
        }

        // Recent orders for the dashboard table
        $recentOrders = Order::with('customer')
            ->latest()
            ->take(5)
            ->get();

        return view('admin.dashboard', compact(
            'totalBooks',
            'totalCategories',
            'totalOrders',
            'totalUsers',
            'chartLabels',
            'chartData',
            'recentOrders'
        ));
    }
}