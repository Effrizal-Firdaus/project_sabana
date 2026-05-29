// ========== GLOBAL JS (Navbar, Hamburger, Modal, dll) ==========
document.addEventListener("DOMContentLoaded", function() {
    // Hamburger menu (jika ada di halaman)
    const hamburger = document.getElementById('hamburgerMenu');
    const navContainer = document.getElementById('navContainer');
    if (hamburger && navContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navContainer.classList.toggle('active');
        });
    }

    // Active class untuk nav-link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            if (window.innerWidth <= 768 && navContainer && navContainer.classList.contains('active')) {
                if (hamburger) hamburger.classList.remove('active');
                navContainer.classList.remove('active');
            }
        });
    });
});