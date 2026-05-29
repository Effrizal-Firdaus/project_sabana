document.addEventListener("DOMContentLoaded", function() {
    const cartContainer = document.getElementById('cartContainer');
    const isLoggedIn = document.body.getAttribute('data-logged-in') === 'true';
    const floatingCart = document.getElementById('floatingCart');
    const cartBadge = document.getElementById('cartBadge');

    // ========== 1. MODAL LOGIN ==========
    const loginModal = document.getElementById('loginWarningModal');
    const modalCancel = document.getElementById('modalCancelBtn');
    const modalLogin = document.getElementById('modalLoginBtn');
    const modalContent = document.getElementById('modalContent');

    function showLoginModal() {
        if (loginModal) {
            loginModal.classList.remove('hidden');
            setTimeout(() => {
                if (modalContent) {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }
            }, 10);
        }
    }
    function hideLoginModal() {
        if (modalContent) {
            modalContent.classList.add('scale-95', 'opacity-0');
            modalContent.classList.remove('scale-100', 'opacity-100');
        }
        setTimeout(() => {
            if (loginModal) loginModal.classList.add('hidden');
        }, 300);
    }

    if (modalCancel) modalCancel.addEventListener('click', hideLoginModal);
    if (modalLogin) modalLogin.addEventListener('click', () => window.location.href = 'login.html');
    if (loginModal) loginModal.addEventListener('click', (e) => { if (e.target === loginModal) hideLoginModal(); });

    // ========== 2. BELUM LOGIN ==========
    if (!isLoggedIn) {
        if (cartContainer) {
            cartContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <img src="../img/keranjang.png" alt="Keranjang" class="w-20 h-20 mb-4 object-contain" onerror="this.src='https://placehold.co/80x80/e11d48/white?text=Cart'">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Oops! Belum Login</h3>
                    <p class="text-gray-500 mb-5 max-w-md text-sm">Silakan login terlebih dahulu untuk melihat dan mengelola keranjang belanja Anda.</p>
                    <button id="loginNowBtn" class="login-now-btn bg-sabanaRed text-white px-6 py-2.5 rounded-full font-semibold text-base shadow-md flex items-center gap-2 hover:bg-red-700 active:bg-[#7f1d1d] transition-all duration-200">
                        <i class="fa-solid fa-arrow-right-to-bracket"></i> Login Sekarang
                    </button>
                </div>
            `;
            const loginNowBtn = document.getElementById('loginNowBtn');
            if (loginNowBtn) {
                loginNowBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    loginNowBtn.classList.add('btn-ngeper');
                    setTimeout(() => loginNowBtn.classList.remove('btn-ngeper'), 350);
                    setTimeout(() => window.location.href = 'login.html', 200);
                });
            }
        }
        showLoginModal();
        return;
    }

    // ========== 3. KODE KERANJANG ==========
    let cart = [];
    let checkedState = [];

    // ===== PER-USER CART ISOLATION =====
    const userId = document.body.getAttribute('data-user-id') || '';
    const cartStorageKey = userId ? `sabanaCart_${userId}` : 'sabanaCart_guest';
    const lastUserKey = 'sabanaLastUserId';
    
    // Cek apakah user berbeda dari sebelumnya
    const lastUserId = localStorage.getItem(lastUserKey);
    if (userId && userId !== lastUserId) {
        // User berbeda, simpan user_id baru
        localStorage.setItem(lastUserKey, userId);
    }

    // Fungsi update badge keranjang (angka di pojok kanan bawah)
    function updateCartBadge() {
        if (!cartBadge) return;
        const uniqueItems = cart.length; // jumlah item unik di keranjang
        if (uniqueItems > 0) {
            cartBadge.innerText = uniqueItems;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
        // Efek bounce pada ikon keranjang (opsional)
        if (floatingCart) {
            floatingCart.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (floatingCart) floatingCart.style.transform = '';
            }, 200);
        }
    }

    function getKategori(nama) {
        const namaLower = nama.toLowerCase();
        const reguler = ['ayam goreng dada', 'ayam goreng paha atas', 'ayam goreng paha bawah', 'ayam goreng sayap'];
        const tambahan = ['burger ayam', 'rice box', 'kentang goreng', 'nasi putih', 'kulit krispy', 'chicken strips', 'bakso goreng', 'chicken roll', 'es teh'];
        const combo = ['3 pcs paha bawah', '5 pcs paha bawah', '7 pcs paha bawah'];
        if (reguler.includes(namaLower)) return 'Reguler';
        if (tambahan.includes(namaLower)) return 'Tambahan';
        if (combo.includes(namaLower)) return 'Combo';
        if (namaLower.includes('+ nasi +') && namaLower.includes('es teh')) return 'Paket';
        if (namaLower.includes('paket') || namaLower.includes('geprek') || namaLower.includes('sambal ijo')) return 'Paket';
        const paketList = ['ayam dada + nasi + es teh', 'ayam sayap + nasi + es teh', 'ayam sambal geprek + nasi + es teh', 'ayam sambal ijo + nasi + es teh'];
        if (paketList.some(p => namaLower.includes(p))) return 'Paket';
        if (namaLower.includes('dada') || namaLower.includes('paha') || namaLower.includes('sayap')) return 'Reguler';
        if (namaLower.includes('burger') || namaLower.includes('kentang') || namaLower.includes('nasi') || namaLower.includes('kulit') || namaLower.includes('strips') || namaLower.includes('bakso') || namaLower.includes('roll') || namaLower.includes('teh')) return 'Tambahan';
        if (namaLower.includes('combo') || namaLower.includes('pcs')) return 'Combo';
        return 'Reguler';
    }

    function loadCart() {
        const stored = localStorage.getItem(cartStorageKey);
        if (stored) {
            try {
                cart = JSON.parse(stored);
                let updated = false;
                cart.forEach(item => {
                    if (!item.kategori || item.kategori === 'Lainnya' || item.kategori === 'Menu') {
                        item.kategori = getKategori(item.name);
                        updated = true;
                    }
                });
                if (updated) localStorage.setItem(cartStorageKey, JSON.stringify(cart));
            } catch(e) {
                console.error('Error parsing cart:', e);
                cart = [];
            }
        } else {
            cart = [];
        }
        checkedState = cart.map(() => true);
        renderCart();
        updateCartBadge(); // Update badge setelah load
        syncCartStockFromDb();
    }

    async function syncCartStockFromDb() {
        const ids = cart.filter(item => item.id).map(item => item.id);
        if (ids.length === 0) return;

        try {
            const response = await fetch(`process/menu_stock.php?ids=${encodeURIComponent(ids.join(','))}`);
            const data = await response.json();
            if (data.success && data.stocks) {
                let changed = false;
                cart.forEach(item => {
                    if (item.id && typeof data.stocks[item.id] !== 'undefined') {
                        const stockValue = parseInt(data.stocks[item.id], 10);
                        if (item.stock !== stockValue) {
                            item.stock = stockValue;
                            changed = true;
                        }
                    }
                });
                if (changed) {
                    saveCart();
                    renderCart();
                }
            }
        } catch (error) {
            console.warn('Gagal menyelaraskan stok keranjang:', error);
        }
    }

    function saveCart() {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        updateCartBadge(); // Update badge setiap kali cart berubah
    }

    function renderCart() {
        if (!cartContainer) return;
        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart-modern">
                    <div class="empty-cart-illustration">
                        <img src="../img/keranjang.png" alt="Keranjang Kosong" class="empty-cart-img" onerror="this.src='https://placehold.co/200x200/e11d48/white?text=🛒'">
                    </div>
                    <h3 class="empty-cart-title">Wah, keranjangmu masih kosong!</h3>
                    <p class="empty-cart-desc">Yuk, pilih menu favoritmu sekarang juga.<br>Nikmati kelezatan ayam goreng Sabana.</p>
                    <a href="menu_utama.php#menu" class="empty-cart-btn">
                        <i class="fa-solid fa-utensils"></i> Mulai Belanja
                    </a>
                    <div class="empty-cart-recommend">
                        <span class="rec-label">Rekomendasi untukmu</span>
                        <div class="rec-grid">
                            <a href="menu_kategori.php?kategori=reguler" class="rec-card">
                                <img src="../img/Ayam_dada.png" alt="Reguler" class="rec-img" onerror="this.src='https://placehold.co/100x100/e11d48/white?text=Reguler'">
                                <span class="rec-name">Menu Reguler</span>
                            </a>
                            <a href="menu_kategori.php?kategori=tambahan" class="rec-card">
                                <img src="../img/burger_ayam.png" alt="Tambahan" class="rec-img" onerror="this.src='https://placehold.co/100x100/e11d48/white?text=Tambahan'">
                                <span class="rec-name">Menu Tambahan</span>
                            </a>
                            <a href="menu_kategori.php?kategori=paket" class="rec-card">
                                <img src="../img/paket4.png" alt="Paket" class="rec-img" onerror="this.src='https://placehold.co/100x100/e11d48/white?text=Paket'">
                                <span class="rec-name">Menu Paket</span>
                            </a>
                            <a href="menu_kategori.php?kategori=combo" class="rec-card">
                                <img src="../img/combo3.png" alt="Combo" class="rec-img" onerror="this.src='https://placehold.co/100x100/e11d48/white?text=Combo'">
                                <span class="rec-name">Menu Combo</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        let itemsHtml = '';
        cart.forEach((item, idx) => {
            const checked = checkedState[idx] ? 'checked' : '';
            const subtotal = item.price * item.qty;
            const stockValue = typeof item.stock !== 'undefined' ? item.stock : '—';
            const stockClass = (typeof item.stock !== 'undefined' && item.stock <= 0) ? 'item-stock-empty' : 'item-stock-available';
            itemsHtml += `
                <div class="cart-item-card" data-idx="${idx}">
                    <div class="checkbox-area"><input type="checkbox" class="item-checkbox" data-idx="${idx}" ${checked}></div>
                    <img src="../img/${item.img}" class="item-image" onerror="this.src='https://placehold.co/70x70/e11d48/white?text=${item.name.charAt(0)}'">
                    <div class="item-details">
                        <div class="item-name">${escapeHtml(item.name)}</div>
                        <div class="item-kategori">${item.kategori}</div>
                        <div class="item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                        <div class="item-stock ${stockClass}">Stok: ${stockValue}</div>
                    </div>
                    <div class="item-qty-control">
                        <button class="qty-btn dec-qty" data-idx="${idx}">-</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn inc-qty" data-idx="${idx}">+</button>
                    </div>
                    <div class="item-subtotal">Rp ${subtotal.toLocaleString('id-ID')}</div>
                    <button class="delete-btn" data-idx="${idx}"><img src="../img/tempat_sampah.png" alt="Hapus" onerror="this.src='https://placehold.co/24x24/ef4444/white?text=🗑'"></button>
                </div>
            `;
        });

        let total = 0;
        cart.forEach((item, idx) => { if (checkedState[idx]) total += item.price * item.qty; });
        const totalFormatted = `Rp ${total.toLocaleString('id-ID')}`;

        const footerHtml = `
            <div class="cart-footer">
                <a href="menu_utama.php#menu" class="btn-lanjut"><i class="fa-solid fa-arrow-left"></i> Lanjut Belanja</a>
                <div class="right-section">
                    <div class="total-line"><span class="total-label">Total Pesanan:</span><span class="total-value">${totalFormatted}</span></div>
                    <button id="checkoutBtn" class="btn-checkout"><i class="fa-solid fa-credit-card mr-2"></i> Selesaikan Pesanan</button>
                </div>
            </div>
        `;

        cartContainer.innerHTML = `<div class="cart-list">${itemsHtml}</div>${footerHtml}`;
        attachEvents();
    }

    function attachEvents() {
        // Toggle ceklis saat card diklik (kecuali tombol qty/del)
        document.querySelectorAll('.cart-item-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('qty-btn') || e.target.closest('.qty-btn') || e.target.closest('.delete-btn')) return;
                const idx = parseInt(card.dataset.idx);
                const cb = card.querySelector('.item-checkbox');
                if (cb) {
                    cb.checked = !cb.checked;
                    checkedState[idx] = cb.checked;
                    renderCart();
                }
            });
        });
        document.querySelectorAll('.item-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                e.stopPropagation();
                const idx = parseInt(cb.dataset.idx);
                checkedState[idx] = cb.checked;
                renderCart();
            });
        });
        document.querySelectorAll('.dec-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                if (cart[idx].qty > 1) {
                    cart[idx].qty--;
                    saveCart();
                    renderCart();
                }
            });
        });
        document.querySelectorAll('.inc-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                const item = cart[idx];
                const available = (typeof item.stock !== 'undefined') ? item.stock : Number.MAX_SAFE_INTEGER;
                if (item.qty < available) {
                    item.qty++;
                    saveCart();
                    renderCart();
                } else {
                    alert(`Stok tidak mencukupi. Maksimal ${available}.`);
                }
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                cart.splice(idx, 1);
                checkedState.splice(idx, 1);
                saveCart();
                renderCart();
            });
        });
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                const selectedItems = cart.filter((_, idx) => checkedState[idx]);
                if (selectedItems.length === 0) {
                    alert('Pilih minimal satu menu.');
                    return;
                }
                if (document.body.getAttribute('data-logged-in') !== 'true') {
                    alert('Silakan login terlebih dahulu.');
                    window.location.href = 'login.html';
                    return;
                }
                // Simpan ke sessionStorage
                sessionStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
                // Redirect ke halaman checkout
                window.location.href = 'checkout.php';
            });
        }
    }

    function escapeHtml(str) {
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
    }

    // Tombol kembali
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.add('back-ngeper');
            setTimeout(() => {
                this.classList.remove('back-ngeper');
                window.history.back();
            }, 300);
        });
    }

    loadCart();

    // Reload cart ketika halaman ditampilkan kembali (dari back button atau history)
    window.addEventListener('pageshow', function() {
        loadCart();
        renderCart();
    });
});