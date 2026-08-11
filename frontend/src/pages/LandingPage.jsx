import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Users,
  Video,
  CheckCircle2,
  BookOpen,
  Code2
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const toast = useToast();
  const outletContext = useOutletContext();
  const openAuthModal = outletContext?.openAuthModal || (() => {});
  const handledAuthError = useRef(false);

  // Auto-redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (location.state?.authError && !handledAuthError.current) {
      handledAuthError.current = true;
      toast.warning(location.state.authError);
      navigate('/', { replace: true });
    }
  }, [location.state, navigate, toast]);

  const handleHeroCTA = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      openAuthModal('register');
    }
  };

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-terracotta-500/10 via-surface-light to-amber-500/10 dark:from-terracotta-950/30 dark:via-surface-dark dark:to-amber-950/20 border border-terracotta-500/20 p-8 sm:p-14 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <Badge variant="terracotta" size="lg" dot className="mx-auto">
            1-on-1 Peer Skill Barter Platform
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-[1.15]">
            Exchange Skills.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-500 to-terracotta-600">
              No Money Needed.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Trade technical knowledge directly with fellow developers. Teach React in exchange for Spring Boot, UI design for Python, or languages for DevOps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleHeroCTA}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Join SkillSwap Free'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/skills')}
              leftIcon={<Sparkles className="w-5 h-5" />}
            >
              Explore Skill Catalog
            </Button>
          </div>
        </div>

        {/* Floating Skill Badges Preview */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10 opacity-90">
          <Badge variant="sky" size="md">React.js ⚛️</Badge>
          <Badge variant="emerald" size="md">Spring Boot 🍃</Badge>
          <Badge variant="amber" size="md">Figma UI/UX 🎨</Badge>
          <Badge variant="rose" size="md">Python & ML 🐍</Badge>
          <Badge variant="terracotta" size="md">PostgreSQL 🐘</Badge>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-50">
            How Skill Bartering Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A simple 3-step workflow to learn and teach simultaneously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card glass hover className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-500/10 text-terracotta-500 flex items-center justify-center font-bold text-xl">
              1
            </div>
            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100">
              List Your Skills
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Add what you can teach to peers and specify what technical skills you want to learn in return.
            </p>
          </Card>

          <Card glass hover className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xl">
              2
            </div>
            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100">
              Get Smart Matches
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our matchmaking algorithm pairs you with peers whose teach/learn preferences overlap with yours.
            </p>
          </Card>

          <Card glass hover className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xl">
              3
            </div>
            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100">
              Swap Knowledge 1-on-1
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Schedule live video sessions, share code, and leave peer reviews after completed exchanges.
            </p>
          </Card>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-surface-dark border border-slate-200/80 dark:border-surface-border-dark space-y-4">
          <div className="w-10 h-10 rounded-xl bg-terracotta-500/10 text-terracotta-500 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
            Fair & Balanced Exchanges
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Every session is structured so both participants spend equal time teaching and learning, ensuring mutual growth.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-surface-dark border border-slate-200/80 dark:border-surface-border-dark space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
            Integrated Video Rooms
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Built-in mock meeting rooms with screen layout toggles and real-time session timers.
          </p>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white p-8 sm:p-12 text-center shadow-glow">
        <h2 className="text-3xl font-serif font-extrabold mb-3">Ready to swap your first skill?</h2>
        <p className="text-sm opacity-90 max-w-lg mx-auto mb-6">
          Join SkillSwap today and start exchanging knowledge with developers around the globe.
        </p>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleHeroCTA}
          className="bg-white text-terracotta-600 hover:bg-slate-100 shadow-lg border-none font-bold"
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
        </Button>
      </section>
    </div>
  );
};

export default LandingPage;
