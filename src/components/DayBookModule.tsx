import React, { useState } from 'react';
import {
  Calendar,
  Printer,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Truck,
  Landmark,
  FileCheck,
  Search,
  Filter,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DayBookModule: React.FC = () => {
  const {
    invoices,
    purchaseInvoices,
    vouchers,
    bankTransactions,
    formatCurrency,
    companyProfile,
    setIsBiltyUpdateModalOpen,
    setSelectedInvoiceForBilty,
    setSelectedInvoiceForPrint,
    setSelectedVoucherForPrint,
    openCustomerLedger,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [filterType, setFilterType] = useState<'ALL' | 'SALES' | 'PURCHASES' | 'RECEIPTS' | 'PAYMENTS' | 'JOURNAL'>('ALL');

  // Filter day's transactions
  const dayInvoices = invoices.filter((inv) => inv.date === selectedDate);
  const dayPurchases = purchaseInvoices.filter((pur) => pur.date === selectedDate);
  const dayReceiptVouchers = vouchers.filter(
    (v) => v.date === selectedDate && v.voucherType === 'RECEIPT'
  );
  const dayPaymentVouchers = vouchers.filter(
    (v) => v.date === selectedDate && v.voucherType === 'PAYMENT'
  );
  const dayJournalVouchers = vouchers.filter(
    (v) => v.date === selectedDate && v.voucherType === 'JOURNAL'
  );

  // Financial aggregates for the selected day
  const dayTotalSales = dayInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const daySalesCashReceived = dayInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const dayVoucherReceipts = dayReceiptVouchers.reduce((sum, v) => sum + v.amount, 0);
  const totalDayInflow = daySalesCashReceived + dayVoucherReceipts;

  const dayPurchasesCashPaid = dayPurchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const dayVoucherPayments = dayPaymentVouchers.reduce((sum, v) => sum + v.amount, 0);
  const totalDayOutflow = dayPurchasesCashPaid + dayVoucherPayments;

  const netDayCashFlow = totalDayInflow - totalDayOutflow;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#072836] border border-[#0d556e]/80 p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>Daily Day Book (روزنامچہ — تمام روزانہ ٹرانزیکشنز)</span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              روزانہ سیلز بمعہ بلٹی نمبر، خریداریاں، وصولیاں، ادائیگیاں اور جنرل واؤچرز کا مکمل ریکارڈ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-semibold">Date (تاریخ):</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs bg-transparent text-white font-bold focus:outline-none"
            />
          </div>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Today (آج)
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Day Book</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for the selected day */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#072836]/90 border border-[#0d556e]/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Total Day Sales Turnover</div>
          <div className="text-xl font-black text-white font-mono mt-1">
            {formatCurrency(dayTotalSales)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {dayInvoices.length} Invoices Issued
          </div>
        </div>

        <div className="bg-[#072836]/90 border border-[#0d556e]/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Total Day Cash/Bank Inflow</div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1">
            +{formatCurrency(totalDayInflow)}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Sales paid + RV receipts
          </div>
        </div>

        <div className="bg-[#072836]/90 border border-[#0d556e]/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Total Day Cash/Bank Outflow</div>
          <div className="text-xl font-black text-rose-400 font-mono mt-1">
            -{formatCurrency(totalDayOutflow)}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">
            Purchases paid + PV payments
          </div>
        </div>

        <div className="bg-[#072836]/90 border border-[#0d556e]/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold">Net Daily Cash Flow</div>
          <div className={`text-xl font-black font-mono mt-1 ${netDayCashFlow >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
            {netDayCashFlow >= 0 ? '+' : ''}{formatCurrency(netDayCashFlow)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Net liquid movement for date
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="no-print flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Transactions (سب ریکارڈز)' },
          { id: 'SALES', label: `Sales Invoices (${dayInvoices.length})` },
          { id: 'PURCHASES', label: `Purchase Bills (${dayPurchases.length})` },
          { id: 'RECEIPTS', label: `Receipts RV (${dayReceiptVouchers.length})` },
          { id: 'PAYMENTS', label: `Payments PV (${dayPaymentVouchers.length})` },
          { id: 'JOURNAL', label: `Journal JV (${dayJournalVouchers.length})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id as typeof filterType)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterType === f.id
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 1. Sales Invoices Section (with Bilty numbers!) */}
      {(filterType === 'ALL' || filterType === 'SALES') && (
        <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl p-4.5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Customer Sales Invoices (سیلز بل و بلٹی معلومات) — {dayInvoices.length} Items</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Total Sales: {formatCurrency(dayTotalSales)}
            </span>
          </div>

          {dayInvoices.length === 0 ? (
            <div className="text-xs text-slate-400 py-3 text-center italic">
              No sales invoices issued on {selectedDate}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Inv #</th>
                    <th className="p-2.5">Customer</th>
                    <th className="p-2.5">Bilty # / Transporter</th>
                    <th className="p-2.5 text-right">Grand Total</th>
                    <th className="p-2.5 text-right">Paid In</th>
                    <th className="p-2.5 text-right">Balance Due</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {dayInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-2.5 font-mono font-bold text-cyan-400">
                        {inv.invoiceNumber}
                      </td>
                      <td className="p-2.5 font-semibold text-white">
                        <div>{inv.customerName}</div>
                        <div className="text-[11px] text-slate-400">{inv.customerPhone}</div>
                      </td>
                      <td className="p-2.5">
                        {inv.biltyNumber ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px]">
                              BL: {inv.biltyNumber}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {inv.transportName} ({inv.destinationStation || 'Dispatched'})
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedInvoiceForBilty(inv);
                              setIsBiltyUpdateModalOpen(true);
                            }}
                            className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3 h-3" />
                            <span>+ Add Bilty (بلٹی لگائیں)</span>
                          </button>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-white">
                        {formatCurrency(inv.grandTotal)}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                        +{formatCurrency(inv.paidAmount)}
                      </td>
                      <td className="p-2.5 text-right font-mono text-rose-400">
                        {inv.dueBalance > 0 ? formatCurrency(inv.dueBalance) : '—'}
                      </td>
                      <td className="p-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Direct Customer Ledger Option (User Requirement) */}
                          <button
                            onClick={() => openCustomerLedger(inv.customerId)}
                            className="px-2 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 hover:text-white flex items-center gap-1 text-[11px] font-semibold cursor-pointer transition-colors"
                            title="Open Customer Ledger Khata (گاہک کا لیجر کھاتہ)"
                          >
                            <BookOpen className="w-3 h-3 text-indigo-400" />
                            <span>Ledger</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInvoiceForBilty(inv);
                              setIsBiltyUpdateModalOpen(true);
                            }}
                            className="p-1 rounded bg-slate-800 text-cyan-400 hover:text-white cursor-pointer"
                            title="Update Bilty Details"
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedInvoiceForPrint(inv)}
                            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                            title="Print Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. Receipts & Payments Split */}
      {(filterType === 'ALL' || filterType === 'RECEIPTS' || filterType === 'PAYMENTS') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Receipts (RV) */}
          {(filterType === 'ALL' || filterType === 'RECEIPTS') && (
            <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl p-4.5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  <span>Cash &amp; Bank Receipts (وصولیاں - RV)</span>
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{formatCurrency(dayVoucherReceipts)}
                </span>
              </div>

              {dayReceiptVouchers.length === 0 ? (
                <div className="text-xs text-slate-400 py-3 text-center italic">
                  No separate receipt vouchers for {selectedDate}.
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {dayReceiptVouchers.map((v) => (
                    <div key={v.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span className="font-mono text-cyan-400">{v.voucherNumber}</span>
                          <span>{v.partyName || 'Customer'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Mode: {v.paymentMode} {v.bankAccountName ? `· ${v.bankAccountName}` : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-400">
                          +{formatCurrency(v.amount)}
                        </div>
                        <button
                          onClick={() => setSelectedVoucherForPrint(v)}
                          className="text-[10px] text-cyan-400 hover:underline"
                        >
                          Print RV
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payments (PV) */}
          {(filterType === 'ALL' || filterType === 'PAYMENTS') && (
            <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl p-4.5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  <span>Cash &amp; Bank Payments (ادائیگیاں - PV)</span>
                </h3>
                <span className="text-xs font-mono font-bold text-rose-400">
                  -{formatCurrency(dayVoucherPayments)}
                </span>
              </div>

              {dayPaymentVouchers.length === 0 ? (
                <div className="text-xs text-slate-400 py-3 text-center italic">
                  No payment vouchers recorded on {selectedDate}.
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {dayPaymentVouchers.map((v) => (
                    <div key={v.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span className="font-mono text-amber-400">{v.voucherNumber}</span>
                          <span>{v.partyName || 'Vendor / Expense'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Mode: {v.paymentMode} {v.notes ? `· ${v.notes}` : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-rose-400">
                          -{formatCurrency(v.amount)}
                        </div>
                        <button
                          onClick={() => setSelectedVoucherForPrint(v)}
                          className="text-[10px] text-cyan-400 hover:underline"
                        >
                          Print PV
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. Journal Vouchers (JV) */}
      {(filterType === 'ALL' || filterType === 'JOURNAL') && (
        <div className="bg-[#072836] border border-[#0d556e]/80 rounded-2xl p-4.5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>Journal Vouchers (جنرل واؤچر — JV) — {dayJournalVouchers.length} Entries</span>
            </h3>
          </div>

          {dayJournalVouchers.length === 0 ? (
            <div className="text-xs text-slate-400 py-2 text-center italic">
              No journal adjustments posted on {selectedDate}.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {dayJournalVouchers.map((jv) => (
                <div key={jv.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-indigo-300">{jv.voucherNumber}</div>
                    <div className="text-slate-300 mt-0.5">
                      Debit: <span className="font-bold text-white">{jv.debitAccountName}</span> | Credit:{' '}
                      <span className="font-bold text-white">{jv.creditAccountName}</span>
                    </div>
                    {jv.notes && <div className="text-[11px] text-slate-400 italic">{jv.notes}</div>}
                  </div>
                  <div className="font-mono font-bold text-white text-sm">
                    {formatCurrency(jv.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
