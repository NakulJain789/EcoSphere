import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-16 px-6 max-w-md mx-auto flex flex-col items-center justify-center ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-sage-100 dark:bg-forest-950 flex items-center justify-center text-forest-700 dark:text-sage-300 mb-5 shadow-inner">
          <Icon className="w-8 h-8 stroke-[1.5]" />
        </div>
      )}
      <h3 className="font-serif text-2xl font-semibold text-charcoal-900 dark:text-cream-50 mb-2">
        {title}
      </h3>
      <p className="text-charcoal-600 dark:text-charcoal-300 text-sm leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
