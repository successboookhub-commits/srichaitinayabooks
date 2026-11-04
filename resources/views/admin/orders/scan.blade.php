@extends('admin.layout')

@section('content')

<style>
.scan-wrapper{
    max-width:1000px;
    margin:0 auto;
    padding:20px;
}

.scan-header{
    margin-bottom:20px;
}

.scan-header h2{
    margin:0 0 4px;
    font-size:22px;
}

.scan-header p{
    margin:0;
    color:#666;
    font-size:14px;
}

.scan-input-box{
    background:#fff;
    padding:20px;
    border-radius:14px;
    box-shadow:0 5px 15px rgba(0,0,0,.06);
    margin-bottom:20px;
}

.scan-input-row{
    display:flex;
    gap:10px;
    align-items:center;
}

.scan-input-box input{
    flex:1;
    padding:16px 18px;
    font-size:20px;
    letter-spacing:1px;
    border:2px solid #0d6efd;
    border-radius:10px;
    outline:none;
    box-sizing:border-box;
}

.scan-input-box input:focus{
    box-shadow:0 0 0 4px rgba(13,110,253,.15);
}

.btn-camera{
    padding:14px 18px;
    border-radius:10px;
    border:2px solid #111;
    background:#111;
    color:#fff;
    font-size:14px;
    cursor:pointer;
    white-space:nowrap;
}

.btn-camera.active{
    background:#dc3545;
    border-color:#dc3545;
}

#cameraBox{
    display:none;
    margin-top:14px;
    border-radius:12px;
    overflow:hidden;
    border:2px solid #111;
}

.scan-hint{
    font-size:12px;
    color:#888;
    margin-top:8px;
}

.scan-status{
    font-size:13px;
    margin-top:8px;
    font-weight:600;
}

