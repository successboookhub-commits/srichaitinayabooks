@extends('admin.layouts.app')

@section('content')

<div class="card shadow">
    <div class="card-header text-white" style="background:#b30000">
        <h4>Edit Category</h4>
    </div>

    <div class="card-body">
        <form action="{{ route('admin.categories.update', $category->id) }}" method="POST">
            @csrf
            @method('PUT')

            <input type="text" name="name" value="{{ $category->name }}"
                class="form-control mb-3" required>

            <button class="btn text-white" style="background:#cc0000">
                Update Category
            </button>
            <a href="{{ route('admin.categories.index') }}" class="btn btn-secondary">
                Back
            </a>
        </form>
    </div>
</div>

@endsection
