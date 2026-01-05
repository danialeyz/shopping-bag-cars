# Danial Garage — Module SPA (One HTML) + Django API + Admin-ready

## Key concept
- **Only one HTML file**: `frontend/index.html`
- Every page is **JSON modules from backend**: `GET /api/pages/<slug>/`
- Admin can edit:
  - Products (Cars) in Django Admin
  - Page modules (Pages -> modules) in Django Admin

## Run backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # windows: .venv\Scripts\activate
pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py seed_cars
python manage.py seed_pages
python manage.py createsuperuser
python manage.py runserver 8000
```
Admin: http://127.0.0.1:8000/admin/

## Run frontend (Tailwind)
From project root:
```bash
npm install
npm run build
# or: npm run watch:css
```
Serve `frontend/` with Live Server and open `frontend/index.html`.

## SPA routes
/ -> home
/garage -> garage
/bespoke -> bespoke
/about -> about
/login -> login
/signup -> signup
/dashboard -> dashboard

/compare -> compare
/checkout -> checkout
