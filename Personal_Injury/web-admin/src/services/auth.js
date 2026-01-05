// Simple client-side auth for the dashboard
// In production, this should be replaced with a real /api/admin/login endpoint

// Credentials match backend .env (ADMIN_EMAIL and ADMIN_PASSWORD)
const ADMIN_CREDS = {
    email: 'admin@personalinjury.com',
    password: 'securePassword123'
};

export const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
        localStorage.setItem('admin_token', 'mock_token_12345');
        localStorage.setItem('admin_user', JSON.stringify({ email }));
        return true;
    }
    throw new Error('Invalid credentials');
};

export const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('admin_token');
};

export const getAdminUser = () => {
    const u = localStorage.getItem('admin_user');
    return u ? JSON.parse(u) : null;
};
