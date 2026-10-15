import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  Trash2,
  Camera,
  Receipt,
  DollarSign,
  Building,
  UserCheck,
  AlertCircle,
  AlertTriangle,
  ArrowRightLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccountingVoucher } from '../types';

export const VouchersLedger: React.FC = () => {
  const {
    vouchers,
    deleteVoucher,
    formatCurrency,
    setSelectedVoucherForPrint,
    setPreviewImage,
    setIsReceivePaymentModalOpen,
    setIsPaymentVoucherModalOpen,
    setIsJournalVoucherModalOpen,
  } = useApp();

  const [filterType, setFilterType] = useState<'ALL' | 'RECEIPT' | 'PAYMENT' | 'JOURNAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [voucherToDelete, setVoucherToDelete] = useState<AccountingVoucher | null>(null);

  // Calculations
  const totalReceipts = vouchers
    .filter((v) => v.voucherType === 'RECEIPT')
    .reduce((acc, v) => acc + v.amount, 0);

  const totalPayments = vouchers
    .filter((v) => v.voucherType === 'PAYMENT')
    .reduce((acc, v) => acc + v.amount, 0);

  const totalJournals = vouchers
    .filter((v) => v.voucherType === 'JOURNAL')
    .reduce((acc, v) => acc + v.amount, 0);

  const netCashFlow = totalReceipts - totalPayments;

  // Filter vouchers
  const filteredVouchers = vouchers.filter((v) => {
    const matchesType = filterType === 'ALL' || v.voucherType === filterType;
    const matchesSearch =
      v.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.partyName && v.partyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.debitAccountName && v.debitAccountName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.creditAccountName && v.creditAccountName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.referenceNo && v.referenceNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.allocatedInvoiceNo && v.allocatedInvoiceNo.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span>Accounting Vouchers &amp; Ledgers</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Log official cash/bank receipts (RV), supplier payments (PV), and general journal vouchers (JV).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsJournalVoucherModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>+ Journal Voucher (JV)</span>
          </button>

          <button
            onClick={() => setIsReceivePaymentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Receive Payment</span>
          </button>

          <button
            onClick={() => setIsPaymentVoucherModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Pay Voucher</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Customer Receipts (Money In)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">
            {formatCurrency(totalReceipts)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {vouchers.filter((v) => v.voucherType === 'RECEIPT').length} Receipt Vouchers
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Supplier Payments (Money Out)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400 font-mono">
            {formatCurrency(totalPayments)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {vouchers.filter((v) => v.voucherType === 'PAYMENT').length} Payable Vouchers
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net Voucher Cashflow</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`mt-2 text-2xl font-black font-mono ${
              netCashFlow >= 0 ? 'text-cyan-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(netCashFlow)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {netCashFlow >= 0 ? 'Net Positive Inflow' : 'Net Disbursed'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Voucher # (e.g. FE-RV / FE-PV), Party Name, Cheque #, or Invoice Ref..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Vouchers ({vouchers.length})
          </button>
          <button
            onClick={() => setFilterType('RECEIPT')}
            className={`flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'RECEIPT'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <ArrowDownLeft className="w-3 h-3" />
            <span>Receipt Vouchers</span>
          </button>
          <button
            onClick={() => setFilterType('PAYMENT')}
            className={`flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'PAYMENT'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <ArrowUpRight className="w-3 h-3" />
            <span>Payment Vouchers</span>
          </button>
          <button
            onClick={() => setFilterType('JOURNAL')}
            className={`flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
              filterType === 'JOURNAL'
                ? 'bg-indigo-500 text-white font-bold'
                : 'text-indigo-400 hover:text-indigo-300'
            }`}
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Journal Vouchers (JV) ({vouchers.filter((v) => v.voucherType === 'JOURNAL').length})</span>
          </button>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Voucher # &amp; Date</th>
                <th className="py-3 px-3">Party (Customer / Supplier)</th>
                <th className="py-3 px-3 text-center">Type</th>
                <th className="py-3 px-3">Bank / Cash Account</th>
                <th className="py-3 px-3">Reference / Cheque</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Pic Slip</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No vouchers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((v) => {
                  const isReceipt = v.voucherType === 'RECEIPT';
                  const isJournal = v.voucherType === 'JOURNAL';

                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div
                          className={`font-mono font-bold text-xs ${
                            isJournal
                              ? 'text-indigo-400'
                              : isReceipt
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {v.voucherNumber}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{v.date}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-white text-xs">
                          {isJournal
                            ? `${v.debitAccountName || 'Dr'} → ${v.creditAccountName || 'Cr'}`
                            : v.partyName}
                        </div>
                        {v.allocatedInvoiceNo && (
                          <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                            Ref: {v.allocatedInvoiceNo}
                          </div>
                        )}
                        {isJournal && v.notes && (
                          <div className="text-[10px] text-slate-400 italic mt-0.5 truncate max-w-xs">
                            {v.notes}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isJournal
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : isReceipt
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {isJournal
                            ? 'JOURNAL (JV)'
                            : isReceipt
                            ? 'RECEIPT (IN)'
                            : 'PAYMENT (OUT)'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-200">
                          {isJournal ? 'Double Entry Adjustment' : v.bankAccountName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {v.paymentMode.replace('_', ' ')}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                        {v.referenceNo || '—'}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-black text-xs">
                        <span
                          className={
                            isJournal
                              ? 'text-indigo-400'
                              : isReceipt
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }
                        >
                          {isJournal ? '' : isReceipt ? '+' : '-'}
                          {formatCurrency(v.amount)}
                        </span>
                      </td>

                      {/* Pic slip button */}
                      <td className="py-3 px-3 text-center">
                        {v.voucherImage ? (
                          <button
                            onClick={() => setPreviewImage(v.voucherImage || null)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold hover:bg-cyan-900/60 cursor-pointer"
                            title="View attached slip photo"
                          >
                            <Camera className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Slip</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500">None</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedVoucherForPrint(v)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Print Voucher"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setVoucherToDelete(v)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer group"
                            title="Delete Voucher"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE VOUCHER CONFIRMATION MODAL */}
      {voucherToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Voucher?</h3>
                <p className="text-xs text-rose-400 font-mono font-semibold">
                  {voucherToDelete.voucherNumber} ({voucherToDelete.voucherType})
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Party:</span>
                  <span className="font-bold text-white">{voucherToDelete.partyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Voucher Type:</span>
                  <span className={`font-bold ${voucherToDelete.voucherType === 'RECEIPT' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {voucherToDelete.voucherType === 'RECEIPT' ? 'Customer Receipt (Money In)' : 'Supplier Payment (Money Out)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bank Account:</span>
                  <span className="text-slate-300">{voucherToDelete.bankAccountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-mono text-slate-300">{voucherToDelete.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {formatCurrency(voucherToDelete.amount)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Automatic Bank &amp; Ledger Reversal</span>
                </div>
                <p className="text-amber-300/80 leading-relaxed">
                  Deleting will revert the bank transaction balance and readjust the {voucherToDelete.partyType ? voucherToDelete.partyType.toLowerCase() : 'account'}'s outstanding balance.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setVoucherToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteVoucher(voucherToDelete.id);
                  setVoucherToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
