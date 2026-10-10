import React, { useState, useEffect } from 'react';

export const BottomFooter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTime(now.toLocaleString('en-US', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-[#090d16] text-slate-400 border-t border-slate-800/90 px-4 py-1.5 text-[11px] flex flex-col md:flex-row items-center justify-between gap-1 z-20 select-none">
      <div className="flex items-center space-x-3 flex-wrap">
        <span>Open tasks <strong className="text-brand-cyan">1</strong></span>
        <span className="text-slate-600">•</span>
        <span>Advance Taken <strong className="text-white">₹0</strong></span>
        <span className="text-slate-600">•</span>
        <span>Settled <strong className="text-white">₹0</strong></span>
        <span className="text-slate-600">•</span>
        <span>Outstanding <strong className="text-white">₹0</strong></span>
        <span className="text-slate-600">•</span>
        <span>Present days <strong className="text-white">1 (2026-09)</strong></span>
      </div>

      <div className="flex items-center space-x-3">
        <span>INDXO AI P Ltd • XMACH • Ver 2.3.30</span>
        <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
          Live DB
        </span>
        <span className="font-mono text-slate-300">{currentTime || 'Wed, 02 Sept, 2026, 12:14:03 pm'}</span>
      </div>
    </footer>
  );
};
