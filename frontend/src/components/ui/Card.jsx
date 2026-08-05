import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ children, glass = false, hover = false, className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300 overflow-hidden',
        glass
          ? 'glass-card shadow-glass dark:shadow-glass-dark'
          : 'bg-white dark:bg-surface-dark border border-slate-200/80 dark:border-surface-border-dark shadow-sm',
        hover && 'hover:-translate-y-1 hover:shadow-lg hover:border-terracotta-500/30 dark:hover:border-terracotta-500/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn('p-6 pb-3 flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3
      className={cn(
        'text-xl font-serif font-semibold text-slate-900 dark:text-slate-100 tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className, ...props }) => {
  return (
    <p className={cn('text-sm text-slate-500 dark:text-slate-400', className)} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={cn('p-6 pt-3', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-surface-border-dark flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
