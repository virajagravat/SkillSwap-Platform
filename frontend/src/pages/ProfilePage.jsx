import React from 'react';
import { User, Sparkles, BookOpen, Edit, Mail } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50">
          User Profile Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, availability, and skills. (Module 3 Profile Management)
        </p>
      </div>

      {user && (
        <Card glass className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <Avatar name={user.fullName} src={user.avatarUrl} size="xl" status="online" />
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                  {user.fullName}
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="terracotta" size="sm">
                    {user.swapsCompleted || 0} Swaps Completed
                  </Badge>
                  <Badge variant="amber" size="sm">
                    ★ {user.rating || 5.0} Rating
                  </Badge>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
              Edit Profile Details
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" /> Skills You Can Teach
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.skillsToTeach?.map((s, i) => (
                  <Badge key={i} variant="emerald">{s}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-terracotta-500" /> Skills You Want to Learn
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.skillsToLearn?.map((s, i) => (
                  <Badge key={i} variant="terracotta">{s}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
