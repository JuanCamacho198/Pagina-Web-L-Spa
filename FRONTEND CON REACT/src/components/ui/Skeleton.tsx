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
    rectangular: 'rounded-4xl',
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
    <div className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <Skeleton className="h-48 w-full rounded-4xl" />
      <div className="space-y-3">
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-2/3 h-4" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="w-20 h-6" variant="text" />
        <Skeleton className="w-24 h-10 rounded-4xll" />
      </div>
    </div>
  );
};

export const ServiceDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left column - Image */}
        <div className="relative aspect-square md:aspect-4/3 rounded-4xl overflow-hidden shadow-lg border border-gray-100">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Right column - Content */}
        <div className="flex flex-col gap-8 py-2">
          <div className="space-y-4">
            <Skeleton variant="text" className="w-px/3 h-4" /> {/* Category */}
            <Skeleton variant="text" className="w-3/4 h-12" /> {/* Title */}
            <div className="flex items-center gap-4">
              <Skeleton className="w-32 h-6" /> {/* Rating */}
              <Skeleton className="w-24 h-6" /> {/* Price tag */}
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton variant="text" className="w-full h-4" />
            <Skeleton variant="text" className="w-full h-4" />
            <Skeleton variant="text" className="w-4/5 h-4" />
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="w-24 h-8" />
              <Skeleton className="w-32 h-12 rounded-4xll" />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section skeleton */}
      <div className="mt-20 border-t border-gray-100 pt-12">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="w-48 h-10" />
          <Skeleton className="w-32 h-6" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-gray-50/50 rounded-4xl space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="w-px0 h-10" />
                <div className="space-y-2">
                  <Skeleton variant="text" className="w-24 h-4" />
                  <Skeleton variant="text" className="w-px6 h-3" />
                </div>
              </div>
              <Skeleton variant="text" className="w-full h-130" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

