<?php
session_start();
header('Content-Type: application/json');

// Cek login user
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Silakan login terlebih dahulu.']);
    exit;
}

include_once __DIR__ . '/../../server/koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Data tidak valid.']);
    exit;
}

$id_pengguna = $_SESSION['user']['id'];
$jenis = trim($input['jenis'] ?? '');
$pesan = trim($input['pesan'] ?? '');

// Validasi jenis
if (!in_array($jenis, ['saran', 'kritik', 'pujian', 'laporan_masalah'])) {
    echo json_encode(['success' => false, 'message' => 'Jenis masukan tidak valid.']);
    exit;
}
if (empty($pesan)) {
    echo json_encode(['success' => false, 'message' => 'Pesan tidak boleh kosong.']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO masukan (id_pengguna, jenis, pesan) VALUES (?, ?, ?)");
$stmt->bind_param('iss', $id_pengguna, $jenis, $pesan);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan: ' . $stmt->error]);
}
$stmt->close();
?>