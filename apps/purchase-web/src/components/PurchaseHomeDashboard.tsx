import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { SEED_PRODUCTS } from '../services/api';
import { IndustrialProduct, isCustomerRole, isVendorRole, ROLE_LABELS } from '../types';
import {
  Wrench,
  Cpu,
  Droplets,
  Layers,
  Radio,
  Zap,
  Cog,
  Gauge,
  Activity,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  Box,
  Settings
} from 'lucide-react';

interface PurchaseHomeDashboardProps {
  onNavigateTab: (tab: string) => void;
  onFilterCategory: (cat: string) => void;
}

const CATEGORIES = [
  { id: 'cutting_tools', name: 'Cutting Tools', sub: 'Inserts, Drills, End Mills, Holders', icon: Wrench, count: '1,240+ SKUs' },
  { id: 'consumables', name: 'Consumables', sub: 'Coolants, Oils, Abrasives, Grinding Wheels', icon: Droplets, count: '850+ SKUs' },
  { id: 'raw_materials', name: 'Raw Materials', sub: 'Steel Bars, Aluminium Blocks, Engineering Plastics', icon: Layers, count: '620+ SKUs' },
  { id: 'cnc_spares', name: 'CNC Spares', sub: 'Batteries, Drives, Encoders, Cables', icon: Cpu, count: '430+ SKUs' },
  { id: 'plc_automation', name: 'PLC & Automation', sub: 'PLC, VFD, Servos, HMI Panels', icon: Cog, count: '780+ SKUs' },
  { id: 'sensors_iiot', name: 'Sensors & IIoT', sub: 'Proximity, Vibration, Gateways', icon: Radio, count: '510+ SKUs' },
  { id: 'electrical', name: 'Electrical', sub: 'Contactors, MCBs, MCCBs, Cables', icon: Zap, count: '940+ SKUs' },
  { id: 'mechanical', name: 'Mechanical', sub: 'Bearings, Belts, Couplings, Ball Screws', icon: Activity, count: '1,120+ SKUs' },
  { id: 'quality_metrology', name: 'Quality & Metrology', sub: 'Calipers, Gauges, CMM Accessories', icon: Gauge, count: '390+ SKUs' },
  { id: 'machines_retrofit', name: 'Machines & Retrofit Kits', sub: 'CNC Lathes, Milling, 4th Axis, DRO', icon: Box, count: '180+ SKUs' },
  { id: 'industrial_services', name: 'Industrial Services', sub: 'Spindle Repair, Calibration, AMC', icon: Settings, count: '95+ Services' }
];

const PREFERRED_BRANDS = [
  'Sandvik Coromant',
  'FANUC',
  'Siemens',
  'SKF Bearings',
  'Blaser Swisslube',
  'Mitutoyo',
  'Schneider Electric',
  'Kennametal'
];

