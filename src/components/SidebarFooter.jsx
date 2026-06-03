import React from 'react';

const SidebarFooter = () => {
  return (
    <div className="p-4 border-t border-white/10 bg-[#344867]/35">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <p className="text-white text-xs font-medium">Tip</p>
        <p className="text-white/60 text-[11px] mt-1 leading-relaxed">
          Use the menu toggle in the header to focus on content.
        </p>
      </div>
    </div>
  );
};

export default SidebarFooter;
