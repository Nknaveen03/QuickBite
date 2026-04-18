let orderData = null;

function initializeCheckout() {
  loadOrderSummary();
  setupFormValidation();
  setupEventListeners();
}

function loadOrderSummary() {
  const summary = sessionStorage.getItem('orderSummary');

  if (!summary) {
    window.location.href = 'menu.html';
    return;
  }

  orderData = JSON.parse(summary);

  const orderItems = document.getElementById('orderItems');
  if (!orderItems) return;

  orderItems.innerHTML = orderData.cart
    .map(function (item) {
      return `
        <div class="order-item-mini">
          <div class="order-item-mini-name">${item.name}</div>
          <div class="order-item-mini-qty">Qty: ${item.quantity}</div>
          <div class="order-item-mini-price">₹${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `;
    })
    .join('');

  const totals = orderData.totals;
  document.getElementById('summarySubtotal').textContent = `₹${totals.subtotal.toFixed(2)}`;
  document.getElementById('summaryDiscount').textContent = `-₹${totals.discount.toFixed(2)}`;
  document.getElementById('summaryDelivery').textContent = `₹${totals.delivery.toFixed(2)}`;
  document.getElementById('summaryTax').textContent = `₹${totals.tax.toFixed(2)}`;
  document.getElementById('summaryTotal').textContent = `₹${totals.total.toFixed(2)}`;
}

function setupFormValidation() {
  const form = document.getElementById('checkoutForm');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors();

    if (validateForm()) {
      processOrder();
    }
  });

  document.getElementById('fullName').addEventListener('blur', validateName);
  document.getElementById('email').addEventListener('blur', validateEmail);
  document.getElementById('phone').addEventListener('blur', validatePhone);
  document.getElementById('address').addEventListener('blur', validateAddress);
}

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

  if (!/^[a-zA-Z\s]+$/.test(fullName)) {
    setError('fullName', nameError, 'Name should only contain letters');
    return false;
  }

  clearError('fullName', nameError);
  return true;
}

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

function validateForm() {
  return validateName() && validateEmail() && validatePhone() && validateAddress();
}

function setError(fieldId, errorElement, message) {
  const input = document.getElementById(fieldId);
  if (input) input.classList.add('error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

function clearError(fieldId, errorElement) {
  const input = document.getElementById(fieldId);
  if (input) input.classList.remove('error');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
}

function clearAllErrors() {
  document.querySelectorAll('.error-message').forEach(function (el) {
    el.textContent = '';
    el.classList.remove('show');
  });

  document.querySelectorAll('input, textarea').forEach(function (el) {
    el.classList.remove('error');
  });
}

function processOrder() {
  const paymentMethodElement = document.querySelector('input[name="paymentMethod"]:checked');

  const formData = {
    fullName: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    paymentMethod: paymentMethodElement ? paymentMethodElement.value : 'cod',
    specialInstructions: document.getElementById('instructions').value.trim(),
    orderTime: new Date().toLocaleString(),
    orderTotal: orderData.totals.total
  };

  const orders = JSON.parse(localStorage.getItem('quickbiteOrders') || '[]');
  const orderId = `#QB-${Date.now().toString().slice(-6)}`;

  orders.push({
    orderId: orderId,
    ...formData,
    items: orderData.cart,
    totals: orderData.totals
  });

  localStorage.setItem('quickbiteOrders', JSON.stringify(orders));
  localStorage.removeItem('quickbiteCart');
  sessionStorage.removeItem('orderSummary');

  showSuccessModal(orderId, formData.paymentMethod);
}

function showSuccessModal(orderId, paymentMethod) {
  const successModal = document.getElementById('successModal');
  const orderIdElement = document.getElementById('orderId');
  const successMessage = document.getElementById('successMessage');

  const paymentText = {
    cod: 'Pay on Delivery',
    upi: 'UPI Payment',
    card: 'Card Payment'
  };

  if (orderIdElement) {
    orderIdElement.textContent = orderId;
  }

  if (successMessage) {
    successMessage.textContent = `Order confirmed with ${paymentText[paymentMethod]} • Estimated delivery: 30-40 minutes`;
  }

  if (successModal) {
    successModal.classList.add('show');
  }

  setTimeout(function () {
    window.location.href = 'menu.html';
  }, 4000);
}

function setupEventListeners() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('show');
      menuToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('show');
        menuToggle.classList.remove('active');
      });
    });
  }

  const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
  paymentOptions.forEach(function (option) {
    option.addEventListener('change', function () {
      console.log('Payment method selected:', this.value);
    });
  });

  const continueBtn = document.querySelector('.continue-btn');
  if (continueBtn) {
    continueBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'menu.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', initializeCheckout);