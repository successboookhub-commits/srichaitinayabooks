<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Invoice</title>

<style>

@page{
    margin:25px;
}

body{
    font-family: DejaVu Sans, sans-serif;
    font-size:13px;
    color:#333;
}

table{
    width:100%;
    border-collapse:collapse;
}

.header td{
    vertical-align:top;
}

.company{
    font-size:22px;
    font-weight:bold;
    color:#c62828;
}

.small{
    font-size:12px;
    color:#666;
}

.right{
    text-align:right;
}

.invoice-title{
    font-size:22px;
    font-weight:bold;
}

.line{
    border-top:1px solid #ddd;
    margin:15px 0;
}

.items{
    width:100%;
    border-collapse:collapse;
}

.items th{
    background:#f5f5f5;
    border:1px solid #ddd;
    padding:8px;
    font-size:12px;
}

.items td{
    border:1px solid #ddd;
    padding:8px;
    font-size:12px;
}

.num{
    text-align:right;
}

.total-table{
    width:300px;
    margin-top:20px;
    margin-left:auto;
}

.total-table td{
    padding:8px;
    border:1px solid #ddd;
}

.total{
    background:#f5f5f5;
    font-weight:bold;
    font-size:15px;
}

.footer{
    margin-top:40px;
    text-align:center;
    font-size:11px;
    color:#666;
}

.status{
    color:green;
    font-weight:bold;
}

</style>

</head>

<body>

<table class="header">

<tr>

<td width="60%">

<div class="company">

Sri Chaitanya Book Centre

</div>

<div class="small">

Hyderabad, Telangana<br>

India

</div>

</td>

<td width="40%" class="right">

<div class="invoice-title">

INVOICE

</div>

<br>

<b>Order No :</b>

{{ $order->order_code }}

<br><br>

<b>Date :</b>

{{ date('d-m-Y h:i A',strtotime($order->created_at)) }}

<br><br>

<b>Status :</b>

<span class="status">

{{ $order->status }}

</span>

</td>

</tr>

</table>

<div class="line"></div>

<h3>Order Items</h3>

<table class="items">

<tr>

<th width="50%">Product</th>

<th width="15%">Qty</th>

<th width="15%">Price</th>

<th width="20%">Total</th>

</tr>

@foreach($items as $item)

<tr>

<td>

{{ $item->product_name }}

</td>

<td class="num">

{{ $item->qty }}

</td>

<td class="num">

₹ {{ number_format($item->price,2) }}

</td>

<td class="num">

₹ {{ number_format($item->total,2) }}

</td>

</tr>

@endforeach

</table>

<table class="total-table">

<tr>

<td>

Subtotal

</td>

<td class="num">

₹ {{ number_format($order->subtotal,2) }}

</td>

</tr>

<tr>

<td>

Shipping

</td>

<td class="num">

₹ {{ number_format($order->shipping,2) }}

</td>

</tr>

<tr class="total">

<td>

Grand Total

</td>

<td class="num">

₹ {{ number_format($order->total,2) }}

</td>

</tr>

</table>

<div class="footer">

<b>Thank You For Shopping With Sri Chaitanya Book Centre.</b>

<br><br>

This is a computer generated invoice.

</div>

</body>

</html>