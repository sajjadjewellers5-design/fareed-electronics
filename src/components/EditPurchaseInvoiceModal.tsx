import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Edit3,
  Camera,
  CheckCircle2,
  Truck,
  Landmark,
  Building,
  Phone,
  Tag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PurchaseInvoice, PurchaseItem } from '../types';
import { WebcamCaptureModal } from './WebcamCaptureModal';

interface EditPurchaseInvoiceModalProps {
  purchase: PurchaseInvoice | null;
  onClose: () => void;
}

export const EditPurchaseInvoiceModal: React.FC<EditPurchaseInvoiceModalProps> = ({
  purchase,
  onClose,
}) => {
  const {
    products,
    suppliers,
    bankAccounts,
    updatePurchaseInvoice,
    formatCurrency,
  } = useApp();

  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState('');
  const [date, setDate] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK' | 'CREDIT'>('CASH');
  const [bankAccountId, setBankAccountId] = useState('');
  const [notes, setNotes] = useState('');
  const [billImage, setBillImage] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (purchase) {
      setItems([...purchase.items]);
      setSupplierId(purchase.supplierId || '');
      setSupplierInvoiceNo(purchase.supplierInvoiceNo || '');
      setDate(purchase.date || '');
      setPaidAmount(purchase.paidAmount || 0);
      setPaymentMethod(purchase.paymentMethod || 'CASH');
      setBankAccountId(purchase.bankAccountId || '');
      setNotes(purchase.notes || '');
      setBillImage(purchase.billImage || '');
    }
  }, [purchase]);

  if (!purchase) return null;

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);

  // Recalculate totals
  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);
  const dueBalance = Math.max(0, grandTotal - paidAmount);

  const handleAddItem = () => {
    if (!selectedProductId) return;
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const existingIndex = items.findIndex((i) => i.productId === prod.id);
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total =
        updated[existingIndex].quantity * updated[existingIndex].unitCost;
      setItems(updated);
    } else {
      const newItem: PurchaseItem = {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        unitCost: prod.costPrice,
        quantity: 1,
        total: prod.costPrice,
      };
      setItems([...items, newItem]);
    }
    setSelectedProductId('');
  };

  const handleUpdateItem = (
    index: number,
    field: keyof PurchaseItem,
    value: number | string
  ) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitCost') {
      const qty = Number(current.quantity) || 1;
      const cost = Number(current.unitCost) || 0;
      current.total = Math.max(0, qty * cost);
    }
    updated[index] = current;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one item to the purchase invoice.');
      return;
    }

    const paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID' =
      dueBalance === 0 ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID';

    const selectedBank = bankAccounts.find((b) => b.id === bankAccountId);

    updatePurchaseInvoice(purchase.id, {
      supplierId: supplierId || purchase.supplierId,
      supplierName: selectedSupplier?.name || purchase.supplierName,
      supplierPhone: selectedSupplier?.phone || purchase.supplierPhone,
      supplierInvoiceNo,
      date,
      items,
      grandTotal,
      paidAmount,
      dueBalance,
      paymentStatus,
      paymentMethod,
      bankAccountId: bankAccountId || undefined,
      bankAccountName: selectedBank ? `${selectedBank.accountName} (${selectedBank.bankName})` : undefined,
      notes,
      billImage: billImage || undefined,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/90 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Edit Purchase Invoice</h2>
                <span className="font-mono text-amber-300 font-bold px-2 py-0.5 rounded-md bg-amber-950 border border-amber-500/30 text-xs">
                  {purchase.billNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Original purchase bill number preserved. Modifying vendor items, costs, and settled payments.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-5 text-xs text-slate-300">
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Purchase Invoice {purchase.billNumber} updated successfully!</span>
            </div>
          )}

          {/* Supplier & Date Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Supplier / Vendor</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold focus:border-amber-500 focus:outline-none"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.phone})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Vendor Bill / Inv #</label>
              <input
                type="text"
                value={supplierInvoiceNo}
                onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                placeholder="Vendor external bill #"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Purchase Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Purchased Stock Items &amp; Cost Rates</span>
              </h3>

              <div className="flex items-center gap-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Add Product to Bill --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - Cost: {formatCurrency(p.costPrice)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedProductId}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                    <th className="py-2.5 px-3">Item / Description</th>
                    <th className="py-2.5 px-3 w-20">Qty</th>
                    <th className="py-2.5 px-3 w-28">Cost Rate (PKR)</th>
                    <th className="py-2.5 px-3 text-right">Line Total</th>
                    <th className="py-2.5 px-3 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-white">{item.productName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.sku}</div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min={0}
                          value={item.unitCost}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'unitCost', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-white font-mono"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Summary & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: Physical Bill Picture via Webcam */}
            <div className="space-y-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Own Pic Billing: Vendor Slip Photo</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Capture live photo of the supplier invoice leaf or delivery note using computer webcam
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsWebcamOpen(true)}
                  className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Use Computer Web Cam</span>
                </button>
                {billImage && (
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Vendor Slip Attached</span>
                  </span>
                )}
              </div>
            </div>

            {/* Right: Calculations */}
            <div className="space-y-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-emerald-400" />
                <span>Totals &amp; Settlement</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-sm font-black border-b border-slate-800 pb-2 text-white">
                  <span>Grand Total:</span>
                  <span className="font-mono text-amber-300">{formatCurrency(grandTotal)}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-emerald-400 font-semibold">Amount Paid:</span>
                  <input
                    type="number"
                    min={0}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                    className="w-32 px-2 py-1 bg-slate-900 border border-emerald-500/50 rounded text-right font-mono text-emerald-300 font-bold"
                  />
                </div>

                <div className="flex justify-between text-sm font-black text-rose-400 border-t border-slate-800 pt-2">
                  <span>Balance Due:</span>
                  <span className="font-mono">{formatCurrency(dueBalance)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Cancel (Esc)
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes to Purchase</span>
            </button>
          </div>
        </form>

        {/* Webcam Capture Modal */}
        {isWebcamOpen && (
          <WebcamCaptureModal
            isOpen={isWebcamOpen}
            onClose={() => setIsWebcamOpen(false)}
            onCapture={(img) => {
              setBillImage(img);
              setIsWebcamOpen(false);
            }}
            title="Snap Vendor Slip via Computer Web Cam"
          />
        )}
      </div>
    </div>
  );
};
