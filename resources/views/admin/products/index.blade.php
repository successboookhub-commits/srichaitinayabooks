@extends('admin.layout')

@section('content')

<style>
/* ===== PAGE WRAPPER ===== */
.products-wrapper{
    padding:20px;
    background:#f5f6fa;
}

/* ===== HEADER ===== */
.products-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
}

.products-header h2{
    margin:0;
    font-size:22px;
    color:#222;
}

/* ===== BUTTON ===== */
.btn-add{
    background:#0d6efd;
    color:#fff;
    padding:10px 16px;
    border-radius:6px;
    text-decoration:none;
    font-size:14px;
    transition:.3s;
}
.btn-add:hover{
    background:#084298;
}

/* ===== ALERT ===== */
.alert-success{
    background:#d1e7dd;
    color:#0f5132;
    padding:10px 15px;
    border-radius:6px;
    margin-bottom:15px;
}

/* ===== TABLE ===== */
.table-wrap{
    background:#fff;
    border-radius:10px;
    overflow:auto;
    box-shadow:0 5px 15px rgba(0,0,0,.05);
}

.products-table{
    width:100%;
    border-collapse:collapse;
    min-width:1200px;
}

.products-table thead{
    background:#111;
    color:#fff;
    position:sticky;
    top:0;
    z-index:2;
}

.products-table th,
.products-table td{
    padding:12px 10px;
    text-align:center;
    font-size:14px;
    border-bottom:1px solid #eee;
}

.products-table tbody tr:hover{
    background:#f8f9fa;
}

/* ===== IMAGE ===== */
.product-img{
    width:50px;
    height:50px;
    object-fit:cover;
    border-radius:6px;
    border:1px solid #ddd;
}

