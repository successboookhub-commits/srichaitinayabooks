@extends('admin.layout')

@section('content')

<style>
.product-form{
    max-width:1200px;
    margin:40px auto;
    background:#ffffff;
    padding:35px;
    border-radius:16px;
    box-shadow:0 15px 35px rgba(0,0,0,.06);
}

.product-form h2{
    margin-bottom:25px;
    font-size:24px;
    font-weight:700;
    color:#222;
}

.form-grid{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:25px;
}

.form-group{
    display:flex;
    flex-direction:column;
}

.form-group.full{
    grid-column:1 / -1;
}

label{
    font-size:14px;
    margin-bottom:6px;
    font-weight:600;
    color:#444;
}

input, select, textarea{
    padding:11px 12px;
    border:1px solid #dcdcdc;
    border-radius:8px;
    font-size:14px;
    transition:.3s;
    background:#f9fafc;
}

input:focus, textarea:focus, select:focus{
    outline:none;
    border-color:#0d6efd;
    background:#fff;
    box-shadow:0 0 0 3px rgba(13,110,253,.1);
}

textarea{
    resize:vertical;
    min-height:110px;
}

.category-select{
    height:130px;
}

.hint{
    font-size:12px;
    color:#666;
    margin-top:4px;
}

.switch{
    display:flex;
    align-items:center;
    gap:10px;
    margin-top:15px;
}

.switch input{
    width:40px;
    height:20px;
    appearance:none;
    background:#ccc;
    border-radius:20px;
    position:relative;
    cursor:pointer;
    transition:.3s;
}

.switch input:checked{
    background:#0d6efd;
}

.switch input:before{
    content:'';
    position:absolute;
    width:18px;
    height:18px;
    background:#fff;
    border-radius:50%;
    top:1px;
    left:2px;
    transition:.3s;
}

.switch input:checked:before{
    left:20px;
}

.images{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    margin-top:10px;
}

.images img{
    width:80px;
    height:80px;
    object-fit:cover;
    border-radius:10px;
    border:1px solid #ddd;
    transition:.3s;
}

.images img:hover{
    transform:scale(1.05);
}

