import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { CaseList } from './pages/CaseList';
import { CaseDetail } from './pages/CaseDetail';
import { isAuthenticated } from './services/auth';

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/cases" replace />} />
                    <Route path="cases" element={<CaseList />} />
                    <Route path="cases/:id" element={<CaseDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
