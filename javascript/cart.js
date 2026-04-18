const COUPONS = {
  SAVE50: { type: 'fixed', value: 50, description: 'Fixed ₹50 discount' },
  SAVE100: { type: 'fixed', value: 100, description: 'Fixed ₹100 discount' },
  FOOD10: { type: 'percentage', value: 10, description: '10% off on food' },
  FOOD20: { type: 'percentage', value: 20, description: '20% off on food' },
  WELCOME: { type: 'fixed', value: 75, description: 'New user - ₹75 off' },
  QUICKBITE: { type: 'percentage', value: 15, description: '15% off - QuickBite special' }
};

const DELIVERY_CHARGE = 40;
const TAX_PERCENTAGE = 5;
const COUPON_ORDER = ['SAVE50', 'SAVE100', 'FOOD10', 'FOOD20', 'WELCOME', 'QUICKBITE'];

let cart = [];
let appliedCoupon = null;

function initializeCart() {
  const savedCart = localStorage.getItem('quickbiteCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  normalizeCartItems();
  renderCart();
  updateCartCount();
}

function normalizeCartItems() {
  cart = cart.map(function (item) {
    return {
      ...item,
      image: item.image || item.img || 'images/default-food.jpg',
      quantity: item.quantity || 1
    };
  });

  localStorage.setItem('quickbiteCart', JSON.stringify(cart));
}

function saveCart() {
  localStorage.setItem('quickbiteCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);

  const cartCount = document.getElementById('cartCount');
  const mobileCartCount = document.getElementById('mobileCartCount');

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  if (mobileCartCount) {
    mobileCartCount.textContent = totalItems;
  }
}

function renderAvailableCoupons() {
  const offersContainer = document.getElementById('availableCoupons');
  if (!offersContainer) return;

  offersContainer.innerHTML = COUPON_ORDER
    .filter(function (code) {
      return Boolean(COUPONS[code]);
    })
    .map(function (code) {
      const coupon = COUPONS[code];
      const offerLabel =
        coupon.type === 'fixed' ? `₹${coupon.value} off` : `${coupon.value}% off`;

      return `
        <div class="offer-card">
          <div class="offer-meta">
            <div class="offer-code">
              <i class="fa-solid fa-ticket"></i>
              <span>${code}</span>
            </div>
            <p>${coupon.description} • ${offerLabel}</p>
          </div>
          <button class="use-offer-btn" type="button" data-coupon="${code}">Use code</button>
        </div>
      `;
    })
    .join('');

  offersContainer.querySelectorAll('.use-offer-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      const couponInput = document.getElementById('couponInput');
      if (!couponInput) return;

      couponInput.value = button.dataset.coupon;
      applyCoupon();
      couponInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function renderCart() {
  const cartItemsList = document.getElementById('cartItemsList');
  const emptyCartMessage = document.getElementById('emptyCartMessage');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!cartItemsList || !emptyCartMessage || !checkoutBtn) return;

  if (cart.length === 0) {
    cartItemsList.style.display = 'none';
    emptyCartMessage.style.display = 'flex';
    checkoutBtn.classList.add('is-disabled');
    updateTotals();
    return;
  }

  cartItemsList.style.display = 'flex';
  emptyCartMessage.style.display = 'none';
  checkoutBtn.classList.remove('is-disabled');

  cartItemsList.innerHTML = cart
    .map(function (item, index) {
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
            <div class="quantity-control">
              <button class="qty-btn" onclick="decreaseQuantity(${index})" aria-label="Decrease quantity">−</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="qty-btn" onclick="increaseQuantity(${index})" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
          <button class="remove-btn" onclick="removeItem(${index})" aria-label="Remove item">
            <i class="fa-solid fa-trash"></i> Remove
          </button>
        </div>
      `;
    })
    .join('');

  updateTotals();
}

function increaseQuantity(index) {
  if (!cart[index]) return;
  cart[index].quantity += 1;
  saveCart();
  renderCart();
}

function decreaseQuantity(index) {
  if (!cart[index]) return;

  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    removeItem(index);
    return;
  }

  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function calculateTotals() {
  const subtotal = cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  let discount = 0;

  if (appliedCoupon) {
    const coupon = COUPONS[appliedCoupon];
    if (coupon) {
      if (coupon.type === 'fixed') {
        discount = coupon.value;
      } else if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
      }

      discount = Math.min(discount, subtotal);
    }
  }

  const delivery = cart.length > 0 ? DELIVERY_CHARGE : 0;
  const afterDiscount = subtotal - discount;
  const tax = (afterDiscount * TAX_PERCENTAGE) / 100;
  const total = afterDiscount + delivery + tax;

  return {
    subtotal: Math.max(0, subtotal),
    discount: Math.max(0, discount),
    delivery,
    tax: Math.max(0, tax),
    total: Math.max(0, total),
    afterDiscount: Math.max(0, afterDiscount)
  };
}

function updateTotals() {
  const totals = calculateTotals();

  const subtotal = document.getElementById('subtotal');
  const discount = document.getElementById('discount');
  const delivery = document.getElementById('delivery');
  const tax = document.getElementById('tax');
  const totalAmount = document.getElementById('totalAmount');

  if (subtotal) subtotal.textContent = `₹${totals.subtotal.toFixed(2)}`;
  if (discount) discount.textContent = `-₹${totals.discount.toFixed(2)}`;
  if (delivery) delivery.textContent = `₹${totals.delivery.toFixed(2)}`;
  if (tax) tax.textContent = `₹${totals.tax.toFixed(2)}`;
  if (totalAmount) totalAmount.textContent = `₹${totals.total.toFixed(2)}`;

  sessionStorage.setItem(
    'orderSummary',
    JSON.stringify({
      cart: cart,
      totals: totals,
      appliedCoupon: appliedCoupon
    })
  );
}

function applyCoupon() {
  const couponInput = document.getElementById('couponInput');
  if (!couponInput) return;

  const code = couponInput.value.trim().toUpperCase();

  if (!code) {
    showCouponMessage('Please enter a coupon code', 'error');
    return;
  }

  if (COUPONS[code]) {
    appliedCoupon = code;
    showCouponMessage(`✓ Coupon applied! ${COUPONS[code].description}`, 'success');
  } else {
    appliedCoupon = null;
    showCouponMessage('Invalid coupon code', 'error');
  }

  updateTotals();
}

function removeCoupon() {
  appliedCoupon = null;

  const couponInput = document.getElementById('couponInput');
  const couponMessage = document.getElementById('couponMessage');

  if (couponInput) couponInput.value = '';
  if (couponMessage) {
    couponMessage.textContent = '';
    couponMessage.className = 'coupon-message';
  }

  updateTotals();
}

function showCouponMessage(message, type) {
  const couponMessage = document.getElementById('couponMessage');
  if (!couponMessage) return;

  couponMessage.textContent = message;
  couponMessage.className = `coupon-message ${type}`;

  if (type === 'error') {
    setTimeout(function () {
      couponMessage.textContent = '';
      couponMessage.className = 'coupon-message';
    }, 3000);
  }
}

function openMenu() {
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('menuToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (navLinks) navLinks.classList.add('show');
  if (menuToggle) menuToggle.classList.add('active');
  if (mobileOverlay) mobileOverlay.classList.add('show');
}

function closeMenu() {
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('menuToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (navLinks) navLinks.classList.remove('show');
  if (menuToggle) menuToggle.classList.remove('active');
  if (mobileOverlay) mobileOverlay.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function () {
  initializeCart();
  renderAvailableCoupons();

  const applyCouponBtn = document.getElementById('applyCouponBtn');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', applyCoupon);
  }

  const couponInput = document.getElementById('couponInput');
  if (couponInput) {
    couponInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCoupon();
      }
    });
  }

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      if (navLinks.classList.contains('show')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', function () {
      window.location.href = 'cart.html';
    });
  }
});

window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;
window.applyCoupon = applyCoupon;
window.removeCoupon = removeCoupon;