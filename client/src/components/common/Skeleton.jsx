import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-sage-200/70 dark:bg-charcoal-800 rounded-lg ${className}`}
      {...props}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-charcoal-900 rounded-2xl p-4 border border-sage-100 dark:border-charcoal-800 shadow-sm flex flex-col space-y-3">
      <Skeleton className="w-full h-52 rounded-xl" />
      <div className="space-y-2 pt-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="pt-3 border-t border-sage-100 dark:border-charcoal-800 flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
};

export default Skeleton;
