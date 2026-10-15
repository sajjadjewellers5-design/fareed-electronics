import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  X,
  UserCheck,
  Landmark,
  FileText,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Save,
  Printer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomerInvoice } from '../types';

export const ReceivePaymentModal: React.FC = () => {
  const {
    isReceivePaymentModalOpen,
    setIsReceivePaymentModalOpen,
    customers,
    invoices,
    bankAccounts,
    createReceiptVoucher,
    setSelectedVoucherForPrint,
    formatCurrency,
  } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE'>('BANK_TRANSFER');
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || '');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');
  const [slipImage, setSlipImage] = useState<string>('');

  if (!isReceivePaymentModalOpen) return null;

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Unpaid or partially paid invoices for this customer
  const customerUnpaidInvoices = invoices.filter(
    (inv) =>
      (!selectedCustomerId || inv.customerId === selectedCustomerId) &&
      inv.dueBalance > 0
  );

  const handleCustomerChange = (custId: string) => {
    setSelectedCustomerId(custId);
    setSelectedInvoiceId('');
    const cust = customers.find((c) => c.id === custId);
    if (cust && cust.currentBalance > 0) {
      setAmount(String(cust.currentBalance));
    }
  };

  const handleInvoiceSelect = (inv: CustomerInvoice) => {
    setSelectedInvoiceId(inv.id);
    setSelectedCustomerId(inv.customerId);
    setAmount(String(inv.dueBalance));
    setReferenceNo(`INV-REF: ${inv.invoiceNumber}`);
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
      alert('Please enter a valid received amount.');
      return;
    }

    if (!selectedCustomer) {
      alert('Please choose a customer.');
      return;
    }

    const selectedBank = bankAccounts.find((b) => b.id === bankAccountId);
    const allocatedInvoice = invoices.find((i) => i.id === selectedInvoiceId);

    const createdVoucher = createReceiptVoucher({
      date,
      partyType: 'CUSTOMER',
      partyId: selectedCustomer.id,
      partyName: selectedCustomer.name,
      partyPhone: selectedCustomer.phone,
      bankAccountId,
      bankAccountName: selectedBank?.accountName || 'Cash Register',
      paymentMode,
      referenceNo: referenceNo || 'CASH-REC',
      amount: amountNum,
      allocatedInvoiceId: allocatedInvoice?.id,
      allocatedInvoiceNo: allocatedInvoice?.invoiceNumber,
      notes,
      voucherImage: slipImage || undefined,
    });

    setIsReceivePaymentModalOpen(false);
    // Reset state
    setSelectedCustomerId('');
    setSelectedInvoiceId('');
    setAmount('');
    setReferenceNo('');
    setNotes('');
    setSlipImage('');

    // Open printable receipt voucher
    setSelectedVoucherForPrint(createdVoucher);
  };

  // Keyboard shortcut: Ctrl + P for Quick Save
  useEffect(() => {
    if (!isReceivePaymentModalOpen) return;

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
    isReceivePaymentModalOpen,
    amount,
    selectedCustomerId,
    bankAccountId,
    selectedInvoiceId,
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
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Receive Payment (Receipt Voucher)</h2>
              <p className="text-xs text-slate-400">
                Record payment received from customer &amp; deposit into bank or cash counter.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsReceivePaymentModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Customer Selection */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Choose Customer *
                </label>
                <select
                  required
                  value={selectedCustomerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Select Customer Account --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.currentBalance > 0 ? `(Owes ${formatCurrency(c.currentBalance)})` : '(Balance: ₨0)'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCustomer && (
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Balance Due</span>
                    <span
                      className={`font-mono font-black text-sm ${
                        selectedCustomer.currentBalance > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {formatCurrency(selectedCustomer.currentBalance)}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <div>{selectedCustomer.phone}</div>
                    <div className="truncate max-w-[150px]">{selectedCustomer.address}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Invoices with pending balance */}
            {customerUnpaidInvoices.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Allocate to Open Invoice (Click to auto-fill amount):
                </span>
                <div className="flex flex-wrap gap-2">
                  {customerUnpaidInvoices.slice(0, 4).map((inv) => (
                    <button
                      key={inv.id}
                      type="button"
                      onClick={() => handleInvoiceSelect(inv)}
                      className={`px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-mono transition-all cursor-pointer ${
                        selectedInvoiceId === inv.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span>{inv.invoiceNumber}</span>
                      <span className="text-rose-400 ml-1.5 font-bold">
                        ({formatCurrency(inv.dueBalance)})
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
                Amount Received *
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 25000"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-base font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Deposit Into Account *
              </label>
              <select
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              >
                {bankAccounts.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.accountName} ({formatCurrency(b.currentBalance)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Payment Method</label>
              <select
                value={paymentMode}
                onChange={(e) =>
                  setPaymentMode(e.target.value as 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE')
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="BANK_TRANSFER">Bank Wire / Online IBFT</option>
                <option value="CASH">Counter Cash</option>
                <option value="CHEQUE">Bank Cheque</option>
                <option value="ONLINE">Mobile Banking / Digital Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Receipt Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1">
                Cheque # / IBFT TRX ID / Slip Reference
              </label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="e.g. IBFT-991823 / CHQ #4491"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1">Receipt Memo / Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Cleared full balance for OLED screens"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Attach Payment slip / cheque photo */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Attach Cheque / Bank Transfer Deposit Slip</span>
              </span>
              <span className="text-[10px] text-slate-500">Optional</span>
            </div>

            <div className="border border-dashed border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center">
              {slipImage ? (
                <div className="relative group w-full">
                  <img
                    src={slipImage}
                    alt="Receipt slip preview"
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
                    <label className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
                      <Receipt className="w-4 h-4 text-emerald-400" />
                      <span>Upload Slip / Cheque Photo</span>
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
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-300 text-[10px]">
                Ctrl + P
              </kbd>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReceivePaymentModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
              >
                Cancel (Esc)
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95 transition-all"
                title="Ctrl + P: Quick Save Voucher & Deposit"
              >
                <Save className="w-4 h-4" />
                <span>Save Voucher &amp; Deposit</span>
                <kbd className="px-1.5 py-0.2 rounded bg-emerald-950/60 font-mono text-[9px] text-emerald-200">
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
