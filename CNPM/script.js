document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "heyshopCart";

  const getCartItems = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") || [];
    } catch {
      return [];
    }
  };

  const saveCartItems = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const formatCurrency = (value) => {
    const number = Number(value) || 0;
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const parseCurrency = (text) => {
    return Number(String(text).replace(/[^0-9]/g, "")) || 0;
  };

  const updateCartBadge = () => {
    const cartBadge = document.querySelector(".cart-badge");
    if (!cartBadge) return;
    const items = getCartItems();
    const count = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    cartBadge.innerText = count;
  };

  updateCartBadge();

  const getProductCardData = (btn) => {
    const card = btn.closest(".product-card");
    if (!card) return null;

    const nameEl = card.querySelector(".card-title");
    const priceEl = card.querySelector(".text-danger.fs-5, .text-danger");
    const imageEl = card.querySelector("img");
    const sizeInput = card.querySelector("input[type='radio'][name^='size']:checked");
    const colorInput = card.querySelector("input[type='radio'][name='color']:checked");

    const sizeLabel = sizeInput ? card.querySelector(`label[for='${sizeInput.id}']`) : null;
    const colorLabel = colorInput ? card.querySelector(`label[for='${colorInput.id}']`) : null;

    return {
      name: nameEl?.textContent.trim() || "Sản phẩm",
      price: parseCurrency(priceEl?.textContent || "0"),
      image: imageEl?.src || "",
      link: window.location.pathname.split("/").pop(),
      size: sizeLabel?.textContent.trim() || sizeInput?.value || "",
      color: colorLabel?.style.background || colorLabel?.textContent.trim() || colorInput?.value || "",
      quantity: 1,
    };
  };

  const addCartItem = (product) => {
    if (!product || !product.name) return;
    const items = getCartItems();
    const existingIndex = items.findIndex(
      (item) =>
        item.name === product.name &&
        item.size === product.size &&
        item.color === product.color,
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity = Number(items[existingIndex].quantity || 1) + Number(product.quantity || 1);
    } else {
      items.push(product);
    }

    saveCartItems(items);
    updateCartBadge();
  };

  const updateButtonState = (btn) => {
    const originalText = btn.dataset.originalText || btn.innerText;
    btn.dataset.originalText = originalText;
    btn.innerText = "Đã thêm";
    btn.classList.add("btn-success");
    btn.classList.remove("btn-primary");

    setTimeout(() => {
      btn.innerText = originalText;
      btn.classList.remove("btn-success");
      if (btn.dataset.originalText.toLowerCase().includes("giỏ")) {
        btn.classList.add("btn-primary");
      }
    }, 1000);
  };

  const addToCartButtons = Array.from(document.querySelectorAll(".add-to-cart, button")).filter((btn) => {
    const text = btn.textContent.trim().toLowerCase();
    return btn.classList.contains("add-to-cart") || text === "thêm vào giỏ" || text === "thêm vào giỏ";
  });

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = getProductCardData(btn);
      if (!item) return;
      addCartItem(item);
      updateButtonState(btn);
    });
  });

  const cartTable = document.getElementById("cart");

  const getShippingFee = () => {
    const area = document.getElementById("area")?.value;
    const speed = document.getElementById("speed")?.value;
    let ship = 0;

    if (area === "near") ship += 15000;
    else if (area === "far") ship += 25000;
    else ship += 10000;

    if (speed === "fast") ship += 10000;

    return ship;
  };

  const renderCart = () => {
    if (!cartTable) return;
    const items = getCartItems();

    if (items.length === 0) {
      cartTable.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-4">Giỏ hàng đang trống.</td>
        </tr>
      `;
    } else {
      cartTable.innerHTML = items
        .map(
          (item, index) => `
            <tr data-index="${index}">
              <td>
                <input type="checkbox" class="form-check-input">
              </td>
              <td>
                <img src="${item.image}" width="80" class="rounded" />
              </td>
              <td class="text-start">
                <div class="fw-bold">${item.name}</div>
                ${item.size ? `<div>Size: ${item.size}</div>` : ""}
                ${item.color ? `<div>Màu: ${item.color}</div>` : ""}
              </td>
              <td>${formatCurrency(item.price)}</td>
              <td>
                <div class="d-flex justify-content-center align-items-center gap-2">
                  <button class="btn btn-outline-dark btn-sm qty-decrease" data-index="${index}">-</button>
                  <span class="qty-value">${item.quantity}</span>
                  <button class="btn btn-outline-dark btn-sm qty-increase" data-index="${index}">+</button>
                </div>
              </td>
              <td>${formatCurrency(item.price * item.quantity)}</td>
              <td>
                <button class="btn btn-danger btn-sm remove-item" data-index="${index}">X</button>
              </td>
            </tr>
          `,
        )
        .join("");
    }

    document.querySelectorAll(".qty-decrease").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        const items = getCartItems();
        if (!items[index]) return;
        if (items[index].quantity > 1) {
          items[index].quantity -= 1;
        }
        saveCartItems(items);
        renderCart();
        updateCartBadge();
      });
    });

    document.querySelectorAll(".qty-increase").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        const items = getCartItems();
        if (!items[index]) return;
        items[index].quantity += 1;
        saveCartItems(items);
        renderCart();
        updateCartBadge();
      });
    });

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        const items = getCartItems();
        items.splice(index, 1);
        saveCartItems(items);
        renderCart();
        updateCartBadge();
      });
    });

    const subtotalValue = getCartItems().reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0,
    );

    const shipValue = getShippingFee();
    const totalValue = subtotalValue + shipValue;

    document.getElementById("subtotal").innerText = formatCurrency(subtotalValue);
    document.getElementById("ship").innerText = formatCurrency(shipValue);
    document.getElementById("total").innerText = formatCurrency(totalValue);
  };

  window.renderCart = renderCart;
  window.goCheckout = () => {
    const items = getCartItems();
    if (!items.length) {
      alert("Giỏ hàng trống. Vui lòng chọn sản phẩm trước khi thanh toán.");
      return;
    }
    alert("Tiếp tục đến thanh toán...");
  };

  if (cartTable) {
    renderCart();
  }

  const searchGroup = document.querySelector(".search-container");
  if (searchGroup) {
    const searchInput = searchGroup.querySelector("input[type='text']");
    const searchButton = searchGroup.querySelector(".input-group-text");
    const searchDropdown = searchGroup.querySelector("#searchDropdown");

    const products = [
      {
        name: "Set Blazer Thanh Lịch",
        price: "699.000đ",
        link: "set1.html",
        image: "image/blazer1.png",
      },
      {
        name: "Set Sơ Mi & Quần Short",
        price: "329.000đ",
        link: "set2.html",
        image: "image/somi1.png",
      },
      {
        name: "Set Unisex Streetwear",
        price: "299.000đ",
        link: "set3.html",
        image: "image/unisex1.png",
      },
      {
        name: "Blazer Thanh Lịch",
        price: "800.000đ",
        link: "product1.html",
        image: "image/com.jpg",
      },
      {
        name: "Sơ Mi Nâu",
        price: "450.000đ",
        link: "product2.html",
        image: "image/vestmau.jpg",
      },
      {
        name: "Chân váy ngắn",
        price: "450.000đ",
        link: "product3.html",
        image: "image/chanvayngan.jpg",
      },
      {
        name: "Sơ Mi Phối Màu",
        price: "450.000đ",
        link: "product4.html",
        image: "image/somitre.jpg",
      },
      {
        name: "Sơ Mi Công Sở",
        price: "500.000đ",
        link: "product5.html",
        image: "image/somi.jpg",
      },
      {
        name: "Váy Thời Trang",
        price: "550.000đ",
        link: "product6.html",
        image: "image/dam.jpg",
      },
      {
        name: "Đầm Dạ Hội",
        price: "700.000đ",
        link: "product7.html",
        image: "image/damdahoi.jpg",
      },
      {
        name: "Côm Lê Nam",
        price: "700.000đ",
        link: "product8.html",
        image: "image/vest.jpg",
      },
      {
        name: "Áo len",
        price: "600.000đ",
        link: "product9.html",
        image: "image/aolen.jpg",
      },
    ];

    const renderDropdown = (results) => {
      if (!searchDropdown) return;
      if (results.length === 0) {
        searchDropdown.innerHTML = `
          <div class="search-results-header">Kết quả tìm kiếm</div>
          <div class="search-no-results">Không tìm thấy sản phẩm phù hợp.</div>
        `;
      } else {
        const items = results
          .map(
            (product) => `
              <a href="${product.link}" class="search-item">
                <img src="${product.image}" alt="${product.name}" />
                <div class="search-item-info">
                  <div class="search-item-name">${product.name}</div>
                  <div class="search-item-price">${product.price}</div>
                </div>
              </a>
            `,
          )
          .join("");

        searchDropdown.innerHTML = `
          <div class="search-results-header">Kết quả tìm kiếm</div>
          <div class="search-items">${items}</div>
        `;
      }
      searchDropdown.classList.remove("d-none");
    };

    const closeDropdown = () => {
      if (searchDropdown) {
        searchDropdown.classList.add("d-none");
      }
    };

    const updateResults = () => {
      if (!searchInput) return;
      const query = searchInput.value.trim();
      if (!query) {
        closeDropdown();
        return;
      }
      const queryLower = query.toLowerCase();
      const matched = products.filter((product) =>
        product.name.toLowerCase().includes(queryLower),
      );
      renderDropdown(matched);
    };

    const submitSearch = () => {
      if (!searchInput) return;
      const query = searchInput.value.trim();
      if (!query) {
        alert("Vui lòng nhập từ khóa tìm kiếm.");
        searchInput.focus();
        return;
      }
      updateResults();
    };

    if (searchButton) {
      searchButton.addEventListener("click", submitSearch);
    }

    if (searchInput) {
      searchInput.addEventListener("input", updateResults);

      searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          submitSearch();
        }
      });

      searchInput.addEventListener("focus", () => {
        if (searchDropdown && searchDropdown.innerHTML.trim()) {
          searchDropdown.classList.remove("d-none");
        }
      });
    }

    document.addEventListener("click", (event) => {
      if (!searchGroup.contains(event.target)) {
        closeDropdown();
      }
    });
  }
});
