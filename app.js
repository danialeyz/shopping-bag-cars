// Common elements (may be null on some pages)
const openShopping = document.querySelector(".shopping");
const closeShopping = document.querySelector(".closeShopping");
const list = document.querySelector(".list");
const listCard = document.querySelector(".listCard");
const body = document.querySelector("body");
const total = document.querySelector(".total");
const quantity = document.querySelector(".quantity");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const sortSelect = document.querySelector("#sortSelect");
const clearCartButton = document.querySelector("#clearCart");
const cartBackdrop = document.querySelector(".cart-backdrop");
const resultsCountEl = document.querySelector("#resultsCount");
const currentPage = body.dataset.page || "collection";

// Product detail modal elements
const productModal = document.querySelector(".product-modal");
const productModalBackdrop = document.querySelector(".product-modal-backdrop");
const modalImage = document.querySelector(".product-modal-image");
const modalTag = document.querySelector(".product-modal-tag");
const modalBrand = document.querySelector(".product-modal-brand");
const modalName = document.querySelector(".product-modal-name");
const modalDesc = document.querySelector(".product-modal-desc");
const modalSpecs = productModal
  ? productModal.querySelector(".product-modal-specs")
  : null;
const modalPriceMain = productModal
  ? productModal.querySelector(".price-main")
  : null;
const modalPriceNote = productModal
  ? productModal.querySelector(".price-note")
  : null;
const modalAddButton = document.querySelector(".product-modal-add");
const modalCloseButton = document.querySelector(".product-modal-close");

// Compare UI elements (only exist on collection / garage pages)
const compareBar = document.querySelector("#compareBar");
const compareCountEl = document.querySelector("#compareCount");
const openCompareBtn = document.querySelector("#openCompare");
const compareModal = document.querySelector(".compare-modal");
const compareBackdrop = document.querySelector(".compare-backdrop");
const compareModalClose = document.querySelector(".compare-modal-close");
const compareModalBody = compareModal
  ? compareModal.querySelector(".compare-modal-body")
  : null;

