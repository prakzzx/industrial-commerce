import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { PurchaseOrder } from '../types';
import { FileText, Truck, AlertCircle, RefreshCw, Printer, X, ShieldCheck, Download } from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  // Selected order for Invoice modal
  const [invoiceOrder, setInvoiceOrder] = useState<PurchaseOrder | null>(null);

  // Selected order for Return modal
  const [returnOrder, setReturnOrder] = useState<PurchaseOrder | null>(null);
  const [returnReason, setReturnReason] = useState('WRONG_ITEM');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnCondition, setReturnCondition] = useState('UNOPENED');
  const [returnAction, setReturnAction] = useState<'REPLACEMENT' | 'REFUND'>('REPLACEMENT');

  // Selected order for Tracking modal
  const [trackingOrder, setTrackingOrder] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const saved = localStorage.getItem('indxo_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch {
        setOrders([]);
      }
    }
  };

  const handleReorder = (order: PurchaseOrder) => {
    order.items.forEach(item => {
      // Re-add to cart
      addToCart(
        {
          id: item.productId,
          name: item.name,
          category: 'cutting_tools',
          brand: item.brand,
          sku: item.sku,
          hsn: item.hsn,
          uom: item.uom,
          moq: item.minQty,
          taxRate: item.taxRate,
          description: item.name,
          compatibility: [],
          offers: []
        },
        {
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          price: item.unitPrice,
          leadDays: item.leadDays,
          stock: 99,
          minQty: item.minQty
        }
      );
    });
    alert(`Added all ${order.items.length} items from ${order.orderNumber} back to your cart for reorder.`);
  };

  const submitReturnClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrder) return;

    alert(`Return Request Registered for ${returnOrder.orderNumber}!\nType: ${returnAction}\nReason: ${returnReason}\nA reverse-pickup logistics request has been routed to the vendor.`);
    setReturnOrder(null);
    setReturnNotes('');
  };

  if (orders.length === 0) {
    return (
      <div
        className={`border rounded-xl p-8 text-center text-xs space-y-3 transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}
      >
        <FileText className="w-12 h-12 mx-auto text-slate-600 mb-2" />
        <p className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          No active purchase orders found.
        </p>
        <p>Complete a checkout from the industrial catalogue to see order lifecycle tracking and tax invoices.</p>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-xl p-5 shadow-lg space-y-4 transition-colors ${
        isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold">Purchase Orders & Fulfilment Tracking</h2>
          <p className="text-xs text-slate-400">
            Track vendor sub-orders, shipments, carrier statuses, statutory tax invoices, and return requests.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
            isDark ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
          }`}
        >
          Refresh Orders
        </button>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className={`border rounded-xl p-4 text-xs space-y-3 shadow ${
              isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm">{order.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-800">
                    {order.status}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold text-[10px]">
                    PAYMENT: {order.paymentStatus}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Date: {order.date} • PO Ref: <strong>{order.poRef || 'N/A'}</strong> • Machine Context: <strong>{order.machineRef || 'Shop Floor'}</strong> • Idempotency: {order.idempotencyKey}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right mr-2">
                  <div className="font-black text-brand-cyan text-sm">
                    ₹{order.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400">Via {order.paymentMethod}</div>
                </div>

                <button
                  onClick={() => setInvoiceOrder(order)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Tax Invoice</span>
                </button>

                <button
                  onClick={() => handleReorder(order)}
                  className="px-2.5 py-1.5 rounded-lg bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyanHover transition flex items-center space-x-1"
                  title="Reorder exact lines"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reorder</span>
                </button>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-1.5 pt-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-300 text-[11px] py-1 border-b border-slate-800/40">
                  <span>
                    <strong className="text-white">{it.name}</strong> ({it.sku}) &times; {it.quantity} {it.uom}
                    <span className="text-slate-400 ml-2">Vendor: {it.vendorName}</span>
                  </span>
                  <span className="font-mono text-brand-cyan font-bold">
                    ₹{(it.unitPrice * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Carrier Tracking Banner */}
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-brand-cyan" />
                <span>
                  <span className="text-slate-400">Carrier:</span> <strong className="text-white">{order.vendorSplits[0]?.carrier || 'BlueDart Air'}</strong> &nbsp;|&nbsp;
                  <span className="text-slate-400">Tracking:</span> <code className="text-brand-cyan font-mono font-bold">{order.vendorSplits[0]?.trackingNo || 'BLUEDART-882190'}</code> &nbsp;|&nbsp;
                  <span className="text-emerald-400 font-medium">Status: In Transit • Out for Delivery</span>
                </span>
              </div>
              <button
                onClick={() => setTrackingOrder(order)}
                className="text-brand-cyan hover:underline font-bold text-xs"
              >
                Track Live Shipment &rarr;
              </button>
            </div>

            {/* Return Claim Link */}
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">30-day industrial replacement and return policy applies</span>
              <button
                onClick={() => setReturnOrder(order)}
                className="text-slate-400 hover:text-red-400 flex items-center space-x-1 underline transition"
              >
                <AlertCircle className="w-3 h-3" />
                <span>Request Return / Damaged Goods Claim</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 1. STATUTORY GST TAX INVOICE MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl relative my-8 ${
              isDark ? 'bg-[#0f1420] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-700">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="text-base font-bold">TAX INVOICE (GST Compliant)</h2>
                  <span className="text-[10px] text-slate-400 font-mono">IRN: 8a7c29f84b391e0a29487c9182bc8174f82910</span>
                </div>
              </div>
              <button onClick={() => setInvoiceOrder(null)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50">
                <span className="text-[10px] font-bold text-brand-cyan uppercase">SELLER / SUPPLIER</span>
                <div className="font-bold text-white mt-1">Apex Industrial Tooling Pvt Ltd</div>
                <div className="text-slate-400 text-[11px]">Plot C-12, MIDC Industrial Area, Pune, MH - 411018</div>
                <div className="font-mono text-emerald-400 mt-1">GSTIN: 27AABCA9918K1Z3</div>
                <div className="text-slate-400 text-[10px]">State: Maharashtra (State Code: 27)</div>
              </div>

              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50">
                <span className="text-[10px] font-bold text-brand-cyan uppercase">BUYER / RECIPIENT</span>
                <div className="font-bold text-white mt-1">Industrial Enterprise Client</div>
                <div className="text-slate-400 text-[11px]">Plant 1 - Machine Shop Gate 2, Pune</div>
                <div className="font-mono text-emerald-400 mt-1">GSTIN: 27AAAAA0000A1Z5</div>
                <div className="text-slate-400 text-[10px]">Invoice Ref: {invoiceOrder.orderNumber} • Date: {invoiceOrder.date}</div>
              </div>
            </div>

            {/* Line Table */}
            <div className="border border-slate-800 rounded-lg overflow-hidden mb-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="p-2">Item Description</th>
                    <th className="p-2">HSN</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Rate</th>
                    <th className="p-2 text-right">Taxable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {invoiceOrder.items.map((it, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium">{it.name}</td>
                      <td className="p-2 font-mono text-slate-400">{it.hsn}</td>
                      <td className="p-2 text-right">{it.quantity} {it.uom}</td>
                      <td className="p-2 text-right">₹{it.unitPrice.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold">₹{(it.unitPrice * it.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* GST Summary */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs mb-4">
              <div className="flex justify-between text-slate-400">
                <span>Taxable Value:</span>
                <span className="font-bold text-white">₹{invoiceOrder.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Freight:</span>
                <span className="font-bold text-white">₹{invoiceOrder.freight.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              {invoiceOrder.igst > 0 ? (
                <div className="flex justify-between text-slate-400">
                  <span>IGST (18%):</span>
                  <span className="font-bold text-amber-400">₹{invoiceOrder.igst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-slate-400">
                    <span>CGST (9%):</span>
                    <span className="font-bold text-emerald-400">₹{invoiceOrder.cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>SGST (9%):</span>
                    <span className="font-bold text-emerald-400">₹{invoiceOrder.sgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </>
              )}
              <div className="pt-2 border-t border-slate-700 flex justify-between text-sm">
                <span className="font-bold">Total Invoice Value (INR):</span>
                <span className="font-black text-brand-cyan">₹{invoiceOrder.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-500 font-mono">E-Invoice Generated by INDXO InvoiceService v2.3</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert(`Printing statutory tax invoice for ${invoiceOrder.orderNumber}...`)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Downloading Tax Invoice PDF for ${invoiceOrder.orderNumber}...`);
                    setInvoiceOrder(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-brand-cyan text-slate-950 font-bold text-xs flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RETURN CLAIM MODAL */}
      {returnOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl relative ${
              isDark ? 'bg-[#0f1420] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-700">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>Request Return / Quality Claim ({returnOrder.orderNumber})</span>
              </h3>
              <button onClick={() => setReturnOrder(null)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitReturnClaim} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">REASON FOR RETURN *</label>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="WRONG_ITEM">Wrong item or insert geometry delivered</option>
                  <option value="TRANSIT_DAMAGE">Packaging damaged / item physically broken</option>
                  <option value="DEFECTIVE">Product defective / voltage drop / out of tolerance</option>
                  <option value="MACHINE_INCOMPATIBLE">Not compatible with CNC controller/spindle</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">ITEM CONDITION *</label>
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      checked={returnCondition === 'UNOPENED'}
                      onChange={() => setReturnCondition('UNOPENED')}
                    />
                    <span>Unopened / Original Seal</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      checked={returnCondition === 'OPENED'}
                      onChange={() => setReturnCondition('OPENED')}
                    />
                    <span>Opened / Inspected</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">REQUESTED RESOLUTION *</label>
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="action"
                      checked={returnAction === 'REPLACEMENT'}
                      onChange={() => setReturnAction('REPLACEMENT')}
                    />
                    <span>Priority Replacement (Same SKU)</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="action"
                      checked={returnAction === 'REFUND'}
                      onChange={() => setReturnAction('REFUND')}
                    />
                    <span>Full GST Credit Note & Refund</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">DESCRIPTION & EVIDENCE</label>
                <textarea
                  rows={3}
                  value={returnNotes}
                  onChange={e => setReturnNotes(e.target.value)}
                  placeholder="Describe the issue, batch number, or discrepancy..."
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReturnOrder(null)}
                  className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Submit Return Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. SHIPMENT TRACKING MODAL */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl relative ${
              isDark ? 'bg-[#0f1420] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-700">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center space-x-2">
                <Truck className="w-4 h-4 text-brand-cyan" />
                <span>Live Carrier Dispatch Tracking</span>
              </h3>
              <button onClick={() => setTrackingOrder(null)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order:</span>
                  <span className="font-bold text-white">{trackingOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400">Carrier:</span>
                  <span className="font-bold text-white">{trackingOrder.vendorSplits[0]?.carrier || 'BlueDart Air'}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400">Tracking AWB:</span>
                  <span className="font-mono font-bold text-brand-cyan">{trackingOrder.vendorSplits[0]?.trackingNo || 'BLUEDART-882190'}</span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-3 pl-2 border-l-2 border-brand-cyan ml-2">
                <div className="relative pl-4">
                  <div className="absolute -left-[17px] top-0 w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="font-bold text-white">Order Confirmed & Vendor Accepted</div>
                  <div className="text-[10px] text-slate-400">Vendor warehouse allocated inventory</div>
                </div>
                <div className="relative pl-4">
                  <div className="absolute -left-[17px] top-0 w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="font-bold text-white">Packed with Barcoded HSN Label</div>
                  <div className="text-[10px] text-slate-400">Dispatched from Chakan MIDC hub</div>
                </div>
                <div className="relative pl-4">
                  <div className="absolute -left-[17px] top-0 w-3 h-3 rounded-full bg-brand-cyan animate-pulse"></div>
                  <div className="font-bold text-brand-cyan">Out for Delivery to Shop Floor</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Expected arrival: Today 4:30 PM (Gate 2)</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setTrackingOrder(null)}
                  className="px-4 py-1.5 rounded-lg bg-brand-cyan text-slate-950 font-bold text-xs"
                >
                  Close Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

