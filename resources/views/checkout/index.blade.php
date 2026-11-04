@extends('layouts.app')

@section('content')

@if(session('error'))
<div style="max-width:1200px;margin:20px auto 0;padding:14px 18px;background:#fee2e2;border:1px solid #fca5a5;color:#991b1b;border-radius:10px;">
    ⚠️ {{ session('error') }}
</div>
@endif

<div class="checkout-container">

<!-- RIGHT : ORDER SUMMARY -->
<div class="checkout-summary card-animate">
    <h3>🧾 Order Summary</h3>

    @foreach($cart as $item)
    <div class="summary-item">
        <span>{{ $item['name'] }} × {{ $item['qty'] }}</span>
        <span>₹{{ $item['price'] * $item['qty'] }}</span>
    </div>
    @endforeach

    <hr>

    <div class="summary-row">
        <span>Subtotal</span>
        <span>₹{{ $subtotal }}</span>
    </div>

    <div class="summary-row">
        <span>Shipping</span>
        <span>₹{{ $shipping }}</span>
    </div>

    <div class="summary-total">
        <span>Total</span>
        <span>₹{{ $total }}</span>
    </div>

    <!-- DELIVERY INFO -->
    <div class="delivery-info">
        <div class="delivery-icon">🚚</div>
        <div class="delivery-text">
            <strong>Estimated Delivery:</strong><br>
            3 to 5 Working Days via <b>Indian Post</b>
        </div>
    </div>

</div>

<!-- LEFT : CUSTOMER FORM -->
<div class="checkout-form card-animate">

    <h3>📦 Billing Details</h3>

    <input type="text" id="name" placeholder="Full Name">
    <input type="email" id="email" placeholder="Email">
    <input type="text" id="phone" placeholder="Mobile Number">

    <input type="text" value="India" disabled>

    <input type="text" id="state" placeholder="State">
    <input type="text" id="district" placeholder="District">
    <input type="text" id="mandal" placeholder="Mandal">

    <input type="text" id="door_no" placeholder="House No">
    <textarea id="address" placeholder="Full Address"></textarea>
    <input type="text" id="pincode" placeholder="Pin Code">

    <button type="button" id="payBtn" class="checkout-btn">
        Pay ₹{{ $total }}
    </button>

</div>
</div>

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<script>
/* =========================================================
   ✅ FINAL VERSION: no JS handler, no processing page redirect.
   callback_url + redirect:true makes Razorpay POST the payment
   result straight to CheckoutController@callback for every
   payment method, on both mobile and desktop — that's what
   actually confirms the order and redirects to the success page.
   ========================================================= */

document.getElementById('payBtn').addEventListener('click', function () {

    // GET VALUES
    let name      = document.getElementById('name');
    let email     = document.getElementById('email');
    let phone     = document.getElementById('phone');
    let state     = document.getElementById('state');
    let district  = document.getElementById('district');
    let mandal    = document.getElementById('mandal');
    let door_no   = document.getElementById('door_no');
    let address   = document.getElementById('address');
    let pincode   = document.getElementById('pincode');

    let fields = [name,email,phone,state,district,mandal,door_no,address,pincode];

    // RESET STYLES
    fields.forEach(f => f.style.border = '1px solid #ccc');

    // VALIDATION
    let hasError = false;

    fields.forEach(f => {
        if (f.value.trim() === '') {
            f.style.border = '2px solid red';
            hasError = true;
        }
    });

    // EMAIL VALIDATION
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        email.style.border = '2px solid red';
        alert("❌ Please enter a valid email address");
        return;
    }

    // PHONE VALIDATION (10 DIGITS)
    if (!/^[6-9]\d{9}$/.test(phone.value)) {
        phone.style.border = '2px solid red';
        alert("❌ Enter valid 10-digit mobile number");
        return;
    }

    // PINCODE VALIDATION
    if (!/^\d{6}$/.test(pincode.value)) {
        pincode.style.border = '2px solid red';
        alert("❌ Enter valid 6-digit pincode");
        return;
    }

    if (hasError) {
        alert("❌ Please fill all required fields");
        return; // ❌ STOP HERE – Razorpay WON’T open
    }

    // ✅ ALL VALID – CONTINUE PAYMENT
    fetch("{{ route('checkout.pay') }}",{
        method:"POST",
        headers:{
            "X-CSRF-TOKEN":"{{ csrf_token() }}",
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            name: name.value,
            email: email.value,
            phone: phone.value,
            state: state.value,
            district: district.value,
            mandal: mandal.value,
            door_no: door_no.value,
            address: address.value,
            pincode: pincode.value
        })
    })
    .then(res => res.json())
    .then(data => {

        let options = {
            key: data.key,
            amount: data.amount,
            currency: "INR",
            order_id: data.order_id,
            name: "Sri Chaitanya Books",
            description: "Order Payment",

            // ✅ Every payment method (card, UPI, netbanking, wallet)
            // now redirects here after payment, on mobile and desktop.
            callback_url: "{{ route('razorpay.callback') }}",
            redirect: true
        };

        new Razorpay(options).open();
    });

});
</script>

