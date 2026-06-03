import React from 'react';
import { CalendarDays } from 'lucide-react';

const SidebarHeader = ({ isMobile, onClose }) => {
  return (
    <div
      className="px-4 border-b border-white/10 bg-[#344867]/70 backdrop-blur-sm flex items-center justify-between"
      style={{ height: 'var(--layout-header-height)' }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#f34868]/20 flex items-center justify-center border border-[#f34868]/30">
          <CalendarDays className="w-5 h-5 text-[#f66a84]" />
        </div>
        <div className="leading-tight">
          <p className="text-white text-[13px] font-semibold">Timetable</p>
          <p className="text-white/55 text-[11px]">Navigation</p>
        </div>
      </div>

      {isMobile && (
        <button
          onClick={onClose}
          className="px-2.5 py-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs"
          aria-label="Close sidebar"
        >
          Close
        </button>
      )}
    </div>
  );
};

export default SidebarHeader;
