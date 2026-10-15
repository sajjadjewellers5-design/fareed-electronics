import React, { useState } from 'react';
import {
  LayoutDashboard,
  Boxes,
  FileSpreadsheet,
  Receipt,
  Truck,
  Landmark,
  Users2,
  TrendingUp,
  Settings,
  AlertTriangle,
  FileCheck,
  UserCog,
  Database,
  Lock,
  Trash2,
  Users,
  Calendar,
  Scale,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  Wallet,
  ExternalLink,
  CornerDownLeft,
  Tag,
  Sliders,
  Sparkles,
  Bot,
  Mic,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    products,
    customers,
    invoices,
    purchaseInvoices,
    employees,
    bankAccounts,
    bankTransactions,
    formatCurrency,
    currentUser,
    logout,
    language,
    setIsClearDemoDataModalOpen,
    setIsAccountInfoModalOpen,
    setIsTagPrintingModalOpen,
    setIsStockAdjustmentModalOpen,
    setIsAIGuideModalOpen,
    openCopilotVoice,
    triggerStartupSplash,
    t,
  } = useApp();

  const [isAccountInfoExpanded, setIsAccountInfoExpanded] = useState(true);

  // 14 Core Accounting Heads requested by user
  const cashInHand = bankAccounts
    .filter((b) => b.type === 'CASH')
    .reduce((sum, b) => sum + b.currentBalance, 0);

  const bankBalances = bankAccounts
    .filter((b) => b.type !== 'CASH')
    .reduce((sum, b) => sum + b.currentBalance, 0);

  const accountsReceivable = invoices.reduce((sum, inv) => sum + inv.dueBalance, 0);
  const stockInHand = products.reduce((sum, p) => sum + p.costPrice * p.stockQuantity, 0);
  const employeeReceivable = employees.reduce((sum, emp) => sum + (emp.advanceBalance || 0), 0);
  const currentAssets = cashInHand + bankBalances + accountsReceivable + stockInHand + employeeReceivable;
  const fixedAssets = 485000;
  const accountsPayable = purchaseInvoices.reduce((sum, p) => sum + p.dueBalance, 0);
  const totalLiabilities = accountsPayable;
  const totalAssets = currentAssets + fixedAssets;
  const capitalEquity = Math.max(0, totalAssets - totalLiabilities);
  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const salesReturn = 0;
  const otherIncome = bankTransactions
    .filter((t) => t.category === 'Service Charges' || t.category === 'Lab Diagnosis')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPurchases = purchaseInvoices.reduce((sum, p) => sum + p.grandTotal, 0);
  const totalExpenses = bankTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const sideAccountItems = [
    { label: 'Cash in Hand (کیش بیک)', val: cashInHand, color: 'text-emerald-400', tab: 'banking' },
    { label: 'A/C Receivable (وصول طلب)', val: accountsReceivable, color: 'text-rose-400', tab: 'customer-invoices' },
    { label: 'Stock in Hand (اسٹاک)', val: stockInHand, color: 'text-blue-400', tab: 'stock' },
    { label: 'Current Assets (موجودہ اثاثے)', val: currentAssets, color: 'text-teal-300 font-bold', tab: 'chart-of-accounts' },
    { label: 'Fix Assets (مستقل اثاثے)', val: fixedAssets, color: 'text-indigo-400', tab: 'chart-of-accounts' },
    { label: 'Employee Receivable (ملازمین)', val: employeeReceivable, color: 'text-purple-400', tab: 'employees' },
    { label: 'A/C Payable (واجب الادا)', val: accountsPayable, color: 'text-amber-400', tab: 'purchase-invoices' },
    { label: 'Liabilities (کل واجبات)', val: totalLiabilities, color: 'text-amber-300 font-bold', tab: 'purchase-invoices' },
    { label: 'Capital (سرمایہ / ایکویٹی)', val: capitalEquity, color: 'text-cyan-300 font-bold', tab: 'chart-of-accounts' },
    { label: 'Sales (سیلز ریونیو)', val: totalSales, color: 'text-emerald-300', tab: 'customer-invoices' },
    { label: 'Sales Return (سیلز واپسی)', val: salesReturn, color: 'text-slate-400', tab: 'customer-invoices' },
    { label: 'Other Income (دیگر آمدنی)', val: otherIncome, color: 'text-teal-300', tab: 'banking' },
    { label: 'Purchase (خریداری مال)', val: totalPurchases, color: 'text-amber-300', tab: 'purchase-invoices' },
    { label: 'Expense (کاروباری اخراجات)', val: totalExpenses, color: 'text-rose-300', tab: 'banking' },
  ];

  // Calculate quick badges
  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStockLevel).length;
  const unpaidSalesCount = invoices.filter((i) => i.paymentStatus !== 'PAID').length;
  const unpaidPurchasesCount = purchaseInvoices.filter((p) => p.paymentStatus !== 'PAID').length;

  // MENU 1 (Explicit User Requirement): Day Book, Customer Invoice (Sales & Returns), Purchase Invoice
  const menu1Items = [
    {
      id: 'day-book',
      label: language === 'ur' ? 'روزنامچہ (Day Book)' : 'Day Book (روزنامچہ)',
      icon: Calendar,
      badge: 'Daily',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      color: 'text-cyan-300',
    },
    {
      id: 'customer-invoices',
      label: language === 'ur' ? 'کسٹمر انوائسز و واپسی' : 'Customer Sales & Returns',
      icon: Receipt,
      badge: unpaidSalesCount > 0 ? `${unpaidSalesCount} Due` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      color: 'text-emerald-400',
    },
    {
      id: 'customers',
      label: language === 'ur' ? 'گاہکوں کی فہرست (Customer List)' : 'Customer List & Khata',
      icon: Users,
      badge: `${customers.length} Cust`,
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      color: 'text-cyan-400',
    },
    {
      id: 'purchase-invoices',
      label: t('purchaseInvoices'),
      icon: Truck,
      badge: unpaidPurchasesCount > 0 ? `${unpaidPurchasesCount} Due` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      color: 'text-amber-400',
    },
  ];

  // MENU 2 (Explicit User Requirement): Banking, Stock Management, Price List, Staff & Salary
  const menu2Items = [
    {
      id: 'banking',
      label: t('banking'),
      icon: Landmark,
      badge: 'Photo slips',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      color: 'text-cyan-400',
    },
    {
      id: 'stock',
      label: t('stockManagement'),
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      color: 'text-blue-400',
    },
    {
      id: 'price-list',
      label: language === 'ur' ? 'پرائس لسٹ (+/-)' : 'Price List & +/- Adjust',
      icon: DollarSign,
      badge: 'Bulk +/-',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      color: 'text-purple-400',
    },
    {
      id: 'employees',
      label: language === 'ur' ? 'اسٹاف اور تنخواہیں' : 'Staff & Salary Slips',
      icon: Users,
      badge: `${employees.length} Staff`,
      badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
      color: 'text-teal-400',
    },
  ];

  // Additional ERP modules & ledgers
  const otherItems = [
    {
      id: 'ai-voice-copilot',
      label: language === 'ur' ? 'صوتی رابطہ (Live Voice Call)' : 'Copilot Voice Call (Live)',
      icon: Mic,
      badge: 'Live Audio',
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse',
      color: 'text-rose-400',
      onClick: () => openCopilotVoice(),
    },
    {
      id: 'ai-guide',
      label: language === 'ur' ? 'اے آئی گائیڈ و مینوئل' : 'AI Copilot & Manual Guide',
      icon: Bot,
      badge: '24/7 AI',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      color: 'text-purple-400',
      onClick: () => setIsAIGuideModalOpen(true),
    },
    {
      id: 'tag-printing',
      label: language === 'ur' ? 'ٹیگ پرنٹنگ سسٹم' : 'All-Size Tag Printing',
      icon: Tag,
      badge: 'All Sizes',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      color: 'text-indigo-400',
      onClick: () => setIsTagPrintingModalOpen(true),
    },
    {
      id: 'stock-adjustment',
      label: language === 'ur' ? 'اسٹاک ایڈجسٹمنٹ' : 'Stock Adjustment (SAV)',
      icon: Sliders,
      badge: 'SAV',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      color: 'text-amber-400',
      onClick: () => setIsStockAdjustmentModalOpen(true),
    },
    {
      id: 'logo-animation',
      label: language === 'ur' ? '10s لوگو اینیمیشن' : '10s Logo Intro (GIF)',
      icon: Sparkles,
      badge: '10s Intro',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      color: 'text-cyan-400',
      onClick: () => triggerStartupSplash(),
    },
    {
      id: 'vouchers',
      label: t('vouchers'),
      icon: FileCheck,
      badge: 'RV & PV',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      color: 'text-emerald-400',
    },
    {
      id: 'parties',
      label: language === 'ur' ? 'کسٹمر و سپلائر لیجر' : 'Customer & Vendor Ledgers',
      icon: Users2,
      badge: 'Ledgers',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      color: 'text-purple-400',
    },
    {
      id: 'chart-of-accounts',
      label: language === 'ur' ? 'چارٹ آف اکاؤنٹس' : 'Chart of Accounts',
      icon: Scale,
      badge: '14 Heads',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      color: 'text-emerald-400',
    },
    {
      id: 'financial-reports',
      label: t('financialReports'),
      icon: TrendingUp,
      badge: 'P&L',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      color: 'text-teal-400',
    },
    {
      id: 'users',
      label: t('users'),
      icon: UserCog,
      badge: 'Admin Only',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      color: 'text-cyan-400',
    },
    {
      id: 'backup',
      label: t('backup'),
      icon: Database,
      badge: '30m',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      color: 'text-amber-400',
    },
  ];

  const renderNavButton = (item: {
    id: string;
    label: string;
    icon: any;
    badge: string | null;
    badgeColor?: string;
    color: string;
    onClick?: () => void;
  }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => {
          if (item.onClick) {
            item.onClick();
          } else {
            setActiveTab(item.id);
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
          isActive
            ? 'bg-gradient-to-r from-cyan-950/70 to-slate-800 text-white font-semibold border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              isActive ? item.color : 'text-slate-400 group-hover:text-slate-300'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </div>

        {item.badge && (
          <span
            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md border shrink-0 ${
              item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="no-print w-64 bg-slate-900/80 border-r border-slate-800/80 flex flex-col shrink-0">
      <div className="p-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 pt-4 flex items-center justify-between">
        <span>Tech Store &amp; Lab ERP</span>
        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-cyan-400 border border-slate-700">
          Esc: Back
        </span>
      </div>

      <nav className="flex-1 px-2.5 space-y-3 overflow-y-auto py-2">
        {/* Main Dashboard Link */}
        <div>
          {renderNavButton({
            id: 'dashboard',
            label: t('dashboard'),
            icon: LayoutDashboard,
            badge: null,
            color: 'text-cyan-400',
          })}
        </div>

        {/* 1ST MENU GROUP (User Prompt: Day Book, Customer Invoice, Purchase Invoice in 1st Menu) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 pt-1 pb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>1st Menu: Billing &amp; Trade</span>
            </span>
            <span className="text-[9px] text-cyan-400/80 font-mono">مینو 1</span>
          </div>
          <div className="bg-slate-950/40 p-1 rounded-2xl border border-slate-800/60 space-y-0.5">
            {menu1Items.map((item) => renderNavButton(item))}
          </div>
        </div>

        {/* 2ND MENU GROUP (User Prompt: Banking, Stock Management, Price List, Staff & Salary in 2nd Menu) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 pt-1 pb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>2nd Menu: Operations &amp; HR</span>
            </span>
            <span className="text-[9px] text-emerald-400/80 font-mono">مینو 2</span>
          </div>
          <div className="bg-slate-950/40 p-1 rounded-2xl border border-slate-800/60 space-y-0.5">
            {menu2Items.map((item) => renderNavButton(item))}
          </div>
        </div>

        {/* ADDITIONAL FEATURES & LEDGERS */}
        <div className="space-y-1">
          <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Reports &amp; Tools (دیگر کھاتے)
          </div>
          <div className="space-y-0.5">
            {otherItems.map((item) => renderNavButton(item))}
          </div>
        </div>

        {/* Esc Key Guide for user */}
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono font-bold border border-slate-700">
            Esc
          </kbd>
          <span>Press to return to Dashboard from any menu</span>
        </div>

        {/* Dedicated Account Information Section inside Sidebar (اکاؤنٹ معلومات) */}
        <div className="pt-2 mt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between px-2 py-1.5">
            <button
              onClick={() => setIsAccountInfoExpanded(!isAccountInfoExpanded)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'ur' ? 'اکاؤنٹ بیلنسز (14 کھاتے)' : 'Account Balances (14 Heads)'}</span>
              {isAccountInfoExpanded ? (
                <ChevronUp className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              )}
            </button>
            <button
              onClick={() => setIsAccountInfoModalOpen(true)}
              className="text-[10px] text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Open full Account Info modal"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {isAccountInfoExpanded && (
            <div className="mt-1 space-y-1 bg-slate-950/70 border border-slate-800/70 rounded-xl p-2 text-[10px]">
              {sideAccountItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab(item.tab)}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-900 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-400 group-hover:text-slate-200 truncate pr-1">
                    {item.label}
                  </span>
                  <span className={`font-mono font-semibold shrink-0 ${item.color}`}>
                    {formatCurrency(item.val)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Low stock warning footer bar if any */}
      {lowStockCount > 0 && (
        <div className="p-3 m-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-200">Reorder Alert</div>
            <div className="text-[11px] text-amber-400/80">
              {lowStockCount} components are below threshold.
            </div>
            <button
              onClick={() => setActiveTab('stock-reports')}
              className="mt-1 text-[11px] text-cyan-400 hover:underline font-medium block"
            >
              View Reorder List →
            </button>
          </div>
        </div>
      )}

      {/* Active User session pill & quick lock button */}
      {currentUser && (
        <div className="p-2.5 mx-2.5 mb-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-[11px] font-bold uppercase shrink-0">
              {currentUser.fullName.slice(0, 2)}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-200 truncate leading-tight">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">
                {currentUser.role}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Lock ERP & Sign Out"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Clear Demo Data Button */}
      <div className="px-2.5 pb-2">
        <button
          onClick={() => setIsClearDemoDataModalOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'ur' ? 'تمام ڈیمو ڈیٹا صاف کریں' : 'Clear All Demo Data'}</span>
        </button>
      </div>

      {/* Version badge */}
      <div className="p-3 border-t border-slate-800/60 text-slate-400 text-[11px] flex items-center justify-between px-4">
        <span>Fareed Tech OS</span>
        <span className="font-mono text-cyan-400">v2.5.0</span>
      </div>
    </aside>
  );
};
