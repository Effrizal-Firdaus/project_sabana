document.addEventListener("DOMContentLoaded", function() {
    const orderQty = document.getElementById('orderQty');
    const decrementBtn = document.getElementById('decrementQty');
    const incrementBtn = document.getElementById('incrementQty');
    const orderBtn = document.getElementById('orderNowBtn');
    const productImg = document.getElementById('productMainImg');
    const stockSpan = document.getElementById('stockValue');
    const cartBadge = document.getElementById('cartBadge');

    // ===== PER-USER CART STORAGE =====
    const userId = document.body.getAttribute('data-user-id') || '';
    const cartStorageKey = userId ? `sabanaCart_${userId}` : 'sabanaCart_guest';

    let maxStock = parseInt(stockSpan.innerText);
    const menuId = document.getElementById('menuIdHidden').value;
    const menuName = document.getElementById('menuNameHidden').value;
    const menuPrice = parseInt(document.getElementById('menuPriceHidden').value);
    const menuImg = document.getElementById('menuImgHidden').value;
    const menuKategori = document.getElementById('menuKategoriHidden').value;

    let cart = [];

    function loadCart() {
        const stored = localStorage.getItem(cartStorageKey);
        cart = stored ? JSON.parse(stored) : [];
        updateCartBadge();
    }

    function saveCart() {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        updateCartBadge();
    }

    function updateCartBadge() {
        const uniqueItems = cart.length;
        if (uniqueItems > 0) {
            cartBadge.innerText = uniqueItems;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    }

    const warningBox = document.getElementById('pesanWarning');
    let warningTimeout = null;
    function showWarning(message) {
        if (!warningBox) return;
        const alertText = warningBox.querySelector('.alert-text');
        if (warningTimeout) clearTimeout(warningTimeout);
        if (alertText) alertText.textContent = message;
        warningBox.classList.remove('hidden');
        warningBox.classList.add('show');
        warningTimeout = setTimeout(() => {
            hideWarning();
        }, 3000);
    }

    function hideWarning() {
        if (!warningBox) return;
        if (warningTimeout) {
            clearTimeout(warningTimeout);
            warningTimeout = null;
        }
        const alertText = warningBox.querySelector('.alert-text');
        if (alertText) alertText.textContent = '';
        warningBox.classList.add('hidden');
        warningBox.classList.remove('show');
    }

    function addToCart(qty) {
        const existing = cart.find(item => item.id === menuId);
        if (existing) {
            const newQty = existing.qty + qty;
            if (newQty > maxStock) {
                showWarning(`Stok hanya tersisa ${maxStock}.`);
                return;
            }
            existing.qty = newQty;
            existing.stock = maxStock;
        } else {
            if (qty > maxStock) {
                showWarning(`Stok hanya tersisa ${maxStock}.`);
                return;
            }
            cart.push({
                id: menuId,
                name: menuName,
                price: menuPrice,
                img: menuImg,
                qty: qty,
                kategori: menuKategori,
                stock: maxStock
            });
        }
        saveCart();
        const floatingCart = document.getElementById('floatingCart');
        if (floatingCart) {
            floatingCart.style.transform = 'scale(1.2)';
            setTimeout(() => floatingCart.style.transform = '', 200);
        }
    }

    function animateFlyToCart() {
        if (!productImg) return;
        const rect = productImg.getBoundingClientRect();
        const startX = rect.left + rect.width / 2 - 27.5;
        const startY = rect.top + rect.height / 2 - 27.5;
        const floatingCart = document.getElementById('floatingCart');
        if (!floatingCart) return;
        const cartRect = floatingCart.getBoundingClientRect();
        const endX = cartRect.left + cartRect.width / 2 - 27.5;
        const endY = cartRect.top + cartRect.height / 2 - 27.5;

        const flyer = document.createElement('div');
        flyer.className = 'flying-item';
        flyer.style.backgroundImage = `url('../img/${menuImg}')`;
        flyer.style.left = startX + 'px';
        flyer.style.top = startY + 'px';
        document.body.appendChild(flyer);

        setTimeout(() => {
            flyer.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.4) rotate(5deg)`;
        }, 20);

        setTimeout(() => {
            flyer.remove();
        }, 1100);
    }

    function updateQuantity() {
        let val = parseInt(orderQty.value);
        if (isNaN(val)) val = 1;
        if (val > maxStock) {
            orderQty.value = maxStock;
            showWarning('Stok hanya tersisa ' + maxStock);
        } else if (val < 1) {
            orderQty.value = 1;
            hideWarning();
        } else {
            hideWarning();
        }
    }

    if (decrementBtn) decrementBtn.addEventListener('click', () => {
        let val = parseInt(orderQty.value);
        if (val > 1) orderQty.value = val - 1;
        updateQuantity();
    });
    if (incrementBtn) incrementBtn.addEventListener('click', () => {
        let val = parseInt(orderQty.value);
        if (val < maxStock) orderQty.value = val + 1;
        updateQuantity();
    });
    if (orderQty) {
        orderQty.addEventListener('change', updateQuantity);
        orderQty.setAttribute('max', maxStock);
    }

    if (orderBtn) {
        orderBtn.addEventListener('click', function(e) {
            const isLoggedIn = document.body.getAttribute('data-logged-in') === 'true';
            if (!isLoggedIn) {
                showLoginModal();
                return;
            }
            const qty = parseInt(orderQty.value);
            if (qty > maxStock) {
                showWarning(`Stok tidak mencukupi! Maksimal ${maxStock}.`);
                return;
            }
            hideWarning();
            addToCart(qty);
            animateFlyToCart();
            // Tidak ada alert "telah ditambahkan"
        });
    }

    // Modal login (salin dari kode asli Anda)
    const loginModal = document.getElementById('loginWarningModal');
    const modalCancel = document.getElementById('modalCancelBtn');
    const modalLogin = document.getElementById('modalLoginBtn');
    function showLoginModal() { if (loginModal) loginModal.classList.add('show'); }
    function hideLoginModal() { if (loginModal) loginModal.classList.remove('show'); }
    if (modalCancel) modalCancel.addEventListener('click', hideLoginModal);
    if (modalLogin) modalLogin.addEventListener('click', () => window.location.href = 'login.html');
    if (loginModal) loginModal.addEventListener('click', (e) => { if (e.target === loginModal) hideLoginModal(); });

    // Modal kategori
    const lihatSemuaBtn = document.getElementById('lihatSemuaMenuBtn');
    const kategoriModal = document.getElementById('kategoriModal');
    const closeKategoriModal = document.getElementById('closeKategoriModal');
    const modalKategoriContent = document.getElementById('modalKategoriContent');
    if (lihatSemuaBtn && kategoriModal) {
        lihatSemuaBtn.addEventListener('click', () => {
            kategoriModal.classList.remove('hidden');
            setTimeout(() => {
                if (modalKategoriContent) {
                    modalKategoriContent.classList.remove('scale-95', 'opacity-0');
                    modalKategoriContent.classList.add('scale-100', 'opacity-100');
                }
            }, 10);
        });
    }
    function closeModalKategori() {
        if (modalKategoriContent) {
            modalKategoriContent.classList.add('scale-95', 'opacity-0');
            modalKategoriContent.classList.remove('scale-100', 'opacity-100');
        }
        setTimeout(() => { if (kategoriModal) kategoriModal.classList.add('hidden'); }, 300);
    }
    if (closeKategoriModal) closeKategoriModal.addEventListener('click', closeModalKategori);
    if (kategoriModal) kategoriModal.addEventListener('click', (e) => { if (e.target === kategoriModal) closeModalKategori(); });

    if (productImg) {
        productImg.addEventListener('click', function(e) {
            this.classList.add('img-clicked');
            setTimeout(() => this.classList.remove('img-clicked'), 400);
        });
    }

    loadCart();

    // Reload cart ketika halaman ditampilkan kembali (dari back button atau history)
    window.addEventListener('pageshow', function() {
        loadCart();
    });
});