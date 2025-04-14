document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  // Clear error when typing in input field
  emailInput.addEventListener("input", function () {
    emailError.textContent = "";
    emailInput.classList.remove("error");
  });

  passwordInput.addEventListener("input", function () {
    passwordError.textContent = "";
    passwordInput.classList.remove("error");
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let hasError = false;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Clear previous errors
    emailError.textContent = "";
    passwordError.textContent = "";
    emailInput.classList.remove("error");
    passwordInput.classList.remove("error");

    // Validate email
    if (!email) {
      emailError.textContent = "Email không được để trống";
      emailInput.classList.add("error");
      hasError = true;
    }

    // Validate password
    if (!password) {
      passwordError.textContent = "Mật khẩu không được để trống";
      passwordInput.classList.add("error");
      hasError = true;
    }

    if (hasError) {
      return false;
    }

    // Check credentials
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === password
    ) {
      window.location.href = "../page/category-manager.html";
    } else {
      emailError.textContent = "Email hoặc Mật khẩu không đúng";
      passwordError.textContent = "Email hoặc Mật khẩu không đúng";
      emailInput.classList.add("error");
      passwordInput.classList.add("error");
    }
  });
});
