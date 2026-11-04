    <?php
    
    return [
    
        /*
        |--------------------------------------------------------------------------
        | Third Party Services
        |--------------------------------------------------------------------------
        |
        | This file is for storing the credentials for third party services such
        | as Mailgun, Postmark, AWS and more. This file provides the de facto
        | location for this type of information, allowing packages to have
        | a conventional file to locate the various service credentials.
        |
        */
    
        'postmark' => [
            'key' => env('POSTMARK_API_KEY'),
        ],
    
        'resend' => [
            'key' => env('RESEND_API_KEY'),
        ],
    
        'razorpay' => [
            'key'    => env('RAZORPAY_KEY'),
            'secret' => env('RAZORPAY_SECRET'),
        ],
        
        'excel_api' => [
            'token' => env('EXCEL_API_TOKEN'),
        ],
    
        // BhashSMS WhatsApp API
        'bhashsms' => [
            'user'     => env('BHASHSMS_USER', 'Azsofttech_BW'),
            'pass'     => env('BHASHSMS_PASS', '123456'),
            'sender'   => env('BHASHSMS_SENDER', 'BUZWAP'),
            'template' => env('BHASHSMS_TEMPLATE', 'ord_ch01'),
        ],
    
        'ses' => [
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
        ],
    
        'slack' => [
            'notifications' => [
                'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
                'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
            ],
        ],
    
    ];