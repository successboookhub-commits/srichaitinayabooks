<?php
// CORS Headers - Allow frontend SPA and mobile clients
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load Environment Variables from potential locations
function loadEnvVariables() {
    static $env = null;
    if ($env !== null) return $env;

    $env = [];
    $envPaths = [
        dirname(__DIR__, 2) . '/backend/.env',
        dirname(__DIR__, 2) . '/backend/.env.example',
        dirname(__DIR__, 1) . '/.env',
        dirname(__DIR__, 1) . '/.env.example',
        dirname(__DIR__, 2) . '/.env',
        dirname(__DIR__, 2) . '/.env.example',
        __DIR__ . '/.env',
        __DIR__ . '/.env.example',
    ];

    foreach ($envPaths as $envPath) {
        if (file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#')) continue;
                if (str_contains($line, '=')) {
                    [$k, $v] = explode('=', $line, 2);
                    $k = trim($k);
                    $v = trim($v, " \t\n\r\0\x0B\"'");
                    if (!isset($env[$k])) {
                        $env[$k] = $v;
                    }
                }
            }
        }
    }
    return $env;
}

// Razorpay Configuration Helper (Active: TEST MODE per user request)
// Live Mode Credentials (saved for quick toggle when user requests):
// $liveKey = 'rzp_live_SIJDGxy85sgrKV';
// $liveSecret = 'gj9CI3Dq9wKU5dapQR61Vyo3';

function getRazorpayConfig() {
    // ACTIVE: Test Mode credentials directly in code
    $testKey = 'rzp_test_SwedUUn1KgRMs0';
    $testSecret = 'xdW2Ry7T67sUK4zMKb3oOsZh';

    return [
        'key'    => $testKey,
        'secret' => $testSecret,
        'mode'   => 'test',
    ];
}

// Helper to load DB config
function getDbConfig() {
    $isLocal = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:5000', 'localhost:5173']);
    $env = loadEnvVariables();

    // Default Hostinger settings
    $config = [
        'host' => $isLocal ? '127.0.0.1' : ($env['DB_HOST'] ?? 'localhost'),
        'port' => $env['DB_PORT'] ?? '3306',
        'user' => $isLocal ? 'root' : ($env['DB_USER'] ?? 'u803044110_sri_user'),
        'pass' => $env['DB_PASSWORD'] ?? '',
        'name' => $isLocal ? 'u302322072_bookcom123' : ($env['DB_NAME'] ?? 'u803044110_srichaitanya'),
        'jwt_secret' => $env['JWT_SECRET'] ?? 'srichaitanya_super_secure_jwt_secret_key_2026_xyz'
    ];

    return $config;
}

function getDb() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $cfg = getDbConfig();
    $dsn = "mysql:host={$cfg['host']};port={$cfg['port']};dbname={$cfg['name']};charset=utf8mb4";
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], $options);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed: ' . $e->getMessage(),
            'debug'   => [
                'host'        => $cfg['host'],
                'database'    => $cfg['name'],
                'user'        => $cfg['user'],
                'pass_set'    => !empty($cfg['pass']),
                'pass_length' => strlen($cfg['pass']),
            ],
            'hint' => 'Please set DB_PASSWORD in backend/.env or backend/.env.example on Hostinger'
        ]);
        exit;
    }
}
