@extends('layouts.app')

@section('title','About Us')

@section('content')

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial,sans-serif;
}

body{
    background:#f8f8f8;
}

.about-banner{
    background:#d72c35;
    color:#fff;
    text-align:center;
    padding:70px 20px;
}

.about-banner h1{
    font-size:42px;
    margin-bottom:10px;
}

.about-banner p{
    font-size:18px;
}

.about-section{
    max-width:1200px;
    margin:60px auto;
    display:flex;
    gap:40px;
    align-items:center;
    padding:0 20px;
    flex-wrap:wrap;
}

.about-image{
    flex:1;
}

.about-image img{
    width:100%;
    border-radius:12px;
    box-shadow:0 10px 25px rgba(0,0,0,.15);
}

.about-content{
    flex:1;
}

.about-content h2{
    color:#d72c35;
    margin-bottom:20px;
    font-size:34px;
}

.about-content p{
    color:#555;
    line-height:30px;
    margin-bottom:20px;
}

.features{
    max-width:1200px;
    margin:40px auto;
    padding:0 20px;
}

.features h2{
    text-align:center;
    color:#d72c35;
    margin-bottom:40px;
}

.feature-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
    gap:25px;
}

.feature-box{
    background:#fff;
    padding:25px;
    border-radius:10px;
    box-shadow:0 5px 15px rgba(0,0,0,.08);
    transition:.3s;
}

.feature-box:hover{
    transform:translateY(-8px);
}

.feature-box h3{
    color:#d72c35;
    margin-bottom:15px;
}

.books{
    max-width:1200px;
    margin:70px auto;
    padding:0 20px;
}

.books h2{
    text-align:center;
    color:#d72c35;
    margin-bottom:35px;
}

.book-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
    gap:20px;
}

.book{
    background:#fff;
    padding:20px;
    text-align:center;
    border-radius:10px;
    box-shadow:0 5px 15px rgba(0,0,0,.08);
    font-weight:bold;
}

.book:hover{
    background:#d72c35;
    color:#fff;
}

.stats{
    background:#d72c35;
    color:#fff;
    margin-top:60px;
    padding:60px 20px;
}

.stats-grid{
    max-width:1200px;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:30px;
    text-align:center;
}

.stats h2{
    font-size:38px;
}

.stats p{
    margin-top:10px;
}

.why{
    max-width:1200px;
    margin:60px auto;
    padding:0 20px;
}

.why h2{
    color:#d72c35;
    margin-bottom:25px;
}

.why ul{
    list-style:none;
}

.why li{
    padding:12px 0;
    border-bottom:1px solid #eee;
    font-size:17px;
}

@media(max-width:768px){

.about-section{
    flex-direction:column;
}

.about-banner h1{
    font-size:32px;
}

.about-content h2{
    font-size:28px;
}

}
</style>

<div class="about-banner">

<h1>About Sri Chaitanya Book Centre</h1>

<p>Your Trusted Competitive Books Store</p>

</div>

<div class="about-section">

<div class="about-image">

<img src="{{ asset('images/sri_about.webp') }}" alt="About">

</div>

<div class="about-content">

<h2>Who We Are</h2>

<p>

Sri Chaitanya Book Centre is one of the leading bookstores in Hyderabad for Competitive Examination Books.

We provide genuine books from top publishers at the lowest prices with attractive discounts.

</p>

<p>

Our goal is to help every student achieve success by providing quality books with quick delivery and excellent customer support.

</p>

</div>

</div>

<div class="features">

<h2>Our Features</h2>

<div class="feature-grid">

<div class="feature-box">
<h3>Lowest Prices</h3>
<p>Competitive books available at affordable prices.</p>
</div>

<div class="feature-box">
<h3>High Discounts</h3>
<p>Best discounts on all competitive examination books.</p>
</div>

<div class="feature-box">
<h3>Fast Delivery</h3>
<p>Safe and quick delivery across India.</p>
</div>

<div class="feature-box">
<h3>Original Books</h3>
<p>100% genuine publications from leading publishers.</p>
</div>

</div>

</div>

<div class="books">

<h2>Competitive Books Available</h2>

<div class="book-grid">

<div class="book">Group-1</div>

<div class="book">Group-2</div>

<div class="book">SI</div>

<div class="book">Constable</div>

<div class="book">UPSC</div>

<div class="book">SSC</div>

<div class="book">Banking</div>

<div class="book">Railway</div>

</div>

</div>

<div class="stats">

<div class="stats-grid">

<div>

<h2>5000+</h2>

<p>Books Available</p>

</div>

<div>

<h2>10000+</h2>

<p>Happy Customers</p>

</div>

<div>

<h2>15+</h2>

<p>Years Experience</p>

</div>

<div>

<h2>100%</h2>

<p>Original Publications</p>

</div>

</div>

</div>

<div class="why">

<h2>Why Choose Us?</h2>

<ul>

<li>✔ Competitive Books at Low Prices</li>

<li>✔ High Discounts on Every Purchase</li>

<li>✔ Latest Editions Available</li>

<li>✔ Trusted by Thousands of Students</li>

<li>✔ Fast Delivery Across India</li>

<li>✔ Secure Online Payments</li>

</ul>

</div>

@endsection