// Data: luxury cars
const products = [
  {
    id: 1,
    name: "Ghost Black Badge",
    brand: "Rolls-Royce",
    image: "1.png",
    price: 420000,
    category: "Sedan",
    power: "592 hp",
    zeroToHundred: "4.6 s",
    drivetrain: "V12 · AWD",
    seats: "4 seats",
    origin: "Goodwood, UK",
    description:
      "The Ghost Black Badge pairs understated presence with formidable torque, engineered for effortless cross-continental cruising.",
  },
  {
    id: 2,
    name: "Cullinan Black Badge",
    brand: "Rolls-Royce",
    image: "2.png",
    price: 450000,
    category: "SUV",
    power: "591 hp",
    zeroToHundred: "4.9 s",
    drivetrain: "V12 · AWD",
    seats: "4–5 seats",
    origin: "Goodwood, UK",
    description:
      "A high-riding Rolls-Royce with genuine all-terrain capability, finished with the darkest interpretation of the marque.",
  },
  {
    id: 3,
    name: "AMG GT Black Series",
    brand: "Mercedes-AMG",
    image: "3.png",
    price: 325000,
    category: "Coupe",
    power: "720 hp",
    zeroToHundred: "3.2 s",
    drivetrain: "V8 · RWD",
    seats: "2 seats",
    origin: "Affalterbach, DE",
    description:
      "Track-focused aero, a handmade V8 and race-derived suspension make this one of AMG’s most serious driver’s cars.",
  },
  {
    id: 4,
    name: "Urus Performante",
    brand: "Lamborghini",
    image: "4.png",
    price: 260000,
    category: "SUV",
    power: "666 hp",
    zeroToHundred: "3.3 s",
    drivetrain: "V8 · AWD",
    seats: "4–5 seats",
    origin: "Sant’Agata Bolognese, IT",
    description:
      "Sharper, lighter and louder than the standard Urus, the Performante brings supercar attitude to everyday usability.",
  },
  {
    id: 5,
    name: "SF90 Stradale",
    brand: "Ferrari",
    image: "5.png",
    price: 507000,
    category: "Hypercar",
    power: "986 hp",
    zeroToHundred: "2.5 s",
    drivetrain: "V8 Hybrid · AWD",
    seats: "2 seats",
    origin: "Maranello, IT",
    description:
      "Ferrari’s plug-in hybrid halo car, combining instant electric response with a howling twin-turbo V8.",
  },
  {
    id: 6,
    name: "Continental GT Speed",
    brand: "Bentley",
    image: "6.png",
    price: 280000,
    category: "Coupe",
    power: "650 hp",
    zeroToHundred: "3.6 s",
    drivetrain: "W12 · AWD",
    seats: "4 seats",
    origin: "Crewe, UK",
    description:
      "An opulent grand tourer with genuine continent-crossing pace and a cabin crafted like a modern lounge.",
  },
  {
    id: 7,
    name: "Panamera Turbo S E-Hybrid",
    brand: "Porsche",
    image: "7.png",
    price: 210000,
    category: "Sedan",
    power: "690 hp",
    zeroToHundred: "3.2 s",
    drivetrain: "V8 Hybrid · AWD",
    seats: "4–5 seats",
    origin: "Leipzig, DE",
    description:
      "Four-door practicality without sacrificing Porsche’s trademark steering feel and composure.",
  },
  {
    id: 8,
    name: "DBX707",
    brand: "Aston Martin",
    image: "8.png",
    price: 235000,
    category: "SUV",
    power: "697 hp",
    zeroToHundred: "3.3 s",
    drivetrain: "V8 · AWD",
    seats: "4–5 seats",
    origin: "St Athan, UK",
    description:
      "The most powerful luxury SUV in its class, blending Aston Martin design language with everyday usability.",
  },
  {
    id: 9,
    name: "Huracán STO",
    brand: "Lamborghini",
    image: "9.png",
    price: 330000,
    category: "Hypercar",
    power: "640 hp",
    zeroToHundred: "3.0 s",
    drivetrain: "V10 · RWD",
    seats: "2 seats",
    origin: "Sant’Agata Bolognese, IT",
    description:
      "A road-legal homologation special with extensive carbon and aero, built to feel at home on a circuit.",
  },
];

// Cart state, favourites, compare state
let cart = {};
let favorites = [];
let compareSelection = [];

// ---- Persistence helpers ----
function saveCart() {
  try {
    localStorage.setItem("luxuryGarageCart", JSON.stringify(cart));
  } catch {}
}

function loadCart() {
  try {
    const saved = localStorage.getItem("luxuryGarageCart");
    if (saved) cart = JSON.parse(saved) || {};
  } catch {
    cart = {};
  }
}

function saveFavorites() {
  try {
    localStorage.setItem("luxuryGarageFavorites", JSON.stringify(favorites));
  } catch {}
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem("luxuryGarageFavorites");
    if (!raw) {
      favorites = [];
      return;
    }
    const parsed = JSON.parse(raw);
    favorites = Array.isArray(parsed)
      ? parsed.filter((id) => products.some((p) => p.id === id))
      : [];
  } catch {
    favorites = [];
  }
}

function isFavorite(id) {
  return favorites.includes(id);
}

function toggleFavorite(id) {
  if (isFavorite(id)) {
    favorites = favorites.filter((x) => x !== id);
  } else {
    favorites.push(id);
  }
  saveFavorites();
  renderProducts();
}

// Simple monthly payment estimate
function estimateMonthly(paymentTotal) {
  return Math.round(paymentTotal / 60);
}

// Filter + sort
function getFilteredSortedProducts() {
  if (!list) return [];

  const search = (searchInput?.value || "").trim().toLowerCase();
  const category = categoryFilter?.value || "all";
  const sort = sortSelect?.value || "default";

  // Base set: all products on collection, only favourites on garage
  let base =
    currentPage === "garage"
      ? products.filter((p) => favorites.includes(p.id))
      : products;

  let result = base.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search) ||
      p.brand.toLowerCase().includes(search);

    const matchesCategory =
      !categoryFilter || category === "all" ? true : p.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "price-asc") {
    result = result.slice().sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    result = result.slice().sort((a, b) => b.price - a.price);
  }

  return result;
}

