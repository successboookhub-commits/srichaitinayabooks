@extends('admin.layout')

@section('content')

<h2>Banners Management</h2>

{{-- Success Message --}}
@if(session('success'))
    <div style="padding:12px 15px;background:#d4edda;color:#155724;margin-bottom:15px;border-radius:5px;border:1px solid #c3e6cb;">
        <strong>Success:</strong> {{ session('success') }}
    </div>
@endif

{{-- Validation Error Messages --}}
@if($errors->any())
    <div style="padding:12px 15px;background:#f8d7da;color:#721c24;margin-bottom:15px;border-radius:5px;border:1px solid #f5c6cb;">
        <strong>Please fix the following:</strong>
        <ul style="margin:6px 0 0;padding-left:20px;">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

{{-- Add / Edit Form --}}
<div style="background:#fff;padding:25px;border-radius:10px;margin-bottom:30px;box-shadow:0 4px 15px rgba(0,0,0,0.05);border:1px solid #eee;">

    <h3 style="margin-top:0;margin-bottom:15px;font-size:18px;">
        {{ isset($banner) ? 'Edit Banner: ' . $banner->title : 'Add New Promotional Banner' }}
    </h3>

    <form method="POST"
          action="{{ isset($banner) ? route('banners.update', $banner->id) : route('banners.store') }}"
          enctype="multipart/form-data">

        @csrf

        @if(isset($banner))
            @method('PUT')
        @endif

        <div style="margin-bottom:15px;">
            <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">Banner Title / Promotion Name *</label>
            <input type="text"
                   name="title"
                   placeholder="e.g. Sri Chaitanya Book Centre All Books Available"
                   value="{{ $banner->title ?? old('title') }}"
                   required
                   style="width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box;">
        </div>

        <div style="margin-bottom:15px;">
            <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">
                Banner Image File {{ isset($banner) ? '(Leave empty to keep existing)' : '*' }} (JPG, PNG, WEBP, GIF - up to 10 MB):
            </label>
            <input type="file"
                   name="image"
                   accept="image/*"
                   {{ isset($banner) ? '' : 'required' }}
                   style="padding:6px;border:1px solid #ddd;border-radius:6px;width:100%;box-sizing:border-box;background:#fdfdfd;">
        </div>

        {{-- Show Current Image in Edit --}}
        @if(isset($banner) && $banner->image)
            <div style="margin-bottom:15px;background:#f9f9f9;padding:12px;border-radius:6px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;">Current Banner Image:</p>
                <img src="{{ asset($banner->image) }}"
                     style="max-width:320px;height:auto;border-radius:6px;border:1px solid #ddd;display:block;">
            </div>
        @endif

        <div style="display:flex;gap:10px;align-items:center;">
            <button type="submit"
                    style="padding:10px 24px;background:#d72c35;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:14px;">
                {{ isset($banner) ? 'Update Banner' : 'Upload & Add Banner' }}
            </button>

            @if(isset($banner))
                <a href="{{ route('banners.index') }}"
                   style="padding:10px 18px;background:#6c757d;color:#fff;border-radius:6px;text-decoration:none;font-size:14px;">
                    Cancel Edit
                </a>
            @endif
        </div>

    </form>
</div>

{{-- Banner List --}}
<div style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.05);border:1px solid #eee;">
    <table cellpadding="12" cellspacing="0"
           style="width:100%;border-collapse:collapse;text-align:left;font-size:14px;">

        <thead>
            <tr style="background:#f8f9fa;border-bottom:2px solid #dee2e6;font-size:12px;text-transform:uppercase;color:#495057;">
                <th style="padding:12px 16px;width:60px;">ID</th>
                <th style="padding:12px 16px;">Banner Title</th>
                <th style="padding:12px 16px;width:240px;">Preview</th>
                <th style="padding:12px 16px;width:150px;text-align:right;">Actions</th>
            </tr>
        </thead>

        <tbody>
            @forelse($banners as $b)
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:12px 16px;color:#6c757d;font-weight:bold;">#{{ $b->id }}</td>
                    <td style="padding:12px 16px;font-weight:600;color:#212529;">{{ $b->title }}</td>

                    <td style="padding:12px 16px;">
                        @if($b->image)
                            <img src="{{ asset($b->image) }}"
                                 alt="{{ $b->title }}"
                                 style="max-width:200px;max-height:80px;object-fit:contain;border-radius:4px;border:1px solid #ddd;background:#fff;display:block;">
                        @else
                            <span style="color:#999;font-size:12px;">No image</span>
                        @endif
                    </td>

                    <td style="padding:12px 16px;text-align:right;">
                        <div style="display:inline-flex;gap:6px;">
                            <a href="{{ route('banners.edit', $b->id) }}"
                               style="padding:6px 12px;background:#007bff;color:#fff;border-radius:4px;text-decoration:none;font-size:12px;font-weight:600;">
                                Edit
                            </a>

                            <form method="POST"
                                  action="{{ route('banners.destroy', $b->id) }}"
                                  onsubmit="return confirm('Are you sure you want to delete this banner?');"
                                  style="margin:0;">

                                @csrf
                                @method('DELETE')

                                <button type="submit"
                                        style="padding:6px 12px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;">
                                    Delete
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align:center;padding:30px;color:#6c757d;">
                        No banners found. Upload your first banner above.
                    </td>
                </tr>
            @endforelse
        </tbody>

    </table>
</div>

@endsection