.scan-status.error{ color:#dc3545; }
.scan-status.ok{ color:#198754; }

.result-card{
    background:#fff;
    border-radius:14px;
    box-shadow:0 5px 15px rgba(0,0,0,.06);
    padding:22px;
    margin-bottom:16px;
    animation:fadeIn .2s ease;
}

@keyframes fadeIn{
    from{ opacity:0; transform:translateY(-6px); }
    to{ opacity:1; transform:translateY(0); }
}

.result-top{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    flex-wrap:wrap;
    gap:10px;
    margin-bottom:14px;
    padding-bottom:14px;
    border-bottom:1px solid #eee;
}

.result-order-code{
    font-size:22px;
    font-weight:700;
    color:#111;
}

.result-date{
    font-size:13px;
    color:#777;
}

.badge{
    padding:5px 12px;
    border-radius:20px;
    font-size:12px;
    font-weight:600;
    display:inline-block;
}

.badge-paid{background:#198754;color:#fff;}
.badge-pending{background:#ffc107;}
.badge-cancel{background:#dc3545;color:#fff;}

.badge-ordered{background:#6c757d;color:#fff;}
.badge-processing{background:#0d6efd;color:#fff;}
.badge-packing{background:#fd7e14;color:#fff;}
.badge-shipped{background:#20c997;color:#fff;}
.badge-delivered{background:#198754;color:#fff;}

.section-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:20px;
    margin-bottom:16px;
}

@media(max-width:700px){
    .section-grid{ grid-template-columns:1fr; }
}

.result-section h4{
    margin:0 0 10px;
    font-size:13px;
    text-transform:uppercase;
    letter-spacing:.5px;
    color:#888;
    border-bottom:1px solid #f0f0f0;
    padding-bottom:6px;
}

.kv{
    display:flex;
    justify-content:space-between;
    font-size:14px;
    padding:4px 0;
    border-bottom:1px dashed #f2f2f2;
}

.kv span:first-child{ color:#666; }
.kv span:last-child{ font-weight:600; color:#111; text-align:right; }

.items-table{
    width:100%;
    border-collapse:collapse;
    font-size:14px;
}

.items-table th{
    text-align:left;
    padding:8px;
    background:#f4f6fb;
    font-size:12px;
    text-transform:uppercase;
    color:#666;
}

.items-table td{
    padding:8px;
    border-bottom:1px solid #f0f0f0;
}

.items-table th.num, .items-table td.num{
    text-align:right;
}

.result-total-row{
    text-align:right;
    font-size:17px;
    font-weight:700;
    margin-top:10px;
}

.btn-print{
    display:inline-block;
    margin-top:10px;
    padding:10px 18px;
    background:#0d6efd;
    color:#fff;
    border-radius:8px;
    text-decoration:none;
    font-size:14px;
}

.history-list{
    font-size:13px;
    color:#666;
}

.history-list span{
    display:inline-block;
    background:#eef2ff;
    color:#3730a3;
    padding:4px 10px;
    border-radius:20px;
    margin:0 6px 6px 0;
    cursor:pointer;
}
</style>

<div class="scan-wrapper">

    <div class="scan-header">
        <h2>📷 Scan Barcode</h2>
        <p>One scan fetches the full order — customer, products, payment, and shipping — automatically. No extra clicks.</p>
    </div>

    <div class="scan-input-box">

        <div class="scan-input-row">
            <input type="text" id="scanInput" placeholder="Scan or type order code (e.g. ORD202608248)..." autofocus autocomplete="off">
            <button type="button" class="btn-camera" id="cameraToggleBtn" onclick="toggleCamera()">📷 Use Camera</button>
        </div>

        <div id="cameraBox"></div>

        <div class="scan-hint">Cursor stays in the box automatically for a USB/keyboard-style scanner — just keep scanning, one after another. Pressing Enter is not required from you; the scanner does it for you.</div>
        <div id="scanStatus" class="scan-status"></div>
        <div class="history-list" id="historyList"></div>
    </div>

    <div id="resultsContainer"></div>

</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js"></script>
<script>
const scanInput = document.getElementById('scanInput');
const scanStatus = document.getElementById('scanStatus');
const resultsContainer = document.getElementById('resultsContainer');
const historyList = document.getElementById('historyList');
const cameraToggleBtn = document.getElementById('cameraToggleBtn');
const cameraBox = document.getElementById('cameraBox');
const scannedCodes = [];

let html5QrCode = null;
let cameraActive = false;

/* =========================================================
   KEYBOARD / USB SCANNER
   A USB or "keyboard emulation" scanner types the barcode then
   sends Enter automatically — this is what triggers the lookup.
   No Search button, no extra click, exactly as required.
   ========================================================= */

document.addEventListener('click', function (e) {
    // don't steal focus away from the camera controls while it's open
    if (!cameraActive) scanInput.focus();
});
window.addEventListener('load', () => scanInput.focus());

scanInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        lookup(scanInput.value.trim());
        scanInput.value = '';
    }
});

/* =========================================================
   CAMERA / MOBILE SCANNER (optional, toggled on demand)
   ========================================================= */

function toggleCamera(){
    if (cameraActive) {
        stopCamera();
    } else {
        startCamera();
    }
}

function startCamera(){
    cameraBox.style.display = 'block';
    cameraBox.innerHTML = '<div id="cameraReader" style="width:100%"></div>';
    cameraToggleBtn.textContent = '⏹ Stop Camera';
    cameraToggleBtn.classList.add('active');
    cameraActive = true;

    html5QrCode = new Html5Qrcode("cameraReader");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            lookup(decodedText.trim());
            // brief pause so the same label isn't scanned 10x per second
            html5QrCode.pause(true);
            setTimeout(() => { if (cameraActive) html5QrCode.resume(); }, 1500);
        },
        () => { /* ignore per-frame "no barcode found" noise */ }
    ).catch(() => {
        scanStatus.textContent = 'Could not access the camera. Check browser permissions.';
        scanStatus.className = 'scan-status error';
        stopCamera();
    });
}

function stopCamera(){
    if (html5QrCode) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
    }
    cameraBox.style.display = 'none';
    cameraBox.innerHTML = '';
    cameraToggleBtn.textContent = '📷 Use Camera';
    cameraToggleBtn.classList.remove('active');
    cameraActive = false;
    scanInput.focus();
}

/* =========================================================
   LOOKUP + RENDER
   ========================================================= */

function lookup(code){
    if (!code) return;

    scanStatus.textContent = 'Looking up ' + code + '…';
    scanStatus.className = 'scan-status';

    fetch("{{ route('admin.orders.scanLookup') }}?code=" + encodeURIComponent(code))
        .then(res => res.json())
        .then(data => {

            if (!data.found) {
                scanStatus.textContent = data.message || 'No order found for that barcode.';
                scanStatus.className = 'scan-status error';
                return;
            }

            scanStatus.textContent = 'Found order ' + data.order.order_code;
            scanStatus.className = 'scan-status ok';

            renderResult(data);
            addToHistory(data.order.order_code);
        })
        .catch(() => {
            scanStatus.textContent = 'Something went wrong looking that up. Try again.';
            scanStatus.className = 'scan-status error';
        });
}

function badgeClass(status){
    const map = {
        'Paid': 'badge-paid', 'Pending': 'badge-pending', 'Cancelled': 'badge-cancel',
        'Ordered': 'badge-ordered', 'Processing': 'badge-processing', 'Packing': 'badge-packing',
        'Shipped': 'badge-shipped', 'Delivered': 'badge-delivered',
    };
    return map[status] || 'badge-ordered';
}

function money(v){
    return (v === null || v === undefined) ? '-' : '₹' + v;
}

function renderResult(data){
    const o = data.order;
    const c = data.customer;
    const items = data.items;
    const pay = data.payment;
    const ship = data.shipping;

    let itemsRows = items.map(item => `
        <tr>
            <td>${escapeHtml(item.product_name)}</td>
            <td>${item.sku ? escapeHtml(item.sku) : '-'}</td>
            <td class="num">${item.qty}</td>
            <td class="num">${money(item.price)}</td>
            <td class="num">${money(item.discount)}</td>
            <td class="num">${money(item.total)}</td>
        </tr>
    `).join('');

    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
        <div class="result-top">
            <div>
                <div class="result-order-code">${escapeHtml(o.order_code)}</div>
                <div class="result-date">${escapeHtml(o.date)}</div>
            </div>
            <div>
                <span class="badge ${badgeClass(o.payment_status)}">${escapeHtml(o.payment_status)}</span>
                <span class="badge ${badgeClass(o.order_status)}">${escapeHtml(o.order_status)}</span>
            </div>
        </div>

        <div class="section-grid">

            <div class="result-section">
                <h4>1. Order Details</h4>
                <div class="kv"><span>Order ID</span><span>#${o.id}</span></div>
                <div class="kv"><span>Order Code</span><span>${escapeHtml(o.order_code)}</span></div>
                <div class="kv"><span>Order Date</span><span>${escapeHtml(o.date)}</span></div>
                <div class="kv"><span>Order Status</span><span>${escapeHtml(o.order_status)}</span></div>
                <div class="kv"><span>Payment Status</span><span>${escapeHtml(o.payment_status)}</span></div>
                <div class="kv"><span>Subtotal</span><span>${money(o.subtotal)}</span></div>
                <div class="kv"><span>Discount</span><span>${money(o.discount)}</span></div>
                <div class="kv"><span>Shipping Charge</span><span>${money(o.shipping)}</span></div>
                <div class="kv"><span>Tax/GST</span><span>${money(o.tax)}</span></div>
                <div class="kv"><span><strong>Grand Total</strong></span><span><strong>${money(o.grand_total)}</strong></span></div>
            </div>

            <div class="result-section">
                <h4>2. Customer Details</h4>
                <div class="kv"><span>Customer ID</span><span>#${c.id ?? '-'}</span></div>
                <div class="kv"><span>Name</span><span>${escapeHtml(c.name)}</span></div>
                <div class="kv"><span>Phone</span><span>${escapeHtml(c.phone)}</span></div>
                <div class="kv"><span>Email</span><span>${escapeHtml(c.email)}</span></div>
                <div class="kv"><span>Door/House No.</span><span>${escapeHtml(c.door_no)}</span></div>
                <div class="kv"><span>Address</span><span>${escapeHtml(c.address)}</span></div>
                <div class="kv"><span>Mandal/Area</span><span>${escapeHtml(c.mandal)}</span></div>
                <div class="kv"><span>District</span><span>${escapeHtml(c.district)}</span></div>
                <div class="kv"><span>State</span><span>${escapeHtml(c.state)}</span></div>
                <div class="kv"><span>Pincode</span><span>${escapeHtml(c.pincode)}</span></div>
            </div>

        </div>

        <div class="result-section" style="margin-bottom:16px;">
            <h4>3. Product Details</h4>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU/Code</th>
                        <th class="num">Qty</th>
                        <th class="num">Price</th>
                        <th class="num">Discount</th>
                        <th class="num">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>
            <div class="result-total-row">Grand Total: ${money(o.grand_total)}</div>
        </div>

        <div class="section-grid">

            <div class="result-section">
                <h4>4. Payment Details</h4>
                <div class="kv"><span>Method</span><span>${escapeHtml(pay.method)}</span></div>
                <div class="kv"><span>Status</span><span>${escapeHtml(pay.status)}</span></div>
                <div class="kv"><span>Transaction ID</span><span>${escapeHtml(pay.transaction_id)}</span></div>
                <div class="kv"><span>Paid Amount</span><span>${money(pay.paid_amount)}</span></div>
                <div class="kv"><span>Pending Amount</span><span>${money(pay.pending_amount)}</span></div>
                <div class="kv"><span>Payment Date</span><span>${escapeHtml(pay.payment_date)}</span></div>
            </div>

            <div class="result-section">
                <h4>5. Shipping Details</h4>
                <div class="kv"><span>Customer Name</span><span>${escapeHtml(ship.customer_name)}</span></div>
                <div class="kv"><span>Phone</span><span>${escapeHtml(ship.phone)}</span></div>
                <div class="kv"><span>Address</span><span>${escapeHtml(ship.address)}</span></div>
                <div class="kv"><span>Order Code</span><span>${escapeHtml(ship.order_code)}</span></div>
                <div class="kv"><span>Shipping Status</span><span>${escapeHtml(ship.status)}</span></div>
                <a href="${ship.print_label_url}" target="_blank" class="btn-print">🖨 Print Label</a>
            </div>

        </div>
    `;

    resultsContainer.insertBefore(card, resultsContainer.firstChild);
}

function addToHistory(code){
    if (scannedCodes.includes(code)) return;
    scannedCodes.unshift(code);

    historyList.innerHTML = 'Scanned this session: ' +
        scannedCodes.map(c => `<span onclick="lookup('${escapeJs(c)}')">${escapeHtml(c)}</span>`).join('');
}

function escapeHtml(str){
    return String(str ?? '').replace(/[&<>"']/g, m => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
}

function escapeJs(str){
    return String(str ?? '').replace(/'/g, "\\'");
}
</script>

@endsection
