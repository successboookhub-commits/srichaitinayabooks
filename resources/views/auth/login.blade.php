<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Login</title>

    <style>
        * {
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }

        body {
            margin: 0;
            height: 100vh;
            background: linear-gradient(135deg, #000000, #b30000);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-box {
            background: #111;
            padding: 40px;
            width: 360px;
            border-radius: 10px;
            box-shadow: 0 0 25px rgba(255, 0, 0, 0.4);
        }

        .login-box h2 {
            text-align: center;
            color: #ff3333;
            margin-bottom: 25px;
            letter-spacing: 1px;
        }

        .login-box input {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: none;
            outline: none;
            border-radius: 5px;
            background: #222;
            color: #fff;
            font-size: 14px;
        }

        .login-box input::placeholder {
            color: #aaa;
        }

        .login-box button {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 5px;
            background: #ff0000;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
        }

        .login-box button:hover {
            background: #cc0000;
        }

        .error {
            background: #330000;
            color: #ff8080;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
            font-size: 14px;
        }

        .footer-text {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>

<div class="login-box">

    <h2>ADMIN LOGIN</h2>

    {{-- Error Message --}}
    @if ($errors->any())
        <div class="error">
            {{ $errors->first() }}
        </div>
    @endif

    <form method="POST" action="{{ route('login.post') }}">
        @csrf

        <input type="email" name="email" placeholder="Email Address" required>

        <input type="password" name="password" placeholder="Password" required>

        <button type="submit">LOGIN</button>
    </form>

    <div class="footer-text">
        © {{ date('Y') }} Admin Panel
    </div>

</div>

</body>
</html>