/* ===== BADGES ===== */
.badge{
    padding:4px 10px;
    border-radius:12px;
    font-size:12px;
    font-weight:600;
}
.badge-yes{ background:#198754; color:#fff; }
.badge-no{ background:#dc3545; color:#fff; }

/* ===== ACTION BUTTONS ===== */
.actions{
    display:flex;
    gap:6px;
    justify-content:center;
}

.btn{
    padding:6px 10px;
    font-size:13px;
    border-radius:5px;
    border:none;
    cursor:pointer;
    text-decoration:none;
    transition:.3s;
}

.btn-edit{
    background:#0dcaf0;
    color:#000;
}
.btn-edit:hover{
    background:#31d2f2;
}

.btn-delete{
    background:#dc3545;
    color:#fff;
}
.btn-delete:hover{
    background:#bb2d3b;
}

/* ===== PAGINATION ===== */
.pagination{
    display:flex;
    justify-content:center;
    margin-top:20px;
}
.pagination a,
.pagination span{
    padding:6px 12px;
    margin:0 3px;
    border-radius:5px;
    text-decoration:none;
    border:1px solid #ddd;
    color:#333;
}
.pagination .active span{
    background:#0d6efd;
    color:#fff;
    border-color:#0d6efd;
}


/* SEARCH BOX */
.search-box{
    margin-bottom:15px;
}

.search-box input{
    width:100%;
    max-width:350px;
    padding:10px 15px;
    border-radius:25px;
    border:1px solid #ddd;
    outline:none;
    font-size:14px;
    transition:0.3s;
    box-shadow:0 3px 8px rgba(0,0,0,0.05);
}

.search-box input:focus{
    border-color:#0d6efd;
    box-shadow:0 5px 15px rgba(13,110,253,0.2);
}

/* ===== RESPONSIVE ===== */
@media(max-width:768px){
    .products-header{
        flex-direction:column;
        gap:10px;
        align-items:flex-start;
    }
}

/* PAGINATION FIX */
.pagination-wrapper{
    display:flex;
    justify-content:center;
    margin-top:20px;
}

.pagination{
    display:flex;
    flex-wrap:wrap;
    gap:6px;
}

.pagination li{
    list-style:none;
}

.pagination li a,
.pagination li span{
    display:block;
    padding:8px 14px;
    border-radius:6px;
    border:1px solid #ddd;
    text-decoration:none;
    color:#333;
    font-size:14px;
    transition:.3s;
}

.pagination li a:hover{
    background:#0d6efd;
    color:#fff;
    border-color:#0d6efd;
}

.pagination .active span{
    background:#0d6efd;
    color:#fff;
    border-color:#0d6efd;
}

.pagination .disabled span{
    background:#f1f1f1;
    color:#999;
    cursor:not-allowed;
}
</style>

<div class="products-wrapper">

    <div class="products-header">
        <h2>Products List</h2>
        <a href="{{ route('admin.products.create') }}" class="btn-add">➕ Add Product</a>
    </div>
    
    <!-- SEARCH BAR -->
<div class="search-box">
    <input type="text" id="productSearch" placeholder="🔍 Search by ID, Name, Category...">
</div>

    @if(session('success'))
        <div class="alert-success">{{ session('success') }}</div>
    @endif

    <div class="table-wrap">
        <table class="products-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Name</th>
                    <th>Old ₹</th>
                    <th>Disc %</th>
                    <th>Total ₹</th>
                    <th>Qty</th>
                    <th>KG</th>
                    <th>Ship ₹</th>
                    <th>Featured</th>
                    <th>Active</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
            </thead>
     <tbody>
@forelse($products as $product)
<tr>
    <td>{{ $product->id }}</td>

    <!-- MULTI CATEGORY BADGES -->
<td>
    @forelse($product->category_list as $category)
        <span class="badge badge-yes" style="margin:2px;padding:3px 6px;font-size:12px;">
            {{ $category->name }}
        </span>
    @empty
        -
    @endforelse
</td>


    <td>{{ $product->name }}</td>
    <td>₹{{ $product->old_price }}</td>
    <td>{{ $product->discount ?? 0 }}</td>
    <td>₹{{ $product->total_price }}</td>
    <td>{{ $product->quantity }}</td>
    <td>{{ $product->weight }}</td>
    <td>₹{{ $product->shipping_charge }}</td>
    <td>
        <span class="badge {{ $product->is_featured ? 'badge-yes' : 'badge-no' }}">
            {{ $product->is_featured ? 'Yes' : 'No' }}
        </span>
    </td>
    <td>
        <span class="badge {{ $product->is_active ? 'badge-yes' : 'badge-no' }}">
            {{ $product->is_active ? 'Yes' : 'No' }}
        </span>
    </td>

    <!-- MAIN IMAGE -->
    <td>
<img src="{{ asset('storage/'.$product->main_photo) }}" class="product-img">   </td>

    <!-- RELATED IMAGES -->
    <td>
    @if(is_array($product->related_photos) && count($product->related_photos))
        @foreach($product->related_photos as $img)

            @php
                // If stored as array with key
                $imagePath = is_array($img) ? ($img['image'] ?? null) : $img;
            @endphp

            @if($imagePath)
                <img src="{{ asset('storage/'.$imagePath) }}"
                     style="width:40px;height:40px;object-fit:cover;border-radius:4px;margin:2px">
            @endif

        @endforeach
    @else
        -
    @endif
</td>

    <!-- ACTIONS -->
    <td class="actions">
        <a href="{{ route('admin.products.edit',$product->id) }}" class="btn btn-edit">Edit</a>
        <form action="{{ route('admin.products.destroy',$product->id) }}" method="POST" onsubmit="return confirm('Delete this product?')">
            @csrf
            @method('DELETE')
            <button class="btn btn-delete">Delete</button>
        </form>
    </td>
</tr>
@empty
<tr>
    <td colspan="14">No products found</td>
</tr>
@endforelse
</tbody>


        </table>
    </div>

<div class="pagination-wrapper">
    {{ $products->links('pagination::bootstrap-5') }}
</div>

</div>

<script>
let timer;

document.getElementById('productSearch').addEventListener('keyup', function () {

    clearTimeout(timer);

    let query = this.value;

    timer = setTimeout(() => {

        fetch("{{ route('admin.products.index') }}?search=" + query)
            .then(response => response.text())
            .then(data => {

                let parser = new DOMParser();
                let htmlDoc = parser.parseFromString(data, 'text/html');

                document.querySelector("tbody").innerHTML =
                    htmlDoc.querySelector("tbody").innerHTML;

                document.querySelector(".pagination-wrapper").innerHTML =
                    htmlDoc.querySelector(".pagination-wrapper").innerHTML;

            });

    }, 300);
});
</script>
@endsection