// Compare UI
function updateCompareUI() {
  if (!compareBar || !compareCountEl || !openCompareBtn) return;

  const count = compareSelection.length;

  if (count === 0) {
    compareBar.classList.remove("compare-bar-visible");
    openCompareBtn.disabled = true;
    compareCountEl.textContent = "No models selected";
  } else {
    compareBar.classList.add("compare-bar-visible");
    compareCountEl.textContent = `${count} model${
      count === 1 ? "" : "s"
    } selected`;
    openCompareBtn.disabled = count < 2;
  }
}

function toggleCompare(id) {
  const idx = compareSelection.indexOf(id);
  if (idx !== -1) {
    compareSelection.splice(idx, 1);
  } else {
    if (compareSelection.length >= 3) {
      alert("You can compare up to 3 models at a time.");
      return;
    }
    compareSelection.push(id);
  }
  updateCompareUI();
  renderProducts();
}

// Render products / favourites
function renderProducts() {
  if (!list) return;

  const items = getFilteredSortedProducts();
  list.innerHTML = "";

  if (resultsCountEl) {
    if (currentPage === "garage" && favorites.length === 0) {
      resultsCountEl.textContent = "No saved models yet";
    } else {
      const count = items.length;
      resultsCountEl.textContent =
        count === 0
          ? "No models match this filter"
          : `${count} model${count === 1 ? "" : "s"} available`;
    }
  }

  if (currentPage === "garage" && favorites.length === 0) {
    list.innerHTML = `
      <div style="padding:16px;border-radius:16px;border:1px solid rgba(255,255,255,0.08);background:#0a0a12;">
        <p style="font-size:.9rem;color:#9c9cab;">
          You haven't saved any cars yet. Browse the collection and tap the ♥ icon to add models to your garage.
        </p>
        <a href="index.html" class="btn btn-ghost" style="margin-top:10px;">Browse collection</a>
      </div>
    `;
    return;
  }

  if (!items.length) {
    list.innerHTML =
      '<p style="color:#9c9cab;font-size:0.9rem;">No cars match your search.</p>';
    return;
  }

  items.forEach((car) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.id = car.id;

    const estMonthly = estimateMonthly(car.price).toLocaleString();
    const isFav = isFavorite(car.id);
    const isCompared = compareSelection.includes(car.id);
    const compareLabel = isCompared ? "In compare" : "Compare";

    card.innerHTML = `
      <div class="product-media">
        <img src="image/${car.image}" alt="${car.brand} ${car.name}" />
        <span class="product-tag">${car.category}</span>
        <button class="favorite-toggle ${
          isFav ? "favorite-on" : ""
        }" aria-label="Toggle favourite">
          ${isFav ? "♥" : "♡"}
        </button>
      </div>
      <div class="product-content">
        <div class="product-brand">${car.brand}</div>
        <h3 class="product-name">${car.name}</h3>
        <div class="product-specs">
          <span class="spec-pill">${car.power}</span>
          <span class="spec-pill">0–100 km/h · ${car.zeroToHundred}</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span>from</span>
            <strong>${car.price.toLocaleString()}$</strong>
            <div class="product-price-note">~ ${estMonthly}$/mo est.</div>
          </div>
          <div class="product-footer-actions">
            <button class="btn btn-ghost btn-small compare-toggle${
              isCompared ? " compare-active" : ""
            }">
              ${compareLabel}
            </button>
            <button class="btn btn-ghost btn-small view-details">
              Details
            </button>
            <button class="btn btn-primary btn-small add-to-cart">
              Add
            </button>
          </div>
        </div>
      </div>
    `;

    list.appendChild(card);
  });
}

