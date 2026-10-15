import React, { useState } from 'react';
import {
  TrendingUp,
  Receipt,
  Truck,
  DollarSign,
  Printer,
  Download,
  PieChart,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Sparkles,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FinancialReports: React.FC = () => {
  const {
    invoices,
    purchaseInvoices,
    bankTransactions,
    products,
    customers,
    suppliers,
    formatCurrency,
    companyProfile,
    loadSampleData,
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<
    'PNL' | 'SALES' | 'PURCHASES' | 'KHATA' | 'EXPENSES'
  >('PNL');
  const [searchQuery, setSearchQuery] = useState('');

  // Revenue & COGS calculation
  const totalSalesRevenue = invoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalSalesPaid = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalReceivables = invoices.reduce((acc, i) => acc + i.dueBalance, 0);

  const totalPurchasesCost = purchaseInvoices.reduce((acc, p) => acc + p.grandTotal, 0);
  const totalPurchasesPaid = purchaseInvoices.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalPayables = purchaseInvoices.reduce((acc, p) => acc + p.dueBalance, 0);

  const totalCogs = invoices.reduce((acc, inv) => {
    return (
      acc +
      inv.items.reduce((sum, item) => sum + (item.costPrice || 0) * item.quantity, 0)
    );
  }, 0);

  const grossProfit = totalSalesRevenue - totalCogs;
  const grossMargin = totalSalesRevenue > 0 ? ((grossProfit / totalSalesRevenue) * 100).toFixed(1) : '0';

  // Operating Expenses from bank transactions
  const expenseTransactions = bankTransactions.filter(
    (tx) => tx.type === 'EXPENSE'
  );
  const totalOperatingExpenses = expenseTransactions.reduce((acc, tx) => acc + tx.amount, 0);

  const netProfit = grossProfit - totalOperatingExpenses;
  const netMargin = totalSalesRevenue > 0 ? ((netProfit / totalSalesRevenue) * 100).toFixed(1) : '0';

  // Expenses by category
  const expensesByCategory = expenseTransactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);

  // Sales by payment method
  const salesByPaymentMethod = invoices.reduce((acc, inv) => {
    acc[inv.paymentMethod] = (acc[inv.paymentMethod] || 0) + inv.grandTotal;
    return acc;
  }, {} as Record<string, number>);

  // Top products by revenue
  const productSalesMap: Record<string, { name: string; sku: string; qty: number; revenue: number }> = {};
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.productName,
          sku: item.sku,
          qty: 0,
          revenue: 0,
        };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].revenue += item.total;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);

  // Export CSV
  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Fareed Electronics - Financial Summary\n\n';
    csvContent += `Total Sales Turnover,${totalSalesRevenue}\n`;
    csvContent += `Cost of Goods Sold (COGS),${totalCogs}\n`;
    csvContent += `Gross Profit,${grossProfit} (${grossMargin}%)\n`;
    csvContent += `Operating Expenses,${totalOperatingExpenses}\n`;
    csvContent += `Net Profit,${netProfit} (${netMargin}%)\n\n`;
    csvContent += 'Expenses Breakdown\nCategory,Amount\n';
    Object.entries(expensesByCategory).forEach(([cat, val]) => {
      csvContent += `"${cat}",${val}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fareed_financial_report_${new Date().toISOString().split('T')[0]}.csv`);
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
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <span>Financial &amp; Business Accounting Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Profit &amp; Loss statements, revenue margins, sales analytics, and expenditure breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {invoices.length === 0 && (
            <button
              onClick={loadSampleData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Sample Financial Data</span>
            </button>
          )}

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="no-print flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit flex-wrap">
        <button
          onClick={() => setActiveReportTab('PNL')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'PNL'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Profit &amp; Loss Statement
        </button>

        <button
          onClick={() => setActiveReportTab('SALES')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'SALES'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sales &amp; Revenue ({invoices.length})
        </button>

        <button
          onClick={() => setActiveReportTab('PURCHASES')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'PURCHASES'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Purchases &amp; Cost ({purchaseInvoices.length})
        </button>

        <button
          onClick={() => setActiveReportTab('KHATA')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'KHATA'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Receivables &amp; Payables Khata
        </button>

        <button
          onClick={() => setActiveReportTab('EXPENSES')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeReportTab === 'EXPENSES'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Operating Expenses ({expenseTransactions.length})
        </button>
      </div>

      {/* TAB 1: PROFIT & LOSS STATEMENT */}
      {activeReportTab === 'PNL' && (
        <div className="space-y-5">
          {/* Top High-level KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Total Sales Turnover</span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {formatCurrency(totalSalesRevenue)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">From {invoices.length} customer billings</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Cost of Goods Sold (COGS)</span>
              <div className="text-2xl font-black text-slate-300 font-mono mt-1">
                {formatCurrency(totalCogs)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Direct inventory cost of goods</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Gross Trading Profit</span>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                {formatCurrency(grossProfit)}
              </div>
              <div className="text-[11px] text-cyan-400/80 font-mono mt-1">
                {grossMargin}% Gross Margin
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Net Operating Profit</span>
              <div
                className={`text-2xl font-black font-mono mt-1 ${
                  netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(netProfit)}
              </div>
              <div className="text-[11px] text-emerald-400/80 font-mono mt-1">
                {netMargin}% Net Margin after all expenses
              </div>
            </div>
          </div>

          {/* Formal P&L Statement Sheet */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="border-b border-slate-800 pb-4 mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Statement of Profit or Loss (Income Statement)
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  {companyProfile.name} · {companyProfile.subtitle}
                </div>
              </div>
              <div className="text-xs font-mono text-cyan-400">
                FY {new Date().getFullYear()}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Revenue Section */}
              <div className="space-y-2">
                <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] bg-slate-950 p-2.5 rounded-lg flex items-center justify-between">
                  <span>1. Operating Revenue</span>
                  <span className="font-mono text-white">{formatCurrency(totalSalesRevenue)}</span>
                </div>
                <div className="flex justify-between px-3 text-slate-300">
                  <span>Gross Sales Invoiced to Customers</span>
                  <span className="font-mono text-white font-semibold">
                    {formatCurrency(totalSalesRevenue)}
                  </span>
                </div>
                <div className="flex justify-between px-3 text-slate-400">
                  <span>Less: Cost of Goods Sold (Inventory Component Cost)</span>
                  <span className="font-mono text-rose-400">
                    -{formatCurrency(totalCogs)}
                  </span>
                </div>
                <div className="flex justify-between px-3 py-2 bg-slate-800/40 rounded-lg font-bold text-cyan-400 border border-slate-700/50">
                  <span>GROSS PROFIT</span>
                  <span className="font-mono">{formatCurrency(grossProfit)}</span>
                </div>
              </div>

              {/* Operating Expenses Section */}
              <div className="space-y-2 pt-2">
                <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] bg-slate-950 p-2.5 rounded-lg flex items-center justify-between">
                  <span>2. Operating &amp; Lab Expenses</span>
                  <span className="font-mono text-rose-400">
                    -{formatCurrency(totalOperatingExpenses)}
                  </span>
                </div>
                {Object.keys(expensesByCategory).length === 0 ? (
                  <div className="px-3 text-slate-500 italic">No operating expenses logged.</div>
                ) : (
                  Object.entries(expensesByCategory).map(([cat, amt]) => (
                    <div key={cat} className="flex justify-between px-3 text-slate-400">
                      <span>{cat}</span>
                      <span className="font-mono text-slate-300">{formatCurrency(amt)}</span>
                    </div>
                  ))
                )}
                <div className="flex justify-between px-3 py-2 bg-slate-800/40 rounded-lg font-bold text-rose-300 border border-slate-700/50">
                  <span>TOTAL OPERATING EXPENDITURES</span>
                  <span className="font-mono">-{formatCurrency(totalOperatingExpenses)}</span>
                </div>
              </div>

              {/* Net Profit Summary */}
              <div className="pt-4 border-t-2 border-slate-800">
                <div className="flex justify-between px-4 py-3 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-xl font-black text-sm">
                  <span className="text-white">NET OPERATING PROFIT / SURPLUS</span>
                  <span
                    className={`font-mono text-base ${
                      netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrency(netProfit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SALES & REVENUE REPORT */}
      {activeReportTab === 'SALES' && (
        <div className="space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Total Invoiced Sales</span>
              <div className="text-xl font-black text-white font-mono mt-1">
                {formatCurrency(totalSalesRevenue)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{invoices.length} Total Invoices</div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Total Cash &amp; Bank Collected</span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                {formatCurrency(totalSalesPaid)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {totalSalesRevenue > 0
                  ? `${((totalSalesPaid / totalSalesRevenue) * 100).toFixed(0)}% collection rate`
                  : '0%'}
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Pending Receivables</span>
              <div className="text-xl font-black text-rose-400 font-mono mt-1">
                {formatCurrency(totalReceivables)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Customer balance due</div>
            </div>
          </div>

          {/* Sales Invoices Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>All Sales Invoices Ledger ({invoices.length} Bills)</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3 text-center">Items</th>
                    <th className="py-2.5 px-3 text-right">Grand Total</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3 text-right">Due</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">{inv.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{inv.customerName}</td>
                      <td className="py-2.5 px-3 text-center text-slate-300">{inv.items.length}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                        {formatCurrency(inv.grandTotal)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-semibold">
                        {formatCurrency(inv.paidAmount)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-400 font-bold">
                        {inv.dueBalance > 0 ? formatCurrency(inv.dueBalance) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            inv.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : inv.paymentStatus === 'PARTIAL'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-3">
              Top Selling Products by Revenue
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3 text-center">Units Sold</th>
                    <th className="py-2.5 px-3 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {topProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-semibold text-white">
                        <span className="font-mono text-cyan-400 mr-2">#{idx + 1}</span>
                        {p.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{p.sku}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-white">
                        {p.qty}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                        {formatCurrency(p.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PURCHASES & VENDOR REPORT */}
      {activeReportTab === 'PURCHASES' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Total Purchase Cost</span>
              <div className="text-xl font-black text-amber-400 font-mono mt-1">
                {formatCurrency(totalPurchasesCost)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                From {purchaseInvoices.length} vendor inward bills
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Total Paid to Vendors</span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                {formatCurrency(totalPurchasesPaid)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Settled payments</div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Outstanding Payables</span>
              <div className="text-xl font-black text-rose-400 font-mono mt-1">
                {formatCurrency(totalPayables)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Due to suppliers</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 shadow-sm">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Inward Purchase Bills Ledger ({purchaseInvoices.length} Bills)</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                    <th className="py-2.5 px-3">Bill #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Supplier Name</th>
                    <th className="py-2.5 px-3">Vendor Ref</th>
                    <th className="py-2.5 px-3 text-right">Bill Total</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3 text-right">Payable</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {purchaseInvoices.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                        {bill.billNumber}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">{bill.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{bill.supplierName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{bill.supplierInvoiceNo}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                        {formatCurrency(bill.grandTotal)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-semibold">
                        {formatCurrency(bill.paidAmount)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-400 font-bold">
                        {bill.dueBalance > 0 ? formatCurrency(bill.dueBalance) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            bill.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : bill.paymentStatus === 'PARTIAL'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {bill.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RECEIVABLES & PAYABLES KHATA REPORT */}
      {activeReportTab === 'KHATA' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Customer Receivables */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4 text-rose-400" />
                  <span>Customer Receivables Aging</span>
                </h2>
                <span className="font-mono font-bold text-rose-400 text-xs">
                  Total: {formatCurrency(totalReceivables)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                      <th className="py-2 px-3">Customer</th>
                      <th className="py-2 px-3">Phone</th>
                      <th className="py-2 px-3 text-right">Balance Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-semibold text-white">{c.name}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{c.phone}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          {c.currentBalance > 0 ? (
                            <span className="text-rose-400">{formatCurrency(c.currentBalance)}</span>
                          ) : (
                            <span className="text-emerald-400">Nil</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supplier Payables */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  <span>Supplier Accounts Payable</span>
                </h2>
                <span className="font-mono font-bold text-amber-400 text-xs">
                  Total: {formatCurrency(totalPayables)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                      <th className="py-2 px-3">Supplier</th>
                      <th className="py-2 px-3">Phone</th>
                      <th className="py-2 px-3 text-right">Payable Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {suppliers.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-semibold text-white">{s.name}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{s.phone}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          {s.currentBalance > 0 ? (
                            <span className="text-amber-400">{formatCurrency(s.currentBalance)}</span>
                          ) : (
                            <span className="text-emerald-400">Settled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OPERATING EXPENSES */}
      {activeReportTab === 'EXPENSES' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-rose-400" />
                <span>Operating Expenses Ledger ({expenseTransactions.length} Vouchers)</span>
              </h2>
              <span className="font-mono font-bold text-rose-400 text-xs">
                Total Expenses: {formatCurrency(totalOperatingExpenses)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Account Paid From</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {expenseTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-mono text-slate-300">{tx.date}</td>
                      <td className="py-3 px-3 font-semibold text-rose-400">{tx.category}</td>
                      <td className="py-3 px-3 text-white">{tx.description}</td>
                      <td className="py-3 px-3 text-slate-400">{tx.accountName}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
