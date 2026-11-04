@extends('layouts.app')

@section('title', 'Contact Us')

@section('content')

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', sans-serif;
    }

    body {
        background: #f7f7f7;
        color: #333;
    }

    /* Hero Section */
    .contact-hero {
        background: linear-gradient(135deg, #d72c35, #b91d26);
        color: #fff;
        padding: 80px 20px;
        text-align: center;
    }

    .contact-hero h1 {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 15px;
    }

    .contact-hero p {
        font-size: 18px;
        opacity: .95;
    }

    /* Main Section */
    .contact-section {
        max-width: 1200px;
        margin: 60px auto;
        padding: 0 20px;
    }

    .contact-wrapper {
        display: flex;
        gap: 35px;
        flex-wrap: wrap;
    }

    /* Left & Right Cards */
    .contact-info,
    .contact-form {
        flex: 1;
        min-width: 340px;
        background: #fff;
        border-radius: 15px;
        padding: 35px;
        box-shadow: 0 15px 40px rgba(0, 0, 0, .08);
    }

    .contact-info h2,
    .contact-form h2 {
        color: #d72c35;
        margin-bottom: 25px;
        font-size: 30px;
    }

    .contact-info > p {
        color: #666;
        line-height: 28px;
        margin-bottom: 30px;
    }

    /* Contact Items */
    .info-box {
        display: flex;
        align-items: flex-start;
        margin-bottom: 25px;
    }

    .info-box:last-child {
        margin-bottom: 0;
    }

    .icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #d72c35;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        margin-right: 18px;
        flex-shrink: 0;
    }

    .details h4 {
        color: #222;
        margin-bottom: 6px;
        font-size: 18px;
    }

    .details p {
        margin: 0;
        color: #666;
        line-height: 24px;
    }

    .details a {
        text-decoration: none;
        color: #666;
        transition: color 0.3s;
    }

    .details a:hover {
        color: #d72c35;
    }

    /* Form Styling */
    .input-group {
        margin-bottom: 20px;
    }

    .input-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
    }

    .input-group input,
    .input-group textarea {
        width: 100%;
        padding: 14px;
        border: 1px solid #ddd;
        border-radius: 8px;
        outline: none;
        font-size: 15px;
        transition: .3s;
    }

    .input-group input:focus,
    .input-group textarea:focus {
        border-color: #d72c35;
    }

    .input-group textarea {
        height: 140px;
        resize: none;
    }

    .btn-contact {
        display: inline-block;
        width: 100%;
        padding: 15px;
        background: #d72c35;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 17px;
        font-weight: bold;
        transition: .3s;
    }

    .btn-contact:hover {
        background: #b61d29;
    }

    /* Map Section */
    .map-section {
        max-width: 1200px;
        margin: 60px auto 0 auto;
        padding: 0 20px;
    }

    .map-box {
        overflow: hidden;
        border-radius: 15px;
        box-shadow: 0 15px 40px rgba(0,0,0,.08);
    }

    .map-box iframe {
        width: 100%;
        height: 450px;
        border: 0;
    }

    /* Footer */
    .contact-footer {
        margin-top: 70px;
        background: #222;
        color: #fff;
        padding: 60px 20px;
    }

    .footer-container {
        max-width: 1200px;
        margin: auto;
        text-align: center;
    }

    .footer-container h2 {
        color: #fff;
        margin-bottom: 15px;
        font-size: 32px;
    }

    .footer-container p {
        color: #ddd;
        margin-bottom: 30px;
    }

    .footer-line {
        width: 120px;
        height: 4px;
        background: #d72c35;
        margin: 25px auto;
        border-radius: 30px;
    }

    .footer-links {
        margin: 25px 0;
    }

    .footer-links a {
        color: #fff;
        text-decoration: none;
        margin: 0 15px;
        font-size: 16px;
        transition: .3s;
    }

    .footer-links a:hover {
        color: #d72c35;
    }

    .footer-copy {
        margin-top: 30px;
        color: #aaa;
        font-size: 14px;
    }

    /* Responsive */
    @media(max-width: 900px) {
        .contact-wrapper {
            flex-direction: column;
        }

        .contact-hero h1 {
            font-size: 36px;
        }

        .contact-info,
        .contact-form {
            width: 100%;
        }
    }
</style>

<!-- HERO SECTION -->
<div class="contact-hero">
    <h1>Contact Us</h1>
    <p>We'd love to hear from you. Get in touch with Sri Chaitanya Book Centre.</p>
</div>

<!-- CONTACT FORM & INFO SECTION -->
<div class="contact-section">
    <div class="contact-wrapper">

        <!-- LEFT SIDE: CONTACT INFO -->
        <div class="contact-info">
            <h2>Get In Touch</h2>
            <p>Have questions about Competitive Books, Orders, or Delivery? Our team is always ready to help you.</p>

            <div class="info-box">
                <div class="icon">📍</div>
                <div class="details">
                    <h4>Our Address</h4>
                    <p>
                        Konark Theatre Lane,<br>
                        Opposite ICICI ATM,<br>
                        Gaddiannaram, Madhura Puri Colony,<br>
                        Dilsukhnagar, Hyderabad,<br>
                        Telangana - 500060
                    </p>
                </div>
            </div>

            <div class="info-box">
                <div class="icon">📞</div>
                <div class="details">
                    <h4>Call Us</h4>
                    <p>
                        <a href="tel:+919652627389">+91 96526 27389</a>
                    </p>
                </div>
            </div>

            <div class="info-box">
                <div class="icon">✉️</div>
                <div class="details">
                    <h4>Email Address</h4>
                    <p>
                        <a href="mailto:support@srichaitanybookscenter.com">support@srichaitanybookscenter.com</a>
                    </p>
                </div>
            </div>

            <div class="info-box">
                <div class="icon">🕒</div>
                <div class="details">
                    <h4>Working Hours</h4>
                    <p>
                        Monday - Saturday<br>
                        9:30 AM - 8:30 PM
                    </p>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE: CONTACT FORM -->
        <div class="contact-form">
            <h2>Send Message</h2>
            <form action="#" method="POST">
                @csrf
                <div class="input-group">
                    <label for="name">Your Name</label>
                    <input type="text" id="name" name="name" placeholder="Enter Your Name" required>
                </div>

                <div class="input-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="Enter Email" required>
                </div>

                <div class="input-group">
                    <label for="phone">Phone Number</label>
                    <input type="text" id="phone" name="phone" placeholder="Enter Phone Number">
                </div>

                <div class="input-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" placeholder="Write Your Message" required></textarea>
                </div>

                <button type="submit" class="btn-contact">Send Message</button>
            </form>
        </div>

    </div>
</div>

<!-- GOOGLE MAP SECTION -->
<div class="map-section">
    <div class="map-box">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.932262213109!2d78.524973!3d17.3669922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99cb617cda89%3A0x3a8d59502d06fcb!2sSRI%20CHAITANYA%20BOOK%20CENTRE!5e0!3m2!1sen!2sin!4v1784908144746!5m2!1sen!2sin"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    </div>
</div>

<!-- FOOTER SECTION -->
<footer class="contact-footer">
    <div class="footer-container">
        <h2>Sri Chaitanya Book Centre</h2>
        <p>Your Trusted Destination for Competitive Examination Books.</p>
        <div class="footer-line"></div>
        <div class="footer-links">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/history">Order History</a>
        </div>
        <div class="footer-copy">
            © {{ date('Y') }} Sri Chaitanya Book Centre. All Rights Reserved.
        </div>
    </div>
</footer>

@endsection