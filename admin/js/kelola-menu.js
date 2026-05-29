// admin/js/kelola-menu.js - VERSI FINAL (auto update tanpa reload)
let menuData = [];
let currentCategoryFilter = 'semua';
let searchQuery = '';
let selectedMenuIdForDelete = null;

const menuContainer = document.getElementById('menuContainer');
const searchMenuInput = document.getElementById('searchMenu');
const menuModal = document.getElementById('menuModal');
const menuModalBox = document.getElementById('menuModalBox');
const menuForm = document.getElementById('menuForm');
const modalTitle = document.getElementById('modalTitle');
const deleteModal = document.getElementById('deleteModal');
const deleteModalBox = document.getElementById('deleteModalBox');

function getCategoryMeta(cat) {
    const meta = {
        'Reguler': { color: 'amber-600', border: 'border-l-amber-500', bgHover: 'group-hover:bg-amber-50', label: 'Reguler' },
        'Tambahan': { color: 'blue-500', border: 'border-l-blue-500', bgHover: 'group-hover:bg-blue-50', label: 'Tambahan' },
        'Paket': { color: 'rose-600', border: 'border-l-rose-500', bgHover: 'group-hover:bg-rose-50', label: 'Paket' },
        'Paket Combo': { color: 'purple-600', border: 'border-l-purple-500', bgHover: 'group-hover:bg-purple-50', label: 'Combo' }
    };
    return meta[cat] || { color: 'gray-500', border: 'border-l-gray-500', bgHover: 'group-hover:bg-gray-50', label: 'Lainnya' };
}

async function fetchMenu() {
    try {
        const response = await fetch('api/get_menu.php');
        const data = await response.json();
        if (data.success) {
            menuData = data.menu;
            renderMenus();
        } else {
            console.error('Gagal ambil menu');
        }
    } catch (err) {
        console.error(err);
    }
}

