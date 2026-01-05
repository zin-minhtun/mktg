# Admin Dashboard

There are two admin experiences:

1) **AdminJS** (backend admin panel)
- Served by the API at: http://localhost:5000/admin
- Auth: email/password from API env vars

2) **Web admin dashboard** (React app)
- Path: `web-admin/`
- Runs locally at: http://localhost:3000
- Calls backend endpoints through `/api` proxy

---

## AdminJS (API)

### Run
```bash
cd api
npm install
cp .env.example .env
npm start
```

### Configure credentials
Set in `api/.env`:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `COOKIE_PASSWORD` (session secret)

---

## Web admin dashboard

### Run
```bash
cd web-admin
npm install
npm run dev
```

### Current authentication status (critical)
Web-admin auth is currently **mock/client-side only**:
- hardcoded credentials in frontend code
- mock token stored in localStorage
- no backend validation
- no RBAC

Before production, replace this with real backend authentication (e.g., `/api/admin/login`) and authorization.