.submit-btn{
    margin-top:30px;
    background:linear-gradient(45deg,#0d6efd,#2563eb);
    color:#fff;
    border:none;
    padding:14px 25px;
    font-size:15px;
    border-radius:10px;
    cursor:pointer;
    transition:.3s;
}

.submit-btn:hover{
    transform:translateY(-2px);
    box-shadow:0 8px 20px rgba(13,110,253,.3);
}

@media(max-width:768px){
    .form-grid{
        grid-template-columns:1fr;
    }
}
</style>

<div class="product-form">
    <h2>Edit Product</h2>

    <form action="{{ route('admin.products.update',$product->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="form-grid">

            <div class="form-group">
    <label>Publication</label>
    <select name="publication_id">
        <option value="">Select Publication</option>

        @foreach($publications as $pub)
            <option value="{{ $pub->id }}"
                {{ $product->publication_id == $pub->id ? 'selected' : '' }}>
                {{ $pub->name }}
            </option>
        @endforeach

    </select>
</div>

            <!-- Categories -->
            <div class="form-group">
                <label>Categories *</label>
                <select name="category_ids[]" multiple required class="category-select">
                    @foreach($categories as $cat)
                        <option value="{{ $cat->id }}"
                            {{ in_array($cat->id, old('category_ids', $product->category_ids ?? [])) ? 'selected' : '' }}>
                            {{ $cat->name }}
                        </option>
                    @endforeach
                </select>
            </div>

            <!-- Product Name -->
            <div class="form-group">
                <label>Product Name *</label>
                <input type="text" name="name" value="{{ old('name',$product->name) }}" required>
            </div>

            <!-- Old Price -->
            <div class="form-group">
                <label>Old Price (₹)</label>
                <input type="number" id="old_price" name="old_price" value="{{ $product->old_price }}">
            </div>

            <!-- Discount -->
            <div class="form-group">
                <label>Discount (%)</label>
                <input type="number" id="discount" name="discount" value="{{ $product->discount }}">
            </div>

            <!-- Total Price -->
            <div class="form-group">
                <label>Total Price (₹)</label>
                <input type="number" id="total_price" name="total_price" value="{{ $product->total_price }}" readonly>
            </div>

            <!-- Quantity -->
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" value="{{ $product->quantity }}">
            </div>

            <!-- WEIGHT TYPE (NEW) -->
            <div class="form-group">
                <label>Weight Type *</label>
                <select name="weight_type" id="weight_type" required
                        data-rate="{{ config('shipping.rate_per_kg') }}"
                        data-weightless-charge="{{ config('shipping.weightless_base_charge') }}">
                    <option value="weight" {{ old('weight_type', $product->is_weightless ? 'weightless' : 'weight') == 'weight' ? 'selected' : '' }}>
                        By Weight (KG)
                    </option>
                    <option value="weightless" {{ old('weight_type', $product->is_weightless ? 'weightless' : 'weight') == 'weightless' ? 'selected' : '' }}>
                        Weight Less
                    </option>
                </select>
            </div>

            <!-- Weight -->
            <div class="form-group" id="weight_field_wrapper">
                <label>Weight (KG)</label>
                <input type="number" step="0.01" id="weight" name="weight" value="{{ old('weight', $product->weight) }}">
            </div>

            <!-- Shipping -->
            <div class="form-group">
                <label>Shipping Charge (₹)</label>
                <input type="number" id="shipping_charge" name="shipping_charge" step="0.01" value="{{ $product->shipping_charge }}">
                <span class="hint" id="shipping_hint"></span>
            </div>

            <!-- Main Photo -->
            <div class="form-group">
                <label>Main Photo</label>
                <input type="file" name="main_photo">
                <div class="images">
                    <img src="{{ asset('storage/'.$product->main_photo) }}">
                </div>
            </div>

            <!-- Related Photos -->
            <div class="form-group">
                <label>Related Photos</label>
                <input type="file" name="related_photos[]" multiple>
                <div class="images">
                    @if($product->related_photos)
                        @foreach($product->related_photos as $photo)
                            <img src="{{ asset('storage/'.$photo) }}">
                        @endforeach
                    @endif
                </div>
            </div>

            <!-- Description -->
            <div class="form-group full">
                <label>Description</label>
                <textarea name="description">{{ $product->description }}</textarea>
            </div>

            <!-- Featured -->
            <div class="form-group switch">
                <input type="checkbox" name="is_featured" {{ $product->is_featured?'checked':'' }}>
                <label>Is Featured</label>
            </div>

            <!-- Active -->
            <div class="form-group switch">
                <input type="checkbox" name="is_active" {{ $product->is_active?'checked':'' }}>
                <label>Is Active</label>
            </div>

        </div>

        <button class="submit-btn">Update Product</button>
    </form>
</div>

<script>
const oldPrice = document.getElementById('old_price');
const discount = document.getElementById('discount');
const total    = document.getElementById('total_price');

function calcPrice(){
    let p = parseFloat(oldPrice.value) || 0;
    let d = parseFloat(discount.value) || 0;
    total.value = (p - (p*d/100)).toFixed(2);
}

oldPrice.addEventListener('input', calcPrice);
discount.addEventListener('input', calcPrice);

// ---- weight type / shipping calc (NEW, standardized rate — was 60/kg here vs 70/kg on Add page) ----
const weightType    = document.getElementById('weight_type');
const weightField   = document.getElementById('weight');
const weightWrapper = document.getElementById('weight_field_wrapper');
const shipping      = document.getElementById('shipping_charge');
const shippingHint  = document.getElementById('shipping_hint');

const ratePerKg        = parseFloat(weightType.dataset.rate) || 70;
const weightlessCharge = parseFloat(weightType.dataset.weightlessCharge) || 40;

function calcShip(userTriggered){
    if (weightType.value === 'weightless') {
        weightWrapper.style.display = 'none';
        shipping.readOnly = false;
        shippingHint.textContent = 'Flat "Weight Less" shipping — you can override this value.';
        // Only auto-fill the flat charge when the admin actively switches
        // to Weight Less, so we don't clobber a manually-set value on page load.
        if (userTriggered) {
            shipping.value = weightlessCharge.toFixed(2);
        }
    } else {
        weightWrapper.style.display = '';
        shipping.readOnly = true;
        shipping.value = ((weightField.value || 0) * ratePerKg).toFixed(2);
        shippingHint.textContent = '';
    }
}

weightType.addEventListener('change', () => calcShip(true));
weightField.addEventListener('input', () => calcShip(false));

// initial state on page load — don't overwrite the saved shipping_charge
calcShip(false);
</script>

@endsection
