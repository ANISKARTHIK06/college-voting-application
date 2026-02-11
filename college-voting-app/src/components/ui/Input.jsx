import React from 'react';

const Input = ({
    label,
    error,
    id,
    type = 'text',
    className = '',
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`h-11 px-4 bg-white border rounded-lg text-sm transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-600
          ${error ? 'border-red-500' : 'border-slate-300'}
          disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-400`}
                {...props}
            />
            {error && (
                <span className="text-xs font-medium text-error-600">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