<style>
body{
    background:#f4f7fb;
}

.delivery-info{
    margin-top:20px;
    background:linear-gradient(135deg,#f0f9ff,#e0f2fe);
    padding:15px;
    border-radius:12px;
    display:flex;
    align-items:center;
    gap:12px;
    border:1px solid #bae6fd;
    animation:fadeInUp .6s ease;
}

.delivery-icon{
    font-size:28px;
}

.delivery-text{
    font-size:14px;
    color:#0f172a;
    line-height:1.5;
}

.delivery-text strong{
    font-size:15px;
    color:#0369a1;
}

@keyframes fadeInUp{
    from{
        opacity:0;
        transform:translateY(10px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}

.checkout-container{
    max-width:1200px;
    margin:40px auto;
    display:flex;
    gap:30px;
    align-items:flex-start;
}

.checkout-form,
.checkout-summary{
    background:#fff;
    padding:28px;
    border-radius:18px;
    box-shadow:0 20px 40px rgba(0,0,0,.08);
    transition:all .35s ease;
}

.card-animate{
    animation:fadeUp .6s ease forwards;
}

@keyframes fadeUp{
    from{opacity:0; transform:translateY(30px);}
    to{opacity:1; transform:translateY(0);}
}

.checkout-form{
    flex:2;
}

.checkout-form h3{
    margin-bottom:18px;
    color:#1f2937;
}

.checkout-form input,
.checkout-form textarea{
    width:100%;
    margin-bottom:14px;
    padding:13px 14px;
    border-radius:10px;
    border:1px solid #d1d5db;
    transition:.3s;
    font-size:15px;
}

.checkout-form input:focus,
.checkout-form textarea:focus{
    border-color:#4f46e5;
    box-shadow:0 0 0 3px rgba(79,70,229,.15);
    outline:none;
}

.checkout-btn{
    margin-top:10px;
    width:100%;
    padding:15px;
    font-size:18px;
    font-weight:600;
    color:#fff;
    background:linear-gradient(135deg,#22c55e,#16a34a);
    border:none;
    border-radius:35px;
    cursor:pointer;
    transition:.35s;
    position:relative;
    overflow:hidden;
}

.checkout-btn:hover{
    transform:translateY(-2px);
    box-shadow:0 12px 25px rgba(34,197,94,.35);
}

.checkout-btn:active{
    transform:scale(.98);
}

.checkout-summary{
    flex:1;
    position:sticky;
    top:30px;
}

.checkout-summary h3{
    margin-bottom:18px;
    color:#1f2937;
}

.summary-item,
.summary-row,
.summary-total{
    display:flex;
    justify-content:space-between;
    margin-bottom:12px;
    color:#374151;
}

.summary-item span:last-child{
    font-weight:600;
}

.summary-total{
    margin-top:14px;
    padding-top:14px;
    border-top:2px dashed #e5e7eb;
    font-size:20px;
    font-weight:700;
    color:#111827;
}

@media(max-width:900px){
    .checkout-container{
        flex-direction:column-reverse;
    }

    .checkout-summary{
        position:relative;
        top:0;
    }
}
</style>

@endsection
