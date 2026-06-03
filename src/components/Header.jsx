import React from 'react';
import { Menu, User } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen, theme, toggleTheme }) => {
  return (
    <header
      className="bg-[#2d3f5d]/95 border-b border-white/10 sticky top-0 z-30 backdrop-blur-sm shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
      style={{ height: 'var(--layout-header-height)' }}
    >
        <div className="flex items-center justify-between px-4 h-full">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors overflow-hidden">
              <User className="w-5 h-5 text-white/80" />
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-40 bg-[#1f2b3d] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-white/50 border-b border-white/10 uppercase tracking-wider mb-1">Account</div>
                <button className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors">Profile</button>
                <button className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors">Settings</button>
                <button className="w-full text-left px-4 py-2 text-sm text-[#f34868] hover:bg-white/10 transition-colors">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;