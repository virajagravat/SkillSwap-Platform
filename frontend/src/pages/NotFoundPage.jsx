import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center space-y-6 shadow-xl border border-slate-200/80 dark:border-surface-border-dark">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-terracotta-500/10 text-terracotta-500 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-extrabold text-slate-900 dark:text-slate-50">
            404
          </h1>
          <h2 className="text-xl font-serif font-semibold text-slate-800 dark:text-slate-200">
            Page Not Found
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/')}
          leftIcon={<Home className="w-4 h-4" />}
          className="mx-auto"
        >
          Back to Homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
