document.addEventListener("DOMContentLoaded", function() {
    // 1. Efek ngeper pada semua card menu
    const menuCards = document.querySelectorAll('.group');
    menuCards.forEach(card => {
        card.addEventListener('click', function(e) {
            this.classList.add('menu-item-clicked');
            setTimeout(() => this.classList.remove('menu-item-clicked'), 400);
        });
    });

    // 2. Dropdown Menu (toggle on click)
    const menuDropdownBtn = document.getElementById('menuDropdownBtn');
    const menuDropdownContent = document.getElementById('menuDropdownContent');
    const menuArrow = document.getElementById('menuArrow');
    if (menuDropdownBtn && menuDropdownContent) {
        menuDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menuDropdownContent.classList.toggle('hidden');
            if (menuArrow) menuArrow.classList.toggle('rotate');
        });
        document.addEventListener('click', function(e) {
            if (!menuDropdownBtn.contains(e.target)) {
                if (!menuDropdownContent.classList.contains('hidden')) {
                    menuDropdownContent.classList.add('hidden');
                    if (menuArrow) menuArrow.classList.remove('rotate');
                }
            }
        });
    }

    // 3. Efek ngeper pada ikon sosial media footer
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            this.classList.add('social-icon-clicked');
            setTimeout(() => this.classList.remove('social-icon-clicked'), 400);
        });
    });
});