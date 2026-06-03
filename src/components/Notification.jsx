import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  return (
    <div className="fixed top-[12px] right-4 sm:right-20 z-[200] flex items-center gap-2 sm:gap-3 bg-[#1f2b3d] border border-white/10 text-white/90 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className={`rounded-full p-0.5 sm:p-1 flex items-center justify-center ${notification.type === 'error' ? 'bg-red-500' : 'bg-[#f34868]'}`}>
        {notification.type === 'error' ? <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" /> : <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
      </div>
      
      {/* Text */}
      <span className="text-xs sm:text-[13px] font-medium tracking-wide whitespace-nowrap">
        {notification.text}
      </span>
      
      <button onClick={onClose} className="text-white/40 hover:text-white ml-1 sm:ml-2 transition-colors flex items-center justify-center">
        <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>
    </div>
  );
};

export default Notification;
