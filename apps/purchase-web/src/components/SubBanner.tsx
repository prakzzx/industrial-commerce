import React from 'react';

export const SubBanner: React.FC = () => {
  return (
    <div className="bg-[#005f38] text-emerald-100 text-xs font-medium py-1 px-4 text-center tracking-wide shadow-inner flex items-center justify-center space-x-2 select-none">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span className="font-semibold">Live DB · XMACH Purchase Portal</span>
      <span className="text-emerald-300/80 text-[11px] hidden sm:inline">• Tenant: INDXO Playbook SaaS Active • GST Ready</span>
    </div>
  );
};
