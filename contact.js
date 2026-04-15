const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const messageError = document.getElementById("messageError");

const submitBtn = document.getElementById("submitBtn");

const typedCount = document.getElementById("typedCount");
const maxCount = document.getElementById("maxCount");
const remainingCount = document.getElementById("remainingCount");

const popupOverlay = document.getElementById("popupOverlay");
const closePopup = document.getElementById("closePopup");

const maxMessageLength = 200;

/* Mobile menu */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const mobileOverlay = document.getElementById("mobileOverlay");

if (menuToggle && navLinks && mobileOverlay) {
  menuToggle.addEventListener("click", function () {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("show");
    mobileOverlay.classList.toggle("show");
  });

  mobileOverlay.addEventListener("click", function () {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("show");
    mobileOverlay.classList.remove("show");
  });

  var navItems = navLinks.querySelectorAll("a");

  navItems.forEach(function (link) {
    link.addEventListener("click", function () {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("show");
      mobileOverlay.classList.remove("show");
    });
  });
}

/* Character counter */
if (maxCount) {
  maxCount.textContent = maxMessageLength;
}

function updateCharacterCounter() {
  let currentLength = messageInput.value.length;

  if (currentLength > maxMessageLength) {
    messageInput.value = messageInput.value.substring(0, maxMessageLength);
    currentLength = maxMessageLength;
  }

  typedCount.textContent = currentLength;
  remainingCount.textContent = maxMessageLength - currentLength;
}

/* Validation functions */
function setError(input, errorElement, message) {
  input.classList.add("input-error");
  input.classList.remove("valid-input");
  errorElement.textContent = message;
}

function setSuccess(input, errorElement) {
  input.classList.remove("input-error");
  input.classList.add("valid-input");
  errorElement.textContent = "";
}

function validateName() {
  let value = nameInput.value.trim();

  if (value === "") {
    setError(nameInput, nameError, "Name is required");
    return false;
  }

  if (value.length < 3) {
    setError(nameInput, nameError, "Name must be at least 3 characters");
    return false;
  }

  setSuccess(nameInput, nameError);
  return true;
}

function validateEmail() {
  let value = emailInput.value.trim();
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    setError(emailInput, emailError, "Email is required");
    return false;
  }

  if (!emailPattern.test(value)) {
    setError(emailInput, emailError, "Enter a valid email address");
    return false;
  }

  setSuccess(emailInput, emailError);
  return true;
}

function validatePhone() {
  let value = phoneInput.value.trim();
  var phonePattern = /^[0-9]{10}$/;

  if (value === "") {
    setError(phoneInput, phoneError, "Phone number is required");
    return false;
  }

  if (!phonePattern.test(value)) {
    setError(phoneInput, phoneError, "Enter a valid 10-digit phone number");
    return false;
  }

  setSuccess(phoneInput, phoneError);
  return true;
}

function validateMessage() {
  let value = messageInput.value.trim();

  if (value === "") {
    setError(messageInput, messageError, "Message is required");
    return false;
  }

  if (value.length < 10) {
    setError(messageInput, messageError, "Message must be at least 10 characters");
    return false;
  }

  if (value.length > maxMessageLength) {
    setError(messageInput, messageError, "Message exceeded maximum limit");
    return false;
  }

  setSuccess(messageInput, messageError);
  return true;
}

function checkFormValidity() {
  let isNameValid = validateName();
  let isEmailValid = validateEmail();
  let isPhoneValid = validatePhone();
  let isMessageValid = validateMessage();

  submitBtn.disabled = !(isNameValid && isEmailValid && isPhoneValid && isMessageValid);
}

/* Input events */
nameInput.addEventListener("input", function () {
  validateName();
  checkFormValidity();
});

emailInput.addEventListener("input", function () {
  validateEmail();
  checkFormValidity();
});

phoneInput.addEventListener("input", function () {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
  validatePhone();
  checkFormValidity();
});

messageInput.addEventListener("input", function () {
  updateCharacterCounter();
  validateMessage();
  checkFormValidity();
});

/* Submit */
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isNameValid = validateName();
    let isEmailValid = validateEmail();
    let isPhoneValid = validatePhone();
    let isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
      successMessage.textContent = "Submitted successfully!";
      successMessage.style.color = "#ffe7a0";

      popupOverlay.classList.add("show");

      contactForm.reset();

      nameInput.classList.remove("valid-input");
      emailInput.classList.remove("valid-input");
      phoneInput.classList.remove("valid-input");
      messageInput.classList.remove("valid-input");

      nameError.textContent = "";
      emailError.textContent = "";
      phoneError.textContent = "";
      messageError.textContent = "";

      updateCharacterCounter();
      submitBtn.disabled = true;
    } else {
      successMessage.textContent = "Please fix the errors before submitting.";
      successMessage.style.color = "#ffd2d2";
      submitBtn.disabled = true;
    }
  });
}

/* Popup close */
if (closePopup) {
  closePopup.addEventListener("click", function () {
    popupOverlay.classList.remove("show");
  });
}

if (popupOverlay) {
  popupOverlay.addEventListener("click", function (e) {
    if (e.target === popupOverlay) {
      popupOverlay.classList.remove("show");
    }
  });
}

/* Initial state */
updateCharacterCounter();
submitBtn.disabled = true;