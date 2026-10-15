import React, { useState } from 'react';
import {
  PlusCircle,
  Receipt,
  Truck,
  Landmark,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  LogOut,
  User,
  KeyRound,
  Database,
  ChevronDown,
  Lock,
  Search,
  FileCheck,
  Languages,
  Trash2,
  Check,
  Scale,
  Palette,
  Boxes,
  Clock,
  Mic,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onQuickSale: () => void;
  onQuickPurchase: () => void;
  onQuickBanking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onQuickSale,
  onQuickPurchase,
  onQuickBanking,
}) => {
  const {
    companyProfile,
    products,
    loadSampleData,
    currentUser,
    logout,
    setActiveTab,
    setIsReceivePaymentModalOpen,
    setIsPaymentVoucherModalOpen,
    setIsNewCustomerModalOpen,
    setIsCreateInvoiceModalOpen,
    setIsCreatePurchaseModalOpen,
    setIsShortcutsHelpOpen,
    language,
    setLanguage,
    urduFontTheme,
    setUrduFontTheme,
    setIsGlobalSearchOpen,
    setIsChequeSearchOpen,
    setIsClearDemoDataModalOpen,
    lastAutoBackupTime,
    theme,
    setTheme,
    setIsBiltyUpdateModalOpen,
    setIsAccountInfoModalOpen,
    setIsNewProductModalOpen,
    setIsBankEntryModalOpen,
    setIsJournalVoucherModalOpen,
    openCopilotVoice,
    setIsAIGuideModalOpen,
    t,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <BrandLogo
            customLogoUrl={companyProfile.logoUrl}
            size="md"
            showSubtitle={true}
          />
        </div>

        {/* Center / Right: Quick Actions, Language, User Badge & Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
          {/* Active Lab badge */}
          <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="font-semibold tracking-wide">LAB &amp; ERP ACTIVE</span>
            <span className="text-slate-500">|</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">TRN: {companyProfile.ntn}</span>
          </div>

          {/* Language Switcher & Jameel Noori Nastaleeq Option */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-500/40 transition-colors cursor-pointer"
              title="Urdu & English Language Switcher"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'ur' ? 'اردو' : 'English'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    {t('language')} (Language)
                  </div>

                  <button
                    onClick={() => {
                      setLanguage('ur');
                      setIsLangMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-slate-200 hover:bg-slate-800 text-left cursor-pointer"
                  >
                    <span className="font-bold text-cyan-300">اردو (Urdu)</span>
                    {language === 'ur' && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>

                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-slate-200 hover:bg-slate-800 text-left cursor-pointer"
                  >
                    <span>English (انگریزی)</span>
                    {language === 'en' && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>

                  <div className="px-3 pt-2 pb-1 text-[10px] uppercase font-bold text-slate-400 border-t border-slate-800 mt-1">
                    {t('urduTheme')} (Urdu Font)
                  </div>

                  <button
                    onClick={() => {
                      setUrduFontTheme('jameel-noori');
                      setIsLangMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-slate-200 hover:bg-slate-800 text-left cursor-pointer"
                  >
                    <span className="text-amber-300 font-semibold">جمیل نوری نستعلیق (Jameel Noori)</span>
                    {urduFontTheme === 'jameel-noori' && <Check className="w-4 h-4 text-amber-400" />}
                  </button>

                  <button
                    onClick={() => {
                      setUrduFontTheme('standard');
                      setIsLangMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-slate-200 hover:bg-slate-800 text-left cursor-pointer"
                  >
                    <span>عام معیاری فونٹ (Standard)</span>
                    {urduFontTheme === 'standard' && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 30-Min Auto-Backup Status Indicator */}
          <button
            onClick={() => setActiveTab('backup')}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 hover:bg-emerald-950/60 transition-colors cursor-pointer"
            title="Automatic 30-Minute Backup Engine is Active. Click to view backup history."
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold">{language === 'ur' ? 'آٹو بیک اپ' : 'Auto-Backup'}:</span>
            <span className="font-mono text-emerald-400 text-[11px] font-bold">{lastAutoBackupTime}</span>
          </button>

          {/* Action Buttons with Shortcut Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Copilot Voice Communication Button (صوتی رابطہ) */}
            <button
              onClick={openCopilotVoice}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-purple-800 via-indigo-700 to-cyan-600 hover:from-purple-700 hover:to-cyan-500 text-white shadow-md shadow-purple-600/30 border border-purple-400/50 transition-all active:scale-95 cursor-pointer group"
              title="Alt+V: Start Voice Communication with Copilot (بول کر رہنمائی حاصل کریں)"
            >
              <div className="relative">
                <Mic className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              </div>
              <span className="font-bold">
                {language === 'ur' ? 'صوتی رابطہ' : 'Voice Copilot'}
              </span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-purple-950 font-mono text-[9px] text-purple-200 font-bold border border-purple-500/50">
                Alt+V
              </kbd>
            </button>

            {/* F4: Receive Payment Entry */}
            <button
              onClick={() => setIsReceivePaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
              title="F4: Receive Payment Entry (وصول رقم واؤچر)"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-white" />
              <span className="hidden xl:inline">{language === 'ur' ? 'وصول رقم' : 'Receive Pay'}</span>
              <kbd className="px-1.5 py-0.2 rounded bg-emerald-950 font-mono text-[9px] text-emerald-200 font-bold border border-emerald-400">
                F4
              </kbd>
            </button>

            {/* F5: All Data Search */}
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-amber-500/40 transition-all active:scale-95 cursor-pointer"
              title="F5: All Data Search across all ERP records"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline">{language === 'ur' ? 'تمام ڈیٹا' : 'All Data'}</span>
              <kbd className="px-1.5 py-0.2 rounded bg-slate-950 font-mono text-[9px] text-amber-400 font-bold border border-slate-700">
                F5
              </kbd>
            </button>

            {/* F6: New Stock Entry */}
            <button
              onClick={() => setIsNewProductModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
              title="F6: New Stock Entry (نیا اسٹاک اندراج)"
            >
              <Boxes className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">{language === 'ur' ? 'اسٹاک' : 'Stock'}</span>
              <kbd className="px-1.5 py-0.2 rounded bg-slate-950 font-mono text-[9px] text-cyan-400 font-bold border border-slate-700">
                F6
              </kbd>
            </button>

            {/* Alt+B: Bank Entry */}
            <button
              onClick={() => setIsBankEntryModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 hover:border-teal-500/40 transition-all active:scale-95 cursor-pointer"
              title="Alt+B: Bank Entry & Add New Bank Option"
            >
              <Landmark className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden xl:inline">{language === 'ur' ? 'بینک' : 'Bank'}</span>
              <kbd className="px-1.5 py-0.2 rounded bg-slate-950 font-mono text-[9px] text-teal-300 font-bold border border-slate-700">
                Alt+B
              </kbd>
            </button>

            {/* Bilty Tracking Quick Button (بلٹی اپڈیٹ آئیکون) */}
            <button
              onClick={() => setIsBiltyUpdateModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0d4558]/80 hover:bg-[#0d4558] text-cyan-300 border border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
              title="Bilty & Cargo Dispatch Update (بلٹی اپڈیٹ آئیکون)"
            >
              <Truck className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden lg:inline">{language === 'ur' ? 'بلٹی اپڈیٹ' : 'Bilty Update'}</span>
            </button>

            {/* Account Info Button */}
            <button
              onClick={() => setIsAccountInfoModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 hover:border-purple-500/40 transition-all active:scale-95 cursor-pointer"
              title="Chart of Accounts & Account Info (چارٹ آف اکاؤنٹس)"
            >
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden lg:inline">{language === 'ur' ? 'اکاؤنٹس' : 'Accounts'}</span>
            </button>

            {/* Day Book Quick Button */}
            <button
              onClick={() => setActiveTab('day-book')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
              title="Day Book (روزنامچہ)"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">{language === 'ur' ? 'روزنامچہ' : 'Day Book'}</span>
            </button>

            {/* Peacock Blue Theme Switcher */}
            <button
              onClick={() => setTheme(theme === 'peacock-blue' ? 'classic-slate' : 'peacock-blue')}
              className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-bold rounded-lg bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-900 transition-colors cursor-pointer"
              title="Toggle Peacock Blue / Slate Theme (تھیم تبدیل کریں)"
            >
              <Palette className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">
                {theme === 'peacock-blue' ? 'Peacock Blue' : 'Slate'}
              </span>
            </button>

            {/* F1: New Customer */}
            <button
              onClick={() => setIsNewCustomerModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
              title="F1: Register New Customer"
            >
              <span className="hidden sm:inline">{language === 'ur' ? '+ گاہک' : '+ Cust'}</span>
              <kbd className="px-1.5 py-0.2 rounded bg-slate-950 font-mono text-[9px] text-cyan-400 font-bold border border-slate-700">
                F1
              </kbd>
            </button>

            {/* F2: Sale Invoice */}
            <button
              onClick={() => {
                setActiveTab('customer-invoices');
                setIsCreateInvoiceModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95 cursor-pointer"
              title="F2: Create Customer Sale Invoice"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden md:inline">{language === 'ur' ? 'سیل انوائس' : 'Sale Invoice'}</span>
              <span className="md:hidden">Sale</span>
              <kbd className="px-1.5 py-0.2 rounded bg-slate-950/40 font-mono text-[9px] font-bold">
                F2
              </kbd>
            </button>

            {/* F3: Purchase Bill */}
            <button
              onClick={() => {
                setActiveTab('purchase-invoices');
                setIsCreatePurchaseModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all active:scale-95 cursor-pointer"
              title="F3: Record Inward Purchase Bill"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">{language === 'ur' ? 'خریداری بل' : 'Purchase Bill'}</span>
              <span className="lg:hidden">Bill</span>
              <kbd className="px-1.5 py-0.2 rounded bg-slate-950/40 font-mono text-[9px] font-bold">
                F3
              </kbd>
            </button>
          </div>

          {/* User Account & Security Controls */}
          {currentUser && (
            <div className="relative pl-1 border-l border-slate-800">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                  {currentUser.fullName.slice(0, 2)}
                </div>
                <div className="hidden xl:block text-left text-xs leading-tight">
                  <div className="font-bold text-slate-200 group-hover:text-white truncate max-w-[110px]">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono font-semibold flex items-center gap-1">
                    <span>{currentUser.role}</span>
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Active</span>
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                    {/* User profile summary */}
                    <div className="px-3.5 py-2.5 border-b border-slate-800">
                      <div className="font-bold text-white text-sm">{currentUser.fullName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">@{currentUser.username}</div>
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {currentUser.role} OPERATOR
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          <Clock className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Logged In</span>
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {/* User Activity & Login Log */}
                      <button
                        onClick={() => {
                          setActiveTab('audit-log');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>{language === 'ur' ? 'یوزر لاگ ان و آؤٹ رپورٹ' : 'User Activity & Login/Out Log'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('users');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-cyan-400" />
                        <span>Users &amp; Passwords</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('backup');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Database className="w-4 h-4 text-emerald-400" />
                        <span>Backup &amp; Restore</span>
                      </button>

                      {/* CLEAR ALL DEMO DATA ACTION */}
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsClearDemoDataModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 text-left transition-colors cursor-pointer font-semibold"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                        <span>{language === 'ur' ? 'تمام ڈیمو ڈیٹا صاف کریں' : 'Clear All Demo Data'}</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 text-left transition-colors cursor-pointer font-semibold"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Lock &amp; Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

