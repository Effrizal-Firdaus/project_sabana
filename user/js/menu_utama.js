document.addEventListener("DOMContentLoaded", function () {
    // ========== 1. SWIPER ==========
    const swiper = new Swiper(".mySwiper", {
        loop: true,
        autoplay: { delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true },
        speed: 2000,
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    });

    // ========== 2. PAGINATION MENU (jika ada) ==========
    const menuGroups = document.querySelectorAll('.menu-group');
    const btnNext = document.getElementById('globalBtnNext');
    const btnBack = document.getElementById('globalBtnBack');
    const pageDots = document.querySelectorAll('.page-dot');
    let currentIndex = 0;
    if (menuGroups.length > 0) {
        function renderMenu() {
            menuGroups.forEach((group, index) => {
                if (index === currentIndex) group.classList.remove('hidden');
                else group.classList.add('hidden');
            });
            if (btnBack) btnBack.classList.toggle('invisible', currentIndex === 0);
            if (btnNext) btnNext.classList.toggle('invisible', currentIndex === menuGroups.length - 1);
            pageDots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('bg-red-600', 'text-white', 'shadow-md');
                    dot.classList.remove('bg-gray-300', 'text-gray-700', 'hover:bg-gray-400');
                } else {
                    dot.classList.remove('bg-red-600', 'text-white', 'shadow-md');
                    dot.classList.add('bg-gray-300', 'text-gray-700', 'hover:bg-gray-400');
                }
            });
        }
        if (btnNext) btnNext.addEventListener('click', () => { if (currentIndex < menuGroups.length - 1) { currentIndex++; renderMenu(); document.getElementById('menu').scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
        if (btnBack) btnBack.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; renderMenu(); document.getElementById('menu').scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
        pageDots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                const targetIndex = parseInt(e.target.getAttribute('data-target'));
                if (targetIndex !== currentIndex) { currentIndex = targetIndex; renderMenu(); document.getElementById('menu').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            });
        });
        renderMenu();
    }

    // ========== 3. EFEK NGEPER PADA CARD MENU (tanpa modal) ==========
    const menuItems = document.querySelectorAll('#menu .group');
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            this.classList.add('menu-item-clicked');
            setTimeout(() => this.classList.remove('menu-item-clicked'), 400);
        });
    });

    // ========== 4. MODAL PERINGATAN LOGIN (hanya tombol pesan sekarang) ==========
    const isLoggedIn = document.body.getAttribute('data-logged-in') === 'true';
    const modal = document.getElementById('loginWarningModal');
    const cancelBtn = document.getElementById('modalCancelBtn');
    const loginBtn = document.getElementById('modalLoginBtn');
    function showModal() { if (modal) modal.classList.add('show'); }
    function hideModal() { if (modal) modal.classList.remove('show'); }
    if (cancelBtn) cancelBtn.addEventListener('click', hideModal);
    if (loginBtn) loginBtn.addEventListener('click', () => window.location.href = 'login.html');
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
    const pesanButtons = document.querySelectorAll('.btn-pesan-sekarang');
    pesanButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (isLoggedIn) return;
            e.preventDefault();
            e.stopPropagation();
            showModal();
        });
    });

    // ========== 5. DROPDOWN MENU (Toggle on click, bukan hover) ==========
    const menuDropdownBtn = document.getElementById('menuDropdownBtn');
    const menuDropdownContent = document.getElementById('menuDropdownContent');
    const menuArrow = document.getElementById('menuArrow');
    if (menuDropdownBtn && menuDropdownContent) {
        menuDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menuDropdownContent.classList.toggle('hidden');
            if (menuArrow) menuArrow.classList.toggle('rotate');
        });
        // Tutup dropdown jika klik di luar
        document.addEventListener('click', function(e) {
            if (!menuDropdownBtn.contains(e.target)) {
                if (!menuDropdownContent.classList.contains('hidden')) {
                    menuDropdownContent.classList.add('hidden');
                    if (menuArrow) menuArrow.classList.remove('rotate');
                }
            }
        });
    }

    // ========== 6. EFEK NGEPER PADA IKON SOSIAL MEDIA FOOTER ==========
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            this.classList.add('social-icon-clicked');
            setTimeout(() => this.classList.remove('social-icon-clicked'), 400);
        });
    });
});