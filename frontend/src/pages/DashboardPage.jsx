import React from 'react';
import { LayoutDashboard, Sparkles, Zap, Calendar, Inbox } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50">
            Welcome back, {user?.fullName || 'Developer'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is your SkillSwap activity overview and active skill exchanges.
          </p>
        </div>
        <Badge variant="terracotta" size="lg" dot>
          Active Member
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glass className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-terracotta-500/10 text-terracotta-500 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-bold">Skills Swapping</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {(user?.skillsToTeach?.length || 0) + (user?.skillsToLearn?.length || 0)} Active
            </p>
          </div>
        </Card>

        <Card glass className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-bold">Completed Swaps</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {user?.swapsCompleted || 0} Sessions
            </p>
          </div>
        </Card>

        <Card glass className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-bold">Rating Score</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {user?.rating || 5.0} ★
            </p>
          </div>
        </Card>

        <Card glass className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-bold">Swap Requests</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">0 Pending</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
