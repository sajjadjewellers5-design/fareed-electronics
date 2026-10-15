import React, { useMemo } from 'react';
import {
  X,
  Printer,
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  MessageCircle,
  Building,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import { LogoWatermark, BrandLogo } from './BrandLogo';

interface CustomerLedgerModalProps {
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerLedgerModal: React.FC<CustomerLedgerModalProps> = ({
  customer,
  onClose,
}) => {
  const {
    invoices,
    vouchers,
    saleReturnInvoices,
    formatCurrency,
    companyProfile,
    triggerSystemPrint,
  } = useApp();

  if (!customer) return null;

  // Filter all activities for this customer (matches by ID or Customer Name)
  const customerInvoices = useMemo(
    () =>
      invoices.filter(
        (inv) =>
          (customer.id && inv.customerId === customer.id) ||
          (inv.customerName &&
            inv.customerName.trim().toLowerCase() === customer.name.trim().toLowerCase())
      ),
    [invoices, customer.id, customer.name]
  );

  const customerReceipts = useMemo(
    () =>
      vouchers.filter(
        (v) =>
          v.voucherType === 'RECEIPT' &&
          (v.partyId === customer.id ||
            v.partyName?.toLowerCase() === customer.name.toLowerCase())
      ),
    [vouchers, customer.id, customer.name]
  );

  const customerReturns = useMemo(
    () =>
      saleReturnInvoices.filter(
        (sr) =>
          sr.customerId === customer.id ||
          sr.customerName?.toLowerCase() === customer.name.toLowerCase()
      ),
    [saleReturnInvoices, customer.id, customer.name]
  );

  // Combine into unified ledger transaction timeline sorted chronologically
  interface LedgerEntry {
    id: string;
    date: string;
    type: 'INVOICE' | 'RECEIPT' | 'RETURN';
    reference: string;
    description: string;
    debit: number; // Increases customer debt
    credit: number; // Reduces customer debt
    paymentMode?: string;
  }

  const ledgerTimeline = useMemo(() => {
    const entries: LedgerEntry[] = [];

    // Invoices are Debit (customer owes money)
    customerInvoices.forEach((inv) => {
      entries.push({
        id: inv.id,
        date: inv.date,
        type: 'INVOICE',
        reference: inv.invoiceNumber,
        description: `Sale Invoice (${inv.items.length} items: ${inv.items.map((i) => i.productName).slice(0, 2).join(', ')}${inv.items.length > 2 ? '...' : ''})`,
        debit: inv.grandTotal,
        credit: 0,
      });

      // If initial payment was made directly with invoice
      if (inv.paidAmount > 0) {
        entries.push({
          id: `${inv.id}-paid`,
          date: inv.date,
          type: 'RECEIPT',
          reference: `REC-${inv.invoiceNumber}`,
          description: `Immediate payment on invoice ${inv.invoiceNumber}`,
          debit: 0,
          credit: inv.paidAmount,
          paymentMode: inv.paymentMethod,
        });
      }
    });

    // Standalone Receipt Vouchers are Credit
    customerReceipts.forEach((rc) => {
      // Avoid double counting if already added via invoice immediate paidAmount
      if (rc.allocatedInvoiceNo && entries.some((e) => e.reference === `REC-${rc.allocatedInvoiceNo}`)) {
        return;
      }
      entries.push({
        id: rc.id,
        date: rc.date,
        type: 'RECEIPT',
        reference: rc.voucherNumber,
        description: `Cash / Bank Receipt Voucher (${rc.bankAccountName || rc.paymentMode}) - ${rc.notes || 'Payment received'}`,
        debit: 0,
        credit: rc.amount,
        paymentMode: rc.paymentMode,
      });
    });

    // Sale Returns are Credit
    customerReturns.forEach((sr) => {
      entries.push({
        id: sr.id,
        date: sr.date,
        type: 'RETURN',
        reference: sr.returnNumber,
        description: `Sale Return Voucher (Inv: ${sr.originalInvoiceNumber || 'Direct'}) - ${sr.notes || 'Returned stock'}`,
        debit: 0,
        credit: sr.grandTotal,
      });
    });

    // Sort ascending by date
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return entries;
  }, [customerInvoices, customerReceipts, customerReturns]);

  // Compute totals
  const totalDebit = ledgerTimeline.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = ledgerTimeline.reduce((sum, e) => sum + e.credit, 0);
  const calculatedBalance = Math.max(0, totalDebit - totalCredit);

  // Compute running balance
  let running = 0;
  const ledgerWithRunningBalance = ledgerTimeline.map((item) => {
    running = running + item.debit - item.credit;
    return {
      ...item,
      runningBalance: running,
    };
  });

  const handlePrint = () => {
    triggerSystemPrint();
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `السلام علیکم ${customer.name} صاحب،\n\nآپ کا فرید الیکٹرانکس میں کھاتہ لیجر درج ذیل ہے:\nمجموعی خریداری: ${formatCurrency(totalDebit)}\nکل وصول شدہ رقم: ${formatCurrency(totalCredit)}\nبقایا واجب الادا رقم (Current Balance): ${formatCurrency(customer.currentBalance || calculatedBalance)}\n\nشکریہ: ${companyProfile.name}\nرابطہ: ${companyProfile.phone}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in print:p-0 print:m-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden print:max-h-none print:h-auto print:border-none print:shadow-none print:bg-white print:w-full print:max-w-full print:rounded-none">
        {/* Top Action Bar (No-Print) */}
        <div className="no-print p-4 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{customer.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Customer Ledger (کھاتہ)
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ph: <span className="font-mono text-slate-300">{customer.phone}</span> &bull; {customer.city || customer.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors cursor-pointer"
              title="Send Statement via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Ledger</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Ledger / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ledger Document Sheet */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-950/70 flex justify-center print:p-0 print:bg-white print:overflow-visible print:block">
          <div
            id="printable-customer-ledger"
            className="print-area bg-white text-slate-900 w-full p-6 sm:p-8 rounded-xl shadow-xl border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-full print:rounded-none relative overflow-hidden print:transform-none"
            style={{ color: '#0f172a' }}
          >
            {/* Logo Watermark on Customer Ledger (User Requirement) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] overflow-hidden -z-0">
              <LogoWatermark
                customLogoUrl={companyProfile.logoUrl}
                className="scale-[2.2] text-slate-900"
              />
            </div>

            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <BrandLogo
                  customLogoUrl={companyProfile.logoUrl}
                  size="md"
                  showSubtitle={true}
                />
                <div className="text-[11px] text-slate-600 mt-2 space-y-0.5">
                  <p>{companyProfile.address}</p>
                  <p>Ph: {companyProfile.phone} &bull; NTN: {companyProfile.ntn}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded text-xs font-black tracking-wider uppercase">
                  CUSTOMER ACCOUNT STATEMENT / لیجر کھاتہ
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  Statement Date: <span className="font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Customer ID: <span className="font-mono font-bold text-slate-800">{customer.id}</span>
                </div>
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Customer Name</span>
                <span className="text-sm font-black text-slate-900">{customer.name}</span>
                <div className="text-slate-600 mt-0.5">{customer.address}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Phone / Mobile</span>
                <span className="font-mono font-bold text-slate-900">{customer.phone}</span>
                {customer.cnic && <div className="text-slate-600">CNIC: {customer.cnic}</div>}
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Current Outstanding Balance</span>
                <span className="text-base font-black font-mono text-rose-700">
                  {formatCurrency(customer.currentBalance || calculatedBalance)}
                </span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Credit Limit: {formatCurrency(customer.creditLimit || 50000)}
                </div>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-center text-xs">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-[10px] font-bold text-blue-800 uppercase">Total Billed (خریداری)</div>
                <div className="font-mono font-black text-blue-900 text-sm mt-0.5">
                  {formatCurrency(totalDebit)}
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Total Received (وصولی)</div>
                <div className="font-mono font-black text-emerald-900 text-sm mt-0.5">
                  {formatCurrency(totalCredit)}
                </div>
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="text-[10px] font-bold text-rose-800 uppercase">Net Balance Due (بقایا)</div>
                <div className="font-mono font-black text-rose-900 text-sm mt-0.5">
                  {formatCurrency(customer.currentBalance || calculatedBalance)}
                </div>
              </div>
            </div>

            {/* Ledger Transactions Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold text-[11px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Ref #</th>
                    <th className="py-2.5 px-3">Description / Details</th>
                    <th className="py-2.5 px-3 text-right">Debit (Dr)</th>
                    <th className="py-2.5 px-3 text-right">Credit (Cr)</th>
                    <th className="py-2.5 px-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {ledgerWithRunningBalance.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                        No transactions recorded yet for this customer account.
                      </td>
                    </tr>
                  ) : (
                    ledgerWithRunningBalance.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap">{item.date}</td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              item.type === 'INVOICE'
                                ? 'bg-blue-100 text-blue-800'
                                : item.type === 'RECEIPT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono font-semibold text-[11px] whitespace-nowrap">
                          {item.reference}
                        </td>
                        <td className="py-2 px-3 max-w-[260px] truncate" title={item.description}>
                          {item.description}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-blue-900">
                          {item.debit > 0 ? formatCurrency(item.debit) : '—'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-800">
                          {item.credit > 0 ? formatCurrency(item.credit) : '—'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(item.runningBalance)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                    <td colSpan={4} className="py-2.5 px-3 text-right uppercase">
                      Total Ledger Activity / میزان:
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-blue-900">
                      {formatCurrency(totalDebit)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-800">
                      {formatCurrency(totalCredit)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-700 text-sm">
                      {formatCurrency(customer.currentBalance || calculatedBalance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signature & Note Footer */}
            <div className="mt-10 pt-6 border-t border-slate-300 flex justify-between items-end text-xs text-slate-600">
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">Computer Generated Accounting Ledger</p>
                <p className="text-[10px] text-slate-500">
                  Fareed Electronics &bull; Official Account Statement &bull; Verified via System
                </p>
              </div>

              <div className="text-center space-y-1">
                <div className="w-40 border-b border-slate-400 mb-1" />
                <span className="text-[10px] uppercase font-bold text-slate-700">Accountant / Manager Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
