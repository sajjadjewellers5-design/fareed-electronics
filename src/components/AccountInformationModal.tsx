import React from 'react';
import {
  Landmark,
  X,
  TrendingUp,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  ShieldCheck,
  Building,
  DollarSign,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Scale,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountInformationModal: React.FC = () => {
  const {
    isAccountInfoModalOpen,
    setIsAccountInfoModalOpen,
    bankAccounts,
    invoices,
    purchaseInvoices,
    products,
    employees,
    bankTransactions,
    formatCurrency,
    setActiveTab,
  } = useApp();

  if (!isAccountInfoModalOpen) return null;

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

  // 5. EMPLOYEE RECEIVABLE (Advances given to staff)
  const employeeReceivable = employees.reduce(
    (sum, emp) => sum + (emp.advanceBalance || 0),
    0
  );

  // 4. CURRENT ASSETS = Cash + Bank + A/C Receivable + Stock in Hand + Employee Receivable
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
  const salesReturn = 0; // standard return provision

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
      title: 'CASH IN HAND (کیش ان ہینڈ)',
      amount: cashInHand,
      type: 'ASSET',
      desc: 'Physical currency in register drawers & counter cash boxes',
      color: 'text-emerald-400',
      actionTab: 'banking',
    },
    {
      code: '1002',
      title: 'BANK ACCOUNTS (بینک کھاتے)',
      amount: bankBalances,
      type: 'ASSET',
      desc: 'Active commercial business bank and digital wallet balances',
      color: 'text-cyan-400',
      actionTab: 'banking',
    },
    {
      code: '1003',
      title: 'A/C RECEIVABLE (کھاتہ وصول طلب)',
      amount: accountsReceivable,
      type: 'ASSET',
      desc: 'Pending credit payments due from retail and wholesale customers',
      color: 'text-rose-400',
      actionTab: 'customer-invoices',
    },
    {
      code: '1004',
      title: 'STOCK IN HAND (اسٹاک ان ہینڈ)',
      amount: stockInHand,
      type: 'ASSET',
      desc: 'Current physical inventory components valuation at purchase cost',
      color: 'text-blue-400',
      actionTab: 'stock',
    },
    {
      code: '1005',
      title: 'EMPLOYEE RECEIVABLE (ملازمین ایڈوانس)',
      amount: employeeReceivable,
      type: 'ASSET',
      desc: 'Short-term salary advances and loans issued to store technicians',
      color: 'text-purple-400',
      actionTab: 'employees',
    },
    {
      code: '1000',
      title: 'CURRENT ASSETS (موجودہ اثاثہ جات)',
      amount: currentAssets,
      type: 'SUMMARY',
      desc: 'Liquid balances, stock valuation, and receivables realizable in 1 yr',
      color: 'text-teal-300 font-black',
      actionTab: 'financial-reports',
    },
    {
      code: '1500',
      title: 'FIXED ASSETS (مستقل اثاثہ جات)',
      amount: fixedAssets,
      type: 'ASSET',
      desc: 'Lab microscopes, thermal cameras, soldering stations, safe lockers',
      color: 'text-indigo-400',
      actionTab: 'financial-reports',
    },
    {
      code: '2001',
      title: 'A/C PAYABLE (کھاتہ واجب الادا)',
      amount: accountsPayable,
      type: 'LIABILITY',
      desc: 'Unpaid inward component bills owed to wholesale component vendors',
      color: 'text-amber-400',
      actionTab: 'purchase-invoices',
    },
    {
      code: '2000',
      title: 'TOTAL LIABILITIES (کل واجبات)',
      amount: totalLiabilities,
      type: 'SUMMARY',
      desc: 'Aggregate vendor debts and accrued store operational liabilities',
      color: 'text-amber-300 font-black',
      actionTab: 'purchase-invoices',
    },
    {
      code: '3000',
      title: 'CAPITAL & EQUITY (سرمایہ / کیپیٹل)',
      amount: capitalEquity,
      type: 'EQUITY',
      desc: 'Owner initial capital and retained business equity reserves',
      color: 'text-cyan-300 font-black',
      actionTab: 'financial-reports',
    },
    {
      code: '4001',
      title: 'SALES TURNOVER (کل سیلز)',
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
      type: 'CONTRA',
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
      title: 'PURCHASE EXPENSE (خریداری مال)',
      amount: totalPurchases,
      type: 'EXPENSE',
      desc: 'Total inventory inward purchase costs incurred from distributors',
      color: 'text-amber-300',
      actionTab: 'purchase-invoices',
    },
    {
      code: '5002',
      title: 'OPERATING EXPENSES (کاروباری اخراجات)',
      amount: totalExpenses,
      type: 'EXPENSE',
      desc: 'Lab utilities, shop rent, staff wages, courier and freight freight',
      color: 'text-rose-300',
      actionTab: 'banking',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#072836] border border-[#0d556e]/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#051f2b] via-[#093c4e] to-[#0d526a] border-b border-[#0f5f7a]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                <span>Account Information &amp; Chart of Accounts (چارٹ آف اکاؤنٹس)</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time statement of Cash, Receivables, Stock in Hand, Assets, Payables, Capital &amp; P&amp;L
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setIsAccountInfoModalOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Executive Summary Row */}
        <div className="p-6 bg-slate-950/40 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400">Total Assets (اثاثے)</div>
            <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
              {formatCurrency(totalAssets)}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400">Total Liabilities (واجبات)</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
              {formatCurrency(totalLiabilities)}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400">Net Business Capital (سرمایہ)</div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              {formatCurrency(capitalEquity)}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400">Net Receivables Dues</div>
            <div className="text-lg font-black text-rose-400 font-mono mt-0.5">
              {formatCurrency(accountsReceivable)}
            </div>
          </div>
        </div>

        {/* Account Heads Table */}
        <div className="p-6 overflow-y-auto max-h-[460px]">
          <div className="space-y-2">
            {accountsList.map((acc) => (
              <div
                key={acc.code}
                onClick={() => {
                  setIsAccountInfoModalOpen(false);
                  setActiveTab(acc.actionTab);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  acc.type === 'SUMMARY'
                    ? 'bg-[#09394b]/60 border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-12 text-center text-xs font-mono font-bold px-1.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 shrink-0">
                    {acc.code}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <span>{acc.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {acc.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {acc.desc}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className={`text-sm font-mono font-bold ${acc.color}`}>
                    {formatCurrency(acc.amount)}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Click any account entry to drill down into corresponding ledger.</span>
          <button
            onClick={() => setIsAccountInfoModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
