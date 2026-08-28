import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((msgOrObj, typeParam = 'info', durationParam = 4000) => {
    let message = '';
    let type = typeParam;
    let duration = durationParam;

    if (typeof msgOrObj === 'string') {
      message = msgOrObj;
    } else if (msgOrObj && typeof msgOrObj === 'object') {
      message = msgOrObj.message || '';
      type = msgOrObj.type || 'info';
      duration = msgOrObj.duration || 4000;
    }

    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message, duration) => showToast({ message, type: 'success', duration }), [showToast]);
  const error = useCallback((message, duration) => showToast({ message, type: 'error', duration }), [showToast]);
  const info = useCallback((message, duration) => showToast({ message, type: 'info', duration }), [showToast]);
  const warning = useCallback((message, duration) => showToast({ message, type: 'warning', duration }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md ${
                toast.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : toast.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
                  : toast.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
                  : 'bg-terracotta-500/10 border-terracotta-500/30 text-terracotta-800 dark:text-terracotta-300'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-terracotta-500 shrink-0" />}

              <p className="text-sm font-medium flex-1">{toast.message}</p>

              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                aria-label="Close notification"
              >
                <X className="w-4 h-4 opacity-60 hover:opacity-100" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
