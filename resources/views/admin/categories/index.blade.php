@extends('admin.layout')

@section('content')

<div class="page-wrapper">
    <div class="category-grid">

        <!-- ADD / EDIT CATEGORY -->
        <div class="card">
            <div class="card-header">
                {{ isset($editCategory) ? 'Edit Category' : 'Add Category' }}
            </div>

            <div class="card-body">

                @if(session('success'))
                    <div class="alert success">
                        {{ session('success') }}
                    </div>
                @endif

                @if($errors->any())
                    <div class="alert error">
                        <ul>
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form method="POST"
                      action="{{ isset($editCategory) ? route('categories.update',$editCategory->id) : route('categories.store') }}">
                    @csrf
                    @isset($editCategory)
                        @method('PUT')
                    @endisset

                    <input type="text"
                           name="name"
                           placeholder="Enter category name"
                           value="{{ old('name', $editCategory->name ?? '') }}"
                           required>

                    <button type="submit" class="btn primary">
                        {{ isset($editCategory) ? 'Update Category' : 'Add Category' }}
                    </button>
                </form>
            </div>
        </div>

        <!-- CATEGORY LIST -->
        <div class="card wide">
            <div class="card-header">
                Category List
            </div>

            <div class="card-body">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        @forelse($categories as $key => $cat)
                            <tr>
                                <td>{{ $key + 1 }}</td>
                                <td class="bold">{{ $cat->name }}</td>
                                <td>
                                    <a href="{{ route('categories.edit',$cat->id) }}"
                                       class="btn small warning">
                                        Edit
                                    </a>

                                    <form action="{{ route('categories.destroy',$cat->id) }}"
                                          method="POST"
                                          class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn small danger"
                                                onclick="return confirm('Delete this category?')">
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="empty">
                                    No Categories Found
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</div>

<style>
/* RESET */
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family: 'Poppins', sans-serif;
}

/* PAGE */
.page-wrapper{
    background:#fff5f5;
    min-height:100vh;
    padding:40px 20px;
}

/* GRID */
.category-grid{
    max-width:1100px;
    margin:auto;
    display:grid;
    grid-template-columns:350px 1fr;
    gap:30px;
}

/* CARD */
.card{
    background:#fff;
    border-radius:16px;
    box-shadow:0 12px 30px rgba(0,0,0,.12);
    transition:.3s;
}

.card:hover{
    transform:translateY(-6px);
    box-shadow:0 20px 40px rgba(220,53,69,.25);
}

.card.wide{
    grid-column:2 / 3;
}

.card-header{
    background:#dc3545;
    color:#fff;
    padding:18px;
    font-size:18px;
    font-weight:600;
    text-align:center;
    border-radius:16px 16px 0 0;
}

.card-body{
    padding:25px;
}

/* ALERTS */
.alert{
    padding:12px 15px;
    border-radius:10px;
    margin-bottom:15px;
    font-size:14px;
}

.alert.success{
    background:#d4edda;
    color:#155724;
}

.alert.error{
    background:#f8d7da;
    color:#721c24;
}

.alert ul{
    margin-left:18px;
}

/* FORM */
input[type="text"]{
    width:100%;
    padding:14px 18px;
    border-radius:30px;
    border:2px solid #dc3545;
    outline:none;
    font-size:15px;
    margin-bottom:15px;
}

input:focus{
    box-shadow:0 0 10px rgba(220,53,69,.4);
}

/* BUTTONS */
.btn{
    border:none;
    border-radius:30px;
    padding:12px 22px;
    cursor:pointer;
    font-size:14px;
    transition:.25s;
    text-decoration:none;
    display:inline-block;
}

.btn.primary{
    background:#dc3545;
    color:#fff;
    width:100%;
    font-weight:600;
}

.btn.primary:hover{
    background:#b02a37;
}

.btn.small{
    padding:6px 14px;
    font-size:13px;
}

.btn.warning{
    background:#ffc107;
    color:#000;
}

.btn.warning:hover{
    background:#e0a800;
}

.btn.danger{
    background:#dc3545;
    color:#fff;
}

.btn.danger:hover{
    background:#b02a37;
}

/* TABLE */
table{
    width:100%;
    border-collapse:collapse;
}

thead{
    background:#ffe3e6;
}

th, td{
    padding:14px;
    text-align:center;
    border-bottom:1px solid #eee;
}

.bold{
    font-weight:600;
}

tbody tr:hover{
    background:#fff0f2;
}

/* MISC */
.inline{
    display:inline;
}

.empty{
    padding:30px;
    color:#dc3545;
    font-weight:600;
}

/* RESPONSIVE */
@media(max-width:900px){
    .category-grid{
        grid-template-columns:1fr;
    }
    .card.wide{
        grid-column:auto;
    }
}
</style>

@endsection
