function updateNotifications() {
    fetch('api/get_notifications.php')
        .then(response => response.json())
        .then(data => {
            if (data.count !== undefined) {
                const count = data.count;

                // Badge bel (opsional, tetap seperti kode Anda)
                let bellBadge = document.getElementById('bellBadge');
                if (!bellBadge) {
                    const bellBtn = document.querySelector('.relative.w-10.h-10.rounded-full.bg-gray-50');
                    if (bellBtn) {
                        const badgeSpan = document.createElement('span');
                        badgeSpan.id = 'bellBadge';
                        badgeSpan.className = 'absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md';
                        badgeSpan.style.display = 'none';
                        bellBtn.appendChild(badgeSpan);
                        bellBadge = badgeSpan;
                    }
                }
                if (bellBadge) {
                    if (count > 0) {
                        bellBadge.innerText = count > 99 ? '99+' : count;
                        bellBadge.style.display = 'flex';
                        const bellBtn = document.querySelector('.relative.w-10.h-10.rounded-full.bg-gray-50');
                        if (bellBtn && !bellBtn.classList.contains('ringing')) {
                            bellBtn.classList.add('ringing');
                            setTimeout(() => bellBtn.classList.remove('ringing'), 1000);
                        }
                    } else {
                        bellBadge.style.display = 'none';
                    }
                }

                // Badge sidebar Pesanan - dengan selector lebih fleksibel
                let sidebarBadge = document.getElementById('sidebarPesananBadge');
                if (!sidebarBadge) {
                    // Cari link menuju pesanan.php berdasarkan href atau teks
                    let pesananLink = document.querySelector('a[href="pesanan.php"]');
                    if (!pesananLink) {
                        // Jika tidak ditemukan, cari berdasarkan teks link yang mengandung "Pesanan"
                        const allLinks = document.querySelectorAll('nav a, .nav-item-admin');
                        for (let link of allLinks) {
                            if (link.textContent.trim().toLowerCase() === 'pesanan') {
                                pesananLink = link;
                                break;
                            }
                        }
                    }
                    if (pesananLink) {
                        const badgeSpan = document.createElement('span');
                        badgeSpan.id = 'sidebarPesananBadge';
                        badgeSpan.className = 'ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5';
                        badgeSpan.style.display = 'none';
                        // Sisipkan badge di dalam link, sebelum atau sesudah teks
                        pesananLink.appendChild(badgeSpan);
                        sidebarBadge = badgeSpan;
                    } else {
                        // Jika belum ada, coba lagi setelah 1 detik (DOM mungkin belum siap)
                        setTimeout(updateNotifications, 1000);
                        return;
                    }
                }
                if (sidebarBadge) {
                    if (count > 0) {
                        sidebarBadge.innerText = count;
                        sidebarBadge.style.display = 'inline-block';
                    } else {
                        sidebarBadge.style.display = 'none';
                    }
                }
            }
        })
        .catch(err => console.error('Notifikasi error:', err));
}
setInterval(updateNotifications, 3000);
updateNotifications();
window.updateNotifications = updateNotifications;