import React from 'react';
import { Menu, User } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen, theme, toggleTheme }) => {
  return (
    <header
      className="bg-[#2d3f5d]/95 border-b border-white/10 sticky top-0 z-30 backdrop-blur-sm shadow-[0_8px_22px_rgba(0,0,0,0.18)]"
      style={{ height: 'var(--layout-header-height)' }}
    >
        <div className="flex items-center justify-between px-4 h-full">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.13] border border-white/10 transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#f34868]/20 border border-[#f34868]/30 flex items-center justify-center">
              <User className="w-4 h-4 text-[#f34868]" />
            </div>
            <span className="text-white/90 text-sm hidden sm:inline">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;