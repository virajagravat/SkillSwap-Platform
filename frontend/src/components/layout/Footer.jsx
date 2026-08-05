import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-surface-border-dark bg-white/50 dark:bg-surface-dark/50 backdrop-blur-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-terracotta-500 to-terracotta-600 text-white flex items-center justify-center font-serif font-bold text-lg shadow-glow">
                S
              </div>
              <span className="font-serif font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-50">
                SkillSwap
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              SkillSwap is a peer-to-peer barter platform where developers and creators exchange technical expertise without monetary costs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/skills" className="hover:text-terracotta-500 transition-colors">
                  Browse Skills Catalog
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-terracotta-500 transition-colors">
                  Smart Match Engine
                </Link>
              </li>
              <li>
                <Link to="/sessions" className="hover:text-terracotta-500 transition-colors">
                  Live Video Swaps
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-terracotta-500 transition-colors">
                  Community Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <span className="text-slate-400">Spring Boot REST Ready</span>
              </li>
              <li>
                <span className="text-slate-400">React 19 + Tailwind CSS</span>
              </li>
              <li>
                <span className="text-slate-400">Modular Architecture</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SkillSwap. Built with React & Spring Boot readiness.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
