import React, { useState } from 'react';
import {
  AlertTriangle,
  BellRing,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PendingChequesWarningBanner: React.FC = () => {
  const {
    vouchers,
    updateChequeStatus,
    playChequeChimeSound,
    formatCurrency,
    invoices,
    setIsBiltyUpdateModalOpen,
    setSelectedInvoiceForBilty,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filter vouchers that are Cheque and pending
  const pendingCheques = vouchers.filter(
    (v) =>
      v.paymentMode === 'CHEQUE' &&
      (!v.chequeStatus || v.chequeStatus === 'PENDING')
  );

  const totalPendingAmount = pendingCheques.reduce((sum, v) => sum + v.amount, 0);

  // Dispatched / active bilty shipments count
  const activeBiltyInvoices = invoices.filter(
    (i) => i.biltyNumber && (i.biltyStatus === 'BOOKED' || i.biltyStatus === 'DISPATCHED')
  );

  const handlePlaySound = () => {
    playChequeChimeSound();
  };

  const handleClaimVoucher = (voucherId: string) => {
    updateChequeStatus(voucherId, 'CLAIMED');
  };

  if (pendingCheques.length === 0 && activeBiltyInvoices.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-[#19323d] to-amber-950/50 border border-amber-500/40 rounded-2xl p-3.5 shadow-lg backdrop-blur-sm transition-all animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Warning Indicator & Count */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-200 tracking-wide uppercase">
                Pending Cheques Warning (زیر التواء چیک وارننگ)
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                {pendingCheques.length} Pending ({formatCurrency(totalPendingAmount)})
              </span>
            </div>
            <p className="text-[11px] text-amber-200/80 mt-0.5">
              Attention: Verify counter clearing &amp; customer bank clearance before issuing lab goods.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sound Alert Chime Button */}
          <button
            onClick={handlePlaySound}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition-colors cursor-pointer"
            title="Play Cheque Alert Chime (آواز گھنٹی)"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400" />
            <span>Sound Chime</span>
          </button>

          {/* Transport / Bilty Status Quick Badge */}
          {activeBiltyInvoices.length > 0 && (
            <button
              onClick={() => {
                setSelectedInvoiceForBilty(activeBiltyInvoices[0]);
                setIsBiltyUpdateModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeBiltyInvoices.length} Dispatched Bilty</span>
            </button>
          )}

          {/* Toggle Details Expand */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Cheques' : 'Review & Claim'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Table of Pending Cheques */}
      {isExpanded && (
        <div className="mt-3.5 pt-3 border-t border-amber-500/30 space-y-2">
          <div className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
            <span>Actionable Cheques Awaiting Clearance / Claim:</span>
            <span>Total: {formatCurrency(totalPendingAmount)}</span>
          </div>

          <div className="divide-y divide-slate-800/80 bg-slate-950/60 rounded-xl border border-amber-500/20 overflow-hidden">
            {pendingCheques.map((chq) => (
              <div
                key={chq.id}
                className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">
                      {chq.voucherNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-300">
                      {chq.partyName || 'Counter Customer'}
                    </span>
                    {chq.referenceNo && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Chq #{chq.referenceNo}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Date: {chq.date}</span>
                    {chq.bankAccountName && (
                      <>
                        <span>·</span>
                        <span>Bank: {chq.bankAccountName}</span>
                      </>
                    )}
                    {chq.notes && (
                      <>
                        <span>·</span>
                        <span className="italic">{chq.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black text-amber-300 font-mono">
                    {formatCurrency(chq.amount)}
                  </span>

                  {/* Cheque Update Options */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateChequeStatus(chq.id, 'CLEARED')}
                      className="px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition-colors cursor-pointer flex items-center gap-1"
                      title="Clear Cheque into Bank Balance"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>Clear</span>
                    </button>
                    <button
                      onClick={() => handleClaimVoucher(chq.id)}
                      className="px-2 py-1 text-[11px] font-bold rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer flex items-center gap-1"
                      title="Claim Voucher (واؤچر کلیم کریں)"
                    >
                      <FileCheck className="w-3 h-3 text-cyan-400" />
                      <span>Claim</span>
                    </button>
                    <button
                      onClick={() => updateChequeStatus(chq.id, 'BOUNCED')}
                      className="px-2 py-1 text-[11px] font-bold rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 transition-colors cursor-pointer flex items-center gap-1"
                      title="Mark Cheque as Bounced"
                    >
                      <XCircle className="w-3 h-3 text-rose-400" />
                      <span>Bounce</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
