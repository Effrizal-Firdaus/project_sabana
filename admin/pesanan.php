<?php
session_start();
if (!isset($_SESSION['admin']) || $_SESSION['admin']['peran'] !== 'admin') {
    header('Location: ../user/login.html');
    exit;
}
include_once __DIR__ . '/../server/koneksi.php';

$query = "SELECT 
            p.id AS pesanan_id,
            p.id_pengguna,
            p.jenis_pesanan,
            p.total_harga,
            p.status,
            p.dibuat_pada,
            pg.nama AS customer_name,
            pg.email,
            pir.alamat,
            pir.deskripsi AS catatan,
            pay.metode_pembayaran,
            pay.status_pembayaran
          FROM pesanan p
          JOIN pengguna pg ON p.id_pengguna = pg.id
          LEFT JOIN pengiriman pir ON p.id = pir.id_pesanan
          LEFT JOIN pembayaran pay ON p.id = pay.id_pesanan
          WHERE p.status = 'disiapkan' 
            AND p.dikonfirmasi = 0
          ORDER BY p.dibuat_pada ASC";

$result = mysqli_query($conn, $query);
$pesanan_list = [];
while ($row = mysqli_fetch_assoc($result)) {
    $id_pesanan = $row['pesanan_id'];
    $detail_query = "SELECT dp.jumlah, dp.harga, m.nama_menu 
                     FROM detail_pesanan dp 
                     JOIN menu m ON dp.id_menu = m.id 
                     WHERE dp.id_pesanan = $id_pesanan";
    $detail_res = mysqli_query($conn, $detail_query);
    $items = [];
    while ($item = mysqli_fetch_assoc($detail_res)) {
        $items[] = [
            'name' => $item['nama_menu'],
            'qty' => $item['jumlah'],
            'price' => $item['harga']
        ];
    }

    $pesanan_list[] = [
        'id' => $row['pesanan_id'],
        'customer' => $row['customer_name'],
        'total' => (int)$row['total_harga'],
        'paymentMethod' => $row['metode_pembayaran'] ?? 'COD',
        'paymentStatus' => $row['status_pembayaran'] ?? 'belum',
        'address' => $row['alamat'] ?? '',
        'note' => $row['catatan'] ?? '',
        'createdAt' => $row['dibuat_pada'],
        'items' => $items,
        'jenis_pesanan' => $row['jenis_pesanan'] ?? 'delivery'   // <-- TAMBAHKAN INI
    ];
}
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesanan Masuk - Sabana Fried Chicken</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/dashboard.css">
    <link rel="stylesheet" href="css/pesanan.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }

        .timer-badge {
            font-family: monospace;
            font-weight: 700;
        }
    </style>
</head>

<body class="bg-slate-50">
    <div class="flex min-h-screen">
        <!-- SIDEBAR -->
        <div class="w-80 bg-gradient-to-br from-[#2c3e50] to-[#34495e] text-white fixed h-full overflow-y-auto shadow-lg z-30">
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
                        <i class="fa-solid fa-utensils w-5"></i> <span>Kelola Menu</span>
                    </a>
                    <a href="pesanan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 bg-[#4a5d42] text-white shadow-lg border-l-4 border-green-300 font-semibold">
                        <i class="fa-solid fa-receipt w-5"></i>
                        <span>Pesanan</span>
                        <span id="pesananBadge" class="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 hidden">0</span>
                    </a>
                    <a href="pengguna.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
                        <i class="fa-solid fa-users w-5"></i> <span>Pengguna</span>
                    </a>
                    <a href="laporan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
                        <i class="fa-solid fa-file-alt w-5"></i> <span>Laporan</span>
                    </a>
                    <a href="masukan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
                        <i class="fa-solid fa-message w-5"></i><span>Masukan</span>
                    </a>
                    <a href="ulasan.php" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2">
                        <i class="fa-solid fa-star w-5"></i> Ulasan
                    </a>
                    <a href="#" id="btnTriggerLogout" class="nav-item-admin flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-[#00f5ec] hover:bg-[#00f5ec]/20 hover:text-white mt-8 pt-4 border-t border-gray-700">
                        <i class="fa-solid fa-sign-out-alt w-5"></i> <span>Logout</span>
                    </a>
                </nav>
            </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="flex-1 ml-80 bg-slate-50 min-h-screen p-10">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-2xl font-extrabold text-gray-800">📋 Pesanan Delivery Masuk</h1>
                <div class="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
                    <i class="fa-regular fa-clock"></i> pesanan dengan status <span class="font-bold text-green-500">disiapkan</span> yang belum dikonfirmasi oleh admin
                </div>
            </div>
            <div id="newOrdersContainer" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- JS akan mengisi -->
            </div>
        </div>
    </div>

    <!-- MODAL LOGOUT -->
    <div id="logoutModal" class="fixed inset-0 z-50 hidden flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" id="logoutOverlay"></div>
        <div class="bg-white rounded-2xl shadow-2xl p-8 z-10 w-full max-w-sm transform scale-95 opacity-0 transition-all duration-300 flex flex-col items-center text-center" id="logoutModalBox">
            <div class="w-16 h-16 bg-[#4a5d42]/10 rounded-full flex items-center justify-center mb-5">
                <i class="fa-solid fa-arrow-right-from-bracket text-3xl text-[#4a5d42]"></i>
            </div>
            <h3 class="text-xl font-extrabold text-gray-800 mb-2">Konfirmasi Logout</h3>
            <p class="text-gray-500 mb-8 text-sm">Apakah Anda yakin ingin keluar?</p>
            <div class="flex gap-4 w-full">
                <button id="btnCancelLogout" class="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-bold">Tidak</button>
                <a href="process/logout.php" class="flex-1 bg-gradient-to-r from-[#2c3e50] to-[#4a5d42] hover:brightness-110 text-white py-3 rounded-xl font-bold text-center">Iya, Logout</a>
            </div>
        </div>
    </div>

    <script>
        const newOrders = <?php echo json_encode($pesanan_list); ?>;
    </script>
    <script src="js/toast.js"></script>
    <script src="js/pesanan.js"></script>
    <script src="js/notifications.js"></script>
    <script>
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
        btnTrigger?.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
        cancelBtn?.addEventListener('click', hideModal);
        overlay?.addEventListener('click', hideModal);
    </script>
    <script src="js/toast.js"></script>
    <script src="js/notifications.js"></script>
    <script src="js/sidebar-admin.js?v=<?= time() ?>"></script>
</body>

</html>