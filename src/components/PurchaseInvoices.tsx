import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  DollarSign,
  Camera,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Building,
  UserPlus,
  PackageCheck,
  ArrowRightLeft,
  Edit3,
} from 'lucide-react';
import { PurchaseInvoice, PurchaseItem } from '../types';
import { useApp } from '../context/AppContext';
import { EditPurchaseInvoiceModal } from './EditPurchaseInvoiceModal';

export const PurchaseInvoices: React.FC = () => {
  const {
    purchaseInvoices,
    products,
    suppliers,
    bankAccounts,
    createPurchaseInvoice,
    recordPurchasePayment,
    deletePurchaseInvoice,
    formatCurrency,
    setPreviewImage,
    addSupplier,
    isCreatePurchaseModalOpen,
    setIsCreatePurchaseModalOpen,
    createJournalVoucher,
    setSelectedVoucherForPrint,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PARTIAL' | 'UNPAID'>('ALL');

  // Modals
  const [paymentModalBill, setPaymentModalBill] = useState<PurchaseInvoice | null>(null);
  const [viewBillModal, setViewBillModal] = useState<PurchaseInvoice | null>(null);
  const [billToDelete, setBillToDelete] = useState<PurchaseInvoice | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseInvoice | null>(null);

  // Form state
  const [supplierId, setSupplierId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK' | 'CREDIT'>('BANK');
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || '');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [billImage, setBillImage] = useState<string>('');

  const handleCreatePurchaseJV = (bill: PurchaseInvoice) => {
    const jv = createJournalVoucher({
      date: bill.date,
      debitAccountId: 'acc-purchase',
      debitAccountName: 'Purchase Expense Account (خریداری مال)',
      creditAccountId: bill.supplierId,
      creditAccountName: `${bill.supplierName} (Supplier Khata)`,
      amount: bill.grandTotal,
      narration: `Journal Entry for Purchase Bill #${bill.billNumber} - ${bill.supplierName}`,
      voucherImage: bill.billImage || undefined,
    });
    setSelectedVoucherForPrint(jv);
  };

  // Purchase items
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      productId: '',
      productName: '',
      sku: '',
      unitCost: 0,
      quantity: 1,
      total: 0,
    },
  ]);

  // Payment Recording modal state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payBankAccountId, setPayBankAccountId] = useState(bankAccounts[0]?.id || '');
  const [paySlipImage, setPaySlipImage] = useState<string>('');
  const [payNotes, setPayNotes] = useState('');

  const grandTotal = items.reduce((acc, item) => acc + item.total, 0);
  const dueBalance = Math.max(0, grandTotal - paidAmount);

  // Select existing supplier
  const handleSupplierSelect = (id: string) => {
    setSupplierId(id);
    const found = suppliers.find((s) => s.id === id);
    if (found) {
      setSupplierName(found.name);
      setSupplierPhone(found.phone);
    }
  };

  // Add line item
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productId: '',
        productName: '',
        sku: '',
        unitCost: 0,
        quantity: 1,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof PurchaseItem,
    value: string | number
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };

      if (field === 'productId') {
        const product = products.find((p) => p.id === value);
        if (product) {
          item.productId = product.id;
          item.productName = product.name;
          item.sku = product.sku;
          item.unitCost = product.costPrice;
          item.total = product.costPrice * item.quantity;
        }
      } else if (field === 'quantity') {
        const qty = Number(value) || 1;
        item.quantity = qty;
        item.total = item.unitCost * qty;
      } else if (field === 'unitCost') {
        const cost = Number(value) || 0;
        item.unitCost = cost;
        item.total = cost * item.quantity;
      }

      updated[index] = item;
      return updated;
    });
  };

  // Handle file uploads for "own pic billing"
  const handleBillImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setBillImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPaySlipImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Purchase Bill
  const handleSubmitPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName || items.length === 0 || !items[0].productId) {
      alert('Please specify a supplier and at least one item.');
      return;
    }

    let activeSuppId = supplierId;
    if (!activeSuppId) {
      const newSupp = addSupplier({
        name: supplierName,
        phone: supplierPhone,
      });
      activeSuppId = newSupp.id;
    }

    const selectedBank = bankAccounts.find((b) => b.id === bankAccountId);
    const paymentStatus: PurchaseInvoice['paymentStatus'] =
      dueBalance <= 0 ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID';

    createPurchaseInvoice({
      supplierInvoiceNo: supplierInvoiceNo || 'N/A',
      date: billDate,
      supplierId: activeSuppId,
      supplierName,
      supplierPhone,
      items,
      grandTotal,
      paidAmount,
      dueBalance,
      paymentStatus,
      paymentMethod,
      bankAccountId: paidAmount > 0 ? bankAccountId : undefined,
      bankAccountName: paidAmount > 0 ? selectedBank?.accountName : undefined,
      notes,
      billImage: billImage || undefined,
    });

    setIsCreatePurchaseModalOpen(false);
    // Reset form
    setSupplierId('');
    setSupplierName('');
    setSupplierPhone('');
    setSupplierInvoiceNo('');
    setItems([
      {
        productId: '',
        productName: '',
        sku: '',
        unitCost: 0,
        quantity: 1,
        total: 0,
      },
    ]);
    setPaidAmount(0);
    setNotes('');
    setBillImage('');
  };

  // Keyboard shortcut: Ctrl + P for Quick Save
  useEffect(() => {
    if (!isCreatePurchaseModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleSubmitPurchase({ preventDefault: () => {} } as any);
      }
    };

    const handleQuickSaveAll = () => {
      handleSubmitPurchase({ preventDefault: () => {} } as any);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('erp-quick-save-all', handleQuickSaveAll);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('erp-quick-save-all', handleQuickSaveAll);
    };
  }, [
    isCreatePurchaseModalOpen,
    supplierId,
    supplierName,
    supplierPhone,
    supplierInvoiceNo,
    billDate,
    items,
    grandTotal,
    paidAmount,
    dueBalance,
    paymentMethod,
    bankAccountId,
    notes,
    billImage,
  ]);

  // Submit Payment Settlement
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBill || payAmount <= 0) return;

    recordPurchasePayment(
      paymentModalBill.id,
      payAmount,
      payBankAccountId,
      payNotes,
      paySlipImage
    );

    setPaymentModalBill(null);
    setPayAmount(0);
    setPayNotes('');
    setPaySlipImage('');
  };

  // Filter bills
  const filteredBills = purchaseInvoices.filter((bill) => {
    const matchesSearch =
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.supplierInvoiceNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || bill.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Supplier Purchase Bills &amp; Inward Invoices</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Log vendor consignments, replenish inventory stock, and track accounts payable with invoice slip photos.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreatePurchaseModalOpen(true);
            setPaidAmount(0);
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Bill</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950/40 border border-slate-950/30 font-mono text-[10px] font-bold">
            F3
          </kbd>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Bill # (e.g. FE-PUR), supplier name, or vendor invoice ref..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {(['ALL', 'PAID', 'PARTIAL', 'UNPAID'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Purchases' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Bills Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Bill # &amp; Date</th>
                <th className="py-3 px-3">Supplier Name &amp; Ref</th>
                <th className="py-3 px-3">Parts Received</th>
                <th className="py-3 px-3 text-right">Bill Total</th>
                <th className="py-3 px-3 text-right">Paid / Balance</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Bill Photo</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No purchase bills found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-amber-400 text-xs">
                        {bill.billNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{bill.date}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-xs">{bill.supplierName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Ref: <span className="font-mono">{bill.supplierInvoiceNo}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      <span className="font-semibold text-white">
                        {bill.items.length} component(s)
                      </span>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {bill.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-black text-white text-xs">
                      {formatCurrency(bill.grandTotal)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[11px]">
                      <div className="text-emerald-400 font-semibold">
                        Paid: {formatCurrency(bill.paidAmount)}
                      </div>
                      {bill.dueBalance > 0 && (
                        <div className="text-amber-400 font-bold">
                          Payable: {formatCurrency(bill.dueBalance)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          bill.paymentStatus === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : bill.paymentStatus === 'PARTIAL'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {bill.paymentStatus}
                      </span>
                    </td>

                    {/* Own Pic Billing attachment column */}
                    <td className="py-3 px-3 text-center">
                      {bill.billImage ? (
                        <button
                          onClick={() => setPreviewImage(bill.billImage || null)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] font-semibold hover:bg-amber-900/60 cursor-pointer"
                          title="View attached supplier bill picture"
                        >
                          <Camera className="w-3 h-3 text-amber-400" />
                          <span>Photo</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">None</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {bill.dueBalance > 0 && (
                          <button
                            onClick={() => {
                              setPaymentModalBill(bill);
                              setPayAmount(bill.dueBalance);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
                            title="Pay Supplier Balance"
                          >
                            + Pay
                          </button>
                        )}

                        {/* Journal Entry (JV) button for purchase bill */}
                        <button
                          onClick={() => handleCreatePurchaseJV(bill)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Generate Journal Entry (JV جنرل واؤچر انٹری بنائیں)"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setViewBillModal(bill)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="View Bill Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditingPurchase(bill)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Purchase Invoice (ترمیم پرچیز بل)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setBillToDelete(bill)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer group"
                          title="Delete Purchase Invoice / Bill"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
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

      {/* CREATE PURCHASE MODAL */}
      {isCreatePurchaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl p-5 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span className="text-white font-bold text-base">Create Inward Supplier Purchase Bill</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                  F3
                </span>
              </div>
              <button
                onClick={() => setIsCreatePurchaseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPurchase} className="space-y-4 text-xs">
              {/* Supplier Info */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-slate-300 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vendor / Supplier Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Choose Saved Supplier (Optional)
                    </label>
                    <select
                      value={supplierId}
                      onChange={(e) => handleSupplierSelect(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="">-- Or Enter New Below --</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Supplier Company Name *</label>
                    <input
                      type="text"
                      required
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      placeholder="e.g. Shenzhen Apex Micro Ltd"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Vendor Invoice # / Ref</label>
                    <input
                      type="text"
                      value={supplierInvoiceNo}
                      onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                      placeholder="e.g. INV-8891-SZ"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Supplier Phone</label>
                    <input
                      type="text"
                      value={supplierPhone}
                      onChange={(e) => setSupplierPhone(e.target.value)}
                      placeholder="+86 / +92 ..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Receiving Date</label>
                    <input
                      type="date"
                      value={billDate}
                      onChange={(e) => setBillDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-slate-300 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inward Inventory Items (Auto Updates Stock)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 cursor-pointer"
                  >
                    + Add Item Line
                  </button>
                </div>

                <div className="space-y-2.5">
                  {items.map((line, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 items-end"
                    >
                      <div className="sm:col-span-5">
                        <label className="block text-slate-400 text-[10px] mb-1">
                          Product Component to Restock *
                        </label>
                        <select
                          required
                          value={line.productId}
                          onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-amber-500 focus:outline-none"
                        >
                          <option value="">-- Choose Stock Component --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku}) [Current: {p.stockQuantity} {p.unit}]
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-400 text-[10px] mb-1">Qty Inward</label>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-400 text-[10px] mb-1">Unit Cost Price</label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={line.unitCost}
                          onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3 flex items-center justify-between gap-1">
                        <div className="text-right flex-1">
                          <span className="block text-slate-400 text-[10px]">Total Cost</span>
                          <span className="font-mono font-bold text-white text-xs">
                            {formatCurrency(line.total)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={items.length <= 1}
                          className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-30 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Own Pic Billing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="space-y-3">
                  <div className="text-slate-300 font-bold text-xs uppercase tracking-wide">
                    Payment Details
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as PurchaseInvoice['paymentMethod'])
                        }
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                      >
                        <option value="BANK">Bank Wire / IBFT</option>
                        <option value="CASH">Cash Drawer</option>
                        <option value="CREDIT">Supplier Credit (Pay Later)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Paid From Account</label>
                      <select
                        value={bankAccountId}
                        onChange={(e) => setBankAccountId(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                      >
                        {bankAccounts.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.accountName} ({formatCurrency(b.currentBalance)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Amount Paid Now</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Bill Notes / Cargo Details</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Air freight consignment, customs clearance verified..."
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Own Pic Billing: Vendor invoice photo upload */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="text-slate-300 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 mb-2">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>Own Pic Billing: Attach Supplier Bill / Cargo Slip</span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-center">
                      {billImage ? (
                        <div className="relative group w-full">
                          <img
                            src={billImage}
                            alt="Bill preview"
                            className="max-h-24 mx-auto rounded-lg border border-slate-700 object-contain shadow"
                          />
                          <button
                            type="button"
                            onClick={() => setBillImage('')}
                            className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <label className="cursor-pointer flex flex-col items-center">
                            <FileText className="w-6 h-6 text-amber-400 mb-1" />
                            <span className="text-slate-300 font-semibold text-xs">
                              Upload Supplier Physical Bill or Slip
                            </span>
                            <span className="text-slate-500 text-[10px] mt-0.5">
                              Document or photo file from storage
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBillImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-white font-bold text-sm">
                      <span>Total Purchase Cost:</span>
                      <span className="font-mono text-amber-400">{formatCurrency(grandTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-400">
                      <span>Paid Now:</span>
                      <span className="font-mono">{formatCurrency(paidAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Accounts Payable Due:</span>
                      <span
                        className={`font-mono font-bold ${
                          dueBalance > 0 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {formatCurrency(dueBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 flex-wrap gap-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                  <span>Quick Save:</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[10px]">
                    Ctrl + P
                  </kbd>
                  <span className="text-slate-500">or Ctrl+S</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatePurchaseModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                  >
                    Cancel (Esc)
                  </button>
                  <button
                    id="btn-save-purchase"
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
                    title="Ctrl + P: Quick Save Purchase Bill"
                  >
                    <span>Save Bill &amp; Add Stock</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-950/40 text-[10px] font-mono">
                      Ctrl+P
                    </kbd>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT TO SUPPLIER MODAL */}
      {paymentModalBill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>Pay Supplier Bill</span>
              </div>
              <button
                onClick={() => setPaymentModalBill(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">
                Purchase Bill: <span className="font-mono text-amber-400 font-bold">{paymentModalBill.billNumber}</span>
              </div>
              <div className="text-white font-bold">{paymentModalBill.supplierName}</div>
              <div className="text-amber-400 font-mono font-bold text-sm">
                Remaining Balance Payable: {formatCurrency(paymentModalBill.dueBalance)}
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Amount Paid to Supplier *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={paymentModalBill.dueBalance}
                  step="any"
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-base font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Deduct from Bank / Cash Account
                </label>
                <select
                  value={payBankAccountId}
                  onChange={(e) => setPayBankAccountId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.accountName} ({formatCurrency(b.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pic attachment */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Attach Transfer Slip / Bank Voucher Photo ("Own Pic")
                </label>
                <div className="p-2.5 bg-slate-950 border border-dashed border-slate-700 rounded-xl flex items-center justify-between">
                  <label className="cursor-pointer flex items-center gap-2 text-amber-400 font-medium text-xs">
                    <Camera className="w-4 h-4" />
                    <span>Upload Bank Slip</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePayImageUpload}
                      className="hidden"
                    />
                  </label>
                  {paySlipImage && (
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      Slip attached ✓
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Payment Reference / Note</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Cleared via Meezan IBFT #TX99120"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentModalBill(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md cursor-pointer"
                >
                  Release Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PURCHASE BILL DETAILS MODAL */}
      {viewBillModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-white font-bold text-base flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <span>Purchase Bill: {viewBillModal.billNumber}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Vendor Invoice Ref: <span className="font-mono text-cyan-400">{viewBillModal.supplierInvoiceNo}</span>
                </div>
              </div>
              <button
                onClick={() => setViewBillModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400">Supplier:</span>
                <div className="font-bold text-white">{viewBillModal.supplierName}</div>
                <div className="text-slate-500">{viewBillModal.supplierPhone}</div>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Date Received:</span>
                <div className="font-semibold text-white">{viewBillModal.date}</div>
                <div className="text-amber-400 uppercase font-bold text-[11px]">
                  {viewBillModal.paymentStatus}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/60">
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Cost</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {viewBillModal.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-semibold text-white">{item.productName}</td>
                      <td className="py-2 px-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatCurrency(item.unitCost)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-white">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-xs p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                {viewBillModal.billImage && (
                  <button
                    onClick={() => {
                      setPreviewImage(viewBillModal.billImage || null);
                      setViewBillModal(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>View Attached Bill Photo</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const toDelete = viewBillModal;
                    setViewBillModal(null);
                    setBillToDelete(toDelete);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete Bill</span>
                </button>
              </div>

              <div className="text-right space-y-0.5">
                <div>Total: <span className="font-mono font-bold text-white">{formatCurrency(viewBillModal.grandTotal)}</span></div>
                <div className="text-emerald-400">Paid: <span className="font-mono">{formatCurrency(viewBillModal.paidAmount)}</span></div>
                {viewBillModal.dueBalance > 0 && (
                  <div className="text-amber-400 font-bold">Due: <span className="font-mono">{formatCurrency(viewBillModal.dueBalance)}</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE PURCHASE BILL CONFIRMATION MODAL */}
      {billToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Purchase Bill / Voucher?</h3>
                <p className="text-xs text-rose-400 font-mono font-semibold">
                  {billToDelete.billNumber}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Supplier:</span>
                  <span className="font-bold text-white">{billToDelete.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vendor Invoice Ref:</span>
                  <span className="font-mono text-cyan-400">{billToDelete.supplierInvoiceNo || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bill Date:</span>
                  <span className="font-mono text-slate-300">{billToDelete.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Grand Total:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(billToDelete.grandTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Items Count:</span>
                  <span className="text-amber-400 font-semibold">
                    {billToDelete.items.length} line items
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Automatic Inward Stock &amp; Payable Reversal</span>
                </div>
                <p className="text-amber-300/80 leading-relaxed">
                  Deleting will subtract inward quantities for all received items from inventory stock and reduce{' '}
                  <b className="text-amber-200">{formatCurrency(billToDelete.dueBalance)}</b> from the supplier's payable ledger balance.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setBillToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePurchaseInvoice(billToDelete.id);
                  setBillToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Purchase Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PURCHASE INVOICE MODAL (User Requirement) */}
      {editingPurchase && (
        <EditPurchaseInvoiceModal
          purchase={editingPurchase}
          onClose={() => setEditingPurchase(null)}
        />
      )}
    </div>
  );
};
