// admin/js/sidebar-admin.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================================
    // 1. LOGIKA GLOBAL DROPDOWN SIDEBAR (PANAH ARSIP)
    // ========================================================
    const toggleArsipBtn = document.getElementById('toggleArsipBtn');
    const submenuArsip = document.getElementById('submenuArsip');

    if (toggleArsipBtn && submenuArsip) {
        toggleArsipBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah efek bubbling/klik nyasar
            
            // Cek apakah submenu saat ini sedang tersembunyi
            const isHidden = submenuArsip.classList.contains('hidden') || window.getComputedStyle(submenuArsip).display === 'none';
            
            if (isHidden) {
                // Tampilkan submenu dengan flex layout
                submenuArsip.classList.remove('hidden');
                submenuArsip.style.display = 'flex';
                // Putar panah ke bawah (180 derajat)
                toggleArsipBtn.style.transform = 'rotate(180deg)';
            } else {
                // Sembunyikan submenu
                submenuArsip.style.display = 'none';
                submenuArsip.classList.add('hidden');
                // Kembalikan panah ke posisi awal (0 derajat)
                toggleArsipBtn.style.transform = 'rotate(0deg)';
            }
        });
    }

    // ========================================================
    // 2. LOGIKA GLOBAL MODAL LOGOUT (Agar tidak perlu ditulis di PHP)
    // ========================================================
    const btnTrigger = document.getElementById('btnTriggerLogout');
    const modal = document.getElementById('logoutModal');
    const modalBox = document.getElementById('logoutModalBox');
    const cancelBtn = document.getElementById('btnCancelLogout');
    const overlay = document.getElementById('logoutOverlay');

    function showLogoutModal() {
        if (modal && modalBox) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modalBox.classList.remove('scale-95', 'opacity-0');
                modalBox.classList.add('scale-100', 'opacity-100');
            }, 10);
        }
    }

    function hideLogoutModal() {
        if (modal && modalBox) {
            modalBox.classList.remove('scale-100', 'opacity-100');
            modalBox.classList.add('scale-95', 'opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    }

    if (btnTrigger) {
        btnTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            showLogoutModal();
        });
    }
    if (cancelBtn) cancelBtn.addEventListener('click', hideLogoutModal);
    if (overlay) overlay.addEventListener('click', hideLogoutModal);

});