// Cart rendering
function renderCart() {
  if (!listCard || !total || !quantity) return;

  listCard.innerHTML = "";

  const entries = Object.values(cart);
  let totalPrice = 0;
  let totalQty = 0;

  if (!entries.length) {
    listCard.innerHTML =
      '<p style="color:#9c9cab;font-size:0.85rem;">Your garage shortlist is empty.</p>';
  } else {
    entries.forEach((entry) => {
      const { product, quantity } = entry;
      const row = document.createElement("li");
      row.className = "cart-item";
      row.dataset.id = product.id;

      const lineTotal = product.price * quantity;
      totalPrice += lineTotal;
      totalQty += quantity;

      row.innerHTML = `
        <img src="image/${product.image}" alt="${product.name}" />
        <div class="cart-item-main">
          <div class="cart-item-name">${product.brand} ${product.name}</div>
          <div class="cart-item-price">${product.price.toLocaleString()}$ each</div>
        </div>
        <div class="cart-item-controls">
          <div class="qty-controls">
            <button class="qty-btn qty-minus">-</button>
            <span>${quantity}</span>
            <button class="qty-btn qty-plus">+</button>
          </div>
          <div>${lineTotal.toLocaleString()}$</div>
        </div>
      `;

      listCard.appendChild(row);
    });
  }

  total.textContent = `${totalPrice.toLocaleString()}$`;
  quantity.textContent = totalQty;
}

// Cart actions
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  if (!cart[id]) {
    cart[id] = { product, quantity: 1 };
  } else {
    cart[id].quantity += 1;
  }

  saveCart();
  renderCart();
}

function changeQuantity(id, delta) {
  const entry = cart[id];
  if (!entry) return;

  entry.quantity += delta;
  if (entry.quantity <= 0) {
    delete cart[id];
  }

  saveCart();
  renderCart();
}

function clearCart() {
  cart = {};
  saveCart();
  renderCart();
}

// Product detail modal
function openProductModal(id) {
  if (!productModal || !productModalBackdrop) return;

  const product = products.find((p) => p.id === id);
  if (!product) return;

  productModal.dataset.id = String(id);

  if (modalImage) {
    modalImage.src = `image/${product.image}`;
    modalImage.alt = `${product.brand} ${product.name}`;
  }
  if (modalTag) modalTag.textContent = product.category;
  if (modalBrand) modalBrand.textContent = product.brand;
  if (modalName) modalName.textContent = product.name;
  if (modalDesc) modalDesc.textContent = product.description;

  if (modalSpecs) {
    modalSpecs.querySelector('[data-spec="power"]').textContent = product.power;
    modalSpecs.querySelector(
      '[data-spec="zero"]'
    ).textContent = `0–100 km/h · ${product.zeroToHundred}`;
    modalSpecs.querySelector('[data-spec="drivetrain"]').textContent =
      product.drivetrain;
    modalSpecs.querySelector('[data-spec="seats"]').textContent = product.seats;
    modalSpecs.querySelector('[data-spec="origin"]').textContent =
      product.origin;
  }

  const estMonthly = estimateMonthly(product.price).toLocaleString();
  if (modalPriceMain)
    modalPriceMain.textContent = `${product.price.toLocaleString()}$`;
  if (modalPriceNote)
    modalPriceNote.textContent = `~ ${estMonthly}$/mo estimate over 60 months`;

  productModal.classList.add("open");
  productModalBackdrop.classList.add("open");
}

function closeProductModal() {
  if (!productModal || !productModalBackdrop) return;
  productModal.classList.remove("open");
  productModalBackdrop.classList.remove("open");
}

// Compare modal
function openCompareModal() {
  if (!compareModal || !compareBackdrop || !compareModalBody) return;
  if (compareSelection.length < 2) return;

  const items = compareSelection
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const rows = [
    { label: "Model", render: (p) => `${p.brand} ${p.name}` },
    { label: "Price", render: (p) => `${p.price.toLocaleString()}$` },
    { label: "Category", render: (p) => p.category },
    { label: "Power", render: (p) => p.power },
    { label: "0–100 km/h", render: (p) => p.zeroToHundred },
    { label: "Drivetrain", render: (p) => p.drivetrain },
    { label: "Seats", render: (p) => p.seats },
    { label: "Origin", render: (p) => p.origin },
  ];

  let html = '<div class="compare-grid">';
  html += '<div class="compare-header-row">';
  html += '<div class="compare-cell compare-label"></div>';
  items.forEach((p) => {
    html += `<div class="compare-cell compare-heading">${p.brand} ${p.name}</div>`;
  });
  html += "</div>";

  rows.forEach((row) => {
    html += '<div class="compare-row">';
    html += `<div class="compare-cell compare-label">${row.label}</div>`;
    items.forEach((p) => {
      html += `<div class="compare-cell">${row.render(p)}</div>`;
    });
    html += "</div>";
  });

  html += "</div>";

  compareModalBody.innerHTML = html;

  compareModal.classList.add("open");
  compareBackdrop.classList.add("open");
}

