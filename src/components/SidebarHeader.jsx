import React from 'react';
import { CalendarDays, X } from 'lucide-react';
import logoImg from '../assets/logo.png';

const SidebarHeader = ({ isMobile, onClose }) => {
  return (
    <div
      className="px-4 border-b border-white/10 bg-[#344867]/70 backdrop-blur-sm flex items-center justify-between"
      style={{ height: 'var(--layout-header-height)' }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 flex items-center justify-center shrink-0">
          <img src={logoImg} alt="Logo" className="w-9 h-9 object-contain keep-colors" />
        </div>
        <div className="leading-tight">
          <p className="text-white text-[13px] font-semibold">Timetable</p>
          <p className="text-white/55 text-[11px]">Navigation</p>
        </div>
      </div>

      {isMobile && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-all duration-200"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SidebarHeader;
