import React from 'react';

const Input = ({
  label,
  id,
  error,
  helperText,
  icon: Icon,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-charcoal-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={id}
          required={required}
          className={`block w-full rounded-xl border bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-50 placeholder-charcoal-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm py-2.5 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-sage-200 dark:border-charcoal-700 focus:border-forest-600 focus:ring-forest-200/50 dark:focus:ring-forest-900'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-charcoal-500 dark:text-charcoal-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
