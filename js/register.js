document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;

    // Clear previous error messages
    document
      .querySelectorAll(".error")
      .forEach((error) => (error.textContent = ""));

    // Validate full name
    const fullName = document.getElementById("full-name").value.trim();
    if (!fullName) {
      isValid = false;
      document.getElementById("fullNameError").textContent =
        "Họ và tên không được để trống.";
    }

    // Validate email
    const email = document.getElementById("email").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      isValid = false;
      document.getElementById("emailError").textContent =
        "Email không được để trống.";
    } else if (!emailRegex.test(email)) {
      isValid = false;
      document.getElementById("emailError").textContent =
        "Email phải đúng định dạng.";
    } else {
      // Kiểm tra xem email đã tồn tại trong localStorage chưa
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      const storedUser = JSON.parse(localStorage.getItem("user"));

      // Kiểm tra trong cả danh sách users (nếu có) và user đơn lẻ
      const emailExists =
        existingUsers.some((user) => user.email === email) ||
        (storedUser && storedUser.email === email);

      if (emailExists) {
        isValid = false;
        document.getElementById("emailError").textContent =
          "Email này đã được đăng ký. Vui lòng sử dụng email khác.";

        // Hiển thị thông báo bằng SweetAlert
        Swal.fire({
          icon: "error",
          title: "Email đã tồn tại",
          text: "Email này đã được đăng ký. Vui lòng sử dụng email khác.",
          confirmButtonText: "OK",
        });
      }
    }

    // Validate password
    const password = document.getElementById("password").value.trim();
    if (!password) {
      isValid = false;
      document.getElementById("passwordError").textContent =
        "Mật khẩu không được để trống.";
    } else if (password.length < 8) {
      isValid = false;
      document.getElementById("passwordError").textContent =
        "Mật khẩu tối thiểu 8 ký tự.";
    }

    // Validate confirm password
    const confirmPassword = document
      .getElementById("confirm-password")
      .value.trim();
    if (!confirmPassword) {
      isValid = false;
      document.getElementById("confirmPasswordError").textContent =
        "Mật khẩu xác nhận không được để trống.";
    } else if (confirmPassword !== password) {
      isValid = false;
      document.getElementById("confirmPasswordError").textContent =
        "Mật khẩu không trùng khớp.";
    }

    // Validate terms checkbox
    const terms = document.getElementById("terms").checked;
    if (!terms) {
      isValid = false;
      document.getElementById("termsError").textContent =
        "Bạn phải đồng ý với chính sách và điều khoản.";
    }

    // Redirect on successful validation
    if (isValid) {
      // Save user data to localStorage
      const userData = {
        fullName,
        email,
        password,
      };

      // Lưu vào localStorage
      // Cách 1: Lưu vào biến "user" để tương thích với code đăng nhập hiện tại
      localStorage.setItem("user", JSON.stringify(userData));

      // Cách 2 (khuyến nghị): Lưu vào mảng "users" để hỗ trợ nhiều người dùng
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      existingUsers.push(userData);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Use SweetAlert for success message
      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: "Chúc mừng! Tài khoản của bạn đã được tạo thành công.",
        showConfirmButton: true,
        confirmButtonText: "Đăng nhập ngay",
      }).then(() => {
        window.location.href = "../page/login.html"; // Redirect to login page after success
      });
    }
  });
});
