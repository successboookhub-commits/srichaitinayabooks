<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{

    /* ===========================
       FRONTEND : SINGLE PRODUCT
    ============================ */
    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $relatedProducts = Product::where('id', '!=', $product->id)
            ->where('is_active', true)
            ->where(function ($query) use ($product) {

                if (!empty($product->category_ids)) {
                    foreach ($product->category_ids as $catId) {
                        $query->orWhereJsonContains('category_ids', $catId);
                    }
                }

            })
            ->limit(12)
            ->get();

        return view('product.show', compact('product', 'relatedProducts'));
    }


    /* ===========================
       ADMIN : LIST PRODUCTS
    ============================ */
    public function index(Request $request)
    {
        $search = $request->search;

        $products = Product::when($search, function ($query) use ($search) {

            $query->where(function ($q) use ($search) {

                if (is_numeric($search)) {
                    $q->orWhere('id', $search);
                }

                $q->orWhere('name', 'LIKE', "%{$search}%");

                $categoryIds = \App\Models\Category::where('name', 'LIKE', "%{$search}%")
                                    ->pluck('id')
                                    ->toArray();

                if (!empty($categoryIds)) {
                    foreach ($categoryIds as $catId) {
                        $q->orWhereJsonContains('category_ids', $catId);
                    }
                }

            });

        })
        ->latest()
        ->paginate(10)
        ->withQueryString();

        return view('admin.products.index', compact('products'));
    }

    /* ===========================
       ADMIN : CREATE FORM
    ============================ */
    public function create()
    {
        $categories = Category::all();
        $publications = Publication::all();

        return view('admin.products.create',
            compact('categories', 'publications'));
    }


    /* ===========================
       ADMIN : STORE PRODUCT
    ============================ */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255',

            // ✅ CHANGED: was 'nullable' — the products table has
            // publication_id as NOT NULL, so a blank selection was
            // reaching the database and crashing with a 500 instead of
            // showing a normal "this field is required" validation error.
            'publication_id'  => 'required|exists:publications,id',

            'old_price'       => 'nullable|numeric',
            'discount'        => 'nullable|numeric',
            'total_price'     => 'required|numeric',
            'quantity'        => 'required|integer',

            // Weight handling
            'weight_type'     => 'required|in:weight,weightless',
            'weight'          => 'nullable|numeric|required_if:weight_type,weight',
            'shipping_charge' => 'nullable|numeric',

            'description'     => 'nullable|string',
            'category_ids'    => 'required|array',
            'category_ids.*'  => 'exists:categories,id',
            'main_photo'      => 'required|image|max:2048',
            'related_photos.*'=> 'nullable|image|max:2048',
        ]);

        $data['slug'] = Str::slug($request->name) . '-' . time();

        // FEATURE: Weight Less handling
        // - weight_type is a form-only field (not a DB column), so it is
        //   removed from $data before Product::create().
        // - is_weightless is the real column that gets saved.
        // - When weightless, we ignore any weight value and force a flat
        //   shipping charge (from config, unless the admin manually
        //   overrode the Shipping Charge field before submitting).
        $isWeightless = $data['weight_type'] === 'weightless';
        unset($data['weight_type']);

        $data['is_weightless'] = $isWeightless;

        if ($isWeightless) {
            $data['weight'] = null;
            $data['shipping_charge'] = $request->filled('shipping_charge')
                ? $request->shipping_charge
                : config('shipping.weightless_base_charge');
        } else {
            // Recompute server-side so a tampered/blocked-JS submission
            // can't send an arbitrary shipping_charge.
            $data['shipping_charge'] = round(
                ($request->weight ?? 0) * config('shipping.rate_per_kg'),
                2
            );
        }

        if ($request->hasFile('main_photo')) {
            $image = $request->file('main_photo');
            $imageName = uniqid().'_'.$image->getClientOriginalName();
            $image->move(public_path('storage/products'), $imageName);
            $data['main_photo'] = 'products/'.$imageName;
        }

        if ($request->hasFile('related_photos')) {
            $photos = [];

            foreach ($request->file('related_photos') as $file) {
                $fileName = uniqid().'_'.$file->getClientOriginalName();
                $file->move(public_path('storage/products'), $fileName);
                $photos[] = 'products/'.$fileName;
            }

            $data['related_photos'] = $photos;
        }

        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active']   = $request->boolean('is_active');

        Product::create($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product added successfully');
    }


    /* ===========================
       ADMIN : EDIT FORM
    ============================ */
    public function edit(Product $product)
    {
        $categories = Category::all();
        $publications = Publication::all();

        return view('admin.products.edit',
            compact('product', 'categories', 'publications'));
    }


    /* ===========================
       ADMIN : UPDATE PRODUCT
    ============================ */
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255',

            // ✅ CHANGED: same reason as store() above.
            'publication_id'  => 'required|exists:publications,id',

            'old_price'       => 'nullable|numeric',
            'discount'        => 'nullable|numeric',
            'total_price'     => 'required|numeric',
            'quantity'        => 'required|integer',

            'weight_type'     => 'required|in:weight,weightless',
            'weight'          => 'nullable|numeric|required_if:weight_type,weight',
            'shipping_charge' => 'nullable|numeric',

            'description'     => 'nullable|string',
            'category_ids'    => 'required|array',
            'category_ids.*'  => 'exists:categories,id',
            'main_photo'      => 'nullable|image|max:2048',
            'related_photos.*'=> 'nullable|image|max:2048',
        ]);

        if ($product->name !== $request->name) {
            $data['slug'] = Str::slug($request->name) . '-' . time();
        }

        $isWeightless = $data['weight_type'] === 'weightless';
        unset($data['weight_type']);

        $data['is_weightless'] = $isWeightless;

        if ($isWeightless) {
            $data['weight'] = null;
            $data['shipping_charge'] = $request->filled('shipping_charge')
                ? $request->shipping_charge
                : config('shipping.weightless_base_charge');
        } else {
            $data['shipping_charge'] = round(
                ($request->weight ?? 0) * config('shipping.rate_per_kg'),
                2
            );
        }

        if ($request->hasFile('main_photo')) {
            $image = $request->file('main_photo');
            $imageName = uniqid().'_'.$image->getClientOriginalName();
            $image->move(public_path('storage/products'), $imageName);
            $data['main_photo'] = 'products/'.$imageName;
        }

        if ($request->hasFile('related_photos')) {
            $photos = [];

            foreach ($request->file('related_photos') as $file) {
                $fileName = uniqid().'_'.$file->getClientOriginalName();
                $file->move(public_path('storage/products'), $fileName);
                $photos[] = 'products/'.$fileName;
            }

            $data['related_photos'] = $photos;
        }

        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active']   = $request->boolean('is_active');

        $product->update($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully');
    }


    /* ===========================
       ADMIN : DELETE PRODUCT
    ============================ */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully');
    }
}
