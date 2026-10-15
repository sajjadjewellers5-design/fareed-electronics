import React, { useState, useEffect, useRef } from 'react';
import {
  FileCheck,
  Search,
  X,
  Printer,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Landmark,
  Building,
  UserCheck,
  Calendar,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccountingVoucher } from '../types';

export const ChequeSearchModal: React.FC = () => {
  const {
    isChequeSearchOpen,
    setIsChequeSearchOpen,
    vouchers,
    setPreviewImage,
    setSelectedVoucherForPrint,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CLEARED' | 'BOUNCED'>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isChequeSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isChequeSearchOpen]);

  if (!isChequeSearchOpen) return null;

  // Filter vouchers that are Cheques or have reference numbers
  const allCheques = vouchers.filter(
    (v) =>
      v.paymentMode === 'CHEQUE' ||
      (v.referenceNo && v.referenceNo.toLowerCase().includes('chq')) ||
      (v.referenceNo && v.referenceNo.length >= 4)
  );

  const filteredCheques = allCheques.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.voucherNumber.toLowerCase().includes(q) ||
      (v.referenceNo && v.referenceNo.toLowerCase().includes(q)) ||
      (v.partyName && v.partyName.toLowerCase().includes(q)) ||
      (v.bankAccountName && v.bankAccountName.toLowerCase().includes(q)) ||
      (v.notes && v.notes.toLowerCase().includes(q));

    // Determine status from notes or payment mode
    const isCleared = !v.notes?.includes('PENDING') && !v.notes?.includes('BOUNCED');
    const isPending = Boolean(v.notes?.includes('PENDING'));
    const isBounced = Boolean(v.notes?.includes('BOUNCED'));

    let matchesStatus = true;
    if (statusFilter === 'CLEARED') matchesStatus = isCleared;
    if (statusFilter === 'PENDING') matchesStatus = isPending;
    if (statusFilter === 'BOUNCED') matchesStatus = isBounced;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl p-6 shadow-2xl relative space-y-5 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setIsChequeSearchOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{t('chequeRegister')}</span>
              <kbd className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                F5 Cheque Hotkey
              </kbd>
            </h2>
            <p className="text-xs text-slate-400">
              Search, verify, and track all customer &amp; vendor cheques (چیک سرچ اور تصدیق)
            </p>
          </div>
        </div>

        {/* Search Input & Status Filter Tabs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Cheque #, Bank name, Customer / Vendor name, Voucher #... (F5)"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-semibold ${
                statusFilter === 'ALL'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Cheques ({allCheques.length})
            </button>
            <button
              onClick={() => setStatusFilter('CLEARED')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-semibold ${
                statusFilter === 'CLEARED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cleared
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-semibold ${
                statusFilter === 'PENDING'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('BOUNCED')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-semibold ${
                statusFilter === 'BOUNCED'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Returned
            </button>
          </div>
        </div>

        {/* Cheques Table & List */}
        <div className="flex-1 overflow-y-auto min-h-[220px]">
          {filteredCheques.length === 0 ? (
            <div className="py-14 text-center text-slate-500 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <FileCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">
                {t('noChequesFound')}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No cheques matching &ldquo;{searchQuery}&rdquo;. Cheques recorded in Receive Payment (RV) or Pay Voucher (PV) appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider bg-slate-950/60 sticky top-0">
                    <th className="py-2.5 px-3">Cheque / Ref #</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Party Name</th>
                    <th className="py-2.5 px-3">Bank Account</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Slip Photo</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCheques.map((v) => {
                    const isReceipt = v.voucherType === 'RECEIPT';
                    return (
                      <tr
                        key={v.id}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-mono font-bold text-amber-300">
                            {v.referenceNo || 'CHEQUE'}
                          </div>
                          <div className="text-[10px] text-slate-500">{v.voucherNumber}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              isReceipt
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {isReceipt ? (
                              <>
                                <ArrowDownLeft className="w-3 h-3" />
                                <span>RECEIVED</span>
                              </>
                            ) : (
                              <>
                                <ArrowUpRight className="w-3 h-3" />
                                <span>ISSUED</span>
                              </>
                            )}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 font-semibold text-white">
                          <div>{v.partyName}</div>
                          {v.partyPhone && (
                            <div className="text-[10px] text-slate-400 font-normal">{v.partyPhone}</div>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-slate-500" />
                            <span>{v.bankAccountName}</span>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                          {v.date}
                        </td>

                        <td className="py-2.5 px-3 text-right font-mono font-bold text-white text-sm">
                          Rs. {v.amount.toLocaleString()}
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          {v.voucherImage ? (
                            <button
                              onClick={() => setPreviewImage(v.voucherImage || null)}
                              className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-800 px-2 py-0.5 rounded cursor-pointer"
                              title="View uploaded cheque / slip photo"
                            >
                              <Camera className="w-3 h-3" />
                              <span>View Slip</span>
                            </button>
                          ) : (
                            <span className="text-slate-600 text-[10px]">&mdash;</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>CLEARED</span>
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedVoucherForPrint(v);
                            }}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Print Cheque Voucher Slip"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Total Cheques Found: <strong className="text-white">{filteredCheques.length}</strong></span>
            <span>&bull;</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Esc</kbd> to close</span>
          </div>

          <button
            onClick={() => setIsChequeSearchOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
