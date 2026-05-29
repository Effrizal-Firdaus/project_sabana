<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
include_once __DIR__ . '/../../server/koneksi.php';

$result = $conn->query("SELECT id, nama, email, peran, dibuat_pada FROM pengguna ORDER BY id ASC");
$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = [
        'id' => (int)$row['id'],
        'nama' => $row['nama'],
        'email' => $row['email'],
        'peran' => $row['peran'],
        'dibuat_pada' => date('d/m/Y H:i', strtotime($row['dibuat_pada']))
    ];
}
echo json_encode(['success' => true, 'users' => $users]);
?>