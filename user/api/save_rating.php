<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
include_once __DIR__ . '/../../server/koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
    exit;
}

$order_id = isset($input['order_id']) ? (int)$input['order_id'] : 0;
$rating = isset($input['rating']) ? (int)$input['rating'] : 0;
if (!$order_id || $rating < 1 || $rating > 5) {
    echo json_encode(['success' => false, 'message' => 'Rating tidak valid']);
    exit;
}

$user_id = $_SESSION['user']['id']; 

// Verifikasi pesanan milik user dan status selesai
$check = $conn->prepare("SELECT id, status FROM pesanan WHERE id = ? AND id_pengguna = ?");
$check->bind_param('ii', $order_id, $user_id);
$check->execute();
$res = $check->get_result();
if ($res->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Pesanan tidak ditemukan']);
    exit;
}
$order = $res->fetch_assoc();
if ($order['status'] !== 'selesai') {
    echo json_encode(['success' => false, 'message' => 'Pesanan belum selesai, belum bisa rating']);
    exit;
}

// Cek apakah sudah ada rating sebelumnya
$cek = $conn->prepare("SELECT id FROM rating WHERE id_pesanan = ?");
$cek->bind_param('i', $order_id);
$cek->execute();
$cekRes = $cek->get_result();
if ($cekRes->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Anda sudah memberi rating untuk pesanan ini']);
    exit;
}

// Ambil id_menu pertama dari pesanan (karena rating per item, kita simpan satu rating untuk pesanan)
$menuStmt = $conn->prepare("SELECT id_menu FROM detail_pesanan WHERE id_pesanan = ? LIMIT 1");
$menuStmt->bind_param('i', $order_id);
$menuStmt->execute();
$menuRes = $menuStmt->get_result();
$menuRow = $menuRes->fetch_assoc();
$id_menu = $menuRow ? $menuRow['id_menu'] : 0;
$menuStmt->close();

$insert = $conn->prepare("INSERT INTO rating (id_pesanan, id_menu, rating) VALUES (?, ?, ?)");
$insert->bind_param('iii', $order_id, $id_menu, $rating);
if ($insert->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}
?>