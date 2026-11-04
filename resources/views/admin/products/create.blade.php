@extends('admin.layout')

@section('content')

@if ($errors->any())
<div style="background:#fee;padding:10px;border:1px solid red;margin-bottom:15px">
    <ul>
        @foreach ($errors->all() as $error)
            <li>{{ $error }}</li>
        @endforeach
    </ul>
</div>
@endif

<div class="container">
    <div class="header">
        <h2>Add Product</h2>
        <a href="{{ route('admin.products.index') }}" class="btn-back">← Back</a>
    </div>

    <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data" class="product-form">
        @csrf

        <div class="form-row">

             <div class="form-group">
                <label>Publication *</label>
                <select name="publication_id" required>
                    {{-- ✅ CHANGED: removed the blank "" option and added
                         'required' — the products table doesn't allow a
                         null publication_id, so this prevents submitting
                         the form without picking one (was previously
                         reaching the server and crashing with a SQL
                         "column cannot be null" error instead of a
                         normal validation message). --}}
                    <option value="" disabled {{ old('publication_id') ? '' : 'selected' }}>Select Publication</option>

                    @foreach($publications as $pub)
                        <option value="{{ $pub->id }}"
                            {{ old('publication_id') == $pub->id ? 'selected' : '' }}>
                            {{ $pub->name }}
                        </option>
                    @endforeach

                </select>
            </div>


            <!-- MULTI CATEGORY -->
    <div class="form-group full-width">
    <label>Categories *</label>

    <div class="category-box">
        <select name="category_ids[]" multiple required class="category-select">
            @foreach($categories as $cat)
                <option value="{{ $cat->id }}">{{ $cat->name }}</option>
            @endforeach
        </select>
        <span class="hint">Hold Ctrl (Windows) / Cmd (Mac) to select multiple</span>
    </div>
</div>


            <div class="form-group">
                <label>Product Name *</label>
                <input type="text" name="name" required>
            </div>

            <div class="form-group">
                <label>MRP (₹) *</label>
                <input type="number" name="old_price" id="old_price" required>
            </div>

            <div class="form-group">
                <label>Discount (%)</label>
                <input type="number" name="discount" id="discount">
            </div>

            <div class="form-group">
                <label>Total Price (₹)</label>
                <input type="number" name="total_price" id="total_price" readonly>
            </div>

            <div class="form-group">
                <label>Quantity *</label>
                <input type="number" name="quantity" required>
            </div>

            <!-- WEIGHT TYPE (NEW) -->
            <div class="form-group">
                <label>Weight Type *</label>
                <select name="weight_type" id="weight_type" required
                        data-rate="{{ config('shipping.rate_per_kg') }}"
                        data-weightless-charge="{{ config('shipping.weightless_base_charge') }}">
                    <option value="weight" {{ old('weight_type','weight') == 'weight' ? 'selected' : '' }}>
                        By Weight (KG)
                    </option>
                    <option value="weightless" {{ old('weight_type') == 'weightless' ? 'selected' : '' }}>
                        Weight Less
                    </option>
                </select>
            </div>

            <div class="form-group" id="weight_field_wrapper">
                <label>Weight (KG)</label>
                <input type="number" name="weight" id="weight" step="0.01" value="{{ old('weight') }}">
            </div>

            <div class="form-group">
                <label>Shipping (₹)</label>
                <input type="number" name="shipping_charge" id="shipping_charge" step="0.01" readonly>
                <span class="hint" id="shipping_hint"></span>
            </div>

            <div class="form-group">
                <label>Main Image *</label>
                <input type="file" name="main_photo" required>
            </div>

            <!-- FEATURED IMAGES WITH + BUTTON -->
            <div class="form-group full-width">
                <label>Featured Images</label>

                <div id="image-wrapper">
                    <div class="image-row">
                        <input type="file" name="related_photos[]" required>
                        <button type="button" class="btn-add" onclick="addImage()">＋</button>
                    </div>
                </div>
            </div>

            <div class="form-group full-width">
                <label>Description</label>
                <textarea name="description" rows="4"></textarea>
            </div>

          <!-- Is Featured -->
<input type="hidden" name="is_featured" value="0">
<label>
    <input type="checkbox" name="is_featured" value="1">
    Is Featured
</label>

<!-- Is Active -->
<input type="hidden" name="is_active" value="0">
<label>
    <input type="checkbox" name="is_active" value="1">
    Is Active
</label>


        </div>

        <div class="form-actions">
            <button class="btn-submit">Save Product</button>
        </div>
    </form>
