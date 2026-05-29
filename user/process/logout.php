<?php
session_start();
unset($_SESSION['user']); // Hanya hapus session user
header("Location: ../login.html");
exit;
?>