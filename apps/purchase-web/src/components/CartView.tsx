import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  onProceedToCheckout: () => void;
  onBrowseCatalogue: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ onProceedToCheckout, onBrowseCatalogue }) => {
  const { isDark } = useTheme();
  const { cart, updateQuantity, removeItem, clearCart, totalItems, subtotal } = useCart();

  // Group cart items by vendor
  const groupedByVendor = cart.reduce((acc, item, idx) => {
    if (!acc[item.vendorId]) {
      acc[item.vendorId] = {
        vendorName: item.vendorName,
        leadDays: item.leadDays,
        items: [] as (CartItem & { originalIndex: number })[]
      };
    }
    acc[item.vendorId].items.push({ ...item, originalIndex: idx });
    return acc;
  }, {} as Record<string, { vendorName: string; leadDays: number; items: (CartItem & { originalIndex: number })[] }>);

  if (cart.length === 0) {
    return (
      <div
        className={`border rounded-xl p-8 text-center text-xs space-y-3 transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}
      >
        <ShoppingCart className="w-12 h-12 mx-auto text-slate-600 mb-3" />
        <p className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Your industrial purchase cart is empty.
        </p>
        <p>Browse the catalogue or machine spare recommendations to add items.</p>
        <button
          onClick={onBrowseCatalogue}
          className="mt-4 px-4 py-2 rounded-lg bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyanHover transition"
        >
          Browse Industrial Catalogue
        </button>
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
        <h2 className="text-base font-bold">Industrial Shopping Cart (Multi-Vendor Split)</h2>
        <button onClick={clearCart} className="text-xs text-red-400 hover:underline">
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {Object.keys(groupedByVendor).map(vendorId => {
          const group = groupedByVendor[vendorId];
          const groupSubtotal = group.items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);

          return (
            <div
              key={vendorId}
              className={`border rounded-xl p-4 text-xs space-y-3 shadow ${
                isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold text-[10px]">
                    FULFILMENT SUB-ORDER
                  </span>
                  <span className="font-bold">{group.vendorName}</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  Est. Dispatch: within {group.leadDays} working day(s)
                </span>
              </div>

              <div className="space-y-3 divide-y divide-slate-800">
                {group.items.map(item => (
                  <div key={item.originalIndex} className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-bold text-xs">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        SKU: {item.sku} • HSN: {item.hsn} • Rate: ₹{item.unitPrice.toLocaleString()} / {item.uom}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center rounded border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
                        <button
                          onClick={() => updateQuantity(item.originalIndex, -1)}
                          className="px-2 py-1 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.originalIndex, 1)}
                          className="px-2 py-1 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="w-24 text-right font-black text-brand-cyan">
                        ₹{(item.unitPrice * item.quantity).toLocaleString()}
                      </span>

                      <button
                        onClick={() => removeItem(item.originalIndex)}
                        className="p-1 text-slate-400 hover:text-red-400 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400 font-medium text-[11px]">
                <span>Vendor Sub-Total:</span>
                <span className="font-bold text-brand-cyan">₹{groupSubtotal.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-xs space-y-1">
          <div className="text-slate-400">
            Total Items: <span className="font-bold text-white">{totalItems}</span>
          </div>
          <div className="text-slate-400">
            Estimated Subtotal: <span className="font-bold text-brand-cyan">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            *Exact CGST/SGST/IGST and Freight calculated at Checkout based on Delivery State
          </div>
        </div>

        <button
          onClick={onProceedToCheckout}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-brand-cyan hover:bg-brand-cyanHover text-slate-950 font-black text-sm shadow-md transition flex items-center justify-center space-x-2"
        >
          <span>Proceed to GST & Address Selection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
