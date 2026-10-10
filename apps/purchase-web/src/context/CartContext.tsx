import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, IndustrialProduct, VendorOffer } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: IndustrialProduct, offer?: VendorOffer) => void;
  updateQuantity: (index: number, delta: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('indxo_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('indxo_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: IndustrialProduct, selectedOffer?: VendorOffer) => {
    const offer = selectedOffer || product.offers[0];
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.productId === product.id && item.vendorId === offer.vendorId
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            brand: product.brand,
            sku: product.sku,
            hsn: product.hsn,
            uom: product.uom,
            vendorId: offer.vendorId,
            vendorName: offer.vendorName,
            unitPrice: offer.price,
            taxRate: product.taxRate,
            leadDays: offer.leadDays,
            quantity: offer.minQty || 1,
            minQty: offer.minQty || 1
          }
        ];
      }
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const target = prev[index];
      if (!target) return prev;
      const nextQty = target.quantity + delta;
      if (nextQty < target.minQty) {
        alert(`Minimum order quantity (MOQ) is ${target.minQty} ${target.uom}.`);
        return prev;
      }
      const updated = [...prev];
      updated[index] = { ...target, quantity: nextQty };
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
