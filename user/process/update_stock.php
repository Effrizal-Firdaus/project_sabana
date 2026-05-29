<?php
session_start();
include_once __DIR__ . '/../../server/koneksi.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input) || !isset($input['items']) || !is_array($input['items'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request data', 'errors' => []]);
    exit;
}

$items = $input['items'];
$errors = [];
$updated = [];

$selectStmt = $conn->prepare('SELECT stok FROM menu WHERE id = ?');
$updateStmt = $conn->prepare('UPDATE menu SET stok = ? WHERE id = ?');

if (!$selectStmt || !$updateStmt) {
    echo json_encode(['success' => false, 'message' => 'Database statement error', 'errors' => [$conn->error]]);
    exit;
}

foreach ($items as $item) {
    $menuId = isset($item['id']) ? intval($item['id']) : 0;
    $qty = isset($item['qty']) ? intval($item['qty']) : 0;
    if ($menuId <= 0 || $qty <= 0) {
        continue;
    }

    $nama = isset($item['name']) ? trim($item['name']) : '';

    $selectStmt->bind_param('i', $menuId);
    $selectStmt->execute();
    $result = $selectStmt->get_result();
    $row = $result->fetch_assoc();
    $currentStock = ($row !== null) ? intval($row['stok']) : null;

    if ($currentStock === null) {
        $errors[] = "Stok untuk item '{$nama}' tidak tersedia di database.";
        continue;
    }

    if ($currentStock < $qty) {
        $errors[] = "Stok tidak mencukupi untuk '{$nama}'. Tersisa {$currentStock}.";
        continue;
    }

    $newStock = $currentStock - $qty;
    $updateStmt->bind_param('ii', $newStock, $menuId);
    if (!$updateStmt->execute()) {
        $errors[] = "Gagal memperbarui stok untuk '{$nama}': {$updateStmt->error}";
        continue;
    }
    $updated[] = ['id' => $menuId, 'stok' => $newStock];
}

$success = empty($errors);
echo json_encode(['success' => $success, 'updated' => $updated, 'errors' => $errors]);
exit;