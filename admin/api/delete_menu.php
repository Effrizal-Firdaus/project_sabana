<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
include_once __DIR__ . '/../../server/koneksi.php';

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID tidak valid']);
    exit;
}

// Proses hapus gambar dari folder server
$res = $conn->query("SELECT gambar FROM menu WHERE id = $id");
if ($row = $res->fetch_assoc()) {
    $gambar = $row['gambar'];
    if ($gambar && $gambar !== 'default.png') {
        $file = __DIR__ . '/../../img/' . $gambar;
        if (file_exists($file)) unlink($file);
    }
}

// Proses hapus dari tabel menu utama
if ($conn->query("DELETE FROM menu WHERE id = $id")) {
    
    // ====================================================================
    // TAMBAHAN: OTOMATIS HAPUS DARI TABEL MENU_STOCK (SAAT MENU DIHAPUS)
    // ====================================================================
    $stmt_stock = $conn->prepare("DELETE FROM menu_stock WHERE menu_id = ?");
    $stmt_stock->bind_param('i', $id);
    $stmt_stock->execute();
    $stmt_stock->close();
    // ====================================================================

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}
?>