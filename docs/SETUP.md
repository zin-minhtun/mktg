# Setup (Local Development)

This repository is a monorepo with three components:
- `api/` — Node.js/Express API + MongoDB + AdminJS
- `web-admin/` — React + Vite internal dashboard
- `mobile/` — Expo / React Native mobile app

> Node.js version is not pinned in the repo (no `.nvmrc` found). Consider adding one later for consistency.

---

## 1) API (`api/`)

### Requirements
- Node.js + npm
- MongoDB connection string (local MongoDB or MongoDB Atlas)

### Configure environment variables
```bash
cd api
cp .env.example .env
# edit .env
```

Minimum required:
- `MONGODB_CONNECTION_STRING`

Recommended for security:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `COOKIE_PASSWORD` (>= 32 characters)

### Install & run
```bash
cd api
npm install
npm start
```

- API: http://localhost:5000  
- AdminJS: http://localhost:5000/admin

---

## 2) Web admin dashboard (`web-admin/`)

### Requirements
- Node.js + npm
- API running at http://localhost:5000

### Install & run
```bash
cd web-admin
npm install
npm run dev
```

- Web admin: http://localhost:3000  
- Dev proxy: `/api` → `http://localhost:5000` (see `web-admin/vite.config.js`)

Security note: web-admin authentication is currently mock/client-side only.

---

## 3) Mobile app (`mobile/`)

### Requirements
- Node.js + npm
- Expo tooling
- Android Studio (Android) and/or Xcode (iOS)
- Firebase project (for Auth)
- Android Firebase config file: `mobile/google-services.json` (expected)

### Configure environment variables
```bash
cd mobile
cp .env.example .env
# edit .env (API_URL + Firebase keys)
```

### Install & run
```bash
cd mobile
npm install
npm start
```

### Important: API_URL on real devices
If you run the mobile app on a physical device, `API_URL` cannot be `localhost`. Use your machine LAN IP, e.g.
- `http://192.168.x.x:5000`

---

## Troubleshooting

### Tailwind async plugin error
If you see:
`Use process(css).then(cb) to work with async plugins`

Try (in the relevant package) and restart Expo:
```bash
npm install tailwindcss@3.3.2 --save-dev
npx expo start --clear
```