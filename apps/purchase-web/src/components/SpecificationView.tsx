import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FileText, Shield, Layers, Server, Database, CheckCircle2, Cpu, ShoppingBag } from 'lucide-react';

export const SpecificationView: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div
        className={`border rounded-xl p-6 shadow-xl transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold text-xs">
                INDXO AI / XMACH
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider">
                Confidential - Internal Development Specification
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Industrial Purchase Portal
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Amazon-Style B2B Commerce, Cart, GST Billing, Payment, Fulfilment &amp; Supplier Integration
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 hidden sm:block">
            <div>Version: 1.0</div>
            <div>Date: 01 September 2026</div>
          </div>
        </div>
      </div>

      {/* Document Value Table from Handover Specification */}
      <div
        className={`border rounded-xl p-5 shadow-lg overflow-hidden transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-800">
          <FileText className="w-5 h-5 text-brand-cyan" />
          <h2 className={`text-base font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Document Value &amp; Architectural Boundaries
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`text-[11px] uppercase tracking-wider border-b ${
              isDark ? 'bg-slate-900/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}>
              <tr>
                <th className="py-3 px-4 w-1/4">Document Property</th>
                <th className="py-3 px-4 w-3/4">Handover Specification Value</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-brand-cyan">Purpose</td>
                <td className="py-3 px-4 font-medium">Separate-team architecture and development handover specification</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-brand-cyan">Parent Platform</td>
                <td className="py-3 px-4">INDXO Playbook / XMACH SaaS</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-brand-cyan">Primary Users</td>
                <td className="py-3 px-4">Factories, MSMEs, machine shops, procurement teams, vendors and INDXO administrators</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-brand-cyan">Commerce Model</td>
                <td className="py-3 px-4">Industrial B2B marketplace with Amazon-style catalogue, cart and checkout</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-brand-cyan">Module Ownership</td>
                <td className="py-3 px-4 font-medium">Bounded purchase portal; platform identity, entitlements, payment authority and invoicing remain parent-controlled</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-brand-cyan">Frontend Technology</td>
                <td className="py-3 px-4 font-mono">React 18 + TypeScript + Vite + Tailwind CSS (Standalone SPA)</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-brand-cyan">Backend Technology</td>
                <td className="py-3 px-4 font-mono">Node.js REST API + PostgreSQL with immutable snapshots</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-brand-cyan">Version &amp; Date</td>
                <td className="py-3 px-4 font-mono">Version 1.0 • 01 September 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Executive Intent */}
      <div
        className={`border rounded-xl p-5 shadow-lg space-y-4 transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <ShoppingBag className="w-5 h-5 text-emerald-400" />
          <h2 className={`text-base font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            1. Executive Intent
          </h2>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          The Industrial Purchase Portal is a B2B commerce module within XMACH that gives factories and MSMEs an Amazon-like buying experience for industrial consumables, raw materials, cutting tools, machine spares, automation parts, sensors, electrical items, retrofit kits, machines and related services. The assignment is designed as a standalone module so that a separate developer or external partner can implement the entire commerce flow without modifying core platform code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-xs font-bold text-brand-cyan mb-1 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Amazon-Style Procurement</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Facet filters, search, multi-vendor offers, live inventory availability, Minimum Order Quantity (MOQ) validation, and tiered volume discounts.
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center space-x-1.5">
              <Cpu className="w-4 h-4" />
              <span>Machine Telemetry Context</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Direct connection with XMACH machine health alarms (e.g. Haas/Fanuc APC battery voltage low) to suggest verified spares with 1-click order.
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-xs font-bold text-purple-400 mb-1 flex items-center space-x-1.5">
              <Shield className="w-4 h-4" />
              <span>GST Compliance &amp; B2B Flow</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Automated intra-state (CGST 9% + SGST 9%) and inter-state (IGST 18%) tax calculation based on GSTIN, multi-vendor PO splits, and credit approval.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Architectural Boundaries & Data Flow */}
      <div
        className={`border rounded-xl p-5 shadow-lg space-y-4 transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <Layers className="w-5 h-5 text-purple-400" />
          <h2 className={`text-base font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            2. System Architecture &amp; Database Design
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Server className="w-4 h-4 text-brand-cyan" />
              <span>Backend Contract (Node.js REST)</span>
            </h3>
            <ul className="text-xs space-y-1.5 text-slate-400 font-mono">
              <li>• GET /api/products (Catalogue &amp; Offers)</li>
              <li>• GET /api/machine-spares (Alarm Recommendations)</li>
              <li>• POST /api/cart/validate (MOQ &amp; Price Breaks)</li>
              <li>• POST /api/orders (Immutable Checkout &amp; GST)</li>
              <li>• GET /api/orders (Customer Tracking &amp; Invoices)</li>
              <li>• GET /api/vendor/queue (Vendor Dispatch Queue)</li>
            </ul>
          </div>

          <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>PostgreSQL Schema Entities</span>
            </h3>
            <ul className="text-xs space-y-1.5 text-slate-400 font-mono">
              <li>• products, product_offers, product_categories</li>
              <li>• user_accounts, user_addresses, user_gstin</li>
              <li>• purchase_orders, purchase_order_items (Snapshots)</li>
              <li>• machine_telemetry_alarms, alarm_spare_recommendations</li>
              <li>• vendor_fulfilment_batches, statutory_tax_invoices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
