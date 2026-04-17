const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const mobileOverlay = document.getElementById("mobileOverlay");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const foodCards = document.querySelectorAll(".food-card");

const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartSidebar = document.getElementById("cartSidebar");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

let currentCategory = "all";
let cart = [];

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

  updateCartUI();
}

function updateCartUI() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    cartCount.textContent = "0";
    cartTotal.textContent = "₹0";
    return;
  }

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(function (item) {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <div class="cart-item-controls">
          <button class="qty-btn decrease">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn increase">+</button>
        </div>
      </div>
      <button class="remove-btn">Remove</button>
    `;

    const increaseBtn = cartItem.querySelector(".increase");
    const decreaseBtn = cartItem.querySelector(".decrease");
    const removeBtn = cartItem.querySelector(".remove-btn");

    increaseBtn.addEventListener("click", function () {
      item.quantity += 1;
      updateCartUI();
    });

    decreaseBtn.addEventListener("click", function () {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart = cart.filter(function (cartItemData) {
          return cartItemData.name !== item.name;
        });
      }
      updateCartUI();
    });

    removeBtn.addEventListener("click", function () {
      cart = cart.filter(function (cartItemData) {
        return cartItemData.name !== item.name;
      });
      updateCartUI();
    });

    cartItemsContainer.appendChild(cartItem);
  });

  cartCount.textContent = totalItems;
  cartTotal.textContent = "₹" + totalPrice;
}

function openCart() {
  cartSidebar.classList.add("open");
  cartBackdrop.classList.add("show");
}

function closeCartSidebar() {
  cartSidebar.classList.remove("open");
  cartBackdrop.classList.remove("show");
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartSidebar);
cartBackdrop.addEventListener("click", closeCartSidebar);