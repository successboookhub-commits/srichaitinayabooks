@extends('admin.layout')

@section('content')
<style>
    .dashboard-wrap {
        font-family: 'Segoe UI', Arial, sans-serif;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 30px;
    }

    .card {
        background: #fff;
        border-radius: 14px;
        padding: 22px 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        border-left: 5px solid #d72c35;
        transition: transform 0.15s ease;
    }
    .card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.10);
    }

    .card h3 {
        font-size: 30px;
        margin: 0 0 4px;
        color: #1a1a1a;
        font-weight: 700;
    }
    .card p {
        margin: 0;
        color: #777;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .card.books    { border-left-color: #d72c35; }
    .card.categories { border-left-color: #2b6cb0; }
    .card.orders   { border-left-color: #111; }
    .card.users    { border-left-color: #2f855a; }

    .panel {
        background: #fff;
        padding: 22px;
        border-radius: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        margin-bottom: 25px;
    }

    .panel h4 {
        margin: 0 0 15px;
        font-size: 16px;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
    }

    .recent-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
    }
    .recent-table th {
        text-align: left;
        color: #888;
        font-size: 12px;
        text-transform: uppercase;
        padding: 8px 10px;
        border-bottom: 2px solid #eee;
    }
    .recent-table td {
        padding: 10px 10px;
        border-bottom: 1px solid #f2f2f2;
        color: #333;
    }
    .recent-table tr:hover td {
        background: #fafafa;
    }

    .badge {
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
    }
    .badge.paid      { background:#e6f7ec; color:#2f855a; }
    .badge.pending   { background:#fff8e1; color:#b7791f; }
    .badge.delivered { background:#e8f0fe; color:#2b6cb0; }
    .badge.default   { background:#f1f1f1; color:#666; }

    @media (max-width: 900px) {
        .cards { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 500px) {
        .cards { grid-template-columns: 1fr; }
    }
</style>

<div class="dashboard-wrap">

    <div class="cards">
        <div class="card books">
            <h3>{{ $totalBooks }}</h3>
            <p>Total Books</p>
        </div>
        <div class="card categories">
            <h3>{{ $totalCategories }}</h3>
            <p>Categories</p>
        </div>
        <div class="card orders">
            <h3>{{ $totalOrders }}</h3>
            <p>Orders</p>
        </div>
        <div class="card users">
            <h3>{{ $totalUsers }}</h3>
            <p>Users</p>
        </div>
    </div>

    <div class="panel">
        <h4>Orders Overview ({{ now()->year }})</h4>
        <canvas id="myChart" height="90"></canvas>
    </div>

    <div class="panel">
        <h4>Recent Orders</h4>
        <table class="recent-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                @forelse($recentOrders as $order)
                    <tr>
                        <td>{{ $order->order_code }}</td>
                        <td>{{ $order->customer->name ?? 'N/A' }}</td>
                        <td>
                            @php
                                $statusClass = match(strtolower($order->order_status ?? '')) {
                                    'paid' => 'paid',
                                    'pending' => 'pending',
                                    'delivered' => 'delivered',
                                    default => 'default',
                                };
                            @endphp
                            <span class="badge {{ $statusClass }}">
                                {{ $order->order_status ?? 'N/A' }}
                            </span>
                        </td>
                        <td>{{ $order->created_at->format('d M Y') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" style="text-align:center; color:#999; padding:20px;">
                            No recent orders found.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

</div>

<script>
const ctx = document.getElementById('myChart');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: {!! json_encode($chartLabels) !!},
        datasets: [{
            label: 'Orders per Month',
            data: {!! json_encode($chartData) !!},
            backgroundColor: '#d72c35',
            borderRadius: 6,
            maxBarThickness: 40
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } }
        }
    }
});
</script>
@endsection