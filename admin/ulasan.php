<?php
session_start();
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    header('Location: ../user/login.html');
    exit;
}
include_once __DIR__ . '/../server/koneksi.php';

// Ambil semua rating + komentar + nama user + nama menu + pesanan ID
$query = "SELECT r.*, p.nama AS pengguna, m.nama_menu, ps.id AS pesanan_id
          FROM rating r
          JOIN pesanan ps ON r.id_pesanan = ps.id
          JOIN pengguna p ON ps.id_pengguna = p.id
          JOIN menu m ON r.id_menu = m.id
          ORDER BY r.dibuat_pada DESC";
$result = $conn->query($query);
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Ulasan Pelanggan - Admin Sabana</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/dashboard.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f1f5f9;
        }

        .rating-star {
            color: #facc15;
        }
    </style>
</head>

<body class="bg-slate-100">
    <div class="flex min-h-screen">
        <!-- SIDEBAR (salin dari file admin lain, dengan menu Ulasan aktif) -->
        <div class="w-80 bg-gradient-to-br from-[#2c3e50] to-[#34495e] text-white fixed h-full overflow-y-auto shadow-lg z-30">
            <div class="p-6">
                <div class="flex items-center gap-3 bg-[#4a5d42]/30 p-4 rounded-xl mb-8">
                    <i class="fa-solid fa-user-shield text-3xl"></i>
                    <h2 class="text-xl font-bold">Admin Panel</h2>
                </div>
                <nav class="flex flex-col gap-2">
                    <div class="flex flex-col gap-1">
                        <div class="flex items-center justify-between rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white pr-2">
                            <a href="dashboard.php" class="flex items-center gap-3 px-4 py-3 flex-1 font-semibold">
                                <i class="fa-solid fa-chart-line w-5"></i>
                                <span>Dashboard</span>
                            </a>
                            <button id="toggleArsipBtn" class="p-2 mr-1 transition-transform duration-300 transform rotate-0 focus:outline-none hover:text-white">
                                <i class="fa-solid fa-chevron-down text-sm"></i>
                            </button>
                        </div>

                        <div id="submenuArsip" class="hidden flex-col gap-1 pl-9 pr-2 py-1 transition-all duration-300">
                            <a href="arsip.php" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white text-sm font-medium transition-all duration-300">
                                <i class="fa-solid fa-box-archive w-4 text-center"></i>
                                <span>Arsip Pesanan</span>
                            </a>
                        </div>
                    </div>
                    <a href="kelola_menu.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2"><i class="fa-solid fa-utensils w-5"></i> Kelola Menu</a>
                    <a href="pesanan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
                        <i class="fa-solid fa-receipt w-5"></i>
                        <span>Pesanan</span>
                        <span id="pesananBadge" class="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 hidden">0</span>
                    </a>
                    <a href="pengguna.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2"><i class="fa-solid fa-users w-5"></i> Pengguna</a>
                    <a href="laporan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2"><i class="fa-solid fa-file-alt w-5"></i> Laporan</a>
                    <a href="masukan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2"><i class="fa-solid fa-message w-5"></i> Masukan</a>
                    <a href="ulasan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 bg-[#4a5d42] text-white shadow-lg border-l-4 border-green-300"><i class="fa-solid fa-star w-5"></i> Ulasan</a>
                    <a href="#" id="btnTriggerLogout" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-[#00f5ec] hover:bg-[#00f5ec]/20 hover:text-white mt-8 pt-4 border-t border-gray-700"><i class="fa-solid fa-sign-out-alt w-5"></i> Logout</a>
                </nav>
            </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="flex-1 ml-80 bg-slate-50 min-h-screen p-8">
            <div class="bg-white rounded-2xl shadow-md overflow-hidden">
                <div class="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-800"><i class="fa-solid fa-star mr-2 text-yellow-500"></i> Ulasan & Rating Pelanggan</h1>
                    <span class="text-sm bg-gray-100 px-3 py-1 rounded-full">Total: <?= $result->num_rows ?></span>
                </div>
                <div class="divide-y divide-gray-100">
                    <?php if ($result->num_rows === 0): ?>
                        <div class="p-12 text-center text-gray-400">
                            <i class="fa-regular fa-star text-4xl mb-3"></i>
                            <p>Belum ada ulasan dari pelanggan.</p>
                        </div>
                    <?php else: ?>
                        <?php while ($row = $result->fetch_assoc()): ?>
                            <div class="p-6 hover:bg-gray-50 transition">
                                <div class="flex flex-wrap gap-4">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center font-bold text-lg text-white shadow">
                                        <?= strtoupper(substr($row['pengguna'], 0, 1)) ?>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex flex-wrap justify-between items-start gap-2">
                                            <div>
                                                <span class="font-semibold text-gray-800"><?= htmlspecialchars($row['pengguna']) ?></span>
                                                <span class="text-xs text-gray-400 ml-2">Pesanan #<?= $row['pesanan_id'] ?></span>
                                                <div class="text-sm text-gray-500 mt-1">Menu: <?= htmlspecialchars($row['nama_menu']) ?></div>
                                            </div>
                                            <div class="text-xs text-gray-400"><?= date('d/m/Y H:i', strtotime($row['dibuat_pada'])) ?></div>
                                        </div>
                                        <div class="flex items-center gap-2 mt-2">
                                            <span class="text-sm font-medium">Rating:</span>
                                            <div class="flex rating-star">
                                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                                    <i class="fa-<?= $i <= $row['rating'] ? 'solid' : 'regular' ?> fa-star"></i>
                                                <?php endfor; ?>
                                            </div>
                                            <span class="text-xs text-gray-500">(<?= $row['rating'] ?>/5)</span>
                                        </div>
                                        <?php if (!empty($row['komentar'])): ?>
                                            <div class="mt-3 bg-gray-100 p-3 rounded-xl text-gray-700 text-sm italic border-l-4 border-yellow-400">
                                                <i class="fa-regular fa-comment-dots mr-2"></i> “<?= nl2br(htmlspecialchars($row['komentar'])) ?>”
                                            </div>
                                        <?php else: ?>
                                            <div class="mt-3 text-xs text-gray-400 italic">Tidak ada komentar</div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL LOGOUT (salin dari dashboard.php) -->
    <div id="logoutModal" class="fixed inset-0 z-50 hidden flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" id="logoutOverlay"></div>
        <div class="bg-white rounded-2xl shadow-2xl p-8 z-10 w-full max-w-sm transform scale-95 opacity-0 transition-all duration-300 flex flex-col items-center text-center" id="logoutModalBox">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-5"><i class="fa-solid fa-arrow-right-from-bracket text-3xl text-emerald-600"></i></div>
            <h3 class="text-xl font-extrabold text-gray-800 mb-2">Konfirmasi Logout</h3>
            <p class="text-gray-500 mb-8 text-sm">Apakah Anda yakin ingin keluar dari sesi ini?</p>
            <div class="flex gap-4 w-full">
                <button id="btnCancelLogout" class="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-bold">Tidak</button>
                <a href="process/logout.php" class="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white py-3 rounded-xl font-bold text-center">Iya, Logout</a>
            </div>
        </div>
    </div>

    <script src="js/toast.js"></script>
    <script>
        // Logout modal handler
        const btnTrigger = document.getElementById('btnTriggerLogout');
        const modal = document.getElementById('logoutModal');
        const modalBox = document.getElementById('logoutModalBox');
        const cancelBtn = document.getElementById('btnCancelLogout');
        const overlay = document.getElementById('logoutOverlay');

        function showModal() {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modalBox.classList.remove('scale-95', 'opacity-0');
                modalBox.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function hideModal() {
            modalBox.classList.remove('scale-100', 'opacity-100');
            modalBox.classList.add('scale-95', 'opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
        if (btnTrigger) btnTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
        if (cancelBtn) cancelBtn.addEventListener('click', hideModal);
        if (overlay) overlay.addEventListener('click', hideModal);
    </script>
    <script src="js/sidebar-admin.js?v=<?= time() ?>"></script>
</body>

</html>