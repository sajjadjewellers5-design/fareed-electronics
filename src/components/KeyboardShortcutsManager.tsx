import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Printer,
  Save,
  PlusCircle,
  Truck,
  UserPlus,
  X,
  Sparkles,
  Command,
  Search,
  FileCheck,
  ArrowLeft,
  RotateCcw,
  ArrowDownLeft,
  Boxes,
  Landmark,
  Mic,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KeyboardShortcutsManager: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    isNewCustomerModalOpen,
    setIsNewCustomerModalOpen,
    isCreateInvoiceModalOpen,
    setIsCreateInvoiceModalOpen,
    isCreatePurchaseModalOpen,
    setIsCreatePurchaseModalOpen,
    isReceivePaymentModalOpen,
    setIsReceivePaymentModalOpen,
    isPaymentVoucherModalOpen,
    setIsPaymentVoucherModalOpen,
    isJournalVoucherModalOpen,
    setIsJournalVoucherModalOpen,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    isChequeSearchOpen,
    setIsChequeSearchOpen,
    isClearDemoDataModalOpen,
    setIsClearDemoDataModalOpen,
    isNewProductModalOpen,
    setIsNewProductModalOpen,
    isBankEntryModalOpen,
    setIsBankEntryModalOpen,
    isBiltyUpdateModalOpen,
    setIsBiltyUpdateModalOpen,
    isAccountInfoModalOpen,
    setIsAccountInfoModalOpen,
    whatsAppModalInvoice,
    setWhatsAppModalInvoice,
    selectedInvoiceForPrint,
    setSelectedInvoiceForPrint,
    selectedVoucherForPrint,
    setSelectedVoucherForPrint,
    isSaleReturnModalOpen,
    setIsSaleReturnModalOpen,
    selectedSaleReturnForPrint,
    setSelectedSaleReturnForPrint,
    isTagPrintingModalOpen,
    setIsTagPrintingModalOpen,
    isStockAdjustmentModalOpen,
    setIsStockAdjustmentModalOpen,
    isPrintPreviewOpen,
    setIsPrintPreviewOpen,
    previewImage,
    setPreviewImage,
    invoices,
    isShortcutsHelpOpen,
    setIsShortcutsHelpOpen,
    selectedCustomerForLedger,
    setSelectedCustomerForLedger,
    isAIGuideModalOpen,
    setIsAIGuideModalOpen,
    openCopilotVoice,
    language,
    t,
  } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  useEffect(() => {
    // Only bind shortcuts if logged in
    if (!currentUser) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ESC: Back to Dashboard or Close Active Modal
      if (e.key === 'Escape') {
        e.preventDefault();

        // Check if any modal is open
        if (
          isShortcutsHelpOpen ||
          isNewCustomerModalOpen ||
          isCreateInvoiceModalOpen ||
          isCreatePurchaseModalOpen ||
          isReceivePaymentModalOpen ||
          isPaymentVoucherModalOpen ||
          isJournalVoucherModalOpen ||
          isGlobalSearchOpen ||
          isChequeSearchOpen ||
          isClearDemoDataModalOpen ||
          isNewProductModalOpen ||
          isBankEntryModalOpen ||
          isBiltyUpdateModalOpen ||
          isAccountInfoModalOpen ||
          isSaleReturnModalOpen ||
          isTagPrintingModalOpen ||
          isStockAdjustmentModalOpen ||
          isPrintPreviewOpen ||
          selectedSaleReturnForPrint ||
          whatsAppModalInvoice ||
          selectedInvoiceForPrint ||
          selectedVoucherForPrint ||
          selectedCustomerForLedger ||
          isAIGuideModalOpen ||
          previewImage
        ) {
          setIsShortcutsHelpOpen(false);
          setIsAIGuideModalOpen(false);
          setIsNewCustomerModalOpen(false);
          setIsCreateInvoiceModalOpen(false);
          setIsCreatePurchaseModalOpen(false);
          setIsReceivePaymentModalOpen(false);
          setIsPaymentVoucherModalOpen(false);
          setIsJournalVoucherModalOpen(false);
          setIsGlobalSearchOpen(false);
          setIsChequeSearchOpen(false);
          setIsClearDemoDataModalOpen(false);
          setIsNewProductModalOpen(false);
          setIsBankEntryModalOpen(false);
          setIsBiltyUpdateModalOpen(false);
          setIsAccountInfoModalOpen(false);
          setIsSaleReturnModalOpen(false);
          setIsTagPrintingModalOpen(false);
          setIsStockAdjustmentModalOpen(false);
          setIsPrintPreviewOpen(false);
          setSelectedSaleReturnForPrint(null);
          setWhatsAppModalInvoice(null);
          setSelectedInvoiceForPrint(null);
          setSelectedVoucherForPrint(null);
          setSelectedCustomerForLedger(null);
          setPreviewImage(null);
          showToast('Esc: Closed Active Window');
          return;
        }

        // If no modal open, go back to dashboard
        if (activeTab !== 'dashboard') {
          setActiveTab('dashboard');
          showToast('Esc: Back to Dashboard');
          return;
        }
      }

      // 2. F1: New Customer
      if (e.key === 'F1') {
        e.preventDefault();
        setIsNewCustomerModalOpen(true);
        showToast('F1 Pressed: Opening New Customer Form');
        return;
      }

      // 3. F2: Sale Invoice & Show Stock Items to Select
      if (e.key === 'F2') {
        e.preventDefault();
        if (isCreateInvoiceModalOpen) {
          window.dispatchEvent(new CustomEvent('erp-toggle-f2-stock-selector'));
          showToast('F2: Stock Items & Select (اسٹاک آئٹمز لسٹ)');
        } else {
          setActiveTab('customer-invoices');
          setIsCreateInvoiceModalOpen(true);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('erp-open-f2-stock-selector'));
          }, 300);
          showToast('F2: Sale Invoice & Stock Items (اسٹاک آئٹم منتخب کریں)');
        }
        return;
      }

      // 4. F3: Purchase Invoice
      if (e.key === 'F3') {
        e.preventDefault();
        setActiveTab('purchase-invoices');
        setIsCreatePurchaseModalOpen(true);
        showToast('F3 Pressed: Opening Purchase Bill Form');
        return;
      }

      // 5. F4: Receive Payment Entry (وصول رقم واؤچر)
      if (e.key === 'F4') {
        e.preventDefault();
        setIsReceivePaymentModalOpen(true);
        showToast('F4: Receive Payment Entry (وصول رقم واؤچر)');
        return;
      }

      // 6. F5: All Data Search (Global ERP Search)
      if (e.key === 'F5') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
        showToast('F5: Opening All Data Search (Global ERP)');
        return;
      }

      // 7. F6: New Stock Entry (نیا اسٹاک اندراج)
      if (e.key === 'F6') {
        e.preventDefault();
        setIsNewProductModalOpen(true);
        showToast('F6: New Stock Entry (نیا اسٹاک اندراج)');
        return;
      }

      // 8. Alt + B: Bank Entry & Add New Bank Option
      if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsBankEntryModalOpen(true);
        showToast('Alt + B: Bank Entry & Add New Bank Option');
        return;
      }

      // 9. Alt + J: Journal Voucher Entry
      if (e.altKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsJournalVoucherModalOpen(true);
        showToast('Alt + J: Journal Voucher Entry (جنرل واؤچر)');
        return;
      }

      // 10. Alt + V: Copilot Voice Communication (صوتی رابطہ)
      if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        openCopilotVoice();
        showToast('Alt + V: Copilot Voice Communication (صوتی رابطہ)');
        return;
      }

      // 11. Ctrl + P (or Cmd + P): Quick Save & Print All Invoice / Voucher
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        showToast('Ctrl + P: Quick Save & Print Invoice/Voucher');
        window.dispatchEvent(new CustomEvent('erp-quick-save-and-print'));

        if (!isCreateInvoiceModalOpen) {
          if (selectedInvoiceForPrint || selectedVoucherForPrint) {
            window.print();
          } else if (activeTab === 'customer-invoices' && invoices.length > 0) {
            setSelectedInvoiceForPrint(invoices[0]);
          } else {
            window.print();
          }
        }
        return;
      }

      // 11. Ctrl + S (or Cmd + S): Save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        showToast('Ctrl + S: Saving Active Form');

        window.dispatchEvent(new CustomEvent('erp-global-save'));

        const submitBtn = document.querySelector<HTMLButtonElement>(
          'form button[type="submit"]:not([disabled])'
        );
        if (submitBtn) {
          submitBtn.click();
        }
        return;
      }

      // ? key: Toggle shortcuts helper (when not typing in an input)
      if (
        e.key === '?' &&
        !(
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'
        )
      ) {
        e.preventDefault();
        setIsShortcutsHelpOpen(!isShortcutsHelpOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentUser,
    activeTab,
    isShortcutsHelpOpen,
    isNewCustomerModalOpen,
    isCreateInvoiceModalOpen,
    isCreatePurchaseModalOpen,
    isReceivePaymentModalOpen,
    isPaymentVoucherModalOpen,
    isGlobalSearchOpen,
    isChequeSearchOpen,
    isClearDemoDataModalOpen,
    whatsAppModalInvoice,
    selectedInvoiceForPrint,
    selectedVoucherForPrint,
    previewImage,
    invoices,
    isAIGuideModalOpen,
    openCopilotVoice,
  ]);

  return (
    <>
      {/* Visual Floating Toast for hotkey activation */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/40 text-cyan-300 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <Command className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Keyboard Shortcuts Quick Reference Bar (Bottom of Screen) */}
      <div className="no-print fixed bottom-2 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/95 border border-slate-800 shadow-xl backdrop-blur-md text-[11px] text-slate-400 select-none">
        {/* ESC: Back */}
        <button
          onClick={() => {
            if (activeTab !== 'dashboard') setActiveTab('dashboard');
          }}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          title="Esc: Back to Dashboard / Close"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[10px] text-slate-300 font-bold">
            Esc
          </kbd>
          <span>{language === 'ur' ? 'واپس' : 'Back'}</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* F1: Customer */}
        <button
          onClick={() => setIsNewCustomerModalOpen(true)}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          title="F1: Create New Customer"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[10px] text-cyan-300 font-bold">
            F1
          </kbd>
          <span>{language === 'ur' ? 'نیا گاہک' : 'Customer'}</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* F2: Sale Invoice */}
        <button
          onClick={() => {
            setActiveTab('customer-invoices');
            setIsCreateInvoiceModalOpen(true);
          }}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          title="F2: Create Customer Sale Invoice"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[10px] text-emerald-300 font-bold">
            F2
          </kbd>
          <span>{language === 'ur' ? 'سیل انوائس' : 'Sale'}</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* F3: Purchase Bill */}
        <button
          onClick={() => {
            setActiveTab('purchase-invoices');
            setIsCreatePurchaseModalOpen(true);
          }}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          title="F3: Create Inward Purchase Bill"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[10px] text-amber-300 font-bold">
            F3
          </kbd>
          <span>{language === 'ur' ? 'خریداری بل' : 'Purchase'}</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* F4: Receive Payment Entry */}
        <button
          onClick={() => setIsReceivePaymentModalOpen(true)}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          title="F4: Receive Payment Entry (وصول رقم واؤچر)"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[10px] text-emerald-400 font-bold">
            F4
          </kbd>
          <span>{language === 'ur' ? 'وصول رقم' : 'Receive Pay'}</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* F5: All Data Search */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          title="F5: All Data Search (Global ERP Search)"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[10px] text-amber-300 font-bold">
            F5
          </kbd>
          <span>{language === 'ur' ? 'تمام ڈیٹا تلاش' : 'All Data Search'}</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* F6: New Stock Entry */}
        <button
          onClick={() => setIsNewProductModalOpen(true)}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          title="F6: New Stock Entry (نیا اسٹاک اندراج)"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[10px] text-cyan-300 font-bold">
            F6
          </kbd>
          <span>{language === 'ur' ? 'نیا اسٹاک' : 'New Stock'}</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* Alt+B: Bank Entry */}
        <button
          onClick={() => setIsBankEntryModalOpen(true)}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          title="Alt+B: Bank Entry & Add New Bank Option"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[10px] text-teal-300 font-bold">
            Alt+B
          </kbd>
          <span>{language === 'ur' ? 'بینک اندراج' : 'Bank Entry'}</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* Alt+V: Copilot Voice */}
        <button
          onClick={openCopilotVoice}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-purple-300"
          title="Alt+V: Copilot Voice Communication (صوتی رابطہ)"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/60 font-mono text-[10px] text-purple-300 font-bold">
            Alt+V
          </kbd>
          <span className="font-semibold">{language === 'ur' ? 'صوتی رابطہ' : 'Voice Copilot'}</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* Ctrl+P: Print */}
        <div className="flex items-center gap-1.5" title="Ctrl+P: Print Document">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[10px] text-purple-300 font-bold">
            Ctrl+P
          </kbd>
          <span>{language === 'ur' ? 'پرنٹ' : 'Print'}</span>
        </div>

        <span className="text-slate-700">|</span>

        {/* Ctrl+S: Save */}
        <div className="flex items-center gap-1.5" title="Ctrl+S: Save Active Form">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 font-mono text-[10px] text-blue-300 font-bold">
            Ctrl+S
          </kbd>
          <span>{language === 'ur' ? 'محفوظ' : 'Save'}</span>
        </div>

        <span className="text-slate-700">|</span>

        <button
          onClick={() => setIsShortcutsHelpOpen(true)}
          className="text-slate-500 hover:text-cyan-400 p-0.5 cursor-pointer"
          title="View all Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Keyboard Shortcuts Guide Modal */}
      {isShortcutsHelpOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsShortcutsHelpOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">ERP Keyboard Shortcuts &amp; Hotkeys</h2>
                <p className="text-xs text-slate-400">
                  Fareed Electronics high-speed counter hotkeys
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <ArrowLeft className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-semibold text-white">Back to Dashboard / Close Open Dialog</div>
                    <div className="text-[10px] text-slate-500">واپس ڈیش بورڈ یا ونڈو بند کریں</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold">
                  Esc
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-white">New Customer Registration</div>
                    <div className="text-[10px] text-slate-500">نیا کسٹمر شامل کریں</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono font-bold">
                  F1
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-white">New Customer Sale Invoice</div>
                    <div className="text-[10px] text-slate-500">نیا سیل بل تیار کریں</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono font-bold">
                  F2
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-white">New Purchase Invoice / Bill</div>
                    <div className="text-[10px] text-slate-500">نیا خریداری بل درج کریں</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-bold">
                  F3
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-white">Receive Payment Entry (وصول رقم واؤچر)</div>
                    <div className="text-[10px] text-slate-500">کسٹمر سے رقم وصولی کا واؤچر</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono font-bold">
                  F4
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-white">All Data Search (Global ERP)</div>
                    <div className="text-[10px] text-slate-500">تمام ریکارڈز تلاش: انوائس، مال، کسٹمر، واؤچر، چیک</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-bold">
                  F5
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Boxes className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-white">New Stock Entry (نیا اسٹاک اندراج)</div>
                    <div className="text-[10px] text-slate-500">نیا پروڈکٹ / پرزہ بمعہ تصویر درج کریں</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono font-bold">
                  F6
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-4 h-4 text-teal-400" />
                  <div>
                    <div className="font-semibold text-white">Bank Entry &amp; Add New Bank</div>
                    <div className="text-[10px] text-slate-500">بینک ڈپازٹ، ٹرانسفر یا نیا بینک اکاؤنٹ شامل کریں</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-300 font-mono font-bold">
                  Alt + B
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-semibold text-white">Journal Voucher Entry (جنرل واؤچر)</div>
                    <div className="text-[10px] text-slate-500">کھاتوں میں ایڈجسٹمنٹ و ڈبل انٹری</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono font-bold">
                  Alt + J
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
                <div className="flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
                  <div>
                    <div className="font-semibold text-white">Copilot Voice Communication (صوتی رابطہ)</div>
                    <div className="text-[10px] text-purple-300">بول کر فوری رہنمائی و سوالات دریافت کریں</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono font-bold">
                  Alt + V
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold text-white">Print Active Invoice / Voucher</div>
                    <div className="text-[10px] text-slate-500">انوائس یا سلپ پرنٹ کریں</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono font-bold">
                  Ctrl + P
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Save className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-semibold text-white">Save Form / Submit Invoice</div>
                    <div className="text-[10px] text-slate-500">فارم یا بل محفوظ کریں</div>
                  </div>
                </div>
                <kbd className="px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 font-mono font-bold">
                  Ctrl + S
                </kbd>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsShortcutsHelpOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

