import React, { useState, useEffect } from 'react';
import {
  X,
  Undo2,
  Receipt,
  Truck,
  User,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Printer,
  Search,
  Plus,
  RefreshCw,
  Wallet,
  Landmark,
  PackageCheck,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SaleReturnInvoice, SaleReturnItem } from '../types';
import { LogoWatermark } from './BrandLogo';

export const SaleReturnModal: React.FC = () => {
  const {
    isSaleReturnModalOpen,
    setIsSaleReturnModalOpen,
    saleReturnInvoices,
    createSaleReturnInvoice,
    deleteSaleReturnInvoice,
    getNextSaleReturnNumber,
    selectedSaleReturnForPrint,
    setSelectedSaleReturnForPrint,
    companyProfile,
    customers,
    invoices,
    products,
    bankAccounts,
    formatCurrency,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [returnNumber, setReturnNumber] = useState('');
  const [returnDate, setReturnDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Customer selection
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Linked previous invoice
  const [linkedOriginalInvoiceId, setLinkedOriginalInvoiceId] = useState('');
  const [linkedOriginalInvoiceNumber, setLinkedOriginalInvoiceNumber] = useState('');

  // Bilty / Transport
  const [biltyNumber, setBiltyNumber] = useState('');
  const [transportName, setTransportName] = useState('Daewoo Cargo Express');
  const [destinationStation, setDestinationStation] = useState('');

  // Items
  const [items, setItems] = useState<SaleReturnItem[]>([
    {
      productId: '',
      productName: '',
      sku: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      returnReason: 'Customer Checking Warranty Claim',
      condition: 'RESTOCKABLE',
    },
  ]);

  // Settlement
  const [refundMethod, setRefundMethod] = useState<'CASH_REFUND' | 'BANK_REFUND' | 'CREDIT_KHATA'>('CREDIT_KHATA');
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || '');
  const [notes, setNotes] = useState('');

  // UI state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [listSearch, setListSearch] = useState('');

  // Sync return number when modal opens
  useEffect(() => {
    if (isSaleReturnModalOpen) {
      setReturnNumber(getNextSaleReturnNumber());
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [isSaleReturnModalOpen]);

  if (!isSaleReturnModalOpen) return null;

  // Invoices for the chosen customer
  const customerPreviousInvoices = invoices.filter(
    (inv) =>
      (customerId && inv.customerId === customerId) ||
      (customerName && inv.customerName.toLowerCase() === customerName.toLowerCase()) ||
      (customerPhone && inv.customerPhone === customerPhone)
  );

  const handleCustomerSelect = (id: string) => {
    setCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
    } else {
      setCustomerName('');
      setCustomerPhone('');
    }
    setLinkedOriginalInvoiceId('');
    setLinkedOriginalInvoiceNumber('');
  };

  const handleSelectOriginalInvoice = (invId: string) => {
    setLinkedOriginalInvoiceId(invId);
    const foundInv = invoices.find((i) => i.id === invId);
    if (foundInv) {
      setLinkedOriginalInvoiceNumber(foundInv.invoiceNumber);
      if (foundInv.biltyNumber && !biltyNumber) {
        setBiltyNumber(foundInv.biltyNumber);
      }
      if (foundInv.transportName && !transportName) {
        setTransportName(foundInv.transportName);
      }
      // Populate line items from the original invoice
      if (foundInv.items && foundInv.items.length > 0) {
        const mappedItems: SaleReturnItem[] = foundInv.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          returnReason: 'Return from Invoice #' + foundInv.invoiceNumber,
          condition: 'RESTOCKABLE',
          tagNo: item.tagNo,
        }));
        setItems(mappedItems);
      }
    } else {
      setLinkedOriginalInvoiceNumber('');
    }
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productId: '',
        productName: '',
        sku: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        returnReason: 'Return & Exchange',
        condition: 'RESTOCKABLE',
      },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleItemProductSelect = (idx: number, prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const unitPrice = prod ? prod.salePrice : 0;
        return {
          ...item,
          productId: prodId,
          productName: prod ? prod.name : '',
          sku: prod ? prod.sku : '',
          unitPrice,
          tagNo: prod?.tagNo,
          total: (item.quantity || 1) * unitPrice,
        };
      })
    );
  };

  const handleItemQtyChange = (idx: number, qty: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const validQty = Math.max(1, qty);
        return {
          ...item,
          quantity: validQty,
          total: validQty * item.unitPrice,
        };
      })
    );
  };

  const handleItemPriceChange = (idx: number, price: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const validPrice = Math.max(0, price);
        return {
          ...item,
          unitPrice: validPrice,
          total: (item.quantity || 1) * validPrice,
        };
      })
    );
  };

  const handleItemReasonChange = (idx: number, reason: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, returnReason: reason } : item))
    );
  };

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const grandTotal = subtotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please select or specify customer name (کسٹمر کا نام درج کریں).');
      return;
    }

    const validItems = items.filter((item) => item.productId && (item.quantity || 0) > 0);
    if (validItems.length === 0) {
      setErrorMessage('Please add at least one valid item to return (کم از کم ایک پروڈکٹ منتخب کریں).');
      return;
    }

    const chosenBank = bankAccounts.find((b) => b.id === bankAccountId);

    const createdReturn = createSaleReturnInvoice({
      returnNumber: returnNumber || getNextSaleReturnNumber(),
      date: returnDate,
      customerId: customerId || 'cust-return-cash',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      originalInvoiceId: linkedOriginalInvoiceId || undefined,
      originalInvoiceNumber: linkedOriginalInvoiceNumber || undefined,
      biltyNumber: biltyNumber.trim() || undefined,
      transportName: biltyNumber.trim() ? transportName : undefined,
      destinationStation: destinationStation.trim() || undefined,
      items: validItems,
      subtotal,
      grandTotal,
      refundMethod,
      bankAccountId: refundMethod === 'BANK_REFUND' ? bankAccountId : undefined,
      bankAccountName: refundMethod === 'BANK_REFUND' ? chosenBank?.accountName : undefined,
      notes: notes.trim() || undefined,
    });

    const savedReturnNumber = createdReturn.returnNumber;
    const nextReturnNumber = getNextSaleReturnNumber();

    setSuccessMessage(
      `Sale Return #${savedReturnNumber} saved successfully! Restocked into inventory. Next return #${nextReturnNumber} is automatically ready.`
    );

    // "WEN SAVE ANY IVOICE/VOCHER AUTOMIATICLY OPEN FOR NEW INVOICE/VOCHER":
    // Reset inputs but KEEP MODAL OPEN with the next return number ready!
    setReturnNumber(nextReturnNumber);
    setLinkedOriginalInvoiceId('');
    setLinkedOriginalInvoiceNumber('');
    setItems([
      {
        productId: '',
        productName: '',
        sku: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        returnReason: 'Return & Exchange',
        condition: 'RESTOCKABLE',
      },
    ]);
    setNotes('');
  };

  const filteredList = saleReturnInvoices.filter((sr) => {
    const q = listSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      sr.returnNumber.toLowerCase().includes(q) ||
      sr.customerName.toLowerCase().includes(q) ||
      (sr.customerPhone && sr.customerPhone.includes(q)) ||
      (sr.biltyNumber && sr.biltyNumber.toLowerCase().includes(q)) ||
      (sr.originalInvoiceNumber && sr.originalInvoiceNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Undo2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Sale Return Invoice (سیلز واپسی انوائس)</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  {returnNumber || 'NEW'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Process customer goods returns, link with previous sales invoices &amp; auto-restock items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                + Create Return
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'list'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Returns History</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
                  {saleReturnInvoices.length}
                </span>
              </button>
            </div>

            <button
              onClick={() => setIsSaleReturnModalOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success / Error Banners */}
        {successMessage && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-500/15 border-b border-rose-500/30 px-5 py-2.5 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'create' ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Section 1: Customer Details & Link to Previous Invoices */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Customer &amp; Linked Previous Sales Invoice (کسٹمر اور سابقہ انوائس)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Select Customer (کسٹمر منتخب کریں)
                    </label>
                    <select
                      value={customerId}
                      onChange={(e) => handleCustomerSelect(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="">-- Choose Customer or Enter Below --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone}) - Bal: {formatCurrency(c.currentBalance)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Customer Name * (نام)
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Asad Tech Lab"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Phone Number (فون نمبر)
                    </label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* LINK TO CUSTOMER'S PREVIOUS INVOICES (USER EXPLICIT REQUIREMENT) */}
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-rose-300 font-bold">
                      <Receipt className="w-3.5 h-3.5 text-rose-400" />
                      <span>Link to Customer Previous Invoices (سابقہ سیلز انوائس سے جوڑیں):</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {customerPreviousInvoices.length} invoices found for customer
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={linkedOriginalInvoiceId}
                      onChange={(e) => handleSelectOriginalInvoice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 font-mono text-xs"
                    >
                      <option value="">-- No Linked Invoice / Direct Return --</option>
                      {customerPreviousInvoices.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          #{inv.invoiceNumber} • {inv.date} • Total: {formatCurrency(inv.grandTotal)}{' '}
                          {inv.biltyNumber ? `[Bilty: ${inv.biltyNumber}]` : ''}
                        </option>
                      ))}
                    </select>

                    {linkedOriginalInvoiceNumber ? (
                      <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
                        <span>
                          Linked to: <b>{linkedOriginalInvoiceNumber}</b>
                        </span>
                        <span className="text-[10px] text-emerald-400">✓ Items auto-loaded</span>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-slate-900 text-slate-500 text-[11px] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Select a customer above to see all previous invoices</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Bilty No & Transport Option (USER EXPLICIT REQUIREMENT) */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Bilty &amp; Transport Cargo Return Details (بلٹی و کارگو تفصیلات)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Bilty No (بلٹی نمبر)
                    </label>
                    <input
                      type="text"
                      value={biltyNumber}
                      onChange={(e) => setBiltyNumber(e.target.value)}
                      placeholder="e.g. BLT-98214"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Transport / Courier (ٹرانسپورٹ کمپنی)
                    </label>
                    <input
                      type="text"
                      value={transportName}
                      onChange={(e) => setTransportName(e.target.value)}
                      placeholder="e.g. Daewoo Cargo, Faisal Movers"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Return Date (تاریخ واپسی)
                    </label>
                    <input
                      type="date"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Return Items Table */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Return Items &amp; Inventory Restock (واپسی اشیاء)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 cursor-pointer"
                  >
                    + Add Item Line
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((line, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 items-end"
                    >
                      <div className="sm:col-span-4">
                        <label className="block text-slate-400 text-[10px] mb-1">
                          Product Component *
                        </label>
                        <select
                          required
                          value={line.productId}
                          onChange={(e) => handleItemProductSelect(idx, e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-rose-500 focus:outline-none"
                        >
                          <option value="">-- Select Product --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku}) [In Stock: {p.stockQuantity}]
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-slate-400 text-[10px] mb-1">
                          Return Reason (وجہ واپسی)
                        </label>
                        <input
                          type="text"
                          value={line.returnReason}
                          onChange={(e) => handleItemReasonChange(idx, e.target.value)}
                          placeholder="e.g. Warranty claim, wrong model"
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-rose-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-slate-400 text-[10px] mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => handleItemQtyChange(idx, Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-400 text-[10px] mb-1">Unit Rate</label>
                        <input
                          type="number"
                          min="0"
                          value={line.unitPrice}
                          onChange={(e) => handleItemPriceChange(idx, Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-between gap-1">
                        <div className="text-right flex-1">
                          <span className="block text-slate-400 text-[10px]">Total</span>
                          <span className="font-mono font-bold text-white text-xs">
                            {formatCurrency(line.total || 0)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={items.length <= 1}
                          className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-30 rounded cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Settlement / Refund & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Refund &amp; Settlement Method (ادائیگی / ایڈجسٹمنٹ)</span>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Settlement Mode
                    </label>
                    <select
                      value={refundMethod}
                      onChange={(e) =>
                        setRefundMethod(e.target.value as typeof refundMethod)
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="CREDIT_KHATA">
                        Adjust in Customer Balance / کھاتے میں ایڈجسٹ (Credit Balance)
                      </option>
                      <option value="CASH_REFUND">
                        Cash Counter Refund / کاؤنٹر سے نقد واپسی
                      </option>
                      <option value="BANK_REFUND">
                        Bank Wire / IBFT Refund / بینک سے آن لائن واپسی
                      </option>
                    </select>
                  </div>

                  {refundMethod === 'BANK_REFUND' && (
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">
                        Deduct from Bank Account
                      </label>
                      <select
                        value={bankAccountId}
                        onChange={(e) => setBankAccountId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      >
                        {bankAccounts.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.accountName} ({formatCurrency(b.currentBalance)})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Remarks / Notes (نوٹس)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Restocked in Good Condition, tested by tech"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Grand Total Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Items Returned:</span>
                      <span className="font-mono font-bold text-white">
                        {items.reduce((s, i) => s + (i.quantity || 0), 0)} pcs
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Return Subtotal:</span>
                      <span className="font-mono font-bold text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 border-t border-slate-800 pt-2">
                      <span className="text-white font-bold">Total Return Amount:</span>
                      <span className="text-xl font-mono font-black text-rose-400">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSaleReturnModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                    >
                      Cancel (Esc)
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black shadow-lg shadow-rose-600/30 cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save &amp; Open Next (محفوظ کریں اور اگلا کھولیں)</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* Tab: History List */
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={listSearch}
                    onChange={(e) => setListSearch(e.target.value)}
                    placeholder="Search by Return #, customer name, phone, or bilty #..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {filteredList.length} Return Records
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[11px] font-semibold uppercase">
                        <th className="py-2.5 px-3">Return # &amp; Date</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Linked Invoice</th>
                        <th className="py-2.5 px-3">Bilty No</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-center">Settlement</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                            No sale return invoices found.
                          </td>
                        </tr>
                      ) : (
                        filteredList.map((sr) => (
                          <tr key={sr.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-2.5 px-3 font-mono">
                              <span className="font-bold text-rose-400">{sr.returnNumber}</span>
                              <div className="text-[10px] text-slate-500">{sr.date}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-white">{sr.customerName}</div>
                              <div className="text-[10px] text-slate-400">{sr.customerPhone}</div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-cyan-300 text-[11px]">
                              {sr.originalInvoiceNumber || '—'}
                            </td>
                            <td className="py-2.5 px-3">
                              {sr.biltyNumber ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[10px] text-cyan-300 font-mono font-semibold">
                                  <Truck className="w-3 h-3 text-cyan-400" />
                                  <span>{sr.biltyNumber}</span>
                                </span>
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-300">
                              {formatCurrency(sr.grandTotal)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                                {sr.refundMethod === 'CREDIT_KHATA' || (sr.refundMethod as string) === 'KHATA_CREDIT'
                                  ? 'Khata Adjust'
                                  : sr.refundMethod === 'CASH_REFUND' || (sr.refundMethod as string) === 'CASH'
                                  ? 'Cash Paid'
                                  : 'Bank IBFT'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedSaleReturnForPrint(sr)}
                                  className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                  title="Print Return Invoice (پرنٹ کریں)"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Delete Sale Return "${sr.returnNumber}"? Stock and customer balance will be safely reversed.`
                                      )
                                    ) {
                                      deleteSaleReturnInvoice(sr.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                  title="Delete Sale Return (حذف کریں)"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Sale Return Document Modal with Logo Watermark */}
      {selectedSaleReturnForPrint && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:m-0 print:bg-white print:static print:overflow-visible">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col my-6 max-h-[92vh] print:max-h-none print:h-auto print:my-0 print:border-none print:shadow-none print:bg-white print:w-full print:max-w-full print:rounded-none">
            <div className="no-print flex items-center justify-between px-5 py-3.5 bg-slate-800 border-b border-slate-700 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Undo2 className="w-4 h-4 text-rose-400" />
                <span className="text-white font-bold text-sm">Sale Return Invoice Print Preview</span>
                <span className="font-mono text-xs text-rose-300">[{selectedSaleReturnForPrint.returnNumber}]</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Normal Print (پرنٹ کریں)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSaleReturnForPrint(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950/70 print:p-0 print:bg-white print:overflow-visible print:block">
              <div
                id="printable-sale-return"
                className="print-area bg-white text-slate-900 w-full max-w-xl p-8 rounded-xl shadow-xl border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-full print:rounded-none relative overflow-hidden print:transform-none"
                style={{ minHeight: '600px', color: '#0f172a' }}
              >
                {/* Logo Watermark on Printed Sale Return */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] overflow-hidden -z-0">
                  <LogoWatermark
                    customLogoUrl={companyProfile.logoUrl}
                    className="scale-[2.2] text-slate-900"
                  />
                </div>

                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h2 className="text-lg font-black uppercase text-slate-950">{companyProfile.name}</h2>
                    <p className="text-xs text-slate-600">{companyProfile.subtitle}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{companyProfile.address}</p>
                    <p className="text-[11px] font-mono text-slate-500">Ph: {companyProfile.phone} · NTN: {companyProfile.ntn}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-rose-700 text-white text-xs font-black rounded uppercase">
                      SALE RETURN CREDIT NOTE
                    </span>
                    <div className="font-mono font-black text-slate-900 text-sm mt-1.5">
                      {selectedSaleReturnForPrint.returnNumber}
                    </div>
                    <div className="text-xs text-slate-600">Date: {selectedSaleReturnForPrint.date}</div>
                    {selectedSaleReturnForPrint.biltyNumber && (
                      <div className="text-[11px] font-mono text-cyan-800 font-bold mt-0.5">
                        Bilty #: {selectedSaleReturnForPrint.biltyNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">Customer:</span>
                      <div className="font-bold text-slate-900 text-sm">{selectedSaleReturnForPrint.customerName}</div>
                      {selectedSaleReturnForPrint.customerPhone && (
                        <div className="text-slate-600">{selectedSaleReturnForPrint.customerPhone}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Original Invoice:</span>
                      <div className="font-mono font-bold text-slate-900">
                        {selectedSaleReturnForPrint.originalInvoiceNumber || 'Direct Walk-in Return'}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Refund Method: <b>{selectedSaleReturnForPrint.refundMethod}</b>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-xs border border-slate-300 rounded-lg overflow-hidden my-3">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2 px-3 text-left">#</th>
                      <th className="py-2 px-3 text-left">Item Description</th>
                      <th className="py-2 px-3 text-center">Return Qty</th>
                      <th className="py-2 px-3 text-right">Unit Rate</th>
                      <th className="py-2 px-3 text-right">Total Refund</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedSaleReturnForPrint.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {item.productName}
                          <div className="text-[10px] font-mono text-slate-500">{item.sku}</div>
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-rose-700">
                          {item.returnQuantity}
                        </td>
                        <td className="py-2 px-3 text-right font-mono">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(item.totalRefund || item.total || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Grand Total */}
                <div className="flex justify-between items-center border-t-2 border-slate-900 pt-3 mt-4 text-xs font-black">
                  <span className="text-slate-700 uppercase">Total Credited / Refunded:</span>
                  <span className="text-base font-mono text-rose-700">
                    {formatCurrency(selectedSaleReturnForPrint.grandTotal)}
                  </span>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 mt-12 pt-6 text-center text-xs">
                  <div className="border-t border-slate-400 pt-1 text-slate-600">Customer Signature</div>
                  <div className="border-t border-slate-900 pt-1 font-bold text-slate-900">
                    Authorized Store Stamp / Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
