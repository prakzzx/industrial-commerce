import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useCart } from './context/CartContext';
import { isCustomerRole, isVendorRole, isCommerceAdminRole, isPlatformAdminRole } from './types';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { SubBanner } from './components/SubBanner';
import { BottomFooter } from './components/BottomFooter';
import { PurchaseHomeDashboard } from './components/PurchaseHomeDashboard';
import { CatalogueView } from './components/CatalogueView';
import { MachineSparesView } from './components/MachineSparesView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { AddressBookView } from './components/AddressBookView';
import { GstBillingProfileView } from './components/GstBillingProfileView';
import { PaymentResultView } from './components/PaymentResultView';
import { OrdersView } from './components/OrdersView';
import { VendorPortalView } from './components/VendorPortalView';
import { CommerceAdminView } from './components/CommerceAdminView';
import { PlatformAdminView } from './components/PlatformAdminView';
import { SpecificationView } from './components/SpecificationView';

interface TabDef {
  id: string;
  label: string;
  badge?: { text: string; tone: 'amber' | 'cyan' | 'emerald' | 'slate' };
}

export const App: React.FC = () => {
  const { isLoggedIn, currentRole } = useAuth();
  const { isDark } = useTheme();
  const { totalItems } = useCart();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  const customer = isCustomerRole(currentRole);
  const vendor = isVendorRole(currentRole);
  const commerceAdmin = isCommerceAdminRole(currentRole);
  const platformAdmin = isPlatformAdminRole(currentRole);

  // UI Screens are scoped per role, per Architecture Design Section 24 / Table 20:
  // Customer -> Home, categories, search, product detail, compare, cart, addresses,
  //             GST/billing profile, checkout, payment result, orders, order detail,
  //             tracking, invoices, returns, reorder
  // Vendor    -> Dashboard, offers, inventory, orders, fulfilment, shipment, returns, performance
  // Commerce Admin -> Categories, product approvals, offers, vendors, orders, exceptions,
  //             returns/refunds, tax/HSN mappings, reports
  // Platform Admin -> Feature entitlement, tenant access, global integration health (parent platform)
  const tabs: TabDef[] = customer
    ? [
        { id: 'home', label: 'Home' },
        { id: 'catalogue', label: 'Industrial Catalogue' },
        { id: 'machineSpares', label: 'XMACH Machine Spares', badge: { text: '1 Critical', tone: 'amber' } },
        { id: 'cart', label: 'Cart', badge: { text: String(totalItems), tone: 'cyan' } },
        { id: 'addresses', label: 'Addresses' },
        { id: 'gstProfile', label: 'GST / Billing Profile' },
        { id: 'checkout', label: 'Checkout' },
        { id: 'orders', label: 'Orders & Invoices' }
      ]
    : vendor
    ? [
        { id: 'home', label: 'Home' },
        { id: 'vendorPortal', label: 'Vendor Portal', badge: { text: 'Queue', tone: 'emerald' } }
      ]
    : commerceAdmin
    ? [
        { id: 'home', label: 'Home' },
        { id: 'commerceAdmin', label: 'Commerce Admin Console' },
        { id: 'catalogue', label: 'Industrial Catalogue' },
        { id: 'spec', label: 'Handover Specification', badge: { text: 'v1.0', tone: 'slate' } }
      ]
    : [
        { id: 'home', label: 'Home' },
        { id: 'platformAdmin', label: 'Platform Admin' }
      ];

  // Reset to Home whenever the active role changes so a stale tab from
  // another role's screen set is never left rendered.
  useEffect(() => {
    setActiveTab('home');
  }, [currentRole]);

  if (!isLoggedIn) {
    return <AuthScreen />;
  }

  const badgeTone: Record<string, string> = {
    amber: 'bg-amber-500/30 text-amber-300',
    cyan: 'bg-brand-cyan/30 text-brand-cyan',
    emerald: 'bg-emerald-500/30 text-emerald-300',
    slate: 'bg-slate-800 text-brand-cyan'
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'tech-grid-dark' : 'tech-grid-light'} transition-colors duration-200`}>
      {/* 1. Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Sub-banner strip */}
      <SubBanner />

      {/* 3. Role-scoped Navigation Bar */}
      <nav className={`border-b px-4 py-1.5 flex items-center space-x-2 overflow-x-auto text-xs font-medium ${
        isDark ? 'bg-[#121824] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'bg-brand-cyan text-slate-950 font-bold'
                : 'hover:bg-slate-800/40'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${badgeTone[tab.badge.tone]}`}>
                {tab.badge.text}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* 4. Main Content Canvas */}
      <main className="flex-1 p-3 sm:p-5 overflow-y-auto">
        {/* Mandatory Site Visit Notice Banner */}
        <div
          className={`mb-4 border rounded-lg p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-md select-none transition-colors ${
            isDark
              ? 'bg-[#3d1319] border-red-900/60 text-red-200'
              : 'bg-[#fef2f2] border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span
              className={`font-black uppercase tracking-wider text-[10px] px-2 py-0.5 rounded border ${
                isDark
                  ? 'bg-red-950/80 text-red-400 border-red-800'
                  : 'bg-red-100 text-red-700 border-red-300'
              }`}
            >
              LAST CUSTOMER SITE VISIT
            </span>
            <span className="font-semibold">
              No customer / Business Development IN punch yet (no site visit on record)
            </span>
          </div>
          <div className={`text-[11px] font-medium ${isDark ? 'text-red-300/90' : 'text-red-600'}`}>
            *Mandatory Site Visit &nbsp;|&nbsp; Alert: FANUC Battery Alarm on VMC-04
          </div>
        </div>

        {/* Home — all roles */}
        {activeTab === 'home' && (
          <PurchaseHomeDashboard
            onNavigateTab={(tab) => setActiveTab(tab)}
            onFilterCategory={(cat) => {
              setActiveCategoryFilter(cat);
              setActiveTab('catalogue');
            }}
          />
        )}

        {/* Handover Specification — Commerce Admin only */}
        {activeTab === 'spec' && commerceAdmin && <SpecificationView />}

        {/* Customer screens */}
        {activeTab === 'catalogue' && (customer || commerceAdmin) && (
          <CatalogueView
            initialCategory={activeCategoryFilter}
            onQuickBuy={() => setActiveTab(customer ? 'checkout' : 'catalogue')}
          />
        )}
        {activeTab === 'machineSpares' && customer && (
          <MachineSparesView onOrderSpare={() => setActiveTab('cart')} />
        )}
        {activeTab === 'cart' && customer && (
          <CartView
            onProceedToCheckout={() => setActiveTab('checkout')}
            onBrowseCatalogue={() => setActiveTab('catalogue')}
          />
        )}
        {activeTab === 'addresses' && customer && <AddressBookView />}
        {activeTab === 'gstProfile' && customer && <GstBillingProfileView />}
        {activeTab === 'checkout' && customer && (
          <CheckoutView onOrderSuccess={() => setActiveTab('paymentResult')} />
        )}
        {activeTab === 'paymentResult' && customer && (
          <PaymentResultView
            onViewOrders={() => setActiveTab('orders')}
            onContinueShopping={() => setActiveTab('catalogue')}
          />
        )}
        {activeTab === 'orders' && customer && <OrdersView />}

        {/* Vendor screens: dashboard, offers, inventory, orders, fulfilment, shipment, returns, performance */}
        {activeTab === 'vendorPortal' && vendor && <VendorPortalView />}

        {/* Commerce Admin screens: categories, product approvals, offers, vendors,
            orders, exceptions, returns/refunds, tax/HSN mappings, reports */}
        {activeTab === 'commerceAdmin' && commerceAdmin && <CommerceAdminView />}

        {/* Platform Admin screens (remains outside module per Section 6) */}
        {activeTab === 'platformAdmin' && platformAdmin && <PlatformAdminView />}
      </main>

      {/* 5. Bottom Status Footer */}
      <BottomFooter />
    </div>
  );
};
export default App;
