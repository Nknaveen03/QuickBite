const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const mobileOverlay = document.getElementById('mobileOverlay');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const offersGrid = document.getElementById('offersGrid');

let cart = [];

// Simple offers dishes
const dishes = [
  { name: 'Pepperoni Pizza', price: 239, img: 'images/Pizza.jpg', desc: '20% OFF - Limited time', originalPrice: 299 },
  { name: 'Cheese Burger', price: 159, img: 'images/Burgers.jpg', desc: 'Buy 1 Get 1 Free Fries', originalPrice: 199 },
  { name: 'Crispy Chicken', price: 199, img: 'images/biriyani.jpg', desc: 'Combo Deal Save 20%', originalPrice: 249 },
  { name: 'White Pasta', price: 143, img: 'images/pizzahut.jpg', desc: 'Flat ₹50 OFF', originalPrice: 179 },
  { name: 'Chocolate Cake', price: 120, img: 'images/desserts.jpg', desc: 'Buy 2 Get 1 Free', originalPrice: 150 },
  { name: 'Oreo Shake', price: 112, img: 'images/beverages.jpg', desc: '₹30 OFF on drinks', originalPrice: 140 },
  { name: 'Margherita Pizza', price: 215, img: 'images/Pizza.jpg', desc: '20% OFF Pizza', originalPrice: 269 },
  { name: 'Chicken Burger', price: 175, img: 'images/Burgers.jpg', desc: 'Meal Combo ₹99', originalPrice: 219 }
];

// Load cart count
function loadCartCount() {
  const saved = localStorage.getItem('quickbiteCart');
  const total = saved ? JSON.parse(saved).reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
  cartCount.textContent = total;
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("show");
    menuToggle.classList.toggle("active");

    if (mobileOverlay) {
      mobileOverlay.classList.toggle("show");
    }
  });
}

if (mobileOverlay) {
  mobileOverlay.addEventListener("click", function () {
    navLinks.classList.remove("show");
    menuToggle.classList.remove("active");
    mobileOverlay.classList.remove("show");
  });
}
// Navbar mobile toggle
// menuToggle?.addEventListener('click', () => {
//   navLinks.classList.toggle('show');
//   menuToggle.classList.toggle('active');
//   mobileOverlay.classList.toggle('show');
// });
// menuToggle?.addEventListener('click', () => {
//   if (navLinks.classList.contains('show')) {
//     menuToggle.innerHTML = '<span></span><span></span><span></span>'; // hamburger
//   } else {
//     menuToggle.innerHTML = '<i class="fa-solid fa-times"></i>'; // X
//   }
// });
// mobileOverlay?.addEventListener('click', () => {
//   navLinks.classList.remove('show');
//   menuToggle.classList.remove('active');
//   mobileOverlay.classList.remove('show');
// });

// Cart btn to cart.html
cartBtn?.addEventListener('click', () => location.href = 'cart.html');

// Render all cards (static)
function renderOffers() {
  offersGrid.innerHTML = dishes.map(d => `
    <div class="food-card">
      <div class="card-inner">
        <div class="offer-badge">${d.desc}</div>
        <div class="food-image-wrap">
          <img src="${d.img}" alt="${d.name}">
        </div>
        <div class="food-content">
          <h3>${d.name}</h3>
          <div class="price-group">
            <span class="price">₹${d.price}</span>
            <span class="original-price">₹${d.originalPrice}</span>
          </div>
          <p>${d.desc}</p>
          <div class="btn-group">
          <button type="button" class="details-btn" onclick="window.location.href='menu.html'">Details</button>
            <button class="add-cart-btn" onclick="addToCart('${d.name}', ${d.price}, '${d.img}')">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Add to cart simple
function addToCart(name, price, img) {
  let cartData = JSON.parse(localStorage.getItem('quickbiteCart') || '[]');
  const item = cartData.find(i => i.name === name);
  if (item) item.quantity += 1;
  else cartData.push({ name, price, img, quantity: 1 });
  localStorage.setItem('quickbiteCart', JSON.stringify(cartData));
  loadCartCount();
  event.target.textContent = 'Added! ✓';
  setTimeout(() => event.target.textContent = 'Add to Cart', 1500);
}

// Init
loadCartCount();
renderOffers();

