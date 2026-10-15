import React, { useState, useEffect } from 'react';
import {
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Building,
  UserCheck,
  Landmark,
  Save,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JournalVoucherModal: React.FC = () => {
  const {
    isJournalVoucherModalOpen,
    setIsJournalVoucherModalOpen,
    createJournalVoucher,
    setSelectedVoucherForPrint,
    bankAccounts,
    customers,
    suppliers,
    formatCurrency,
    t,
    language,
  } = useApp();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [debitAccountId, setDebitAccountId] = useState('');
  const [creditAccountId, setCreditAccountId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [narration, setNarration] = useState('');
  const [voucherImage, setVoucherImage] = useState<string>('');

  if (!isJournalVoucherModalOpen) return null;

  // Combine selectable accounts (Banks, Customers, Suppliers, Expense Accounts)
  const accountOptions = [
    ...bankAccounts.map((b) => ({
      id: b.id,
      name: `${b.accountName} (${b.bankName}) - Bank/Cash`,
      type: 'BANK',
      balance: b.currentBalance,
    })),
    ...customers.map((c) => ({
      id: c.id,
      name: `${c.name} (${c.phone}) - Customer Khata`,
      type: 'CUSTOMER',
      balance: c.currentBalance,
    })),
    ...suppliers.map((s) => ({
      id: s.id,
      name: `${s.name} (${s.phone}) - Supplier Payable`,
      type: 'SUPPLIER',
      balance: s.currentBalance,
    })),
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setVoucherImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debitAccountId || !creditAccountId || amount <= 0) return;
    if (debitAccountId === creditAccountId) {
      alert('Debit and Credit accounts cannot be the same!');
      return;
    }

    const debitAcc = accountOptions.find((a) => a.id === debitAccountId);
    const creditAcc = accountOptions.find((a) => a.id === creditAccountId);

    const created = createJournalVoucher({
      date,
      debitAccountId,
      debitAccountName: debitAcc?.name || 'Debit Account',
      creditAccountId,
      creditAccountName: creditAcc?.name || 'Credit Account',
      amount,
      narration: narration || 'Journal adjustment entry',
      voucherImage: voucherImage || undefined,
    });

    setIsJournalVoucherModalOpen(false);
    // Reset form
    setDebitAccountId('');
    setCreditAccountId('');
    setAmount(0);
    setNarration('');
    setVoucherImage('');

    // Open print preview
    setSelectedVoucherForPrint(created);
  };

  // Keyboard shortcut: Ctrl + P for Quick Save
  useEffect(() => {
    if (!isJournalVoucherModalOpen) return;

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
    isJournalVoucherModalOpen,
    date,
    debitAccountId,
    creditAccountId,
    amount,
    narration,
    voucherImage,
  ]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={() => setIsJournalVoucherModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{language === 'ur' ? 'نیا جنرل واؤچر (JV)' : 'New Journal Voucher (JV)'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                Double Entry
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ur'
                ? 'ڈیبٹ اور کریڈٹ ایڈجسٹمنٹ، فنڈ ٹرانسفر، یا جنرل لیجر ٹرانزیکشن کا اندراج کریں'
                : 'Double-entry adjustment, inter-account transfers, or party khata settlements'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Date */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              {language === 'ur' ? 'واؤچر تاریخ' : 'Voucher Date'} *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-white outline-none font-mono"
            />
          </div>

          {/* Debit Account */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase text-[11px]">
                <span>Debit Account (Dr) *</span>
                <span className="text-slate-500 font-normal">
                  ({language === 'ur' ? 'رقم جمع / اثاثہ اضافہ' : 'Receiving / Assets+'})
                </span>
              </label>
            </div>
            <select
              required
              value={debitAccountId}
              onChange={(e) => setDebitAccountId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-3 py-2 text-white outline-none font-medium"
            >
              <option value="">-- Choose Account to Debit (Dr) --</option>
              {accountOptions.map((acc) => (
                <option key={`dr-${acc.id}`} value={acc.id}>
                  {acc.name} &bull; Bal: Rs. {acc.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Credit Account */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-[11px]">
                <span>Credit Account (Cr) *</span>
                <span className="text-slate-500 font-normal">
                  ({language === 'ur' ? 'رقم ادا / کمی' : 'Giving / Deducted'})
                </span>
              </label>
            </div>
            <select
              required
              value={creditAccountId}
              onChange={(e) => setCreditAccountId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-3 py-2 text-white outline-none font-medium"
            >
              <option value="">-- Choose Account to Credit (Cr) --</option>
              {accountOptions.map((acc) => (
                <option key={`cr-${acc.id}`} value={acc.id}>
                  {acc.name} &bull; Bal: Rs. {acc.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              {language === 'ur' ? 'رقم (روپے)' : 'Adjustment Amount (Rs.)'} *
            </label>
            <input
              type="number"
              min="1"
              required
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="e.g. 25000"
              className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-white font-mono font-bold text-sm outline-none"
            />
          </div>

          {/* Narration / Remarks */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              {language === 'ur' ? 'تفصیل یا نریشن (Narration)' : 'Narration / Description'} *
            </label>
            <textarea
              required
              rows={2}
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="e.g. Inter-bank fund transfer, repair adjustment, or discount settlement"
              className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl p-3 text-white outline-none resize-none"
            />
          </div>

          {/* Slip / Document Attachment */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              {language === 'ur' ? 'رسید یا چیک کی تصویر (اختیاری)' : 'Attach Slip / Cheque Document (Optional)'}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-indigo-500 text-slate-300 text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Upload Document / Slip</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {voucherImage && (
                <div className="flex items-center gap-2 ml-2">
                  <img
                    src={voucherImage}
                    alt="Slip preview"
                    className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setVoucherImage('')}
                    className="text-xs text-rose-400 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-800 flex-wrap">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              <span>Quick Save:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300 text-[10px]">
                Ctrl + P
              </kbd>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsJournalVoucherModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                {t('cancel')} (Esc)
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
                title="Ctrl + P: Quick Save Journal Voucher"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'ur' ? 'جنرل واؤچر محفوظ کریں' : 'Save Journal Voucher'}</span>
                <kbd className="px-1.5 py-0.2 rounded bg-indigo-950/60 text-[9px] font-mono border border-indigo-400/30">
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
