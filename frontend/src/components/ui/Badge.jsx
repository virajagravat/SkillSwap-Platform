import React from 'react';
import { cn } from '../../utils/cn';

const variants = {
  terracotta: 'bg-terracotta-500/10 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20',
  sky: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20',
  rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20',
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
  outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300',
};

const dotColors = {
  terracotta: 'bg-terracotta-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  sky: 'bg-sky-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-400',
  outline: 'bg-slate-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs font-medium rounded-md gap-1',
  md: 'px-2.5 py-1 text-xs font-semibold rounded-lg gap-1.5',
  lg: 'px-3 py-1.5 text-sm font-semibold rounded-xl gap-2',
};

const Badge = ({
  children,
  variant = 'terracotta',
  size = 'md',
  dot = false,
  icon,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center tracking-wide transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])} />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
