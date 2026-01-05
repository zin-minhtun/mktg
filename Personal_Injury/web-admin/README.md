# Case Manager Admin Dashboard

A separate React-based admin dashboard for the Personal Injury Case Manager system.

## 🚀 Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Typically runs at `http://localhost:3000`.

3.  **Proxy Setup**
    The app proxies `/api` requests to `http://localhost:5000` (Backend). 
    **Ensure the Backend API is running!**

## 🔑 Login
- **Email**: `admin@personalinjury.com`
- **Password**: `admin`
*(Configured in `src/services/auth.js`)*

## 🛠️ Stack
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (Icons)

## 📁 Structure
- `/src/components`: UI primitives (Badge, Card) and Layout.
- `/src/pages`: Feature pages (Login, CaseList, CaseDetail).
- `/src/services`: API and Auth logic.
