// ====== User Login Script ======

function handleLogin(event) {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    event.preventDefault();
    showAlert('Email dan password wajib diisi.', false);
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

  if (error) {
    let message = '';
    switch(error) {
      case 'not_registered':
        message = 'Data Anda belum terdaftar. Silakan registrasi terlebih dahulu.';
        break;
      case 'wrong_password':
        message = 'Password yang Anda masukkan salah. Silakan coba lagi.';
        break;
      case 'empty':
        message = 'Email dan password wajib diisi.';
        break;
      default:
        message = 'Terjadi kesalahan. Silakan coba lagi.';
    }
    showAlert(message, false);
  }
});
