import React from 'react';
import { Search } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const SearchSkillsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50">
          Browse Skills Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Find peers offering skills you want to learn. (Module 4 Explorer)
        </p>
      </div>

      <Card glass className="p-8 text-center space-y-3">
        <Search className="w-10 h-10 mx-auto text-terracotta-500" />
        <CardTitle>Skill Explorer Module Ready</CardTitle>
        <CardDescription>
          Routes & Layout shell operational. Full search, category filters, and skill cards will be built in Module 4.
        </CardDescription>
      </Card>
    </div>
  );
};

export default SearchSkillsPage;
