import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = {
    default: 'bg-slate-100 text-slate-600',
    high: 'bg-rose-100 text-rose-700 font-bold',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-slate-100 text-slate-600',
    new: 'bg-blue-100 text-blue-700',
    under_review: 'bg-yellow-100 text-yellow-700',
    signed: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    closed: 'bg-slate-200 text-slate-600',
};

export const Badge = ({ children, variant = 'default', className }) => {
    const v = variant ? String(variant).toLowerCase().replace(' ', '_') : 'default';
    const style = variants[v] || variants.default;

    return (
        <span className={twMerge('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', style, className)}>
            {children}
        </span>
    );
};
