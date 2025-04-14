document.addEventListener("DOMContentLoaded", function () {
  // Get modal elements
  const modal = document.getElementById("product-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const addProductBtn = document.getElementById("add-product-btn");
  const closeModalBtn = document.getElementById("close-modal");
  const cancelBtn = document.getElementById("cancel-modal");
  const addBtn = document.getElementById("add-product");
  const requiredInputs = document.querySelectorAll(
    '.form-group input[type="text"].error'
  );
  const errorMessages = document.querySelectorAll(".error-message");

  // Initially hide error messages
  errorMessages.forEach((msg) => {
    msg.style.display = "none";
  });

  requiredInputs.forEach((input) => {
    input.classList.remove("error");
  });

  // Function to open modal
  function openModal() {
    modal.style.display = "flex";
    modalOverlay.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  }

  // Function to close modal
  function closeModal() {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
    document.body.style.overflow = "auto"; // Enable scrolling again
  }

  // Event listeners for opening and closing the modal
  addProductBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  // Stop propagation when clicking on the modal itself
  modal.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  // Add product button validation and action
  addBtn.addEventListener("click", function () {
    let hasError = false;

    // Only validate the first two inputs (product code and name)
    const productCodeInput = document.querySelector(
      ".form-row:nth-child(1) .form-group:first-child input"
    );
    const productNameInput = document.querySelector(
      ".form-row:nth-child(1) .form-group:last-child input"
    );
    const productCodeError = document.querySelector(
      ".form-row:nth-child(1) .form-group:first-child .error-message"
    );
    const productNameError = document.querySelector(
      ".form-row:nth-child(1) .form-group:last-child .error-message"
    );

    // Validate product code
    if (productCodeInput && productCodeInput.value.trim() === "") {
      productCodeInput.classList.add("error");
      if (productCodeError) productCodeError.style.display = "block";
      hasError = true;
    } else if (productCodeInput) {
      productCodeInput.classList.remove("error");
      if (productCodeError) productCodeError.style.display = "none";
    }

    // Validate product name
    if (productNameInput && productNameInput.value.trim() === "") {
      productNameInput.classList.add("error");
      if (productNameError) productNameError.style.display = "block";
      hasError = true;
    } else if (productNameInput) {
      productNameInput.classList.remove("error");
      if (productNameError) productNameError.style.display = "none";
    }

    if (!hasError) {
      // Form is valid, you can submit it here
      console.log("Form submitted");
      closeModal(); // Optionally close the modal after successful submission
    }
  });

  // Fixed avatar dropdown functionality
  const avatarContainer = document.querySelector(".avt");
  const avatar = document.getElementById("avatar");
  const dropdownMenu = document.getElementById("dropdown-menu");

  // Toggle dropdown when clicking avatar or its container
  avatarContainer.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

  // Close dropdown when clicking elsewhere
  document.addEventListener("click", function (event) {
    if (!avatarContainer.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });
});

function confirmLogout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    window.location.href = "../page/login.html";
  }
}
