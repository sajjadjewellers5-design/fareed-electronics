import React, { useState } from 'react';
import {
  Landmark,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Camera,
  Search,
  Filter,
  Trash2,
  Wallet,
  Receipt,
  FileCheck,
  X,
  CreditCard,
  Eye,
} from 'lucide-react';
import { BankAccount, BankTransaction } from '../types';
import { useApp } from '../context/AppContext';

export const BankingModule: React.FC = () => {
  const {
    bankAccounts,
    bankTransactions,
    addBankAccount,
    addBankTransaction,
    deleteBankTransaction,
    formatCurrency,
    setPreviewImage,
  } = useApp();

  const [selectedAccountId, setSelectedAccountId] = useState<string>('ALL');
  const [txTypeFilter, setTxTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);

  // New Account form state
  const [accountFormData, setAccountFormData] = useState({
    accountName: '',
    type: 'BANK' as BankAccount['type'],
    bankName: '',
    accountNumber: '',
    branchName: '',
    currentBalance: '',
  });

  // New Transaction form state
  const [txFormData, setTxFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    accountId: bankAccounts[0]?.id || '',
    type: 'DEPOSIT' as BankTransaction['type'],
    category: 'Owner Capital',
    amount: '',
    referenceNo: '',
    description: '',
    receiptPhoto: '',
    transferToAccountId: bankAccounts[1]?.id || '',
  });

  const totalBalance = bankAccounts.reduce((acc, b) => acc + b.currentBalance, 0);

  // Category options based on transaction type
  const getCategoriesForType = (type: BankTransaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return ['Owner Capital', 'Cash Inflow', 'Refund', 'Other Deposit'];
      case 'WITHDRAWAL':
        return ['Owner Drawings', 'Cash Withdrawal', 'ATM Cash', 'Other'];
      case 'EXPENSE':
        return [
          'Shop & Lab Rent',
          'Electricity & Utilities',
          'Staff Salaries',
          'Lab Tools & Supplies',
          'Internet & Software',
          'Marketing & Signage',
          'Courier & Logistics',
          'Miscellaneous Expense',
        ];
      case 'TRANSFER':
        return ['Internal Account Transfer', 'Counter to Bank Sweep'];
      case 'CUSTOMER_PAYMENT':
        return ['Customer Sale Settlement', 'Advance Booking'];
      case 'SUPPLIER_PAYMENT':
        return ['Supplier Invoice Clearance', 'Parts Advance'];
      default:
        return ['General'];
    }
  };

  // Handle Photo upload for "own pic billing"
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setTxFormData((prev) => ({
            ...prev,
            receiptPhoto: uploadEvent.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Add Account
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountFormData.accountName) return;

    addBankAccount({
      accountName: accountFormData.accountName,
      type: accountFormData.type,
      bankName: accountFormData.bankName || accountFormData.accountName,
      accountNumber: accountFormData.accountNumber || 'CASH-01',
      branchName: accountFormData.branchName,
      currentBalance: parseFloat(accountFormData.currentBalance) || 0,
    });

    setIsAddAccountModalOpen(false);
    setAccountFormData({
      accountName: '',
      type: 'BANK',
      bankName: '',
      accountNumber: '',
      branchName: '',
      currentBalance: '',
    });
  };

  // Submit Add Transaction
  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txFormData.amount);
    if (!amountNum || amountNum <= 0) return;

    const account = bankAccounts.find((b) => b.id === txFormData.accountId);
    if (!account) return;

    addBankTransaction({
      date: txFormData.date,
      accountId: txFormData.accountId,
      accountName: account.accountName,
      type: txFormData.type,
      category: txFormData.category,
      amount: amountNum,
      referenceNo: txFormData.referenceNo,
      description: txFormData.description || `${txFormData.category} - ${formatCurrency(amountNum)}`,
      receiptPhoto: txFormData.receiptPhoto,
      status: 'CLEARED',
      transferToAccountId:
        txFormData.type === 'TRANSFER' ? txFormData.transferToAccountId : undefined,
    });

    setIsAddTxModalOpen(false);
    setTxFormData({
      date: new Date().toISOString().split('T')[0],
      accountId: bankAccounts[0]?.id || '',
      type: 'DEPOSIT',
      category: 'Owner Capital',
      amount: '',
      referenceNo: '',
      description: '',
      receiptPhoto: '',
      transferToAccountId: bankAccounts[1]?.id || '',
    });
  };

  // Filter transactions
  const filteredTransactions = bankTransactions.filter((tx) => {
    const matchesAccount =
      selectedAccountId === 'ALL' ||
      tx.accountId === selectedAccountId ||
      tx.transferToAccountId === selectedAccountId;

    const matchesType = txTypeFilter === 'ALL' || tx.type === txTypeFilter;

    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.referenceNo && tx.referenceNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAccount && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-cyan-400" />
            <span>Banking, Cash &amp; Photo Slip Verification</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage company bank accounts, store cash registers, and record vouchers with receipt photos ("Own Pic Billing").
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddAccountModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-blue-400" />
            <span>+ Add Account</span>
          </button>

          <button
            onClick={() => setIsAddTxModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction Voucher</span>
          </button>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bankAccounts.map((account) => {
          const isSelected = selectedAccountId === account.id;

          return (
            <div
              key={account.id}
              onClick={() =>
                setSelectedAccountId(selectedAccountId === account.id ? 'ALL' : account.id)
              }
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 truncate">{account.accountName}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    account.type === 'BANK'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {account.type}
                </span>
              </div>

              <div className="mt-2 text-xl font-black text-white font-mono">
                {formatCurrency(account.currentBalance)}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="font-mono truncate">{account.accountNumber}</span>
                <span className="text-cyan-400 text-[10px] font-medium">
                  {isSelected ? 'Viewing Ledger' : 'Filter Ledger'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions by reference #, description, or category..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {['ALL', 'DEPOSIT', 'EXPENSE', 'TRANSFER', 'CUSTOMER_PAYMENT', 'SUPPLIER_PAYMENT'].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setTxTypeFilter(type)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    txTypeFilter === type
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type === 'ALL'
                    ? 'All Types'
                    : type === 'CUSTOMER_PAYMENT'
                    ? 'Sale Recv'
                    : type === 'SUPPLIER_PAYMENT'
                    ? 'Bill Pay'
                    : type}
                </button>
              )
            )}
          </div>

          {selectedAccountId !== 'ALL' && (
            <button
              onClick={() => setSelectedAccountId('ALL')}
              className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-slate-700"
            >
              Clear Account Filter
            </button>
          )}
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Date &amp; Ref #</th>
                <th className="py-3 px-3">Account</th>
                <th className="py-3 px-3">Category &amp; Description</th>
                <th className="py-3 px-3 text-center">Type</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Photo Slip</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No banking or cash vouchers match your query.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isCredit =
                    tx.type === 'DEPOSIT' || tx.type === 'CUSTOMER_PAYMENT';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-300 font-semibold text-xs">
                          {tx.date}
                        </div>
                        {tx.referenceNo && (
                          <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                            {tx.referenceNo}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-white">{tx.accountName}</span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-white text-xs">{tx.description}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{tx.category}</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isCredit
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-xs">
                        <span className={isCredit ? 'text-emerald-400' : 'text-rose-400'}>
                          {isCredit ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Photo Slip preview column ("own pic billing") */}
                      <td className="py-3 px-3 text-center">
                        {tx.receiptPhoto ? (
                          <button
                            onClick={() => setPreviewImage(tx.receiptPhoto || null)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold hover:bg-cyan-900/60 transition-colors cursor-pointer"
                            title="View attached bank deposit slip / voucher image"
                          >
                            <Camera className="w-3.5 h-3.5 text-cyan-400" />
                            <span>View Slip</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">None</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm('Delete this banking transaction?')) {
                              deleteBankTransaction(tx.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TRANSACTION VOUCHER MODAL */}
      {isAddTxModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Landmark className="w-5 h-5 text-cyan-400" />
                <span>Record Banking / Cash Voucher</span>
              </div>
              <button
                onClick={() => setIsAddTxModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Transaction Type *
                  </label>
                  <select
                    value={txFormData.type}
                    onChange={(e) => {
                      const newType = e.target.value as BankTransaction['type'];
                      setTxFormData({
                        ...txFormData,
                        type: newType,
                        category: getCategoriesForType(newType)[0],
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="DEPOSIT">Bank Deposit / Cash In</option>
                    <option value="WITHDRAWAL">Cash Withdrawal / Cash Out</option>
                    <option value="EXPENSE">Operating Expense Payment</option>
                    <option value="TRANSFER">Transfer Between Accounts</option>
                    <option value="CUSTOMER_PAYMENT">Customer Payment Received</option>
                    <option value="SUPPLIER_PAYMENT">Supplier Payment Settled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Primary Bank / Cash Account *
                  </label>
                  <select
                    value={txFormData.accountId}
                    onChange={(e) =>
                      setTxFormData({ ...txFormData, accountId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.accountName} ({formatCurrency(b.currentBalance)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* If Transfer, show destination account */}
              {txFormData.type === 'TRANSFER' && (
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Transfer To Destination Account *
                  </label>
                  <select
                    value={txFormData.transferToAccountId}
                    onChange={(e) =>
                      setTxFormData({ ...txFormData, transferToAccountId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {bankAccounts
                      .filter((b) => b.id !== txFormData.accountId)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.accountName} ({formatCurrency(b.currentBalance)})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Amount *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={txFormData.amount}
                    onChange={(e) =>
                      setTxFormData({ ...txFormData, amount: e.target.value })
                    }
                    placeholder="e.g. 50000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-base font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Category</label>
                  <select
                    value={txFormData.category}
                    onChange={(e) =>
                      setTxFormData({ ...txFormData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {getCategoriesForType(txFormData.type).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={txFormData.date}
                    onChange={(e) =>
                      setTxFormData({ ...txFormData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Cheque / IBFT / Reference #
                  </label>
                  <input
                    type="text"
                    value={txFormData.referenceNo}
                    onChange={(e) =>
                      setTxFormData({ ...txFormData, referenceNo: e.target.value })
                    }
                    placeholder="e.g. IBFT-8849201"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Description / Memo</label>
                <input
                  type="text"
                  value={txFormData.description}
                  onChange={(e) =>
                    setTxFormData({ ...txFormData, description: e.target.value })
                  }
                  placeholder="e.g. Paid monthly shop rent to building management"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* "Own Pic Billing": Picture upload for bank slip */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Own Pic Billing: Attach Bank Slip / Cash Receipt Image</span>
                </div>

                <div className="border border-dashed border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  {txFormData.receiptPhoto ? (
                    <div className="relative group w-full">
                      <img
                        src={txFormData.receiptPhoto}
                        alt="Bank slip preview"
                        className="max-h-28 mx-auto rounded-lg border border-slate-700 object-contain shadow"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setTxFormData({ ...txFormData, receiptPhoto: '' })
                        }
                        className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="cursor-pointer flex flex-col items-center">
                        <Camera className="w-6 h-6 text-cyan-400 mb-1" />
                        <span className="text-slate-300 font-semibold text-xs">
                          Upload Deposit Slip / Bank Transfer Slip / Cheque Document
                        </span>
                        <span className="text-slate-500 text-[10px] mt-0.5">
                          Click to select image or receipt document file
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTxModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Save Banking Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD BANK ACCOUNT MODAL */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Wallet className="w-5 h-5 text-blue-400" />
                <span>Add Bank Account or Cash Drawer</span>
              </div>
              <button
                onClick={() => setIsAddAccountModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Account Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={accountFormData.accountName}
                  onChange={(e) =>
                    setAccountFormData({ ...accountFormData, accountName: e.target.value })
                  }
                  placeholder="e.g. Meezan Bank Corporate / Counter 2 Cash"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Type</label>
                  <select
                    value={accountFormData.type}
                    onChange={(e) =>
                      setAccountFormData({
                        ...accountFormData,
                        type: e.target.value as BankAccount['type'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="BANK">Bank Account</option>
                    <option value="CASH">Cash Drawer / Register</option>
                    <option value="DIGITAL_WALLET">Digital Wallet (Nayapay/SadaPay)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Opening Balance
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={accountFormData.currentBalance}
                    onChange={(e) =>
                      setAccountFormData({
                        ...accountFormData,
                        currentBalance: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Bank Name / Institution
                </label>
                <input
                  type="text"
                  value={accountFormData.bankName}
                  onChange={(e) =>
                    setAccountFormData({ ...accountFormData, bankName: e.target.value })
                  }
                  placeholder="e.g. Meezan Bank Ltd / Cash Counter"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Account Number / IBAN
                </label>
                <input
                  type="text"
                  value={accountFormData.accountNumber}
                  onChange={(e) =>
                    setAccountFormData({
                      ...accountFormData,
                      accountNumber: e.target.value,
                    })
                  }
                  placeholder="0219-0104882711"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
