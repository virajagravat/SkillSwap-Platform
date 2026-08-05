import React from 'react';
import { Star } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../components/ui/Card';

const ReviewsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50">
          Reviews & Endorsements
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Peer feedback and ratings received after sessions.
        </p>
      </div>

      <Card glass className="p-8 text-center space-y-3">
        <Star className="w-10 h-10 mx-auto text-amber-400" />
        <CardTitle>Reviews Module Ready</CardTitle>
        <CardDescription>
          Review submission dialogs and rating star displays will be built in Module 6.
        </CardDescription>
      </Card>
    </div>
  );
};

export default ReviewsPage;
