import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Edit3,
  Camera,
  CheckCircle2,
  AlertCircle,
  Truck,
  Landmark,
  ShieldCheck,
  User,
  Phone,
  Tag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomerInvoice, InvoiceItem } from '../types';

interface EditInvoiceModalProps {
  invoice: CustomerInvoice | null;
  onClose: () => void;
}

export const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({
  invoice,
  onClose,
}) => {
  const {
    products,
    bankAccounts,
    updateInvoice,
    formatCurrency,
  } = useApp();

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK' | 'CREDIT' | 'ONLINE'>('CASH');
  const [bankAccountId, setBankAccountId] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState('');
  const [biltyNumber, setBiltyNumber] = useState('');
  const [transportName, setTransportName] = useState('');
  const [destinationStation, setDestinationStation] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (invoice) {
      setItems([...invoice.items]);
      setCustomerName(invoice.customerName || '');
      setCustomerPhone(invoice.customerPhone || '');
      setCustomerAddress(invoice.customerAddress || '');
      setDate(invoice.date || '');
      setDueDate(invoice.dueDate || '');
      setDiscountAmount(invoice.discountAmount || 0);
      setTaxPercent(invoice.taxPercent || 0);
      setPaidAmount(invoice.paidAmount || 0);
      setPaymentMethod(invoice.paymentMethod || 'CASH');
      setBankAccountId(invoice.bankAccountId || '');
      setNotes(invoice.notes || '');
      setReceiptImage(invoice.receiptImage || '');
      setBiltyNumber(invoice.biltyNumber || '');
      setTransportName(invoice.transportName || '');
      setDestinationStation(invoice.destinationStation || '');
      setVehicleNumber(invoice.vehicleNumber || '');
    }
  }, [invoice]);

  if (!invoice) return null;

  // Recalculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal - discountAmount) * (taxPercent / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);
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
        updated[existingIndex].quantity * updated[existingIndex].unitPrice;
      setItems(updated);
    } else {
      const newItem: InvoiceItem = {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        unitPrice: prod.salePrice,
        costPrice: prod.costPrice,
        quantity: 1,
        discount: 0,
        warranty: 'Checking Warranty / Tested',
        tagNo: prod.tagNo,
        total: prod.salePrice,
      };
      setItems([...items, newItem]);
    }
    setSelectedProductId('');
  };

  const handleUpdateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: number | string
  ) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
      const qty = Number(current.quantity) || 1;
      const price = Number(current.unitPrice) || 0;
      const disc = Number(current.discount) || 0;
      current.total = Math.max(0, qty * price - disc);
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
      alert('Please add at least one item to the invoice.');
      return;
    }

    const paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID' =
      dueBalance === 0 ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID';

    const selectedBank = bankAccounts.find((b) => b.id === bankAccountId);

    updateInvoice(invoice.id, {
      customerName,
      customerPhone,
      customerAddress,
      date,
      dueDate,
      items,
      subtotal,
      discountAmount,
      taxPercent,
      taxAmount,
      grandTotal,
      paidAmount,
      dueBalance,
      paymentStatus,
      paymentMethod,
      bankAccountId: bankAccountId || undefined,
      bankAccountName: selectedBank ? `${selectedBank.accountName} (${selectedBank.bankName})` : undefined,
      notes,
      receiptImage: receiptImage || undefined,
      biltyNumber: biltyNumber || undefined,
      transportName: transportName || undefined,
      destinationStation: destinationStation || undefined,
      vehicleNumber: vehicleNumber || undefined,
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
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Edit Sale Invoice</h2>
                <span className="font-mono text-cyan-300 font-bold px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/30 text-xs">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Original invoice number is preserved. Modifying items, pricing, discounts, and payments.
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
              <span>Invoice {invoice.invoiceNumber} updated successfully!</span>
            </div>
          )}

          {/* Customer & Date Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Customer Phone</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Invoice Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-slate-400 font-semibold mb-1">Customer Address / City</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Shop / House / City location"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-cyan-400" />
                <span>Invoice Items &amp; Components</span>
              </h3>

              {/* Add item selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">-- Add Product to Invoice --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - {formatCurrency(p.salePrice)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedProductId}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
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
                    <th className="py-2.5 px-3 w-28">Rate (PKR)</th>
                    <th className="py-2.5 px-3 w-24">Disc (PKR)</th>
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
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-white font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min={0}
                          value={item.discount}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'discount', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-white font-mono"
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
            {/* Left: Transport Bilty & Payment Proof */}
            <div className="space-y-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Transport / Bilty Details (بلٹی)</span>
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Bilty #</label>
                  <input
                    type="text"
                    value={biltyNumber}
                    onChange={(e) => setBiltyNumber(e.target.value)}
                    placeholder="BL-0000"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Goods Transport</label>
                  <input
                    type="text"
                    value={transportName}
                    onChange={(e) => setTransportName(e.target.value)}
                    placeholder="e.g. Faisal Movers"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Destination</label>
                  <input
                    type="text"
                    value={destinationStation}
                    onChange={(e) => setDestinationStation(e.target.value)}
                    placeholder="e.g. Lahore / Rawalpindi"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Vehicle #</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="e.g. LES-1234"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              {/* Photo & Webcam Option */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Payment Slip / Bilty Picture
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWebcamOpen(true)}
                    className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Use Computer Web Cam</span>
                  </button>
                  {receiptImage && (
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Photo Attached</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Calculations */}
            <div className="space-y-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-emerald-400" />
                <span>Totals &amp; Settlement</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Extra Discount:</span>
                  <input
                    type="number"
                    min={0}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    className="w-28 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right font-mono text-white"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Tax (%):</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right font-mono text-white"
                  />
                </div>

                <div className="flex justify-between text-sm font-black border-t border-slate-800 pt-2 text-cyan-300">
                  <span>Grand Total:</span>
                  <span className="font-mono">{formatCurrency(grandTotal)}</span>
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes to Invoice</span>
            </button>
          </div>
        </form>

        {/* Webcam Capture Modal */}
        {isWebcamOpen && (
          <WebcamCaptureModal
            isOpen={isWebcamOpen}
            onClose={() => setIsWebcamOpen(false)}
            onCapture={(img) => {
              setReceiptImage(img);
              setIsWebcamOpen(false);
            }}
            title="Snap Slip / Bilty via Computer Web Cam"
          />
        )}
      </div>
    </div>
  );
};