function closeCompareModal() {
  if (!compareModal || !compareBackdrop) return;
  compareModal.classList.remove("open");
  compareBackdrop.classList.remove("open");
}

// ---- Event bindings ----

// Open/close cart (present on all pages)
if (openShopping) {
  openShopping.addEventListener("click", () => {
    body.classList.add("cart-open");
  });
}

if (closeShopping) {
  closeShopping.addEventListener("click", () => {
    body.classList.remove("cart-open");
  });
}

if (cartBackdrop) {
  cartBackdrop.addEventListener("click", () => {
    body.classList.remove("cart-open");
  });
}

// product list: event delegation
if (list) {
  list.addEventListener("click", (event) => {
    const favoriteBtn = event.target.closest(".favorite-toggle");
    if (favoriteBtn) {
      const card = favoriteBtn.closest(".product-card");
      if (!card) return;
      const id = Number(card.dataset.id);
      toggleFavorite(id);
      return;
    }

    const button = event.target.closest("button");
    if (!button) return;

    const card = button.closest(".product-card");
    if (!card) return;
    const id = Number(card.dataset.id);

    if (button.classList.contains("add-to-cart")) {
      addToCart(id);
    } else if (button.classList.contains("view-details")) {
      openProductModal(id);
    } else if (button.classList.contains("compare-toggle")) {
      toggleCompare(id);
    }
  });
}

// cart: +/- quantity
if (listCard) {
  listCard.addEventListener("click", (event) => {
    const row = event.target.closest(".cart-item");
    if (!row) return;

    const id = Number(row.dataset.id);

    if (event.target.classList.contains("qty-plus")) {
      changeQuantity(id, 1);
    } else if (event.target.classList.contains("qty-minus")) {
      changeQuantity(id, -1);
    }
  });
}

// filters
if (searchInput) {
  searchInput.addEventListener("input", renderProducts);
}
if (categoryFilter) {
  categoryFilter.addEventListener("change", renderProducts);
}
if (sortSelect) {
  sortSelect.addEventListener("change", renderProducts);
}

// clear cart
if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    clearCart();
  });
}

// bespoke form fake submit
const bespokeForm = document.querySelector(".bespoke-form");
if (bespokeForm) {
  bespokeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you. Your bespoke brief has been received.");
    bespokeForm.reset();
  });
}

// Close cart when navigating with navbar links (keeps state clean)
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("cart-open");
  });
});

// Modal close actions
if (productModalBackdrop) {
  productModalBackdrop.addEventListener("click", closeProductModal);
}
if (modalCloseButton) {
  modalCloseButton.addEventListener("click", closeProductModal);
}
if (modalAddButton) {
  modalAddButton.addEventListener("click", () => {
    const id = Number(productModal.dataset.id);
    if (id) {
      addToCart(id);
    }
  });
}

// Compare modal actions
if (compareBackdrop) {
  compareBackdrop.addEventListener("click", closeCompareModal);
}
if (compareModalClose) {
  compareModalClose.addEventListener("click", closeCompareModal);
}
if (openCompareBtn) {
  openCompareBtn.addEventListener("click", () => {
    openCompareModal();
  });
}

// ESC closes cart + modals
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    body.classList.remove("cart-open");
    closeProductModal();
    closeCompareModal();
  }
});

// INIT
loadCart();
loadFavorites();
renderCart();
updateCompareUI();

// Only render products if we have a catalog on this page
if (list) {
  renderProducts();
}
