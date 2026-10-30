import React from 'react';
import Button from './Button';
import { AlertCircle, RotateCcw } from 'lucide-react';

const ErrorState = ({
  message = 'Failed to load content. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-8 text-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="font-serif text-lg font-semibold text-charcoal-900 dark:text-cream-50 mb-1">
        Unable to complete request
      </h4>
      <p className="text-sm text-charcoal-600 dark:text-charcoal-300 mb-6">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
