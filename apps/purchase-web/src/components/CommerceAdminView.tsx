import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { SEED_PRODUCTS } from '../services/api';
import {
  Layers,
  ClipboardCheck,
  Tags,
  Store,
  ListOrdered,
  AlertOctagon,
  Undo2,
  Percent,
  BarChart3
} from 'lucide-react';

type AdminTab = 'categories' | 'approvals' | 'offers' | 'vendors' | 'orders' | 'exceptions' | 'returns' | 'tax' | 'reports';

const TABS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'approvals', label: 'Product Approvals', icon: ClipboardCheck },
  { id: 'offers', label: 'Offers', icon: Tags },
  { id: 'vendors', label: 'Vendors', icon: Store },
  { id: 'orders', label: 'Orders', icon: ListOrdered },
  { id: 'exceptions', label: 'Exceptions', icon: AlertOctagon },
  { id: 'returns', label: 'Returns / Refunds', icon: Undo2 },
  { id: 'tax', label: 'Tax / HSN Mappings', icon: Percent },
  { id: 'reports', label: 'Reports', icon: BarChart3 }
];

const CATEGORY_ROWS = [
  { name: 'Cutting Tools', examples: 'Inserts, holders, drills, end mills, taps, reamers', skus: 24 },
  { name: 'Consumables', examples: 'Coolant, oils, lubricants, abrasives, welding consumables', skus: 18 },
  { name: 'Raw Materials', examples: 'Steel, aluminium, copper, polymers, bars, sheets, billets', skus: 32 },
  { name: 'CNC Spares', examples: 'Batteries, encoders, drives, spindle components, fans, cables', skus: 14 },
  { name: 'PLC & Automation', examples: 'PLC, I/O, HMI, servo, VFD, power supply, relays', skus: 20 },
  { name: 'Sensors & IIoT', examples: 'Proximity, temperature, vibration, gateways, edge devices', skus: 16 },
  { name: 'Electrical', examples: 'MCB, contactors, terminals, industrial cables, connectors', skus: 28 },
  { name: 'Mechanical', examples: 'Bearings, belts, couplings, seals, fasteners', skus: 22 },
  { name: 'Machine Accessories', examples: 'Chucks, collets, fixtures, tool setters, coolant systems', skus: 19 },
  { name: 'Machines & Retrofit', examples: 'New/used machines, retrofit kits, controllers, panels', skus: 8 },
  { name: 'Quality & Metrology', examples: 'Gauges, instruments, CMM accessories, calibration tools', skus: 12 }
];

const VENDOR_ROWS = [
  { name: 'Apex Industrial Tooling', status: 'APPROVED', skus: 42, rating: 4.8 },
  { name: 'CNC Parts Direct Bengaluru', status: 'APPROVED', skus: 15, rating: 4.6 },
  { name: 'Maharshi Lubricants Chakan', status: 'APPROVED', skus: 9, rating: 4.4 },
  { name: 'XMACH Systems Engineering', status: 'PENDING', skus: 3, rating: 0 }
];

