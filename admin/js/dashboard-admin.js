// ====== Admin Dashboard Script ======

window.addEventListener('DOMContentLoaded', function() {
  // Ambil data admin dari session/localStorage
  const adminName = localStorage.getItem('adminName') || 'Admin';
  
  document.getElementById('adminName').textContent = adminName;
});
