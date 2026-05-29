<?php
session_start();
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    header('Location: ../user/login.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan - Admin Sabana</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/dashboard.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }
    </style>
</head>

<body class="bg-gray-100">
    <div class="flex min-h-screen">
        <!-- Sidebar (sama seperti di pengguna, dengan active pada Laporan) -->
        <div class="w-80 bg-gradient-to-br from-[#2c3e50] to-[#34495e] text-white fixed h-full overflow-y-auto shadow-lg">
            <div class="p-6">
                <div class="flex items-center gap-3 bg-[#4a5d42]/30 p-4 rounded-xl mb-8">
                    <i class="fa-solid fa-user-shield text-3xl"></i>
                    <h2 class="text-xl font-bold whitespace-nowrap">Admin Panel</h2>
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
                    <a href="kelola_menu.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
                        <i class="fa-solid fa-utensils w-5"></i> Kelola Menu
                    </a>
                    <a href="pesanan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
                        <i class="fa-solid fa-receipt w-5"></i>
                        <span>Pesanan</span>
                        <span id="pesananBadge" class="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 hidden">0</span>
                    </a>
                    <a href="pengguna.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
                        <i class="fa-solid fa-users w-5"></i> Pengguna
                    </a>
                    <a href="laporan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 bg-[#4a5d42] text-white shadow-lg border-l-4 border-green-300 font-semibold">
                        <i class="fa-solid fa-file-alt w-5"></i> Laporan
                    </a>
                    <a href="masukan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
                        <i class="fa-solid fa-message w-5"></i><span>Masukan</span>
                    </a>
                    <a href="ulasan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
                        <i class="fa-solid fa-star w-5"></i> Ulasan
                    </a>
                    <a href="#" id="btnTriggerLogout" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-[#00f5ec] hover:bg-[#00f5ec]/20 hover:text-white mt-8 pt-4 border-t border-gray-700">
                        <i class="fa-solid fa-sign-out-alt w-5"></i> Logout
                    </a>
                </nav>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 ml-80 bg-slate-50 min-h-screen">
            <header class="sticky top-0 z-40 px-10 pt-6 pb-4 bg-slate-50/90 backdrop-blur-md border-b border-gray-200/50">
                <div class="flex justify-between items-center bg-white p-4 pl-5 rounded-2xl shadow-sm border border-gray-100">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4a5d42]/20 to-[#4a5d42]/5 flex items-center justify-center border border-[#4a5d42]/10">
                            <i class="fa-solid fa-chart-simple text-[#4a5d42] text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">Laporan & Statistik</h1>
                            <p class="text-xs text-gray-400">Analisis penjualan, pendapatan, dan stok</p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button id="exportExcelBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md flex items-center gap-2">
                            <i class="fa-solid fa-file-excel"></i> Export Excel
                        </button>
                        <button id="exportPdfBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md flex items-center gap-2">
                            <i class="fa-solid fa-file-pdf"></i> Export PDF
                        </button>
                    </div>
                </div>
            </header>

            <div class="p-10">
                <!-- Filter periode -->
                <div class="bg-white p-6 rounded-2xl shadow-md mb-8">
                    <h2 class="text-lg font-bold mb-4">Filter Laporan</h2>
                    <div class="flex flex-wrap gap-4 items-end">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Dari Tanggal</label>
                            <input type="date" id="tglMulai" class="border rounded-xl px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Sampai Tanggal</label>
                            <input type="date" id="tglSelesai" class="border rounded-xl px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Tipe Laporan</label>
                            <select id="tipeLaporan" class="border rounded-xl px-3 py-2">
                                <option value="penjualan">Penjualan Harian</option>
                                <option value="produk">Produk Terlaris</option>
                                <option value="stok">Stok Menu</option>
                            </select>
                        </div>
                        <button id="btnFilter" class="bg-[#4a5d42] hover:bg-[#35432f] text-white px-6 py-2 rounded-xl font-bold">Tampilkan</button>
                    </div>
                </div>

                <!-- Grafik / tabel hasil -->
                <div id="laporanContainer" class="bg-white rounded-2xl shadow-md p-6">
                    <div class="text-center text-gray-400 py-16">Pilih filter dan klik Tampilkan</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Logout (sama) -->
    <div id="logoutModal" class="fixed inset-0 z-50 hidden flex items-center justify-center">...</div>

    <script src="js/toast.js"></script>
    <script src="js/laporan.js"></script>
    <script src="js/notifications.js"></script>
    <script src="js/sidebar-admin.js?v=<?= time() ?>"></script>
</body>

</html>