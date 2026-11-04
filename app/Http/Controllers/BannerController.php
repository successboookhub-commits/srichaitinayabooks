<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('id', 'desc')->get();
        return view('admin.banners.index', compact('banners'));
    }

    // STORE BANNER
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,webp,bmp|max:10240'
        ], [
            'title.required' => 'Banner title is required.',
            'image.required' => 'Please select an image file to upload.',
            'image.image'    => 'The selected file must be a valid image.',
            'image.max'      => 'The banner image size cannot exceed 10 MB.',
        ]);

        $uploadDir = public_path('uploads/banners');
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $image = $request->file('image');
        $ext = $image->getClientOriginalExtension() ?: $image->extension() ?: 'png';
        $imageName = time() . '_' . uniqid() . '.' . strtolower($ext);

        $image->move($uploadDir, $imageName);

        Banner::create([
            'title' => $request->title,
            'image' => 'uploads/banners/' . $imageName
        ]);

        return redirect()->route('banners.index')->with('success', 'Banner added successfully.');
    }

    // EDIT
    public function edit($id)
    {
        $banner = Banner::findOrFail($id);
        $banners = Banner::orderBy('id', 'desc')->get();

        return view('admin.banners.index', compact('banner', 'banners'));
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp,bmp|max:10240'
        ], [
            'image.max' => 'The banner image size cannot exceed 10 MB.',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($banner->image && file_exists(public_path($banner->image))) {
                @unlink(public_path($banner->image));
            }

            $uploadDir = public_path('uploads/banners');
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $image = $request->file('image');
            $ext = $image->getClientOriginalExtension() ?: $image->extension() ?: 'png';
            $imageName = time() . '_' . uniqid() . '.' . strtolower($ext);

            $image->move($uploadDir, $imageName);

            $banner->image = 'uploads/banners/' . $imageName;
        }

        $banner->title = $request->title;
        $banner->save();

        return redirect()->route('banners.index')
            ->with('success', 'Banner updated successfully.');
    }

    // DELETE
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);

        if ($banner->image && file_exists(public_path($banner->image))) {
            @unlink(public_path($banner->image));
        }

        $banner->delete();

        return redirect()->route('banners.index')
            ->with('success', 'Banner deleted successfully.');
    }
}
