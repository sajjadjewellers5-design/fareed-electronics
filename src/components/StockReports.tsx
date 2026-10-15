import React, { useState } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  Download,
  Boxes,
  TrendingUp,
  Layers,
  Search,
  RotateCcw,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StockReports: React.FC = () => {
  const {
    products,
    stockMovements,
    formatCurrency,
    companyProfile,
    setActiveTab,
    loadSampleData,
    invoices,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'VALUATION' | 'LOW_STOCK' | 'MOVEMENTS' | 'PERFORMANCE'>('VALUATION');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Valuation computations
  const totalCostValuation = products.reduce((acc, p) => acc + p.costPrice * p.stockQuantity, 0);
  const totalRetailValuation = products.reduce((acc, p) => acc + p.salePrice * p.stockQuantity, 0);
  const totalUnitsInStock = products.reduce((acc, p) => acc + p.stockQuantity, 0);
  const potentialProfit = totalRetailValuation - totalCostValuation;
  const potentialMargin =
    totalRetailValuation > 0 ? ((potentialProfit / totalRetailValuation) * 100).toFixed(1) : '0';

  // Low stock products
  const lowStockProducts = products.filter((p) => p.stockQuantity <= p.minStockLevel);

  // Categories list
  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  // Group by category for valuation
  const categorySummary = products.reduce((acc, p) => {
    if (!acc[p.category]) {
      acc[p.category] = { count: 0, units: 0, costValue: 0, retailValue: 0 };
    }
    acc[p.category].count += 1;
    acc[p.category].units += p.stockQuantity;
    acc[p.category].costValue += p.costPrice * p.stockQuantity;
    acc[p.category].retailValue += p.salePrice * p.stockQuantity;
    return acc;
  }, {} as Record<string, { count: number; units: number; costValue: number; retailValue: number }>);

  // Filter products for itemized stock register
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filter movements
  const filteredMovements = stockMovements.filter(
    (m) =>
      m.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.referenceId && m.referenceId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Performance calculations (Sales per product)
  const productSalesQty: Record<string, number> = {};
  const productSalesRev: Record<string, number> = {};
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      productSalesQty[item.productId] = (productSalesQty[item.productId] || 0) + item.quantity;
      productSalesRev[item.productId] = (productSalesRev[item.productId] || 0) + item.total;
    });
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportStockCsv = () => {
    let csv = 'data:text/csv;charset=utf-8,';
    csv += 'Fareed Electronics - Stock Inventory Report\n\n';
    csv += 'SKU,Item Name,Category,Shelf Location,Quantity,Unit Cost,Unit Sale,Total Cost Value,Total Retail Value\n';
    products.forEach((p) => {
      csv += `"${p.sku}","${p.name}","${p.category}","${p.location || ''}",${p.stockQuantity},${p.costPrice},${p.salePrice},${p.costPrice * p.stockQuantity},${p.salePrice * p.stockQuantity}\n`;
    });
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `fareed_stock_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <span>Inventory &amp; Stock Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit inventory valuation, itemized stock register, reorder alerts, and audit trail movements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {products.length === 0 && (
            <button
              onClick={loadSampleData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Sample Stock Data</span>
            </button>
          )}

          <button
            onClick={handleExportStockCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="no-print flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit flex-wrap">
        <button
          onClick={() => setActiveSubTab('VALUATION')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'VALUATION'
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Stock Valuation &amp; Register ({products.length})
        </button>

        <button
          onClick={() => setActiveSubTab('LOW_STOCK')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'LOW_STOCK'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Low Stock &amp; Reorders</span>
          {lowStockProducts.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-950 text-amber-300 font-mono">
              {lowStockProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('MOVEMENTS')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'MOVEMENTS'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Stock Movement Ledger ({stockMovements.length})
        </button>

        <button
          onClick={() => setActiveSubTab('PERFORMANCE')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'PERFORMANCE'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fast/Slow Moving Analysis
        </button>
      </div>

      {/* SUBTAB 1: VALUATION & COMPLETE STOCK REGISTER */}
      {activeSubTab === 'VALUATION' && (
        <div className="space-y-5">
          {/* Summary Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Total Stock Cost Value</span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {formatCurrency(totalCostValuation)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Total investment capital in store
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Expected Retail Realization</span>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                {formatCurrency(totalRetailValuation)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Gross sales realizable at full retail
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Potential Gross Profit</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {formatCurrency(potentialProfit)}
              </div>
              <div className="text-[11px] text-emerald-400/80 font-mono mt-1">
                {potentialMargin}% expected overall margin
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Total Physical Quantities</span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {totalUnitsInStock} Units
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Across {products.length} registered SKUs
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="no-print bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stock register by part name, SKU, or shelf..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'ALL' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* COMPLETE ITEMIZED STOCK REGISTER TABLE */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-cyan-400" />
                <span>Itemized Inventory Valuation Register ({filteredProducts.length} Items)</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                Sorted by Product SKU
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-950/60">
                    <th className="py-2.5 px-3">SKU &amp; Component</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-center">In Stock</th>
                    <th className="py-2.5 px-3 text-right">Unit Cost</th>
                    <th className="py-2.5 px-3 text-right">Unit Retail</th>
                    <th className="py-2.5 px-3 text-right">Total Cost</th>
                    <th className="py-2.5 px-3 text-right">Total Retail</th>
                    <th className="py-2.5 px-3 text-right">Est. Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredProducts.map((p) => {
                    const itemCostTotal = p.costPrice * p.stockQuantity;
                    const itemRetailTotal = p.salePrice * p.stockQuantity;
                    const itemProfit = itemRetailTotal - itemCostTotal;
                    const itemMargin =
                      itemRetailTotal > 0 ? ((itemProfit / itemRetailTotal) * 100).toFixed(0) : '0';

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="font-mono text-[11px] text-cyan-400">{p.sku}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{p.category}</td>
                        <td className="py-3 px-3 text-slate-400">
                          <span className="flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {p.location || '—'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          <span
                            className={
                              p.stockQuantity <= p.minStockLevel
                                ? 'text-amber-400'
                                : 'text-white'
                            }
                          >
                            {p.stockQuantity} {p.unit}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">
                          {formatCurrency(p.costPrice)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-white">
                          {formatCurrency(p.salePrice)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-200 font-semibold">
                          {formatCurrency(itemCostTotal)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-cyan-400">
                          {formatCurrency(itemRetailTotal)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                          {itemMargin}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Category-Wise Valuation Breakdown</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-950/40">
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">SKU Count</th>
                    <th className="py-2.5 px-3 text-center">Total Units</th>
                    <th className="py-2.5 px-3 text-right">Cost Valuation</th>
                    <th className="py-2.5 px-3 text-right">Retail Valuation</th>
                    <th className="py-2.5 px-3 text-right">Est. Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {Object.entries(categorySummary).map(([cat, stats]) => {
                    const profit = stats.retailValue - stats.costValue;
                    return (
                      <tr key={cat} className="hover:bg-slate-800/30">
                        <td className="py-3 px-3 font-semibold text-white">{cat}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-300">
                          {stats.count}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-300">
                          {stats.units}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">
                          {formatCurrency(stats.costValue)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-white font-bold">
                          {formatCurrency(stats.retailValue)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                          {formatCurrency(profit)}
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

      {/* SUBTAB 2: LOW STOCK & REORDER */}
      {activeSubTab === 'LOW_STOCK' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Low Stock &amp; Inventory Reorder Report</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Items ordered by stock urgency. Restock items at or below reorder threshold.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('purchase-invoices')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer transition-colors"
              >
                + Create Inward Purchase Bill
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-950/40">
                    <th className="py-2.5 px-3">Item Name &amp; SKU</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Shelf Location</th>
                    <th className="py-2.5 px-3 text-center">Current Stock</th>
                    <th className="py-2.5 px-3 text-center">Min Threshold</th>
                    <th className="py-2.5 px-3 text-center">Reorder Urgency</th>
                    <th className="py-2.5 px-3 text-center">Suggested Restock</th>
                    <th className="py-2.5 px-3 text-right">Est. Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products
                    .slice()
                    .sort((a, b) => a.stockQuantity - b.stockQuantity)
                    .map((p) => {
                      const isCritical = p.stockQuantity <= p.minStockLevel;
                      const deficit = isCritical
                        ? Math.max(1, p.minStockLevel * 2 - p.stockQuantity)
                        : 0;
                      const estimatedReorderCost = deficit * p.costPrice;

                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-slate-800/30 ${
                            isCritical ? 'bg-amber-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{p.name}</div>
                            <div className="font-mono text-[11px] text-cyan-400">{p.sku}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-300">{p.category}</td>
                          <td className="py-3 px-3 text-slate-400">{p.location || '—'}</td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono border ${
                                p.stockQuantity <= 0
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : isCritical
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              }`}
                            >
                              {p.stockQuantity} {p.unit}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-400">
                            {p.minStockLevel} {p.unit}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {isCritical ? (
                              <span className="text-amber-400 font-bold text-[11px] uppercase">
                                High Urgency
                              </span>
                            ) : (
                              <span className="text-emerald-400 text-[11px]">Sufficient</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-amber-300">
                            {isCritical ? `+${deficit} ${p.unit}` : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-white">
                            {isCritical ? formatCurrency(estimatedReorderCost) : '—'}
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

      {/* SUBTAB 3: STOCK MOVEMENTS LEDGER */}
      {activeSubTab === 'MOVEMENTS' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-blue-400" />
                  <span>Audit Trail &amp; Stock Movement Ledger</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete historic record of sales deductions, purchase stock-in, and manual adjustments.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter movement ledger..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-950/40">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Component / SKU</th>
                    <th className="py-2.5 px-3 text-center">Type</th>
                    <th className="py-2.5 px-3 text-center">Qty Changed</th>
                    <th className="py-2.5 px-3 text-center">Stock Snapshot</th>
                    <th className="py-2.5 px-3">Reference / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredMovements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {m.date}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{m.productName}</div>
                        <div className="font-mono text-[11px] text-cyan-400">{m.sku}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            m.type === 'IN'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : m.type === 'OUT'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          }`}
                        >
                          {m.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-xs">
                        <span
                          className={
                            m.type === 'IN'
                              ? 'text-emerald-400'
                              : m.type === 'OUT'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }
                        >
                          {m.type === 'IN' ? `+${m.quantity}` : `-${m.quantity}`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-400">
                        {m.previousStock} → <span className="text-white font-bold">{m.newStock}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {m.referenceId && (
                          <span className="font-mono text-cyan-300 font-semibold mr-2">
                            [{m.referenceId}]
                          </span>
                        )}
                        <span className="text-slate-400 text-[11px]">{m.notes}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: FAST / SLOW MOVING INVENTORY ANALYSIS */}
      {activeSubTab === 'PERFORMANCE' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5">
            <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Inventory Turnover &amp; Component Velocity</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Velocity breakdown based on completed sales invoices and inventory holdings.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                    <th className="py-2.5 px-3">Component / SKU</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">In Stock</th>
                    <th className="py-2.5 px-3 text-center">Units Sold</th>
                    <th className="py-2.5 px-3 text-right">Revenue Sold</th>
                    <th className="py-2.5 px-3 text-center">Movement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products
                    .slice()
                    .sort((a, b) => (productSalesRev[b.id] || 0) - (productSalesRev[a.id] || 0))
                    .map((p) => {
                      const soldQty = productSalesQty[p.id] || 0;
                      const soldRev = productSalesRev[p.id] || 0;
                      const isFast = soldQty >= 2;

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/30">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{p.name}</div>
                            <div className="font-mono text-[11px] text-cyan-400">{p.sku}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-300">{p.category}</td>
                          <td className="py-3 px-3 text-center font-mono text-white">
                            {p.stockQuantity} {p.unit}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-white">
                            {soldQty}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                            {formatCurrency(soldRev)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {isFast ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Fast Moving
                              </span>
                            ) : soldQty > 0 ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                Moderate
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                Slow / In Reserve
                              </span>
                            )}
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
