import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PurchaseOrder } from '../types';
import { CheckCircle2, XCircle, FileText, ShoppingBag, ArrowRight } from 'lucide-react';

interface PaymentResultViewProps {
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

export const PaymentResultView: React.FC<PaymentResultViewProps> = ({ onViewOrders, onContinueShopping }) => {
  const { isDark } = useTheme();
  const [order, setOrder] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('indxo_last_order');
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch {
        setOrder(null);
      }
    }
  }, []);

  const succeeded = order?.paymentStatus === 'CAPTURED';

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div
        className={`border rounded-2xl p-8 shadow-xl text-center transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {order ? (
          succeeded ? (
            <>
              <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-400 mb-3" />
              <h2 className="text-lg font-black">Payment Captured &amp; Order Confirmed</h2>
              <p className="text-xs text-slate-400 mt-1">
                Parent PaymentService confirmed capture via {order.paymentMethod}. A webhook-validated
                <code className="mx-1 text-brand-cyan font-mono">payment.captured</code> event closed this checkout intent.
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 mx-auto text-red-400 mb-3" />
              <h2 className="text-lg font-black">Payment Failed</h2>
              <p className="text-xs text-slate-400 mt-1">
                The gateway reported <code className="mx-1 text-red-400 font-mono">payment.failed</code>. No duplicate order
                will be created if you retry — checkout is idempotent.
              </p>
            </>
          )
        ) : (
          <>
            <ShoppingBag className="w-16 h-16 mx-auto text-slate-600 mb-3" />
            <h2 className="text-lg font-black">No Recent Payment Found</h2>
            <p className="text-xs text-slate-400 mt-1">Complete a checkout to see the payment result here.</p>
          </>
        )}

        {order && (
          <div
            className={`mt-5 p-4 rounded-xl border text-left text-xs space-y-1.5 ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex justify-between">
              <span className="text-slate-400">Order Number</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Idempotency Key</span>
              <span className="font-mono">{order.idempotencyKey}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Amount Charged</span>
              <span className="font-bold text-brand-cyan">
                ₹{order.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Vendor Fulfilment Split</span>
              <span className="font-bold">{order.vendorSplits.length} vendor sub-order(s)</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onViewOrders}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-brand-cyan hover:bg-brand-cyanHover text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Orders &amp; Invoice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onContinueShopping}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg border text-xs font-semibold transition ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
            }`}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
