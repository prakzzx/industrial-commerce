import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PackageCheck, Truck, CheckCircle2, Clock } from 'lucide-react';
import { PurchaseOrder } from '../types';

export const VendorQueueView: React.FC = () => {
  const { isDark } = useTheme();
  const [liveOrders, setLiveOrders] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    loadLiveOrders();
  }, []);

  const loadLiveOrders = () => {
    const saved = localStorage.getItem('indxo_orders');
    if (saved) {
      try {
        setLiveOrders(JSON.parse(saved));
      } catch {
        setLiveOrders([]);
      }
    }
  };

  const handleDispatchOrder = (orderId: string, vendorId: string) => {
    const updated = liveOrders.map(ord => {
      if (ord.id === orderId) {
        const trackingCode = 'BLUEDART-' + Math.floor(100000 + Math.random() * 900000);
        const updatedSplits = ord.vendorSplits.map(s => {
          if (s.vendorId === vendorId || !vendorId) {
            return { ...s, status: 'SHIPPED', trackingNo: trackingCode };
          }
          return s;
        });
        return {
          ...ord,
          status: 'SHIPPED' as const,
          vendorSplits: updatedSplits
        };
      }
      return ord;
    });

    setLiveOrders(updated);
    localStorage.setItem('indxo_orders', JSON.stringify(updated));
    alert(`Order ${orderId} marked as SHIPPED!\nCarrier: BlueDart Air Freight\nTracking AWB assigned.`);
  };

  const handleGeneratePackingSlip = (orderId: string, skuName: string) => {
    alert(`Generated Barcoded Packing Slip for ${orderId} / ${skuName}.\nHSN Tax classification verified.\nReady for courier scan.`);
  };

  return (
    <div
      className={`border rounded-xl p-5 shadow-lg space-y-4 transition-colors ${
        isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold">Supplier / Vendor Fulfilment Dispatch Queue</h2>
          <p className="text-xs text-slate-400">
            Vendors can accept orders, generate packing slips, assign courier tracking numbers, and update delivery SLA.
          </p>
        </div>
        <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
          Vendor Role Enabled
        </span>
      </div>

      <div className="space-y-4">
        {/* Live Orders from Customer Checkout */}
        {liveOrders.map(order => (
          <div
            key={order.id}
            className={`border rounded-xl p-4 text-xs space-y-3 shadow ${
              isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <div className="font-bold text-sm text-brand-cyan">
                  Order #{order.orderNumber} (PO: {order.poRef || 'N/A'})
                </div>
                <div className="text-[11px] text-slate-400">
                  Target Site: Chakan Shop Floor • Machine Context: {order.machineRef || 'General Inventory'}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  order.status === 'SHIPPED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-brand-cyan/20 text-brand-cyan'
                }`}
              >
                {order.status === 'SHIPPED' ? 'DISPATCHED / IN TRANSIT' : 'READY FOR DISPATCH'}
              </span>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>• {it.name} &times; {it.quantity} {it.uom} (Vendor: {it.vendorName})</span>
                  <span className="font-mono text-brand-cyan">₹{(it.unitPrice * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleGeneratePackingSlip(order.orderNumber, order.items[0]?.name)}
                className={`px-3 py-1.5 rounded font-semibold transition flex items-center space-x-1 ${
                  isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Generate Packing Slip</span>
              </button>

              {order.status !== 'SHIPPED' ? (
                <button
                  onClick={() => handleDispatchOrder(order.id, order.vendorSplits[0]?.vendorId)}
                  className="px-3 py-1.5 rounded bg-emerald-600 text-slate-950 font-bold hover:bg-emerald-500 transition flex items-center space-x-1 shadow"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Dispatch & Assign BlueDart AWB</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-[11px]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dispatched with AWB: {order.vendorSplits[0]?.trackingNo || 'BLUEDART-882190'}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Sample Queue Item 1 */}
        <div
          className={`border rounded-xl p-4 text-xs space-y-3 shadow ${
            isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <div className="font-bold text-sm">Vendor Order #VORD-2026-8812</div>
              <div className="text-[11px] text-slate-400">Buyer: Apex Precision Tools & Engineering • Chakan MIDC</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold text-[10px]">
              NEW ORDER ACCEPTED
            </span>
          </div>

          <div className="text-[11px] text-slate-300">
            <strong>Line Allocated:</strong> Sandvik CoroTurn CNMG 12 04 08-PM 4325 &times; 10 Packs (₹17,200.00)
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => alert('Packing slip generated with barcoded HSN classification.')}
              className={`px-3 py-1.5 rounded font-semibold transition flex items-center space-x-1 ${
                isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Generate Packing Slip</span>
            </button>
            <button
              onClick={() => alert('Courier carrier dispatched: BlueDart Air Pickup requested.')}
              className="px-3 py-1.5 rounded bg-emerald-600 text-slate-950 font-bold hover:bg-emerald-500 transition flex items-center space-x-1"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Dispatch & Assign Tracking</span>
            </button>
          </div>
        </div>

        {/* Sample Queue Item 2 */}
        <div
          className={`border rounded-xl p-4 text-xs space-y-3 shadow ${
            isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <div className="font-bold text-sm">Vendor Order #VORD-2026-8809</div>
              <div className="text-[11px] text-slate-400">Buyer: Apex Precision Tools Bengaluru Assembly • Peenya</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
              PACKED & READY
            </span>
          </div>

          <div className="text-[11px] text-slate-300">
            <strong>Line Allocated:</strong> FANUC 3V Lithium Backup Battery A06B-6114-K504 &times; 2 NOS (₹4,900.00)
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-slate-400">Tracking:</span>
            <code className="text-brand-cyan font-mono bg-slate-950/60 px-2 py-1 rounded border border-slate-800">
              BLUEDART-882190
            </code>
            <span className="text-emerald-400 font-medium flex items-center space-x-1">
              <Clock className="w-3 h-3 inline mr-1" />
              <span>Pickup scheduled today 5:00 PM</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
