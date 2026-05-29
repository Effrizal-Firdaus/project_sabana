document.addEventListener('DOMContentLoaded', function() {
    let feedbacks = window.initialFeedbacks || [];
    let currentFilter = 'semua'; 
    
    let lastLatestId = feedbacks.length > 0 ? parseInt(feedbacks[0].id) : 0; 

    function renderFeedbacks(filter = 'semua') {
        currentFilter = filter; 
        let filtered = feedbacks;
        
        if (filter !== 'semua') {
            filtered = feedbacks.filter(f => f.jenis === filter);
        }
        
        const container = document.getElementById('feedbacksContainer');
        if (!container) return;

        // ==========================================
        // 1. DESAIN EMPTY STATE (JIKA KOSONG)
        // ==========================================
        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 mt-4 transition-all">
                    <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <i class="fa-regular fa-comments text-4xl text-gray-300"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-700 mb-1">Belum ada masukan</h3>
                    <p class="text-sm text-gray-400">Tidak ada data masukan untuk kategori yang dipilih saat ini.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        filtered.forEach(f => {
            let badgeClass = '';
            let iconClass = '';
            let avatarBg = '';
            
            // ==========================================
            // 2. LOGIKA WARNA & IKON PER KATEGORI
            // ==========================================
            if (f.jenis === 'saran') {
                badgeClass = 'bg-blue-50 text-blue-600 border-blue-100';
                iconClass = 'fa-lightbulb';
                avatarBg = 'bg-blue-500';
            }
            else if (f.jenis === 'kritik') {
                badgeClass = 'bg-orange-50 text-orange-600 border-orange-100';
                iconClass = 'fa-comment-dots';
                avatarBg = 'bg-orange-500';
            }
            else if (f.jenis === 'pujian') {
                badgeClass = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                iconClass = 'fa-heart';
                avatarBg = 'bg-emerald-500';
            }
            else if (f.jenis === 'laporan_masalah') {
                badgeClass = 'bg-red-50 text-red-600 border-red-100';
                iconClass = 'fa-triangle-exclamation';
                avatarBg = 'bg-red-500';
            }

            // Mengambil inisial nama pengirim untuk Avatar
            const pengirim = f.pengguna_nama ? escapeHtml(f.pengguna_nama) : 'Anonim';
            const inisial = pengirim.charAt(0).toUpperCase();

            // ==========================================
            // 3. DESAIN CARD ELEGAN (HTML)
            // ==========================================
            html += `
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 relative mb-5 group">
                    
                    <button class="btn-delete-masukan absolute top-4 right-4 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-full w-9 h-9 flex items-center justify-center transition-all duration-300 opacity-60 group-hover:opacity-100" data-id="${f.id}" title="Hapus Masukan">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    
                    <div class="flex items-start gap-4 pr-12">
                        <div class="flex-shrink-0 w-12 h-12 rounded-full ${avatarBg} text-white flex items-center justify-center text-xl font-black shadow-inner">
                            ${inisial}
                        </div>
                        
                        <div class="flex-1">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                <h4 class="font-bold text-gray-800 text-lg">${pengirim}</h4>
                                <div class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-sm ${badgeClass}">
                                        <i class="fa-solid ${iconClass}"></i> ${f.jenis.toUpperCase().replace('_', ' ')}
                                    </span>
                                    <span class="text-xs text-gray-400 font-medium flex items-center gap-1 ml-1">
                                        <i class="fa-regular fa-clock"></i> ${f.dibuat_pada}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="bg-gray-50 rounded-xl rounded-tl-none p-4 mt-3 border border-gray-100 text-gray-700 leading-relaxed text-sm shadow-sm">
                                <p class="whitespace-pre-wrap">${escapeHtml(f.pesan)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;

        // EVENT LISTENER HAPUS
        document.querySelectorAll('.btn-delete-masukan').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const masukanId = btn.getAttribute('data-id');
                if (confirm('Apakah Anda yakin ingin menghapus masukan ini? Pastikan masukan sudah dieksekusi.')) {
                    
                    const originalIcon = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                    btn.disabled = true;

                    try {
                        const response = await fetch('../api/delete_masukan.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: masukanId })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            if (typeof showToast === 'function') showToast('Masukan berhasil dihapus', 'success');
                            else alert('Masukan berhasil dihapus');
                            
                            feedbacks = feedbacks.filter(item => item.id !== masukanId);
                            renderFeedbacks(currentFilter);
                        } else {
                            if (typeof showToast === 'function') showToast(result.message || 'Gagal hapus', 'error');
                            else alert(result.message || 'Gagal hapus');
                            btn.innerHTML = originalIcon;
                            btn.disabled = false;
                        }
                    } catch (err) {
                        console.error(err);
                        if (typeof showToast === 'function') showToast('Terjadi kesalahan jaringan', 'error');
                        else alert('Terjadi kesalahan jaringan');
                        btn.innerHTML = originalIcon;
                        btn.disabled = false;
                    }
                }
            });
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]);
    }

    // SISTEM POLLING REAL-TIME (Cek setiap 3 detik)
    setInterval(async () => {
        try {
            const urlAPI = '../api/get_masukan.php?_t=' + new Date().getTime();
            const response = await fetch(urlAPI, { cache: 'no-store' });
            const result = await response.json();
            
            if (result.success) {
                const newData = result.data;
                
                if (newData.length > 0) {
                    const currentLatestId = parseInt(newData[0].id);
                    
                    if (currentLatestId > lastLatestId) {
                        const newItemsCount = newData.filter(item => parseInt(item.id) > lastLatestId).length;
                        feedbacks = newData; 
                        lastLatestId = currentLatestId; 
                        renderFeedbacks(currentFilter);
                        
                        const badge = document.getElementById('masukanBadge');
                        if (badge) {
                            badge.innerText = '+' + newItemsCount;
                            badge.classList.remove('hidden');
                            
                            setTimeout(() => {
                                badge.classList.add('hidden');
                            }, 4000);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Gagal mengambil update realtime masukan:", err);
        }
    }, 3000);

    // FILTER BUTTON EVENT
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-500'));
            btn.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
            renderFeedbacks(btn.dataset.filter);
        });
    });

    // LOGOUT EVENT
    const btnTrigger = document.getElementById('btnTriggerLogout');
    const modal = document.getElementById('logoutModal');
    const modalBox = document.getElementById('logoutModalBox');
    const cancelBtn = document.getElementById('btnCancelLogout');
    const overlay = document.getElementById('logoutOverlay');

    function showModal() {
        if (!modal) return;
        modal.classList.remove('hidden');
        setTimeout(() => {
            modalBox?.classList.remove('scale-95', 'opacity-0');
            modalBox?.classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    function hideModal() {
        if (!modalBox) return;
        modalBox.classList.remove('scale-100', 'opacity-100');
        modalBox.classList.add('scale-95', 'opacity-0');
        setTimeout(() => modal?.classList.add('hidden'), 300);
    }
    
    if (btnTrigger) btnTrigger.addEventListener('click', (e) => { e.preventDefault(); showModal(); });
    if (cancelBtn) cancelBtn.addEventListener('click', hideModal);
    if (overlay) overlay.addEventListener('click', hideModal);

    // Initial render
    renderFeedbacks('semua');
});