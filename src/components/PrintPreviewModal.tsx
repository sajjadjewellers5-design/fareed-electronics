import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Sliders,
  Settings2,
  CheckCircle2,
  Share2,
  Copy,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FareedElectronicsBadge, LogoWatermark } from './BrandLogo';
import { CustomerInvoice, StockAdjustmentVoucher } from '../types';

export const PrintPreviewModal: React.FC = () => {
  const {
    isPrintPreviewOpen,
    setIsPrintPreviewOpen,
    printPreviewData,
    companyProfile,
    formatCurrency,
    systemPrinterSettings,
    updateSystemPrinterSettings,
  } = useApp();

  const [printMode, setPrintMode] = useState<'THERMAL' | 'A4'>('THERMAL');
  const [selectedPrinter, setSelectedPrinter] = useState<string>(
    systemPrinterSettings.printerType || 'system_default'
  );

  if (!isPrintPreviewOpen || !printPreviewData) return null;

  const { type, data } = printPreviewData;

  const handlePrint = () => {
    updateSystemPrinterSettings({ printerType: selectedPrinter as any });
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:m-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:h-auto print:border-none print:shadow-none print:bg-white print:w-full print:max-w-full print:rounded-none">
        
        {/* Header with Printer Selection */}
        <div className="no-print px-6 py-4 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Print Preview (پرنٹ پرویو)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                  {type.replace('_', ' ')}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Live document preview with Fareed Electronics official branding before physical printing
              </p>
            </div>
          </div>

          {/* Printer Selection Option & Format Toggle */}
          <div className="flex items-center gap-3">
            {type === 'INVOICE' && (
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPrintMode('THERMAL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    printMode === 'THERMAL'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Thermal (80mm)
                </button>
                <button
                  type="button"
                  onClick={() => setPrintMode('A4')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    printMode === 'A4'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  A4 Page
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1.5 rounded-xl border border-slate-800">
              <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedPrinter}
                onChange={(e) => setSelectedPrinter(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none"
              >
                <option value="system_default">System Default Printer (سسٹم ڈیفالٹ)</option>
                <option value="thermal_80mm">Thermal 80mm Slip (3-inch)</option>
                <option value="thermal_58mm">Thermal 58mm Slip Mini</option>
                <option value="tag_barcode_roll">Barcode Label Printer</option>
                <option value="laser_a4">Laser / Inkjet A4 Printer</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPrintPreviewOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Interactive Sheet Container */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-950/60 print:p-0 print:bg-white print:overflow-visible print:block">
          
          {/* Printable Document Sheet */}
          <div
            id="printable-preview-area"
            className={`print-area bg-white text-black shadow-2xl rounded-lg p-6 relative overflow-hidden transition-all print:p-0 print:m-0 print:shadow-none print:border-none print:w-full print:max-w-full ${
              printMode === 'THERMAL' && type === 'INVOICE'
                ? 'w-[320px] text-xs font-mono thermal-slip'
                : 'w-[720px] text-sm font-sans'
            }`}
          >

            {/* CASE 1: CUSTOMER SALE INVOICE PREVIEW */}
            {type === 'INVOICE' && (
              (() => {
                const inv = data as CustomerInvoice;
                return printMode === 'THERMAL' ? (
                  /* THERMAL 80mm FORMAT */
                  <div className="space-y-3 text-slate-900">
                    <div className="text-center space-y-1 border-b border-black pb-2">
                      <div className="flex justify-center">
                        <FareedElectronicsBadge size={44} />
                      </div>
                      <h1 className="font-bold text-base tracking-wide">FAREED ELECTRONICS</h1>
                      <div className="text-[10px] uppercase font-bold text-slate-700">ACCOUNTING &amp; TECH LAB</div>
                      <div className="text-[9px] text-slate-600">{companyProfile.address}</div>
                      <div className="text-[9px] text-slate-600">Ph: {companyProfile.phone}</div>
                    </div>

                    <div className="flex justify-between text-[11px] border-b border-dashed border-black pb-1.5">
                      <div>
                        <div>Inv #: <strong>{inv.invoiceNumber}</strong></div>
                        <div>Date: {inv.date}</div>
                      </div>
                      <div className="text-right">
                        <div>Cust: <strong>{inv.customerName}</strong></div>
                        <div>Ph: {inv.customerPhone}</div>
                      </div>
                    </div>

                    {/* Items table */}
                    <table className="w-full text-[10px] border-b border-black pb-1">
                      <thead>
                        <tr className="border-b border-black text-left">
                          <th className="py-1">ITEM (Pcs)</th>
                          <th className="py-1 text-center">QTY</th>
                          <th className="py-1 text-right">RATE</th>
                          <th className="py-1 text-right">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {inv.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-1 leading-tight">
                              <div>{item.productName}</div>
                              {item.tagNo && <div className="text-[8px] text-slate-500 font-mono">Tag: {item.tagNo}</div>}
                            </td>
                            <td className="py-1 text-center font-bold">{item.quantity}</td>
                            <td className="py-1 text-right">{item.unitPrice}</td>
                            <td className="py-1 text-right font-bold">{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Totals */}
                    <div className="space-y-1 text-[11px] pt-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(inv.subtotal)}</span>
                      </div>
                      {inv.discountAmount > 0 && (
                        <div className="flex justify-between text-rose-600">
                          <span>Discount:</span>
                          <span>-{formatCurrency(inv.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-sm border-t border-black pt-1">
                        <span>Grand Total:</span>
                        <span>{formatCurrency(inv.grandTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid Amount:</span>
                        <span>{formatCurrency(inv.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-dashed border-black pt-1">
                        <span>Balance Due:</span>
                        <span>{formatCurrency(inv.dueBalance)}</span>
                      </div>
                    </div>

                    <div className="text-center pt-2 text-[9px] text-slate-500 border-t border-black">
                      Thank You For Visiting Fareed Electronics!
                    </div>
                  </div>
                ) : (
                  /* A4 OFFICIAL TAX INVOICE FORMAT */
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                      <div className="flex items-center gap-3">
                        <FareedElectronicsBadge size={60} />
                        <div>
                          <h1 className="text-2xl font-black tracking-wide text-slate-950">
                            FAREED ELECTRONICS
                          </h1>
                          <p className="text-xs font-mono font-bold text-cyan-800 uppercase tracking-wider">
                            OFFICIAL TECH STORE &amp; CHIP-LEVEL LAB (2026)
                          </p>
                          <p className="text-xs text-slate-600">{companyProfile.address}</p>
                          <p className="text-xs text-slate-600">Phone: {companyProfile.phone} | NTN: {companyProfile.ntn}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono uppercase tracking-widest text-slate-500">TAX INVOICE</div>
                        <div className="text-2xl font-black font-mono text-slate-950">{inv.invoiceNumber}</div>
                        <div className="text-xs font-mono text-slate-600 mt-1">Date: {inv.date}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-slate-900 text-white">
                          {inv.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Customer Info Box */}
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-500">BILLED TO:</div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">{inv.customerName}</div>
                        <div className="text-slate-600 mt-0.5">Phone: {inv.customerPhone}</div>
                        {inv.customerAddress && <div className="text-slate-600">{inv.customerAddress}</div>}
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-mono text-slate-500">PAYMENT &amp; LOGISTICS:</div>
                        <div className="text-slate-700 font-medium mt-0.5">Method: {inv.paymentMethod}</div>
                        {inv.biltyNumber && (
                          <div className="font-mono text-slate-800 font-bold">
                            Bilty #: {inv.biltyNumber} ({inv.transportName || 'Direct'})
                          </div>
                        )}
                        <div className="text-slate-600">Due Date: {inv.dueDate || inv.date}</div>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <table className="w-full text-left text-xs border border-slate-200">
                      <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">Description &amp; Tag No</th>
                          <th className="p-2.5 text-center">Qty (Pieces)</th>
                          <th className="p-2.5 text-right">Unit Price</th>
                          <th className="p-2.5 text-right">Discount</th>
                          <th className="p-2.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {inv.items.map((line, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-2.5 font-mono text-slate-500">{idx + 1}</td>
                            <td className="p-2.5 font-medium">
                              <div>{line.productName}</div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                SKU: {line.sku} {line.tagNo ? `| Tag: ${line.tagNo}` : ''} | Warranty: {line.warranty || 'Standard'}
                              </div>
                            </td>
                            <td className="p-2.5 text-center font-bold text-sm">{line.quantity} Pcs</td>
                            <td className="p-2.5 text-right font-mono">{formatCurrency(line.unitPrice)}</td>
                            <td className="p-2.5 text-right font-mono text-rose-600">
                              {line.discount > 0 ? `-${formatCurrency(line.discount)}` : '-'}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-sm">
                              {formatCurrency(line.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Totals & Signatures */}
                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="text-xs text-slate-600 space-y-2">
                        <div className="font-bold text-slate-900">Terms &amp; Conditions:</div>
                        <p className="text-[11px] leading-relaxed">
                          1. Goods once sold can only be replaced as per warranty policy within 7 days.<br />
                          2. Physical breakage, burn, or tag removal voids official warranty.<br />
                          3. All disputes subject to Lahore jurisdiction.
                        </p>
                      </div>

                      <div className="space-y-1.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex justify-between text-slate-600">
                          <span>Subtotal:</span>
                          <span className="font-mono font-bold">{formatCurrency(inv.subtotal)}</span>
                        </div>
                        {inv.discountAmount > 0 && (
                          <div className="flex justify-between text-rose-600">
                            <span>Special Discount:</span>
                            <span className="font-mono font-bold">-{formatCurrency(inv.discountAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-black text-slate-950 border-t border-slate-300 pt-2">
                          <span>Grand Total:</span>
                          <span className="font-mono">{formatCurrency(inv.grandTotal)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Paid Amount:</span>
                          <span className="font-mono font-bold">{formatCurrency(inv.paidAmount)}</span>
                        </div>
                        <div className="flex justify-between text-rose-700 font-bold border-t border-dashed border-slate-300 pt-1">
                          <span>Balance Due:</span>
                          <span className="font-mono text-sm">{formatCurrency(inv.dueBalance)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Signatures */}
                    <div className="flex items-center justify-between pt-12 border-t border-slate-200 text-xs text-slate-500">
                      <div className="text-center w-40 border-t border-slate-400 pt-1">
                        Customer Signature
                      </div>
                      <div className="text-center w-40 border-t border-slate-400 pt-1">
                        Authorized Signatory
                      </div>
                    </div>
                  </div>
                );
              })()
            )}

            {/* CASE 2: STOCK ADJUSTMENT VOUCHER PREVIEW */}
            {type === 'STOCK_ADJUSTMENT' && (
              (() => {
                const sav = data as StockAdjustmentVoucher;
                return (
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                      <div className="flex items-center gap-3">
                        <FareedElectronicsBadge size={54} />
                        <div>
                          <h1 className="text-xl font-black text-slate-950">FAREED ELECTRONICS</h1>
                          <p className="text-xs font-mono font-bold text-amber-800 uppercase">
                            STOCK ADJUSTMENT VOUCHER (SAV)
                          </p>
                          <p className="text-[11px] text-slate-500">Inventory Audit &amp; Write-Off Department</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono uppercase text-slate-500">VOUCHER NUMBER</div>
                        <div className="text-xl font-black font-mono text-slate-950">{sav.voucherNumber}</div>
                        <div className="text-xs font-mono text-slate-600 mt-0.5">Date: {sav.date}</div>
                        <span
                          className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[11px] font-bold font-mono ${
                            sav.type === 'ADDITION'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {sav.type === 'ADDITION' ? '+ STOCK ADDITION' : '- STOCK DEDUCTION'}
                        </span>
                      </div>
                    </div>

                    {/* Product & Adjustment Box */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Product Adjusted</span>
                        <div className="text-base font-bold text-slate-900 mt-1">{sav.productName}</div>
                        <div className="text-slate-600 mt-0.5">
                          SKU: {sav.sku} {sav.tagNo ? `| Tag: ${sav.tagNo}` : ''}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Adjustment Quantity</span>
                        <div className="text-xl font-black text-amber-900 font-mono mt-1">
                          {sav.type === 'ADDITION' ? '+' : '-'}{sav.quantity} Pieces (عدد)
                        </div>
                        <div className="text-slate-600 text-[11px] mt-0.5">
                          Cost Value Impact: <strong>{formatCurrency(sav.totalValue)}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Reason & Notes */}
                    <div className="p-3 bg-slate-100 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-mono">REASON CATEGORY:</span>
                        <span className="font-bold text-slate-900">{sav.reasonCategory}</span>
                      </div>
                      {sav.notes && (
                        <div className="pt-1 text-slate-700 italic border-t border-slate-200">
                          Notes: {sav.notes}
                        </div>
                      )}
                    </div>

                    {/* Authorization & Signatures */}
                    <div className="flex items-center justify-between pt-10 border-t border-slate-200 text-xs text-slate-500">
                      <div>
                        <span>Authorized By: </span>
                        <strong className="text-slate-900">{sav.authorizedBy}</strong>
                      </div>
                      <div className="text-center w-40 border-t border-slate-400 pt-1">
                        Store In-Charge Signature
                      </div>
                    </div>
                  </div>
                );
              })()
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="no-print px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Official Fareed Electronics 2026 Print Engine</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPrintPreviewOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