function renderMenus() {
    const filtered = menuData.filter(menu => {
        const matchesCategory = currentCategoryFilter === 'semua' || menu.kategori === currentCategoryFilter;
        const matchesSearch = menu.nama.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        menuContainer.innerHTML = `
            <div class="col-span-full text-center text-gray-400 py-16 flex flex-col items-center">
                <i class="fa-solid fa-utensils text-4xl mb-3 opacity-30"></i>
                <p class="font-medium text-sm text-gray-500">Menu tidak ditemukan.</p>
            </div>`;
        return;
    }

    let html = '';
    filtered.forEach(menu => {
        const catMeta = getCategoryMeta(menu.kategori);
        const isAvailable = menu.stok > 0;
        const imgPath = `../../img/${menu.img}`;
        html += `
            <div class="modern-card-menu group relative bg-white p-5 rounded-2xl border border-gray-200 flex flex-col overflow-hidden cursor-pointer">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#4a5d42]/5 to-green-200/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 -z-10"></div>
                <div class="flex gap-4 z-10">
                    <div class="relative w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex items-center justify-center shadow-inner group-hover:from-green-50/50 group-hover:to-emerald-50/50 transition-colors duration-500">
                        <img src="${imgPath}" alt="${menu.nama}" onerror="this.src='../../img/Logo_Sabana.png'" class="w-full h-full object-contain drop-shadow-sm group-hover:drop-shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <div class="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg text-[9px] font-extrabold shadow-md flex items-center gap-1.5 uppercase tracking-wider ${isAvailable ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' : 'bg-gradient-to-r from-rose-500 to-red-500 text-white'}">
                            <span class="w-1.5 h-1.5 rounded-full bg-white ${isAvailable ? 'animate-pulse' : ''}"></span>
                            ${isAvailable ? 'Tersedia' : 'Habis'}
                        </div>
                    </div>
                    <div class="flex-1 min-w-0 flex flex-col pt-1">
                        <span class="text-[10px] font-black uppercase tracking-widest text-${catMeta.color} mb-1.5 opacity-80">${catMeta.label}</span>
                        <h3 class="text-[15px] font-extrabold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#4a5d42] transition-colors">${escapeHtml(menu.nama)}</h3>
                        <div class="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-gray-50/80 border border-gray-100 w-fit group-hover:bg-white transition-colors">
                            <i class="fa-solid fa-cubes-stacked text-[10px] ${isAvailable ? 'text-[#4a5d42]' : 'text-rose-400'}"></i>
                            <span class="text-[11px] font-bold text-gray-500">Stok: <span class="${isAvailable ? 'text-gray-900' : 'text-rose-600'}">${menu.stok}</span></span>
                        </div>
                    </div>
                </div>
                <div class="mt-5 mb-4 relative z-10 p-3.5 rounded-r-xl rounded-l-md border border-gray-100 border-l-4 ${catMeta.border} bg-gray-50 ${catMeta.bgHover} transition-colors duration-300">
                    <div class="flex items-center gap-2 mb-1">
                        <i class="fa-solid fa-circle-info text-[10px] text-${catMeta.color}"></i>
                        <p class="text-[9px] font-extrabold uppercase tracking-widest text-${catMeta.color}">Rincian Menu</p>
                    </div>
                    <p class="text-[11px] text-gray-600 line-clamp-2 leading-relaxed font-medium">${escapeHtml(menu.deskripsi)}</p>
                </div>
                <div class="mt-auto pt-4 border-t border-dashed border-gray-200 flex justify-between items-end z-10">
                    <div>
                        <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Harga Jual</p>
                        <p class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2c3e50] to-[#4a5d42]">Rp ${menu.harga.toLocaleString('id-ID')}</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-id="${menu.id}" class="btn-edit-menu flex items-center gap-2 bg-[#4a5d42]/10 hover:bg-[#4a5d42] text-[#4a5d42] hover:text-white px-3.5 py-2 rounded-xl transition-all duration-300 shadow-sm" title="Ubah Data">
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                            <span class="text-[11px] font-bold hidden sm:block">Edit</span>
                        </button>
                        <button data-id="${menu.id}" class="btn-hapus-menu flex items-center justify-center bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white w-9 h-9 rounded-xl transition-all duration-300 shadow-sm" title="Hapus Menu">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    menuContainer.innerHTML = html;
    attachCardEvents();
}

function attachCardEvents() {
    document.querySelectorAll('.btn-edit-menu').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const menu = menuData.find(m => m.id === id);
            if (menu) {
                modalTitle.innerText = "Edit Menu Sabana";
                document.getElementById('menuId').value = menu.id;
                document.getElementById('menuNama').value = menu.nama;
                document.getElementById('menuKategori').value = menu.kategori;
                document.getElementById('menuHarga').value = menu.harga;
                document.getElementById('menuStok').value = menu.stok;
                document.getElementById('menuDeskripsi').value = menu.deskripsi;
                document.getElementById('gambarLama').value = menu.img;
                const preview = document.getElementById('previewGambar');
                preview.src = `../../img/${menu.img}`;
                openModal(menuModal, menuModalBox);
            }
        });
    });

    document.querySelectorAll('.btn-hapus-menu').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedMenuIdForDelete = parseInt(btn.dataset.id);
            openModal(deleteModal, deleteModalBox);
        });
    });
}

function openModal(modalEl, boxEl) {
    modalEl.classList.remove('hidden');
    setTimeout(() => {
        boxEl.classList.remove('scale-95', 'opacity-0');
        boxEl.classList.add('scale-100', 'opacity-100');
    }, 10);
}
function closeModal(modalEl, boxEl) {
    boxEl.classList.remove('scale-100', 'opacity-100');
    boxEl.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modalEl.classList.add('hidden'), 300);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[m]);
}

// Preview gambar
document.getElementById('menuGambar')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            document.getElementById('previewGambar').src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Submit form
menuForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('menuId').value;
    const nama = document.getElementById('menuNama').value.trim();
    const kategori = document.getElementById('menuKategori').value;
    const harga = parseInt(document.getElementById('menuHarga').value);
    const stok = parseInt(document.getElementById('menuStok').value);
    const deskripsi = document.getElementById('menuDeskripsi').value.trim();
    const gambarLama = document.getElementById('gambarLama').value;
    const fileInput = document.getElementById('menuGambar');
    const formData = new FormData();
    
    if (id) {
        formData.append('action', 'edit');
        formData.append('id', id);
        formData.append('gambar_lama', gambarLama);
    } else {
        formData.append('action', 'tambah');
    }
    formData.append('nama', nama);
    formData.append('kategori', kategori);
    formData.append('harga', harga);
    formData.append('stok', stok);
    formData.append('deskripsi', deskripsi);
    if (fileInput.files.length > 0) {
        formData.append('gambar', fileInput.files[0]);
    }
    
    try {
        const response = await fetch('api/save_menu.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            showToast('Menu berhasil disimpan!', 'success');
            closeModal(menuModal, menuModalBox);
            await fetchMenu(); // <-- INI YANG MEMBUAT LANGSUNG UPDATE TANPA RELOAD
            // Reset form
            menuForm.reset();
            document.getElementById('menuId').value = '';
            document.getElementById('gambarLama').value = '';
            document.getElementById('previewGambar').src = '../../img/default.png';
        } else {
            showToast(result.message || 'Gagal menyimpan menu', 'error');
        }
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
});

// Hapus menu
document.getElementById('btnConfirmDelete').addEventListener('click', async () => {
    if (selectedMenuIdForDelete) {
        const formData = new FormData();
        formData.append('id', selectedMenuIdForDelete);
        try {
            const response = await fetch('api/delete_menu.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast('Menu berhasil dihapus', 'success');
                closeModal(deleteModal, deleteModalBox);
                await fetchMenu(); // <-- INI JUGA MEMBUAT LANGSUNG UPDATE
            } else {
                showToast(result.message || 'Gagal hapus menu', 'error');
            }
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    }
});

// Filter kategori
document.querySelectorAll('.menu-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentCategoryFilter = btn.dataset.category;
        document.querySelectorAll('.menu-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenus();
    });
});

// Search
searchMenuInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderMenus();
});

// Tombol tambah
document.getElementById('btnTambahMenu').addEventListener('click', () => {
    modalTitle.innerText = "Tambah Menu Baru";
    menuForm.reset();
    document.getElementById('menuId').value = '';
    document.getElementById('gambarLama').value = '';
    document.getElementById('previewGambar').src = '../../img/default.png';
    openModal(menuModal, menuModalBox);
});

// Event close modal
document.getElementById('btnCloseMenuModal').addEventListener('click', () => closeModal(menuModal, menuModalBox));
document.getElementById('btnBatalMenu').addEventListener('click', () => closeModal(menuModal, menuModalBox));
document.getElementById('menuModalOverlay').addEventListener('click', () => closeModal(menuModal, menuModalBox));
document.getElementById('btnCancelDelete').addEventListener('click', () => closeModal(deleteModal, deleteModalBox));
document.getElementById('deleteModalOverlay').addEventListener('click', () => closeModal(deleteModal, deleteModalBox));

// Fungsi toast
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 px-4 py-3 rounded-xl text-white text-sm z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Inisialisasi
fetchMenu();