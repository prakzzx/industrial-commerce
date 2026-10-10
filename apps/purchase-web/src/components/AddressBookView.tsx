import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AddressSnapshot } from '../types';
import { MapPin, Plus, Trash2, Star, X, Building2 } from 'lucide-react';

const STORAGE_KEY = 'indxo_address_book';

const SEED_ADDRESSES: AddressSnapshot[] = [
  {
    id: 'ADDR-001',
    type: 'DELIVERY',
    companyName: 'Apex Precision Tools & Engineering',
    contactPerson: 'Prakati',
    contactPhone: '+91 98765 43210',
    addressLine1: 'Gate 2, Plot B-14, Chakan MIDC',
    city: 'Pune',
    state: 'Maharashtra',
    stateCode: '27',
    postalCode: '410501',
    gstin: '27AAAAA0000A1Z5'
  },
  {
    id: 'ADDR-002',
    type: 'DELIVERY',
    companyName: 'Apex Precision Tools & Engineering',
    contactPerson: 'Shweta P',
    contactPhone: '+91 98450 11223',
    addressLine1: 'Plot 42, Peenya 2nd Stage',
    city: 'Bengaluru',
    state: 'Karnataka',
    stateCode: '29',
    postalCode: '560058',
    gstin: '29AAAAA0000A1Z4'
  }
];

const emptyAddress: AddressSnapshot = {
  type: 'DELIVERY',
  companyName: '',
  contactPerson: '',
  contactPhone: '',
  addressLine1: '',
  city: '',
  state: '',
  stateCode: '',
  postalCode: '',
  gstin: ''
};

export const AddressBookView: React.FC = () => {
  const { isDark } = useTheme();
  const { currentUser } = useAuth();

  const [addresses, setAddresses] = useState<AddressSnapshot[]>([]);
  const [defaultBillingId, setDefaultBillingId] = useState<string | null>(null);
  const [defaultDeliveryId, setDefaultDeliveryId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressSnapshot>(emptyAddress);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAddresses(parsed.addresses || []);
        setDefaultBillingId(parsed.defaultBillingId || null);
        setDefaultDeliveryId(parsed.defaultDeliveryId || null);
        return;
      } catch {
        // fallthrough to seed
      }
    }
    setAddresses(SEED_ADDRESSES.map(a => ({ ...a, companyName: currentUser?.company || a.companyName })));
    setDefaultDeliveryId('ADDR-001');
  }, []);

  const persist = (next: AddressSnapshot[], billingId = defaultBillingId, deliveryId = defaultDeliveryId) => {
    setAddresses(next);
    setDefaultBillingId(billingId);
    setDefaultDeliveryId(deliveryId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ addresses: next, defaultBillingId: billingId, defaultDeliveryId: deliveryId }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.addressLine1.trim() || !form.city.trim() || !form.state.trim() || !form.postalCode.trim()) {
      alert('Please complete all mandatory address fields.');
      return;
    }
    const newAddr: AddressSnapshot = { ...form, id: `ADDR-${Math.floor(1000 + Math.random() * 9000)}` };
    const next = [...addresses, newAddr];
    persist(next);
    setForm(emptyAddress);
    setShowForm(false);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    persist(addresses.filter(a => a.id !== id));
  };

  const setDefault = (id: string, type: 'BILLING' | 'DELIVERY') => {
    if (type === 'BILLING') persist(addresses, id, defaultDeliveryId);
    else persist(addresses, defaultBillingId, id);
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
              <MapPin className="w-4 h-4 text-brand-cyan" />
              <span>Billing &amp; Delivery Address Book</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage saved sites for checkout. Orders store immutable snapshots — later edits here never alter historical invoices.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1.5 rounded-lg bg-brand-cyan text-slate-950 font-bold text-xs flex items-center space-x-1.5 hover:bg-brand-cyanHover transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div
              key={addr.id}
              className={`border rounded-xl p-4 text-xs space-y-2 shadow ${
                isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold text-[10px] uppercase">
                  {addr.type}
                </span>
                <button onClick={() => handleDelete(addr.id)} className="text-slate-400 hover:text-red-400 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="font-bold flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{addr.companyName}</span>
              </div>
              <div className="text-slate-400">{addr.contactPerson} • {addr.contactPhone}</div>
              <div className="text-slate-300">{addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}</div>
              {addr.gstin && <div className="text-[10px] font-mono text-brand-cyan">GSTIN: {addr.gstin}</div>}

              <div className="pt-2 flex items-center gap-2 border-t border-slate-800/60 mt-2">
                <button
                  onClick={() => setDefault(addr.id!, 'BILLING')}
                  className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center space-x-1 border transition ${
                    defaultBillingId === addr.id
                      ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                      : isDark ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  <Star className="w-3 h-3" />
                  <span>{defaultBillingId === addr.id ? 'Default Billing' : 'Set Billing'}</span>
                </button>
                <button
                  onClick={() => setDefault(addr.id!, 'DELIVERY')}
                  className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center space-x-1 border transition ${
                    defaultDeliveryId === addr.id
                      ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                      : isDark ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  <Star className="w-3 h-3" />
                  <span>{defaultDeliveryId === addr.id ? 'Default Delivery' : 'Set Delivery'}</span>
                </button>
              </div>
            </div>
          ))}

          {addresses.length === 0 && (
            <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
              No saved addresses yet. Click "Add Address" to create your first billing or delivery site.
            </div>
          )}
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
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Add New Address</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">ADDRESS TYPE</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as 'BILLING' | 'DELIVERY' })}
                    className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  >
                    <option value="DELIVERY">Delivery Site</option>
                    <option value="BILLING">Billing Address</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">COMPANY / SITE NAME *</label>
                  <input
                    value={form.companyName}
                    onChange={e => setForm({ ...form, companyName: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">CONTACT PERSON</label>
                  <input
                    value={form.contactPerson}
                    onChange={e => setForm({ ...form, contactPerson: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">CONTACT PHONE</label>
                  <input
                    value={form.contactPhone}
                    onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">ADDRESS LINE *</label>
                <input
                  value={form.addressLine1}
                  onChange={e => setForm({ ...form, addressLine1: e.target.value })}
                  className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">CITY *</label>
                  <input
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">STATE *</label>
                  <input
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">PIN CODE *</label>
                  <input
                    value={form.postalCode}
                    onChange={e => setForm({ ...form, postalCode: e.target.value })}
                    className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">GSTIN (OPTIONAL)</label>
                <input
                  value={form.gstin}
                  onChange={e => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                  className={`w-full px-3 py-2 rounded border uppercase ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-brand-cyan text-slate-950 font-bold">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
