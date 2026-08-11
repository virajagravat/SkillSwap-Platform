import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isRegister = activeTab === 'register';

  const handleGoogleAuth = () => {
    setIsLoading(true);
    loginWithGoogle(isRegister ? 'register' : 'login');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative z-10 my-8 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-surface-border-dark dark:bg-surface-dark"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-8 pb-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-terracotta-500 to-terracotta-600 font-serif text-2xl font-bold text-white shadow-glow">
              S
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-50">
              {isRegister ? 'Register with Google' : 'Login with Google'}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isRegister
                ? 'New users create an account using Google.'
                : 'Existing users continue using the registered Google account.'}
            </p>
          </div>

          <div className="mx-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-semibold dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`rounded-lg px-3 py-2 transition-colors ${
                isRegister
                  ? 'bg-white text-terracotta-600 shadow-sm dark:bg-surface-dark dark:text-terracotta-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`rounded-lg px-3 py-2 transition-colors ${
                !isRegister
                  ? 'bg-white text-terracotta-600 shadow-sm dark:bg-surface-dark dark:text-terracotta-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Login
            </button>
          </div>

          <div className="space-y-4 p-8">
            <Button
              size="lg"
              className="w-full"
              isLoading={isLoading}
              onClick={handleGoogleAuth}
              leftIcon={isRegister ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            >
              {isRegister ? 'Register with Google' : 'Login with Google'}
            </Button>

            <button
              type="button"
              onClick={() => setActiveTab(isRegister ? 'login' : 'register')}
              className="w-full text-center text-xs font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700 dark:text-terracotta-400"
            >
              {isRegister ? 'Already registered? Login with Google' : 'New user? Register with Google first'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
