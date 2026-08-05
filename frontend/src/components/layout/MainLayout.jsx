import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AuthModal from '../../features/auth/AuthModal';

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const handleOpenAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-light-muted text-slate-800 dark:bg-surface-dark-muted dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Header Navbar */}
      <Navbar
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        {/* Sidebar Drawer / Menu */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 flex flex-col">
          <Outlet context={{ openAuthModal: handleOpenAuthModal }} />
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </div>
  );
};

export default MainLayout;
