import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { ApiService } from '../services/api';
import { IndustrialProduct, VendorOffer } from '../types';
import { Search, Plus, ShoppingBag, Info, ArrowRightLeft, X } from 'lucide-react';

interface CatalogueViewProps {
  onQuickBuy: () => void;
  initialCategory?: string;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({ onQuickBuy, initialCategory }) => {
  const { isDark } = useTheme();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<IndustrialProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || 'ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setCategoryFilter(initialCategory);
    }
  }, [initialCategory]);

  // Selected vendor offer map: { [productId]: vendorId }
  const [selectedOffers, setSelectedOffers] = useState<Record<string, string>>({});
  // Selected quantity map: { [productId]: number }
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  // Product detail modal
  const [detailProduct, setDetailProduct] = useState<IndustrialProduct | null>(null);

  // Compare products state (up to 2 products)
  const [compareList, setCompareList] = useState<IndustrialProduct[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [categoryFilter, brandFilter]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await ApiService.getProducts(searchQuery, categoryFilter, brandFilter);
    setProducts(data);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const getActiveOffer = (product: IndustrialProduct): VendorOffer => {
    const chosenVendorId = selectedOffers[product.id];
    if (chosenVendorId) {
      const found = product.offers.find(o => o.vendorId === chosenVendorId);
      if (found) return found;
    }
    return product.offers[0];
  };

  const getQty = (product: IndustrialProduct): number => {
    const offer = getActiveOffer(product);
    return selectedQuantities[product.id] || offer.minQty || 1;
  };

  const setQty = (productId: string, val: number, minVal: number) => {
    const valid = Math.max(minVal, val);
    setSelectedQuantities(prev => ({ ...prev, [productId]: valid }));
  };

  const handleAdd = (product: IndustrialProduct) => {
    const offer = getActiveOffer(product);
    const qty = getQty(product);
    for (let i = 0; i < qty; i++) {
      addToCart(product, offer);
    }
    alert(`Added ${qty} x "${product.name}" from ${offer.vendorName} to cart.`);
  };

  const toggleCompare = (product: IndustrialProduct) => {
    if (compareList.some(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else {
      if (compareList.length >= 2) {
        alert('You can compare up to 2 industrial products at a time.');
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Discovery Bar */}
      <div
        className={`border rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-3 transition-colors ${
          isDark ? 'bg-[#121722] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by part name, SKU, OEM (FANUC, Siemens, Sandvik), HSN code or machine model..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-cyan transition ${
              isDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-300'
            }`}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
        </form>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className={`w-full md:w-56 px-3 py-2.5 rounded-lg border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-cyan ${
            isDark ? 'bg-slate-900 text-slate-200 border-slate-700' : 'bg-slate-50 text-slate-800 border-slate-300'
          }`}
        >
          <option value="ALL">All Categories (11)</option>
          <option value="cutting_tools">Cutting Tools & Inserts</option>
          <option value="consumables">Consumables & Coolants</option>
          <option value="raw_materials">Raw Materials (Steel/Alu)</option>
          <option value="cnc_spares">CNC Spares & Batteries</option>
          <option value="plc_automation">PLC & Automation</option>
          <option value="sensors_iiot">Sensors & IIoT Gateways</option>
          <option value="electrical">Electrical & Switchgear</option>
          <option value="mechanical">Mechanical & Bearings</option>
          <option value="machine_accessories">Machine Accessories & Collets</option>
          <option value="machines_retrofit">Machines & Retrofit Kits</option>
          <option value="quality_metrology">Quality & Metrology</option>
        </select>

        <select
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
          className={`w-full md:w-44 px-3 py-2.5 rounded-lg border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-cyan ${
            isDark ? 'bg-slate-900 text-slate-200 border-slate-700' : 'bg-slate-50 text-slate-800 border-slate-300'
          }`}
        >
          <option value="ALL">All Brands / OEMs</option>
          <option value="Sandvik">Sandvik Coromant</option>
          <option value="FANUC">FANUC</option>
          <option value="Siemens">Siemens</option>
          <option value="Blaser">Blaser Swisslube</option>
          <option value="SKF">SKF Bearings</option>
          <option value="Mitutoyo">Mitutoyo</option>
          <option value="Tata Steel">Tata Steel</option>
          <option value="IFM">IFM Electronic</option>
          <option value="Schneider">Schneider Electric</option>
          <option value="Kennametal">Kennametal</option>
          <option value="INDXO">INDXO XMACH</option>
        </select>

        {compareList.length > 0 && (
          <button
            onClick={() => setShowCompareModal(true)}
            className="w-full md:w-auto px-3.5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow transition"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Compare ({compareList.length})</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">Loading industrial products...</div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p className="font-bold">No industrial items matched your query.</p>
          <p className="text-xs mt-1">Try clearing your filters or searching for "Sandvik", "FANUC", "Coolant", or "Bearing".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map(item => {
            const activeOffer = getActiveOffer(item);
            const currentQty = getQty(item);
            const isCompared = compareList.some(p => p.id === item.id);

            return (
              <div
                key={item.id}
                className={`border rounded-xl p-4 shadow-lg flex flex-col justify-between hover:border-slate-500 transition ${
                  isDark ? 'bg-[#121722] border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-brand-cyan font-semibold uppercase tracking-wider">
                      {item.brand}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-mono text-[10px]">HSN: {item.hsn}</span>
                      <button
                        onClick={() => toggleCompare(item)}
                        title="Compare with another SKU"
                        className={`text-[10px] px-1.5 py-0.5 rounded border transition ${
                          isCompared
                            ? 'bg-purple-900 border-purple-500 text-purple-200 font-bold'
                            : isDark ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {isCompared ? '✓ Compare' : '+ Compare'}
                      </button>
                    </div>
                  </div>

                  <h3 className={`text-sm font-bold leading-snug line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>

                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {item.compatibility.slice(0, 2).map((c, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        ⚙️ {c}
                      </span>
                    ))}
                  </div>

                  {/* Multiple Vendor Offers Selector */}
                  <div className="mt-3">
                    {item.offers.length > 1 ? (
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                          Select Vendor ({item.offers.length} Offers Available):
                        </div>
                        <select
                          value={activeOffer.vendorId}
                          onChange={e => setSelectedOffers(prev => ({ ...prev, [item.id]: e.target.value }))}
                          className={`w-full px-2 py-1 rounded text-[11px] border font-medium ${
                            isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
                          }`}
                        >
                          {item.offers.map(off => (
                            <option key={off.vendorId} value={off.vendorId}>
                              {off.vendorName} — ₹{off.price.toLocaleString()} ({off.leadDays}d lead, {off.stock} stock)
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}

                    {/* Active Offer Details Card */}
                    <div
                      className={`mt-2 p-2.5 rounded-lg border text-xs ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[11px]">Vendor:</span>
                        <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {activeOffer.vendorName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-black text-brand-cyan">₹{activeOffer.price.toLocaleString()}</span>
                        <span className="text-[10px] text-emerald-400 font-medium">In Stock ({activeOffer.stock} avail)</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                        <span>MOQ: {activeOffer.minQty} {item.uom} • Lead: {activeOffer.leadDays} day(s)</span>
                        <button
                          onClick={() => setDetailProduct(item)}
                          className="text-brand-cyan hover:underline text-[10px] flex items-center space-x-0.5"
                        >
                          <Info className="w-3 h-3 inline" />
                          <span>Specs</span>
                        </button>
                      </div>

                      {/* Volume Pricing Tier Badges if available */}
                      {activeOffer.priceBreaks && activeOffer.priceBreaks.length > 1 && (
                        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Volume Tiers:</span>
                          {activeOffer.priceBreaks.map((pb, idx) => (
                            <span
                              key={idx}
                              className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${
                                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-700'
                              }`}
                            >
                              {pb.min}+: ₹{pb.price.toLocaleString()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Order Quantity:</span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setQty(item.id, currentQty - 1, activeOffer.minQty)}
                        className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                          isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                        }`}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-xs">{currentQty}</span>
                      <button
                        onClick={() => setQty(item.id, currentQty + 1, activeOffer.minQty)}
                        className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                          isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAdd(item)}
                      className="flex-1 py-2 px-3 rounded-lg bg-brand-cyan hover:bg-brand-cyanHover text-slate-950 font-bold text-xs shadow transition flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => {
                        handleAdd(item);
                        onQuickBuy();
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 inline mr-1" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Specifications & HSN Details Modal */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-xl rounded-xl border p-5 shadow-2xl relative ${
              isDark ? 'bg-[#111726] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <button
              onClick={() => setDetailProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold text-xs uppercase">
                {detailProduct.brand}
              </span>
              <span className="text-xs text-slate-400 font-mono">SKU: {detailProduct.sku}</span>
            </div>

            <h2 className="text-lg font-bold pr-8">{detailProduct.name}</h2>
            <p className="text-xs text-slate-400 mt-1">{detailProduct.description}</p>

            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">HSN CODE</span>
                <span className="font-mono font-bold text-white">{detailProduct.hsn}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">GST TAX RATE</span>
                <span className="font-bold text-emerald-400">{detailProduct.taxRate}% (ITC Eligible)</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">UNIT OF MEASURE</span>
                <span className="font-bold text-white">{detailProduct.uom}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">CATEGORY</span>
                <span className="font-bold text-brand-cyan capitalize">{detailProduct.category.replace('_', ' ')}</span>
              </div>
            </div>

            {detailProduct.specifications && (
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Technical Specifications</h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(detailProduct.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                      <span className="text-slate-400">{key}:</span>
                      <span className="font-semibold text-slate-200">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setDetailProduct(null)}
                className="px-4 py-2 rounded-lg bg-brand-cyan text-slate-950 font-bold text-xs"
              >
                Close Specs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Comparison Modal */}
      {showCompareModal && compareList.length === 2 && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-3xl rounded-xl border p-5 shadow-2xl relative ${
              isDark ? 'bg-[#111726] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center space-x-2">
                <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                <span>Side-by-Side Industrial Product Comparison</span>
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {compareList.map(item => (
                <div key={item.id} className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold text-[10px]">
                    {item.brand}
                  </span>
                  <h4 className="font-bold text-sm text-white">{item.name}</h4>
                  <div className="text-lg font-black text-brand-cyan">
                    ₹{item.offers[0].price.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ {item.uom}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">HSN: {item.hsn} • GST: {item.taxRate}%</div>
                  <div className="text-slate-400 text-[11px]">Lead time: {item.offers[0].leadDays} working day(s)</div>
                  
                  {item.specifications && (
                    <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                      {Object.entries(item.specifications).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-[10px]">
                          <span className="text-slate-400">{k}:</span>
                          <span className="text-slate-200 font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      addToCart(item, item.offers[0]);
                      setShowCompareModal(false);
                      alert(`Added "${item.name}" to cart.`);
                    }}
                    className="w-full mt-3 py-2 rounded bg-brand-cyan text-slate-950 font-bold text-xs"
                  >
                    Add This Variant to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
