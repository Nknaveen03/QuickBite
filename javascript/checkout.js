// Checkout functionality
let orderData = null;

// Initialize checkout
function initializeCheckout() {
  loadOrderSummary();
  setupFormValidation();
  setupEventListeners();
}

// Load order summary from cart page
function loadOrderSummary() {
  const summary = sessionStorage.getItem('orderSummary');

  if (!summary) {
    // No cart data, redirect to menu
    window.location.href = 'menu.html';
    return;
  }

  orderData = JSON.parse(summary);

  // Populate order items
  const orderItems = document.getElementById('orderItems');
  orderItems.innerHTML = orderData.cart
    .map(
      item => `
      <div class="order-item-mini">
        <div class="order-item-mini-name">${item.name}</div>
        <div class="order-item-mini-qty">Qty: ${item.quantity}</div>
        <div class="order-item-mini-price">₹${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `
    )
    .join('');

  // Populate summary
  const totals = orderData.totals;
  document.getElementById('summarySubtotal').textContent = `₹${totals.subtotal.toFixed(2)}`;
  document.getElementById('summaryDiscount').textContent = `-₹${totals.discount.toFixed(2)}`;
  document.getElementById('summaryDelivery').textContent = `₹${totals.delivery.toFixed(2)}`;
  document.getElementById('summaryTax').textContent = `₹${totals.tax.toFixed(2)}`;
  document.getElementById('summaryTotal').textContent = `₹${totals.total.toFixed(2)}`;
}

// Setup form validation
function setupFormValidation() {
  const form = document.getElementById('checkoutForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear all error messages
    clearAllErrors();

    // Validate form
    if (validateForm()) {
      processOrder();
    }
  });

  // Real-time validation
  document.getElementById('fullName').addEventListener('blur', validateName);
  document.getElementById('email').addEventListener('blur', validateEmail);
  document.getElementById('phone').addEventListener('blur', validatePhone);
  document.getElementById('address').addEventListener('blur', validateAddress);
}

// Validate full name
function validateName() {
  const fullName = document.getElementById('fullName').value.trim();
  const nameError = document.getElementById('nameError');

  if (!fullName) {
    setError('fullName', nameError, 'Name is required');
    return false;
  }

  if (fullName.length < 2) {
    setError('fullName', nameError, 'Name must be at least 2 characters');
    return false;
  }

  if (!/^[a-zA-Z\s]*$/.test(fullName)) {
    setError('fullName', nameError, 'Name should only contain letters');
    return false;
  }

  clearError('fullName', nameError);
  return true;
}

// Validate email
function validateEmail() {
  const email = document.getElementById('email').value.trim();
  const emailError = document.getElementById('emailError');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    setError('email', emailError, 'Email is required');
    return false;
  }

  if (!emailRegex.test(email)) {
    setError('email', emailError, 'Please enter a valid email');
    return false;
  }

  clearError('email', emailError);
  return true;
}

// Validate phone
function validatePhone() {
  const phone = document.getElementById('phone').value.trim();
  const phoneError = document.getElementById('phoneError');

  if (!phone) {
    setError('phone', phoneError, 'Phone number is required');
    return false;
  }

  if (!/^\d{10}$/.test(phone)) {
    setError('phone', phoneError, 'Phone must be exactly 10 digits');
    return false;
  }

  clearError('phone', phoneError);
  return true;
}

// Validate address
function validateAddress() {
  const address = document.getElementById('address').value.trim();
  const addressError = document.getElementById('addressError');

  if (!address) {
    setError('address', addressError, 'Address is required');
    return false;
  }

  if (address.length < 10) {
    setError('address', addressError, 'Address must be at least 10 characters');
    return false;
  }

  clearError('address', addressError);
  return true;
}

// Validate entire form
function validateForm() {
  return (
    validateName() &&
    validateEmail() &&
    validatePhone() &&
    validateAddress()
  );
}

// Set error
function setError(fieldId, errorElement, message) {
  const input = document.getElementById(fieldId);
  input.classList.add('error');
  errorElement.textContent = message;
  errorElement.classList.add('show');
}

// Clear error
function clearError(fieldId, errorElement) {
  const input = document.getElementById(fieldId);
  input.classList.remove('error');
  errorElement.textContent = '';
  errorElement.classList.remove('show');
}

// Clear all errors
function clearAllErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.classList.remove('show');
  });
  document.querySelectorAll('input, textarea').forEach(el => {
    el.classList.remove('error');
  });
}

// Process order
function processOrder() {
  const formData = {
    fullName: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
    specialInstructions: document.getElementById('instructions').value.trim(),
    orderTime: new Date().toLocaleString(),
    orderTotal: orderData.totals.total
  };

  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('quickbiteOrders')) || [];
  const orderId = `#QB-${Date.now().toString().slice(-6)}`;

  orders.push({
    orderId: orderId,
    ...formData,
    items: orderData.cart,
    totals: orderData.totals
  });

  localStorage.setItem('quickbiteOrders', JSON.stringify(orders));

  // Clear cart and session storage
  localStorage.removeItem('quickbiteCart');
  sessionStorage.removeItem('orderSummary');

  // Show success modal
  showSuccessModal(orderId, formData.paymentMethod);
}

// Show success modal
function showSuccessModal(orderId, paymentMethod) {
  const successModal = document.getElementById('successModal');
  const orderIdElement = document.getElementById('orderId');

  orderIdElement.textContent = orderId;

  const paymentText = {
    cod: 'Pay on Delivery',
    upi: 'UPI Payment',
    card: 'Card Payment'
  };

  document.getElementById('successMessage').textContent = `Order confirmed with ${paymentText[paymentMethod]} • Estimated delivery: 30-40 minutes`;

  successModal.classList.add('show');

  // Redirect after 3 seconds
  setTimeout(() => {
    window.location.href = 'menu.html';
  }, 4000);
}

// Setup event listeners
function setupEventListeners() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('show');
      menuToggle.classList.toggle('active');
    });
  }

  // Payment method selection
  const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
  paymentOptions.forEach(option => {
    option.addEventListener('change', function () {
      console.log('Payment method selected:', this.value);
    });
  });

  // Close modal when clicking continue button
  const continueBtn = document.querySelector('.continue-btn');
  if (continueBtn) {
    continueBtn.addEventListener('click', function () {
      window.location.href = 'menu.html';
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeCheckout);
