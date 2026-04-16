const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const mobileOverlay = document.getElementById("mobileOverlay");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const foodCards = document.querySelectorAll(".food-card");

const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");

let currentCategory = "all";
let cart = [];

// Initialize cart from localStorage
function initializeCart() {
  const savedCart = localStorage.getItem("quickbiteCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartCount();
}

// Save cart to localStorage
function saveCartToStorage() {
  localStorage.setItem("quickbiteCart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart count display
function updateCartCount() {
  const totalItems = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);
  cartCount.textContent = totalItems;
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

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    currentCategory = button.dataset.category;
    filterAndSearchItems();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", filterAndSearchItems);
}

function filterAndSearchItems() {
  const searchValue = searchInput.value.toLowerCase().trim();

  foodCards.forEach(function (card) {
    const foodName = card.dataset.name.toLowerCase();
    const category = card.dataset.category.toLowerCase();

    const matchesCategory =
      currentCategory === "all" || category === currentCategory;

    const matchesSearch = foodName.includes(searchValue);

    if (matchesCategory && matchesSearch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

foodCards.forEach(function (card) {
  const addButton = card.querySelector(".add-cart-btn");
  const name = card.dataset.name;
  const category = card.dataset.category;
  const price = Number(card.dataset.price);
  const image = card.querySelector("img").src;

  addButton.addEventListener("click", function () {
    addToCart({
      name: name,
      category: category,
      price: price,
      image: image
    });

    openCart();

    addButton.textContent = "Added ✓";
    setTimeout(function () {
      addButton.textContent = "Add to Cart";
    }, 1000);
  });
});

function addToCart(item) {
  const existingItem = cart.find(function (cartItem) {
    return cartItem.name === item.name;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  }

  saveCartToStorage();
  showAddedNotification();
}

// Show notification when item is added
function showAddedNotification() {
  // Visual feedback: the button text already shows "Added ✓"
}

// Cart button click - redirect to cart page
if (cartBtn) {
  cartBtn.addEventListener("click", function () {
    window.location.href = "cart.html";
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  initializeCart();
});