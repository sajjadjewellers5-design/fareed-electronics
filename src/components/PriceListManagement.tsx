import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  CheckCircle2,
  RefreshCw,
  Boxes,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { ProductItem } from '../types';
import { useApp } from '../context/AppContext';

export const PriceListManagement: React.FC = () => {
  const { products, adjustCategoryPrices, formatCurrency, companyProfile } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'PRICE_LIST' | 'ADJUSTMENT'>('PRICE_LIST');

  // Bulk Price Adjustment Form State
  const [adjCategory, setAdjCategory] = useState('Displays & Panels');
  const [adjDirection, setAdjDirection] = useState<'INCREASE' | 'DECREASE'>('INCREASE');
  const [adjType, setAdjType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [adjValue, setAdjValue] = useState<string>('5');
  const [adjTarget, setAdjTarget] = useState<'SALE' | 'COST' | 'BOTH'>('SALE');
  const [applySuccessMsg, setApplySuccessMsg] = useState('');

  const categories = [
    'ALL',
    'Displays & Panels',
    'Batteries & Power',
    'ICs & Micro-Controllers',
    'Charging Ports & Flexes',
    'Cameras & Sensors',
    'Housings & Frames',
    'Lab Diagnostic Tools',
    'Accessories & Cables',
    'Soldering & Consumables',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate live preview for category price adjustment
  const previewProducts = products.filter(
    (p) => adjCategory === 'ALL' || p.category === adjCategory
  );

  const calculatePreviewPrices = (originalPrice: number) => {
    const numVal = Number(adjValue) || 0;
    const factor = adjDirection === 'INCREASE' ? 1 : -1;
    if (adjType === 'PERCENT') {
      return Math.round(originalPrice + factor * (originalPrice * (numVal / 100)));
    }
    return Math.max(0, originalPrice + factor * numVal);
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const numVal = Number(adjValue);
    if (!numVal || numVal <= 0) {
      alert('Please enter a valid adjustment value greater than 0.');
      return;
    }

    const res = adjustCategoryPrices(
      adjCategory,
      adjType,
      numVal,
      adjDirection,
      adjTarget
    );

    setApplySuccessMsg(
      `Successfully adjusted prices for ${res.updatedCount} items in "${adjCategory}"!`
    );
    setTimeout(() => {
      setApplySuccessMsg('');
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#072836] border border-[#0d556e]/80 p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>Price List &amp; Bulk Price Adjustment (پرائس لسٹ و قیمت ردوبدل)</span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              مجموعی پرائس لسٹ، ہول سیل و ریٹیل مارجن اور کیٹیگری وائز (+/-) فیصد یا فکس رقم کی تبدیلی
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSubTab('PRICE_LIST')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'PRICE_LIST'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            Price List Sheet (ریٹ لسٹ)
          </button>
          <button
            onClick={() => setActiveSubTab('ADJUSTMENT')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'ADJUSTMENT'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            +/- Price Adjustment by Category (کیٹیگری ایڈجسٹمنٹ)
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors shadow cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Rate Sheet</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Price List Sheet */}
      {activeSubTab === 'PRICE_LIST' && (
        <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl p-6 shadow-sm space-y-4" id="pricelist-print-area">
          {/* Header & Controls */}
          <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search item or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-semibold text-slate-400">
              Showing <span className="text-cyan-400 font-bold">{filteredProducts.length}</span> of{' '}
              {products.length} catalog items
            </div>
          </div>

          {/* Printable Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-white uppercase">{companyProfile.name}</h2>
              <p className="text-xs text-slate-300">Official Wholesale &amp; Retail Component Price Sheet</p>
            </div>
            <div className="text-right text-xs text-slate-400 font-mono">
              Date: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Price Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Product / Component Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Cost Price (خرید)</th>
                  <th className="p-3 text-right font-black text-cyan-400">Sale Price (فروخت)</th>
                  <th className="p-3 text-right">Margin (منافع)</th>
                  <th className="p-3 text-center">Stock In Hand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.map((p) => {
                  const profit = p.salePrice - p.costPrice;
                  const marginPct = p.costPrice > 0 ? ((profit / p.costPrice) * 100).toFixed(0) : '0';

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-400">{p.sku}</td>
                      <td className="p-3 font-semibold text-white">
                        <div>{p.name}</div>
                        {p.location && (
                          <div className="text-[10px] text-slate-400">Location: {p.location}</div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-400">
                        {formatCurrency(p.costPrice)}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-cyan-400 text-sm">
                        {formatCurrency(p.salePrice)}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-400 font-bold">
                        +{formatCurrency(profit)} ({marginPct}%)
                      </td>
                      <td className="p-3 text-center font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${
                            p.stockQuantity <= p.minStockLevel
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {p.stockQuantity} {p.unit}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Category Price Adjustment (+/-) */}
      {activeSubTab === 'ADJUSTMENT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Adjustment Tool Configuration Form */}
          <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Category Price Adjuster (+/-)</span>
            </div>

            {applySuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{applySuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleApplyAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  1. Target Category (کیٹیگری منتخب کریں) *
                </label>
                <select
                  value={adjCategory}
                  onChange={(e) => setAdjCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-400"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === 'ALL' ? 'All Categories (تمام کیٹیگریز)' : c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  2. Direction (+ اضافہ یا - کمی) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjDirection('INCREASE')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      adjDirection === 'INCREASE'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Increase (+) اضافہ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjDirection('DECREASE')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      adjDirection === 'DECREASE'
                        ? 'bg-rose-600/30 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    <span>Decrease (-) کمی</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  3. Adjustment Type (قسم تبدیلی) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjType('PERCENT')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      adjType === 'PERCENT'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Percent className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Percentage (%) فیصد</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjType('FIXED')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      adjType === 'FIXED'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fixed Rs. (فکس رقم)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  4. Adjustment Value (مقدار / ویلیو) *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  placeholder={adjType === 'PERCENT' ? 'e.g. 5 (for 5%)' : 'e.g. 500 (for 500 Rs)'}
                  value={adjValue}
                  onChange={(e) => setAdjValue(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  5. Target Field (لاگو کرنے کا فیلڈ) *
                </label>
                <select
                  value={adjTarget}
                  onChange={(e) =>
                    setAdjTarget(e.target.value as typeof adjTarget)
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-400"
                >
                  <option value="SALE">Sale Price Only (صرف فروخت قیمت)</option>
                  <option value="COST">Cost Price Only (صرف خرید قیمت)</option>
                  <option value="BOTH">Both Sale &amp; Cost Prices (دونوں قیمتیں)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-black rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Apply Bulk Price Adjustment</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-2 bg-[#072836] border border-[#0d556e]/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-white">Live Calculation Preview</h3>
                <p className="text-xs text-slate-400">
                  Preview of {previewProducts.length} items with {adjDirection === 'INCREASE' ? '+' : '-'}
                  {adjValue}
                  {adjType === 'PERCENT' ? '%' : ' Rs.'} applied:
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {previewProducts.length} Affected Items
              </span>
            </div>

            <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider font-semibold sticky top-0">
                  <tr>
                    <th className="p-2.5">SKU / Item</th>
                    <th className="p-2.5 text-right">Current Sale</th>
                    <th className="p-2.5 text-right font-black text-cyan-300">New Sale Price</th>
                    <th className="p-2.5 text-right">Current Cost</th>
                    <th className="p-2.5 text-right font-bold text-amber-300">New Cost Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {previewProducts.map((p) => {
                    const newSale =
                      adjTarget === 'SALE' || adjTarget === 'BOTH'
                        ? calculatePreviewPrices(p.salePrice)
                        : p.salePrice;
                    const newCost =
                      adjTarget === 'COST' || adjTarget === 'BOTH'
                        ? calculatePreviewPrices(p.costPrice)
                        : p.costPrice;

                    return (
                      <tr key={p.id} className="hover:bg-slate-900/40">
                        <td className="p-2.5">
                          <div className="font-semibold text-white">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.sku}</div>
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-400">
                          {formatCurrency(p.salePrice)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-black text-cyan-400 text-sm">
                          {formatCurrency(newSale)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-400">
                          {formatCurrency(p.costPrice)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-amber-400">
                          {formatCurrency(newCost)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
