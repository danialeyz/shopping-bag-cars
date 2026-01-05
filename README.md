
# Danial Garage

### Module-Driven SPA (Single HTML) · Django REST API · Admin-Editable Content

Danial Garage is a **modern, high-performance web application** built with a **module-based Single Page Application (SPA) architecture**, powered by a **Django REST backend** and designed to be **fully manageable by non-technical admins**.

The project intentionally uses **one HTML file only**, with all page content delivered dynamically from the backend as **JSON modules**.

---

## ✨ Core Architecture Principles

### ✅ One HTML File

* The entire frontend is rendered from **`frontend/index.html`**
* Navigation never reloads the page
* Content updates dynamically inside the `<main>` element

### ✅ Backend-Driven Pages

* Every “page” is defined in the backend as structured JSON
* Frontend requests page content via:

```
GET /api/pages/<slug>/
```

Example:

```json
{
  "title": "Home",
  "modules": [
    { "type": "hero", "props": {} },
    { "type": "inventory", "props": {} }
  ]
}
```

The frontend **renders modules dynamically**, based on their type.

---

## 🧠 Why This Architecture?

| Feature          | Benefit                                    |
| ---------------- | ------------------------------------------ |
| One HTML file    | Fast, cacheable, framework-agnostic        |
| Module system    | Infinite layouts without frontend rebuilds |
| JSON-based pages | Admin-editable content                     |
| SPA routing      | Instant navigation                         |
| Django Admin     | Non-technical content management           |
| REST API         | Clean separation of concerns               |

This is the same architectural philosophy used by **headless CMS platforms**, **Shopify**, and **modern SaaS dashboards**.

---

## 🧩 Frontend Structure

```
frontend/
├── index.html              # Single HTML entry
├── assets/                 # Images & static assets
├── dist/                   # Tailwind output
└── js/
    ├── app.js              # App bootstrap
    ├── router.js           # SPA routing
    ├── spa.js              # Page loader
    ├── renderer.js         # Module renderer
    ├── api.js              # API wrapper
    ├── state.js            # Auth & session state
    ├── compareState.js     # Compare feature state
    ├── layout.js           # Navbar, footer, drawers
    └── modules/
        ├── hero.js
        ├── inventory.js
        ├── garage.js
        ├── comparePage.js
        ├── checkout.js
        ├── auth.js
        ├── dashboard.js
        ├── bespoke.js
        └── text.js
```

### 🧩 Modules

Each module:

* Is fully self-contained
* Receives props from backend JSON
* Renders a DOM node
* Can be reused on any page

---

## 🧠 SPA Routing

The SPA uses **history API routing**.
Changing routes updates only the `<main>` content.

### Available Routes

| Route        | Description       |
| ------------ | ----------------- |
| `/`          | Home / Collection |
| `/garage`    | User garage       |
| `/compare`   | Car comparison    |
| `/checkout`  | Checkout          |
| `/bespoke`   | Bespoke request   |
| `/about`     | About             |
| `/login`     | Login             |
| `/signup`    | Signup            |
| `/dashboard` | User dashboard    |

---

## 🔐 Authentication & User Features

* JWT-based authentication
* Login & Signup modules
* Favorites (saved cars)
* Cart / shortlist
* Compare (up to 4 cars)
* Checkout with order creation

All state is **SPA-safe** and persists across navigation.

---

## 🧑‍💼 Admin Panel (Django Admin)

Admin can manage **without writing code**:

### Products (Cars)

* Add / edit / delete cars
* Upload images
* Set price, specs, categories

### Pages & Layout

* Define pages by slug
* Add, remove, reorder modules
* Edit module content via JSON (future UI planned)

Admin URL:

```
http://127.0.0.1:8000/admin/
```

---

## 🛠 Backend Structure

```
backend/
├── garage/
│   ├── models.py        # Car, Cart, Favorite, Order
│   ├── views.py         # API endpoints
│   ├── urls.py
│   └── admin.py
├── pages/
│   ├── models.py        # Page + PageModule
│   └── management/
│       └── seed_pages.py
├── users/
├── manage.py
└── requirements.txt
```

---

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py seed_cars
python manage.py seed_pages
python manage.py createsuperuser
python manage.py runserver 8000
```

---

### Frontend Setup (Tailwind via PostCSS)

From project root:

```bash
npm install
npm run build
# or
npm run watch:css
```

Serve the `frontend/` directory (VS Code Live Server recommended) and open:

```
frontend/index.html
```

---

## 🔮 Future Roadmap

* Visual admin UI for page modules (no JSON editing)
* Drag & drop page builder
* Payment gateway integration
* SEO rendering
* Analytics dashboard
* Role-based admin permissions

---

## 🏁 Summary

Danial Garage is **not a typical frontend project**.
It is a **production-grade, scalable foundation** designed for:

* Performance
* Flexibility
* Admin usability
* Long-term growth

If you continue building on this architecture, **you will never need to rewrite it** — only extend it.

