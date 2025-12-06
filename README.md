# 📑 Shopping Card

## Table of Contents
* [Overview](#overview)
* [Architecture](#architecture)
* [Features](#features)
* [Project Structure](#project-structure)
* [Technical Implementation](#technical-implementation)
* [Getting Started](#getting-started)
* [Browser Compatibility](#browser-compatibility)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)

## 🔍 Overview

**Shopping Card** is a front-end shopping cart application designed for speed, simplicity, and modularity. It does not require any frameworks or backend services. The app uses pure JavaScript for managing product data, cart operations, and UI updates.

This project is a great reference for:
* DOM-driven UI rendering
* Local state persistence
* Multi-page front-end navigation
* Clean modular architecture without frameworks

## 🏗 Architecture

```
┌────────────────────────┐
│        User UI         │
│  HTML + CSS Components │
└────────────┬───────────┘
             │ DOM Events
             ▼
┌────────────────────────┐
│   app.js (Core Logic)  │
│ - State Management     │
│ - Event Delegation     │
│ - UI Rendering         │
│ - LocalStorage Sync    │
└────────────┬───────────┘
             │ Persistence
             ▼
┌────────────────────────┐
│     localStorage       │
└────────────────────────┘
```

This architecture allows the project to work offline, load instantly, and remain stable across reloads.

## 🚀 Features

### 🛒 Shopping Cart
* Add/remove products dynamically
* Modify item quantity
* Auto-calculated totals
* Cart data saved in `localStorage`
* UI automatically re-renders on changes

### 📱 Responsive Layout
* Mobile-first design
* Flexible grid system
* Optimized images

### ⚙️ Technical Design
* Robust event delegation
* Centralized state object
* Dynamic HTML generation
* Modular, scalable JS structure

## 📁 Project Structure

```
shopping-card/
│
├── index.html            # Main landing page
├── garage.html           # Category view
├── bespoke.html          # Custom order page
├── about.html            # About section
│
├── app.js                # Application logic
├── style.css             # Global styles
│
├── image/                # Assets and media
│
├── README.md             # Documentation
└── .git/                 # Version control
```

## 🧠 Technical Implementation

### 1. 🔐 State Management with localStorage

```javascript
const cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
```

**Benefits:**
* Zero backend required
* Instantly available
* Persistent across sessions

### 2. ⚡ Efficient Rendering

```javascript
function renderCart() {
  const container = document.querySelector(".cart-container");
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" />
      <p>${item.name}</p>
      <p>${item.quantity} × $${item.price}</p>
    </div>
  `).join("");
}
```

* DOM updated in batches
* No repeated layout thrashing
* Highly scalable for many items

### 3. 🧩 Event Delegation

```javascript
document.addEventListener("click", (e) => {
  if (e.target.matches(".add-to-cart")) {
    addToCart(e.target.dataset.id);
  }
});
```

**Benefits:**
* Fewer event listeners
* Better performance
* Works for dynamically created elements

## ▶️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd shopping-card
```

### 2. Run the project

Just open the HTML files in your browser – no build steps required.

```bash
open index.html
```

## 🌐 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| ES6 JavaScript | ✔️ | ✔️ | ✔️ | ✔️ |
| localStorage | ✔️ | ✔️ | ✔️ | ✔️ |
| Responsive Layout | ✔️ | ✔️ | ✔️ | ✔️ |

## 🗺️ Roadmap

*Add your planned features and improvements here*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

*Add your license information here*

---

**Built with ❤️ using vanilla JavaScript**
