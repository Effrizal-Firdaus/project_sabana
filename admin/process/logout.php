<?php
session_start();
unset($_SESSION['admin']); // Hanya hapus session admin
header("Location: ../../user/login.html");
exit;
?>