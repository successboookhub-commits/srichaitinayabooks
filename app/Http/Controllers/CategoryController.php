<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // Display all categories
    public function index()
    {
        $categories = Category::orderBy('name')->get();
        return view('admin.categories.index', compact('categories'));
    }

    // Store new category
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $slug = Str::slug($request->name);

        // Ensure unique slug
        $originalSlug = $slug;
        $count = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        Category::create([
            'name' => $request->name,
            'slug' => $slug,
        ]);

        return redirect()->back()->with('success', 'Category added successfully.');
    }

    // Show edit form
    public function edit($id)
    {
        $editCategory = Category::findOrFail($id);
        $categories = Category::orderBy('name')->get();

        return view('admin.categories.index', compact('categories', 'editCategory'));
    }

    // Update category
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
        ]);

        $category = Category::findOrFail($id);

        $slug = Str::slug($request->name);

        // Ensure unique slug except current category
        $originalSlug = $slug;
        $count = 1;

        while (Category::where('slug', $slug)->where('id', '!=', $id)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        $category->update([
            'name' => $request->name,
            'slug' => $slug,
        ]);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    // Delete category
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
