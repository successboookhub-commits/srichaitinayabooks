
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Website Under Maintenance</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            font-family: Arial, Helvetica, sans-serif;
            background:
                radial-gradient(circle at 15% 20%, rgba(220, 38, 38, 0.18), transparent 30%),
                radial-gradient(circle at 85% 80%, rgba(239, 68, 68, 0.12), transparent 30%),
                #050505;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow: hidden;
            position: relative;
        }

        /* Animated red background glow */
        .glow {
            position: absolute;
            width: 450px;
            height: 450px;
            border-radius: 50%;
            background: rgba(220, 38, 38, 0.12);
            filter: blur(100px);
            animation: glowMove 7s ease-in-out infinite alternate;
        }

        .glow.one {
            top: -200px;
            left: -150px;
        }

        .glow.two {
            bottom: -220px;
            right: -150px;
            animation-delay: 2s;
        }

        @keyframes glowMove {
            0% {
                transform: scale(0.8);
                opacity: 0.5;
            }

            100% {
                transform: scale(1.3);
                opacity: 1;
            }
        }

        /* Floating particles */
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #ef4444;
            box-shadow: 0 0 12px #ef4444;
            opacity: 0.5;
            animation: float 6s ease-in-out infinite;
        }

        .p1 {
            top: 15%;
            left: 12%;
        }

        .p2 {
            top: 70%;
            left: 18%;
            animation-delay: 1s;
        }

        .p3 {
            top: 25%;
            right: 15%;
            animation-delay: 2s;
        }

        .p4 {
            bottom: 15%;
            right: 12%;
            animation-delay: 3s;
        }

        .p5 {
            top: 45%;
            left: 5%;
            animation-delay: 1.5s;
        }

        .p6 {
            top: 55%;
            right: 5%;
            animation-delay: 2.5s;
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0);
                opacity: 0.25;
            }

            50% {
                transform: translateY(-35px);
                opacity: 1;
            }
        }

        /* Main card */
        .processing-box {
            width: 100%;
            max-width: 720px;
            position: relative;
            z-index: 5;

            background: rgba(12, 12, 12, 0.95);

            border: 1px solid rgba(239, 68, 68, 0.30);

            border-radius: 28px;

            padding: 60px 45px;

            text-align: center;

            box-shadow:
                0 30px 80px rgba(0, 0, 0, 0.8),
                0 0 60px rgba(220, 38, 38, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);

            backdrop-filter: blur(15px);

            animation: cardIn 1s ease forwards;
        }

        @keyframes cardIn {
            from {
                opacity: 0;
                transform: translateY(35px) scale(0.96);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        /* Red top line */
        .top-line {
            width: 70px;
            height: 4px;
            background: linear-gradient(
                90deg,
                transparent,
                #ef4444,
                #ff0000,
                transparent
            );

            margin: 0 auto 32px;

            border-radius: 50px;

            box-shadow: 0 0 18px rgba(239, 68, 68, 0.8);

            animation: linePulse 2s ease-in-out infinite;
        }

        @keyframes linePulse {
            0%, 100% {
                width: 55px;
                opacity: 0.6;
            }

            50% {
                width: 110px;
                opacity: 1;
            }
        }

        /* Gear */
        .icon-wrapper {
            width: 105px;
            height: 105px;

            margin: 0 auto 32px;

            border-radius: 50%;

            display: flex;
            align-items: center;
            justify-content: center;

            background:
                radial-gradient(
                    circle,
                    rgba(239, 68, 68, 0.15),
                    rgba(10, 10, 10, 0.9) 65%
                );

            border: 1px solid rgba(239, 68, 68, 0.45);

            box-shadow:
                0 0 25px rgba(239, 68, 68, 0.25),
                inset 0 0 25px rgba(239, 68, 68, 0.08);

            position: relative;
        }

        .icon {
            font-size: 50px;
            color: #ef4444;

            text-shadow:
                0 0 10px rgba(239, 68, 68, 0.8),
                0 0 30px rgba(239, 68, 68, 0.4);

            animation: rotateGear 5s linear infinite;
        }

        @keyframes rotateGear {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }

        /* Outer animated rings */
        .icon-wrapper::before,
        .icon-wrapper::after {
            content: "";
            position: absolute;

            border-radius: 50%;

            border: 1px solid rgba(239, 68, 68, 0.25);

            animation: ringAnimation 2.5s ease-out infinite;
        }

        .icon-wrapper::before {
            width: 125px;
            height: 125px;
        }

        .icon-wrapper::after {
            width: 150px;
            height: 150px;
            animation-delay: 0.8s;
        }

        @keyframes ringAnimation {
            0% {
                transform: scale(0.75);
                opacity: 0;
            }

            40% {
                opacity: 1;
            }

            100% {
                transform: scale(1.1);
                opacity: 0;
            }
        }

        /* Heading */
        h1 {
            font-size: 42px;
            line-height: 1.2;
            font-weight: 700;

            margin-bottom: 14px;

            letter-spacing: -1px;

            color: #ffffff;

            text-shadow: 0 0 25px rgba(255, 255, 255, 0.05);
        }

        h1 span {
            color: #ef4444;

            text-shadow:
                0 0 15px rgba(239, 68, 68, 0.5);
        }

        h2 {
            font-size: 19px;
            font-weight: 500;

            color: #d1d1d1;

            margin-bottom: 25px;
        }

        .description {
            max-width: 560px;

            margin: 0 auto;

            color: #888;

            font-size: 16px;

            line-height: 1.8;
        }

        /* Date box */
        .date-box {
            margin: 35px auto 25px;

            max-width: 460px;

            padding: 25px;

            border-radius: 18px;

            background:
                linear-gradient(
                    145deg,
                    rgba(239, 68, 68, 0.08),
                    rgba(20, 20, 20, 0.95)
                );

            border: 1px solid rgba(239, 68, 68, 0.35);

            box-shadow:
                0 0 25px rgba(239, 68, 68, 0.08);

            position: relative;

            overflow: hidden;
        }

        /* Moving red light */
        .date-box::before {
            content: "";

            position: absolute;

            top: 0;
            left: -100%;

            width: 100%;
            height: 2px;

            background:
                linear-gradient(
                    90deg,
                    transparent,
                    #ff0000,
                    #ff6b6b,
                    transparent
                );

            animation: dateLight 3s linear infinite;
        }

        @keyframes dateLight {
            0% {
                left: -100%;
            }

            100% {
                left: 100%;
            }
        }

        .date-label {
            font-size: 12px;

            text-transform: uppercase;

            letter-spacing: 3px;

            color: #888;

            margin-bottom: 10px;
        }

        .date {
            font-size: 30px;

            font-weight: 700;

            color: #ef4444;

            letter-spacing: 1px;

            text-shadow:
                0 0 15px rgba(239, 68, 68, 0.45);
        }

        .wait-text {
            margin-top: 22px;

            color: #aaa;

            font-size: 15px;
        }

        /* Loading dots */
        .dots {
            margin-top: 25px;

            display: flex;

            justify-content: center;

            align-items: center;

            gap: 8px;
        }

        .dots span {
            width: 9px;
            height: 9px;

            background: #ef4444;

            border-radius: 50%;

            box-shadow:
                0 0 10px rgba(239, 68, 68, 0.7);

            animation: loading 1.4s infinite ease-in-out both;
        }

        .dots span:nth-child(1) {
            animation-delay: -0.32s;
        }

        .dots span:nth-child(2) {
            animation-delay: -0.16s;
        }

        @keyframes loading {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.3;
            }

            40% {
                transform: scale(1);
                opacity: 1;
            }
        }

        /* Footer */
        .footer {
            margin-top: 35px;

            padding-top: 22px;

            border-top: 1px solid rgba(255, 255, 255, 0.08);

            color: #666;

            font-size: 12px;
        }

        .footer strong {
            color: #ef4444;
            font-weight: 600;
        }

        /* Mobile */
        @media (max-width: 576px) {

            body {
                padding: 15px;
            }

            .processing-box {
                padding: 45px 22px;

                border-radius: 22px;
            }

            .icon-wrapper {
                width: 85px;
                height: 85px;
            }

            .icon {
                font-size: 40px;
            }

            h1 {
                font-size: 29px;
            }

            h2 {
                font-size: 17px;
            }

            .description {
                font-size: 14px;
                line-height: 1.7;
            }

            .date-box {
                padding: 20px 15px;
            }

            .date {
                font-size: 23px;
            }

            .date-label {
                font-size: 10px;
                letter-spacing: 2px;
            }

            .wait-text {
                font-size: 14px;
            }

            .footer {
                font-size: 11px;
            }
        }
    </style>
</head>

<body>

    <!-- Background glow -->
    <div class="glow one"></div>
    <div class="glow two"></div>

    <!-- Particles -->
    <span class="particle p1"></span>
    <span class="particle p2"></span>
    <span class="particle p3"></span>
    <span class="particle p4"></span>
    <span class="particle p5"></span>
    <span class="particle p6"></span>

    <!-- Main Content -->
    <div class="processing-box">

        <div class="top-line"></div>

        <div class="icon-wrapper">
            <div class="icon">⚙</div>
        </div>

        <h1>
            Website <span>Under Maintenance</span>
        </h1>

        <h2>
            We Are Updating Our Website
        </h2>

        <p class="description">
            Our website is currently undergoing scheduled updates
            and improvements. We are working behind the scenes
            to bring you a faster, better and improved experience.
        </p>

        <!-- Reopening Date -->
        <div class="date-box">

            <div class="date-label">
                We Will Be Back On
            </div>

            <div class="date">
                03 September 2026
            </div>

        </div>

        <p class="wait-text">
            Please wait while we complete the update.
        </p>

        <!-- Loading -->
        <div class="dots">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <div class="footer">
            Thank you for your patience and understanding.
            <br><br>
            <strong>See you soon!</strong>
        </div>

    </div>

</body>
</html>