export const CommerceAdminView: React.FC = () => {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<AdminTab>('categories');

  const cardCls = `border rounded-xl p-4 shadow-lg transition-colors ${
    isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
  }`;
  const theadCls = `uppercase tracking-wider border-b ${isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-300'}`;
  const tbodyCls = `divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`;

  return (
    <div className="space-y-4">
      <div className={`${cardCls} p-5`}>
        <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold text-xs">INDXO Commerce Admin</span>
        <h1 className="text-lg font-black mt-1">Marketplace Governance Console</h1>
        <p className="text-xs text-slate-400">
          Categories, product approvals, vendor approvals, order interventions and return/dispute handling. Tenant identity,
          feature entitlement and global controls remain with Platform Super Admin.
        </p>

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

      {tab === 'categories' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Product Catalogue Category Tree</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={theadCls}>
                <tr>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Examples</th>
                  <th className="py-2 pr-3">Active SKUs</th>
                  <th className="py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody className={tbodyCls}>
                {CATEGORY_ROWS.map(c => (
                  <tr key={c.name}>
                    <td className="py-2 pr-3 font-bold">{c.name}</td>
                    <td className="py-2 pr-3 text-slate-400">{c.examples}</td>
                    <td className="py-2 pr-3">{c.skus}</td>
                    <td className="py-2 pr-3">
                      <button onClick={() => alert(`Editing subcategories for "${c.name}".`)} className="text-brand-cyan hover:underline font-semibold">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'approvals' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Products Awaiting Approval</h3>
          <div className="space-y-3 text-xs">
            {SEED_PRODUCTS.slice(0, 2).map(p => (
              <div key={p.id} className={`p-3 rounded-lg border flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-slate-400">SKU {p.sku} • HSN {p.hsn} • Submitted by {p.offers[0]?.vendorName}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => alert(`${p.name} approved and published to the live catalogue.`)} className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold">
                    Approve
                  </button>
                  <button onClick={() => alert(`${p.name} sent back to vendor with review notes.`)} className="px-3 py-1.5 rounded border border-red-700 text-red-400 hover:bg-red-950/40 font-semibold">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'offers' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Vendor Offer Oversight</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={theadCls}>
                <tr>
                  <th className="py-2 pr-3">SKU</th>
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">Vendor</th>
                  <th className="py-2 pr-3">Price</th>
                  <th className="py-2 pr-3">Stock</th>
                </tr>
              </thead>
              <tbody className={tbodyCls}>
                {SEED_PRODUCTS.map(p => (
                  <tr key={p.id}>
                    <td className="py-2 pr-3 font-mono text-brand-cyan">{p.sku}</td>
                    <td className="py-2 pr-3">{p.name}</td>
                    <td className="py-2 pr-3">{p.offers[0]?.vendorName}</td>
                    <td className="py-2 pr-3 font-bold">₹{p.offers[0]?.price.toLocaleString()}</td>
                    <td className="py-2 pr-3">{p.offers[0]?.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'vendors' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Vendor Approvals &amp; Directory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={theadCls}>
                <tr>
                  <th className="py-2 pr-3">Vendor</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Assigned SKUs</th>
                  <th className="py-2 pr-3">Rating</th>
                  <th className="py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody className={tbodyCls}>
                {VENDOR_ROWS.map(v => (
                  <tr key={v.name}>
                    <td className="py-2 pr-3 font-bold">{v.name}</td>
                    <td className="py-2 pr-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-2 pr-3">{v.skus}</td>
                    <td className="py-2 pr-3">{v.rating > 0 ? `${v.rating} / 5` : '—'}</td>
                    <td className="py-2 pr-3">
                      {v.status === 'PENDING' ? (
                        <button onClick={() => alert(`${v.name} approved. VendorDirectory reference activated.`)} className="text-emerald-400 hover:underline font-semibold">
                          Approve Vendor
                        </button>
                      ) : (
                        <button onClick={() => alert(`Viewing commercial profile for ${v.name}.`)} className="text-brand-cyan hover:underline font-semibold">
                          View Profile
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Order Interventions</h3>
          <p className="text-xs text-slate-400">
            Search any customer-facing order across vendor sub-orders to intervene on stuck payments, mis-splits, or
            fulfilment escalations. Cross-tenant access is authorized only for Commerce Admin roles.
          </p>
          <div className={`mt-3 p-3 rounded-lg border text-xs ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            No orders currently flagged for manual intervention.
          </div>
        </div>
      )}

      {tab === 'exceptions' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Operational Exceptions</h3>
          <div className="space-y-2 text-xs">
            <div className={`p-3 rounded-lg border flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <span>Vendor inventory feed for "CNC Parts Direct Bengaluru" is stale (last sync 6h ago).</span>
              <button onClick={() => alert('Re-triggered inventory feed sync.')} className="text-brand-cyan hover:underline font-semibold">Resolve</button>
            </div>
            <div className={`p-3 rounded-lg border flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <span>PARTIALLY_FULFILLED order ORD-2026-4471 needs manual vendor split review.</span>
              <button onClick={() => alert('Order flagged for finance + fulfilment review.')} className="text-brand-cyan hover:underline font-semibold">Review</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'returns' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Returns &amp; Refund Disputes</h3>
          <p className="text-xs text-slate-400">
            Refund execution happens only via Parent PaymentService/Finance; this console tracks status and adjudicates
            vendor/customer disputes.
          </p>
          <div className={`mt-3 p-3 rounded-lg border text-xs flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <span>RETURN-2026-0142 — Vendor inspection pending, buyer requested replacement.</span>
            <button onClick={() => alert('Escalated to vendor with 48h SLA.')} className="text-brand-cyan hover:underline font-semibold">Escalate</button>
          </div>
        </div>
      )}

      {tab === 'tax' && (
        <div className={cardCls}>
          <h3 className="text-sm font-bold mb-3">Tax / HSN Mappings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={theadCls}>
                <tr>
                  <th className="py-2 pr-3">HSN Code</th>
                  <th className="py-2 pr-3">Description</th>
                  <th className="py-2 pr-3">GST Rate</th>
                </tr>
              </thead>
              <tbody className={tbodyCls}>
                {[...new Map(SEED_PRODUCTS.map(p => [p.hsn, p])).values()].map(p => (
                  <tr key={p.hsn}>
                    <td className="py-2 pr-3 font-mono text-brand-cyan">{p.hsn}</td>
                    <td className="py-2 pr-3">{p.category.replace('_', ' ')}</td>
                    <td className="py-2 pr-3 font-bold text-emerald-400">{p.taxRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Statutory tax validation and CGST/SGST/IGST final calculation remain with the parent tax authority.
          </p>
        </div>
      )}

      {tab === 'reports' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'GMV (Month to Date)', value: '₹18.4 L' },
            { label: 'Active Vendors', value: VENDOR_ROWS.filter(v => v.status === 'APPROVED').length.toString() },
            { label: 'Order Fill Rate', value: '95.1%' }
          ].map((kpi, i) => (
            <div key={i} className={cardCls}>
              <span className="text-[11px] text-slate-400 font-bold uppercase">{kpi.label}</span>
              <div className="text-2xl font-black mt-2 text-brand-cyan">{kpi.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
