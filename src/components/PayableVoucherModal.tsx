import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  X,
  Building,
  Landmark,
  FileText,
  CreditCard,
  Truck,
  Save,
  Printer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PurchaseInvoice } from '../types';

export const PayableVoucherModal: React.FC = () => {
  const {
    isPaymentVoucherModalOpen,
    setIsPaymentVoucherModalOpen,
    suppliers,
    purchaseInvoices,
    bankAccounts,
    createPaymentVoucher,
    setSelectedVoucherForPrint,
    formatCurrency,
  } = useApp();

  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedBillId, setSelectedBillId] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE'>('BANK_TRANSFER');
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || '');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');
  const [slipImage, setSlipImage] = useState<string>('');

  if (!isPaymentVoucherModalOpen) return null;

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId);

  // Unpaid or partially paid bills for this vendor
  const supplierUnpaidBills = purchaseInvoices.filter(
    (bill) =>
      (!selectedSupplierId || bill.supplierId === selectedSupplierId) &&
      bill.dueBalance > 0
  );

  const handleSupplierChange = (suppId: string) => {
    setSelectedSupplierId(suppId);
    setSelectedBillId('');
    const supp = suppliers.find((s) => s.id === suppId);
    if (supp && supp.currentBalance > 0) {
      setAmount(String(supp.currentBalance));
    }
  };

  const handleBillSelect = (bill: PurchaseInvoice) => {
    setSelectedBillId(bill.id);
    setSelectedSupplierId(bill.supplierId);
    setAmount(String(bill.dueBalance));
    setReferenceNo(`BILL-REF: ${bill.billNumber}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSlipImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    if (!selectedSupplier) {
      alert('Please choose a supplier / payee.');
      return;
    }

    const selectedBank = bankAccounts.find((b) => b.id === bankAccountId);
    const allocatedBill = purchaseInvoices.find((p) => p.id === selectedBillId);

    const createdVoucher = createPaymentVoucher({
      date,
      partyType: 'SUPPLIER',
      partyId: selectedSupplier.id,
      partyName: selectedSupplier.name,
      partyPhone: selectedSupplier.phone,
      bankAccountId,
      bankAccountName: selectedBank?.accountName || 'Cash Register',
      paymentMode,
      referenceNo: referenceNo || 'BANK-PMT',
      amount: amountNum,
      allocatedInvoiceId: allocatedBill?.id,
      allocatedInvoiceNo: allocatedBill?.billNumber,
      notes,
      voucherImage: slipImage || undefined,
    });

    setIsPaymentVoucherModalOpen(false);
    // Reset state
    setSelectedSupplierId('');
    setSelectedBillId('');
    setAmount('');
    setReferenceNo('');
    setNotes('');
    setSlipImage('');

    // Open printable payment voucher
    setSelectedVoucherForPrint(createdVoucher);
  };

  // Keyboard shortcut: Ctrl + P for Quick Save
  useEffect(() => {
    if (!isPaymentVoucherModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleSubmit({ preventDefault: () => {} } as any);
      }
    };

    const handleQuickSaveAll = () => {
      handleSubmit({ preventDefault: () => {} } as any);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('erp-quick-save-all', handleQuickSaveAll);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('erp-quick-save-all', handleQuickSaveAll);
    };
  }, [
    isPaymentVoucherModalOpen,
    amount,
    selectedSupplierId,
    bankAccountId,
    selectedBillId,
    paymentMode,
    referenceNo,
    notes,
    slipImage,
    date,
  ]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-5 sm:p-6 shadow-2xl space-y-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Payment Payable Voucher (Money Out)</h2>
              <p className="text-xs text-slate-400">
                Disburse payment to supplier or vendor &amp; reduce accounts payable liability.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPaymentVoucherModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Supplier Selection */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Choose Supplier / Payee *
                </label>
                <select
                  required
                  value={selectedSupplierId}
                  onChange={(e) => handleSupplierChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Select Supplier Account --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.currentBalance > 0 ? `(Payable: ${formatCurrency(s.currentBalance)})` : '(Balance: ₨0)'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSupplier && (
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Balance We Owe</span>
                    <span
                      className={`font-mono font-black text-sm ${
                        selectedSupplier.currentBalance > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {formatCurrency(selectedSupplier.currentBalance)}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <div>{selectedSupplier.phone}</div>
                    <div className="truncate max-w-[150px]">{selectedSupplier.contactPerson || 'Vendor'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Inward Purchase Bills with pending balance */}
            {supplierUnpaidBills.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Allocate Payment to Vendor Bill (Click to auto-fill):
                </span>
                <div className="flex flex-wrap gap-2">
                  {supplierUnpaidBills.slice(0, 4).map((bill) => (
                    <button
                      key={bill.id}
                      type="button"
                      onClick={() => handleBillSelect(bill)}
                      className={`px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-mono transition-all cursor-pointer ${
                        selectedBillId === bill.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span>{bill.billNumber}</span>
                      <span className="text-amber-400 ml-1.5 font-bold">
                        ({formatCurrency(bill.dueBalance)})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment & Bank Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Amount to Pay *
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-base font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Deduct From Account *
              </label>
              <select
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              >
                {bankAccounts.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.accountName} ({formatCurrency(b.currentBalance)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Disbursement Mode</label>
              <select
                value={paymentMode}
                onChange={(e) =>
                  setPaymentMode(e.target.value as 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE')
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="BANK_TRANSFER">Bank Wire / Online IBFT</option>
                <option value="CHEQUE">Bank Cheque</option>
                <option value="CASH">Counter Cash</option>
                <option value="ONLINE">Mobile Banking / Digital Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Disbursement Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1">
                Cheque # / Swift Reference / Voucher #
              </label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="e.g. CHQ-881902 / IBFT-884920"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1">Payment Purpose / Memo</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Cleared bill for soldering tools & display shipment"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Attach Payment slip / counterfoil photo */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Attach Cheque Counterfoil / Bank Transfer Slip</span>
              </span>
              <span className="text-[10px] text-slate-500">Optional</span>
            </div>

            <div className="border border-dashed border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center">
              {slipImage ? (
                <div className="relative group w-full">
                  <img
                    src={slipImage}
                    alt="Payment slip preview"
                    className="max-h-28 mx-auto rounded-lg border border-slate-700 object-contain shadow"
                  />
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSlipImage('')}
                      className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-center">
                    {/* File upload option */}
                    <label className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Upload Counterfoil / Slip Document</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Upload image from device storage (JPG, PNG, PDF receipts)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800 flex-wrap">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              <span>Quick Save:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 text-[10px]">
                Ctrl + P
              </kbd>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaymentVoucherModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
              >
                Cancel (Esc)
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
                title="Ctrl + P: Quick Save Payable Voucher & Pay"
              >
                <Save className="w-4 h-4" />
                <span>Save Voucher &amp; Pay</span>
                <kbd className="px-1.5 py-0.2 rounded bg-amber-950/60 font-mono text-[9px] text-amber-200">
                  Ctrl+P
                </kbd>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
