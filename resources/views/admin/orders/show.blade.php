@extends('admin.layout')

@section('content')

<div style="padding:20px">

<h3>Order Details - {{ $order->order_code }}</h3>

<div style="background:#fff;padding:20px;border-radius:10px;margin-top:15px">

<h4>Customer Details</h4>
<p><strong>Name:</strong> {{ $order->customer->name }}</p>
<p><strong>Phone:</strong> {{ $order->customer->phone }}</p>
<p><strong>Address:</strong> {{ $order->customer->address }}</p>

<hr>

<h4>Order Items</h4>

<table width="100%" border="1" cellpadding="10" style="border-collapse:collapse">
<tr>
    <th>Product</th>
    <th>Price</th>
    <th>Qty</th>
    <th>Total</th>
</tr>

@foreach($order->items as $item)
<tr>
    <td>{{ $item->product_name }}</td>
    <td>₹{{ $item->price }}</td>
    <td>{{ $item->qty }}</td>
    <td>₹{{ $item->total }}</td>
</tr>
@endforeach
</table>

<hr>

<p><strong>Subtotal:</strong> ₹{{ $order->subtotal }}</p>
<p><strong>Shipping:</strong> ₹{{ $order->shipping }}</p>
<h4>Total: ₹{{ $order->total }}</h4>

</div>

</div>

@endsection