import React from 'react';

export const Card = ({ title, children, className }) => {
    return (
        <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export const CardRow = ({ label, value, fullWidth = false }) => (
    <div className={`mb-4 ${fullWidth ? 'col-span-2' : ''}`}>
        <dt className="text-xs font-medium text-slate-500 mb-1">{label}</dt>
        <dd className="text-sm text-slate-900 font-medium">{value || '-'}</dd>
    </div>
);
