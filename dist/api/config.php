<?php
// CORS Headers - Allow frontend SPA and mobile clients
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load Environment Variables from root .env or fallbacks
function loadEnvVariables() {
    static $env = null;
    if ($env !== null) return $env;

    $env = [];
    // Prioritize root .env (the main directory in Hostinger File Manager)
    $envPaths = [
        dirname(__DIR__, 2) . '/.env',             // Root .env (Hostinger File Manager root)
        dirname(__DIR__, 1) . '/.env',             // public/.env
        __DIR__ . '/.env',                         // public/api/.env
        dirname(__DIR__, 2) . '/backend/.env',     // backend/.env
        dirname(__DIR__, 2) . '/.env.example',
        dirname(__DIR__, 2) . '/backend/.env.example',
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

// Universal ENV getter with fallback
function getEnvVal($key, $default = null) {
    $env = loadEnvVariables();
    if (isset($env[$key]) && $env[$key] !== '') {
        return $env[$key];
    }
    $srv = getenv($key);
    if ($srv !== false && $srv !== '') {
        return $srv;
    }
    return $default;
}

// Razorpay Configuration Helper (Reads from .env with auto-detection)
function getRazorpayConfig() {
    $directKey = getEnvVal('RAZORPAY_KEY');
    $directSecret = getEnvVal('RAZORPAY_SECRET');
    if (!empty($directKey) && !empty($directSecret)) {
        $isLive = str_starts_with($directKey, 'rzp_live_');
        return [
            'key'    => $directKey,
            'secret' => $directSecret,
            'mode'   => $isLive ? 'live' : 'test',
        ];
    }

    $mode = strtolower(getEnvVal('RAZORPAY_MODE', 'live'));

    if ($mode === 'live') {
        $key = getEnvVal('RAZORPAY_LIVE_KEY', 'rzp_live_SIJDGxy85sgrKV');
        $secret = getEnvVal('RAZORPAY_LIVE_SECRET', 'gj9CI3Dq9wKU5dapQR61Vyo3');
    } else {
        $key = getEnvVal('RAZORPAY_TEST_KEY', 'rzp_test_SwedUUn1KgRMs0');
        $secret = getEnvVal('RAZORPAY_TEST_SECRET', 'xdW2Ry7T67sUK4zMKb3oOsZh');
    }

    return [
        'key'    => $key,
        'secret' => $secret,
        'mode'   => $mode,
    ];
}

// Helper to load DB config (Reads from .env)
function getDbConfig() {
    $isLocal = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:5000', 'localhost:5173']);

    $dbHost = getEnvVal('DB_HOST');
    if (empty($dbHost) || ($dbHost === '127.0.0.1' && !$isLocal)) {
        $dbHost = $isLocal ? '127.0.0.1' : 'localhost';
    }

    $dbUser = getEnvVal('DB_USER') ?: getEnvVal('DB_USERNAME');
    if (empty($dbUser) || ($dbUser === 'root' && !$isLocal)) {
        $dbUser = 'u803044110_sri_user';
    }

    $dbPass = getEnvVal('DB_PASSWORD');
    if (empty($dbPass) && !$isLocal) {
        $dbPass = 'SriChaitanya@2026';
    }

    $dbName = getEnvVal('DB_NAME') ?: getEnvVal('DB_DATABASE');
    if (empty($dbName) || ($dbName === 'u302322072_bookcom123' && !$isLocal)) {
        $dbName = 'u803044110_srichaitanya';
    }

    return [
        'host'       => $dbHost,
        'port'       => getEnvVal('DB_PORT', '3306'),
        'user'       => $dbUser,
        'pass'       => $dbPass,
        'name'       => $dbName,
        'jwt_secret' => getEnvVal('JWT_SECRET', 'srichaitanya_super_secure_jwt_secret_key_2026_xyz'),
    ];
}

function getDb() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $cfg = getDbConfig();
    $hosts = array_unique(array_filter([$cfg['host'], 'localhost', 'srv2186.hstgr.io', '127.0.0.1']));
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $lastError = null;
    foreach ($hosts as $h) {
        try {
            $dsn = "mysql:host={$h};port={$cfg['port']};dbname={$cfg['name']};charset=utf8mb4";
            $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], $options);
            return $pdo;
        } catch (\PDOException $e) {
            $lastError = $e;
        }
    }

    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . ($lastError ? $lastError->getMessage() : 'Unknown error'),
        'debug'   => [
            'tried_hosts' => $hosts,
            'database'    => $cfg['name'],
            'user'        => $cfg['user'],
            'pass_set'    => !empty($cfg['pass']),
            'pass_length' => strlen($cfg['pass']),
        ],
        'hint' => 'Please verify DB credentials in Hostinger'
    ]);
    exit;
}
