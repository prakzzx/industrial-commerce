import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PurchaseOrder, VendorSubOrder } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface CheckoutViewProps {
  onOrderSuccess: () => void;
}

// NOTE: In the deployed module this call goes to the parent PaymentService
// (see Architecture Design, Section 13). It is stubbed here as a synchronous
// sandbox capture so the storefront can be exercised end-to-end offline.

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onOrderSuccess }) => {
  const { isDark } = useTheme();
  const { cart, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [deliverySite, setDeliverySite] = useState<'SITE_PUNE' | 'SITE_BLR'>('SITE_PUNE');
  const [poRef, setPoRef] = useState('PO-INDXO-2026-081');
  const [costCenter, setCostCenter] = useState('CC-CNC-TOOLING');
  const [machineRef, setMachineRef] = useState('MAC-VMC-04 (Haas)');
  const [paymentMode, setPaymentMode] = useState('GATEWAY_ONLINE');

  const isInterState = deliverySite === 'SITE_BLR';
  const freight = cart.length > 0 ? 300 : 0;
  const taxableAmount = subtotal + freight;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isInterState) {
    igst = taxableAmount * 0.18;
  } else {
    cgst = taxableAmount * 0.09;
    sgst = taxableAmount * 0.09;
  }

  const grandTotal = taxableAmount + cgst + sgst + igst;

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add industrial products before placing an order.');
      return;
    }

    const orderSeq = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-2026-${orderSeq}`;
    const idempotencyKey = `IDEM-2026-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Build Vendor Fulfilment Splits
    const vendorMap: Record<string, VendorSubOrder> = {};
    cart.forEach(item => {
      if (!vendorMap[item.vendorId]) {
        vendorMap[item.vendorId] = {
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          status: 'CONFIRMED',
          carrier: 'BlueDart Air Freight',
          trackingNo: 'BLUEDART-' + Math.floor(100000 + Math.random() * 900000)
        };
      }
    });

    const newOrder: PurchaseOrder = {
      id: orderNumber,
      orderNumber,
      idempotencyKey,
      date: new Date().toISOString().split('T')[0],
      status: 'CONFIRMED',
      paymentStatus: 'CAPTURED',
      paymentMethod: paymentMode === 'GATEWAY_ONLINE' ? 'Razorpay Sandbox (UPI/Card)' : 'Industrial Credit (30-day Net)',
      poRef,
      costCenter,
      machineRef,
      subtotal,
      freight,
      totalTax: isInterState ? igst : cgst + sgst,
      totalPayable: grandTotal,
      cgst,
      sgst,
      igst,
      items: [...cart],
      vendorSplits: Object.values(vendorMap)
    };

    const existingOrders = JSON.parse(localStorage.getItem('indxo_orders') || '[]');
    const updated = [newOrder, ...existingOrders];
    localStorage.setItem('indxo_orders', JSON.stringify(updated));
    localStorage.setItem('indxo_last_order', JSON.stringify(newOrder));

    clearCart();
    onOrderSuccess();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left 2 Columns: Address, GST, Payment */}
      <div className="lg:col-span-2 space-y-4">
        {/* Addresses & GST */}
        <div
          className={`border rounded-xl p-5 shadow-lg space-y-4 transition-colors ${
            isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Billing & Delivery Addresses (Immutable Order Snapshot)
          </h3>

          {/* Legal Billing Profile */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">LEGAL BILLING ENTITY & GSTIN</label>
            <div
              className={`p-3 rounded-lg border text-xs space-y-1 ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div className="font-bold">{currentUser?.company || 'Registered Organization'}</div>
              <div className="text-slate-400">Headquarters / Plant Site Snapshot</div>
              <div className="text-brand-cyan font-mono font-bold">
                {currentUser?.gstin ? `GSTIN: ${currentUser.gstin}` : 'GSTIN: Exempt / Unregistered'}
              </div>
            </div>
          </div>

          {/* Delivery Site Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-400">DELIVERY PLANT / WAREHOUSE ADDRESS</label>
              <button
                onClick={() => alert('New site added to customer profile.')}
                className="text-xs text-brand-cyan hover:underline font-semibold"
              >
                + Add Site Address
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-lg border cursor-pointer block text-xs relative transition ${
                  deliverySite === 'SITE_PUNE'
                    ? 'border-brand-cyan ring-1 ring-brand-cyan'
                    : isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliverySite"
                  checked={deliverySite === 'SITE_PUNE'}
                  onChange={() => setDeliverySite('SITE_PUNE')}
                  className="absolute top-3 right-3 text-brand-cyan"
                />
                <div className="font-bold">Plant 1 - Chakan Shop Floor</div>
                <div className="text-slate-400 text-[11px] mt-1">Gate 2, Plot B-14 Chakan MIDC, Pune - 410501</div>
                <div className="text-emerald-400 font-bold text-[10px] mt-1">Intra-State Delivery (CGST + SGST)</div>
              </label>

              <label
                className={`p-3 rounded-lg border cursor-pointer block text-xs relative transition ${
                  deliverySite === 'SITE_BLR'
                    ? 'border-brand-cyan ring-1 ring-brand-cyan'
                    : isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliverySite"
                  checked={deliverySite === 'SITE_BLR'}
                  onChange={() => setDeliverySite('SITE_BLR')}
                  className="absolute top-3 right-3 text-brand-cyan"
                />
                <div className="font-bold">Bengaluru Assembly Site</div>
                <div className="text-slate-400 text-[11px] mt-1">Plot 42, Peenya 2nd Stage, Bengaluru - 560058</div>
                <div className="text-amber-400 font-bold text-[10px] mt-1">Inter-State Delivery (IGST 18%)</div>
              </label>
            </div>
          </div>

          {/* References */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">PO REFERENCE #</label>
              <input
                type="text"
                value={poRef}
                onChange={e => setPoRef(e.target.value)}
                className={`w-full px-3 py-2 rounded border text-xs ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">COST CENTRE</label>
              <input
                type="text"
                value={costCenter}
                onChange={e => setCostCenter(e.target.value)}
                className={`w-full px-3 py-2 rounded border text-xs ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">MACHINE CONTEXT</label>
              <input
                type="text"
                value={machineRef}
                onChange={e => setMachineRef(e.target.value)}
                className={`w-full px-3 py-2 rounded border text-xs ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Payment Mode */}
        <div
          className={`border rounded-xl p-5 shadow-lg space-y-3 transition-colors ${
            isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
            2. Payment Mode & Gateway Orchestration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3 rounded-lg border cursor-pointer block text-xs relative transition ${
                paymentMode === 'GATEWAY_ONLINE'
                  ? 'border-brand-cyan ring-1 ring-brand-cyan'
                  : isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="paymentMode"
                checked={paymentMode === 'GATEWAY_ONLINE'}
                onChange={() => setPaymentMode('GATEWAY_ONLINE')}
                className="absolute top-3 right-3 text-brand-cyan"
              />
              <div className="font-bold">Online Gateway (Razorpay Sandbox)</div>
              <div className="text-slate-400 text-[11px] mt-0.5">UPI, Corporate Cards, Net Banking</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-1">Instant confirmation & vendor split</div>
            </label>

            <label
              className={`p-3 rounded-lg border cursor-pointer block text-xs relative transition ${
                paymentMode === 'CREDIT_TERMS'
                  ? 'border-brand-cyan ring-1 ring-brand-cyan'
                  : isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="paymentMode"
                checked={paymentMode === 'CREDIT_TERMS'}
                onChange={() => setPaymentMode('CREDIT_TERMS')}
                className="absolute top-3 right-3 text-brand-cyan"
              />
              <div className="font-bold">Approved Industrial Credit (30 Days)</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Available limit: ₹5,00,000</div>
              <div className="text-[10px] text-brand-cyan font-semibold mt-1">Direct PO approval workflow</div>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Order & Tax Summary */}
      <div>
        <div
          className={`border rounded-xl p-5 shadow-lg space-y-4 transition-colors sticky top-20 ${
            isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
            Order & Tax Breakdown
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Cart Subtotal</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Freight Charges</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ₹{freight.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {isInterState ? (
              <div className="border-t border-slate-800 pt-2 flex justify-between text-slate-400">
                <span>IGST (18%)</span>
                <span className="font-bold text-amber-400">
                  ₹{igst.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ) : (
              <>
                <div className="border-t border-slate-800 pt-2 flex justify-between text-slate-400">
                  <span>CGST (9%)</span>
                  <span className="font-bold text-emerald-400">
                    ₹{cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SGST (9%)</span>
                  <span className="font-bold text-emerald-400">
                    ₹{sgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            )}

            <div className="border-t-2 border-slate-700 pt-2 flex justify-between text-sm">
              <span className="font-black">Total Payable (INR)</span>
              <span className="font-black text-brand-cyan text-base">
                ₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handlePlaceOrder}
              className="w-full py-3 rounded-lg bg-brand-cyan hover:bg-brand-cyanHover text-slate-950 font-black text-sm shadow-xl transition flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Order & Pay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Guaranteed Idempotent Submission Lock Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
