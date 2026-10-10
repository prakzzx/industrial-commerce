import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Menu, Lock, Sun, Moon, ShoppingCart, ChevronDown, LogOut } from 'lucide-react';
import { RoleType, ROLE_LABELS, isCustomerRole, isCommerceAdminRole } from '../types';

const DEMO_ROLES: RoleType[] = [
  'CUSTOMER_BUYER',
  'CUSTOMER_APPROVER',
  'CUSTOMER_FINANCE',
  'VENDOR',
  'VENDOR_ADMIN',
  'COMMERCE_ADMIN',
  'PLATFORM_ADMIN'
];

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ setActiveTab }) => {
  const { currentUser, currentRole, setRole, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { totalItems } = useCart();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <header className="bg-[#0c1017] text-white border-b border-slate-800 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 z-30 sticky top-0 select-none">
      {/* Left: Brand & Menu */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={() => alert('Navigation Drawer: XMACH Modules, Industrial Commerce, Machine Spares, Orders.')}
          className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
            ind<span className="text-brand-cyan">x</span>o
          </span>
        </div>

        <div className="hidden sm:block border-l border-slate-700 pl-2.5">
          <div className="text-[11px] font-bold text-slate-100 flex items-center space-x-1">
            <span>PURCHASE</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300">XMACH</span>
          </div>
          <div className="text-[9px] text-slate-400">
            Industrial Commerce • <span className="text-brand-cyan">{ROLE_LABELS[currentRole]}</span>
          </div>
        </div>
      </div>

      {/* Center: User ID Pill */}
      <div className="flex items-center space-x-2">
        <div className="bg-white text-slate-900 font-bold px-3 py-1 rounded text-xs tracking-wide shadow-sm hidden md:block">
          {currentUser?.userId || 'USER'}
        </div>
      </div>

      {/* Right: Role Toggle, DB Badge, Theme Switch, Profile Avatar */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Role Switcher — full Table 6 role set (demo/preview convenience) */}
        <div className="hidden lg:flex items-center">
          <select
            value={currentRole}
            onChange={e => setRole(e.target.value as RoleType)}
            title="Switch role to preview role-scoped screens"
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-full px-3 py-1 focus:outline-none focus:ring-1 focus:ring-brand-cyan cursor-pointer"
          >
            {DEMO_ROLES.map(r => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>

        {/* DB Lock indicator */}
        <div className="bg-slate-900 border border-emerald-500/70 p-1.5 rounded-lg flex items-center text-emerald-400" title="Secure DB session connected">
          <Lock className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
        </div>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-slate-200" /> : <Moon className="w-4 h-4 text-slate-200" />}
        </button>

        {/* Cart Quick Badge — customer roles only */}
        {isCustomerRole(currentRole) && (
          <button
            onClick={() => setActiveTab('cart')}
            className="relative p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-brand-cyan transition"
            title="View Industrial Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="absolute -top-1.5 -right-1.5 bg-brand-cyan text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </button>
        )}

        {/* User Profile Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 rounded-full px-2 py-1 hover:border-slate-500 transition"
          >
            <div className="w-5 h-5 rounded-full bg-brand-cyan text-slate-950 font-bold text-[10px] flex items-center justify-center">
              {getInitials(currentUser?.fullName || currentUser?.userId)}
            </div>
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
              {currentUser?.fullName || currentUser?.userId || 'User'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#111726] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-800">
                <div className="font-bold text-white">{currentUser?.fullName}</div>
                <div className="text-[11px] text-slate-400">{currentUser?.email}</div>
                <div className="text-[10px] text-brand-cyan mt-0.5">{currentUser?.company}</div>
              </div>
              <button
                onClick={() => { setActiveTab('home'); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Home Dashboard
              </button>
              {(isCustomerRole(currentRole) || isCommerceAdminRole(currentRole)) && (
                <button
                  onClick={() => { setActiveTab('catalogue'); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                >
                  Industrial Catalogue
                </button>
              )}
              {isCustomerRole(currentRole) && (
                <button
                  onClick={() => { setActiveTab('orders'); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                >
                  Orders & Invoices
                </button>
              )}
              <div className="border-t border-slate-800 my-1"></div>
              <button
                onClick={() => { setDropdownOpen(false); signOut(); }}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-950/40 hover:text-red-300 font-semibold transition flex items-center space-x-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
