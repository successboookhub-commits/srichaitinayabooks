<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

$pdo = getDb();

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/api', PHP_URL_PATH);
$path = preg_replace('#^.*?/api/?#i', '', $uri);
$path = trim($path, '/');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Read JSON input body for POST/PUT
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?: [];

// Helper to normalize product record for frontend
function formatProduct($p) {
    $categoryIds = [];
    if (!empty($p['category_ids'])) {
        if (is_string($p['category_ids'])) {
            $dec = json_decode($p['category_ids'], true);
            $categoryIds = is_array($dec) ? $dec : preg_split('/[\s,]+/', $p['category_ids'], -1, PREG_SPLIT_NO_EMPTY);
        } elseif (is_array($p['category_ids'])) {
            $categoryIds = $p['category_ids'];
        }
    }

    $relatedPhotos = [];
    if (!empty($p['related_photos'])) {
        if (is_string($p['related_photos'])) {
            $dec = json_decode($p['related_photos'], true);
            $relatedPhotos = is_array($dec) ? $dec : preg_split('/[\s,]+/', $p['related_photos'], -1, PREG_SPLIT_NO_EMPTY);
        } elseif (is_array($p['related_photos'])) {
            $relatedPhotos = $p['related_photos'];
        }
    }

    return array_merge($p, [
        'title'          => $p['name'] ?? $p['title'] ?? '',
        'price'          => $p['total_price'] ?? $p['price'] ?? 0,
        'stock'          => $p['quantity'] ?? $p['stock'] ?? 0,
        'image'          => $p['main_photo'] ?? $p['image'] ?? '',
        'category_ids'   => $categoryIds,
        'related_photos' => $relatedPhotos,
    ]);
}

// -------------------------------------------------------------
// 1. BANNERS
// -------------------------------------------------------------
if ($path === 'banners' || $path === 'banners/admin') {
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM banners ORDER BY id DESC');
        $banners = $stmt->fetchAll();
        echo json_encode(['success' => true, 'banners' => $banners]);
        exit;
    }
}

// -------------------------------------------------------------
// 2. CATEGORIES
// -------------------------------------------------------------
if ($path === 'categories' || $path === 'categories/admin') {
    if ($method === 'GET') {
        $cats = $pdo->query('SELECT * FROM categories ORDER BY name ASC')->fetchAll();
        $prods = $pdo->query('SELECT id, category_ids FROM products WHERE is_active = 1')->fetchAll();

        $countMap = [];
        foreach ($prods as $p) {
            $ids = [];
            if (!empty($p['category_ids'])) {
                $dec = json_decode($p['category_ids'], true);
                $ids = is_array($dec) ? $dec : preg_split('/[\s,]+/', (string)$p['category_ids'], -1, PREG_SPLIT_NO_EMPTY);
            }
            foreach ($ids as $cid) {
                $cKey = (string)$cid;
                $countMap[$cKey] = ($countMap[$cKey] ?? 0) + 1;
            }
        }

        $enriched = array_map(function ($c) use ($countMap) {
            $c['product_count'] = $countMap[(string)$c['id']] ?? 0;
            return $c;
        }, $cats);

        echo json_encode(['success' => true, 'categories' => $enriched]);
        exit;
    }
}

// -------------------------------------------------------------
// 3. PUBLICATIONS
// -------------------------------------------------------------
if ($path === 'publications' || $path === 'publications/admin') {
    if ($method === 'GET') {
        $sql = "SELECT p.id, p.name, COUNT(pr.id) AS product_count 
                FROM publications p 
                LEFT JOIN products pr ON pr.publication_id = p.id AND pr.is_active = 1 
                GROUP BY p.id, p.name 
                ORDER BY p.name ASC";
        $pubs = $pdo->query($sql)->fetchAll();
        echo json_encode(['success' => true, 'publications' => $pubs]);
        exit;
    }
}

