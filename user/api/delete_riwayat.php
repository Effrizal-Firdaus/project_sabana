<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

include_once __DIR__ . '/../../server/koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);
$order_id = (int)($input['order_id'] ?? 0);
$id_pengguna = $_SESSION['user']['id'];

if ($order_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID pesanan tidak valid']);
    exit;
}

// HANYA UPDATE is_riwayat_hidden, JANGAN HAPUS RATINGNYA!
$stmt = $conn->prepare("UPDATE pesanan SET is_riwayat_hidden = 1 WHERE id = ? AND id_pengguna = ?");
$stmt->bind_param('ii', $order_id, $id_pengguna);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Pesanan tidak ditemukan atau bukan milik Anda']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Gagal menghapus riwayat: ' . $conn->error]);
}

$stmt->close();
?>