// ====== User Registration Script ======

function handleRegister(event) {
  const f = event.target;
  if (!f.nama_depan.value || !f.nama_belakang.value || !f.email.value || !f.password.value) {
    event.preventDefault();
    showAlert('Semua field wajib diisi.', false);
    return false;
  }
}

function showAlert(msg, success) {
  const a = document.getElementById('alertBox');
  a.textContent = msg;
  a.classList.add('show');
  a.classList.toggle('success', !!success);
}

window.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const success = urlParams.get('success');

  if (success) {
    showAlert('Registrasi berhasil! Silakan login untuk melanjutkan.', true);
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  }

  if (error) {
    let message = '';
    switch(error) {
      case 'email_exists':
        message = 'Email sudah terdaftar. Silakan gunakan email lain.';
        break;
      case 'password_short':
        message = 'Password minimal 5 karakter.';
        break;
      case 'empty':
        message = 'Semua field wajib diisi.';
        break;
      default:
        message = 'Terjadi kesalahan saat registrasi. Silakan coba lagi.';
    }
    showAlert(message, false);
  }
});
