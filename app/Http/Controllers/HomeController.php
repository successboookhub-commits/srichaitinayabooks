<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Product;
use App\Models\Publication;

class HomeController extends Controller
{
    public function index()
    {
        $banners = Banner::all();

        $trending = Product::where('is_active', 1)
            ->latest()
            ->take(12)
            ->get();

        $featured = Product::where('is_featured', 1)
            ->where('is_active', 1)
            ->take(12)
            ->get();

        $newArrivals = Product::where('is_active', 1)
            ->latest()
            ->take(12)
            ->get();

        // Fast query: Only fetch publications that actually have products, limit to top 8 on homepage
        $publications = Publication::whereHas('products', function ($q) {
            $q->where('is_active', 1);
        })->with(['products' => function ($q) {
            $q->where('is_active', 1)->take(8);
        }])->take(8)->get();

        return view('home', compact(
            'banners',
            'trending',
            'featured',
            'newArrivals',
            'publications'
        ));
    }

    public function show($slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        return view('product.show', compact('product'));
    }
}