// -------------------------------------------------------------
// 4. HOME SECTIONS & STORE SETTINGS (Full Dynamic Showcase)
// -------------------------------------------------------------
if ($path === 'home-sections') {
    if ($method === 'GET') {
        // Default settings
        $settings = [
            'show_category_showcase'     => '1',
            'show_publication_showcase'  => '1',
            'category_showcase_limit'    => '8',
            'publication_showcase_limit' => '8',
            'category_showcase_title'    => 'Books by Exam Category',
            'publication_showcase_title' => 'Books by Leading Publishers',
        ];

        try {
            $stmt = $pdo->query('SELECT setting_key, setting_value FROM store_settings');
            while ($row = $stmt->fetch()) {
                $settings[$row['setting_key']] = $row['setting_value'];
            }
        } catch (Exception $e) {}

        // Fetch custom sections
        $customSections = [];
        try {
            $secStmt = $pdo->query('SELECT * FROM home_sections WHERE is_active = 1 ORDER BY display_order ASC, id ASC');
            $customSections = $secStmt->fetchAll();
        } catch (Exception $e) {}

        $allPids = [];
        foreach ($customSections as &$sec) {
            $pids = [];
            if (!empty($sec['product_ids'])) {
                $dec = json_decode($sec['product_ids'], true);
                $pids = is_array($dec) ? $dec : preg_split('/[\s,]+/', (string)$sec['product_ids'], -1, PREG_SPLIT_NO_EMPTY);
            }
            $sec['product_ids'] = array_map('intval', $pids);
            foreach ($sec['product_ids'] as $id) {
                if ($id > 0) $allPids[] = $id;
            }
        }

        $productsMap = [];
        if (!empty($allPids)) {
            $uniquePids = array_unique($allPids);
            $inClause = implode(',', array_fill(0, count($uniquePids), '?'));
            $prodStmt = $pdo->prepare("SELECT * FROM products WHERE id IN ($inClause) AND is_active = 1");
            $prodStmt->execute($uniquePids);
            while ($p = $prodStmt->fetch()) {
                $productsMap[$p['id']] = formatProduct($p);
            }
        }

        $sectionsOut = [];
        foreach ($customSections as $sec) {
            $secProds = [];
            foreach ($sec['product_ids'] as $pid) {
                if (isset($productsMap[$pid])) {
                    $secProds[] = $productsMap[$pid];
                }
            }
            $sectionsOut[] = [
                'id'            => $sec['id'],
                'title'         => $sec['title'],
                'subtitle'      => $sec['subtitle'] ?? '',
                'display_order' => $sec['display_order'],
                'is_active'     => $sec['is_active'],
                'products'      => $secProds,
            ];
        }

        // Category showcase if enabled
        $categoryShowcase = [];
        if (($settings['show_category_showcase'] ?? '1') === '1') {
            $limit = intval($settings['category_showcase_limit'] ?? 8) ?: 8;
            $cats = $pdo->query('SELECT id, name, slug FROM categories ORDER BY name ASC')->fetchAll();
            $allActive = $pdo->query('SELECT * FROM products WHERE is_active = 1 ORDER BY id DESC')->fetchAll();
            
            foreach ($cats as $cat) {
                $matched = [];
                $cidStr = (string)$cat['id'];
                foreach ($allActive as $p) {
                    $cids = [];
                    if (!empty($p['category_ids'])) {
                        $dec = json_decode($p['category_ids'], true);
                        $cids = is_array($dec) ? $dec : preg_split('/[\s,]+/', (string)$p['category_ids'], -1, PREG_SPLIT_NO_EMPTY);
                    }
                    if (in_array($cidStr, array_map('strval', $cids))) {
                        $matched[] = formatProduct($p);
                        if (count($matched) >= $limit) break;
                    }
                }
                if (!empty($matched)) {
                    $categoryShowcase[] = [
                        'category_id'   => $cat['id'],
                        'category_name' => $cat['name'],
                        'category_slug' => $cat['slug'] ?? '',
                        'products'      => $matched,
                    ];
                }
            }
        }

        // Publication showcase if enabled
        $publicationShowcase = [];
        if (($settings['show_publication_showcase'] ?? '1') === '1') {
            $limit = intval($settings['publication_showcase_limit'] ?? 8) ?: 8;
            $pubs = $pdo->query('SELECT id, name FROM publications ORDER BY name ASC')->fetchAll();
            $pubStmt = $pdo->prepare('SELECT * FROM products WHERE publication_id = ? AND is_active = 1 ORDER BY id DESC LIMIT ?');
            
            foreach ($pubs as $pub) {
                $pubStmt->bindValue(1, $pub['id'], PDO::PARAM_INT);
                $pubStmt->bindValue(2, $limit, PDO::PARAM_INT);
                $pubStmt->execute();
                $matched = array_map('formatProduct', $pubStmt->fetchAll());
                if (!empty($matched)) {
                    $publicationShowcase[] = [
                        'publication_id'   => $pub['id'],
                        'publication_name' => $pub['name'],
                        'products'         => $matched,
                    ];
                }
            }
        }

        echo json_encode([
            'success'               => true,
            'settings'              => $settings,
            'sections'              => $sectionsOut,
            'category_showcase'     => $categoryShowcase,
            'publication_showcase'  => $publicationShowcase,
        ]);
        exit;
    }
}

