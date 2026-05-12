document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. LOGIKA NAVBAR ACTIVE (Garis Bawah & Huruf Merah) ---
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", function () {
            // Hapus class 'active' dari semua menu
            navLinks.forEach((item) => item.classList.remove("active"));
            
            // Tambahkan class 'active' ke menu yang baru saja diklik
            this.classList.add("active");
        });
    });

    // --- 2. INISIALISASI SWIPER (Geser Otomatis) ---
    const swiper = new Swiper(".mySwiper", {
        loop: true, // Berputar terus menerus
        autoplay: {
            delay: 2000, // Bergeser setiap 2 detik
            disableOnInteraction: false, // Tetap geser otomatis meski sudah diklik user
            pauseOnMouseEnter: true, // Berhenti sebentar saat mouse di atas gambar
        },
        speed: 2000, // Kecepatan transisi (1 detik agar halus)
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        // Jika butuh tombol panah, aktifkan ini:
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
});