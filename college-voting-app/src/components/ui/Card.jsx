import React from 'react';

const Card = ({ children, className = '', padding = 'p-6' }) => {
    return (
        <div className={`bg-white border border-slate-200 rounded-xl shadow-sm ${padding} ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = '' }) => (
    <div className={`${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`mt-6 pt-6 border-t border-slate-100 ${className}`}>{children}</div>
);

export default Card;
