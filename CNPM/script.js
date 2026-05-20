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
