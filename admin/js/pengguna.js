document.addEventListener('DOMContentLoaded', function() {
    let users = [];
    let selectedUserId = null;

    const userTableBody = document.getElementById('userTableBody');
    const searchInput = document.getElementById('searchUser');
    const filterRole = document.getElementById('filterRole');
    const btnTambahUser = document.getElementById('btnTambahUser');
    const userModal = document.getElementById('userModal');
    const userModalBox = document.getElementById('userModalBox');
    const userForm = document.getElementById('userForm');
    const userIdField = document.getElementById('userId');
    const userNama = document.getElementById('userNama');
    const userEmail = document.getElementById('userEmail');
    const userRole = document.getElementById('userRole');
    const userPassword = document.getElementById('userPassword');
    const modalTitle = document.getElementById('userModalTitle');
    const btnCloseUserModal = document.getElementById('btnCloseUserModal');
    const btnCancelUser = document.getElementById('btnCancelUser');
    const userModalOverlay = document.getElementById('userModalOverlay');

    const deleteUserModal = document.getElementById('deleteUserModal');
    const deleteUserBox = document.getElementById('deleteUserBox');
    const btnCancelDeleteUser = document.getElementById('btnCancelDeleteUser');
    const btnConfirmDeleteUser = document.getElementById('btnConfirmDeleteUser');
    const deleteUserOverlay = document.getElementById('deleteUserOverlay');

    const resetPasswordModal = document.getElementById('resetPasswordModal');
    const resetPasswordBox = document.getElementById('resetPasswordBox');
    const btnCancelReset = document.getElementById('btnCancelReset');
    const btnConfirmReset = document.getElementById('btnConfirmReset');
    const resetPasswordOverlay = document.getElementById('resetPasswordOverlay');

    // Fungsi modal helper
    function openModal(modal, box) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            box.classList.remove('scale-95', 'opacity-0');
            box.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
    function closeModal(modal, box) {
        box.classList.remove('scale-100', 'opacity-100');
        box.classList.add('scale-95', 'opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    // Ambil data user dari API
    async function fetchUsers() {
        try {
            const response = await fetch('api/get_users.php');
            const data = await response.json();
            if (data.success) {
                users = data.users;
                renderUsers();
            } else {
                showToast('Gagal memuat data pengguna', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Error koneksi', 'error');
        }
    }

    function renderUsers() {
        let filtered = [...users];
        const search = searchInput.value.toLowerCase();
        const role = filterRole.value;
        if (search) {
            filtered = filtered.filter(u => u.nama.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
        }
        if (role !== 'semua') {
            filtered = filtered.filter(u => u.peran === role);
        }
        if (filtered.length === 0) {
            userTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-400">Tidak ada data</td></tr>';
            return;
        }
        let html = '';
        filtered.forEach(user => {
            html += `
                <tr class="border-b hover:bg-gray-50 transition">
                    <td class="px-4 py-3 text-sm">${user.id}</td>
                    <td class="px-4 py-3 text-sm font-medium">${escapeHtml(user.nama)}</td>
                    <td class="px-4 py-3 text-sm">${escapeHtml(user.email)}</td>
                    <td class="px-4 py-3 text-sm">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${user.peran === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}">
                            ${user.peran === 'admin' ? 'Admin' : 'Pelanggan'}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-sm">${user.dibuat_pada}</td>
                    <td class="px-4 py-3 text-center">
                        <button data-id="${user.id}" class="btn-edit text-blue-600 hover:text-blue-800 mx-1" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button data-id="${user.id}" class="btn-reset text-yellow-600 hover:text-yellow-800 mx-1" title="Reset Password"><i class="fa-solid fa-key"></i></button>
                        <button data-id="${user.id}" class="btn-delete text-red-600 hover:text-red-800 mx-1" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        userTableBody.innerHTML = html;

        // Attach event listeners
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => editUser(parseInt(btn.dataset.id)));
        });
        document.querySelectorAll('.btn-reset').forEach(btn => {
            btn.addEventListener('click', () => resetPasswordUser(parseInt(btn.dataset.id)));
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteUser(parseInt(btn.dataset.id)));
        });
    }

    function editUser(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;
        userIdField.value = user.id;
        userNama.value = user.nama;
        userEmail.value = user.email;
        userRole.value = user.peran;
        userPassword.value = '';
        modalTitle.innerText = 'Edit Pengguna';
        openModal(userModal, userModalBox);
    }

    function resetPasswordUser(id) {
        selectedUserId = id;
        openModal(resetPasswordModal, resetPasswordBox);
    }

    function deleteUser(id) {
        selectedUserId = id;
        openModal(deleteUserModal, deleteUserBox);
    }

    // Submit form tambah/edit
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = userIdField.value;
        const nama = userNama.value.trim();
        const email = userEmail.value.trim();
        const role = userRole.value;
        const password = userPassword.value;
        const formData = new FormData();
        if (id) {
            formData.append('action', 'edit');
            formData.append('id', id);
        } else {
            formData.append('action', 'tambah');
        }
        formData.append('nama', nama);
        formData.append('email', email);
        formData.append('role', role);
        if (password) formData.append('password', password);
        try {
            const response = await fetch('api/save_user.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast('Pengguna berhasil disimpan', 'success');
                closeModal(userModal, userModalBox);
                fetchUsers();
                userForm.reset();
                userIdField.value = '';
            } else {
                showToast(result.message || 'Gagal menyimpan', 'error');
            }
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    });

    // Konfirmasi hapus
    btnConfirmDeleteUser.addEventListener('click', async () => {
        if (!selectedUserId) return;
        const formData = new FormData();
        formData.append('action', 'hapus');
        formData.append('id', selectedUserId);
        try {
            const response = await fetch('api/save_user.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast('Pengguna dihapus', 'success');
                closeModal(deleteUserModal, deleteUserBox);
                fetchUsers();
            } else {
                showToast(result.message || 'Gagal hapus', 'error');
            }
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    });

    // Konfirmasi reset password
    btnConfirmReset.addEventListener('click', async () => {
        if (!selectedUserId) return;
        const formData = new FormData();
        formData.append('action', 'reset');
        formData.append('id', selectedUserId);
        try {
            const response = await fetch('api/save_user.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                showToast('Password berhasil direset menjadi 12345678', 'success');
                closeModal(resetPasswordModal, resetPasswordBox);
                fetchUsers();
            } else {
                showToast(result.message || 'Gagal reset', 'error');
            }
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    });

    // Event close modal
    btnTambahUser.addEventListener('click', () => {
        userForm.reset();
        userIdField.value = '';
        modalTitle.innerText = 'Tambah Pengguna';
        openModal(userModal, userModalBox);
    });
    btnCloseUserModal.addEventListener('click', () => closeModal(userModal, userModalBox));
    btnCancelUser.addEventListener('click', () => closeModal(userModal, userModalBox));
    userModalOverlay.addEventListener('click', () => closeModal(userModal, userModalBox));
    btnCancelDeleteUser.addEventListener('click', () => closeModal(deleteUserModal, deleteUserBox));
    deleteUserOverlay.addEventListener('click', () => closeModal(deleteUserModal, deleteUserBox));
    btnCancelReset.addEventListener('click', () => closeModal(resetPasswordModal, resetPasswordBox));
    resetPasswordOverlay.addEventListener('click', () => closeModal(resetPasswordModal, resetPasswordBox));
    searchInput.addEventListener('input', renderUsers);
    filterRole.addEventListener('change', renderUsers);

    function escapeHtml(str) { return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); }
    function showToast(msg, type) { /* gunakan toast.js global */ if(typeof showToast === 'function') showToast(msg, type); else alert(msg); }

    fetchUsers();
}); 