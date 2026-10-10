import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { SEED_PRODUCTS } from '../services/api';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface MachineSparesViewProps {
  onOrderSpare: () => void;
}

export const MachineSparesView: React.FC<MachineSparesViewProps> = ({ onOrderSpare }) => {
  const { isDark } = useTheme();
  const { addToCart } = useCart();

  const handleAddSpare = (prodId: string) => {
    const p = SEED_PRODUCTS.find(item => item.id === prodId);
    if (p) {
      addToCart(p, p.offers[0]);
      onOrderSpare();
    }
  };

  return (
    <div
      className={`border rounded-xl p-5 shadow-lg space-y-4 transition-colors ${
        isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold">XMACH Contextual Machine Spares & Consumables</h2>
          <p className="text-xs text-slate-400">
            Automatically linked to real-time machine telemetry, active CNC alarms, and tool wear predictive models.
          </p>
        </div>
        <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center space-x-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>2 Active Equipment Alerts</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Machine 1 */}
        <div
          className={`border border-amber-500/60 rounded-xl p-4 text-xs space-y-3 shadow-md ${
            isDark ? 'bg-slate-900/90' : 'bg-amber-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <h4 className="font-bold text-sm">Haas VF-2SS VMC (Bay 3 - Milling Section)</h4>
            </div>
            <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold text-[10px] border border-red-800">
              CRITICAL ALARM
            </span>
          </div>

          <div className="p-2.5 rounded bg-red-950/40 border border-red-900 text-red-200 font-mono text-[11px]">
            ALM-310: APC BATTERY VOLTAGE LOW (FANUC Alpha Servo Axis Z)
          </div>

          <p className="text-slate-400 text-[11px]">
            Machine telemetry detected backup battery voltage dropped below 2.8V. Replace within 48 hours to avoid encoder absolute position loss and spindle recalibration downtime.
          </p>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-brand-cyan">FANUC 3V Lithium Backup Battery (A06B-6114-K504)</div>
              <div className="text-[10px] text-slate-400">Vendor: CNC Parts Direct • ₹2,450 (1 day delivery)</div>
            </div>
            <button
              onClick={() => handleAddSpare('PROD-002')}
              className="px-3 py-1.5 rounded bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyanHover transition flex items-center space-x-1"
            >
              <span>Order Spare</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Machine 2 */}
        <div
          className={`border border-blue-500/50 rounded-xl p-4 text-xs space-y-3 shadow-md ${
            isDark ? 'bg-slate-900/90' : 'bg-blue-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h4 className="font-bold text-sm">Jyoti CNC Turning Center DX 200 (Bay 1)</h4>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold text-[10px] border border-amber-800">
              TOOL LIFE 85%
            </span>
          </div>

          <div className="p-2.5 rounded bg-amber-950/40 border border-amber-900 text-amber-200 font-mono text-[11px]">
            PREDICTIVE REORDER: CNMG 120408 Inserts approaching edge life limit (62 components left)
          </div>

          <p className="text-slate-400 text-[11px]">
            CNC spindle load monitor indicates wear increase on Station 4 OD turning tool. Reorder pack of 10 inserts to maintain continuous shift production.
          </p>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-brand-cyan">Sandvik CoroTurn CNMG 12 04 08-PM 4325</div>
              <div className="text-[10px] text-slate-400">Vendor: Apex Industrial Tooling • ₹1,850/pack</div>
            </div>
            <button
              onClick={() => handleAddSpare('PROD-001')}
              className="px-3 py-1.5 rounded bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyanHover transition flex items-center space-x-1"
            >
              <span>Reorder Inserts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
