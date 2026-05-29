<?php
session_start();
header('Content-Type: application/json');

// Pengecekan sesi admin yang benar (Satu kali cek saja)
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

include_once __DIR__ . '/../../server/koneksi.php';

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID pesanan tidak valid']);
    exit;
}

// Proses Hapus Data Berantai (Transaction)
$conn->begin_transaction();
try {
    // 1. Hapus detail pesanan
    $conn->query("DELETE FROM detail_pesanan WHERE id_pesanan = $id");
    
    // 2. Hapus pengiriman
    $conn->query("DELETE FROM pengiriman WHERE id_pesanan = $id");
    
    // 3. Hapus pembayaran
    $conn->query("DELETE FROM pembayaran WHERE id_pesanan = $id");
    
    // 4. Hapus pesanan utama
    $conn->query("DELETE FROM pesanan WHERE id = $id");
    
    // Simpan semua perubahan
    $conn->commit();
    echo json_encode(['success' => true]);
    
} catch (Exception $e) {
    // Batalkan penghapusan jika terjadi error di tengah jalan
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan saat menolak pesanan: ' . $e->getMessage()]);
}
?>