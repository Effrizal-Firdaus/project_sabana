<?php
include "../../server/koneksi.php";

$nama_depan    = trim($_POST['nama_depan']    ?? '');
$nama_belakang = trim($_POST['nama_belakang'] ?? '');
$email         = trim($_POST['email']         ?? '');
$password  = trim($_POST['password']           ?? '');

if (!$nama_depan || !$nama_belakang || !$email || !$password) {
  header("Location: ../register.html?error=empty");
  exit;
}

$password_hashed = password_hash($password, PASSWORD_DEFAULT);
$nama_lengkap = $nama_depan . " " . $nama_belakang;

$stmt = $conn->prepare("INSERT INTO pengguna (nama, email, password, peran) VALUES (?, ?, ?, 'pelanggan')");
$stmt->bind_param("sss", $nama_lengkap, $email, $password_hashed);

if ($stmt->execute()) {
  header("Location: ../login.html?success=registered");
  exit;
} else {
  header("Location: ../register.html?error=database_error");
  exit;
}
