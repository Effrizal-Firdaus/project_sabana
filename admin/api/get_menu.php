<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}
include_once __DIR__ . '/../../server/koneksi.php';

$result = $conn->query("SELECT id, nama_menu, harga, kategori, deskripsi, gambar, stok FROM menu ORDER BY id ASC");
$menu = [];
while ($row = $result->fetch_assoc()) {
    $menu[] = [
        'id' => (int)$row['id'],
        'nama' => $row['nama_menu'],
        'harga' => (int)$row['harga'],
        'kategori' => $row['kategori'],
        'deskripsi' => $row['deskripsi'],
        'img' => $row['gambar'],
        'stok' => (int)$row['stok']
    ];
}
echo json_encode(['success' => true, 'menu' => $menu]);
?>