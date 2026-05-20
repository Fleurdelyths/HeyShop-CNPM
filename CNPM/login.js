document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const messageEl = document.getElementById('loginMessage');

  const showMessage = (text, type = 'danger') => {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = `alert alert-${type} mt-3`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showMessage('', '');

    const email = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();

    if (!email || !password) {
      return showMessage('Vui lòng nhập email và mật khẩu.', 'warning');
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        return showMessage(data.error || 'Đăng nhập thất bại.', 'danger');
      }

      localStorage.setItem('heyshopUser', JSON.stringify(data.user));
      showMessage('Đăng nhập thành công. Chuyển sang trang chính...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      showMessage('Không thể kết nối tới server. Vui lòng thử lại.', 'danger');
    }
  });
});
