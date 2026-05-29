<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

include_once __DIR__ . '/../../server/koneksi.php';

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID tidak valid']);
    exit;
}

// Ubah status pesanan menjadi 'dimasak' (atau 'disiapkan' sesuai alur)
$query = "UPDATE pesanan SET status = 'dimasak' WHERE id = ? AND status = 'disiapkan'";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $id);
if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Gagal update status']);
}
$stmt->close();
?>