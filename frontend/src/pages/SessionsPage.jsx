import React from 'react';
import { Calendar } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../components/ui/Card';

const SessionsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50">
          Video Sessions & Calendar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Scheduled 1-on-1 video exchange sessions.
        </p>
      </div>

      <Card glass className="p-8 text-center space-y-3">
        <Calendar className="w-10 h-10 mx-auto text-emerald-500" />
        <CardTitle>Sessions Module Ready</CardTitle>
        <CardDescription>
          Calendar booking modals and video room integration will be implemented in Module 5.
        </CardDescription>
      </Card>
    </div>
  );
};

export default SessionsPage;