</div>

<style>
    /* CATEGORY MULTI SELECT */
.category-box {
    position: relative;
}

.category-select {
    width: 100%;
    min-height: 140px;
    padding: 10px;
    border-radius: 10px;
    border: 1.5px solid #ccc;
    font-size: 14px;
    background: #fafafa;
    transition: 0.3s;
}

.category-select:hover {
    border-color: #d72c35;
}
.category-select:focus {
    outline: none;
    border-color: #d72c35;
    box-shadow: 0 0 8px rgba(215,44,53,0.25);
    background: #fff;
}

.category-select option {
    padding: 8px;
    margin: 2px 0;
    border-radius: 6px;
}

.category-select option:checked {
    background: #d72c35 linear-gradient(0deg, #d72c35 0%, #d72c35 100%);
    color: #fff;
}

.category-box .hint {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: #666;
}

.category-select::-webkit-scrollbar {
    width: 6px;
}
.category-select::-webkit-scrollbar-thumb {
    background: #d72c35;
    border-radius: 10px;
}

.container{
    max-width:900px;margin:30px auto;padding:20px;
    background:#fff;border-radius:12px;
    box-shadow:0 8px 25px rgba(0,0,0,.1);
    font-family:Segoe UI;
}
.header{display:flex;justify-content:space-between;margin-bottom:20px}
.header h2{color:#d72c35}
.btn-back{background:#6c757d;color:#fff;padding:8px 14px;border-radius:6px;text-decoration:none}

.form-row{display:flex;flex-wrap:wrap;gap:20px}
.form-group{flex:1 1 calc(50% - 20px);display:flex;flex-direction:column}
.full-width{flex:1 1 100%}
label{font-weight:600;margin-bottom:6px}
input,select,textarea{
    padding:10px;border-radius:6px;border:1px solid #ccc
}
.multi-select{height:120px}

.hint{
    font-size:12px;
    color:#666;
    margin-top:4px;
}

.toggle{flex-direction:row;align-items:center;gap:10px}

.image-row{display:flex;gap:10px;margin-bottom:8px}
.btn-add{
    background:#28a745;color:#fff;border:none;
    padding:8px 14px;border-radius:6px;
    cursor:pointer;font-size:18px
}
.btn-remove{
    background:#dc3545;color:#fff;border:none;
    padding:8px 14px;border-radius:6px;
}

.btn-submit{
    background:#d72c35;color:#fff;border:none;
    padding:12px 25px;border-radius:8px;font-size:16px
}

@media(max-width:768px){
    .form-group{flex:1 1 100%}
}
</style>

<script>
function addImage(){
    let wrapper = document.getElementById('image-wrapper');
    let div = document.createElement('div');
    div.className = 'image-row';
    div.innerHTML = `
        <input type="file" name="related_photos[]" required>
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">−</button>
    `;
    wrapper.appendChild(div);
}

// ---- price calc ----
const oldPrice = document.getElementById('old_price');
const discount = document.getElementById('discount');
const totalPrice = document.getElementById('total_price');

function calc(){
    let p = oldPrice.value || 0;
    let d = discount.value || 0;
    totalPrice.value = (p - (p*d/100)).toFixed(2);
}
oldPrice.oninput = discount.oninput = calc;

// ---- weight type / shipping calc (NEW) ----
const weightType   = document.getElementById('weight_type');
const weightField  = document.getElementById('weight');
const weightWrapper = document.getElementById('weight_field_wrapper');
const shipping     = document.getElementById('shipping_charge');
const shippingHint = document.getElementById('shipping_hint');

const ratePerKg          = parseFloat(weightType.dataset.rate) || 70;
const weightlessCharge   = parseFloat(weightType.dataset.weightlessCharge) || 40;

function calcShip(){
    if (weightType.value === 'weightless') {
        weightWrapper.style.display = 'none';
        weightField.value = '';
        shipping.value = weightlessCharge.toFixed(2);
        shipping.readOnly = false; // allow manual override for this specific product
        shippingHint.textContent = 'Flat "Weight Less" shipping — you can override this value.';
    } else {
        weightWrapper.style.display = '';
        shipping.readOnly = true;
        shipping.value = ((weightField.value || 0) * ratePerKg).toFixed(2);
        shippingHint.textContent = '';
    }
}

weightType.addEventListener('change', calcShip);
weightField.addEventListener('input', calcShip);

// run once on load in case of validation-error repopulation
calcShip();
</script>

@endsection
