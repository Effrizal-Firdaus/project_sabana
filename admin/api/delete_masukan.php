<?php
session_start();
header('Content-Type: application/json');

// Pastikan hanya admin yang bisa menghapus
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

include_once __DIR__ . '/../../server/koneksi.php';

// Ambil ID dari request body
$input = json_decode(file_get_contents('php://input'), true);
$id = (int)($input['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID masukan tidak valid']);
    exit;
}

// Query hapus dari tabel masukan
$stmt = $conn->prepare("DELETE FROM masukan WHERE id = ?");
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Gagal menghapus masukan: ' . $conn->error]);
}
$stmt->close();
?>