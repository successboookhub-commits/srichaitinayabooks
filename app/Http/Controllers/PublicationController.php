<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\Product;
use Illuminate\Http\Request;

class PublicationController extends Controller
{

    /* ================= ADMIN ================= */

    public function adminIndex()
    {
        $publications = Publication::orderBy('id','desc')->get();

        return view('admin.publications.index',
            compact('publications'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:publications,name'
        ]);

        Publication::create([
            'name' => $request->name
        ]);

        return redirect()->route('admin.publications.index')
            ->with('success','Publication Added Successfully');
    }

    public function edit($id)
    {
        $editPublication = Publication::findOrFail($id);
        $publications = Publication::orderBy('id','desc')->get();

        return view('admin.publications.index',
            compact('editPublication','publications'));
    }

    public function update(Request $request, $id)
    {
        $publication = Publication::findOrFail($id);

        $request->validate([
            'name' => 'required|unique:publications,name,' . $id
        ]);

        $publication->update([
            'name' => $request->name
        ]);

        return redirect()->route('admin.publications.index')
            ->with('success','Publication Updated Successfully');
    }

    public function destroy($id)
    {
        Publication::findOrFail($id)->delete();

        return redirect()->route('admin.publications.index')
            ->with('success','Publication Deleted Successfully');
    }


    /* ================= FRONTEND ================= */

    public function index()
    {
        $publications = Publication::orderBy('name')->get();

        // ✅ CHANGED: was ->paginate(12), which capped this page to only
        // the first 12 active products no matter how many actually
        // exist. The page now loads and shows EVERY active product in
        // the sliding strip — no page-2/page-3 clicking needed.
        $products = Product::where('is_active',1)
                    ->latest()
                    ->get();

        return view('publications.index',
            compact('publications','products'));
    }

   public function show($id)
{
    $publications = Publication::orderBy('name')->get();

    $publication = Publication::findOrFail($id);

    // ✅ CHANGED: same fix — was ->paginate(12), capping each
    // publication's filtered view to 12 products. This is very likely
    // why clicking a specific publication looked like "not all show" —
    // if that publication had more than 12 books, the rest were simply
    // never sent to the page at all.
    $products = Product::where('publication_id', $publication->id)
        ->where('is_active', 1)
        ->latest()
        ->get();

    return view('publications.index', compact(
        'publications',
        'publication',
        'products'
    ));
}

}
