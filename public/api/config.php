<?php
// CORS Headers - Allow frontend SPA and mobile clients
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helper to load DB config
function getDbConfig() {
    $isLocal = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:5000', 'localhost:5173']);
    
    // Default Hostinger settings
    $config = [
        'host' => $isLocal ? '127.0.0.1' : 'localhost',
        'port' => '3306',
        'user' => $isLocal ? 'root' : 'u803044110_sri_user',
        'pass' => '', // Will be read from backend/.env or can be set here
        'name' => $isLocal ? 'u302322072_bookcom123' : 'u803044110_srichaitanya',
        'jwt_secret' => 'srichaitanya_super_secure_jwt_secret_key_2026_xyz'
    ];

    // Read backend/.env or backend/.env.example if available
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
                    if ($k === 'DB_HOST') $config['host'] = $v;
                    if ($k === 'DB_PORT') $config['port'] = $v;
                    if ($k === 'DB_USER') $config['user'] = $v;
                    if ($k === 'DB_PASSWORD') $config['pass'] = $v;
                    if ($k === 'DB_NAME') $config['name'] = $v;
                    if ($k === 'JWT_SECRET') $config['jwt_secret'] = $v;
                }
            }
            break;
        }
    }

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
