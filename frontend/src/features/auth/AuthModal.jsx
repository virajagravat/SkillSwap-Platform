import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, BookOpen, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { login, register, loginWithGoogle } = useAuth();
  const toast = useToast();

  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [loginErrors, setLoginErrors] = useState({});

  // Register state
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    skillsToTeach: '',
    skillsToLearn: '',
    acceptTerms: true,
  });
  const [registerErrors, setRegisterErrors] = useState({});

  if (!isOpen) return null;

  // Validate Login Form
  const validateLogin = () => {
    const errors = {};
    if (!loginForm.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!loginForm.password) {
      errors.password = 'Password is required';
    } else if (loginForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Register Form
  const validateRegister = () => {
    const errors = {};
    if (!registerForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!registerForm.email.trim()) {
      errors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!registerForm.skillsToTeach.trim()) {
      errors.skillsToTeach = 'Please enter at least one skill you can teach';
    }
    if (!registerForm.skillsToLearn.trim()) {
      errors.skillsToLearn = 'Please enter at least one skill you want to learn';
    }
    if (!registerForm.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms to continue';
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);
    const result = await login(loginForm);
    setIsLoading(false);

    if (result.success) {
      toast.success(`Welcome back, ${result.user.fullName || 'User'}!`);
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  // Handle Register Submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setIsLoading(true);
    const result = await register(registerForm);
    setIsLoading(false);

    if (result.success) {
      toast.success(`Account created! Welcome to SkillSwap, ${result.user.fullName}!`);
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  // Handle Google OAuth Trigger
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const result = await loginWithGoogle();
    setIsLoading(false);

    if (result.success) {
      toast.success(`Signed in with Google as ${result.user.fullName}!`);
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-slate-200/80 dark:border-surface-border-dark overflow-hidden z-10 my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="p-8 pb-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-terracotta-500 to-terracotta-600 text-white flex items-center justify-center font-serif font-bold text-2xl shadow-glow">
              S
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-50">
              {tab === 'login' ? 'Welcome to SkillSwap' : 'Create Your Account'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {tab === 'login'
                ? 'Sign in to access your skill exchanges & sessions'
                : 'Join the peer-to-peer skill exchange community'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="px-8 mb-6">
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setLoginErrors({});
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                  tab === 'login'
                    ? 'bg-white dark:bg-surface-dark text-terracotta-600 dark:text-terracotta-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setRegisterErrors({});
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                  tab === 'register'
                    ? 'bg-white dark:bg-surface-dark text-terracotta-600 dark:text-terracotta-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="px-8 pb-8 space-y-4">
            {/* Google OAuth Login Button */}
            <Button
              variant="secondary"
              size="lg"
              className="w-full justify-center gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              onClick={handleGoogleAuth}
              leftIcon={<GoogleIcon />}
            >
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-surface-dark px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                Or with email
              </span>
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  error={loginErrors.email}
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  error={loginErrors.password}
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                      className="rounded border-slate-300 text-terracotta-500 focus:ring-terracotta-400"
                    />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info('Password reset endpoint will connect with Spring Boot');
                    }}
                    className="text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-2"
                >
                  Log In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="e.g. Viraj Agravat"
                  leftIcon={<User className="w-4 h-4" />}
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  error={registerErrors.fullName}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  error={registerErrors.email}
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  error={registerErrors.password}
                />

                <Input
                  label="Skills You Can Teach"
                  type="text"
                  placeholder="e.g. React.js, Python, UI Design"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  value={registerForm.skillsToTeach}
                  onChange={(e) => setRegisterForm({ ...registerForm, skillsToTeach: e.target.value })}
                  error={registerErrors.skillsToTeach}
                  helperText="Separate multiple skills with commas"
                />

                <Input
                  label="Skills You Want to Learn"
                  type="text"
                  placeholder="e.g. Spring Boot, DevOps, Spanish"
                  leftIcon={<BookOpen className="w-4 h-4" />}
                  value={registerForm.skillsToLearn}
                  onChange={(e) => setRegisterForm({ ...registerForm, skillsToLearn: e.target.value })}
                  error={registerErrors.skillsToLearn}
                  helperText="Separate multiple skills with commas"
                />

                {registerErrors.acceptTerms && (
                  <p className="text-xs text-rose-500 font-medium">{registerErrors.acceptTerms}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-2"
                >
                  Create Account
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
