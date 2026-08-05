import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      helperText,
      icon,
      className,
      id,
      disabled,
      placeholder = 'Select an option',
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-2.5 text-sm rounded-xl appearance-none transition-all duration-200 cursor-pointer pr-10',
              'bg-white dark:bg-surface-dark text-slate-900 dark:text-slate-100',
              'border border-slate-200 dark:border-surface-border-dark',
              'focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 dark:focus:border-terracotta-500',
              'disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed',
              icon && 'pl-10',
              error && 'border-rose-500 dark:border-rose-500 focus:ring-rose-500/30 focus:border-rose-500',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-400">
                {placeholder}
              </option>
            )}
            {options.map((opt, idx) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={idx} value={val} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  {lbl}
                </option>
              );
            })}
          </select>

          <div className="absolute right-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error ? (
          <p className="text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
