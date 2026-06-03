import React from 'react';

const SidebarFooter = () => {
  return (
    <div className="p-2 border-t border-white/10 bg-[#344867]/35">
      <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5">
        <p className="text-white text-[11px] font-medium">Tip</p>
        <p className="text-white/60 text-[10px] mt-0.5 leading-relaxed">
          Use the menu toggle in the header to focus on content.
        </p>
      </div>
    </div>
  );
};

export default SidebarFooter;
