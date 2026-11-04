<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Publication;

class ShopController extends Controller
{
    /* =========================================================
       ALL PRODUCTS
    ========================================================= */
    public function all()
    {
        $categories = Category::orderBy('name')->get();

        $products = Product::where('is_active', 1)
            ->latest()
            ->get();

        return view('shop.index', compact('categories', 'products'));
    }

    /* =========================================================
       CATEGORY PRODUCTS
    ========================================================= */
    public function category($slug)
    {
        $categories = Category::orderBy('name')->get();
        $category   = Category::where('slug', $slug)->firstOrFail();

        $products = Product::where('is_active', 1)
            ->whereJsonContains('category_ids', (string) $category->id)
            ->latest()
            ->get();

        return view('shop.index', compact('categories', 'products', 'category'));
    }

    /* =========================================================
       PUBLICATIONS (Delegates to PublicationController)
    ========================================================= */
    public function publications()
    {
        return redirect()->route('publications.index');
    }

    public function publication($id)
    {
        return redirect()->route('publications.show', $id);
    }

    /* =========================================================
       FULL SEARCH (search results page)
    ========================================================= */
    public function search(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $productsQuery = Product::where('is_active', 1);

        if ($q !== '') {
            $safe = str_replace(['%', '_'], ['\%', '\_'], $q);
            $productsQuery->where('name', 'LIKE', "%{$safe}%");
        }

        $products = $productsQuery
            ->latest()
            ->get();

        $categories = Category::orderBy('name')->get();

        return view('shop.index', compact('products', 'categories', 'q'));
    }

    /* =========================================================
       LIVE SEARCH SUGGESTIONS (AJAX / JSON)
    ========================================================= */
    public function searchSuggest(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 3) {
            return response()->json(['results' => []]);
        }

        $safe = str_replace(['%', '_'], ['\%', '\_'], $q);

        $products = Product::where('is_active', 1)
            ->where('name', 'LIKE', "%{$safe}%")
            ->orderBy('name')
            ->limit(6)
            ->get(['id', 'name', 'slug', 'main_photo', 'total_price']);

        $results = $products->map(function ($p) {
            return [
                'id'         => $p->id,
                'name'       => $p->name,
                'url'        => route('product.show', $p->slug),
                'photo'      => asset('storage/' . $p->main_photo),
                'price'      => '₹' . number_format($p->total_price, 2),
            ];
        });

        return response()->json(['results' => $results]);
    }
}
