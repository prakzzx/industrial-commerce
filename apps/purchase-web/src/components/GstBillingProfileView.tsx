import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { GstBillingProfile } from '../types';
import { Receipt, Plus, Trash2, ShieldCheck, X } from 'lucide-react';

const STORAGE_KEY = 'indxo_gst_profiles';

const emptyProfile: GstBillingProfile = {
  id: '',
  legalBusinessName: '',
  gstin: '',
  placeOfSupplyState: '',
  stateCode: '',
  registrationType: 'REGULAR',
  isDefault: false
};

export const GstBillingProfileView: React.FC = () => {
  const { isDark } = useTheme();
  const { currentUser } = useAuth();

  const [profiles, setProfiles] = useState<GstBillingProfile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<GstBillingProfile>(emptyProfile);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfiles(JSON.parse(saved));
        return;
      } catch {
        // fallthrough
      }
    }
    setProfiles([
      {
        id: 'GST-001',
        legalBusinessName: currentUser?.company || 'Registered Organization',
        gstin: currentUser?.gstin || '27AAAAA0000A1Z5',
        placeOfSupplyState: 'Maharashtra',
        stateCode: '27',
        registrationType: 'REGULAR',
        isDefault: true
      }
    ]);
  }, []);

  const persist = (next: GstBillingProfile[]) => {
    setProfiles(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.legalBusinessName.trim() || !form.gstin.trim() || !form.placeOfSupplyState.trim()) {
      alert('Legal business name, GSTIN and place of supply are mandatory.');
      return;
    }
    const created: GstBillingProfile = { ...form, id: `GST-${Math.floor(1000 + Math.random() * 9000)}` };
    persist([...profiles, created]);
    setForm(emptyProfile);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    persist(profiles.filter(p => p.id !== id));
  };

  const setDefault = (id: string) => {
    persist(profiles.map(p => ({ ...p, isDefault: p.id === id })));
  };

  return (
    <div className="space-y-4">
      <div
        className={`border rounded-xl p-5 shadow-lg transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-brand-cyan" />
              <span>GST &amp; Billing Profile</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              GSTIN must belong to your billing profile or an approved site/legal entity authorized for this tenant. Legal
              GST validation and statutory invoice authority remain with the parent InvoiceService.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1.5 rounded-lg bg-brand-cyan text-slate-950 font-bold text-xs flex items-center space-x-1.5 hover:bg-brand-cyanHover transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add GST Profile</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className={`border rounded-xl p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow ${
                isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm">{profile.legalBusinessName}</span>
                  {profile.isDefault && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px] flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Default</span>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                    {profile.registrationType}
                  </span>
                </div>
                <div className="text-brand-cyan font-mono font-bold mt-1">GSTIN: {profile.gstin}</div>
                <div className="text-slate-400 mt-0.5">
                  Place of Supply: {profile.placeOfSupplyState} (State Code {profile.stateCode})
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!profile.isDefault && (
                  <button
                    onClick={() => setDefault(profile.id)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition ${
                      isDark ? 'border-slate-700 text-slate-300 hover:text-white' : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    Make Default
                  </button>
                )}
                <button onClick={() => handleDelete(profile.id)} className="text-slate-400 hover:text-red-400 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-xl border p-5 shadow-2xl relative ${
              isDark ? 'bg-[#111726] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Add GST Billing Profile</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">LEGAL BUSINESS NAME *</label>
                <input
                  value={form.legalBusinessName}
                  onChange={e => setForm({ ...form, legalBusinessName: e.target.value })}
                  className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">GSTIN *</label>
                  <input
                    value={form.gstin}
                    onChange={e => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    className={`w-full px-3 py-2 rounded border uppercase ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">REGISTRATION TYPE</label>
                  <select
                    value={form.registrationType}
                    onChange={e => setForm({ ...form, registrationType: e.target.value as GstBillingProfile['registrationType'] })}
                    className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  >
                    <option value="REGULAR">Regular</option>
                    <option value="COMPOSITION">Composition</option>
                    <option value="UNREGISTERED">Unregistered</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">PLACE OF SUPPLY (STATE) *</label>
                  <input
                    value={form.placeOfSupplyState}
                    onChange={e => setForm({ ...form, placeOfSupplyState: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">STATE CODE *</label>
                  <input
                    value={form.stateCode}
                    onChange={e => setForm({ ...form, stateCode: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-brand-cyan text-slate-950 font-bold">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
