    @extends('layouts.app')

    @section('content')

    <div class="processing-page">
        <div class="processing-spinner"></div>
        <h2>Confirming your order…</h2>
        <p id="processingText">Please wait a moment.</p>
    </div>

    <script>
    /* =========================================================
    This page has NOTHING clickable or typeable on it on purpose —
    just a spinner. It does the order-confirmation fetch in the
    background, then redirects to the real success page once done.
    ========================================================= */

    const paymentId = @json($paymentId);
    const processingText = document.getElementById('processingText');
    const MIN_VISIBLE_MS = 1200; // don't let this flash by too fast to read
    const startedAt = Date.now();

    function confirmOrder(attempt){

        fetch("{{ route('razorpay.success') }}", {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": "{{ csrf_token() }}",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ razorpay_payment_id: paymentId })
        })
        .then(res => res.json())
        .then(result => {

            if(result.success){
                processingText.textContent = 'Order confirmed! Redirecting…';

                const elapsed = Date.now() - startedAt;
                const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

                setTimeout(() => {
                    window.location.href = result.redirect_url;
                }, remaining);

            } else if (attempt < 3) {
                processingText.textContent = 'Still confirming your order…';
                setTimeout(() => confirmOrder(attempt + 1), 1500);
            } else {
                showFailure();
            }

        })
        .catch(() => {
            if (attempt < 3) {
                setTimeout(() => confirmOrder(attempt + 1), 1500);
            } else {
                showFailure();
            }
        });
    }

    function showFailure(){
        processingText.innerHTML =
            'Your payment was received, but confirming the order is taking longer than expected.<br>' +
            'Please do not pay again — contact support with Payment ID: <strong>' + paymentId + '</strong>';
    }

    confirmOrder(0);
    </script>

    <style>
    .processing-page{
        max-width:480px;
        margin:100px auto;
        text-align:center;
        background:#fff;
        padding:40px 30px;
        border-radius:18px;
        box-shadow:0 20px 40px rgba(0,0,0,.08);
    }

    .processing-page h2{
        margin:20px 0 8px;
        color:#111827;
    }

    .processing-page p{
        color:#4b5563;
        font-size:14px;
        line-height:1.6;
    }

    .processing-spinner{
        width:56px;
        height:56px;
        border:5px solid #e5e7eb;
        border-top-color:#16a34a;
        border-radius:50%;
        margin:0 auto;
        animation:spin .8s linear infinite;
    }

    @keyframes spin{
        to{ transform:rotate(360deg); }
    }
    </style>

    @endsection
