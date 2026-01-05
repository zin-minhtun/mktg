# Interact Health Pro

Interact Health Pro is a holistic digital health journal tailored for individuals recovering from personal injuries. The app provides a seamless way to log daily pain levels, symptoms, medications, meals, sleep patterns, exercises, mood, and more. Insightful analytics, reminders, and journaling features help users track recovery progress and improve communication with caregivers or healthcare professionals.

> Status: **Not launched yet**. This repository supports local development and internal testing. Production deployment and store releases are still being finalized.

---

## Monorepo overview

This repository contains three applications:

| App | Path | Tech | Purpose |
|---|---|---|---|
| Mobile app | `mobile/` | Expo SDK 54, React Native, Firebase Auth, Google Sign-In | End-user mobile application |
| API + AdminJS | `api/` | Node.js, Express, MongoDB (Mongoose), AdminJS | REST API + admin panel at `/admin` |
| Web admin dashboard | `web-admin/` | React, Vite, Tailwind | Internal dashboard (currently mock auth) |

---
```text
Personal_Injury/
├── README.md
├── docs/
│   ├── SETUP.md
│   ├── EXPO_DEV_BUILD.md
│   ├── AUTH_GOOGLE.md
│   ├── ADMIN_DASHBOARD.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── LAUNCH_CHECKLIST.md
├── mobile/
│   ├── app.json
│   ├── eas.json
│   ├── package.json
│   ├── babel.config.js
│   ├── firebase.js
│   ├── .env.example
│   ├── google-services.json
│   └── Apps/
│       ├── Components/
│       ├── Contexts/
│       ├── Navigation/
│       ├── Screens/
│       ├── Services/
│       ├── designSystem/
│       └── assets/
├── web-admin/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── api/
    ├── package.json
    ├── .env.example
    ├── scripts/
    └── src/
        ├── app.js
        ├── server.js
        ├── admin/
        ├── controllers/
        ├── models/
        └── routes/
```/


## Quick start (developers)

### 1) Start the API (required)
```bash
cd api
npm install
cp .env.example .env
# edit .env with your MongoDB connection string + AdminJS credentials
npm start
```

- API: http://localhost:5000  
- AdminJS: http://localhost:5000/admin

### 2) Start the web admin dashboard
```bash
cd web-admin
npm install
npm run dev
```

- Web admin: http://localhost:3000  
- Dev proxy: `/api` → `http://localhost:5000`

> Important: web-admin authentication is currently **mock/client-side only** and must be replaced before production.

### 3) Start the mobile app (Expo Development Build required)
```bash
cd mobile
npm install
cp .env.example .env
# edit .env (API_URL + Firebase keys)
npm start
```

This project uses native modules (Google Sign-In/Firebase/notifications/camera/etc.), so **Expo Go is not sufficient**. Use a **custom Expo Development Build** (dev client).

---

## Environment variables

- Mobile: `mobile/.env` (see `mobile/.env.example`)
- API: `api/.env` (see `api/.env.example`)
- Web-admin: no env vars currently; API is configured via Vite proxy.

---

## Documentation

- [Local setup (all apps)](docs/SETUP.md)
- [Expo dev build (Expo Go vs dev client)](docs/EXPO_DEV_BUILD.md)
- [Google authentication (Firebase + Google Sign-In)](docs/AUTH_GOOGLE.md)
- [Admin dashboard (AdminJS + web-admin)](docs/ADMIN_DASHBOARD.md)
- [Architecture overview](docs/ARCHITECTURE.md)
- [API route map](docs/API.md)
- [Launch checklist](docs/LAUNCH_CHECKLIST.md)

---

## Security notes (current state)

- Do not commit secrets (Firebase keys, DB credentials, cookie secrets).
- Web-admin contains mock login and hardcoded credentials (not production-ready).
- API CORS is currently permissive (`*`) and should be restricted in production.
