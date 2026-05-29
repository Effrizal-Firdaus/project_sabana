document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================================
    // LOGIKA CODES DROP-DOWN PANAH DI HALAMAN ARSIP
    // ========================================================
    const toggleArsipBtn = document.getElementById('toggleArsipBtn');
    const submenuArsip = document.getElementById('submenuArsip');

    if (toggleArsipBtn && submenuArsip) {
        toggleArsipBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah bubbling klik
            
            // Cek kondisi apakah submenu sedang disembunyikan
            const isHidden = submenuArsip.style.display === 'none' || submenuArsip.classList.contains('hidden');
            
            if (isHidden) {
                // Tampilkan submenu dengan paksa menggunakan flex layout Tailwind
                submenuArsip.classList.remove('hidden');
                submenuArsip.style.display = 'flex';
                // Putar panah ke bawah (180 derajat)
                toggleArsipBtn.style.transform = 'rotate(180deg)';
            } else {
                // Sembunyikan kembali submenu
                submenuArsip.style.display = 'none';
                submenuArsip.classList.add('hidden');
                // Balikkan panah ke posisi awal (0 derajat)
                toggleArsipBtn.style.transform = 'rotate(0deg)';
            }
        });
    }

});