import React from 'react';
import {
  Scale,
  Printer,
  ChevronRight,
  TrendingUp,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Building,
  DollarSign,
  FileSpreadsheet,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountInformationPage: React.FC = () => {
  const {
    bankAccounts,
    invoices,
    purchaseInvoices,
    products,
    employees,
    bankTransactions,
    formatCurrency,
    setActiveTab,
    language,
    companyProfile,
  } = useApp();

  // 1. CASH IN HAND (Cash register balances)
  const cashInHand = bankAccounts
    .filter((b) => b.type === 'CASH')
    .reduce((sum, b) => sum + b.currentBalance, 0);

  // Commercial Bank Balances
  const bankBalances = bankAccounts
    .filter((b) => b.type !== 'CASH')
    .reduce((sum, b) => sum + b.currentBalance, 0);

  // 2. A/C RECEIVABLE (Customer dues)
  const accountsReceivable = invoices.reduce((sum, inv) => sum + inv.dueBalance, 0);

  // 3. STOCK IN HAND (Inventory valuation at cost)
  const stockInHand = products.reduce(
    (sum, p) => sum + p.costPrice * p.stockQuantity,
    0
  );

  // 4. EMPLOYEE RECEIVABLE (Advances given to staff)
  const employeeReceivable = employees.reduce(
    (sum, emp) => sum + (emp.advanceBalance || 0),
    0
  );

  // 5. CURRENT ASSETS = Cash + Bank + A/C Receivable + Stock in Hand + Employee Receivable
  const currentAssets =
    cashInHand + bankBalances + accountsReceivable + stockInHand + employeeReceivable;

  // 6. FIXED ASSETS (Lab oscilloscopes, micro-soldering stations, diagnostic fixtures, store fit-out)
  const fixedAssets = 485000;

  // Total Assets
  const totalAssets = currentAssets + fixedAssets;

  // 7. A/C PAYABLE (Supplier dues)
  const accountsPayable = purchaseInvoices.reduce((sum, p) => sum + p.dueBalance, 0);

  // 8. LIABILITIES = Accounts Payable + pending commitments
  const totalLiabilities = accountsPayable;

  // 9. CAPITAL (Owner's Equity)
  const capitalEquity = Math.max(0, totalAssets - totalLiabilities);

  // 10. SALES (Gross turnover)
  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

  // 11. SALES RETURN
  const salesReturn = 0;

  // 12. OTHER INCOME (Diagnostic service fees, lab micro-soldering labour)
  const otherIncome = bankTransactions
    .filter((t) => t.category === 'Service Charges' || t.category === 'Lab Diagnosis')
    .reduce((sum, t) => sum + t.amount, 0);

  // 13. PURCHASE (Total Purchases)
  const totalPurchases = purchaseInvoices.reduce((sum, p) => sum + p.grandTotal, 0);

  // 14. EXPENSES (Overheads, wages, electricity, rent)
  const totalExpenses = bankTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const accountsList = [
    {
      code: '1001',
      title: 'CASH IN HAND / CASH BACK (کیش ان ہینڈ)',
      amount: cashInHand,
      type: 'CURRENT ASSET',
      desc: 'Physical currency in register drawers, counter cash box & cash back float',
      color: 'text-emerald-400',
      actionTab: 'banking',
    },
    {
      code: '1002',
      title: 'BANK BALANCES (بینک کھاتے)',
      amount: bankBalances,
      type: 'CURRENT ASSET',
      desc: 'Active commercial business bank and digital wallet balances',
      color: 'text-cyan-400',
      actionTab: 'banking',
    },
    {
      code: '1003',
      title: 'A/C RECEIVABLE (کھاتہ وصول طلب)',
      amount: accountsReceivable,
      type: 'CURRENT ASSET',
      desc: 'Pending credit payments due from retail and wholesale customers',
      color: 'text-rose-400',
      actionTab: 'customer-invoices',
    },
    {
      code: '1004',
      title: 'STOCK IN HAND (اسٹاک ان ہینڈ)',
      amount: stockInHand,
      type: 'CURRENT ASSET',
      desc: 'Current physical inventory components valuation at purchase cost',
      color: 'text-blue-400',
      actionTab: 'stock',
    },
    {
      code: '1005',
      title: 'EMPLOYEE RECEIVABLE (ملازمین ایڈوانس)',
      amount: employeeReceivable,
      type: 'CURRENT ASSET',
      desc: 'Short-term salary advances and loans issued to store technicians',
      color: 'text-purple-400',
      actionTab: 'employees',
    },
    {
      code: '1000',
      title: 'CURRENT ASSETS (موجودہ اثاثہ جات)',
      amount: currentAssets,
      type: 'SUMMARY HEAD',
      desc: 'Liquid balances, stock valuation, and receivables realizable in 1 year',
      color: 'text-teal-300 font-black',
      actionTab: 'financial-reports',
    },
    {
      code: '1500',
      title: 'FIX ASSETS (مستقل اثاثہ جات)',
      amount: fixedAssets,
      type: 'FIXED ASSET',
      desc: 'Lab microscopes, thermal cameras, soldering stations, safe lockers',
      color: 'text-indigo-400',
      actionTab: 'financial-reports',
    },
    {
      code: '2001',
      title: 'A/C PAYABLE (کھاتہ واجب الادا)',
      amount: accountsPayable,
      type: 'CURRENT LIABILITY',
      desc: 'Unpaid inward component bills owed to wholesale component vendors',
      color: 'text-amber-400',
      actionTab: 'purchase-invoices',
    },
    {
      code: '2000',
      title: 'LIABILITIES (کل واجبات)',
      amount: totalLiabilities,
      type: 'SUMMARY HEAD',
      desc: 'Aggregate vendor debts and accrued store operational liabilities',
      color: 'text-amber-300 font-black',
      actionTab: 'purchase-invoices',
    },
    {
      code: '3000',
      title: 'CAPITAL (سرمایہ / کیپیٹل)',
      amount: capitalEquity,
      type: 'EQUITY',
      desc: 'Owner initial capital and retained business equity reserves',
      color: 'text-cyan-300 font-black',
      actionTab: 'financial-reports',
    },
    {
      code: '4001',
      title: 'SALES (سیلز ٹرن اوور)',
      amount: totalSales,
      type: 'REVENUE',
      desc: 'Gross revenue earned from sold mobile parts and lab services',
      color: 'text-emerald-300',
      actionTab: 'customer-invoices',
    },
    {
      code: '4002',
      title: 'SALES RETURN (سیلز واپسی)',
      amount: salesReturn,
      type: 'CONTRA REVENUE',
      desc: 'Refunded or returned parts due to testing mismatch',
      color: 'text-slate-400',
      actionTab: 'customer-invoices',
    },
    {
      code: '4003',
      title: 'OTHER INCOME (دیگر آمدنی)',
      amount: otherIncome,
      type: 'REVENUE',
      desc: 'Chip-level diagnosis test charges, scrap donor boards, service fees',
      color: 'text-teal-300',
      actionTab: 'banking',
    },
    {
      code: '5001',
      title: 'PURCHASE (خریداری مال)',
      amount: totalPurchases,
      type: 'COST OF GOODS',
      desc: 'Total inventory inward purchase costs incurred from distributors',
      color: 'text-amber-300',
      actionTab: 'purchase-invoices',
    },
    {
      code: '5002',
      title: 'EXPENSE (کاروباری اخراجات)',
      amount: totalExpenses,
      type: 'OPERATING EXPENSE',
      desc: 'Lab utilities, shop rent, staff wages, courier and freight freight',
      color: 'text-rose-300',
      actionTab: 'banking',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#072836] border border-[#0d556e]/80 p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>Account Information &amp; Chart of Accounts (چارٹ آف اکاؤنٹس)</span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              مکمل کھاتہ جاتی معلومات: کیش ان ہینڈ، وصول طلب، اسٹاک، اثاثہ جات، واجبات، کیپیٹل، سیلز اور اخراجات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Chart of Accounts (پرنٹ رپورٹ)</span>
          </button>
        </div>
      </div>

      {/* KPI 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#072836]/90 border border-[#0d556e]/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Total Assets (کل اثاثے)</div>
          <div className="text-xl font-black text-cyan-400 font-mono mt-1">
            {formatCurrency(totalAssets)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Current + Fix Assets
          </div>
        </div>

        <div className="bg-[#072836]/90 border border-[#0d556e]/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Total Liabilities (کل واجبات)</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">
            {formatCurrency(totalLiabilities)}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            Accounts Payable Dues
          </div>
        </div>

        <div className="bg-[#072836]/90 border border-[#0d556e]/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Capital &amp; Equity (سرمایہ)</div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1">
            {formatCurrency(capitalEquity)}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Net Business Worth
          </div>
        </div>

        <div className="bg-[#072836]/90 border border-[#0d556e]/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">A/C Receivable (وصول طلب)</div>
          <div className="text-xl font-black text-rose-400 font-mono mt-1">
            {formatCurrency(accountsReceivable)}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">
            Pending Customer Dues
          </div>
        </div>
      </div>

      {/* Account Heads Breakdown Table */}
      <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl p-4.5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-[#0d556e]/60">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Master Chart of Accounts (تمام کھاتہ جات کی تفصیل — 15 Heads)</span>
          </h2>
          <span className="text-xs text-slate-400">
            Click any account row to drill down into transactions
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {accountsList.map((acc) => (
            <div
              key={acc.code}
              onClick={() => setActiveTab(acc.actionTab)}
              className={`p-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 group my-1 ${
                acc.type.includes('SUMMARY')
                  ? 'bg-[#09394b]/70 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-14 text-center text-xs font-mono font-bold px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 shrink-0">
                  {acc.code}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                    <span>{acc.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {acc.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {acc.desc}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className={`text-base font-mono font-bold ${acc.color}`}>
                  {formatCurrency(acc.amount)}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
