<?php
session_start();
header('Content-Type: application/json');

// Mencegah Cache di sisi Server & Browser secara paksa
header("Cache-Control: no-cache, no-store, must-revalidate"); 
header("Pragma: no-cache"); 
header("Expires: 0"); 

if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
include_once __DIR__ . '/../../server/koneksi.php';

$query = "SELECT m.*, p.nama as pengguna_nama 
          FROM masukan m 
          LEFT JOIN pengguna p ON m.id_pengguna = p.id 
          ORDER BY m.dibuat_pada DESC";
          
$result = $conn->query($query);
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(['success' => true, 'data' => $data]);
?>