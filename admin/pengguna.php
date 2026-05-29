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
    <title>Manajemen Pengguna - Admin Sabana</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/dashboard.css">
    <link rel="stylesheet" href="css/pengguna.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }
    </style>
</head>

<body class="bg-gray-100">
    <div class="flex min-h-screen">
        <!-- Sidebar (sama seperti di dashboard) -->
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
                    <a href="pengguna.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 bg-[#4a5d42] text-white shadow-lg border-l-4 border-green-300 font-semibold">
                        <i class="fa-solid fa-users w-5"></i> Pengguna
                    </a>
                    <a href="laporan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
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
                            <i class="fa-solid fa-users text-[#4a5d42] text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">Manajemen Pengguna</h1>
                            <p class="text-xs text-gray-400">Kelola akun admin dan pelanggan</p>
                        </div>
                    </div>
                    <button id="btnTambahUser" class="bg-[#4a5d42] hover:bg-[#35432f] text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-2 transition">
                        <i class="fa-solid fa-plus"></i> Tambah Pengguna
                    </button>
                </div>
            </header>

            <div class="p-10">
                <div class="bg-white rounded-2xl shadow-md p-6">
                    <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <div class="relative">
                            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input type="text" id="searchUser" placeholder="Cari nama atau email..." class="pl-10 pr-4 py-2 border rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-[#4a5d42]">
                        </div>
                        <div>
                            <select id="filterRole" class="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a5d42]">
                                <option value="semua">Semua Role</option>
                                <option value="admin">Admin</option>
                                <option value="pelanggan">Pelanggan</option>
                            </select>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border border-gray-200 rounded-xl">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nama</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Email</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Role</th>
                                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Dibuat</th>
                                    <th class="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="userTableBody">
                                <tr>
                                    <td colspan="6" class="text-center py-8 text-gray-400">Memuat data...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Tambah/Edit User -->
    <div id="userModal" class="fixed inset-0 z-50 hidden flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" id="userModalOverlay"></div>
        <div class="bg-white rounded-2xl shadow-2xl p-6 z-10 w-full max-w-md transform scale-95 opacity-0 transition-all duration-300" id="userModalBox">
            <div class="flex justify-between items-center mb-4">
                <h3 id="userModalTitle" class="text-xl font-bold text-gray-800">Tambah Pengguna</h3>
                <button id="btnCloseUserModal" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form id="userForm">
                <input type="hidden" id="userId">
                <div class="mb-3">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                    <input type="text" id="userNama" required class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#4a5d42]">
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input type="email" id="userEmail" required class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#4a5d42]">
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                    <select id="userRole" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#4a5d42]">
                        <option value="pelanggan">Pelanggan</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div id="passwordField" class="mb-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input type="password" id="userPassword" class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#4a5d42]">
                    <p class="text-xs text-gray-400 mt-1">* Kosongkan jika tidak ingin mengubah (untuk edit)</p>
                </div>
                <div class="flex gap-3">
                    <button type="button" id="btnCancelUser" class="flex-1 modal-btn-cancel py-2 rounded-xl font-bold">Batal</button>
                    <button type="submit" class="flex-1 modal-btn-confirm py-2 rounded-xl font-bold">Simpan</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Hapus User -->
    <div id="deleteUserModal" class="fixed inset-0 z-50 hidden flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" id="deleteUserOverlay"></div>
        <div class="bg-white rounded-2xl shadow-2xl p-6 z-10 w-full max-w-sm transform scale-95 opacity-0 transition-all duration-300 text-center" id="deleteUserBox">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-trash-can text-2xl text-red-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Hapus Pengguna?</h3>
            <p class="text-gray-500 mb-6">Data pengguna akan dihapus secara permanen.</p>
            <div class="flex gap-3">
                <button id="btnCancelDeleteUser" class="flex-1 modal-btn-cancel py-2 rounded-xl font-bold">Batal</button>
                <button id="btnConfirmDeleteUser" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-bold">Hapus</button>
            </div>
        </div>
    </div>

    <!-- Modal Reset Password -->
    <div id="resetPasswordModal" class="fixed inset-0 z-50 hidden flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" id="resetPasswordOverlay"></div>
        <div class="bg-white rounded-2xl shadow-2xl p-6 z-10 w-full max-w-sm transform scale-95 opacity-0 transition-all duration-300 text-center" id="resetPasswordBox">
            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-key text-2xl text-yellow-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Reset Password</h3>
            <p class="text-gray-500 mb-4">Password baru akan direset menjadi <span class="font-mono bg-gray-100 px-2 py-1 rounded">12345678</span></p>
            <div class="flex gap-3">
                <button id="btnCancelReset" class="flex-1 modal-btn-cancel py-2 rounded-xl font-bold">Batal</button>
                <button id="btnConfirmReset" class="flex-1 bg-[#4a5d42] hover:bg-[#35432f] text-white py-2 rounded-xl font-bold">Reset</button>
            </div>
        </div>
    </div>

    <!-- Modal Logout (sama seperti sebelumnya) -->
    <div id="logoutModal" class="fixed inset-0 z-50 hidden flex items-center justify-center">...</div>

    <script src="js/toast.js"></script>
    <script src="js/pengguna.js"></script>
    <script src="js/notifications.js"></script>
    <script>
        // Logout modal handler (copy dari dashboard)
        const btnTrigger = document.getElementById('btnTriggerLogout');
        const logoutModal = document.getElementById('logoutModal');
        const logoutBox = document.getElementById('logoutModalBox');
        const logoutCancel = document.getElementById('btnCancelLogout');
        const logoutOverlay = document.getElementById('logoutOverlay');

        function showLogout() {
            logoutModal.classList.remove('hidden');
            setTimeout(() => {
                logoutBox.classList.remove('scale-95', 'opacity-0');
                logoutBox.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function hideLogout() {
            logoutBox.classList.remove('scale-100', 'opacity-100');
            logoutBox.classList.add('scale-95', 'opacity-0');
            setTimeout(() => logoutModal.classList.add('hidden'), 300);
        }
        if (btnTrigger) btnTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            showLogout();
        });
        if (logoutCancel) logoutCancel.addEventListener('click', hideLogout);
        if (logoutOverlay) logoutOverlay.addEventListener('click', hideLogout);
    </script>
    <script src="js/sidebar-admin.js?v=<?= time() ?>"></script>
</body>

</html>