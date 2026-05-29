document.addEventListener("DOMContentLoaded", function() {
    console.log("Checkout JS loaded");

    // ========== TOAST NOTIFICATION ==========
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fa-${type === 'success' ? 'solid fa-check-circle' : 'solid fa-exclamation-triangle'}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 3000);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    const userId = document.body.getAttribute('data-user-id') || '';
    console.log("User ID:", userId);

    // Ambil data dari sessionStorage
    let items = [];
    const stored = sessionStorage.getItem('checkoutItems');
    console.log("Stored checkoutItems:", stored);
    if (!stored) {
        showEmptyCheckout();
        return;
    }
    try {
        items = JSON.parse(stored);
    } catch(e) {
        console.error("Parse error:", e);
        items = [];
    }
    if (items.length === 0) {
        showEmptyCheckout();
        return;
    }

    function showEmptyCheckout() {
        const container = document.getElementById('checkoutItemsList');
        if (container) {
            container.innerHTML = `<div class="text-center text-gray-500 py-8">Keranjang kosong. <a href="menu_utama.php#menu" class="text-sabanaRed">Belanja sekarang</a></div>`;
        }
        document.getElementById('totalItemCount').innerText = '0';
        document.getElementById('subtotalMenu').innerText = 'Rp 0';
        document.getElementById('subtotalMenuDetail').innerText = 'Rp 0';
    }

    // Render daftar item
    let totalItems = 0;
    let subtotalMenu = 0;
    let html = '';
    items.forEach(item => {
        const subtotal = item.price * item.qty;
        totalItems += item.qty;
        subtotalMenu += subtotal;
        const imgSrc = item.img ? `../img/${item.img}` : '../../img/logo_sabana1.png';
        html += `
            <div class="flex items-center gap-4 py-4">
                <img src="${imgSrc}" class="w-16 h-16 object-cover rounded-lg bg-gray-100" onerror="this.src='https://placehold.co/64x64/e11d48/white?text=Food'">
                <div class="flex-1">
                    <div class="font-bold text-gray-800">${escapeHtml(item.name)}</div>
                    <div class="text-sm text-gray-500">${item.kategori || 'Menu'}</div>
                    <div class="text-sabanaRed font-semibold">Rp ${item.price.toLocaleString('id-ID')} x ${item.qty}</div>
                </div>
                <div class="font-bold text-gray-900">Rp ${subtotal.toLocaleString('id-ID')}</div>
            </div>
        `;
    });
    document.getElementById('checkoutItemsList').innerHTML = html;
    document.getElementById('totalItemCount').innerText = totalItems;
    document.getElementById('subtotalMenu').innerText = `Rp ${subtotalMenu.toLocaleString('id-ID')}`;
    document.getElementById('subtotalMenuDetail').innerText = `Rp ${subtotalMenu.toLocaleString('id-ID')}`;

    // Generate ID Pesanan
    function generateOrderId() {
        const now = new Date();
        const yy = now.getFullYear().toString().slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `INV/${yy}${mm}${dd}/${random}`;
    }
    let orderId = generateOrderId();
    document.getElementById('orderId').innerText = orderId;

    // ========== Ongkir & Total ==========
    const jarakInput = document.getElementById('jarak');
    const pengirimanRadios = document.querySelectorAll('input[name="pengiriman"]');
    const ongkirDetailSpan = document.getElementById('ongkirDetail');
    const totalBayarSpan = document.getElementById('totalBayar');
    const confirmBtn = document.getElementById('confirmOrderBtn');
    const namaPenerima = document.getElementById('namaPenerima');
    const alamatTextarea = document.getElementById('alamat');
    const catatanTextarea = document.getElementById('catatan');
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const qrisPreviewCard = document.getElementById('qrisPreview');
    const codInfoCard = document.getElementById('codInfo');
    const qrisNamaSpan = document.getElementById('qrisNama');
    const qrisOrderIdSpan = document.getElementById('qrisOrderId');
    const qrisSubtotalSpan = document.getElementById('qrisSubtotal');
    const qrisOngkirSpan = document.getElementById('qrisOngkir');
    const qrisTotalSpan = document.getElementById('qrisTotal');
    const qrisAmountSpan = document.getElementById('qrisAmount');

    // Elemen untuk jenis pesanan
    const jenisPesananRadios = document.querySelectorAll('input[name="jenis_pesanan"]');
    const alamatContainer = document.getElementById('alamatContainer');
    const jarakContainer = document.getElementById('jarakContainer');
    const layananContainer = document.getElementById('layananContainer');
    const ongkirRow = document.getElementById('ongkirRow');

    let currentOngkir = 0;

    function toggleDeliveryFields() {
        const isDelivery = document.querySelector('input[name="jenis_pesanan"]:checked').value === 'delivery';
        if (isDelivery) {
            alamatContainer.style.display = 'block';
            jarakContainer.style.display = 'block';
            layananContainer.style.display = 'block';
            ongkirRow.style.display = 'flex';
            hitungOngkir();
        } else {
            alamatContainer.style.display = 'none';
            jarakContainer.style.display = 'none';
            layananContainer.style.display = 'none';
            ongkirRow.style.display = 'none';
            currentOngkir = 0;
            if (ongkirDetailSpan) ongkirDetailSpan.innerText = `Rp 0`;
            const total = subtotalMenu + 0;
            if (totalBayarSpan) totalBayarSpan.innerText = `Rp ${total.toLocaleString('id-ID')}`;
            updatePaymentPreview();
        }
    }

    function hitungOngkir() {
        const isDelivery = document.querySelector('input[name="jenis_pesanan"]:checked').value === 'delivery';
        if (!isDelivery) {
            currentOngkir = 0;
            if (ongkirDetailSpan) ongkirDetailSpan.innerText = `Rp 0`;
            const total = subtotalMenu + 0;
            if (totalBayarSpan) totalBayarSpan.innerText = `Rp ${total.toLocaleString('id-ID')}`;
            updatePaymentPreview();
            return 0;
        }
        const jarak = parseFloat(jarakInput.value) || 0;
        const layananRadio = document.querySelector('input[name="pengiriman"]:checked');
        const layanan = layananRadio ? layananRadio.value : 'reguler';
        let ongkirNormal = (layanan === 'reguler') ? 8000 : 12000;
        if (jarak <= 3) {
            ongkirNormal = 0;
        }
        currentOngkir = ongkirNormal;
        if (ongkirDetailSpan) ongkirDetailSpan.innerText = `Rp ${currentOngkir.toLocaleString('id-ID')}`;
        const total = subtotalMenu + currentOngkir;
        if (totalBayarSpan) totalBayarSpan.innerText = `Rp ${total.toLocaleString('id-ID')}`;
        updatePaymentPreview();
        return total;
    }

    function updatePaymentPreview() {
        const paymentRadio = document.querySelector('input[name="payment"]:checked');
        const payment = paymentRadio ? paymentRadio.value : 'QRIS';
        const nama = namaPenerima && namaPenerima.value.trim() ? namaPenerima.value.trim() : '-';
        const totalBayar = subtotalMenu + currentOngkir;
        const formatRupiah = value => `Rp ${value.toLocaleString('id-ID')}`;

        if (payment === 'QRIS') {
            if (qrisPreviewCard) qrisPreviewCard.classList.remove('hidden');
            if (codInfoCard) codInfoCard.classList.add('hidden');
            if (qrisNamaSpan) qrisNamaSpan.innerText = nama;
            if (qrisOrderIdSpan) qrisOrderIdSpan.innerText = orderId;
            if (qrisSubtotalSpan) qrisSubtotalSpan.innerText = formatRupiah(subtotalMenu);
            if (qrisOngkirSpan) qrisOngkirSpan.innerText = formatRupiah(currentOngkir);
            if (qrisTotalSpan) qrisTotalSpan.innerText = formatRupiah(totalBayar);
            if (qrisAmountSpan) qrisAmountSpan.innerText = formatRupiah(totalBayar);
        } else {
            if (qrisPreviewCard) qrisPreviewCard.classList.add('hidden');
            if (codInfoCard) codInfoCard.classList.remove('hidden');
        }
    }

    if (jarakInput) {
        jarakInput.addEventListener('input', () => {
            hitungOngkir();
            updatePaymentPreview();
        });
    }
    pengirimanRadios.forEach(radio => radio.addEventListener('change', () => {
        hitungOngkir();
        updatePaymentPreview();
    }));
    paymentRadios.forEach(radio => radio.addEventListener('change', updatePaymentPreview));
    if (namaPenerima) {
        namaPenerima.addEventListener('input', updatePaymentPreview);
    }
    jenisPesananRadios.forEach(radio => radio.addEventListener('change', toggleDeliveryFields));

    // Inisialisasi
    toggleDeliveryFields();
    hitungOngkir();
    updatePaymentPreview();

    // ========== KONFIRMASI PESANAN ==========
    if (confirmBtn) {
        console.log("Confirm button found, attaching listener");
        confirmBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log("Confirm button clicked");
            
            const jenisPesanan = document.querySelector('input[name="jenis_pesanan"]:checked').value;
            const nama = namaPenerima.value.trim();
            let alamat = '';
            let catatan = catatanTextarea ? catatanTextarea.value.trim() : '';
            let jarak = 0;
            let layanan = 'reguler';
            let ongkir = 0;

            if (!nama) {
                showToast('Nama penerima harus diisi.', 'error');
                return;
            }

            if (jenisPesanan === 'delivery') {
                alamat = alamatTextarea.value.trim();
                if (!alamat) {
                    showToast('Alamat pengiriman harus diisi untuk delivery.', 'error');
                    return;
                }
                jarak = parseFloat(jarakInput.value) || 0;
                const layananRadio = document.querySelector('input[name="pengiriman"]:checked');
                layanan = layananRadio ? layananRadio.value : 'reguler';
                ongkir = currentOngkir;
            } else {
                // Take away: alamat dan ongkir tidak diperlukan
                alamat = '';
                jarak = 0;
                layanan = '';
                ongkir = 0;
            }

            const paymentRadio = document.querySelector('input[name="payment"]:checked');
            const payment = paymentRadio ? paymentRadio.value : 'QRIS';
            const estimasi = (layanan === 'reguler') ? '20-30 menit' : (layanan === 'express' ? '10-20 menit' : '');

            // Data pesanan untuk QRIS atau COD
            const orderData = {
                id: orderId,
                items: items,
                totalMenu: subtotalMenu,
                ongkir: ongkir,
                totalBayar: subtotalMenu + ongkir,
                namaPenerima: nama,
                alamat: alamat,
                catatan: catatan,
                jarak: jarak,
                layanan: layanan,
                estimasi: estimasi,
                metodePembayaran: payment,
                id_pengguna: userId,
                jenisPesanan: jenisPesanan
            };

            if (payment === 'QRIS') {
                // Simpan ke sessionStorage dan redirect ke halaman QRIS
                sessionStorage.setItem('paymentOrderData', JSON.stringify(orderData));
                window.location.href = 'payment-qris.php';
                return;
            }

            // Jika COD, langsung simpan ke database
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Memproses...';

            const dataPesanan = {
                id_pengguna: userId,
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    qty: item.qty,
                    price: item.price
                })),
                total_menu: subtotalMenu,
                ongkir: ongkir,
                total_bayar: subtotalMenu + ongkir,
                nama_penerima: nama,
                alamat: alamat,
                catatan: catatan,
                jarak: jarak,
                layanan: layanan,
                metode_pembayaran: 'COD',
                status_pembayaran: 'belum',
                jenis_pesanan: jenisPesanan
            };

            try {
                const response = await fetch('process/save_order.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataPesanan)
                });
                const result = await response.json();
                if (result.success) {
                    // Hapus keranjang
                    const cartStorageKey = userId ? `sabanaCart_${userId}` : 'sabanaCart_guest';
                    let currentCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
                    const itemNames = items.map(i => i.name);
                    currentCart = currentCart.filter(cartItem => !itemNames.includes(cartItem.name));
                    localStorage.setItem(cartStorageKey, JSON.stringify(currentCart));
                    sessionStorage.removeItem('checkoutItems');

                    showToast('✅ Pesanan berhasil dibuat!', 'success');
                    setTimeout(() => {
                        window.location.href = 'process/dashboard.php?menu=pesanan-saya';
                    }, 1500);
                } else {
                    showToast(result.message || 'Gagal menyimpan pesanan', 'error');
                    confirmBtn.disabled = false;
                    confirmBtn.innerHTML = '<i class="fa-regular fa-circle-check"></i> Buat Pesanan';
                }
            } catch (err) {
                console.error("Error saving order:", err);
                showToast('Error: ' + err.message, 'error');
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = '<i class="fa-regular fa-circle-check"></i> Buat Pesanan';
            }
        });
    } else {
        console.error("Confirm button not found!");
    }
});