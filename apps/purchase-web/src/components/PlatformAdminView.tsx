import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ShieldAlert, Building2, Activity, Key } from 'lucide-react';

export const PlatformAdminView: React.FC = () => {
  const { isDark } = useTheme();

  const cardCls = `border rounded-xl p-4 shadow-lg transition-colors ${
    isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
  }`;

  return (
    <div className="space-y-4">
      <div
        className={`border rounded-xl p-5 shadow-lg transition-colors ${
          isDark ? 'bg-[#3d1319] border-red-900/60 text-red-200' : 'bg-[#fef2f2] border-red-200 text-red-800'
        }`}
      >
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="text-sm font-black uppercase tracking-wider">Platform Super Admin — Remains Outside Module</h2>
        </div>
        <p className="text-xs mt-2 max-w-2xl">
          Per the architecture design, tenant access, AMC/payment/feature entitlement and other global controls are owned
          by the parent INDXO Playbook / XMACH platform, not the Purchase Portal module. The panels below are read-only
          references the module is allowed to call; nothing here writes to production identity or entitlement systems.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={cardCls}>
          <div className="flex items-center space-x-2 text-brand-cyan">
            <Key className="w-4 h-4" />
            <h3 className="text-sm font-bold">Feature Entitlement</h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">PURCHASE_PORTAL feature flag status for this tenant.</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span>PURCHASE_PORTAL</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px]">ENABLED</span>
          </div>
        </div>

        <div className={cardCls}>
          <div className="flex items-center space-x-2 text-brand-cyan">
            <Building2 className="w-4 h-4" />
            <h3 className="text-sm font-bold">Tenant Access</h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">Tenant identity is read from trusted authenticated context.</p>
          <div className="mt-3 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Tenant</span><span className="font-bold">INDXO AI P Ltd</span></div>
            <div className="flex justify-between mt-1"><span className="text-slate-400">Environment</span><span className="font-bold">Sandbox</span></div>
          </div>
        </div>

        <div className={cardCls}>
          <div className="flex items-center space-x-2 text-brand-cyan">
            <Activity className="w-4 h-4" />
            <h3 className="text-sm font-bold">Global Integration Health</h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">Parent contract health as seen by the module.</p>
          <div className="mt-3 space-y-1.5 text-xs">
            {['IdentityContext', 'PaymentService', 'InvoiceService', 'NotificationService'].map(s => (
              <div key={s} className="flex justify-between">
                <span className="text-slate-400">{s}</span>
                <span className="text-emerald-400 font-semibold">Healthy</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
