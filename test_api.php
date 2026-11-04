<?php
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REQUEST_URI'] = '/api/checkout/totals';

// Mock input
$testPayload = json_encode([
    'cart' => [
        [
            'id' => 1,
            'name' => 'Test Book',
            'price' => 250.00,
            'shipping' => 50.00,
            'qty' => 2,
        ]
    ]
]);

// Set php://input simulation
file_put_contents('php://temp', $testPayload);

require_once __DIR__ . '/public/api/config.php';
echo "DB Config OK\n";

