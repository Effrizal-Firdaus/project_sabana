<?php
session_start();
include_once __DIR__ . '/../../server/koneksi.php';
header('Content-Type: application/json');

$ids = [];
if (isset($_GET['ids']) && is_string($_GET['ids'])) {
    $ids = array_filter(array_map(function ($value) {
        $id = trim($value);
        return is_numeric($id) ? intval($id) : null;
    }, explode(',', $_GET['ids'])));
}

if (empty($ids)) {
    echo json_encode(['success' => false, 'message' => 'No menu IDs provided', 'stocks' => []]);
    exit;
}

$placeholders = implode(',', array_fill(0, count($ids), '?'));
$sql = "SELECT id, stok FROM menu WHERE id IN ($placeholders)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Query prepare failed: ' . $conn->error, 'stocks' => []]);
    exit;
}

$types = str_repeat('i', count($ids));
$params = array_merge([$types], $ids);
$tmp = [];
foreach ($params as $key => $value) {
    $tmp[$key] = &$params[$key];
}
call_user_func_array([$stmt, 'bind_param'], $tmp);
$stmt->execute();
$result = $stmt->get_result();
$stocks = [];
while ($row = $result->fetch_assoc()) {
    $stocks[$row['id']] = (int) $row['stok'];
}

echo json_encode(['success' => true, 'stocks' => $stocks]);
exit;