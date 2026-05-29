<?php
session_start();
header('Content-Type: application/json');
error_reporting(0);

if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
include_once __DIR__ . '/../../server/koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$order_id = (int)($input['order_id'] ?? 0);
$rating = (int)($input['rating'] ?? 0);
$komentar = trim($input['komentar'] ?? '');

// Validasi ketat
if ($order_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID pesanan tidak valid']);
    exit;
}
if ($rating < 1 || $rating > 5) {
    echo json_encode(['success' => false, 'message' => 'Rating harus antara 1-5']);
    exit;
}

// Cek kepemilikan pesanan
$check = $conn->prepare("SELECT id FROM pesanan WHERE id = ? AND id_pengguna = ? AND status = 'selesai'");
$check->bind_param('ii', $order_id, $_SESSION['user']['id']);
$check->execute();
if ($check->get_result()->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Pesanan tidak ditemukan atau belum selesai']);
    exit;
}
$check->close();

// PERBAIKAN: Ambil id_menu yang pertama dari detail_pesanan, jangan hardcode 0
$menuStmt = $conn->prepare("SELECT id_menu FROM detail_pesanan WHERE id_pesanan = ? LIMIT 1");
$menuStmt->bind_param('i', $order_id);
$menuStmt->execute();
$menuRes = $menuStmt->get_result();
$menuRow = $menuRes->fetch_assoc();
$id_menu = $menuRow ? (int)$menuRow['id_menu'] : 0;
$menuStmt->close();

if ($id_menu === 0) {
    echo json_encode(['success' => false, 'message' => 'Gagal mendapatkan data menu dari pesanan ini']);
    exit;
}

// Simpan rating
$insert = $conn->prepare("REPLACE INTO rating (id_pesanan, id_menu, rating, komentar) VALUES (?, ?, ?, ?)");
$insert->bind_param('iiis', $order_id, $id_menu, $rating, $komentar);
if ($insert->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Gagal simpan: ' . $conn->error]);
}
$insert->close();
?>