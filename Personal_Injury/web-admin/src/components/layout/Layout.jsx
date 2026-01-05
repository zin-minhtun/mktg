import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, FileText } from 'lucide-react';
import { logout, getAdminUser } from '../../services/auth';

export const Layout = () => {
    const navigate = useNavigate();
    const user = getAdminUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-bg flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <span className="text-xl font-bold text-brand-600">Case Manager</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink
                        to="/cases"
                        className={({ isActive }) => `flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Cases
                    </NavLink>
                    {/* Future: Users/Clients */}
                    {/* <NavLink to="/clients" className="..."> ... </NavLink> */}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center px-4 py-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                        </div>
                        <button onClick={handleLogout} className="ml-2 text-slate-500 hover:text-rose-600">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
