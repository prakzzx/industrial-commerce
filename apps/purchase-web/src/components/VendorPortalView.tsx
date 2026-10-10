import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { VendorQueueView } from './VendorQueueView';
import {
  LayoutDashboard,
  Tags,
  Boxes,
  Truck,
  Undo2,
  Gauge,
  TrendingUp,
  PackageCheck,
  IndianRupee,
  AlertTriangle
} from 'lucide-react';

type VendorTab = 'dashboard' | 'offers' | 'inventory' | 'fulfilment' | 'returns' | 'performance';

const VENDOR_OFFERS = [
  { sku: 'INS-CNMG-120408', name: 'Sandvik CoroTurn CNMG 12 04 08-PM 4325 Insert', price: 1850, moq: 1, leadDays: 1, status: 'ACTIVE' },
  { sku: 'ACC-ER32-SET18', name: 'ER32 Precision Spring Collet Set (18 Pcs)', price: 8900, moq: 1, leadDays: 1, status: 'ACTIVE' },
  { sku: 'RETRO-SPINDLE-75KW', name: 'INDXO XMACH 7.5kW Spindle Servo Retrofit Kit', price: 185000, moq: 1, leadDays: 5, status: 'PENDING_APPROVAL' }
];

const VENDOR_INVENTORY = [
  { sku: 'INS-CNMG-120408', warehouse: 'Chakan MIDC Hub', available: 120, reserved: 18 },
  { sku: 'ACC-ER32-SET18', warehouse: 'Chakan MIDC Hub', available: 22, reserved: 3 },
  { sku: 'RETRO-SPINDLE-75KW', warehouse: 'Bhosari Assembly Yard', available: 3, reserved: 1 }
];

const TABS: { id: VendorTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'offers', label: 'Offers', icon: Tags },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'fulfilment', label: 'Orders / Fulfilment / Shipment', icon: Truck },
  { id: 'returns', label: 'Returns', icon: Undo2 },
  { id: 'performance', label: 'Performance', icon: Gauge }
];

export const VendorPortalView: React.FC = () => {
  const { isDark } = useTheme();
  const { currentUser } = useAuth();
  const [tab, setTab] = useState<VendorTab>('dashboard');

  const cardCls = `border rounded-xl p-4 shadow-lg transition-colors ${
    isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
  }`;

  return (
    <div className="space-y-4">
      <div className={`${cardCls} p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold text-xs">Vendor Portal</span>
            <h1 className="text-lg font-black mt-1">{currentUser?.company || 'Vendor Enterprise'}</h1>
            <p className="text-xs text-slate-400">
              Manage assigned catalogue offers, stock, price requests, fulfilment and shipment status. Vendor onboarding and
              commercial settlement policy remain platform-owned.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800 pt-3">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  tab === t.id
                    ? 'bg-brand-cyan text-slate-950'
                    : isDark ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {tab === 'dashboard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Open Orders', value: '2', icon: Truck, color: 'text-brand-cyan' },
            { label: 'Fill Rate (30d)', value: '96.4%', icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Active Offers', value: VENDOR_OFFERS.length.toString(), icon: Tags, color: 'text-purple-400' },
            { label: 'Pending Approval', value: '1', icon: AlertTriangle, color: 'text-amber-400' }
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className={cardCls}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">{kpi.label}</span>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className={`text-2xl font-black mt-2 ${kpi.color}`}>{kpi.value}</div>
              </div>
            );
          })}
          <div className={`${cardCls} sm:col-span-2 xl:col-span-4`}>
            <h3 className="text-sm font-bold mb-2">Recent Activity</h3>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li>• New order received for Sandvik CoroTurn CNMG inserts — awaiting acceptance.</li>
              <li>• Price revision request submitted for ER32 collet set, pending Commerce Admin review.</li>
              <li>• Inventory feed sync completed for Chakan MIDC Hub (120 SKUs updated).</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'offers' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Assigned Catalogue Offers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={`uppercase tracking-wider border-b ${isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-300'}`}>
                <tr>
                  <th className="py-2 pr-3">SKU</th>
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">Price</th>
                  <th className="py-2 pr-3">MOQ</th>
                  <th className="py-2 pr-3">Lead Days</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                {VENDOR_OFFERS.map(o => (
                  <tr key={o.sku}>
                    <td className="py-2 pr-3 font-mono text-brand-cyan">{o.sku}</td>
                    <td className="py-2 pr-3">{o.name}</td>
                    <td className="py-2 pr-3 font-bold">₹{o.price.toLocaleString()}</td>
                    <td className="py-2 pr-3">{o.moq}</td>
                    <td className="py-2 pr-3">{o.leadDays}d</td>
                    <td className="py-2 pr-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <button
                        onClick={() => alert(`Price/stock revision request submitted for ${o.sku}, routed to INDXO Commerce Admin for approval.`)}
                        className="text-brand-cyan hover:underline font-semibold"
                      >
                        Request Change
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'inventory' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Inventory Balances</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={`uppercase tracking-wider border-b ${isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-300'}`}>
                <tr>
                  <th className="py-2 pr-3">SKU</th>
                  <th className="py-2 pr-3">Warehouse / Site</th>
                  <th className="py-2 pr-3">Available</th>
                  <th className="py-2 pr-3">Reserved</th>
                  <th className="py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                {VENDOR_INVENTORY.map(i => (
                  <tr key={i.sku}>
                    <td className="py-2 pr-3 font-mono text-brand-cyan">{i.sku}</td>
                    <td className="py-2 pr-3">{i.warehouse}</td>
                    <td className="py-2 pr-3 font-bold text-emerald-400">{i.available}</td>
                    <td className="py-2 pr-3 text-amber-400">{i.reserved}</td>
                    <td className="py-2 pr-3">
                      <button
                        onClick={() => alert(`Inventory feed sync triggered for ${i.sku}.`)}
                        className="flex items-center space-x-1 text-brand-cyan hover:underline font-semibold"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Sync Feed</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'fulfilment' && <VendorQueueView />}

      {tab === 'returns' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Return / Quality Claims Requiring Vendor Action</h3>
          <div className="space-y-3 text-xs">
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">RETURN-2026-0142 · FANUC 3V Backup Battery</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                  AWAITING VENDOR INSPECTION
                </span>
              </div>
              <p className="text-slate-400 mt-1">Reason: Defective / out of tolerance. Requested resolution: Replacement.</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => alert('Return approved. Reverse-pickup logistics scheduled.')} className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold">
                  Approve Return
                </button>
                <button onClick={() => alert('Return rejected with vendor remarks recorded.')} className="px-3 py-1.5 rounded border border-red-700 text-red-400 hover:bg-red-950/40 font-semibold">
                  Reject
                </button>
              </div>
            </div>
            <p className="text-slate-400">No further pending return claims at this time.</p>
          </div>
        </div>
      )}

      {tab === 'performance' && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4`}>
          {[
            { label: 'Fill Rate', value: '96.4%', icon: TrendingUp },
            { label: 'Cancellation Rate', value: '1.2%', icon: AlertTriangle },
            { label: 'Delivery SLA Adherence', value: '92.8%', icon: Truck },
            { label: 'Buyer Rating', value: '4.7 / 5', icon: IndianRupee }
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className={cardCls}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">{kpi.label}</span>
                  <Icon className="w-4 h-4 text-brand-cyan" />
                </div>
                <div className="text-2xl font-black mt-2 text-brand-cyan">{kpi.value}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
