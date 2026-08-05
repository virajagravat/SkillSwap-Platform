import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ServerOff } from 'lucide-react';
import Button from '../components/ui/Button';

const ServerErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center space-y-6 shadow-xl border border-rose-500/20">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <ServerOff className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-extrabold text-slate-900 dark:text-slate-50">
            500
          </h1>
          <h2 className="text-xl font-serif font-semibold text-slate-800 dark:text-slate-200">
            Server Connection Error
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unable to connect to Spring Boot backend service. Please check server logs or retry.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => window.location.reload()}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="mx-auto"
        >
          Retry Connection
        </Button>
      </div>
    </div>
  );
};

export default ServerErrorPage;
