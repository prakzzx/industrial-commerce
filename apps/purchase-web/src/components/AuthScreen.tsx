import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { RoleType, ROLE_LABELS, isCustomerRole } from '../types';

const REGISTERABLE_ROLES: RoleType[] = [
  'CUSTOMER_BUYER',
  'CUSTOMER_APPROVER',
  'CUSTOMER_FINANCE',
  'VENDOR',
  'VENDOR_ADMIN',
  'COMMERCE_ADMIN',
  'PLATFORM_ADMIN'
];

export const AuthScreen: React.FC = () => {
  const { currentRole, setRole, signIn, register, registeredUsersCount } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [authTab, setAuthTab] = useState<'SIGN_IN' | 'REGISTER'>('SIGN_IN');
  
  // Clean inputs with zero hardcoded values
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [database, setDatabase] = useState('Live DB');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Form State (Blank inputs for any staff or customer)
  const [regFullName, setRegFullName] = useState('');
  const [regUserId, setRegUserId] = useState('');
  const [regRole, setRegRole] = useState<RoleType>(currentRole);
  const [regCompany, setRegCompany] = useState('');
  const [regDesignation, setRegDesignation] = useState('');
  const [regGstin, setRegGstin] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleRoleToggle = (role: RoleType) => {
    setRole(role);
    setRegRole(role);
    setErrorMsg('');
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!userId.trim() || !password.trim()) {
      setErrorMsg('Please enter both User ID and Password.');
      return;
    }

    const result = signIn(userId, password);
    if (!result.success) {
      setErrorMsg(result.error || 'Invalid credentials. Please verify or register.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regUserId.trim() || !regFullName.trim() || !regPassword.trim() || !regCompany.trim()) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    const result = register({
      userId: regUserId,
      fullName: regFullName,
      role: regRole,
      company: regCompany,
      grade: regDesignation || (isCustomerRole(regRole) ? 'Procurement Specialist' : 'Team Member'),
      gstin: isCustomerRole(regRole) ? regGstin.trim().toUpperCase() : undefined,
      password: regPassword
    });

    if (!result.success) {
      setErrorMsg(result.error || 'Registration failed.');
    } else {
      setSuccessMsg(`Account for "${regFullName}" successfully created! Signing you in...`);
    }
  };

  return (
    <div className="tech-grid-dark min-h-screen text-slate-100 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Header Bar matching Image 1 */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto py-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 cursor-pointer">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center">
              ind<span className="text-brand-cyan">x</span>o
            </span>
          </div>
          <div className="border-l border-slate-700 pl-3 hidden sm:block">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">XMACH</div>
            <div className="text-[10px] text-slate-400">INDXO AI Purchase Portal</div>
          </div>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center space-x-3">
          {/* Role Selector */}
          <select
            value={currentRole}
            onChange={e => handleRoleToggle(e.target.value as RoleType)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-cyan cursor-pointer"
          >
            {REGISTERABLE_ROLES.map(r => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>

          {/* DB Connected Badge */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-900/90 border border-emerald-500/60 px-3 py-1 rounded-full text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow"></span>
            <span>DB connected</span>
          </div>

          {/* Theme Toggle Icon */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-slate-200" /> : <Moon className="w-4 h-4 text-slate-200" />}
          </button>
        </div>
      </header>

      {/* Center Card Modal matching Image 1 */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md bg-[#111622]/95 backdrop-blur border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          
          <div className="flex flex-col items-center mb-6">
            <div className="text-3xl font-black tracking-tight text-white mb-2">
              ind<span className="text-brand-cyan">x</span>o
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              {ROLE_LABELS[currentRole]}
            </h1>
            <p className="text-xs text-slate-400 text-center mt-1 px-4">
              Sign in with your {isCustomerRole(currentRole) ? 'customer' : 'organization'} user ID and password to access the Industrial Purchase Portal.
            </p>
          </div>

          {/* Sign In vs Register Tabs */}
          <div className="flex border-b border-slate-800 mb-5">
            <button
              onClick={() => { setAuthTab('SIGN_IN'); setErrorMsg(''); }}
              className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition ${
                authTab === 'SIGN_IN'
                  ? 'border-brand-cyan text-brand-cyan'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthTab('REGISTER'); setErrorMsg(''); }}
              className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition ${
                authTab === 'REGISTER'
                  ? 'border-brand-cyan text-brand-cyan'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Register / Sign Up
            </button>
          </div>

          {/* Prompt if no registered users yet */}
          {registeredUsersCount === 0 && authTab === 'SIGN_IN' && (
            <div className="mb-4 p-2.5 rounded-lg text-xs font-medium border bg-blue-950/50 border-blue-800 text-blue-300 flex items-center justify-between">
              <span>No user accounts registered yet.</span>
              <button
                type="button"
                onClick={() => setAuthTab('REGISTER')}
                className="underline font-bold text-brand-cyan ml-2"
              >
                Register Now &rarr;
              </button>
            </div>
          )}

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-lg text-xs font-medium border bg-red-950/70 border-red-800 text-red-300">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-2.5 rounded-lg text-xs font-medium border bg-emerald-950/70 border-emerald-800 text-emerald-300">
              {successMsg}
            </div>
          )}

          {/* SIGN IN FORM (User enters their own registered credentials) */}
          {authTab === 'SIGN_IN' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">USER ID</label>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  placeholder="Enter your User ID"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-100 text-slate-900 placeholder-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">PASSWORD</label>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert('Please contact your administrator or parent identity provider for password reset.'); }}
                    className="text-xs text-brand-cyan hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-100 text-slate-900 placeholder-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">DATABASE</label>
                <div className="relative">
                  <select
                    value={database}
                    onChange={e => setDatabase(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan appearance-none cursor-pointer"
                  >
                    <option value="Live DB">Live DB</option>
                    <option value="Staging DB">Staging DB</option>
                    <option value="Sandbox DB">Sandbox DB</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-lg bg-brand-cyan hover:bg-brand-cyanHover text-slate-950 font-bold text-sm shadow-md transition"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('Please enter your User ID and Password to sign in, or click "Register / Sign Up" to create an account.');
                  }}
                  className="py-2.5 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold transition"
                >
                  Home
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthTab('REGISTER'); setErrorMsg(''); }}
                  className="text-xs text-brand-cyan hover:underline font-semibold"
                >
                  Not registered yet? Create Staff or Customer Account &rarr;
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM (100% user-input driven: create any staff or customer accounts) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                Register a new {ROLE_LABELS[currentRole]} account (persists dynamically)
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-brand-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    USER ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={regUserId}
                    onChange={e => setRegUserId(e.target.value)}
                    placeholder="Choose a User ID"
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-brand-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    ROLE *
                  </label>
                  <select
                    value={regRole}
                    onChange={e => setRegRole(e.target.value as RoleType)}
                    className="w-full px-2 py-2 rounded-lg bg-slate-900 text-slate-200 border border-slate-700 text-xs focus:ring-2 focus:ring-brand-cyan cursor-pointer"
                  >
                    {REGISTERABLE_ROLES.map(r => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  COMPANY / ORGANIZATION *
                </label>
                <input
                  type="text"
                  required
                  value={regCompany}
                  onChange={e => setRegCompany(e.target.value)}
                  placeholder="e.g. Your Factory / Company Name"
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-brand-cyan focus:outline-none"
                />
              </div>

              {isCustomerRole(regRole) ? (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    GSTIN (OPTIONAL OR 15 DIGITS)
                  </label>
                  <input
                    type="text"
                    value={regGstin}
                    onChange={e => setRegGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 text-slate-900 text-sm font-medium uppercase focus:ring-2 focus:ring-brand-cyan focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    DEPARTMENT / DESIGNATION
                  </label>
                  <input
                    type="text"
                    value={regDesignation}
                    onChange={e => setRegDesignation(e.target.value)}
                    placeholder={
                      regRole === 'COMMERCE_ADMIN' || regRole === 'PLATFORM_ADMIN'
                        ? 'e.g. Senior Operations Engineer • M6'
                        : 'e.g. Warehouse Manager, Chakan MIDC Hub'
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-brand-cyan focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  PASSWORD *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-brand-cyan focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-lg bg-brand-cyan hover:bg-brand-cyanHover text-slate-950 font-bold text-sm shadow-md transition"
                >
                  Create Account & Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('SIGN_IN')}
                  className="py-2.5 px-3 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 text-xs font-medium hover:bg-slate-800 transition"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Guidance note */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
            Accounts created are stored dynamically for your organization. Multiple staff and customers can register and sign in.
          </div>

        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 py-3">
        INDXO AI P Ltd • XMACH Industrial Purchase Portal • Ver 2.3.30 • Confidential Development
      </footer>
    </div>
  );
};
