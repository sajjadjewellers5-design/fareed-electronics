import React, { useState } from 'react';
import {
  Printer,
  X,
  FileText,
  Receipt,
  MapPin,
  Phone,
  Mail,
  Trash2,
  AlertTriangle,
  MessageCircle,
  Languages,
  Truck,
  Eye,
  ZoomIn,
  ZoomOut,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo, LogoWatermark } from './BrandLogo';

export const PrintInvoiceModal: React.FC = () => {
  const {
    selectedInvoiceForPrint,
    setSelectedInvoiceForPrint,
    companyProfile,
    bankAccounts,
    customers,
    setSelectedCustomerForLedger,
    formatCurrency,
    deleteInvoice,
    setWhatsAppModalInvoice,
    language,
    urduFontTheme,
  } = useApp();

  const [printFormat, setPrintFormat] = useState<'A4' | 'THERMAL'>('A4');
  const [invoiceLanguage, setInvoiceLanguage] = useState<'en' | 'ur' | 'bilingual'>(() =>
    language === 'ur' ? 'ur' : 'en'
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!selectedInvoiceForPrint) return null;

  const inv = selectedInvoiceForPrint;
  const primaryBank = bankAccounts.find((b) => b.type === 'BANK') || bankAccounts[0];

  const handlePrint = () => {
    window.print();
  };

  const isUrdu = invoiceLanguage === 'ur';
  const isBilingual = invoiceLanguage === 'bilingual';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200 print:p-0 print:m-0 print:bg-white print:static print:overflow-visible">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col my-6 max-h-[92vh] print:max-h-none print:h-auto print:my-0 print:border-none print:shadow-none print:bg-white print:w-full print:max-w-full print:rounded-none">
        {/* Controls Toolbar (hidden during print) */}
        <div className="no-print flex items-center justify-between px-5 py-3.5 bg-slate-800/90 border-b border-slate-700 rounded-t-2xl shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-200 font-bold text-sm">
              {isUrdu ? 'انوائس پرنٹ منظر' : 'Invoice Print Preview'}
            </span>
            <span className="text-xs font-mono text-cyan-400">[{inv.invoiceNumber}]</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Format toggle: Standard A4 vs 80mm Thermal Receipt */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700">
              <button
                onClick={() => setPrintFormat('A4')}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  printFormat === 'A4'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Standard A4</span>
              </button>
              <button
                onClick={() => setPrintFormat('THERMAL')}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  printFormat === 'THERMAL'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>80mm POS Thermal</span>
              </button>
            </div>

            {/* Urdu Convert Toggle on Invoice */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700">
              <button
                onClick={() => setInvoiceLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  invoiceLanguage === 'en'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setInvoiceLanguage('ur')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  invoiceLanguage === 'ur'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Convert Invoice to Complete Urdu (اردو بل)"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>اردو بل (Urdu)</span>
              </button>
              <button
                onClick={() => setInvoiceLanguage('bilingual')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  invoiceLanguage === 'bilingual'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Dual English & Urdu format"
              >
                Bilingual
              </button>
            </div>

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
                title="Zoom Out Preview"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="font-mono text-[10px] text-slate-300 px-1">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                title="Zoom In Preview"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => {
                const targetCustomer = customers.find(
                  (c) =>
                    (inv.customerId && c.id === inv.customerId) ||
                    (inv.customerName &&
                      c.name.trim().toLowerCase() === inv.customerName.trim().toLowerCase())
                );
                if (targetCustomer) {
                  setSelectedInvoiceForPrint(null);
                  setSelectedCustomerForLedger(targetCustomer);
                } else {
                  // Fallback: create temporary customer object for ledger view
                  setSelectedInvoiceForPrint(null);
                  setSelectedCustomerForLedger({
                    id: inv.customerId || `cust-${Date.now()}`,
                    name: inv.customerName,
                    phone: inv.customerPhone,
                    address: inv.customerAddress,
                    totalPurchased: inv.grandTotal,
                    currentBalance: inv.dueBalance,
                  });
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 cursor-pointer transition-colors"
              title="Open Customer Ledger & Account Details (کسٹمر لیجر)"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Customer Ledger</span>
            </button>

            <button
              onClick={() => setWhatsAppModalInvoice(inv)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 cursor-pointer transition-colors"
              title="Send Invoice to Customer on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Invoice</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 cursor-pointer ring-1 ring-cyan-300/40"
              title="Normal Print to default printer (Enter / P)"
            >
              <Printer className="w-4 h-4 animate-pulse" />
              <span>Normal Print (پرنٹ کریں)</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 cursor-pointer transition-colors"
              title="Delete this invoice"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Delete Invoice</span>
            </button>

            <button
              onClick={() => setSelectedInvoiceForPrint(null)}
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
                <span className="font-bold text-white">Permanently delete invoice {inv.invoiceNumber}?</span>
                <p className="text-[11px] text-rose-300/80">
                  All {inv.items.length} component(s) will be returned to stock inventory and balance reversed.
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
                  deleteInvoice(inv.id);
                  setSelectedInvoiceForPrint(null);
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
          {/* FORMAT 1: STANDARD A4 SHEET */}
          {printFormat === 'A4' ? (
            <div
              id="printable-invoice"
              dir={isUrdu ? 'rtl' : 'ltr'}
              className={`print-area bg-white text-slate-900 w-full max-w-3xl p-8 sm:p-10 rounded-xl shadow-xl border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-full print:rounded-none relative overflow-hidden transition-transform duration-150 print:transform-none ${
                isUrdu || (isBilingual && urduFontTheme === 'jameel-noori') ? 'font-jameel' : ''
              }`}
              style={{
                minHeight: '1050px',
                color: '#0f172a',
                transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                transformOrigin: 'top center',
              }}
            >
              {/* Logo Watermark on Printed Invoice (User Requirement) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] overflow-hidden -z-0">
                <LogoWatermark
                  customLogoUrl={companyProfile.logoUrl}
                  className="scale-[2.2] text-slate-900"
                />
              </div>

              {/* Header: Brand & Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-6">
                <div>
                  <BrandLogo
                    customLogoUrl={companyProfile.logoUrl}
                    size="lg"
                    showSubtitle={true}
                  />
                  {isUrdu && (
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      فرید الیکٹرانکس &bull; آفیشل ٹیک اسٹور، الیکٹرانکس لیب اینڈ سروس سینٹر
                    </div>
                  )}
                  <div className="text-xs text-slate-600 mt-3 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{companyProfile.address}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{companyProfile.phone}</span>
                      <span className="text-slate-400">·</span>
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{companyProfile.email}</span>
                    </p>
                    <p className="font-semibold text-slate-700">
                      {isUrdu ? 'ٹیکس رجسٹریشن این ٹی این: ' : isBilingual ? 'Tax/NTN (ٹیکس رجسٹریشن): ' : 'Tax/NTN Registration: '}
                      <span className="font-mono">{companyProfile.ntn}</span>
                    </p>
                  </div>
                </div>

                <div className={`${isUrdu ? 'text-left' : 'text-right'} sm:self-start`}>
                  <div className="inline-block bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase">
                    {isUrdu ? 'سیلز انوائس و ٹیکس بل' : isBilingual ? 'TAX & LAB INVOICE / ٹیکس بل' : 'TAX & LAB INVOICE'}
                  </div>
                  <div className="mt-2 text-xl font-black font-mono tracking-tight text-slate-900">
                    {inv.invoiceNumber}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                    <div>
                      {isUrdu ? 'تاریخ جاری: ' : isBilingual ? 'Date (تاریخ): ' : 'Date: '}
                      <span className="font-semibold text-slate-800">{inv.date}</span>
                    </div>
                    <div>
                      {isUrdu ? 'آخری تاریخ: ' : isBilingual ? 'Due Date (آخری تاریخ): ' : 'Due Date: '}
                      <span className="font-semibold text-slate-800">{inv.dueDate}</span>
                    </div>
                    <div>
                      {isUrdu ? 'کیفیت بل: ' : isBilingual ? 'Status (کیفیت): ' : 'Payment Status: '}
                      <span
                        className={`font-bold uppercase ${
                          inv.paymentStatus === 'PAID'
                            ? 'text-emerald-700'
                            : inv.paymentStatus === 'PARTIAL'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {inv.paymentStatus === 'PAID'
                          ? isUrdu ? 'مکمل ادا شدہ (PAID)' : isBilingual ? 'PAID (مکمل ادا شدہ)' : 'PAID'
                          : inv.paymentStatus === 'PARTIAL'
                          ? isUrdu ? 'جزوی ادائیگی (PARTIAL)' : isBilingual ? 'PARTIAL (جزوی)' : 'PARTIAL'
                          : isUrdu ? 'غیر ادا شدہ (UNPAID)' : isBilingual ? 'UNPAID (غیر ادا شدہ)' : 'UNPAID'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill To & Payment Mode */}
              <div className="grid grid-cols-2 gap-6 my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {isUrdu ? 'تفصیل خریدار / گاہک (Billed To)' : isBilingual ? 'Billed To (تفصیل خریدار / گاہک)' : 'Billed To (Customer / Lab Client)'}
                  </div>
                  <div className="font-black text-slate-900 text-sm">{inv.customerName}</div>
                  <div className="text-slate-700 mt-0.5">{inv.customerPhone}</div>
                  {inv.customerAddress && (
                    <div className="text-slate-600 mt-0.5">{inv.customerAddress}</div>
                  )}
                </div>

                <div className={isUrdu ? 'text-left' : 'text-right'}>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {isUrdu ? 'طریقہ ادائیگی کی تفصیل' : isBilingual ? 'Payment Details (طریقہ ادائیگی)' : 'Payment Details'}
                  </div>
                  <div className="font-semibold text-slate-800">
                    {isUrdu ? 'طریقہ ادائیگی: ' : 'Method: '}
                    <span className="uppercase font-bold">
                      {inv.paymentMethod === 'CASH'
                        ? isUrdu ? 'نقد کیش (CASH)' : 'CASH'
                        : inv.paymentMethod === 'BANK'
                        ? isUrdu ? 'بینک ٹرانسفر (BANK)' : 'BANK'
                        : inv.paymentMethod === 'ONLINE'
                        ? isUrdu ? 'آن لائن ادائیگی (ONLINE)' : 'ONLINE'
                        : isUrdu ? 'ادھار کھاتہ (CREDIT)' : 'CREDIT'}
                    </span>
                  </div>
                  {inv.bankAccountName && (
                    <div className="text-slate-600 mt-0.5">
                      {isUrdu ? 'بینک کھاتہ: ' : 'Account: '}{inv.bankAccountName}
                    </div>
                  )}
                  {inv.notes && (
                    <div className="text-slate-500 italic mt-1 text-[11px]">
                      {isUrdu ? 'نوٹ: ' : 'Note: '}{inv.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Bilty & Transport Cargo Delivery (User Explicit Requirement: Bilty No on Sales Invoice) */}
              {inv.biltyNumber && (
                <div className="my-4 p-3 bg-slate-50 border border-slate-300 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-800 shrink-0" />
                    <span className="font-bold text-slate-900">
                      {isUrdu ? 'بلٹی نمبر (Bilty No): ' : isBilingual ? 'Bilty No (بلٹی نمبر): ' : 'Bilty No / Cargo Tracking: '}
                      <span className="font-mono text-cyan-950 font-black text-sm">{inv.biltyNumber}</span>
                    </span>
                  </div>
                  <div className="text-slate-700 font-semibold flex items-center gap-3">
                    {inv.transportName && <span>Transport: <b>{inv.transportName}</b></span>}
                    {inv.destinationStation && <span>Destination: <b>{inv.destinationStation}</b></span>}
                    {inv.cartonCount ? <span>Packages: <b>{inv.cartonCount} Box(es)</b></span> : null}
                  </div>
                </div>
              )}

              {/* Items Table */}
              <div className="my-6">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">
                        {isUrdu ? 'نمبر' : '#'}
                      </th>
                      <th className="py-2.5 px-3">
                        {isUrdu ? 'تفصیل اشیاء و وارنٹی' : isBilingual ? 'Item Description (تفصیل سامان)' : 'Item Description & Warranty'}
                      </th>
                      <th className="py-2.5 px-3 text-center">
                        {isUrdu ? 'مقدار' : isBilingual ? 'Qty (تعداد)' : 'Qty'}
                      </th>
                      <th className="py-2.5 px-3 text-right">
                        {isUrdu ? 'فی قیمت' : isBilingual ? 'Unit Price (قیمت)' : 'Unit Price'}
                      </th>
                      <th className="py-2.5 px-3 text-right">
                        {isUrdu ? 'رعایت' : isBilingual ? 'Discount (رعایت)' : 'Discount'}
                      </th>
                      <th className="py-2.5 px-3 text-right">
                        {isUrdu ? 'کل رقم' : isBilingual ? 'Total (رقم)' : 'Total'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {inv.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3 text-slate-500 font-mono">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{item.productName}</div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                            <span className="font-mono text-slate-600 font-semibold">{item.sku}</span>
                            <span>·</span>
                            <span className="text-cyan-700 font-medium">
                              {isUrdu ? `وارنٹی: ${item.warranty}` : item.warranty}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-700">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-500">
                          {item.discount > 0 ? `-${formatCurrency(item.discount)}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="flex justify-end my-6">
                <div className="w-72 space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                    <span>{isUrdu ? 'سب ٹوٹل / کُل مالیت:' : isBilingual ? 'Subtotal (سب ٹوٹل):' : 'Subtotal:'}</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {formatCurrency(inv.subtotal)}
                    </span>
                  </div>
                  {inv.discountAmount > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700">
                      <span>{isUrdu ? 'رعایت / ڈسکاؤنٹ:' : isBilingual ? 'Discount (رعایت):' : 'Invoice Discount:'}</span>
                      <span className="font-mono font-semibold">
                        -{formatCurrency(inv.discountAmount)}
                      </span>
                    </div>
                  )}
                  {inv.taxAmount > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                      <span>{isUrdu ? `سیلز ٹیکس (${inv.taxPercent}%):` : `Sales Tax (${inv.taxPercent}%):`}</span>
                      <span className="font-mono font-semibold">
                        {formatCurrency(inv.taxAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b-2 border-slate-900 font-black text-sm text-slate-900">
                    <span>{isUrdu ? 'حتمی واجب الادا رقم:' : isBilingual ? 'Grand Total (کل رقم):' : 'Grand Total:'}</span>
                    <span className="font-mono">{formatCurrency(inv.grandTotal)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                    <span>{isUrdu ? 'وصول شدہ رقم:' : isBilingual ? 'Paid (وصول شدہ):' : 'Amount Paid:'}</span>
                    <span className="font-mono">{formatCurrency(inv.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold text-rose-700 border-t border-slate-300">
                    <span>{isUrdu ? 'بقایا واجب الادا رقم:' : isBilingual ? 'Balance Due (بقایا):' : 'Balance Due:'}</span>
                    <span className="font-mono text-sm">{formatCurrency(inv.dueBalance)}</span>
                  </div>
                </div>
              </div>

              {/* Bank Details & Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t-2 border-slate-200 text-[11px] text-slate-600">
                <div className="space-y-1">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    {isUrdu ? 'براہ راست بینک ٹرانسفر کھاتہ' : isBilingual ? 'Direct Bank Remittance (بینک اکاونٹ)' : 'Direct Bank Remittance'}
                  </div>
                  {primaryBank && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                      <div className="font-semibold text-slate-900">{primaryBank.bankName}</div>
                      <div>
                        {isUrdu ? 'اکاؤنٹ ٹائٹل: ' : 'Acct Title: '}
                        <span className="font-semibold text-slate-800">FAREED ELECTRONICS</span>
                      </div>
                      <div>
                        {isUrdu ? 'اکاؤنٹ نمبر: ' : 'Acct #: '}
                        <span className="font-mono font-bold text-slate-900">{primaryBank.accountNumber}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">
                    {isUrdu ? 'شرائط و ضوابط' : isBilingual ? 'Store & Lab Terms (شرائط و ضوابط)' : 'Store & Lab Terms'}
                  </div>
                  <div className="text-slate-600 whitespace-pre-line text-[10px] leading-relaxed">
                    {isUrdu
                      ? '1. خریدا گیا سامان 7 دن کے اندر اصل بل اور پیکنگ کے ہمراہ تبدیل ہو سکتا ہے۔\n2. نقد رقم ناقابل واپسی ہے۔\n3. شارٹ سرکٹ، جلنے یا ٹوٹنے کی صورت میں وارنٹی لاگو نہیں ہوگی۔\n4. وارنٹی کے دعوے کے لیے یہ بل لازمی ہمراہ لائیں۔'
                      : companyProfile.terms}
                  </div>
                </div>
              </div>

              {/* Signatures Footer */}
              <div className="grid grid-cols-2 gap-12 mt-12 pt-8 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
                    {isUrdu ? 'دستخط خریدار / گاہک' : isBilingual ? 'Customer Signature (دستخط خریدار)' : 'Customer Signature'}
                  </div>
                </div>

                <div>
                  <div className="border-t border-slate-900 pt-1 font-bold text-slate-900">
                    {isUrdu ? 'دستخط و مہر برائے فرید الیکٹرانکس' : isBilingual ? 'For FAREED ELECTRONICS (دستخط و مہر)' : 'For FAREED ELECTRONICS (Authorized Stamp)'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* FORMAT 2: 80mm POS THERMAL RECEIPT */
            <div
              id="printable-thermal"
              dir={isUrdu ? 'rtl' : 'ltr'}
              className={`print-area bg-white text-slate-900 w-[300px] p-4 rounded-xl shadow-xl border border-slate-300 text-xs print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-full print:rounded-none relative overflow-hidden transition-transform duration-150 print:transform-none thermal-slip ${
                isUrdu ? 'font-jameel' : 'font-mono'
              }`}
              style={{
                color: '#000000',
                transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                transformOrigin: 'top center',
              }}
            >
              {/* Logo Watermark on Thermal Slip */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] overflow-hidden -z-0">
                <LogoWatermark
                  customLogoUrl={companyProfile.logoUrl}
                  className="scale-[1.4] text-slate-900"
                />
              </div>

              <div className="text-center pb-2 border-b border-dashed border-slate-400">
                <div className="font-black text-sm uppercase">
                  {isUrdu ? 'فرید الیکٹرانکس' : 'FAREED ELECTRONICS'}
                </div>
                <div className="text-[10px] font-bold text-slate-600">
                  {isUrdu ? 'ٹیک اسٹور اینڈ سروس لیب' : 'OFFICIAL TECH STORE & LAB'}
                </div>
                <div className="text-[9px] text-slate-500 mt-1">{companyProfile.address}</div>
                <div className="text-[9px] text-slate-500">Ph: {companyProfile.phone}</div>
                <div className="text-[9px] font-bold mt-1">NTN: {companyProfile.ntn}</div>
              </div>

              <div className="py-2 border-b border-dashed border-slate-400 text-[10px] space-y-0.5">
                <div>{isUrdu ? 'بل نمبر: ' : 'Inv #: '}{inv.invoiceNumber}</div>
                <div>{isUrdu ? 'تاریخ: ' : 'Date: '}{inv.date}</div>
                <div>{isUrdu ? 'خریدار: ' : 'Customer: '}{inv.customerName}</div>
                <div>{isUrdu ? 'فون: ' : 'Phone: '}{inv.customerPhone}</div>
              </div>

              <div className="py-2 border-b border-dashed border-slate-400">
                <div className="text-[10px] font-bold flex justify-between border-b border-slate-200 pb-1">
                  <span>{isUrdu ? 'آئٹم' : 'ITEM'}</span>
                  <span>{isUrdu ? 'تعداد x ریٹ' : 'QTY x RATE'}</span>
                  <span>{isUrdu ? 'رقم' : 'TOTAL'}</span>
                </div>
                {inv.items.map((item, idx) => (
                  <div key={idx} className="py-1 text-[10px]">
                    <div className="font-bold truncate">{item.productName}</div>
                    <div className="flex justify-between text-slate-600">
                      <span>{item.quantity} x {item.unitPrice}</span>
                      <span className="font-bold text-slate-900">{formatCurrency(item.total)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="py-2 border-b border-dashed border-slate-400 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>{isUrdu ? 'میزان / سب ٹوٹل:' : 'Subtotal:'}</span>
                  <span>{formatCurrency(inv.subtotal)}</span>
                </div>
                {inv.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span>{isUrdu ? 'رعایت:' : 'Discount:'}</span>
                    <span>-{formatCurrency(inv.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-xs border-t border-slate-400 pt-1">
                  <span>{isUrdu ? 'کل رقم:' : 'GRAND TOTAL:'}</span>
                  <span>{formatCurrency(inv.grandTotal)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>{isUrdu ? 'وصول:' : 'PAID:'}</span>
                  <span>{formatCurrency(inv.paidAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{isUrdu ? 'بقایا رقم:' : 'BALANCE DUE:'}</span>
                  <span>{formatCurrency(inv.dueBalance)}</span>
                </div>
              </div>

              <div className="pt-3 text-center text-[9px] text-slate-600 space-y-1">
                <div>
                  {isUrdu ? 'تشریف آوری کا بہت شکریہ! فرید الیکٹرانکس' : 'Thank you for choosing Fareed Electronics!'}
                </div>
                <div>
                  {isUrdu ? 'وارنٹی کے لیے یہ رسید سنبھال کر رکھیں۔' : 'Keep receipt for lab testing claims.'}
                </div>
                <div className="font-bold">www.fareedelectronics.com</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
