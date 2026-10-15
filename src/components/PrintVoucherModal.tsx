import React, { useState } from 'react';
import {
  Printer,
  X,
  FileCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Camera,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Eye,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo, LogoWatermark } from './BrandLogo';

export const PrintVoucherModal: React.FC = () => {
  const {
    selectedVoucherForPrint,
    setSelectedVoucherForPrint,
    companyProfile,
    formatCurrency,
    setPreviewImage,
    deleteVoucher,
  } = useApp();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!selectedVoucherForPrint) return null;

  const v = selectedVoucherForPrint;
  const isReceipt = v.voucherType === 'RECEIPT';
  const isJournal = v.voucherType === 'JOURNAL';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200 print:p-0 print:m-0 print:bg-white print:static print:overflow-visible">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col my-6 max-h-[92vh] print:max-h-none print:h-auto print:my-0 print:border-none print:shadow-none print:bg-white print:w-full print:max-w-full print:rounded-none">
        {/* Controls Toolbar (hidden during print) */}
        <div className="no-print flex items-center justify-between px-5 py-3.5 bg-slate-800/90 border-b border-slate-700 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-200 font-bold text-sm">
              {isJournal
                ? 'Journal Voucher (JV) Preview'
                : isReceipt
                ? 'Receipt Voucher Preview'
                : 'Payment Voucher Preview'}
            </span>
            <span className="text-xs font-mono text-cyan-400">[{v.voucherNumber}]</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Print Preview Zoom Control */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
              <span className="text-[10px] text-slate-400 font-bold px-1.5 flex items-center gap-1">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>Preview:</span>
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="font-mono text-[10px] text-slate-300 px-1">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 cursor-pointer ring-1 ring-cyan-300/40"
              title="Normal Print to default printer"
            >
              <Printer className="w-4 h-4 animate-pulse" />
              <span>Normal Print (پرنٹ کریں)</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 cursor-pointer transition-colors"
              title="Delete this voucher"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Delete Voucher</span>
            </button>

            <button
              onClick={() => setSelectedVoucherForPrint(null)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Alert Banner inside modal if triggered */}
        {showDeleteConfirm && (
          <div className="no-print p-4 bg-rose-950/80 border-b border-rose-500/40 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Permanently delete voucher {v.voucherNumber}?</span>
                <p className="text-[11px] text-rose-300/80">
                  Bank balance and {v.partyType ? v.partyType.toLowerCase() : 'account'} ledger will be readjusted automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteVoucher(v.id);
                  setSelectedVoucherForPrint(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        )}

        {/* Printable Document Sheet */}
        <div className="overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950/70 print:p-0 print:bg-white print:overflow-visible print:block">
          <div
            id="printable-voucher"
            className="print-area bg-white text-slate-900 w-full max-w-2xl p-8 sm:p-10 rounded-xl shadow-xl border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-full print:rounded-none relative overflow-hidden transition-transform duration-150 print:transform-none"
            style={{
              minHeight: '650px',
              color: '#0f172a',
              transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
              transformOrigin: 'top center',
            }}
          >
            {/* Logo Watermark on Printed Voucher (User Requirement) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] overflow-hidden -z-0">
              <LogoWatermark
                customLogoUrl={companyProfile.logoUrl}
                className="scale-[2.2] text-slate-900"
              />
            </div>
            {/* Header: Brand & Info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <BrandLogo
                  customLogoUrl={companyProfile.logoUrl}
                  size="md"
                  showSubtitle={true}
                />
                <div className="text-[11px] text-slate-600 mt-2 space-y-0.5">
                  <p>{companyProfile.address}</p>
                  <p>Ph: {companyProfile.phone} · NTN: {companyProfile.ntn}</p>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`inline-block text-white px-3 py-1 rounded text-xs font-black tracking-wider uppercase ${
                    isJournal
                      ? 'bg-indigo-800'
                      : isReceipt
                      ? 'bg-emerald-800'
                      : 'bg-amber-800'
                  }`}
                >
                  {isJournal
                    ? 'GENERAL JOURNAL VOUCHER (JV)'
                    : isReceipt
                    ? 'BANK / CASH RECEIPT VOUCHER'
                    : 'BANK / CASH PAYMENT VOUCHER'}
                </div>
                <div className="mt-2 text-lg font-black font-mono tracking-tight text-slate-900">
                  {v.voucherNumber}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Date: <span className="font-semibold text-slate-800">{v.date}</span>
                </div>
              </div>
            </div>

            {/* Voucher Body Details */}
            <div className="my-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                {isJournal ? (
                  <>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                        Debit Account (Dr):
                      </span>
                      <div className="font-black text-slate-900 text-sm mt-0.5">
                        {v.debitAccountName || 'Debit Account'}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                        Credit Account (Cr):
                      </span>
                      <div className="font-black text-slate-900 text-sm mt-0.5">
                        {v.creditAccountName || 'Credit Account'}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isReceipt ? 'Received From (Customer / Client):' : 'Paid To (Supplier / Payee):'}
                      </span>
                      <div className="font-black text-slate-900 text-sm mt-0.5">{v.partyName}</div>
                      {v.partyPhone && (
                        <div className="text-slate-600 text-[11px] mt-0.5">{v.partyPhone}</div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Financial Account:
                      </span>
                      <div className="font-semibold text-slate-800 text-xs mt-0.5">{v.bankAccountName}</div>
                      <div className="text-slate-600 text-[11px] mt-0.5">
                        Mode: <span className="font-bold uppercase">{v.paymentMode.replace('_', ' ')}</span>
                      </div>
                      {v.referenceNo && (
                        <div className="text-slate-600 text-[11px] mt-0.5">
                          Ref/Cheque #: <span className="font-mono font-semibold">{v.referenceNo}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Amount Box */}
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Amount {isJournal ? 'Adjusted' : isReceipt ? 'Received' : 'Disbursed'}:
                  </span>
                  <div className="text-xl font-black font-mono text-slate-900 mt-0.5">
                    {formatCurrency(v.amount)}
                  </div>
                </div>

                {v.allocatedInvoiceNo && (
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Allocated Reference:
                    </span>
                    <span className="font-mono font-bold text-cyan-700 text-xs">
                      {v.allocatedInvoiceNo}
                    </span>
                  </div>
                )}
              </div>

              {/* Description / Memo */}
              {v.notes && (
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Particulars / Narration:
                  </span>
                  <p className="text-slate-700 italic">{v.notes}</p>
                </div>
              )}

              {/* Picture slip preview if attached */}
              {v.voucherImage && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                  <img
                    src={v.voucherImage}
                    alt="Voucher slip"
                    className="w-16 h-16 object-contain rounded border border-slate-300 bg-white"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Electronic Slip / Cheque Photo Attached</span>
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Verified and logged in Fareed Tech ERP
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Authorized Signatures */}
            <div className="grid grid-cols-3 gap-6 mt-16 pt-6 border-t border-slate-300 text-center text-xs">
              <div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
                  Prepared By (Cashier)
                </div>
              </div>

              <div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
                  Checked &amp; Verified
                </div>
              </div>

              <div>
                <div className="border-t border-slate-900 pt-1 font-bold text-slate-900">
                  Authorized Sign &amp; Stamp
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
