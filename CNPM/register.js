document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const messageEl = document.getElementById('registerMessage');

  const showMessage = (text, type = 'danger') => {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = `alert alert-${type} mt-3`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showMessage('', '');

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!fullname || !email || !password) {
      return showMessage('Vui lòng điền họ tên, email và mật khẩu.', 'warning');
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        return showMessage(data.error || 'Đăng ký thất bại.', 'danger');
      }

      showMessage('Đăng ký thành công. Chuyển sang đăng nhập...', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
    } catch (error) {
      showMessage('Không thể kết nối tới server. Vui lòng thử lại.', 'danger');
    }
  });
});
