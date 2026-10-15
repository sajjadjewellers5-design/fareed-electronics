import React, { useState } from 'react';
import {
  Users2,
  Building,
  Printer,
  MessageCircle,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  FileSpreadsheet,
  Download,
  Calendar,
} from 'lucide-react';
import { Customer, Supplier } from '../types';
import { useApp } from '../context/AppContext';

export const CustomerSupplierLedger: React.FC = () => {
  const {
    customers,
    suppliers,
    invoices,
    purchaseInvoices,
    vouchers,
    formatCurrency,
    companyProfile,
    setSelectedInvoiceForPrint,
    setSelectedVoucherForPrint,
  } = useApp();

  const [ledgerType, setLedgerType] = useState<'CUSTOMER' | 'SUPPLIER'>('CUSTOMER');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'THIS_MONTH' | 'LAST_30' | 'CUSTOM'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const currentSupplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];

  // Build Customer Ledger Transactions:
  // Invoices (Debit +) and Receipt Vouchers / Invoice Paid amounts (Credit -)
  const customerEntries: {
    id: string;
    date: string;
    refNo: string;
    type: 'INVOICE' | 'RECEIPT' | 'JOURNAL';
    description: string;
    debit: number;
    credit: number;
  }[] = [];

  if (currentCustomer) {
    // 1. Sales Invoices (Matches by customer ID or Customer Name)
    const custInvoices = invoices.filter(
      (i) =>
        (currentCustomer.id && i.customerId === currentCustomer.id) ||
        (i.customerName &&
          i.customerName.trim().toLowerCase() === currentCustomer.name.trim().toLowerCase())
    );
    custInvoices.forEach((inv) => {
      customerEntries.push({
        id: inv.id,
        date: inv.date,
        refNo: inv.invoiceNumber,
        type: 'INVOICE',
        description: `Sale Invoice (${inv.items.length} items)${inv.biltyNumber ? ' · Bilty: ' + inv.biltyNumber : ''}`,
        debit: inv.grandTotal,
        credit: 0,
      });

      // If initial payment made on invoice
      if (inv.paidAmount > 0) {
        customerEntries.push({
          id: `${inv.id}-pay`,
          date: inv.date,
          refNo: `REC-${inv.invoiceNumber}`,
          type: 'RECEIPT',
          description: `Payment received against ${inv.invoiceNumber} (${inv.paymentMethod})`,
          debit: 0,
          credit: inv.paidAmount,
        });
      }
    });

    // 2. Additional Accounting Vouchers for this Customer
    const custVouchers = vouchers.filter(
      (v) =>
        v.partyType === 'CUSTOMER' &&
        ((v.partyId && v.partyId === currentCustomer.id) ||
          (v.partyName &&
            v.partyName.trim().toLowerCase() === currentCustomer.name.trim().toLowerCase()))
    );
    custVouchers.forEach((v) => {
      if (v.voucherType === 'RECEIPT') {
        customerEntries.push({
          id: v.id,
          date: v.date,
          refNo: v.voucherNumber,
          type: 'RECEIPT',
          description: v.notes || `Cash/Bank Payment received (${v.paymentMode})`,
          debit: 0,
          credit: v.amount,
        });
      }
    });
  }

  // Sort chronological
  customerEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Compute Running Balance for Customer
  let custRunningBalance = 0;
  const customerLedgerRows = customerEntries.map((row) => {
    custRunningBalance += row.debit - row.credit;
    return {
      ...row,
      runningBalance: custRunningBalance,
    };
  });

  const totalCustBilled = customerEntries.reduce((sum, r) => sum + r.debit, 0);
  const totalCustPaid = customerEntries.reduce((sum, r) => sum + r.credit, 0);
  const finalCustBalance = totalCustBilled - totalCustPaid;

  // Build Supplier Ledger Transactions:
  // Purchase Invoices (Credit + we owe supplier) and Payment Vouchers (Debit - we paid)
  const supplierEntries: {
    id: string;
    date: string;
    refNo: string;
    type: 'PURCHASE' | 'PAYMENT' | 'JOURNAL';
    description: string;
    debit: number; // money paid to supplier
    credit: number; // goods supplied by supplier
  }[] = [];

  if (currentSupplier) {
    const suppPurchases = purchaseInvoices.filter((p) => p.supplierId === currentSupplier.id);
    suppPurchases.forEach((pur) => {
      supplierEntries.push({
        id: pur.id,
        date: pur.date,
        refNo: pur.billNumber,
        type: 'PURCHASE',
        description: `Inward Purchase Bill (${pur.items.length} items)${pur.supplierInvoiceNo ? ' · Vendor Inv: ' + pur.supplierInvoiceNo : ''}`,
        debit: 0,
        credit: pur.grandTotal,
      });

      if (pur.paidAmount > 0) {
        supplierEntries.push({
          id: `${pur.id}-pay`,
          date: pur.date,
          refNo: `PAY-${pur.billNumber}`,
          type: 'PAYMENT',
          description: `Payment paid against bill ${pur.billNumber} (${pur.paymentMethod})`,
          debit: pur.paidAmount,
          credit: 0,
        });
      }
    });

    const suppVouchers = vouchers.filter(
      (v) =>
        v.partyType === 'SUPPLIER' &&
        (v.partyId === currentSupplier.id || v.partyName?.toLowerCase() === currentSupplier.name.toLowerCase())
    );
    suppVouchers.forEach((v) => {
      if (v.voucherType === 'PAYMENT') {
        supplierEntries.push({
          id: v.id,
          date: v.date,
          refNo: v.voucherNumber,
          type: 'PAYMENT',
          description: v.notes || `Cash/Bank Payment made to vendor (${v.paymentMode})`,
          debit: v.amount,
          credit: 0,
        });
      }
    });
  }

  supplierEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let suppRunningBalance = 0;
  const supplierLedgerRows = supplierEntries.map((row) => {
    suppRunningBalance += row.credit - row.debit;
    return {
      ...row,
      runningBalance: suppRunningBalance,
    };
  });

  const totalSuppSupplied = supplierEntries.reduce((sum, r) => sum + r.credit, 0);
  const totalSuppPaid = supplierEntries.reduce((sum, r) => sum + r.debit, 0);
  const finalSuppBalance = totalSuppSupplied - totalSuppPaid;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (ledgerType === 'CUSTOMER' && currentCustomer) {
      const text = `*${companyProfile.name} - Account Statement*\n` +
        `Customer: ${currentCustomer.name}\n` +
        `Phone: ${currentCustomer.phone}\n` +
        `Total Billed: ${formatCurrency(totalCustBilled)}\n` +
        `Total Received: ${formatCurrency(totalCustPaid)}\n` +
        `*Net Balance Due: ${formatCurrency(finalCustBalance)}*\n\n` +
        `Please clear the pending balance at your earliest convenience. Thank you!`;
      const phoneNum = currentCustomer.phone.replace(/[^0-9]/g, '');
      const url = `https://wa.me/${phoneNum.startsWith('92') ? phoneNum : '92' + phoneNum.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    } else if (currentSupplier) {
      const text = `*${companyProfile.name} - Supplier Ledger*\n` +
        `Supplier: ${currentSupplier.name}\n` +
        `Total Supplied: ${formatCurrency(totalSuppSupplied)}\n` +
        `Total Paid: ${formatCurrency(totalSuppPaid)}\n` +
        `*Current Outstanding Payable: ${formatCurrency(finalSuppBalance)}*`;
      const phoneNum = currentSupplier.phone.replace(/[^0-9]/g, '');
      const url = `https://wa.me/${phoneNum.startsWith('92') ? phoneNum : '92' + phoneNum.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Mode Toggle */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#072836] border border-[#0d556e]/80 p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>Customer &amp; Supplier Account Ledgers (کسٹمر و سپلائر کھاتہ لیجر)</span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              مکمل کھاتہ بمعہ ڈیبٹ، کریڈٹ، بقایا رقم، پرنٹ اسٹیٹمنٹ اور واٹس ایپ شیئرنگ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Send Statement WhatsApp</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Statement (پرنٹ لیجر)</span>
          </button>
        </div>
      </div>

      {/* Main Ledger Type Switcher & Party Selector */}
      <div className="no-print bg-[#072836]/90 border border-[#0d556e]/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLedgerType('CUSTOMER')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              ledgerType === 'CUSTOMER'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Customer Ledger (کسٹمر لیجر)
          </button>
          <button
            onClick={() => setLedgerType('SUPPLIER')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              ledgerType === 'SUPPLIER'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Supplier Ledger (سپلائر لیجر)
          </button>
        </div>

        {/* Party Selector Dropdown */}
        <div className="w-full sm:w-80">
          {ledgerType === 'CUSTOMER' ? (
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-400"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — Balance: {formatCurrency(c.currentBalance)}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-400"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — Balance: {formatCurrency(s.currentBalance)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Printable Statement Sheet Container */}
      <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl p-6 shadow-sm space-y-6" id="ledger-print-area">
        {/* Statement Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-700/80 pb-5">
          <div>
            <div className="text-lg font-black text-white uppercase tracking-tight">
              {companyProfile.name}
            </div>
            <div className="text-xs text-slate-300">{companyProfile.subtitle}</div>
            <div className="text-[11px] text-slate-400 mt-1 max-w-sm">
              {companyProfile.address} · Phone: {companyProfile.phone}
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs min-w-[260px]">
            <div className="text-cyan-400 font-bold uppercase text-[10px] tracking-wider mb-1">
              Account Party Statement (کھاتہ اسٹیٹمنٹ)
            </div>
            {ledgerType === 'CUSTOMER' && currentCustomer && (
              <>
                <div className="text-sm font-black text-white">{currentCustomer.name}</div>
                <div className="text-slate-300 mt-0.5">Phone: {currentCustomer.phone}</div>
                {currentCustomer.address && (
                  <div className="text-slate-400 text-[11px] mt-0.5">{currentCustomer.address}</div>
                )}
                <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between font-bold">
                  <span className="text-rose-400">Net Receivable Due:</span>
                  <span className="text-rose-400 font-mono text-sm">{formatCurrency(finalCustBalance)}</span>
                </div>
              </>
            )}

            {ledgerType === 'SUPPLIER' && currentSupplier && (
              <>
                <div className="text-sm font-black text-white">{currentSupplier.name}</div>
                <div className="text-slate-300 mt-0.5">Phone: {currentSupplier.phone}</div>
                {currentSupplier.address && (
                  <div className="text-slate-400 text-[11px] mt-0.5">{currentSupplier.address}</div>
                )}
                <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between font-bold">
                  <span className="text-amber-400">Net Payable Due:</span>
                  <span className="text-amber-400 font-mono text-sm">{formatCurrency(finalSuppBalance)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Ledger Summary KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400">
              {ledgerType === 'CUSTOMER' ? 'Total Billed (کل بل)' : 'Total Inward (کل مال)'}
            </div>
            <div className="text-base font-black text-white font-mono mt-0.5">
              {formatCurrency(ledgerType === 'CUSTOMER' ? totalCustBilled : totalSuppSupplied)}
            </div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400">
              {ledgerType === 'CUSTOMER' ? 'Total Received (وصول شدہ)' : 'Total Paid (ادا شدہ)'}
            </div>
            <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
              {formatCurrency(ledgerType === 'CUSTOMER' ? totalCustPaid : totalSuppPaid)}
            </div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400">
              Closing Balance (بقایا بیلنس)
            </div>
            <div className={`text-base font-black font-mono mt-0.5 ${ledgerType === 'CUSTOMER' ? 'text-rose-400' : 'text-amber-400'}`}>
              {formatCurrency(ledgerType === 'CUSTOMER' ? finalCustBalance : finalSuppBalance)}
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3">Date (تاریخ)</th>
                <th className="p-3">Ref / Voucher #</th>
                <th className="p-3">Description &amp; Details</th>
                <th className="p-3 text-right">Debit (+) / بنام</th>
                <th className="p-3 text-right">Credit (-) / جمع</th>
                <th className="p-3 text-right font-black text-white">Running Balance (بقایا)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {ledgerType === 'CUSTOMER' ? (
                customerLedgerRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                      No transactions recorded yet for this customer.
                    </td>
                  </tr>
                ) : (
                  customerLedgerRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-mono text-slate-400">{row.date}</td>
                      <td className="p-3 font-mono font-bold text-cyan-400">{row.refNo}</td>
                      <td className="p-3 text-slate-200">{row.description}</td>
                      <td className="p-3 text-right font-mono font-bold text-white">
                        {row.debit > 0 ? formatCurrency(row.debit) : '—'}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">
                        {row.credit > 0 ? formatCurrency(row.credit) : '—'}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-cyan-300 text-sm">
                        {formatCurrency(row.runningBalance)}
                      </td>
                    </tr>
                  ))
                )
              ) : supplierLedgerRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                    No transactions recorded yet for this supplier.
                  </td>
                </tr>
              ) : (
                supplierLedgerRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{row.date}</td>
                    <td className="p-3 font-mono font-bold text-amber-400">{row.refNo}</td>
                    <td className="p-3 text-slate-200">{row.description}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                      {row.debit > 0 ? formatCurrency(row.debit) : '—'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {row.credit > 0 ? formatCurrency(row.credit) : '—'}
                    </td>
                    <td className="p-3 text-right font-mono font-black text-amber-300 text-sm">
                      {formatCurrency(row.runningBalance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
