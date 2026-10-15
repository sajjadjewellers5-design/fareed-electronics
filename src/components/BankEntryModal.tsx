import React, { useState, useEffect } from 'react';
import {
  Landmark,
  X,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  DollarSign,
  Building2,
  Camera,
  CheckCircle2,
  FileText,
  Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BankEntryModal: React.FC = () => {
  const {
    isBankEntryModalOpen,
    setIsBankEntryModalOpen,
    bankAccounts,
    addBankAccount,
    addBankTransaction,
    formatCurrency,
    t,
  } = useApp();

  const [txType, setTxType] = useState<
    'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'CUSTOMER_PAYMENT' | 'SUPPLIER_PAYMENT' | 'EXPENSE'
  >('DEPOSIT');
  const [accountId, setAccountId] = useState(bankAccounts[0]?.id || '');
  const [transferToAccountId, setTransferToAccountId] = useState(
    bankAccounts[1]?.id || ''
  );
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState('Counter Cash Inflow');
  const [referenceNo, setReferenceNo] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptPhoto, setReceiptPhoto] = useState<string>('');

  // "Add New Bank Option" state
  const [showAddNewBank, setShowAddNewBank] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newAccountTitle, setNewAccountTitle] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newAccountType, setNewAccountType] = useState<'BANK' | 'CASH' | 'DIGITAL_WALLET'>('BANK');
  const [initialBalance, setInitialBalance] = useState<string>('0');
  const [bankSuccessMsg, setBankSuccessMsg] = useState('');

  if (!isBankEntryModalOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setReceiptPhoto(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNewBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName || !newAccountTitle || !newAccountNumber) {
      alert('Please fill in Bank Name, Account Title, and Account Number.');
      return;
    }

    addBankAccount({
      bankName: newBankName.trim(),
      accountName: newAccountTitle.trim(),
      accountNumber: newAccountNumber.trim(),
      branchName: newBranchName.trim(),
      type: newAccountType,
      currentBalance: Number(initialBalance) || 0,
    });

    setBankSuccessMsg(`New bank "${newAccountTitle}" added successfully!`);
    setTimeout(() => {
      setBankSuccessMsg('');
      setShowAddNewBank(false);
      setNewBankName('');
      setNewAccountTitle('');
      setNewAccountNumber('');
      setNewBranchName('');
      setInitialBalance('0');
    }, 1200);
  };

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Please enter a valid transaction amount.');
      return;
    }

    const selectedAcc = bankAccounts.find((b) => b.id === accountId);
    if (!selectedAcc) {
      alert('Please select a valid account.');
      return;
    }

    if (txType === 'TRANSFER' && accountId === transferToAccountId) {
      alert('Source and destination accounts cannot be identical.');
      return;
    }

    addBankTransaction({
      date,
      accountId,
      accountName: selectedAcc.accountName,
      type: txType,
      category: category || (txType === 'EXPENSE' ? 'General Overhead' : 'Banking'),
      amount: numAmount,
      referenceNo: referenceNo || undefined,
      description:
        description ||
        `${txType} transaction of ${formatCurrency(numAmount)} in ${selectedAcc.accountName}`,
      receiptPhoto: receiptPhoto || undefined,
      status: 'CLEARED',
      transferToAccountId: txType === 'TRANSFER' ? transferToAccountId : undefined,
    });

    // Reset & close
    setAmount('');
    setDescription('');
    setReferenceNo('');
    setReceiptPhoto('');
    setIsBankEntryModalOpen(false);
  };

  // Keyboard shortcut: Ctrl + P for Quick Save
  useEffect(() => {
    if (!isBankEntryModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleSubmitTransaction({ preventDefault: () => {} } as any);
      }
    };

    const handleQuickSaveAll = () => {
      handleSubmitTransaction({ preventDefault: () => {} } as any);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('erp-quick-save-all', handleQuickSaveAll);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('erp-quick-save-all', handleQuickSaveAll);
    };
  }, [
    isBankEntryModalOpen,
    amount,
    accountId,
    txType,
    category,
    referenceNo,
    description,
    receiptPhoto,
    transferToAccountId,
    date,
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#072836] border border-[#0d556e]/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#051f2b] via-[#093c4e] to-[#0d526a] border-b border-[#0f5f7a]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-wide">
                  Bank Entry &amp; Cash Inflow/Outflow
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Alt + B
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                بینک و کیش اندراج — ڈپازٹ، ادائیگی یا نیا بینک کھاتہ شامل کریں
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBankEntryModalOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Top Toggle: Transaction Form vs Add New Bank */}
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <span className="text-xs font-semibold text-slate-300">
              Select Operation Mode:
            </span>
            <button
              type="button"
              onClick={() => setShowAddNewBank(!showAddNewBank)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddNewBank ? '← Back to Entry' : '+ Add New Bank Option (نیا بینک)'}</span>
            </button>
          </div>

          {/* Conditional: Add New Bank Form */}
          {showAddNewBank ? (
            <form onSubmit={handleCreateNewBank} className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-cyan-500/30">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Create New Bank or Cash Account (نیا بینک اکاؤنٹ)</span>
              </div>

              {bankSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{bankSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bank / Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meezan Bank, HBL, Nayapay, Cash"
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Account Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fareed Electronics Core"
                    value={newAccountTitle}
                    onChange={(e) => setNewAccountTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Account / IBAN Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 02840103940192 / PK36MEZN..."
                    value={newAccountNumber}
                    onChange={(e) => setNewAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Branch Name / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Electronics Market Branch, Lahore"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Account Type
                  </label>
                  <select
                    value={newAccountType}
                    onChange={(e) =>
                      setNewAccountType(e.target.value as 'BANK' | 'CASH' | 'DIGITAL_WALLET')
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="BANK">Commercial Bank Account</option>
                    <option value="CASH">Counter Cash Register</option>
                    <option value="DIGITAL_WALLET">Digital Wallet (JazzCash / EasyPaisa / SadaPay)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Opening / Initial Balance (Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNewBank(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md cursor-pointer"
                >
                  Save New Bank Account
                </button>
              </div>
            </form>
          ) : (
            /* Transaction Form */
            <form onSubmit={handleSubmitTransaction} className="space-y-4">
              {/* Type Selectors */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Transaction Type (قسم اندراج)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[
                    { id: 'DEPOSIT', label: 'Deposit', icon: ArrowDownLeft, color: 'text-emerald-400' },
                    { id: 'WITHDRAWAL', label: 'Withdrawal', icon: ArrowUpRight, color: 'text-rose-400' },
                    { id: 'TRANSFER', label: 'Transfer', icon: RefreshCw, color: 'text-cyan-400' },
                    { id: 'CUSTOMER_PAYMENT', label: 'Cust Pay', icon: DollarSign, color: 'text-teal-400' },
                    { id: 'SUPPLIER_PAYMENT', label: 'Supp Pay', icon: ArrowUpRight, color: 'text-amber-400' },
                    { id: 'EXPENSE', label: 'Expense', icon: FileText, color: 'text-purple-400' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTxType(item.id as typeof txType)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                        txType === item.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <item.icon className={`w-3.5 h-3.5 mb-1 ${item.color}`} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Account & Transfer Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {txType === 'TRANSFER' ? 'From Bank / Cash Account *' : 'Selected Account *'}
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-medium"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.accountName} ({b.bankName}) — Balance: {formatCurrency(b.currentBalance)}
                      </option>
                    ))}
                  </select>
                </div>

                {txType === 'TRANSFER' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      To Destination Account *
                    </label>
                    <select
                      value={transferToAccountId}
                      onChange={(e) => setTransferToAccountId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-medium"
                    >
                      {bankAccounts.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.accountName} ({b.bankName}) — Balance: {formatCurrency(b.currentBalance)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amount (رقم - PKR) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Transaction Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category / Purpose
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Counter Cash, Shop Rent, Utility Bill"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cheque / Ref # / Slip No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CHQ-88201 / IBFT-992018"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description / Narration (تفصیل)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cash deposited from daily counter sales revenue"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Slip Photo Option */}
                <div className="sm:col-span-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Attach Slip / Cheque Photo (تصویر سلپ یا چیک)</span>
                    </span>
                    {receiptPhoto && (
                      <button
                        type="button"
                        onClick={() => setReceiptPhoto('')}
                        className="text-[11px] text-rose-400 hover:underline"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                    />
                    {receiptPhoto && (
                      <img
                        src={receiptPhoto}
                        alt="Slip Preview"
                        className="w-10 h-10 object-cover rounded-lg border border-cyan-400"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-700/60 flex-wrap">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                  <span>Quick Save:</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-[10px]">
                    Ctrl + P
                  </kbd>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBankEntryModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel (Esc)
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5 active:scale-95"
                    title="Ctrl + P: Quick Save Bank Entry"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Bank Entry (محفوظ کریں)</span>
                    <kbd className="px-1.5 py-0.2 rounded bg-cyan-950/60 text-[9px] font-mono text-cyan-200">
                      Ctrl+P
                    </kbd>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
