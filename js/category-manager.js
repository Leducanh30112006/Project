document.addEventListener("DOMContentLoaded", function () {
  const addCategoryBtn = document.getElementById("add-category-btn");
  const modalOverlay = document.getElementById("modal-overlay");
  const categoryModal = document.getElementById("category-modal");
  const closeButton = document.querySelector(".close-button");
  const cancelBtn = document.getElementById("cancel-btn");
  const tbody = document.getElementById("tbody");
  const searchInput = document.getElementById("search-input");
  const filterSelect = document.querySelector(".custom-select");
  const saveButton = document.getElementById("save-btn");
  const modalTitle = document.querySelector(".modal-title");

  // Định vị chính xác các trường nhập liệu trong form
  const categoryIdInput = document.getElementById("category-id");
  const categoryNameInput = document.getElementById("category-name");
  const idError = document.getElementById("id-error");
  const nameError = document.getElementById("name-error");

  // Khởi tạo danh sách danh mục với dữ liệu mặc định nếu localStorage trống
  let categories = JSON.parse(localStorage.getItem("categories")) || [
    { id: "DM001", name: "Quần áo", status: "active", products: [] },
    { id: "DM002", name: "Kính mắt", status: "inactive", products: [] },
    { id: "DM003", name: "Giày dép", status: "active", products: [] },
    {
      id: "DM004",
      name: "Thời trang nam",
      status: "inactive",
      products: [],
    },
    {
      id: "DM005",
      name: "Thời trang nữ",
      status: "inactive",
      products: [],
    },
    { id: "DM006", name: "Hoa quả", status: "inactive", products: [] },
    { id: "DM007", name: "Rau", status: "active", products: [] },
    { id: "DM008", name: "Điện thoại", status: "inactive", products: [] },
  ];

  // Lưu danh sách danh mục ban đầu vào localStorage nếu chưa có
  if (!localStorage.getItem("categories")) {
    localStorage.setItem("categories", JSON.stringify(categories));
  }

  let currentPage = 1;
  const itemsPerPage = 7; // Số lượng mục trên mỗi trang
  let editMode = false;
  let currentEditId = null;

  // THÊM MỚI: Biến theo dõi trạng thái sắp xếp
  let sortDirection = {
    id: "none", // 'asc', 'desc', hoặc 'none'
    name: "none",
  };

  //  mũi tên khi sắp xếp
  function updateSortArrows() {
    const idArrow = document.querySelector("th:nth-child(1) .arrow");
    const nameArrow = document.querySelector("th:nth-child(2) .arrow");

    // Kiểm tra xem phần tử có tồn tại không trước khi cập nhật
    if (idArrow) {
      idArrow.src =
        sortDirection.id === "asc"
          ? "../assets/icons/arrow-down - Copy.png"
          : "../assets/icons/arrow-down.png";
    }

    if (nameArrow) {
      nameArrow.src =
        sortDirection.name === "asc"
          ? "../assets/icons/arrow-down - Copy.png"
          : "../assets/icons/arrow-down.png";
    }
  }

  // CHỈNH SỬA: Hàm sắp xếp danh mục
  function sortCategories(field) {
    // Thay đổi hướng sắp xếp khi người dùng bấm vào tiêu đề
    if (sortDirection[field] === "none" || sortDirection[field] === "desc") {
      sortDirection[field] = "asc";
      // Đặt lại trạng thái sắp xếp cho trường còn lại
      const otherField = field === "id" ? "name" : "id";
      sortDirection[otherField] = "none";
    } else {
      sortDirection[field] = "desc";
    }

    // Cập nhật UI mũi tên
    updateSortArrows();

    // Lọc và sắp xếp danh sách
    const filteredCategories = filterCategories();

    // Sắp xếp theo trường và hướng đã chọn
    filteredCategories.sort((a, b) => {
      if (sortDirection[field] === "asc") {
        return a[field].localeCompare(b[field]);
      } else {
        return b[field].localeCompare(a[field]);
      }
    });

    // Đặt lại trang hiện tại và hiển thị lại danh sách
    currentPage = 1;
    renderCategories(filteredCategories);
  }

  // Hàm kiểm tra tính hợp lệ của form
  function validateForm() {
    let isValid = true;

    // Kiểm tra mã danh mục
    if (!categoryIdInput.value.trim()) {
      categoryIdInput.classList.add("error");
      idError.style.display = "block";
      isValid = false;
    } else {
      categoryIdInput.classList.remove("error");
      idError.style.display = "none";
    }

    // Kiểm tra tên danh mục
    if (!categoryNameInput.value.trim()) {
      categoryNameInput.classList.add("error");
      nameError.style.display = "block";
      isValid = false;
    } else {
      categoryNameInput.classList.remove("error");
      nameError.style.display = "none";
    }

    return isValid;
  }

  //  Hàm hiển thị danh sách danh mục để chấp nhận danh sách đã sắp xếp
  function renderCategories(sortedCategories = null) {
    if (!categories || categories.length === 0) {
      tbody.innerHTML = "<tr><td colspan='4'>Không có danh mục nào</td></tr>";
      renderPagination(0);
      return;
    }

    // Sử dụng danh sách đã sắp xếp nếu được cung cấp, nếu không thì lọc danh sách
    const filteredCategories = sortedCategories || filterCategories();

    if (filteredCategories.length === 0) {
      tbody.innerHTML =
        "<tr><td colspan='4'>Không có kết quả phù hợp</td></tr>";
      renderPagination(0);
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = filteredCategories.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    tbody.innerHTML = paginatedCategories
      .map(
        (category) => `
    <tr>
      <td>${category.id}</td>
      <td>${category.name}</td>
      <td>
        <p class="status ${category.status}">
          <span class="dot"></span><span>${
            category.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"
          }</span>
        </p>
      </td>
      <td>
        <span class="icon-trash" data-id="${category.id}">
          <img src="../assets/icons/Icon.png" alt="Xóa" />
        </span>
        <span class="icon-pen" data-id="${category.id}">
          <img src="../assets/icons/Icon (2).png" alt="Chỉnh sửa" />
        </span>
      </td>
    </tr>
  `
      )
      .join("");

    renderPagination(filteredCategories.length);

    // Sau khi render lại danh sách, cập nhật trạng thái mũi tên
    updateSortArrows();
  }

  // Hàm hiển thị phân trang
  function renderPagination(totalItems) {
    const pagination = document.querySelector(".pagination");
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let paginationHTML = `
<button id="prev-page">                <img
                  src="../assets/icons/arrow left.png"
                  alt=""
                /></button>
`;

    // Hiển thị số lượng trang giới hạn
    const maxVisiblePages = 2;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      // Tính toán trang bắt đầu và kết thúc
      const halfVisible = Math.floor(maxVisiblePages / 2);
      if (currentPage > halfVisible) {
        startPage = Math.max(currentPage - halfVisible, 1);
        endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        if (endPage - startPage < maxVisiblePages - 1) {
          startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }
      } else {
        endPage = Math.min(maxVisiblePages, totalPages);
      }
    }

    // Thêm trang đầu tiên nếu cần
    if (startPage > 1) {
      paginationHTML += `<button data-page="1">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<button disabled>...</button>`;
      }
    }

    // Thêm các số trang
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
  <button data-page="${i}" ${
        i === currentPage ? 'class="active"' : ""
      }>${i}</button>
`;
    }

    // Thêm trang cuối cùng nếu cần
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<button disabled>...</button>`;
      }
      paginationHTML += `<button data-page="${totalPages}">${totalPages}</button>`;
    }

    paginationHTML += `
<button id="next-page"><img
                  src="../assets/icons/arrow right.png"
                  alt=""
                /></button>
`;

    pagination.innerHTML = paginationHTML;

    // Thêm sự kiện click cho các nút phân trang
    const pageButtons = pagination.querySelectorAll("button[data-page]");
    pageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentPage = parseInt(button.dataset.page);
        renderCategories();
      });
    });

    // Thêm sự kiện cho nút trước và sau
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderCategories();
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderCategories();
        }
      });
    }
  }

  // Hàm xóa danh mục
  function deleteCategory(id) {
    const category = categories.find((cat) => cat.id === id);
    if (category && category.products && category.products.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Không thể xóa danh mục!",
        text: "Danh mục đã có sản phẩm.",
      });
      return;
    }

    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa danh mục này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        categories = categories.filter((cat) => cat.id !== id);
        localStorage.setItem("categories", JSON.stringify(categories));

        // Nếu đang ở trang không còn mục nào, quay lại trang trước
        const filteredCategories = filterCategories();
        const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
        if (currentPage > totalPages && currentPage > 1) {
          currentPage--;
        }

        renderCategories();
        Swal.fire({
          icon: "success",
          title: "Xóa thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

  // Hàm lọc danh mục dựa trên tìm kiếm và dropdown
  function filterCategories() {
    const searchValue = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    return categories.filter((category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchValue);
      const matchesFilter =
        filterValue === "all"
          ? true
          : filterValue === "active"
          ? category.status === "active"
          : filterValue === "inactive"
          ? category.status === "inactive"
          : true;
      return matchesSearch && matchesFilter;
    });
  }

  // Hàm chỉnh sửa danh mục
  function editCategory(id) {
    const category = categories.find((cat) => cat.id === id);
    if (!category) return;

    // Đặt form ở chế độ chỉnh sửa
    editMode = true;
    currentEditId = id;
    modalTitle.textContent = "Sửa danh mục";

    // Điền dữ liệu danh mục vào form
    categoryIdInput.value = category.id;
    categoryNameInput.value = category.name;

    // Đặt trạng thái radio button
    if (category.status === "active") {
      document.getElementById("active").checked = true;
    } else {
      document.getElementById("inactive").checked = true;
    }

    // Đặt trường ID chỉ đọc trong chế độ chỉnh sửa
    categoryIdInput.readOnly = true;

    // Hiển thị modal
    modalOverlay.style.display = "flex";
    categoryModal.classList.add("show");
  }

  // THÊM MỚI: Hàm kiểm tra tên danh mục trùng
  function isDuplicateName(name, excludeId = null) {
    // Kiểm tra nếu có danh mục khác có cùng tên (loại trừ danh mục đang chỉnh sửa)
    return categories.some(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        category.id !== excludeId
    );
  }

  // Hàm lưu danh mục (thêm mới hoặc cập nhật)
  function saveCategory() {
    if (!validateForm()) {
      return;
    }

    const id = categoryIdInput.value.trim();
    const name = categoryNameInput.value.trim();
    const statusInput = document.querySelector('input[name="status"]:checked');
    const status = statusInput ? statusInput.value : "active";

    // THÊM MỚI: Kiểm tra tên danh mục trùng
    if (editMode) {
      // Kiểm tra tên khi chỉnh sửa, loại trừ ID hiện tại
      if (isDuplicateName(name, currentEditId)) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Tên danh mục đã tồn tại!",
        });
        categoryNameInput.classList.add("error");
        return;
      }

      // Cập nhật danh mục hiện có
      const index = categories.findIndex((cat) => cat.id === currentEditId);
      if (index !== -1) {
        // Giữ nguyên mảng sản phẩm nếu có
        const existingProducts = categories[index].products || [];
        categories[index] = {
          id,
          name,
          status,
          products: existingProducts,
        };
        localStorage.setItem("categories", JSON.stringify(categories));

        // Đặt lại chế độ chỉnh sửa
        editMode = false;
        currentEditId = null;
      }
    } else {
      // Thêm danh mục mới
      // Kiểm tra nếu ID đã tồn tại
      if (categories.some((category) => category.id === id)) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Mã danh mục đã tồn tại!",
        });
        categoryIdInput.classList.add("error");
        return;
      }

      // THÊM MỚI: Kiểm tra tên danh mục trùng khi thêm mới
      if (isDuplicateName(name)) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Tên danh mục đã tồn tại!",
        });
        categoryNameInput.classList.add("error");
        return;
      }

      // Thêm danh mục mới
      categories.push({ id, name, status, products: [] });
      localStorage.setItem("categories", JSON.stringify(categories));
    }

    // Hiển thị thông báo thành công
    Swal.fire({
      icon: "success",
      title: editMode ? "Cập nhật thành công!" : "Thêm mới thành công!",
      showConfirmButton: false,
      timer: 1500,
    });

    // Đóng modal và hiển thị lại danh sách danh mục
    modalOverlay.style.display = "none";
    categoryModal.classList.remove("show");
    renderCategories();
  }

  // Lắng nghe sự kiện
  tbody.addEventListener("click", (event) => {
    let target = event.target;

    // Nếu click vào hình ảnh, lấy phần tử cha là span
    if (target.tagName === "IMG") {
      target = target.parentElement;
    }

    if (target.classList.contains("icon-trash")) {
      const id = target.dataset.id;
      deleteCategory(id);
    } else if (target.classList.contains("icon-pen")) {
      const id = target.dataset.id;
      editCategory(id);
    }
  });

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderCategories();
  });

  filterSelect.addEventListener("change", () => {
    currentPage = 1;
    renderCategories();
  });

  saveButton.addEventListener("click", saveCategory);

  // Chức năng của modal
  addCategoryBtn.addEventListener("click", () => {
    // Đặt lại form và thông báo lỗi
    categoryIdInput.value = "";
    categoryNameInput.value = "";
    categoryIdInput.readOnly = false;
    document.getElementById("active").checked = true;
    categoryIdInput.classList.remove("error");
    categoryNameInput.classList.remove("error");
    idError.style.display = "none";
    nameError.style.display = "none";

    // Đặt chế độ thành thêm mới
    editMode = false;
    currentEditId = null;
    modalTitle.textContent = "Thêm mới danh mục";

    modalOverlay.style.display = "flex";
    categoryModal.classList.add("show");
  });

  closeButton.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    categoryModal.classList.remove("show");
  });

  cancelBtn.addEventListener("click", () => {
    modalOverlay.style.display = "none";
    categoryModal.classList.remove("show");
  });

  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      modalOverlay.style.display = "none";
      categoryModal.classList.remove("show");
    }
  });

  // CHỈNH SỬA: Thiết lập sự kiện cho các mũi tên sắp xếp - Tách riêng sự kiện
  const idHeader = document.querySelector("th:nth-child(1)");
  const nameHeader = document.querySelector("th:nth-child(2)");

  // Thêm sự kiện click cho tiêu đề cột
  if (idHeader) {
    idHeader.addEventListener("click", function () {
      sortCategories("id");
    });
  }

  if (nameHeader) {
    nameHeader.addEventListener("click", function () {
      sortCategories("name");
    });
  }

  // Đảm bảo các icon arrow tồn tại trước khi thêm event
  const idSortArrow = document.querySelector("th:nth-child(1) .arrow");
  const nameSortArrow = document.querySelector("th:nth-child(2) .arrow");

  if (idSortArrow) {
    idSortArrow.addEventListener("click", function (e) {
      e.stopPropagation(); // Ngăn việc kích hoạt hai lần
      sortCategories("id");
    });
  }

  if (nameSortArrow) {
    nameSortArrow.addEventListener("click", function (e) {
      e.stopPropagation(); // Ngăn việc kích hoạt hai lần
      sortCategories("name");
    });
  }

  // Khởi tạo trạng thái mũi tên ban đầu
  updateSortArrows();

  // Hiển thị danh sách ban đầu
  renderCategories();

  // ===== THÊM CHỨC NĂNG AVATAR MODAL =====

  // Tìm phần tử avatar
  const avatarElement =
    document.querySelector(".avatar") || document.querySelector(".user-avatar");

  // Kiểm tra xem avatar có tồn tại không
  if (avatarElement) {
    // Tạo modal đăng xuất nếu chưa tồn tại
    if (!document.getElementById("logout-modal-overlay")) {
      // Tạo phần tử overlay
      const logoutModalOverlay = document.createElement("div");
      logoutModalOverlay.id = "logout-modal-overlay";
      logoutModalOverlay.className = "modal-overlay";
      logoutModalOverlay.style.display = "none";

      // Tạo nội dung modal
      const logoutModal = document.createElement("div");
      logoutModal.id = "logout-modal";
      logoutModal.className = "modal";

      // HTML nội dung modal
      logoutModal.innerHTML = `
        <div class="modal-header">
          <h3 class="modal-title">Tài khoản</h3>
          <span class="logout-close-button">&times;</span>
        </div>
        <div class="modal-body">
          <div class="user-info">
            <img src="../assets/icons/user-avatar.png" alt="User Avatar" class="modal-avatar">
            <div class="user-details">
              <h4 class="user-name">Admin</h4>
              <p class="user-email">admin@example.com</p>
            </div>
          </div>
          <div class="modal-actions">
            <button id="profile-btn" class="modal-btn">Hồ sơ của tôi</button>
            <button id="logout-btn" class="modal-btn logout-btn">Đăng xuất</button>
          </div>
        </div>
      `;

      // Thêm modal vào body
      logoutModalOverlay.appendChild(logoutModal);
      document.body.appendChild(logoutModalOverlay);

      // Thêm CSS cho modal
      const modalStyle = document.createElement("style");
      modalStyle.textContent = `
        #logout-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          z-index: 1000;
        }
        
        #logout-modal {
          background-color: white;
          border-radius: 8px;
          width: 320px;
          margin-top: 80px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #eee;
        }
        
        .modal-title {
          font-size: 18px;
          margin: 0;
        }
        
        .logout-close-button {
          cursor: pointer;
          font-size: 24px;
        }
        
        .modal-body {
          padding: 16px;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .modal-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 12px;
        }
        
        .user-details {
          flex: 1;
        }
        
        .user-name {
          margin: 0 0 4px 0;
        }
        
        .user-email {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .modal-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .modal-btn:hover {
          background-color: #f5f5f5;
        }
        
        .logout-btn {
          border-color: #ff4d4d;
          color: #ff4d4d;
        }
        
        .logout-btn:hover {
          background-color: #fff0f0;
        }
      `;
      document.head.appendChild(modalStyle);

      // Thêm sự kiện cho modal đăng xuất
      const logoutCloseButton = logoutModal.querySelector(
        ".logout-close-button"
      );
      const logoutBtn = document.getElementById("logout-btn");
      const profileBtn = document.getElementById("profile-btn");

      // Đóng modal khi bấm nút X
      if (logoutCloseButton) {
        logoutCloseButton.addEventListener("click", () => {
          logoutModalOverlay.style.display = "none";
        });
      }

      // Đóng modal khi bấm bên ngoài
      logoutModalOverlay.addEventListener("click", (event) => {
        if (event.target === logoutModalOverlay) {
          logoutModalOverlay.style.display = "none";
        }
      });

      // Chức năng nút đăng xuất
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          Swal.fire({
            title: "Đăng xuất?",
            text: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Hủy",
          }).then((result) => {
            if (result.isConfirmed) {
              // Chuyển đến trang đăng nhập
              window.location.href = "../login/login.html";
            }
          });
        });
      }

      // Chức năng nút hồ sơ
      if (profileBtn) {
        profileBtn.addEventListener("click", () => {
          // Điều hướng đến trang hồ sơ
          logoutModalOverlay.style.display = "none";
          window.location.href = "../profile/profile.html";
        });
      }
    }

    // Thêm sự kiện click cho avatar để hiển thị modal
    avatarElement.addEventListener("click", () => {
      const logoutModalOverlay = document.getElementById(
        "logout-modal-overlay"
      );
      if (logoutModalOverlay) {
        logoutModalOverlay.style.display = "flex";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Avatar dropdown functionality
  const avatarContainer = document.getElementById("avatar-container");
  const userDropdown = document.getElementById("user-dropdown");
  const logoutBtn = document.getElementById("logout-btn");

  // Toggle dropdown when avatar is clicked
  if (avatarContainer) {
    avatarContainer.addEventListener("click", function (e) {
      e.stopPropagation();
      userDropdown.classList.toggle("show");
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", function () {
    if (userDropdown.classList.contains("show")) {
      userDropdown.classList.remove("show");
    }
  });

  // Stop propagation for dropdown menu clicks
  userDropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      Swal.fire({
        title: "Đăng xuất?",
        text: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Đăng xuất",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to login page
          window.location.href = "../page/login.html";
        }
      });
    });
  }
});
