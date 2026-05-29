<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

include_once __DIR__ . '/../../server/koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);
$order_id = (int)($input['order_id'] ?? 0);

if ($order_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID pesanan tidak valid']);
    exit;
}

// Update database: is_archived = 1
$stmt = $conn->prepare("UPDATE pesanan SET is_archived = 1 WHERE id = ?");
$stmt->bind_param('i', $order_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Gagal mengarsipkan: ' . $conn->error]);
}
$stmt->close();
?>