import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, BarChart3, Settings } from 'lucide-react';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ isOpen, setIsOpen, activeMenu, setActiveMenu }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    // Only auto-close on mobile screens
    if (isMobile) {
      setIsOpen(false);
    }
  };

  if (!isOpen && !isMobile) {
    // When sidebar is closed on desktop, return null (don't render)
    return null;
  }

  return (
    <>
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`h-full bg-[#2a3950] border-r border-white/10 flex flex-col ${
          isMobile ? 'fixed top-0 left-0 z-40 w-64 shadow-2xl' : 'relative w-64'
        } ${isOpen ? 'block' : 'hidden'}`}
      >
        <SidebarHeader isMobile={isMobile} onClose={() => setIsOpen(false)} />

        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 mb-1.5 border ${
                  isActive
                    ? 'bg-[#f34868] text-white border-transparent'
                    : 'text-white/70 border-transparent hover:bg-white/8 hover:text-white hover:border-white/10'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-[14px]">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <SidebarFooter />
      </div>
    </>
  );
};

export default Sidebar;