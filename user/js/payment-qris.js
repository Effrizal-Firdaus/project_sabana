document.addEventListener('DOMContentLoaded', function() {
    const userId = document.body.getAttribute('data-user-id') || '';
    let orderData = sessionStorage.getItem('paymentOrderData');
    if (!orderData) {
        alert('Data pesanan tidak ditemukan. Silakan ulang dari checkout.');
        window.location.href = 'checkout.php';
        return;
    }
    try {
        orderData = JSON.parse(orderData);
    } catch(e) {
        alert('Error membaca data pesanan.');
        window.location.href = 'checkout.php';
        return;
    }

    // Render detail pesanan
    document.getElementById('detailOrderId').innerText = orderData.id;
    document.getElementById('detailNamaPenerima').innerText = orderData.namaPenerima;
    document.getElementById('detailSubtotal').innerText = `Rp ${orderData.totalMenu.toLocaleString('id-ID')}`;
    document.getElementById('detailOngkir').innerText = `Rp ${orderData.ongkir.toLocaleString('id-ID')}`;
    document.getElementById('detailTotal').innerText = `Rp ${orderData.totalBayar.toLocaleString('id-ID')}`;

    const nominalInput = document.getElementById('nominalBayarInput');
    if (nominalInput) {
        nominalInput.value = orderData.totalBayar;
        const hint = document.getElementById('nominalHint');
        hint.innerHTML = `* Total tagihan: Rp ${orderData.totalBayar.toLocaleString('id-ID')}. Masukkan nominal yang sama.`;
    }

    let itemsHtml = '';
    if (orderData.items && Array.isArray(orderData.items)) {
        orderData.items.forEach(item => {
            itemsHtml += `
                <div class="flex justify-between items-center py-1.5 px-2 bg-gray-50 rounded">
                    <span>${item.name} x${item.qty}</span>
                    <span class="font-semibold">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
                </div>
            `;
        });
    }
    document.getElementById('detailItems').innerHTML = itemsHtml;

    // Generate QR Code
    const qrData = `${orderData.id}|${orderData.totalBayar}`;
    const qrContainer = document.getElementById('qrContainer');
    try {
        new QRCode(qrContainer, {
            text: qrData,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        document.getElementById('qrisImage').style.display = 'none';
    } catch(e) {
        console.log('QR Code library not available');
    }

    // ========== KONFIRMASI PEMBAYARAN ==========
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    const errorToast = document.getElementById('errorToast');
    const errorToastMessage = document.getElementById('errorToastMessage');
    const successToast = document.getElementById('successToast');
    const toastMsg = document.getElementById('toastMessage');

    function showErrorToast(message) {
        errorToastMessage.innerText = message;
        errorToast.classList.remove('hidden');
        setTimeout(() => errorToast.classList.add('hidden'), 3000);
    }

    confirmBtn.addEventListener('click', async function() {
        const nominalDibayar = parseInt(nominalInput ? nominalInput.value.trim() : '0');
        const totalTagihan = orderData.totalBayar;
        if (isNaN(nominalDibayar) || nominalDibayar !== totalTagihan) {
            showErrorToast(`Nominal harus tepat Rp ${totalTagihan.toLocaleString('id-ID')}`);
            return;
        }

        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Memproses...';

        // Siapkan data untuk dikirim ke save_order.php
        const dataPesanan = {
            id_pengguna: userId,
            items: orderData.items.map(item => ({
                id: item.id,
                name: item.name,
                qty: item.qty,
                price: item.price
            })),
            total_menu: orderData.totalMenu,
            ongkir: orderData.ongkir,
            total_bayar: orderData.totalBayar,
            nama_penerima: orderData.namaPenerima,
            alamat: orderData.alamat,
            catatan: orderData.catatan || '',
            jarak: orderData.jarak || 0,
            layanan: orderData.layanan,
            metode_pembayaran: 'QRIS',
            status_pembayaran: 'lunas',
            jenis_pesanan: orderData.jenisPesanan || 'delivery',
            kode_qr: `${orderData.id}|${orderData.totalBayar}`   
        };

        try {
            const response = await fetch('process/save_order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataPesanan)
            });
            const result = await response.json();
            if (result.success) {
                // Hapus data sessionStorage dan keranjang
                sessionStorage.removeItem('paymentOrderData');
                sessionStorage.removeItem('checkoutItems');
                // Hapus item yang sudah dibeli dari keranjang localStorage
                const cartStorageKey = userId ? `sabanaCart_${userId}` : 'sabanaCart_guest';
                let currentCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
                const itemNames = orderData.items.map(i => i.name);
                currentCart = currentCart.filter(cartItem => !itemNames.includes(cartItem.name));
                localStorage.setItem(cartStorageKey, JSON.stringify(currentCart));

                // Tampilkan sukses
                toastMsg.innerText = '✅ Pembayaran berhasil! Pesanan masuk ke dashboard.';
                successToast.classList.remove('hidden');
                document.getElementById('statusPembayaran').innerHTML = `
                    <p class="text-sm font-semibold text-green-800">
                        <i class="fa-solid fa-circle-check mr-2"></i> Pembayaran Dikonfirmasi
                    </p>
                `;
                setTimeout(() => {
                    window.location.href = 'process/dashboard.php?menu=pesanan-saya';
                }, 1500);
            } else {
                showErrorToast(result.message || 'Gagal menyimpan pesanan.');
                btn.disabled = false;
                btn.innerHTML = 'Konfirmasi Pembayaran';
            }
        } catch (err) {
            showErrorToast('Terjadi kesalahan: ' + err.message);
            btn.disabled = false;
            btn.innerHTML = 'Konfirmasi Pembayaran';
        }
    });
});