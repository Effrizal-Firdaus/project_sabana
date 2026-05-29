<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}
include_once __DIR__ . '/../../server/koneksi.php';

$query = "SELECT COUNT(DISTINCT id_pengguna) as unique_customers 
          FROM pesanan 
          WHERE status = 'disiapkan' AND dikonfirmasi = 0";
$result = $conn->query($query);
$row = $result->fetch_assoc();
$count = (int)$row['unique_customers'];

echo json_encode(['count' => $count]);
?>