<?php
  session_start();
  include "../../server/koneksi.php";

  $email    = trim($_POST['email']    ?? '');
  $password = $_POST['password'] ?? '';

  if (!$email || !$password) {
    header("Location: ../login.html?error=empty");
    exit;
  }

  $stmt = $conn->prepare("SELECT * FROM pengguna WHERE email = ? AND peran = 'admin'");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $res = $stmt->get_result();

  if ($res->num_rows === 0) {
    // Email admin tidak terdaftar
    header("Location: ../login.html?error=admin_not_found");
    exit;
  }

  $row = $res->fetch_assoc();
  if ($password === $row['password']) {
    $_SESSION['admin_id'] = $row['id'];
    $_SESSION['nama'] = $row['nama'];
    $_SESSION['admin_email'] = $row['email'];
    $_SESSION['peran'] = $row['peran'];
    header("Location: ../dashboard.html");
    exit;
  } else {
    // Password admin salah
    header("Location: ../login.html?error=admin_wrong_password");
    exit;
  }
?>
