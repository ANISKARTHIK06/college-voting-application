import React from 'react';

const Badge = ({ children, variant = 'slate', className = '' }) => {
    const variants = {
        primary: 'bg-primary-50 text-primary-600 border-primary-100',
        success: 'bg-success-50 text-success-600 border-green-100',
        warning: 'bg-warning-50 text-warning-600 border-amber-100',
        error: 'bg-red-50 text-error-600 border-red-100',
        slate: 'bg-slate-100 text-slate-600 border-slate-200'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
