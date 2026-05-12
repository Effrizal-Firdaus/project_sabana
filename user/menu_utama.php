<?php
session_start();
$sudah_login = isset($_SESSION['user_id']);
$nama_user   = $sudah_login ? htmlspecialchars($_SESSION['nama']) : '';
?>
<!doctype html>
<html lang="id" class="scroll-smooth">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sabana Fried Chicken - Pilihan Keluarga Indonesia</title>

    <!-- CDN Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Link External CSS -->
    <link rel="stylesheet" href="css/menu_utama.css" />

    <!-- Font Awesome -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

    <!-- Swiper CSS -->
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

    <!-- Tailwind Config -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        sabanaRed: "#e11d48",
                        sabanaRedHover: "#be123c",
                        sabanaGold: "#ffcc00",
                        sabanaDark: "#1f2937",
                    },
                },
            },
        };
    </script>
</head>

<body class="bg-gray-50 text-gray-900 antialiased">
    <!-- NAVIGATION -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div
            class="container mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center">
                <img
                    src="../img/Logo_Sabana.png"
                    alt="Sabana Logo"
                    class="h-20 w-auto" />
                <span class="ml-4 text-3xl font-extrabold text-sabanaRed"><span class="text-sabanaGold">.</span></span>
            </div>

            <div class="hidden md:flex items-center space-x-8" id="navbar-menu">
                <a
                    href="menu_utama.php#home"
                    class="nav-link text-gray-700 text-xl font-bold pb-1 transition duration-300">Home</a>
                <a
                    href="menu_utama.php#keunggulan"
                    class="nav-link text-gray-700 text-xl font-bold pb-1 transition duration-300">Keunggulan</a>
                <a
                    href="menu_utama.php#menu"
                    class="nav-link text-gray-700 text-xl font-bold pb-1 transition duration-300">Menu</a>
                <a
                    href="menu_utama.php#lokasi"
                    class="nav-link text-gray-700 text-xl font-bold pb-1 transition duration-300">Lokasi</a>

                <?php if ($sudah_login): ?>
                    <!-- User sudah login: tampilkan nama & tombol Logout -->
                    <a
                        href="process/dashboard.php"
                        class="ml-2 px-6 py-3 bg-gradient-to-r from-sabanaRed to-sabanaGold text-white rounded-full text-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg flex items-center">
                        <i class="fa-solid fa-user mr-2"></i> <?= $nama_user ?>
                    </a>
                    <a
                        href="process/logout.php"
                        class="ml-2 px-6 py-3 border-2 border-sabanaRed text-sabanaRed rounded-full text-xl font-bold hover:bg-sabanaRed hover:text-white transition-all duration-300 flex items-center">
                        <i class="fa-solid fa-right-from-bracket mr-2"></i> Logout
                    </a>
                <?php else: ?>
                    <!-- User belum login: tampilkan tombol Login -->
                    <a
                        href="login.html"
                        class="ml-6 px-8 py-3 bg-gradient-to-r from-sabanaRed to-sabanaGold text-white rounded-full text-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg flex items-center">
                        <i class="fa-solid fa-right-to-bracket mr-3"></i> Login
                    </a>
                <?php endif; ?>
            </div>

            <div class="md:hidden">
                <button class="text-sabanaRed font-bold text-xl">MENU</button>
            </div>
        </div>
    </nav>

    <!-- PROMO SLIDER -->
    <section class="bg-white">
        <div class="swiper mySwiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide relative">
                    <img
                        src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1200&auto=format&fit=crop"
                        alt="Promo 1" />
                    <div
                        class="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-6">
                        <h2
                            class="text-4xl font-black mb-2 uppercase tracking-tighter text-center">
                            Paket Gajian Sabana!
                        </h2>
                        <p class="text-xl mb-6 text-center">
                            Beli Paket dan Combo. Nikmati Sekarang!
                        </p>
                    </div>
                </div>

                <div class="swiper-slide relative">
                    <img
                        src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1600&auto=format&fit=crop"
                        alt="Promo 2"
                        class="w-full h-full object-cover" />
                    <div
                        class="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-6">
                        <h2
                            class="text-4xl font-black mb-2 uppercase tracking-tighter text-center">
                            Menu Baru Sabana!
                        </h2>
                        <p class="text-xl mb-6 text-center">
                            Nikmati kelezatan bumbu rahasia di setiap gigitan.
                        </p>
                    </div>
                </div>

                <div class="swiper-slide relative">
                    <img
                        src="https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=1600&auto=format&fit=crop"
                        alt="Promo 3"
                        class="w-full h-full object-cover" />
                    <div
                        class="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-6">
                        <h2
                            class="text-4xl font-black mb-2 uppercase tracking-tighter text-center">
                            Hemat Bareng Keluarga
                        </h2>
                        <p class="text-xl mb-6 text-center">
                            Dengan varian combo extra. Pesan Sekarang!
                        </p>
                        <a
                            href="login.html"
                            class="bg-gradient-to-r from-sabanaRed to-sabanaGold text-white px-8 py-3 rounded-full font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg inline-block">
                            Pesan Sekarang
                        </a>
                    </div>
                </div>
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-next text-sabanaGold"></div>
            <div class="swiper-button-prev text-sabanaGold"></div>
        </div>
    </section>

    <!-- HERO SECTION -->
    <section
        id="home"
        class="relative bg-gradient-to-br from-orange-50 via-white to-red-100 py-20 md:py-32 overflow-hidden border-b border-gray-100">
        <div
            class="absolute top-0 left-0 w-64 h-64 bg-sabanaGold/10 blur-[100px] rounded-full -ml-20 -mt-20"></div>

        <div
            class="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div class="space-y-8 text-center md:text-left">
                <h1
                    class="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                    Crispy di Luar,<br />Juicy di Dalam.<br />
                    <span
                        class="text-transparent bg-clip-text bg-gradient-to-r from-sabanaRed to-orange-600">
                        Pilihan Keluarga Indonesia.
                    </span>
                </h1>

                <p
                    class="text-xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
                    Nikmati kelezatan ayam goreng autentik Sabana dengan bumbu meresap
                    sempurna.
                    <span class="text-sabanaRed font-bold">Halal, Higienis,</span> dan
                    pastinya bikin nagih!
                </p>

                <div class="flex justify-center md:justify-start pt-4">
                    <a
                        href="#menu"
                        class="px-10 py-4 bg-gradient-to-r from-sabanaRed to-sabanaGold text-white rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl flex items-center group">
                        Lihat Menu Kami
                        <i
                            class="fa-solid fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i>
                    </a>
                </div>
            </div>

            <div class="flex justify-end items-center group w-full relative">
                <div
                    class="absolute inset-0 bg-sabanaRed/5 blur-[80px] rounded-full scale-75 group-hover:bg-sabanaRed/10 transition-all"></div>

                <img
                    src="../img/Ayam_goreng.profil.png"
                    alt="Ayam Goreng"
                    class="w-full h-auto max-w-md lg:max-w-lg object-contain object-right drop-shadow-[0_35px_35px_rgba(225,29,72,0.3)] transform transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:-rotate-2 -mr-10 md:-mr-24 lg:-mr-32 relative z-10" />
            </div>
        </div>
    </section>

    <!-- KEUNGGULAN SECTION -->
    <section id="keunggulan" class="py-20 bg-white">
        <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-16">
                Mengapa Memilih Sabana?
            </h2>
            <div class="grid md:grid-cols-3 gap-8 text-center">
                <div
                    class="bg-gray-50 p-8 rounded-xl shadow border border-gray-100 hover:shadow-lg transition">
                    <div
                        class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-sabanaRed text-3xl mb-6">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">100% Halal</h3>
                    <p class="text-gray-600">
                        Proses penyembelihan dan pengolahan sesuai syariat Islam dan
                        standar SOP ketat.
                    </p>
                </div>
                <div
                    class="bg-gray-50 p-8 rounded-xl shadow border border-gray-100 hover:shadow-lg transition">
                    <div
                        class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-sabanaGold text-3xl mb-6">
                        <i class="fas fa-tag"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">
                        Harga Ekonomis
                    </h3>
                    <p class="text-gray-600">
                        Rasa bintang lima, harga kaki lima. Pas di kantong untuk seluruh
                        keluarga.
                    </p>
                </div>
                <div
                    class="bg-gray-50 p-8 rounded-xl shadow border border-gray-100 hover:shadow-lg transition">
                    <div
                        class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-sabanaRed text-3xl mb-6">
                        <i class="fas fa-store"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">
                        3.000+ Gerai
                    </h3>
                    <p class="text-gray-600">
                        Mudah ditemukan di mana saja, tersebar luas di Pulau Jawa dan
                        Sumatra.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- MENU FAVORIT -->
    <section id="menu" class="py-16 bg-red-50">
        <div class="container mx-auto px-6">
            <h2
                class="text-3xl font-bold text-center mb-12 text-gray-900 tracking-wide uppercase">
                Menu Favorit
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
                <div class="group flex flex-col items-center cursor-pointer">
                    <div
                        class="transition-all duration-500 ease-in-out group-hover:-translate-y-4 group-hover:scale-110">
                        <img
                            src="../img/Ayamdada_Nasi_Esteh.png"
                            alt="Paket Dada"
                            class="w-full aspect-square object-contain drop-shadow-xl" />
                    </div>
                    <h3
                        class="mt-6 text-lg font-bold text-gray-800 group-hover:text-sabanaRed transition-colors duration-300 text-center">
                        Paket Ayam Dada + Es Teh
                    </h3>
                </div>

                <div class="group flex flex-col items-center cursor-pointer">
                    <div
                        class="transition-all duration-500 ease-in-out group-hover:-translate-y-4 group-hover:scale-110">
                        <img
                            src="../img/Ayamsambalgeprek_Nasi_Esteh.png"
                            alt="Paket Geprek"
                            class="w-full aspect-square object-contain drop-shadow-xl" />
                    </div>
                    <h3
                        class="mt-6 text-lg font-bold text-gray-800 group-hover:text-sabanaRed transition-colors duration-300 text-center">
                        Paket Ayam Sambal Geprek + Es Teh
                    </h3>
                </div>

                <div class="group flex flex-col items-center cursor-pointer">
                    <div
                        class="transition-all duration-500 ease-in-out group-hover:-translate-y-4 group-hover:scale-110">
                        <img
                            src="../img/Ayamsambalijo_Nasi_Esteh.png"
                            alt="Paket Sambal Ijo"
                            class="w-full aspect-square object-contain drop-shadow-xl" />
                    </div>
                    <h3
                        class="mt-6 text-lg font-bold text-gray-800 group-hover:text-sabanaRed transition-colors duration-300 text-center">
                        Paket Ayam Sambal Ijo + Es Teh
                    </h3>
                </div>

                <div class="group flex flex-col items-center cursor-pointer">
                    <div
                        class="transition-all duration-500 ease-in-out group-hover:-translate-y-4 group-hover:scale-110">
                        <img
                            src="../img/Ayamsayap_Nasi_Esteh.png"
                            alt="Paket Sayap"
                            class="w-full aspect-square object-contain drop-shadow-xl" />
                    </div>
                    <h3
                        class="mt-6 text-lg font-bold text-gray-800 group-hover:text-sabanaRed transition-colors duration-300 text-center">
                        Paket Ayam Sayap + Es Teh
                    </h3>
                </div>
            </div>
        </div>
    </section>

    <!-- FOOTER / LOKASI -->
    <footer
        id="lokasi"
        class="bg-[#1a1a1a] text-gray-300 pt-16 pb-8 font-sans scroll-mt-24">
        <div
            class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="space-y-6">
                <img
                    src="../img/Logo_Sabana.png"
                    alt="Logo Sabana"
                    class="h-16 w-auto" />
                <div>
                    <h3 class="text-2xl font-bold text-yellow-400 inline-block">
                        Sabana
                    </h3>
                    <span
                        class="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Fried Chicken</span>
                </div>

                <div class="flex space-x-4 pt-2">
                    <a href="https://www.tiktok.com/@sabanaku" target="_blank">
                        <img
                            src="../img/tiktok.png"
                            alt="TikTok"
                            class="w-10 h-10 object-contain" />
                    </a>
                    <a href="https://www.instagram.com/sabanaku/" target="_blank">
                        <img
                            src="../img/instagram.png"
                            alt="Instagram"
                            class="w-10 h-10 object-contain" />
                    </a>
                    <a href="https://www.youtube.com/@sabanaku" target="_blank">
                        <img
                            src="../img/youtube.png"
                            alt="YouTube"
                            class="w-10 h-10 object-contain" />
                    </a>
                    <a href="https://sabana.co.id/" target="_blank">
                        <img
                            src="../img/logo_sabana1.png"
                            alt="Website"
                            class="w-10 h-10 object-contain" />
                    </a>
                </div>
            </div>

            <!-- Kolom 2: Alamat -->
            <div>
                <div class="border-l-4 border-yellow-400 pl-4 mb-6">
                    <h4
                        class="text-lg font-bold text-yellow-400 uppercase tracking-wider">
                        Lokasi Sabana Group
                    </h4>
                </div>
                <div class="flex items-start space-x-3">
                    <i class="fas fa-map-marker-alt text-yellow-400 mt-1"></i>
                    <p class="text-sm leading-relaxed">
                        Jl. Jatimakmur No.36 Kel.Jatimakmur, Kec. Pondok Gede, Kota Bekasi
                    </p>
                </div>
            </div>

            <!-- Kolom 3: Kontak -->
            <div>
                <div class="border-l-4 border-yellow-400 pl-4 mb-6">
                    <h4
                        class="text-lg font-bold text-yellow-400 uppercase tracking-wider">
                        Hubungi Kami
                    </h4>
                </div>
                <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <i class="fab fa-whatsapp text-yellow-400 text-lg"></i>
                        <p class="text-sm">Phone/Whatsapp : 0821-2121-0068</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-envelope text-yellow-400"></i>
                        <p class="text-sm">Email : info@sabana.co.id</p>
                    </div>
                </div>
            </div>

            <!-- Kolom 4: Google Maps -->
            <div>
                <div class="border-l-4 border-yellow-400 pl-4 mb-4">
                    <h4
                        class="text-lg font-bold text-yellow-400 uppercase tracking-tight leading-tight">
                        LOKASI KANTOR PUSAT <br />
                        SABANA GROUP
                    </h4>
                </div>
                <div
                    class="rounded-lg overflow-hidden border border-gray-700 h-48 mb-3">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.986618580227!2d106.92805467571343!3d-6.281487861483861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d77a758cbd9%3A0x11104b365225d356!2sSabana%20Group!5e0!3m2!1id!2sid!4v1709123456789!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style="border: 0"
                        allowfullscreen=""
                        loading="lazy"></iframe>
                </div>
                <a
                    href="https://maps.app.goo.gl/uX7MvPjN7D6qXq9Z9"
                    target="_blank"
                    class="text-xs text-yellow-400 hover:underline flex items-center justify-center">
                    <i class="fas fa-map-pin mr-1"></i> Buka di Google Maps
                </a>
            </div>
        </div>
        <div class="w-full border-t border-gray-800 mt-12 pt-8">
            <p class="text-center text-gray-500 text-sm">
                © 2024 Sabana Group (PT Sarana Berkah Niaga)
            </p>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script src="js/menu_utama.js"></script>
</body>

</html>