// Toast notification (non-alert)
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-${type === 'success' ? 'solid fa-check-circle' : 'solid fa-exclamation-triangle'}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}