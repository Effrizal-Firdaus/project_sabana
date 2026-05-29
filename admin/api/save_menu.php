<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
include_once __DIR__ . '/../../server/koneksi.php';

function uploadGambar($file, $oldFile = null) {
    $targetDir = __DIR__ . '/../../img/';
    if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
    if ($oldFile && file_exists($targetDir . $oldFile) && $oldFile !== 'default.png') {
        unlink($targetDir . $oldFile);
    }
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg','jpeg','png','gif','webp'])) return null;
    $newName = time() . '_' . rand(1000,9999) . '.' . $ext;
    if (move_uploaded_file($file['tmp_name'], $targetDir . $newName)) return $newName;
    return null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    $nama = trim($_POST['nama']);
    $kategori = $_POST['kategori'];
    $harga = (int)$_POST['harga'];
    $stok = (int)$_POST['stok'];
    $deskripsi = trim($_POST['deskripsi']);
    
    if ($action === 'tambah') {
        $gambar = 'default.png';
        if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === UPLOAD_ERR_OK) {
            $upload = uploadGambar($_FILES['gambar']);
            if ($upload) $gambar = $upload;
        }
        $maxId = $conn->query("SELECT MAX(id) as max FROM menu")->fetch_assoc()['max'];
        $newId = $maxId + 1;
        $stmt = $conn->prepare("INSERT INTO menu (id, nama_menu, harga, kategori, deskripsi, gambar, stok) VALUES (?,?,?,?,?,?,?)");
        $stmt->bind_param('isisssi', $newId, $nama, $harga, $kategori, $deskripsi, $gambar, $stok);
        
        if ($stmt->execute()) {
            
            // Otomatis copy ke tabel menu_stock
            $stmt_stock = $conn->prepare("INSERT INTO menu_stock (menu_id, nama, stok, harga, img, kategori) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt_stock->bind_param('ssiiss', $newId, $nama, $stok, $harga, $gambar, $kategori);
            $stmt_stock->execute();
            $stmt_stock->close();

            echo json_encode(['success' => true, 'id' => $newId]);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        $stmt->close();
    } 
    elseif ($action === 'edit') {
        $id = (int)$_POST['id'];
        $gambarLama = $_POST['gambar_lama'] ?? '';
        $gambar = $gambarLama;
        if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] === UPLOAD_ERR_OK) {
            $upload = uploadGambar($_FILES['gambar'], $gambarLama);
            if ($upload) $gambar = $upload;
        }
        $stmt = $conn->prepare("UPDATE menu SET nama_menu=?, harga=?, kategori=?, deskripsi=?, gambar=?, stok=? WHERE id=?");
        $stmt->bind_param('sisssii', $nama, $harga, $kategori, $deskripsi, $gambar, $stok, $id);
        
        if ($stmt->execute()) {
            
            // ====================================================================
            // PERBAIKAN SINKRONISASI: MENGGUNAKAN REPLACE INTO AGAR DATA OTOMATIS MASUK 
            // MESKIPUN KONDISI AWAL TABEL MENU_STOCK SEDANG KOSONG
            // ====================================================================
            $stmt_stock = $conn->prepare("REPLACE INTO menu_stock (menu_id, nama, stok, harga, img, kategori) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt_stock->bind_param('ssiiss', $id, $nama, $stok, $harga, $gambar, $kategori);
            $stmt_stock->execute();
            $stmt_stock->close();
            // ====================================================================

            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        $stmt->close();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan']);
}
?>