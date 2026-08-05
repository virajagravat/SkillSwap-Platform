import React from 'react';
import { Zap } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../components/ui/Card';

const SmartMatchesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50">
          Smart Matches
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Automated skill overlap recommendations between learners & teachers.
        </p>
      </div>

      <Card glass className="p-8 text-center space-y-3">
        <Zap className="w-10 h-10 mx-auto text-amber-500" />
        <CardTitle>Matchmaking Module Ready</CardTitle>
        <CardDescription>
          Full matchmaking cards and teach/learn correlation engine will be linked in Module 4.
        </CardDescription>
      </Card>
    </div>
  );
};

export default SmartMatchesPage;
