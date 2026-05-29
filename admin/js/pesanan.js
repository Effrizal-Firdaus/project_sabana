// admin/js/pesanan.js

// Fungsi menghitung menit berlalu
function getWaitingMinutes(createdAtStr) {
    const created = new Date(createdAtStr);
    const now = new Date();
    return Math.floor((now - created) / 60000);
}

let timerInterval;

function renderNewOrders() {
    const container = document.getElementById('newOrdersContainer');
    if (!container) return;

    if (!newOrders || newOrders.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center text-gray-400 py-16 flex flex-col items-center">
                <i class="fa-solid fa-inbox text-5xl mb-4 opacity-50"></i>
                <p class="font-medium">Tidak ada pesanan delivery baru.</p>
            </div>`;
        return;
    }

    // Urutkan berdasarkan waktu dibuat (FIFO)
    const sorted = [...newOrders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    let html = '';
    sorted.forEach(order => {
        const waitingMinutes = getWaitingMinutes(order.createdAt);
        const isPaid = order.paymentStatus === 'sudah_bayar';
        const formatRupiah = (num) => `Rp ${num.toLocaleString('id-ID')}`;
        
        const itemsList = order.items.map(item => `
            <div class="flex justify-between text-sm">
                <span>${item.qty}x ${item.name}</span>
                <span class="font-semibold">${formatRupiah(item.price * item.qty)}</span>
            </div>
        `).join('');

        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`;

        html += `
            <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                <div class="p-5">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="font-extrabold text-gray-800 text-lg">${escapeHtml(order.customer)}</h3>
                            <p class="text-xs text-gray-400">#${order.id}</p>
                        </div>
                        <div class="flex flex-col items-end gap-1">
                            <div class="timer-badge bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <i class="fa-regular fa-hourglass-half"></i>
                                <span class="minutes-value" data-id="${order.id}">${waitingMinutes}</span> menit
                            </div>
                            <span class="text-[10px] text-gray-400">${order.createdAt}</span>
                        </div>
                    </div>

                    <div class="flex gap-2 mb-4">
                        <span class="px-3 py-1 rounded-full text-xs font-bold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                            <i class="fa-solid ${isPaid ? 'fa-circle-check' : 'fa-circle-exclamation'} mr-1"></i>
                            ${isPaid ? 'Lunas' : 'Belum Dibayar'}
                        </span>
                        <span class="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                            <i class="fa-solid ${order.paymentMethod === 'qris' ? 'fa-qrcode' : 'fa-money-bill-wave'} mr-1"></i>
                            ${order.paymentMethod.toUpperCase()}
                        </span>
                    </div>

                    <div class="bg-gray-50 rounded-xl p-3 mb-3 text-sm space-y-1">
                        ${itemsList}
                        <div class="border-t border-dashed border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span class="text-[#4a5d42]">${formatRupiah(order.total)}</span>
                        </div>
                    </div>

                    ${order.note ? `
                    <div class="mb-3 p-2 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <p class="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">📝 Catatan Pelanggan</p>
                        <p class="text-sm text-gray-700 mt-1">"${escapeHtml(order.note)}"</p>
                    </div>
                    ` : ''}

                    <!-- Alamat: hanya tampil jika jenis_pesanan === 'delivery' -->
                    ${order.jenis_pesanan === 'delivery' ? `
                    <div class="flex justify-between items-center gap-2 mb-4">
                        <p class="text-sm text-gray-600 truncate flex-1">
                            <i class="fa-solid fa-location-dot text-rose-500 mr-1"></i>
                            ${escapeHtml(order.address)}
                        </p>
                        <a href="${mapsLink}" target="_blank" class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1">
                            <i class="fa-solid fa-map-location-dot"></i> Lihat Lokasi
                        </a>
                    </div>
                    ` : `
                    <div class="text-sm text-gray-500 italic mb-4">
                        📦 Ambil di tempat - Selamat Menikmati 
                    </div>
                    `}

                    <div class="flex gap-2">
                        <button onclick="terimaPesanan(${order.id})" class="flex-1 bg-[#4a5d42] hover:bg-[#35432f] text-white py-2 rounded-xl font-bold text-sm transition active:scale-95">
                            ✅ Terima Pesanan
                        </button>
                        <button onclick="tolakPesanan(${order.id})" class="px-4 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-xl font-bold text-sm transition active:scale-95">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
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

// Fungsi AJAX untuk menerima pesanan
async function terimaPesanan(pesananId) {
    const formData = new FormData();
    formData.append('id', pesananId);
    formData.append('action', 'confirm');
    try {
        const response = await fetch('api/update_order_status.php', { method: 'POST', body: formData });
        const result = await response.json();
        if (result.success) {
    // Hapus pesanan dari array newOrders
    const index = newOrders.findIndex(o => o.id == pesananId);
        if (index !== -1) newOrders.splice(index, 1);
        renderNewOrders();
        
        // 🔔 Update badge notifikasi secara real-time
        if (typeof updateNotifications === 'function') {
            updateNotifications();
        }
        
        if (typeof showToast === 'function') {
            showToast(`✅ Pesanan #${pesananId} diterima dan masuk ke dashboard.`, 'success');
        } else {
            alert(`✅ Pesanan #${pesananId} diterima dan masuk ke dashboard.`);
        }
        
        } else {
            const msg = result.message || 'Terjadi kesalahan.';
            if (typeof showToast === 'function') {
                showToast('Gagal: ' + msg, 'error');
            } else {
                alert('Gagal: ' + msg);
            }
        }
    } catch (err) {
        console.error(err);
        if (typeof showToast === 'function') {
            showToast('Error: ' + err.message, 'error');
        } else {
            alert('Error: ' + err.message);
        }
    }
}

async function tolakPesanan(pesananId) {
    if (!confirm('Hapus pesanan ini? Tindakan tidak dapat dibatalkan.')) return;
    const formData = new FormData();
    formData.append('id', pesananId);
    formData.append('action', 'archive');
    try {
        const response = await fetch('api/update_order_status.php', { method: 'POST', body: formData });
        const result = await response.json();
        if (result.success) {
            const index = newOrders.findIndex(o => o.id == pesananId);
            if (index !== -1) newOrders.splice(index, 1);
            renderNewOrders();
            if (typeof showToast === 'function') {
                showToast(`Pesanan #${pesananId} dihapus.`, 'success');
            } else {
                alert(`Pesanan #${pesananId} dihapus.`);
            }
        } else {
            if (typeof showToast === 'function') {
                showToast('Gagal menghapus.', 'error');
            } else {
                alert('Gagal menghapus.');
            }
        }
    } catch (err) {
        console.error(err);
        if (typeof showToast === 'function') {
            showToast('Error: ' + err.message, 'error');
        } else {
            alert('Error: ' + err.message);
        }
    }
}

// Update timer setiap menit
function startTimerUpdater() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        document.querySelectorAll('.minutes-value').forEach(el => {
            const orderId = el.getAttribute('data-id');
            const order = newOrders.find(o => o.id == orderId);
            if (order) {
                const newMinutes = getWaitingMinutes(order.createdAt);
                el.innerText = newMinutes;
            }
        });
    }, 60000);
}

renderNewOrders();
startTimerUpdater();