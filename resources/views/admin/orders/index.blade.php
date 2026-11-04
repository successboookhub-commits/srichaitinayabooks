@extends('admin.layout')

@section('content')

<style>
.orders-wrapper{
    padding:20px;
    background:#f4f6fb;
}

.orders-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
}

.orders-header h2{
    margin:0;
    font-size:22px;
}

.table-wrap{
    background:#fff;
    border-radius:12px;
    overflow:auto;
    box-shadow:0 5px 15px rgba(0,0,0,.05);
}

.orders-table{
    width:100%;
    border-collapse:collapse;
    min-width:1050px;
}

.orders-table thead{
    background:#111;
    color:#fff;
}

.orders-table th,
.orders-table td{
    padding:12px;
    text-align:center;
    font-size:14px;
    border-bottom:1px solid #eee;
}

.orders-table tbody tr:hover{
    background:#f8f9fa;
}

/* BADGES */
.badge{
    padding:5px 12px;
    border-radius:20px;
    font-size:12px;
    font-weight:600;
}

.badge-pending{background:#ffc107;}
.badge-paid{background:#198754;color:#fff;}
.badge-cancel{background:#dc3545;color:#fff;}

.badge-ordered{background:#6c757d;color:#fff;}
.badge-processing{background:#0d6efd;color:#fff;}
.badge-packing{background:#fd7e14;color:#fff;}
.badge-shipped{background:#20c997;color:#fff;}
.badge-delivered{background:#198754;color:#fff;}

/* ACTION BUTTONS */
.actions{
    display:flex;
    gap:6px;
    justify-content:center;
    flex-wrap:wrap;
}

.btn{
    padding:6px 10px;
    font-size:13px;
    border-radius:6px;
    border:none;
    cursor:pointer;
    text-decoration:none;
    display:inline-block;
}

.btn-view{background:#0dcaf0;color:#000;}
.btn-download{background:#198754;color:#fff;}
.btn-primary{background:#0d6efd;color:#fff;}
.btn-outline{background:#fff;color:#111;border:1px solid #ccc;}
.btn-scan{background:#111;color:#fff;}

/* DROPDOWN */
.status-dropdown{
    width:100%;
    margin-top:5px;
    padding:4px;
    font-size:12px;
    border-radius:6px;
    border:1px solid #ddd;
    background:#f9fafb;
}

/* MOBILE */
@media(max-width:768px){
    .orders-header{
        flex-direction:column;
        gap:10px;
        align-items:flex-start;
    }
}

.search-box{
    margin-bottom:15px;
}

.search-box input{
    width:100%;
    max-width:400px;
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

/* filter bar + bulk action bar */
.filter-bar{
    background:#fff;
    padding:15px;
    border-radius:12px;
    box-shadow:0 5px 15px rgba(0,0,0,.05);
    margin-bottom:15px;
    display:flex;
    flex-wrap:wrap;
    gap:12px;
    align-items:flex-end;
}

.filter-bar .field label{
    display:block;
    font-size:12px;
    font-weight:600;
    color:#555;
    margin-bottom:4px;
}

.filter-bar .field input{
    padding:8px 10px;
    border-radius:8px;
    border:1px solid #ddd;
    font-size:13px;
}

.bulk-bar{
    background:#fff;
    padding:15px;
    border-radius:12px;
    box-shadow:0 5px 15px rgba(0,0,0,.05);
    margin-bottom:15px;
    display:flex;
    flex-wrap:wrap;
    gap:12px;
    align-items:flex-end;
}

.bulk-bar .field label{
    display:block;
    font-size:12px;
    font-weight:600;
    color:#555;
    margin-bottom:4px;
}

.bulk-bar select,
.bulk-bar input{
    padding:8px 10px;
    border-radius:8px;
    border:1px solid #ddd;
    font-size:13px;
}

.bulk-bar .divider{
    width:1px;
    background:#eee;
    align-self:stretch;
    margin:0 4px;
}

.bulk-count{
    font-size:12px;
    color:#666;
}

.select-check{
    width:16px;
    height:16px;
}
</style>

<div class="orders-wrapper">

    <div class="orders-header">
        <h2>Orders List</h2>
        {{-- ✅ ADDED: link to the new scan lookup page --}}
        <a href="{{ route('admin.orders.scan') }}" class="btn btn-scan">📷 Scan Barcode</a>
    </div>

    <div class="search-box">
        <input type="text" id="orderSearch" value="{{ $search ?? '' }}" placeholder="🔍 Search Order ID, Code, Customer, Product...">
    </div>

    {{-- date/time range filter for the list itself --}}
    <form method="GET" action="{{ route('admin.orders.index') }}" class="filter-bar">
        <input type="hidden" name="search" id="filterSearchHidden" value="{{ $search ?? '' }}">

        <div class="field">
            <label>From</label>
            <input type="datetime-local" name="date_from" value="{{ $dateFrom ?? '' }}">
        </div>

        <div class="field">
            <label>To</label>
            <input type="datetime-local" name="date_to" value="{{ $dateTo ?? '' }}">
        </div>

        <button type="submit" class="btn btn-primary">Filter</button>
        <a href="{{ route('admin.orders.index') }}" class="btn btn-outline">Clear</a>
    </form>

    {{-- bulk actions — selected orders or a whole date range --}}
    <div class="bulk-bar">

        <div class="field">
            <label>Set status for selected</label>
            <select id="bulkStatusSelect">
                @foreach(\App\Models\Order::getOrderStatuses() as $status)
                    <option value="{{ $status }}">{{ $status }}</option>
                @endforeach
            </select>
        </div>

        <button type="button" class="btn btn-primary" onclick="applyBulkStatusToSelected()">
            Apply to Selected
        </button>

        <button type="button" class="btn btn-download" onclick="printSelectedLabels()">
            🖨 Print Selected Labels
        </button>

        <span class="bulk-count"><span id="selectedCount">0</span> selected</span>

        <div class="divider"></div>

        <div class="field">
            <label>Or by date range</label>
            <input type="datetime-local" id="rangeFrom">
        </div>

        <div class="field">
            <label>&nbsp;</label>
            <input type="datetime-local" id="rangeTo">
        </div>

        <div class="field">
            <label>New status</label>
            <select id="rangeStatusSelect">
                @foreach(\App\Models\Order::getOrderStatuses() as $status)
                    <option value="{{ $status }}">{{ $status }}</option>
                @endforeach
            </select>
        </div>

        <button type="button" class="btn btn-primary" onclick="applyBulkStatusByDate()">
            Apply to Date Range
        </button>

        <button type="button" class="btn btn-download" onclick="printLabelsByDate()">
            🖨 Print Labels for Range
        </button>

    </div>

    {{-- Hidden forms actually submitted by the JS above --}}
    <form id="bulkStatusForm" method="POST" action="{{ route('admin.orders.bulkStatus') }}" style="display:none;">
        @csrf
    </form>

    <form id="bulkStatusByDateForm" method="POST" action="{{ route('admin.orders.bulkStatusByDate') }}" style="display:none;">
        @csrf
    </form>

    <div class="table-wrap">
        <table class="orders-table">
            <thead>
                <tr>
                    <th><input type="checkbox" id="selectAll" class="select-check"></th>
                    <th>ID</th>
                    <th>Order Code</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Total ₹</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Order Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
            @forelse($orders as $order)
            <tr>
                <td>
                    <input type="checkbox" class="select-check row-check" value="{{ $order->id }}">
                </td>
                <td>{{ $order->id }}</td>
                <td>{{ $order->order_code }}</td>
                <td>{{ $order->customer->name ?? '-' }}</td>
                <td>{{ $order->customer->phone ?? '-' }}</td>
                <td>{{ $order->formatted_total }}</td>

                {{-- Payment Status --}}
                <td>
                    <span class="badge {{ $order->status_badge }}">
                        {{ $order->status }}
                    </span>
                </td>

                {{-- Date --}}
                <td>{{ $order->created_at->format('d M Y, h:i A') }}</td>

                {{-- Order Status --}}
                <td>
                    <span class="badge {{ $order->order_status_badge }}">
                        {{ $order->order_status }}
                    </span>

                    {{-- Update Dropdown (single order — unchanged, its own form) --}}
                    <form action="{{ route('admin.orders.updateOrderStatus', $order->id) }}" method="POST">
                        @csrf
                        @method('PUT')

                        <select name="order_status" onchange="this.form.submit()" class="status-dropdown">
                            @foreach(\App\Models\Order::getOrderStatuses() as $status)
                                <option value="{{ $status }}" {{ $order->order_status == $status ? 'selected' : '' }}>
                                    {{ $status }}
                                </option>
                            @endforeach
                        </select>
                    </form>
                </td>

                {{-- Actions --}}
                <td class="actions">
                    <a href="{{ route('admin.orders.show',$order->id) }}" class="btn btn-view">View</a>
                    <a href="{{ route('admin.orders.download',$order->id) }}" class="btn btn-download">Download</a>
                    <a href="{{ route('admin.orders.printLabel', $order->id) }}" target="_blank" class="btn btn-primary">
                        🖨 Label
                    </a>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="10">No orders found</td>
            </tr>
            @endforelse
            </tbody>

        </table>
    </div>

   <div class="pagination-wrapper">
    {{ $orders->links('pagination::bootstrap-5') }}
</div>

</div>


<script>
let timer;

document.getElementById('orderSearch').addEventListener('keyup', function () {

    clearTimeout(timer);

    let query = this.value;
    document.getElementById('filterSearchHidden').value = query;

    timer = setTimeout(() => {

        fetch("{{ route('admin.orders.index') }}?search=" + encodeURIComponent(query))
            .then(res => res.text())
            .then(data => {

                let parser = new DOMParser();
                let html = parser.parseFromString(data, 'text/html');

                document.querySelector("tbody").innerHTML =
                    html.querySelector("tbody").innerHTML;

                document.querySelector(".pagination-wrapper").innerHTML =
                    html.querySelector(".pagination-wrapper").innerHTML;

                bindRowCheckboxes();
                updateSelectedCount();

            });

    }, 300);
});

/* =========================================================
   bulk selection + bulk actions
   ========================================================= */

function bindRowCheckboxes(){
    document.querySelectorAll('.row-check').forEach(cb => {
        cb.removeEventListener('change', updateSelectedCount);
        cb.addEventListener('change', updateSelectedCount);
    });
}

function getSelectedIds(){
    return Array.from(document.querySelectorAll('.row-check:checked'))
        .map(cb => cb.value);
}

function updateSelectedCount(){
    document.getElementById('selectedCount').textContent = getSelectedIds().length;
}

document.getElementById('selectAll').addEventListener('change', function () {
    document.querySelectorAll('.row-check').forEach(cb => cb.checked = this.checked);
    updateSelectedCount();
});

bindRowCheckboxes();

function applyBulkStatusToSelected(){
    const ids = getSelectedIds();

    if(ids.length === 0){
        alert('Select at least one order first.');
        return;
    }

    const status = document.getElementById('bulkStatusSelect').value;

    if(!confirm(`Set status "${status}" for ${ids.length} selected order(s)?`)) return;

    const form = document.getElementById('bulkStatusForm');

    form.querySelectorAll('input[name="order_ids[]"], input[name="order_status"]').forEach(el => el.remove());

    ids.forEach(id => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'order_ids[]';
        input.value = id;
        form.appendChild(input);
    });

    const statusInput = document.createElement('input');
    statusInput.type = 'hidden';
    statusInput.name = 'order_status';
    statusInput.value = status;
    form.appendChild(statusInput);

    form.submit();
}

function applyBulkStatusByDate(){
    const from = document.getElementById('rangeFrom').value;
    const to   = document.getElementById('rangeTo').value;
    const status = document.getElementById('rangeStatusSelect').value;

    if(!from || !to){
        alert('Pick both a "from" and "to" date/time.');
        return;
    }

    if(!confirm(`Set status "${status}" for ALL orders between ${from} and ${to}?`)) return;

    const form = document.getElementById('bulkStatusByDateForm');
    form.querySelectorAll('input').forEach(el => {
        if(el.name !== '_token') el.remove();
    });

    [['date_from', from], ['date_to', to], ['order_status', status]].forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    });

    form.submit();
}

function printSelectedLabels(){
    const ids = getSelectedIds();

    if(ids.length === 0){
        alert('Select at least one order first.');
        return;
    }

    const url = "{{ route('admin.orders.printLabelsBulk') }}?ids=" + ids.join(',');
    window.open(url, '_blank');
}

function printLabelsByDate(){
    const from = document.getElementById('rangeFrom').value;
    const to   = document.getElementById('rangeTo').value;

    if(!from || !to){
        alert('Pick both a "from" and "to" date/time.');
        return;
    }

    const url = "{{ route('admin.orders.printLabelsBulk') }}?date_from=" + encodeURIComponent(from) + "&date_to=" + encodeURIComponent(to);
    window.open(url, '_blank');
}
</script>

@endsection
