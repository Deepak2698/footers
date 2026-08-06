import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-black-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: '',
    none: ''
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="product-card">
    <Skeleton variant="rectangular" className="aspect-square" />
    <div className="p-6 space-y-3">
      <Skeleton variant="text" className="h-5 w-3/4" />
      <Skeleton variant="text" className="h-4 w-1/2" />
      <Skeleton variant="text" className="h-6 w-1/3" />
      <Skeleton variant="rounded" className="h-10 w-full" />
    </div>
  </div>
);

// Product Detail Skeleton
export const ProductDetailSkeleton: React.FC = () => (
  <div className="container-custom section-padding">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      <div className="space-y-4">
        <Skeleton variant="rounded" className="aspect-square" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" className="aspect-square" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton variant="text" className="h-10 w-3/4" />
        <Skeleton variant="text" className="h-6 w-1/2" />
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="text" className="h-20 w-full" />
        <div className="space-y-4">
          <Skeleton variant="rounded" className="h-12 w-full" />
          <Skeleton variant="rounded" className="h-12 w-full" />
        </div>
        <div className="flex space-x-4">
          <Skeleton variant="rounded" className="h-12 flex-1" />
          <Skeleton variant="rounded" className="h-12 flex-1" />
        </div>
      </div>
    </div>
  </div>
);

// Category Card Skeleton
export const CategoryCardSkeleton: React.FC = () => (
  <div className="card overflow-hidden text-center">
    <Skeleton variant="rectangular" className="aspect-square" />
    <div className="p-4 space-y-2">
      <Skeleton variant="text" className="h-5 w-3/4 mx-auto" />
      <Skeleton variant="text" className="h-4 w-1/2 mx-auto" />
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <div className="flex space-x-4 p-4 border-b border-black-700">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} variant="text" className="flex-1" />
    ))}
  </div>
);

export default Skeleton;
