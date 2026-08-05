import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import ErrorBoundary from './components/feedback/ErrorBoundary';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Select from './components/ui/Select';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/Card';
import Badge from './components/ui/Badge';
import Avatar from './components/ui/Avatar';
import Tabs from './components/ui/Tabs';
import Skeleton from './components/ui/Skeleton';
import {
  Sun,
  Moon,
  Sparkles,
  Search,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Layers,
  Palette,
  Bell,
  Code2,
  BookOpen
} from 'lucide-react';

function ModuleZeroShowcase() {
  const { theme, toggleTheme, isDark } = useTheme();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('components');
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Action completed successfully!');
    }, 2000);
  };

  const tabsConfig = [
    { id: 'components', label: 'UI Atoms', icon: <Layers /> },
    { id: 'toasts', label: 'Toast Alerts', icon: <Bell /> },
    { id: 'skeletons', label: 'Skeletons', icon: <Code2 /> },
    { id: 'tokens', label: 'Design Tokens', icon: <Palette /> },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 max-w-7xl mx-auto transition-colors duration-300">
      {/* Top Bar Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200 dark:border-surface-border-dark">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-terracotta-500 to-terracotta-600 text-white flex items-center justify-center font-serif font-bold text-xl shadow-glow">
              S
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              SkillSwap <span className="text-terracotta-500 text-sm font-sans font-normal border border-terracotta-500/30 bg-terracotta-500/10 px-2.5 py-0.5 rounded-full ml-2">Module 0</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Core Themes, Configurations, and Atom UI Library Baseline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={toggleTheme}
            leftIcon={isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => toast.info('Welcome to SkillSwap Modular Development!')}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Module 0 Active
          </Button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="mb-8">
        <Tabs tabs={tabsConfig} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab 1: Components Overview */}
      {activeTab === 'components' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Buttons Section */}
          <Card glass hover>
            <CardHeader>
              <CardTitle>Buttons & States</CardTitle>
              <CardDescription>Terracotta primary palette with focus ring animations and loading state support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="md">Primary Action</Button>
                <Button variant="secondary" size="md">Secondary</Button>
                <Button variant="outline" size="md">Outline</Button>
                <Button variant="ghost" size="md">Ghost</Button>
                <Button variant="danger" size="md">Danger</Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large Hero</Button>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  onClick={triggerLoading}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Click to Test Loading
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inputs & Selects Section */}
          <Card glass hover>
            <CardHeader>
              <CardTitle>Inputs & Selection Controls</CardTitle>
              <CardDescription>Styled form elements with label, icons, and error handling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Search Skills"
                placeholder="e.g. React, Spring Boot, UI Design..."
                leftIcon={<Search className="w-4 h-4" />}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Type anything to simulate input."
              />

              <Input
                label="Email Address"
                placeholder="user@skillswap.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={inputValue.includes('error') ? 'Invalid email domain provided' : undefined}
                helperText="Type 'error' in search box above to toggle error state here."
              />

              <Select
                label="Skill Level Category"
                placeholder="Choose skill proficiency"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { value: 'beginner', label: 'Beginner (0-1 yrs)' },
                  { value: 'intermediate', label: 'Intermediate (1-3 yrs)' },
                  { value: 'advanced', label: 'Advanced (3+ yrs)' },
                  { value: 'master', label: 'Master / Mentor' },
                ]}
                icon={<BookOpen className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          {/* Avatars & Badges Section */}
          <Card glass hover>
            <CardHeader>
              <CardTitle>Avatars & Status Indicators</CardTitle>
              <CardDescription>User profile avatars with initials fallback and active status badges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                <Avatar name="Viraj Agravat" size="sm" status="online" />
                <Avatar name="Viraj Agravat" size="md" status="online" />
                <Avatar name="Viraj Agravat" size="lg" status="busy" />
                <Avatar name="Antigravity AI" size="xl" status="offline" />
                <Avatar name="Alex Smith" size="lg" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" status="online" />
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-2">
                <Badge variant="terracotta" dot>Terracotta</Badge>
                <Badge variant="emerald" dot>Available</Badge>
                <Badge variant="amber" dot>In Swap</Badge>
                <Badge variant="sky">React JS</Badge>
                <Badge variant="rose">Offline</Badge>
                <Badge variant="slate">Spring Boot</Badge>
                <Badge variant="outline">Badge Outline</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Glassmorphism Demo Card */}
          <Card glass hover className="border-terracotta-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="terracotta" dot>Barter Match</Badge>
                <span className="text-xs text-slate-400 font-mono">ID: #SKL-9042</span>
              </div>
              <CardTitle className="mt-2">Full-Stack Development Barter</CardTitle>
              <CardDescription>Teach React 19 Frontend ↔ Learn Spring Boot REST API</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                This glass card demonstrates the modern glassmorphic background effect with subtle backdrop blur, terracotta accents, and smooth hover micro-animations.
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-3">
                <Avatar name="Viraj Agravat" size="sm" status="online" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Viraj Agravat</p>
                  <p className="text-slate-400">4.9 ★ (24 Swaps)</p>
                </div>
              </div>
              <Button variant="primary" size="sm">Propose Swap</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Tab 2: Toast Alerts */}
      {activeTab === 'toasts' && (
        <Card glass className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Framer Motion Toast Alerts</CardTitle>
            <CardDescription>Global notification triggers with smooth pop animations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Click any button below to emit live toast alerts to the top-right corner:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => toast.success('Skill request accepted by peer!')}
                leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              >
                Trigger Success Toast
              </Button>

              <Button
                variant="outline"
                onClick={() => toast.error('Failed to connect to backend service.')}
                leftIcon={<XCircle className="w-4 h-4 text-rose-500" />}
              >
                Trigger Error Toast
              </Button>

              <Button
                variant="outline"
                onClick={() => toast.warning('Your session starts in 10 minutes!')}
                leftIcon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
              >
                Trigger Warning Toast
              </Button>

              <Button
                variant="outline"
                onClick={() => toast.info('New smart skill recommendation available.')}
                leftIcon={<Info className="w-4 h-4 text-terracotta-500" />}
              >
                Trigger Info Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Skeletons */}
      {activeTab === 'skeletons' && (
        <Card glass className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Shimmer Skeleton Loaders</CardTitle>
            <CardDescription>Placeholder components during asynchronous API fetches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width={48} height={48} />
              <div className="space-y-2 flex-1">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>

            <Skeleton variant="rectangular" height={120} />

            <div className="space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="75%" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Design Tokens */}
      {activeTab === 'tokens' && (
        <Card glass className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>SkillSwap Palette & Typography</CardTitle>
            <CardDescription>Terracotta Brand Palette & Google Font Pairing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-3">Terracotta Palette</h4>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {[
                  { label: '50', bg: 'bg-terracotta-50' },
                  { label: '100', bg: 'bg-terracotta-100' },
                  { label: '200', bg: 'bg-terracotta-200' },
                  { label: '300', bg: 'bg-terracotta-300' },
                  { label: '400', bg: 'bg-terracotta-400' },
                  { label: '500', bg: 'bg-terracotta-500' },
                  { label: '600', bg: 'bg-terracotta-600' },
                  { label: '700', bg: 'bg-terracotta-700' },
                  { label: '800', bg: 'bg-terracotta-800' },
                  { label: '900', bg: 'bg-terracotta-900' },
                ].map((color) => (
                  <div key={color.label} className="text-center">
                    <div className={`h-10 rounded-lg ${color.bg} shadow-xs border border-slate-200/50 dark:border-transparent`} />
                    <span className="text-[10px] font-mono text-slate-500">{color.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-surface-border-dark grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Display Font (Fraunces Serif)</h4>
                <p className="font-serif text-2xl text-slate-900 dark:text-slate-100">
                  Swap Skills, Empower Growth.
                </p>
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">Body Font (Inter Sans)</h4>
                <p className="font-sans text-sm text-slate-600 dark:text-slate-300">
                  Connect with peer developers, exchange knowledge in live video sessions, and master new skills.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <ModuleZeroShowcase />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