export const PurchaseHomeDashboard: React.FC<PurchaseHomeDashboardProps> = ({
  onNavigateTab,
  onFilterCategory
}) => {
  const { isDark } = useTheme();
  const { currentUser, currentRole } = useAuth();
  const { addToCart } = useCart();
  const [showSpecDetails, setShowSpecDetails] = useState(false);

  const handleQuickAdd = (product: IndustrialProduct) => {
    addToCart(product, product.offers[0]);
    alert(`Added "${product.name}" to cart.`);
  };

  return (
    <div className="space-y-5">
      {/* 1. Industrial Marketplace Header / Welcome Banner */}
      <div
        className={`border rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold text-xs">
              {isCustomerRole(currentRole) ? 'Customer Enterprise B2B' : isVendorRole(currentRole) ? 'Vendor Enterprise' : ROLE_LABELS[currentRole]}
            </span>
            <span className="text-xs text-slate-400">
              Welcome back, <strong className={isDark ? 'text-white' : 'text-slate-900'}>{currentUser?.fullName || currentUser?.userId || 'User'}</strong> ({currentUser?.company || 'Your Enterprise'})
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Industrial Supplies, Cutting Tools & Machine Spares Marketplace
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Amazon-style industrial B2B procurement with automated GST billing (CGST+SGST / IGST), multi-vendor fulfillment split, machine telemetry alarm recommendations, and PO approvals.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab('catalogue')}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-lg bg-brand-cyan hover:bg-brand-cyanHover text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
          >
            <span>Explore Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('cart')}
            className={`px-4 py-2.5 rounded-lg border text-xs font-semibold transition ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
            }`}
          >
            Review Cart
          </button>
        </div>
      </div>

      {/* 2. Confidential Handover Specification & Document Value Card */}
      <div
        className={`border rounded-xl p-4 sm:p-5 shadow-lg transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setShowSpecDetails(!showSpecDetails)}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-brand-cyan/20 text-brand-cyan">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">INDXO AI / XMACH Specification</span>
                <span className="px-2 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">Ver 1.0 • Sep 2026</span>
              </div>
              <h2 className={`text-sm font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Separate-Team Architecture &amp; Development Handover Specification
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-brand-cyan font-semibold hidden sm:inline">
              {showSpecDetails ? 'Hide Specification Table' : 'View Specification Table'}
            </span>
            <button className={`p-1.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
              {showSpecDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Document Value Table & Executive Intent */}
        {showSpecDetails && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className={`text-[11px] uppercase tracking-wider border-b ${
                  isDark ? 'bg-slate-900/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}>
                  <tr>
                    <th className="py-2.5 px-3 w-1/4">Document Property</th>
                    <th className="py-2.5 px-3 w-3/4">Handover Specification Value</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-mono ${isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-brand-cyan font-sans">Purpose</td>
                    <td className="py-2.5 px-3 font-sans">Separate-team architecture and development handover specification</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-brand-cyan font-sans">Parent Platform</td>
                    <td className="py-2.5 px-3">INDXO Playbook / XMACH SaaS</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-brand-cyan font-sans">Primary Users</td>
                    <td className="py-2.5 px-3 font-sans">Factories, MSMEs, machine shops, procurement teams, vendors and INDXO administrators</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-brand-cyan font-sans">Commerce Model</td>
                    <td className="py-2.5 px-3 font-sans">Industrial B2B marketplace with Amazon-style catalogue, cart and checkout</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-brand-cyan font-sans">Module Ownership</td>
                    <td className="py-2.5 px-3 font-sans">Bounded purchase portal; platform identity, entitlements, payment authority and invoicing remain parent-controlled</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-brand-cyan font-sans">Version &amp; Date</td>
                    <td className="py-2.5 px-3">Version 1.0 • 01 September 2026 (CONFIDENTIAL - INTERNAL DEVELOPMENT SPECIFICATION)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <strong className="text-brand-cyan">1. Executive Intent:</strong> The Industrial Purchase Portal is a B2B commerce module within XMACH that gives factories and MSMEs an Amazon-like buying experience for industrial consumables, raw materials, cutting tools, machine spares, automation parts, sensors, electrical items, retrofit kits, machines and related services.
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => onNavigateTab('spec')}
                className="text-xs text-brand-cyan hover:underline font-bold"
              >
                Read Full Architectural Boundaries &amp; Data Contract Specification &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. XMACH Active Machine Telemetry Spares Strip (Alarm-to-Spare) */}
      <div
        className={`border rounded-xl p-4 shadow-md transition-colors ${
          isDark ? 'bg-[#151b2a] border-amber-500/40' : 'bg-amber-50/70 border-amber-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-amber-400 uppercase tracking-wider">XMACH Equipment Integration</span>
                <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-300 text-[10px] font-bold border border-red-800">1 Critical Alarm</span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                Haas VF-2SS VMC (Bay 3) triggered <strong>ALM-310: APC BATTERY VOLTAGE LOW</strong>. Compatible spare battery available from authorized vendor.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('machineSpares')}
            className="px-3.5 py-1.5 rounded-lg bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyanHover transition whitespace-nowrap shadow"
          >
            View Machine Spares &rarr;
          </button>
        </div>
      </div>

      {/* 3. Category Tiles Grid (11 Industrial Categories from Spec) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
            Industrial Categories
          </h2>
          <button
            onClick={() => onNavigateTab('catalogue')}
            className="text-xs text-brand-cyan hover:underline font-semibold"
          >
            View All Categories &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onFilterCategory(cat.id)}
                className={`border rounded-xl p-3.5 cursor-pointer shadow hover:border-brand-cyan transition-all flex items-center justify-between group ${
                  isDark ? 'bg-[#121722] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                      isDark ? 'bg-slate-800 text-brand-cyan group-hover:bg-brand-cyan group-hover:text-slate-950' : 'bg-slate-100 text-brand-cyan group-hover:bg-brand-cyan group-hover:text-slate-950'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-brand-cyan`}>
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{cat.sub}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800/40 px-2 py-1 rounded">
                  {cat.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Frequently Purchased Industrial Consumables & High-Wear Spares */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              Frequently Purchased Industrial Spares & Tools
            </h2>
            <p className="text-[11px] text-slate-400">
              Verified OEM vendors with MOQ pricing tiers, GST compliance, and fast shop-floor dispatch.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('catalogue')}
            className="text-xs text-brand-cyan hover:underline font-semibold"
          >
            Browse Catalogue &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SEED_PRODUCTS.slice(0, 3).map(product => {
            const offer = product.offers[0];
            return (
              <div
                key={product.id}
                className={`border rounded-xl p-4 shadow-lg flex flex-col justify-between hover:border-slate-500 transition ${
                  isDark ? 'bg-[#121722] border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-cyan font-bold uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <span className="text-slate-400 font-mono">HSN: {product.hsn}</span>
                  </div>

                  <h3 className={`text-sm font-bold leading-snug line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{product.description}</p>

                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {product.compatibility.slice(0, 2).map((comp, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        ⚙️ {comp}
                      </span>
                    ))}
                  </div>

                  {/* Vendor & Price */}
                  <div
                    className={`mt-3 p-2.5 rounded-lg border text-xs ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Vendor:</span>
                      <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {offer.vendorName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-black text-brand-cyan">
                        ₹{offer.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        In Stock ({offer.stock} avail)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      MOQ: {offer.minQty} {product.uom} • Dispatch: {offer.leadDays} day(s)
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-2">
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="flex-1 py-2 px-3 rounded-lg bg-brand-cyan hover:bg-brand-cyanHover text-slate-950 font-bold text-xs shadow transition flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => {
                      handleQuickAdd(product);
                      onNavigateTab('checkout');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. B2B Commercial Guarantees & Features Strip */}
      <div
        className={`border rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>100% Genuine OEM Sourced</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Certified manufacturer warranties, material test certificates (MTC), and traceable batches.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-brand-cyan/20 text-brand-cyan">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>GST Invoicing & Input Tax Credit</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Statutory GST compliant e-invoicing with IRN and QR code for seamless ITC claim across states.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Credit & PO Workflow</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              30-day approved credit terms, enterprise purchase order reference, and multi-vendor shipment tracking.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Authorized Industrial Brands Strip */}
      <div
        className={`border rounded-xl p-4 shadow-sm transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Authorized Industrial Brands & Integrations
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PREFERRED_BRANDS.map((brand, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
