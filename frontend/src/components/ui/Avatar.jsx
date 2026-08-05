import React, { useState } from 'react';
import { cn } from '../../utils/cn';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg font-semibold',
};

const statusSizes = {
  sm: 'w-2.5 h-2.5 border',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-4 h-4 border-2',
};

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400',
  busy: 'bg-amber-500',
};

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const Avatar = ({
  src,
  name,
  size = 'md',
  status,
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold select-none ring-2 ring-white dark:ring-slate-800 shadow-sm transition-transform duration-200 hover:scale-105',
          'bg-gradient-to-br from-terracotta-400 to-terracotta-600 text-white',
          sizes[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white dark:border-slate-900 shadow-xs',
            statusSizes[size],
            statusColors[status]
          )}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;
