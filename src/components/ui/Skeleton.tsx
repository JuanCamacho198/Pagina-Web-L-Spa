import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'rectangular' 
}) => {
  const variantClasses = {
    rectangular: 'rounded-2xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 w-full',
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200/80",
        variantClasses[variant],
        className
      )}
    />
  );
};

export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="space-y-3">
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-2/3 h-4" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="w-20 h-6" variant="text" />
        <Skeleton className="w-24 h-10 rounded-xl" />
      </div>
    </div>
  );
};
