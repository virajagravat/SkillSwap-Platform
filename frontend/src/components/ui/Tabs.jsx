import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Tabs = ({ tabs = [], activeTab, onChange, variant = 'pills', className }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 p-1 rounded-2xl overflow-x-auto custom-scrollbar',
        variant === 'pills'
          ? 'bg-slate-100 dark:bg-surface-dark border border-slate-200/60 dark:border-surface-border-dark'
          : 'border-b border-slate-200 dark:border-surface-border-dark rounded-none bg-transparent',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 shrink-0 rounded-xl outline-none select-none',
              isActive
                ? 'text-terracotta-600 dark:text-terracotta-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            )}
          >
            {isActive && variant === 'pills' && (
              <motion.div
                layoutId="active-tab-bg"
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-xs"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {isActive && variant === 'underline' && (
              <motion.div
                layoutId="active-tab-line"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta-500 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-xs font-semibold rounded-full',
                    isActive
                      ? 'bg-terracotta-500/15 text-terracotta-600 dark:text-terracotta-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
