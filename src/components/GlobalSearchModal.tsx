import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Receipt,
  Boxes,
  Users2,
  FileCheck,
  ArrowRight,
  Sparkles,
  Command,
  Eye,
  Printer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    invoices,
    purchaseInvoices,
    products,
    customers,
    suppliers,
    vouchers,
    setActiveTab,
    setSelectedInvoiceForPrint,
    setSelectedVoucherForPrint,
    language,
    t,
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'INVOICES' | 'PURCHASES' | 'PRODUCTS' | 'PARTIES' | 'VOUCHERS'>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search Invoices
  const matchedInvoices = trimmed
    ? invoices.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(trimmed) ||
          i.customerName.toLowerCase().includes(trimmed) ||
          i.customerPhone.includes(trimmed) ||
          i.items.some((line) => line.productName.toLowerCase().includes(trimmed))
      ).slice(0, 5)
    : [];

  // Search Purchase Invoices
  const matchedPurchases = trimmed
    ? purchaseInvoices.filter(
        (p) =>
          p.billNumber.toLowerCase().includes(trimmed) ||
          p.supplierName.toLowerCase().includes(trimmed) ||
          p.items.some((line) => line.productName.toLowerCase().includes(trimmed))
      ).slice(0, 5)
    : [];

  // Search Products
  const matchedProducts = trimmed
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.sku.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed)
      ).slice(0, 5)
    : [];

  // Search Parties
  const matchedCustomers = trimmed
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.phone.includes(trimmed)
      ).slice(0, 4)
    : [];

  const matchedSuppliers = trimmed
    ? suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(trimmed) ||
          s.phone.includes(trimmed)
      ).slice(0, 4)
    : [];

  // Search Vouchers & Cheques
  const matchedVouchers = trimmed
    ? vouchers.filter(
        (v) =>
          v.voucherNumber.toLowerCase().includes(trimmed) ||
          v.partyName?.toLowerCase().includes(trimmed) ||
          (v.referenceNo && v.referenceNo.toLowerCase().includes(trimmed)) ||
          (v.debitAccountName && v.debitAccountName.toLowerCase().includes(trimmed)) ||
          (v.creditAccountName && v.creditAccountName.toLowerCase().includes(trimmed))
      ).slice(0, 5)
    : [];

  const totalResults =
    matchedInvoices.length +
    matchedPurchases.length +
    matchedProducts.length +
    matchedCustomers.length +
    matchedSuppliers.length +
    matchedVouchers.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-start justify-center pt-12 sm:pt-20 p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header Title with Shortcuts Info */}
        <div className="px-5 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold text-white tracking-wide">
              {language === 'ur' ? 'تمام ڈیٹا گلوبل تلاش' : 'All Data Search (Global ERP)'}
            </span>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                F5
              </span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                F4
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'ur'
                ? 'انوائس نمبر، گاہک نام، فون، سامان، واؤچر، چیک نمبر تلاش کریں... (F5 / F4)'
                : 'Search invoices, purchase bills, products, customer phone, vouchers, cheques... (F5)'
            }
            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            {language === 'ur' ? 'تمام ریکارڈز' : 'All Data'}
          </button>
          <button
            onClick={() => setActiveFilter('INVOICES')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeFilter === 'INVOICES'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            {language === 'ur' ? 'سیلز بل' : 'Sale Invoices'}
          </button>
          <button
            onClick={() => setActiveFilter('PURCHASES')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeFilter === 'PURCHASES'
                ? 'bg-orange-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            {language === 'ur' ? 'خریداری بل' : 'Purchase Bills'}
          </button>
          <button
            onClick={() => setActiveFilter('PRODUCTS')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeFilter === 'PRODUCTS'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            {language === 'ur' ? 'اسٹاک اشیاء' : 'Inventory Items'}
          </button>
          <button
            onClick={() => setActiveFilter('PARTIES')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeFilter === 'PARTIES'
                ? 'bg-purple-500 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            {language === 'ur' ? 'کسٹمرز و سپلائرز' : 'Parties (Khata)'}
          </button>
          <button
            onClick={() => setActiveFilter('VOUCHERS')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeFilter === 'VOUCHERS'
                ? 'bg-indigo-500 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            {language === 'ur' ? 'واؤچرز و چیک' : 'Vouchers & Cheques'}
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {!trimmed && (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Quick Global Search (F4)</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Type any keyword to instantly find invoices, stock items, customer ledgers, or payment vouchers across Fareed Electronics.
              </p>
            </div>
          )}

          {trimmed && totalResults === 0 && (
            <div className="py-12 text-center text-slate-500 space-y-1">
              <p className="text-sm font-semibold text-slate-300">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500">Try searching by mobile number, invoice number, or product name.</p>
            </div>
          )}

          {/* Invoices Group */}
          {(activeFilter === 'ALL' || activeFilter === 'INVOICES') && matchedInvoices.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
                <Receipt className="w-3.5 h-3.5 text-cyan-400" />
                <span>Customer Invoices ({matchedInvoices.length})</span>
              </div>
              <div className="space-y-1">
                {matchedInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/60 transition-colors group cursor-pointer"
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      setActiveTab('customer-invoices');
                      setSelectedInvoiceForPrint(inv);
                    }}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                        <span>{inv.invoiceNumber}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          inv.paymentStatus === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {inv.paymentStatus}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {inv.customerName} &bull; {inv.customerPhone} &bull; {inv.date}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <div className="text-xs font-bold text-white font-mono">
                          Rs. {inv.grandTotal.toLocaleString()}
                        </div>
                        {inv.dueBalance > 0 && (
                          <div className="text-[10px] text-rose-400">
                            Due: Rs. {inv.dueBalance.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <Eye className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchase Invoices Group */}
          {(activeFilter === 'ALL' || activeFilter === 'PURCHASES') && matchedPurchases.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
                <Receipt className="w-3.5 h-3.5 text-orange-400" />
                <span>Purchase Bills ({matchedPurchases.length})</span>
              </div>
              <div className="space-y-1">
                {matchedPurchases.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/60 transition-colors group cursor-pointer"
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      setActiveTab('purchase-invoices');
                    }}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors flex items-center gap-2">
                        <span>{bill.billNumber}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          bill.paymentStatus === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {bill.paymentStatus}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {bill.supplierName} &bull; {bill.date}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <div className="text-xs font-bold text-white font-mono">
                          Rs. {bill.grandTotal.toLocaleString()}
                        </div>
                        {bill.dueBalance > 0 && (
                          <div className="text-[10px] text-amber-400">
                            Due: Rs. {bill.dueBalance.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <Eye className="w-4 h-4 text-slate-500 group-hover:text-orange-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Group */}
          {(activeFilter === 'ALL' || activeFilter === 'PRODUCTS') && matchedProducts.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
                <Boxes className="w-3.5 h-3.5 text-blue-400" />
                <span>Inventory Products ({matchedProducts.length})</span>
              </div>
              <div className="space-y-1">
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/60 transition-colors group cursor-pointer"
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      setActiveTab('stock');
                    }}
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        SKU: {p.sku} &bull; Category: {p.category} &bull; Loc: {p.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white font-mono">
                        Rs. {p.salePrice.toLocaleString()}
                      </div>
                      <div className={`text-[10px] font-bold ${
                        p.stockQuantity <= p.minStockLevel ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        Stock: {p.stockQuantity} {p.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers & Suppliers Group */}
          {(activeFilter === 'ALL' || activeFilter === 'PARTIES') && (matchedCustomers.length > 0 || matchedSuppliers.length > 0) && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
                <Users2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Parties &amp; Contacts ({matchedCustomers.length + matchedSuppliers.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedCustomers.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/60 transition-colors group cursor-pointer"
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      setActiveTab('parties');
                    }}
                  >
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center justify-between">
                      <span>{c.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                        Customer
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{c.phone}</div>
                    <div className="text-[10px] text-slate-300 mt-1 font-mono">
                      Khata Balance: <span className={c.currentBalance > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>Rs. {c.currentBalance.toLocaleString()}</span>
                    </div>
                  </div>
                ))}

                {matchedSuppliers.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/60 transition-colors group cursor-pointer"
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      setActiveTab('parties');
                    }}
                  >
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center justify-between">
                      <span>{s.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                        Supplier
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{s.phone}</div>
                    <div className="text-[10px] text-slate-300 mt-1 font-mono">
                      Payable: <span className={s.currentBalance > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>Rs. {s.currentBalance.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vouchers & Cheques Group */}
          {(activeFilter === 'ALL' || activeFilter === 'VOUCHERS') && matchedVouchers.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Accounting Vouchers &amp; Cheques ({matchedVouchers.length})</span>
              </div>
              <div className="space-y-1">
                {matchedVouchers.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/60 transition-colors group cursor-pointer"
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      setActiveTab('vouchers');
                      setSelectedVoucherForPrint(v);
                    }}
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                        <span>{v.voucherNumber}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {v.paymentMode}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {v.partyName} &bull; {v.bankAccountName} &bull; {v.date}
                        {v.referenceNo && ` &bull; Ref: ${v.referenceNo}`}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        Rs. {v.amount.toLocaleString()}
                      </div>
                      <Eye className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Esc</kbd> to close</span>
            <span>&bull;</span>
            <span>Click any item to view details</span>
          </div>
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
