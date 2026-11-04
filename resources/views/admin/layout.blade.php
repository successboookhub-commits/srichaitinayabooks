<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
    :root{
        --red:#d72c35;
        --dark:#111;
    }

    body{
        margin:0;
        font-family:Arial;
        background:#f4f4f4;
    }

    .dashboard{
        display:flex;
    }

    /* SIDEBAR */
    .sidebar{
        width:240px;
        background:#fff;
        height:100vh;
        position:fixed;
        overflow-y:auto;
    }
    .sidebar h2{
        background:var(--red);
        color:#fff;
        padding:15px;
        text-align:center;
    }
    .sidebar a{
        display:block;
        padding:15px;
        color:#111;
        text-decoration:none;
        position: relative;
    }
    .sidebar a:hover{
        background:#ffecec;
        color:var(--red);
    }

    /* Dropdown */
    .dropdown-btn {
        display:flex;
        justify-content:space-between;
        align-items:center;
        cursor:pointer;
    }
    .dropdown-container {
        display:none;
        background:#f9f9f9;
    }
    .dropdown-container a{
        padding-left:35px;
    }

    /* MAIN */
    .main{
        margin-left:240px;
        width:100%;
    }
    .topbar{
        background:#fff;
        padding:15px;
        display:flex;
        justify-content:space-between;
        border-bottom:1px solid #ddd;
    }
    .content{
        padding:20px;
    }

    /* CARDS */
    .cards{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
        gap:20px;
    }
    .card{
        background:#fff;
        padding:20px;
        border-radius:10px;
    }
    .card h3{
        color:var(--red);
        margin:0;
    }

    /* Mobile */
    @media(max-width:768px){
        .sidebar{
            left:-240px;
            position:fixed;
            transition:0.3s;
            z-index:999;
        }
        .sidebar.show{
            left:0;
        }
        .main{
            margin-left:0;
        }
    }
    </style>
</head>

<body>

<div class="dashboard">

    <div class="sidebar" id="sidebar">
        <h2>📚 Admin</h2>

        <a href="{{ route('dashboard') }}">Dashboard</a>
        <a href="{{ route('banners.index') }}">Banner</a>
<a href="{{ route('admin.publications.index') }}">Publication</a><a href="{{ route('categories.index') }}">Category</a>


        <!-- Products Dropdown -->
        <a class="dropdown-btn">Products <i class="fa fa-caret-down"></i></a>
        <div class="dropdown-container">
<a href="{{ route('admin.products.create') }}" class="btn btn-success mb-3">Add Product</a>
<a href="{{ route('admin.products.index') }}">List Products</a>

        </div>

<a href="{{ route('admin.orders.index') }}">Orders</a>        <a href="#">Settings</a>

        <!-- Logout -->
        <form method="POST" action="{{ route('logout') }}" style="margin:15px 0;text-align:center;">
            @csrf
            <button style="background:red;color:white;border:none;padding:10px;width:90%;border-radius:5px">
                Logout
            </button>
        </form>
    </div>

    <div class="main">
        <div class="topbar">
            <i class="fa fa-bars menu-btn" onclick="toggleSidebar()"></i>
            <strong>Dashboard</strong>
            <span>Admin</span>
        </div>

        <div class="content">
            @yield('content')
        </div>
    </div>

</div>

<script>
    // Sidebar toggle for mobile
    function toggleSidebar(){
        document.getElementById('sidebar').classList.toggle('show');
    }

    // Dropdown for products
    var dropdown = document.getElementsByClassName("dropdown-btn");
    for(var i = 0; i < dropdown.length; i++){
        dropdown[i].addEventListener("click", function(){
            this.classList.toggle("active");
            var dropdownContent = this.nextElementSibling;
            if(dropdownContent.style.display === "block"){
                dropdownContent.style.display = "none";
            } else{
                dropdownContent.style.display = "block";
            }
        });
    }
</script>

</body>
</html>
