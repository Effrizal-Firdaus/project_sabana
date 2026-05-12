<?php
  session_start();

  // Proteksi Halaman: Jika belum login, tendang kembali ke login.html
  if (!isset($_SESSION['user_id'])) {
      header("Location: login.html");
      exit;
  }
?>

<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard User - Sabana Fried Chicken</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
  <div class="dashboard-container">
    <div class="sidebar">
      <div class="logo-section">
        <i class="fa-solid fa-drumstick-bite"></i>
        <h2>Sabana</h2>
      </div>

      <nav class="nav-menu">
        <a href="dashboard.php" class="nav-item active">
          <i class="fa-solid fa-home"></i>
          <span>Dashboard</span>
        </a>
        <a href="menu.html" class="nav-item">
          <i class="fa-solid fa-utensils"></i>
          <span>Menu</span>
        </a>
        <a href="pesanan.html" class="nav-item">
          <i class="fa-solid fa-receipt"></i>
          <span>Pesanan Saya</span>
        </a>
        <a href="profil.html" class="nav-item">
          <i class="fa-solid fa-user"></i>
          <span>Profil</span>
        </a>
        <a href="logout.php" class="nav-item logout">
          <i class="fa-solid fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </nav>
    </div>

    <div class="main-content">
      <header class="top-bar">
        <h1>Selamat Datang, <span id="userName"><?php echo $_SESSION['nama']; ?></span></h1>
        <div class="user-info">
          <img src="https://via.placeholder.com/40" alt="User Avatar" class="avatar-small">
          <span id="userEmail"><?php echo $_SESSION['email']; ?></span>
        </div>
      </header>

      <div class="content">
        <div class="welcome-section">
          <h2>Selamat Datang di Sabana Fried Chicken!</h2>
          <p>Nikmati koleksi menu lezat kami dan pesan dengan mudah.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <i class="fa-solid fa-shopping-bag"></i>
            <h3>0</h3>
            <p>Total Pesanan</p>
          </div>
          <div class="stat-card">
            <i class="fa-solid fa-clock"></i>
            <h3>0</h3>
            <p>Pesanan Pending</p>
          </div>
          <div class="stat-card">
            <i class="fa-solid fa-check-circle"></i>
            <h3>0</h3>
            <p>Pesanan Selesai</p>
          </div>
          <div class="stat-card">
            <i class="fa-solid fa-money-bill"></i>
            <h3>Rp 0</h3>
            <p>Total Belanja</p>
          </div>
        </div>

        <div class="action-buttons">
          <a href="menu.html" class="btn btn-primary">
            <i class="fa-solid fa-utensils"></i>
            Lihat Menu
          </a>
          <a href="pesanan.html" class="btn btn-secondary">
            <i class="fa-solid fa-receipt"></i>
            Riwayat Pesanan
          </a>
        </div>
      </div>
    </div>
  </div>

<script src="../js/dashboard-user.js"></script>
</body>
</html>