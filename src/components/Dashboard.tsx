import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Boxes,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  Receipt,
  Truck,
  PlusCircle,
  Clock,
  Eye,
  Camera,
  Layers,
  Scale,
  Calendar,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Settings,
  Database,
  Undo2,
  Sparkles,
  Download,
  Tag,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LogoWatermark } from './BrandLogo';

interface DashboardProps {
  onNewSale: () => void;
  onNewPurchase: () => void;
  onNewBanking: () => void;
  onNewProduct: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewSale,
  onNewPurchase,
  onNewBanking,
  onNewProduct,
}) => {
  const {
    companyProfile,
    products,
    invoices,
    purchaseInvoices,
    vouchers,
    bankAccounts,
    bankTransactions,
    formatCurrency,
    setActiveTab,
    setSelectedInvoiceForPrint,
    setPreviewImage,
    setIsReceivePaymentModalOpen,
    setIsPaymentVoucherModalOpen,
    setIsBiltyUpdateModalOpen,
    setIsAccountInfoModalOpen,
    setIsSaleReturnModalOpen,
    setIsTagPrintingModalOpen,
    setIsStockAdjustmentModalOpen,
    triggerStartupSplash,
    autoBackupSettings,
    setAutoBackupSettings,
    triggerManualAutoBackup,
    lastAutoBackupTime,
  } = useApp();

  // Live real-time Clock and Date
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isBackupSettingsOpen, setIsBackupSettingsOpen] = useState(false);
  const [backupIntervalInput, setBackupIntervalInput] = useState(autoBackupSettings.intervalMinutes || 30);
  const [autoDownloadInput, setAutoDownloadInput] = useState(autoBackupSettings.autoDownloadJson || false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+923099909869');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSaveBackupSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setAutoBackupSettings({
      intervalMinutes: Number(backupIntervalInput) || 30,
      autoDownloadJson: autoDownloadInput,
      enabled: true,
    });
    setIsBackupSettingsOpen(false);
  };

  // Financial aggregates
  const totalSalesRevenue = invoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalSalesPaid = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalReceivables = invoices.reduce((acc, inv) => acc + inv.dueBalance, 0);

  const totalPurchasesCost = purchaseInvoices.reduce((acc, pur) => acc + pur.grandTotal, 0);
  const totalPayables = purchaseInvoices.reduce((acc, pur) => acc + pur.dueBalance, 0);

  // Total Bank & Cash Balances
  const totalLiquidBalance = bankAccounts.reduce((acc, b) => acc + b.currentBalance, 0);

  // Inventory valuation
  const totalStockCostValue = products.reduce(
    (acc, p) => acc + p.costPrice * p.stockQuantity,
    0
  );
  const totalStockRetailValue = products.reduce(
    (acc, p) => acc + p.salePrice * p.stockQuantity,
    0
  );

  const lowStockItems = products.filter((p) => p.stockQuantity <= p.minStockLevel);

  // Estimated gross profit on delivered sales
  const estimatedCogs = invoices.reduce((acc, inv) => {
    const invCogs = inv.items.reduce((sum, item) => sum + (item.costPrice || 0) * item.quantity, 0);
    return acc + invCogs;
  }, 0);
  const estimatedGrossProfit = totalSalesRevenue - estimatedCogs;
  const grossMarginPercent =
    totalSalesRevenue > 0 ? ((estimatedGrossProfit / totalSalesRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-5 relative">
      {/* Background Logo Watermark (User Requirement) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07] overflow-hidden -z-0">
        <LogoWatermark
          customLogoUrl={companyProfile.logoUrl}
          className="scale-[2.4] text-cyan-400 rotate-[-12deg]"
        />
      </div>

      {/* 1. TOP SOFTWARE CONTACT BANNER (EXPLICIT USER REQUIREMENT) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 p-3.5 sm:p-4 text-white shadow-xl shadow-cyan-900/30 border border-cyan-400/40">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950/40 border border-white/20 flex items-center justify-center shrink-0 text-cyan-200">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-slate-950/60 border border-white/20 text-[10px] font-black uppercase tracking-widest text-cyan-200">
                  OFFICIAL DEVELOPER SUPPORT
                </span>
                <span className="text-xs text-white/90 font-medium">
                  نئے سافٹ ویئر، فیچرز اور کسٹمائزیشن کے لیے رابطہ کریں
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white mt-0.5">
                FOR NEW SOFTWARE CONTACT: <span className="font-mono text-amber-200 select-all">+92 309-9909869</span> / <span className="font-mono text-amber-200 select-all">0309-9909869</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={handleCopyPhone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-950/80 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
              title="Copy Phone Number"
            >
              {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-cyan-200" />}
              <span>{copiedPhone ? 'Copied!' : 'Copy No'}</span>
            </button>

            <a
              href="https://wa.me/923099909869?text=Hello%20Fareed%20Electronics%20Software%20Developer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp (0309-9909869)</span>
            </a>

            <a
              href="tel:+923099909869"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-black shadow-md transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-700" />
              <span>Call Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME LIVE TIME & DATE & 30-MIN AUTO BACKUP STATUS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
        {/* Live Date and Time */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              System Live Clock (لاہور / پاکستان وقت)
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-white">
                {currentDateTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-sm font-black text-cyan-400 tracking-wider">
                {currentDateTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* 30-Minute Auto Backup Status & Custom Save Option */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400">Auto Backup: </span>
              <span className="font-bold text-emerald-400">
                Every {autoBackupSettings.intervalMinutes || 30} Mins Active
              </span>
              <span className="text-slate-500 text-[10px] ml-1">
                (Last: {lastAutoBackupTime || 'Active'})
              </span>
            </div>
          </div>

          <button
            onClick={() => triggerManualAutoBackup(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-semibold cursor-pointer transition-all"
            title="Download Instant Backup JSON File"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save Backup Now</span>
          </button>

          <button
            onClick={() => setIsBackupSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-all"
            title="Customize 30-Minute Auto Backup Interval & Settings"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Customize Auto Save</span>
          </button>
        </div>
      </div>

      {/* 3. Welcome & Quick Action Shortcuts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Fareed Tech Store &amp; Lab Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time accounting, stock telemetry, customer billing, and banking with photo slip verification.
          </p>
        </div>

        {/* Shortcut Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bilty Update Quick Icon & Button (بلٹی اپڈیٹ آئیکون) */}
          <button
            onClick={() => setIsBiltyUpdateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 shadow transition-all cursor-pointer"
            title="Bilty Update Icon (بلٹی اپڈیٹ آئیکون)"
          >
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Update Bilty (بلٹی اپڈیٹ)</span>
          </button>

          {/* Account Information (Chart of Accounts) Button */}
          <button
            onClick={() => setIsAccountInfoModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 shadow transition-all cursor-pointer"
            title="Account Information & 14 Core Heads"
          >
            <Scale className="w-3.5 h-3.5 text-purple-400" />
            <span>Account Info (چارٹ آف اکاؤنٹس)</span>
          </button>

          {/* Sale Return Invoice Button */}
          <button
            onClick={() => setIsSaleReturnModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 shadow transition-all cursor-pointer"
            title="Create Sale Return Invoice (سیلز واپسی)"
          >
            <Undo2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Sale Return (سیلز واپسی)</span>
          </button>

          {/* Tag Printing Button */}
          <button
            onClick={() => setIsTagPrintingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 shadow transition-all cursor-pointer"
            title="All-Size Tag & Barcode Printing System"
          >
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print Tags (ٹیگ پرنٹ)</span>
          </button>

          {/* Stock Adjustment Voucher Button */}
          <button
            onClick={() => setIsStockAdjustmentModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 shadow transition-all cursor-pointer"
            title="Create Stock Adjustment Voucher (اسٹاک ایڈجسٹمنٹ واؤچر)"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Stock Adjustment (ایڈجسٹمنٹ)</span>
          </button>

          {/* 10s Logo Animation Replay Button */}
          <button
            onClick={() => triggerStartupSplash()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 shadow transition-all cursor-pointer"
            title="Replay 10-Second Startup Animated Logo GIF Sequence"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>10s Logo GIF (لوگو اینیمیشن)</span>
          </button>

          <button
            onClick={() => setIsReceivePaymentModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Receive Payment (F4)</span>
          </button>
          <button
            onClick={() => setIsPaymentVoucherModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Pay Voucher</span>
          </button>
          <button
            onClick={onNewSale}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer font-bold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Invoice (F2)</span>
          </button>
          <button
            onClick={() => setActiveTab('day-book')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Day Book (روزنامچہ)</span>
          </button>
        </div>
      </div>

      {/* Auto Backup Customization Modal */}
      {isBackupSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Customize Auto Save &amp; Backup (بیک اپ سیٹنگز)</span>
              </div>
              <button
                onClick={() => setIsBackupSettingsOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBackupSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Auto Backup Interval (منٹ بعد خودکار محفوظ کریں)
                </label>
                <select
                  value={backupIntervalInput}
                  onChange={(e) => setBackupIntervalInput(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={15}>Every 15 Minutes (ہر 15 منٹ)</option>
                  <option value={30}>Every 30 Minutes (Standard - ہر 30 منٹ)</option>
                  <option value={60}>Every 1 Hour (ہر 1 گھنٹہ)</option>
                  <option value={120}>Every 2 Hours (ہر 2 گھنٹے)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Currently active: Automatically creates internal snapshot every {autoBackupSettings.intervalMinutes} minutes.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">Auto Download JSON File</div>
                  <div className="text-[11px] text-slate-500">Automatically download a backup copy to computer</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoDownloadInput}
                  onChange={(e) => setAutoDownloadInput(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300">
                Last Auto Saved At: <span className="font-bold text-white font-mono">{lastAutoBackupTime || 'Just now'}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBackupSettingsOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white tracking-tight">
            {formatCurrency(totalSalesRevenue)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Gross Profit: {formatCurrency(estimatedGrossProfit)}</span>
            <span className="text-emerald-400 font-mono font-semibold">{grossMarginPercent}% margin</span>
          </div>
        </div>

        {/* Liquid Balances (Bank + Cash) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Bank &amp; Cash Balances</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-cyan-400 tracking-tight">
            {formatCurrency(totalLiquidBalance)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>{bankAccounts.length} Active Accounts</span>
            <button
              onClick={() => setActiveTab('banking')}
              className="text-cyan-400 hover:underline font-medium"
            >
              Banking Ledger →
            </button>
          </div>
        </div>

        {/* Stock Valuation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Stock Valuation</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white tracking-tight">
            {formatCurrency(totalStockCostValue)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Retail: {formatCurrency(totalStockRetailValue)}</span>
            <span className="text-blue-400 font-mono font-semibold">{products.length} SKUs</span>
          </div>
        </div>

        {/* Receivables & Payables */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Receivables / Due</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-400 tracking-tight">
            {formatCurrency(totalReceivables)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Payables to Suppliers:</span>
            <span className="text-amber-400 font-mono font-semibold">{formatCurrency(totalPayables)}</span>
          </div>
        </div>
      </div>

      {/* Low Stock Alert Banner if items need restocking */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-200">
                Low Inventory Alert: {lowStockItems.length} Lab Components Need Restocking
              </div>
              <div className="text-xs text-amber-300/80">
                Items such as{' '}
                <span className="font-semibold text-white">
                  {lowStockItems.slice(0, 2).map((i) => i.name).join(', ')}
                </span>{' '}
                are at or below critical minimum reorder quantity.
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('stock-reports')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow transition-colors shrink-0 cursor-pointer"
          >
            Review Reorder Report
          </button>
        </div>
      )}

      {/* Split View: Recent Sales Invoices & Recent Banking with Pic Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                Recent Customer Invoices
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('customer-invoices')}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              View All ({invoices.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[360px]">
            {invoices.slice(0, 5).map((inv) => (
              <div
                key={inv.id}
                className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-cyan-400">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        inv.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : inv.paymentStatus === 'PARTIAL'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 truncate mt-0.5">
                    {inv.customerName}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{inv.date}</span>
                    <span>·</span>
                    <span>{inv.items.length} item(s)</span>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <div>
                    <div className="text-xs font-black text-white font-mono">
                      {formatCurrency(inv.grandTotal)}
                    </div>
                    {inv.dueBalance > 0 && (
                      <div className="text-[10px] text-rose-400 font-mono">
                        Due: {formatCurrency(inv.dueBalance)}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedInvoiceForPrint(inv)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="View & Print Invoice"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banking & Own Pic Billing Activity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                Banking &amp; Photo Slip Activity
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('banking')}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              Manage Banking →
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[360px]">
            {bankTransactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {tx.description}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="text-cyan-400 font-medium">{tx.accountName}</span>
                    <span>·</span>
                    <span>{tx.date}</span>
                    {tx.referenceNo && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{tx.referenceNo}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2.5">
                  <div
                    className={`text-xs font-black font-mono ${
                      tx.type === 'DEPOSIT' || tx.type === 'CUSTOMER_PAYMENT'
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'DEPOSIT' || tx.type === 'CUSTOMER_PAYMENT' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </div>

                  {/* Photo Slip preview button if picture is attached */}
                  {tx.receiptPhoto ? (
                    <button
                      onClick={() => setPreviewImage(tx.receiptPhoto || null)}
                      className="p-1 text-cyan-400 hover:bg-cyan-500/20 rounded-md border border-cyan-500/30 transition-all cursor-pointer"
                      title="View attached billing slip"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="w-5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
