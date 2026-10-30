import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary:
      'bg-forest-800 hover:bg-forest-900 text-cream-50 focus:ring-forest-700 shadow-sm hover:shadow',
    secondary:
      'bg-sage-100 hover:bg-sage-200 text-forest-900 dark:bg-forest-900 dark:text-cream-100 dark:hover:bg-forest-800 focus:ring-sage-400',
    outline:
      'border border-forest-800 text-forest-800 hover:bg-forest-50 dark:border-forest-400 dark:text-cream-50 dark:hover:bg-forest-950 focus:ring-forest-500',
    amber:
      'bg-amber-accent hover:bg-amber-accentDark text-white focus:ring-amber-500 shadow-sm',
    ghost:
      'text-charcoal-700 hover:text-forest-900 hover:bg-sage-100/60 dark:text-charcoal-200 dark:hover:text-cream-50 dark:hover:bg-charcoal-800',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
