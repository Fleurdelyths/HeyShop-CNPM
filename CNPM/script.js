document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-to-cart");
  const cartBadge = document.querySelector(".cart-badge");
  let count = 0;

  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      count++;
      cartBadge.innerText = count;

      // Hiệu ứng nhấn nút
      btn.innerText = "Đã thêm";
      btn.classList.replace("btn-primary", "btn-success");

      setTimeout(() => {
        btn.innerText = "Giỏ hàng";
        btn.classList.replace("btn-success", "btn-primary");
      }, 1000);
    });
  });
});
