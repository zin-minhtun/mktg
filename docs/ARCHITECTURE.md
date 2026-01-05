# Architecture Overview

## Components
- **Mobile (`mobile/`)**
  - Expo / React Native client for end users
  - Uses Firebase Auth (Google Sign-In + email/password)
  - Calls REST API for data persistence and case management

- **API (`api/`)**
  - Node.js + Express REST API
  - MongoDB via Mongoose
  - AdminJS at `/admin` for managing resources

- **Web admin (`web-admin/`)**
  - React + Vite internal dashboard
  - Calls the API via `/api` (proxied to localhost in development)
  - Authentication is currently mock-only and must be replaced

## Data flow
- Mobile → API → MongoDB
- Web admin → API → MongoDB
- AdminJS → API → MongoDB

## Current gaps (not launched yet)
- No CI/CD workflows configured
- No deployment configuration for API/web-admin in repo
- Production secrets strategy not documented (EAS secrets recommended for mobile)