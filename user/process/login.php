<?php
session_start();
include "../../server/koneksi.php";

/** @var mysqli $conn */ // Agar VS Code tidak merah

$email    = trim($_POST['email']    ?? '');
$password = $_POST['password']      ?? '';

if (!$email || !$password) {
  header("Location: ../login.html?error=empty_fields");
  exit;
}

$stmt = $conn->prepare("SELECT * FROM pengguna WHERE email = ? AND peran = 'pelanggan'");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
  header("Location: ../login.html?error=not_found");
  exit;
}

$row = $res->fetch_assoc();

if (password_verify($password, $row['password'])) {
  $_SESSION['user_id'] = $row['id'];
  $_SESSION['nama']    = $row['nama'];
  $_SESSION['email']   = $row['email'];

  header("Location: ../menu_utama.php");
  exit;
} else {
  header("Location: ../login.html?error=wrong_password");
  exit;
}
