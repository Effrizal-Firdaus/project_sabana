// Fungsi untuk me-render data ulasan ke dalam container
function renderUlasan(data) {
    const container = document.getElementById('ulasanContainer');
    if (!container) return;
    
    if (data.length === 0) {
        container.innerHTML = `<div class="p-12 text-center text-gray-400">
            <i class="fa-regular fa-star text-4xl mb-3"></i>
            <p>Belum ada ulasan dari pelanggan.</p>
        </div>`;
        return;
    }
    
    let html = '';
    data.forEach(item => {
        // Generate bintang rating
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<i class="fa-${i <= item.rating ? 'solid' : 'regular'} fa-star"></i>`;
        }
        
        // Komentar (jika ada)
        const komentarHtml = item.komentar && item.komentar.trim() !== '' 
            ? `<div class="mt-3 bg-gray-100 p-3 rounded-xl text-gray-700 text-sm italic border-l-4 border-yellow-400">
                   <i class="fa-regular fa-comment-dots mr-2"></i> “${escapeHtml(item.komentar)}”
               </div>`
            : `<div class="mt-3 text-xs text-gray-400 italic">Tidak ada komentar</div>`;
        
        html += `
            <div class="p-6 hover:bg-gray-50 transition">
                <div class="flex flex-wrap gap-4">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center font-bold text-lg text-white shadow">
                        ${escapeHtml(item.pengguna.charAt(0).toUpperCase())}
                    </div>
                    <div class="flex-1">
                        <div class="flex flex-wrap justify-between items-start gap-2">
                            <div>
                                <span class="font-semibold text-gray-800">${escapeHtml(item.pengguna)}</span>
                                <span class="text-xs text-gray-400 ml-2">Pesanan #${item.pesanan_id}</span>
                                <div class="text-sm text-gray-500 mt-1">Menu: ${escapeHtml(item.nama_menu)}</div>
                            </div>
                            <div class="text-xs text-gray-400">${formatDate(item.dibuat_pada)}</div>
                        </div>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="text-sm font-medium">Rating:</span>
                            <div class="flex rating-star">${starsHtml}</div>
                            <span class="text-xs text-gray-500">(${item.rating}/5)</span>
                        </div>
                        ${komentarHtml}
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Helper: escape HTML untuk mencegah XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Helper: format tanggal Indonesia
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}