// -------------------------------------------------------------
// 5. PRODUCTS (Search, Filter, List, Single)
// -------------------------------------------------------------
if ($path === 'products' || $path === 'products/admin') {
    if ($method === 'GET') {
        $categoryId    = $_GET['category_id'] ?? null;
        $publicationId = $_GET['publication_id'] ?? null;
        $search        = trim($_GET['search'] ?? $_GET['q'] ?? '');
        $featured      = $_GET['featured'] ?? null;
        $limit         = isset($_GET['limit']) ? intval($_GET['limit']) : 0;

        $sql = 'SELECT * FROM products WHERE is_active = 1';
        $params = [];

        if (!empty($search)) {
            $sql .= ' AND (name LIKE ? OR author LIKE ? OR description LIKE ?)';
            $searchTerm = '%' . $search . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        if ($publicationId) {
            $sql .= ' AND publication_id = ?';
            $params[] = intval($publicationId);
        }

        if ($featured === 'true' || $featured === '1') {
            $sql .= ' AND is_featured = 1';
        }

        $sql .= ' ORDER BY id DESC';

        if ($limit > 0) {
            $sql .= ' LIMIT ' . $limit;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        // If category_id filter was requested, filter by category_ids JSON in PHP for maximum DB compatibility
        if ($categoryId) {
            $catFilterIds = array_map('strval', preg_split('/[\s,]+/', (string)$categoryId, -1, PREG_SPLIT_NO_EMPTY));
            $filtered = [];
            foreach ($rows as $r) {
                $cids = [];
                if (!empty($r['category_ids'])) {
                    $dec = json_decode($r['category_ids'], true);
                    $cids = is_array($dec) ? $dec : preg_split('/[\s,]+/', (string)$r['category_ids'], -1, PREG_SPLIT_NO_EMPTY);
                }
                $cidsStr = array_map('strval', $cids);
                foreach ($catFilterIds as $target) {
                    if (in_array($target, $cidsStr)) {
                        $filtered[] = $r;
                        break;
                    }
                }
            }
            $rows = $filtered;
        }

        $formatted = array_map('formatProduct', $rows);
        echo json_encode([
            'success'  => true,
            'count'    => count($formatted),
            'products' => $formatted,
        ]);
        exit;
    }
}

// Single product by slug or id
if (preg_match('#^products/(detail/)?([^/]+)$#', $path, $matches)) {
    $slugOrId = $matches[2];
    $stmt = $pdo->prepare('SELECT * FROM products WHERE (slug = ? OR id = ?) AND is_active = 1 LIMIT 1');
    $stmt->execute([$slugOrId, is_numeric($slugOrId) ? intval($slugOrId) : -1]);
    $prod = $stmt->fetch();

    if ($prod) {
        echo json_encode(['success' => true, 'product' => formatProduct($prod)]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Product not found.']);
    }
    exit;
}

// Search Suggestions
if ($path === 'products/suggest') {
    $q = trim($_GET['q'] ?? $_GET['search'] ?? '');
    if (empty($q)) {
        echo json_encode(['success' => true, 'suggestions' => []]);
        exit;
    }
    $stmt = $pdo->prepare('SELECT id, name, slug, main_photo AS image, total_price AS price FROM products WHERE is_active = 1 AND (name LIKE ? OR author LIKE ?) LIMIT 8');
    $term = '%' . $q . '%';
    $stmt->execute([$term, $term]);
    $suggestions = $stmt->fetchAll();
    echo json_encode(['success' => true, 'suggestions' => $suggestions]);
    exit;
}

// -------------------------------------------------------------
// 6. AUTHENTICATION (Login / Me)
// -------------------------------------------------------------
if ($path === 'auth/login') {
    if ($method === 'POST') {
        $email = trim($body['email'] ?? $_POST['email'] ?? '');
        $password = trim($body['password'] ?? $_POST['password'] ?? '');

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
            exit;
        }

        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        $valid = false;
        if ($user) {
            if (password_verify($password, $user['password'])) {
                $valid = true;
            } elseif (md5($password) === $user['password'] || $password === $user['password']) {
                $valid = true;
            }
        }

        if ($valid) {
            unset($user['password']);
            // Generate simple persistent HMAC token
            $cfg = getDbConfig();
            $tokenPayload = base64_encode(json_encode(['id' => $user['id'], 'email' => $user['email'], 'time' => time()]));
            $signature = hash_hmac('sha256', $tokenPayload, $cfg['jwt_secret']);
            $token = $tokenPayload . '.' . $signature;

            echo json_encode([
                'success' => true,
                'token'   => $token,
                'user'    => $user,
            ]);
            exit;
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
            exit;
        }
    }
}

// Check current user profile
if ($path === 'auth/me') {
    $stmt = $pdo->query('SELECT id, name, email, role FROM users LIMIT 1');
    $admin = $stmt->fetch();
    echo json_encode(['success' => true, 'user' => $admin]);
    exit;
}

// -------------------------------------------------------------
// 7. ORDER HISTORY & TRACKING
// -------------------------------------------------------------
if (str_starts_with($path, 'order-history/orders')) {
    $q = trim($_GET['query'] ?? $_GET['order_code'] ?? $_GET['phone'] ?? '');
    if (empty($q)) {
        echo json_encode(['success' => true, 'orders' => []]);
        exit;
    }

    $stmt = $pdo->prepare('
        SELECT o.*, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email
        FROM orders o
        LEFT JOIN customers c ON c.id = o.customer_id
        WHERE o.order_code = ? OR c.phone = ? OR o.id = ?
        ORDER BY o.id DESC LIMIT 10
    ');
    $stmt->execute([$q, $q, is_numeric($q) ? intval($q) : -1]);
    $orders = $stmt->fetchAll();

    foreach ($orders as &$ord) {
        $itemStmt = $pdo->prepare('
            SELECT oi.*, p.name AS product_name, p.main_photo AS product_image
            FROM order_items oi
            LEFT JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = ?
        ');
        $itemStmt->execute([$ord['id']]);
        $ord['items'] = $itemStmt->fetchAll();
    }

    echo json_encode(['success' => true, 'orders' => $orders]);
    exit;
}

// -------------------------------------------------------------
// DEFAULT / HEALTH CHECK
// -------------------------------------------------------------
echo json_encode([
    'success' => true,
    'service' => 'Sri Chaitanya Books API (Hostinger PHP Production Engine)',
    'time'    => date('Y-m-d H:i:s'),
    'path'    => $path,
]);
