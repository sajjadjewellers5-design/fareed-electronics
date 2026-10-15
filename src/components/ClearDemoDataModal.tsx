import React, { useState } from 'react';
import {
  Trash2,
  X,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Boxes,
  Receipt,
  FileCheck,
  Landmark,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ClearDemoDataModal: React.FC = () => {
  const {
    isClearDemoDataModalOpen,
    setIsClearDemoDataModalOpen,
    clearAllTransactionsAndDemoData,
    deleteAllData,
    clearEverySingleEntry,
    loadSampleData,
    language,
    t,
  } = useApp();

  const [clearScope, setClearScope] = useState<'EVERY_SINGLE_ENTRY' | 'KEEP_CATALOG' | 'CATALOG_AND_SALES'>('EVERY_SINGLE_ENTRY');
  const [confirmText, setConfirmText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isClearDemoDataModalOpen) return null;

  const handleExecuteClear = () => {
    if (clearScope === 'EVERY_SINGLE_ENTRY') {
      clearEverySingleEntry();
    } else if (clearScope === 'CATALOG_AND_SALES') {
      deleteAllData(true);
    } else {
      clearAllTransactionsAndDemoData();
    }

    setSuccessMsg(language === 'ur' ? 'تمام ڈیمو ڈیٹا اور ہر ایک انٹری کامیابی سے حذف کر دی گئی ہے!' : 'All demo records & every single entry cleared successfully! Clean slate ready.');
    setTimeout(() => {
      setSuccessMsg('');
      setIsClearDemoDataModalOpen(false);
      setConfirmText('');
    }, 1800);
  };

  const handleRestoreDemo = () => {
    loadSampleData();
    setSuccessMsg('Sample store records restored successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      setIsClearDemoDataModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={() => setIsClearDemoDataModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{t('clearDemoTitle')}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Action
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {t('clearDemoDesc')}
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* What Will Be Cleared Summary */}
        <div className="space-y-2 text-xs">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>The following demo records will be cleared:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <Receipt className="w-3.5 h-3.5 text-cyan-400" />
              <span>All Customer Sale Invoices</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>All Purchase Bills &amp; Vouchers</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <Landmark className="w-3.5 h-3.5 text-purple-400" />
              <span>Bank Statements &amp; Ledger Balances</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <Boxes className="w-3.5 h-3.5 text-amber-400" />
              <span>Stock Movement Logs</span>
            </div>
          </div>
        </div>

        {/* Clear Scope Selector */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div className="font-semibold text-slate-300">
            {language === 'ur' ? 'حذف کرنے کا دائرہ کار منتخب کریں:' : 'Select Data Clear Scope:'}
          </div>
          <div className="space-y-2.5">
            <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded-xl bg-slate-900/60 border border-rose-500/30">
              <input
                type="radio"
                name="clearScopeOption"
                checked={clearScope === 'EVERY_SINGLE_ENTRY'}
                onChange={() => setClearScope('EVERY_SINGLE_ENTRY')}
                className="text-rose-500 focus:ring-0 mt-0.5"
              />
              <span className="text-slate-200">
                <strong className="text-rose-400">
                  {language === 'ur' ? 'تمام ڈیمو ڈیٹا اور ہر ایک انٹری حذف کریں (Clean Slate 100%)' : 'Wipe Every Single Entry (100% Complete Clean Slate)'}
                </strong>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {language === 'ur'
                    ? 'تمام سیلز، خریداری، واؤچرز، بینک اندراجات، کسٹمرز، سپلائرز اور تمام پروڈکٹس مکمل خالی ہو جائیں گے تاکہ آپ نئی شاپ کا آغاز کر سکیں۔'
                    : 'Empties all invoices, purchase bills, vouchers, bank transactions, customers, suppliers, and product catalog for a brand-new shop.'}
                </p>
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded-xl bg-slate-900/40 border border-slate-800">
              <input
                type="radio"
                name="clearScopeOption"
                checked={clearScope === 'KEEP_CATALOG'}
                onChange={() => setClearScope('KEEP_CATALOG')}
                className="text-cyan-500 focus:ring-0 mt-0.5"
              />
              <span className="text-slate-200">
                <strong className="text-cyan-400">
                  {language === 'ur' ? 'صرف ٹرانزیکشنز صاف کریں (پروڈکٹ لسٹ برقرار رکھیں)' : 'Clear Transactions & Reset Stock to 0 (Keep Product Names)'}
                </strong>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {language === 'ur'
                    ? 'پروڈکٹ لسٹ، ماڈل اور قیمتیں محفوظ رہیں گی، لیکن تمام بل، کھاتے اور اسٹاک مقدار 0 ہو جائے گی۔'
                    : 'Keep item names & categories intact, but reset all sale invoices, khata balances, and stock counts to 0.'}
                </p>
              </span>
            </label>
          </div>
        </div>

        {/* Confirmation Input Safeguard */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400">
            Type <strong className="text-rose-400 font-mono">CLEAR</strong> to confirm data deletion:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder="Type CLEAR"
            className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 text-white text-xs rounded-xl px-3.5 py-2 outline-none font-mono font-bold tracking-wider"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleRestoreDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('loadSampleData')}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsClearDemoDataModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              {t('cancel')} (Esc)
            </button>

            <button
              type="button"
              disabled={confirmText !== 'CLEAR'}
              onClick={handleExecuteClear}
              className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('clearDemoData')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
