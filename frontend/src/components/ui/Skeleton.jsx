import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className,
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full shrink-0',
    rectangular: 'rounded-xl w-full h-32',
    card: 'rounded-2xl w-full h-48 border border-slate-200/60 dark:border-surface-border-dark',
  };

  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/80 dark:bg-slate-800/80',
        variantStyles[variant],
        className
      )}
      style={style}
      {...props}
    />
  );
};

export default Skeleton;
