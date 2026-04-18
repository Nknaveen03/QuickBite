const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const mobileOverlay = document.getElementById('mobileOverlay');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const offersGrid = document.getElementById('offersGrid');

const dishes = [
  { name: 'Pepperoni Pizza', price: 239, image: 'images/Pizza.jpg', desc: '20% OFF - Limited time', originalPrice: 299 },
  { name: 'Cheese Burger', price: 159, image: 'images/Burgers.jpg', desc: 'Buy 1 Get 1 Free Fries', originalPrice: 199 },
  { name: 'Crispy Chicken', price: 199, image: 'images/biriyani.jpg', desc: 'Combo Deal Save 20%', originalPrice: 249 },
  { name: 'White Pasta', price: 143, image: 'images/pizzahut.jpg', desc: 'Flat ₹50 OFF', originalPrice: 179 },
  { name: 'Chocolate Cake', price: 120, image: 'images/desserts.jpg', desc: 'Buy 2 Get 1 Free', originalPrice: 150 },
  { name: 'Oreo Shake', price: 112, image: 'images/beverages.jpg', desc: '₹30 OFF on drinks', originalPrice: 140 },
  { name: 'Margherita Pizza', price: 215, image: 'images/Pizza.jpg', desc: '20% OFF Pizza', originalPrice: 269 },
  { name: 'Chicken Burger', price: 175, image: 'images/Burgers.jpg', desc: 'Meal Combo ₹99', originalPrice: 219 }
];

function loadCartCount() {
  const savedCart = JSON.parse(localStorage.getItem('quickbiteCart') || '[]');
  const totalItems = savedCart.reduce(function (sum, item) {
    return sum + (item.quantity || 1);
  }, 0);

  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

function openMenu() {
  if (navLinks) {
    navLinks.classList.add('show');
  }
  if (menuToggle) {
    menuToggle.classList.add('active');
  }
  if (mobileOverlay) {
    mobileOverlay.classList.add('show');
  }
}

function closeMenu() {
  if (navLinks) {
    navLinks.classList.remove('show');
  }
  if (menuToggle) {
    menuToggle.classList.remove('active');
  }
  if (mobileOverlay) {
    mobileOverlay.classList.remove('show');
  }
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', function () {
    if (navLinks.classList.contains('show')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

if (mobileOverlay) {
  mobileOverlay.addEventListener('click', closeMenu);
}

if (navLinks) {
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
}

if (cartBtn) {
  cartBtn.addEventListener('click', function () {
    window.location.href = 'cart.html';
  });
}

function renderOffers() {
  if (!offersGrid) return;

  offersGrid.innerHTML = dishes.map(function (dish, index) {
    return `
      <div class="food-card">
        <div class="offer-badge">${dish.desc}</div>
        <div class="food-image-wrap">
          <img src="${dish.image}" alt="${dish.name}">
        </div>
        <div class="food-content">
          <h3>${dish.name}</h3>
          <div class="price-group">
            <span class="price">₹${dish.price}</span>
            <span class="original-price">₹${dish.originalPrice}</span>
          </div>
          <p>${dish.desc}</p>
          <div class="btn-group">
            <button type="button" class="details-btn" onclick="window.location.href='menu.html'">Details</button>
            <button type="button" class="add-cart-btn" onclick="addToCart(${index}, this)">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function addToCart(index, button) {
  const selectedDish = dishes[index];
  let cartData = JSON.parse(localStorage.getItem('quickbiteCart') || '[]');

  const existingItem = cartData.find(function (item) {
    return item.name === selectedDish.name;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartData.push({
      name: selectedDish.name,
      price: selectedDish.price,
      image: selectedDish.image,
      quantity: 1
    });
  }

  localStorage.setItem('quickbiteCart', JSON.stringify(cartData));
  loadCartCount();

  if (button) {
    const oldText = button.textContent;
    button.textContent = 'Added! ✓';
    button.disabled = true;

    setTimeout(function () {
      button.textContent = oldText;
      button.disabled = false;
    }, 1400);
  }
}

loadCartCount();
renderOffers();

window.addToCart = addToCart;