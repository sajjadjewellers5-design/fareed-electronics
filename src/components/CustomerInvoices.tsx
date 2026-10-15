import React, { useState, useEffect, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  Trash2,
  DollarSign,
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  UserPlus,
  MessageCircle,
  Boxes,
  Languages,
  Truck,
  ArrowRightLeft,
  Undo2,
  Edit3,
  Tag,
  Barcode,
  QrCode,
  Scan,
  BookOpen,
  Save,
} from 'lucide-react';
import { CustomerInvoice, InvoiceItem, Product } from '../types';
import { useApp } from '../context/AppContext';
import { EditInvoiceModal } from './EditInvoiceModal';

export const CustomerInvoices: React.FC = () => {
  const {
    invoices,
    products,
    customers,
    bankAccounts,
    createInvoice,
    recordInvoicePayment,
    deleteInvoice,
    formatCurrency,
    setSelectedInvoiceForPrint,
    setPreviewImage,
    addCustomer,
    isCreateInvoiceModalOpen,
    setIsCreateInvoiceModalOpen,
    setIsNewCustomerModalOpen,
    setWhatsAppModalInvoice,
    setIsBiltyUpdateModalOpen,
    setSelectedInvoiceForBilty,
    createJournalVoucher,
    setSelectedVoucherForPrint,
    getNextInvoiceNumber,
    isSaleReturnModalOpen,
    setIsSaleReturnModalOpen,
    saleReturnInvoices,
    setIsTagPrintingModalOpen,
    openPrintPreview,
    playScannerBeep,
    setSelectedCustomerForLedger,
    language,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PARTIAL' | 'UNPAID'>('ALL');
  const [autoCreateJV, setAutoCreateJV] = useState(true);

  // Modals
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<CustomerInvoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<CustomerInvoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<CustomerInvoice | null>(null);

  // New Invoice form state
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK' | 'CREDIT' | 'ONLINE'>('CASH');
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id || '');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');

  // Bilty / Transport form state
  const [biltyNumber, setBiltyNumber] = useState('');
  const [transportName, setTransportName] = useState('Daewoo Cargo Express');
  const [destinationStation, setDestinationStation] = useState('');
  const [cartonCount, setCartonCount] = useState<number>(1);

  // Form feedback messages
  const [invoiceSuccessMsg, setInvoiceSuccessMsg] = useState<string | null>(null);
  const [invoiceErrorMsg, setInvoiceErrorMsg] = useState<string | null>(null);

  // Line items state
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      productId: '',
      productName: '',
      sku: '',
      unitPrice: 0,
      costPrice: 0,
      quantity: 1,
      discount: 0,
      warranty: '30 Days Lab Testing Warranty',
      total: 0,
    },
  ]);

  // Payment Recording modal state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payBankAccountId, setPayBankAccountId] = useState(bankAccounts[0]?.id || '');
  const [paySlipImage, setPaySlipImage] = useState<string>('');
  const [payNotes, setPayNotes] = useState('');
  // F2 Stock Item Selector & Fast Browse state
  const [isStockSelectorOpen, setIsStockSelectorOpen] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('ALL');

  // Filtered stock products for F2 selector
  const filteredStockProducts = useMemo(() => {
    return products.filter((p) => {
      const q = stockSearchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.tagNo && p.tagNo.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);

      if (!matchesQuery) return false;
      if (stockCategoryFilter !== 'ALL' && p.category !== stockCategoryFilter) return false;
      return true;
    });
  }, [products, stockSearchQuery, stockCategoryFilter]);

  // Handle selecting an item from F2 Stock Selector
  const handleSelectStockItem = (p: Product) => {
    setItems((prev) => {
      const emptyIdx = prev.findIndex((item) => !item.productId);
      const newLineItem: InvoiceItem = {
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        unitPrice: p.sellingPrice,
        costPrice: p.costPrice,
        quantity: 1,
        discount: 0,
        warranty: '30 Days Lab Testing Warranty',
        total: p.sellingPrice,
        tagNo: p.tagNo || '',
      };

      if (emptyIdx !== -1) {
        const next = [...prev];
        next[emptyIdx] = newLineItem;
        return next;
      }
      return [...prev, newLineItem];
    });

    playScannerBeep(true);
    setLastScannedFeedback(`✓ Selected & Added [${p.name}] - 1 Pcs (${p.stockQuantity} Pcs available)`);
    setTimeout(() => setLastScannedFeedback(null), 3500);
  };

  // Calculations for current form
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const calculatedTax = (subtotal - discountAmount) * (taxPercent / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + calculatedTax);
  const dueBalance = Math.max(0, grandTotal - paidAmount);

  // Handle selecting an existing customer
  const handleCustomerSelect = (id: string) => {
    setCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerAddress(found.address || '');
    }
  };

  // Tag & Barcode Quick Scanner State
  const [scannerInput, setScannerInput] = useState('');
  const [lastScannedFeedback, setLastScannedFeedback] = useState<string | null>(null);

  // Auto-connect sale with tag scanner: scans tag and instantly adds/increments item in pieces!
  const handleScanTag = (scannedCode: string) => {
    const code = scannedCode.trim().toLowerCase();
    if (!code) return;

    // Search product by tagNo, sku, id, or name
    const matched = products.find(
      (p) =>
        (p.tagNo && p.tagNo.toLowerCase() === code) ||
        (p.sku && p.sku.toLowerCase() === code) ||
        p.id.toLowerCase() === code ||
        p.name.toLowerCase() === code
    );

    if (matched) {
      playScannerBeep(true);
      setLastScannedFeedback(`✓ Scanned [${matched.tagNo || matched.sku}]: ${matched.name} (+1 Pcs)`);
      setTimeout(() => setLastScannedFeedback(null), 3500);

      setItems((prev) => {
        // If line item with this productId already exists, increment its pieces quantity
        const existingIdx = prev.findIndex((line) => line.productId === matched.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          const curr = { ...updated[existingIdx] };
          curr.quantity += 1;
          curr.total = Math.max(0, (curr.unitPrice - curr.discount) * curr.quantity);
          updated[existingIdx] = curr;
          return updated;
        }

        // If the first row is blank/unselected, fill it
        if (prev.length === 1 && !prev[0].productId) {
          return [
            {
              productId: matched.id,
              productName: matched.name,
              sku: matched.sku,
              unitPrice: matched.salePrice,
              costPrice: matched.costPrice,
              quantity: 1,
              discount: 0,
              warranty: 'Standard Warranty',
              tagNo: matched.tagNo,
              total: matched.salePrice,
            },
          ];
        }

        // Otherwise append new line item
        return [
          ...prev,
          {
            productId: matched.id,
            productName: matched.name,
            sku: matched.sku,
            unitPrice: matched.salePrice,
            costPrice: matched.costPrice,
            quantity: 1,
            discount: 0,
            warranty: 'Standard Warranty',
            tagNo: matched.tagNo,
            total: matched.salePrice,
          },
        ];
      });

      setScannerInput('');
    } else {
      playScannerBeep(false);
      setLastScannedFeedback(`✗ Tag/Barcode "${scannedCode}" not found in stock!`);
      setTimeout(() => setLastScannedFeedback(null), 3500);
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
        unitPrice: 0,
        costPrice: 0,
        quantity: 1,
        discount: 0,
        warranty: '30 Days Lab Testing Warranty',
        total: 0,
      },
    ]);
  };

  // Remove line item
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Update line item
  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
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
          item.unitPrice = product.salePrice;
          item.costPrice = product.costPrice;
          item.tagNo = product.tagNo;
          item.total = (product.salePrice - item.discount) * item.quantity;
        }
      } else if (field === 'tagNo') {
        const tag = String(value);
        item.tagNo = tag;
        const matched = products.find(
          (p) => p.tagNo && p.tagNo.toLowerCase() === tag.trim().toLowerCase()
        );
        if (matched) {
          item.productId = matched.id;
          item.productName = matched.name;
          item.sku = matched.sku;
          item.unitPrice = matched.salePrice;
          item.costPrice = matched.costPrice;
          item.total = Math.max(0, (matched.salePrice - item.discount) * item.quantity);
        }
      } else if (field === 'quantity') {
        const qty = Number(value) || 1;
        item.quantity = qty;
        item.total = Math.max(0, (item.unitPrice - item.discount) * qty);
      } else if (field === 'unitPrice') {
        const price = Number(value) || 0;
        item.unitPrice = price;
        item.total = Math.max(0, (price - item.discount) * item.quantity);
      } else if (field === 'discount') {
        const disc = Number(value) || 0;
        item.discount = disc;
        item.total = Math.max(0, (item.unitPrice - disc) * item.quantity);
      } else if (field === 'warranty') {
        item.warranty = String(value);
      }

      updated[index] = item;
      return updated;
    });
  };

  // Handle image upload from file
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setReceiptImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Submit New Invoice
  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceErrorMsg(null);
    setInvoiceSuccessMsg(null);

    if (!customerName || items.length === 0 || !items[0].productId) {
      setInvoiceErrorMsg('Please select a customer and at least one valid product.');
      return;
    }

    // Tag No link with stock (IF TAG NO NOT IN STOCK INVOICE NOT CREAT)
    for (const item of items) {
      const currentTag = item.tagNo?.trim();
      if (currentTag) {
        const matchingProduct = products.find(
          (p) =>
            (p.tagNo && p.tagNo.toLowerCase() === currentTag.toLowerCase()) ||
            p.id === item.productId
        );
        if (!matchingProduct || matchingProduct.stockQuantity <= 0) {
          setInvoiceErrorMsg(
            `Tag No "${currentTag}" (${item.productName || 'Item'}) is NOT in stock or has 0 quantity! Invoice cannot be created (اسٹاک میں موجود نہ ہونے کی وجہ سے انوائس نہیں بن سکتی).`
          );
          return;
        }
      }
    }

    // Auto-create or link customer
    let activeCustId = customerId;
    if (!activeCustId) {
      const existing = customers.find(
        (c) => c.name.trim().toLowerCase() === customerName.trim().toLowerCase()
      );
      if (existing) {
        activeCustId = existing.id;
      } else {
        const newCust = addCustomer({
          name: customerName.trim(),
          phone: customerPhone,
          address: customerAddress,
        });
        activeCustId = newCust.id;
      }
    }

    const selectedBank = bankAccounts.find((b) => b.id === bankAccountId);
    const paymentStatus: CustomerInvoice['paymentStatus'] =
      dueBalance <= 0 ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID';

    const created = createInvoice({
      date: invoiceDate,
      dueDate: dueDate,
      customerId: activeCustId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      subtotal,
      discountAmount,
      taxPercent,
      taxAmount: calculatedTax,
      grandTotal,
      paidAmount,
      dueBalance,
      paymentStatus,
      paymentMethod,
      bankAccountId: paidAmount > 0 ? bankAccountId : undefined,
      bankAccountName: paidAmount > 0 ? selectedBank?.accountName : undefined,
      notes,
      receiptImage: receiptImage || undefined,
      biltyNumber: biltyNumber.trim() || undefined,
      transportName: biltyNumber.trim() ? transportName : undefined,
      destinationStation: destinationStation.trim() || undefined,
      cartonCount: cartonCount || undefined,
    });

    // Also auto-create Journal Entry if enabled
    if (autoCreateJV) {
      createJournalVoucher({
        date: invoiceDate,
        debitAccountId: customerId || 'cust-cash',
        debitAccountName: `${customerName || 'Cash Customer'} (Customer A/C)`,
        creditAccountId: 'acc-sales',
        creditAccountName: 'Sales Turnover (سیلز ریونیو)',
        amount: grandTotal,
        narration: `Journal Entry for Invoice #${created.invoiceNumber} - ${customerName}`,
        voucherImage: receiptImage || undefined,
      });
    }

    // "WEN SAVE ANY IVOICE/VOCHER AUTOMIATICLY OPEN FOR NEW INVOICE/VOCHER":
    // Keep modal open and set up for next sequential invoice!
    setIsCreateInvoiceModalOpen(true);
    const nextInvNumber = getNextInvoiceNumber();
    setInvoiceSuccessMsg(
      `Invoice #${created.invoiceNumber} saved successfully! Form automatically open and ready for next invoice #${nextInvNumber}.`
    );

    // Reset form for next entry
    setCustomerId('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setBiltyNumber('');
    setItems([
      {
        productId: '',
        productName: '',
        sku: '',
        unitPrice: 0,
        costPrice: 0,
        quantity: 1,
        discount: 0,
        warranty: '30 Days Lab Testing Warranty',
        total: 0,
      },
    ]);
    setPaidAmount(0);
    setTaxPercent(0);
    setDiscountAmount(0);
    setNotes('');
    setReceiptImage('');

    // Set selected invoice for quick print if needed
    setSelectedInvoiceForPrint(created);
    return created;
  };

  // Quick Save & Print (Ctrl + P)
  const handleQuickSaveAndPrint = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const created = handleSubmitInvoice();
    if (created) {
      setSelectedInvoiceForPrint(created);
      setTimeout(() => {
        window.print();
      }, 350);
    }
  };

  // Event Listeners for global Ctrl+P and F2
  useEffect(() => {
    const handleQuickSavePrintEvent = () => {
      if (isCreateInvoiceModalOpen) {
        handleQuickSaveAndPrint();
      }
    };

    const handleToggleF2Stock = () => {
      if (isCreateInvoiceModalOpen) {
        setIsStockSelectorOpen((prev) => !prev);
      }
    };

    const handleOpenF2Stock = () => {
      setIsStockSelectorOpen(true);
    };

    window.addEventListener('erp-quick-save-and-print', handleQuickSavePrintEvent);
    window.addEventListener('erp-toggle-f2-stock-selector', handleToggleF2Stock);
    window.addEventListener('erp-open-f2-stock-selector', handleOpenF2Stock);

    return () => {
      window.removeEventListener('erp-quick-save-and-print', handleQuickSavePrintEvent);
      window.removeEventListener('erp-toggle-f2-stock-selector', handleToggleF2Stock);
      window.removeEventListener('erp-open-f2-stock-selector', handleOpenF2Stock);
    };
  }, [
    isCreateInvoiceModalOpen,
    items,
    customerId,
    customerName,
    customerPhone,
    customerAddress,
    invoiceDate,
    dueDate,
    subtotal,
    discountAmount,
    taxPercent,
    calculatedTax,
    grandTotal,
    paidAmount,
    dueBalance,
    paymentMethod,
    bankAccountId,
    notes,
    biltyNumber,
    transportName,
    destinationStation,
    cartonCount,
    autoCreateJV,
  ]);

  // Handle local modal F2 key inside Create Invoice
  useEffect(() => {
    if (!isCreateInvoiceModalOpen) {
      setIsStockSelectorOpen(false);
      return;
    }

    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        e.stopPropagation();
        setIsStockSelectorOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isStockSelectorOpen) {
        e.preventDefault();
        e.stopPropagation();
        setIsStockSelectorOpen(false);
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);
    return () => window.removeEventListener('keydown', handleModalKeyDown);
  }, [isCreateInvoiceModalOpen, isStockSelectorOpen]);

  // Create Journal Entry directly from existing invoice
  const handleCreateInvoiceJV = (inv: CustomerInvoice) => {
    const jv = createJournalVoucher({
      date: inv.date,
      debitAccountId: inv.customerId,
      debitAccountName: `${inv.customerName} (Customer A/C)`,
      creditAccountId: 'acc-sales',
      creditAccountName: 'Sales Turnover (سیلز ریونیو)',
      amount: inv.grandTotal,
      narration: `Journal Entry for Invoice #${inv.invoiceNumber} - ${inv.customerName}`,
      voucherImage: inv.receiptImage || undefined,
    });
    setSelectedVoucherForPrint(jv);
  };

  // Submit Payment Recording
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || payAmount <= 0) return;

    recordInvoicePayment(
      paymentModalInvoice.id,
      payAmount,
      payBankAccountId,
      payNotes,
      paySlipImage
    );

    setPaymentModalInvoice(null);
    setPayAmount(0);
    setPayNotes('');
    setPaySlipImage('');
  };

  // Filter invoices (Search with Phone No, Bilty No, Tag No, Invoice #, Customer)
  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return statusFilter === 'ALL' || inv.paymentStatus === statusFilter;

    const cleanQ = q.replace(/[^0-9a-z]/gi, '');
    const cleanPhone = (inv.customerPhone || '').replace(/[^0-9]/g, '');
    const cleanBilty = (inv.biltyNumber || '').toLowerCase();

    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      (inv.customerPhone && inv.customerPhone.includes(q)) ||
      (cleanQ && cleanPhone.includes(cleanQ)) ||
      cleanBilty.includes(q) ||
      inv.items.some(
        (item) =>
          item.productName.toLowerCase().includes(q) ||
          (item.tagNo && item.tagNo.toLowerCase().includes(q)) ||
          item.sku.toLowerCase().includes(q)
      );

    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span>Customer Sales &amp; Invoicing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create sales invoices, process sale returns, attach bilty numbers &amp; print thermal or A4 bills.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSaleReturnModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 shadow transition-all cursor-pointer"
            title="Create Sale Return Invoice (سیلز واپسی)"
          >
            <Undo2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Sale Return ({saleReturnInvoices.length})</span>
          </button>

          <button
            onClick={() => setIsTagPrintingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 shadow transition-all cursor-pointer"
            title="Print Product Price Tags & Barcodes (ٹیگ پرنٹ کریں)"
          >
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print Tags (ٹیگ پرنٹ)</span>
          </button>

          <button
            onClick={() => {
              setIsCreateInvoiceModalOpen(true);
              setPaidAmount(0);
              setInvoiceSuccessMsg(null);
              setInvoiceErrorMsg(null);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Sale Invoice</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-950/40 border border-white/20 font-mono text-[10px] font-bold">
              F2
            </kbd>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Invoice # (e.g. FE-INV), customer name, or phone number..."
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
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Invoices' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Invoice # &amp; Date</th>
                <th className="py-3 px-3">Customer Details</th>
                <th className="py-3 px-3">Items Sold</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
                <th className="py-3 px-3 text-right">Paid / Due</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No sales invoices found matching your search.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-cyan-400 text-xs">
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{inv.date}</div>
                      {inv.biltyNumber && (
                        <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-[10px] text-cyan-300 font-mono font-semibold">
                          <Truck className="w-3 h-3 text-cyan-400" />
                          <span>Bilty: {inv.biltyNumber}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-xs">{inv.customerName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{inv.customerPhone}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      <span className="font-semibold text-white">{inv.items.length} item(s)</span>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {inv.items.map((i) => i.productName).join(', ')}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-black text-white text-xs">
                      {formatCurrency(inv.grandTotal)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[11px]">
                      <div className="text-emerald-400 font-semibold">
                        Paid: {formatCurrency(inv.paidAmount)}
                      </div>
                      {inv.dueBalance > 0 && (
                        <div className="text-rose-400 font-bold">
                          Due: {formatCurrency(inv.dueBalance)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          inv.paymentStatus === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : inv.paymentStatus === 'PARTIAL'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.dueBalance > 0 && (
                          <button
                            onClick={() => {
                              setPaymentModalInvoice(inv);
                              setPayAmount(inv.dueBalance);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
                            title="Record Payment"
                          >
                            + Pay
                          </button>
                        )}

                        {/* Journal Entry (JV) button for invoice */}
                        <button
                          onClick={() => handleCreateInvoiceJV(inv)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Generate Journal Entry (JV جنرل واؤچر انٹری بنائیں)"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>

                        {/* Bilty update button */}
                        <button
                          onClick={() => {
                            setSelectedInvoiceForBilty(inv);
                            setIsBiltyUpdateModalOpen(true);
                          }}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            inv.biltyNumber
                              ? 'text-cyan-400 hover:bg-cyan-500/10'
                              : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                          }`}
                          title={inv.biltyNumber ? `Bilty #${inv.biltyNumber} (${inv.transportName})` : 'Attach Bilty / Cargo (بلٹی لگائیں)'}
                        >
                          <Truck className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setWhatsAppModalInvoice(inv)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                          title="WhatsApp Invoice to Customer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openPrintPreview('INVOICE', inv)}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Show Print Preview (پرنٹ پرویو دیکھیں)"
                        >
                          <Eye className="w-4 h-4 text-cyan-400" />
                        </button>

                        <button
                          onClick={() => {
                            const target = customers.find(
                              (c) =>
                                (inv.customerId && c.id === inv.customerId) ||
                                (inv.customerName &&
                                  c.name.trim().toLowerCase() === inv.customerName.trim().toLowerCase())
                            );
                            if (target) {
                              setSelectedCustomerForLedger(target);
                            } else {
                              setSelectedCustomerForLedger({
                                id: inv.customerId || `cust-${Date.now()}`,
                                name: inv.customerName,
                                phone: inv.customerPhone,
                                address: inv.customerAddress,
                                totalPurchased: inv.grandTotal,
                                currentBalance: inv.dueBalance,
                              });
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer"
                          title="View Customer Ledger & Statement (کسٹمر لیجر کھاتہ دیکھیں)"
                        >
                          <BookOpen className="w-4 h-4 text-purple-400" />
                        </button>

                        <button
                          onClick={() => setSelectedInvoiceForPrint(inv)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Normal Print Bill (A4 / Thermal)"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedInvoiceForPrint(inv)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Convert & Print in Urdu (اردو بل)"
                        >
                          <Languages className="w-4 h-4 text-amber-400" />
                        </button>

                        <button
                          onClick={() => setEditingInvoice(inv)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Sale Invoice (ترمیم بل)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setInvoiceToDelete(inv)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer group"
                          title="Delete Invoice"
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

      {/* CREATE INVOICE MODAL */}
      {isCreateInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl p-5 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Receipt className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-bold text-base">Create New Customer Sales Invoice</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                  F2
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span>Next Guaranteed Unique #:</span>
                  <span className="text-white font-black">{getNextInvoiceNumber()}</span>
                  <span className="text-[9px] text-emerald-400 font-sans hidden sm:inline">(Never Reuses Previous / Deleted #)</span>
                </span>
              </div>
              <button
                onClick={() => setIsCreateInvoiceModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {invoiceSuccessMsg && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{invoiceSuccessMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setInvoiceSuccessMsg(null)}
                  className="text-emerald-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {invoiceErrorMsg && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{invoiceErrorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setInvoiceErrorMsg(null)}
                  className="text-rose-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSubmitInvoice} className="space-y-4 text-xs p-6 pt-4">
              {/* Customer details row */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-slate-300 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Customer Information &amp; Bilty Cargo Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-400 font-medium">Existing Customer (گاہک)</label>
                      <button
                        type="button"
                        onClick={() => setIsNewCustomerModalOpen(true)}
                        className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                        title="F1: Register New Customer"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>+ New Customer</span>
                      </button>
                    </div>
                    <select
                      value={customerId}
                      onChange={(e) => handleCustomerSelect(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Choose Existing or Enter New Below --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone}) - [Bal: {formatCurrency(c.totalBalance || 0)}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Asad Tech Lab"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 font-medium mb-1">Address / Lab Location</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Shop #, Plaza, City"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Invoice Date</label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bilty No & Transport Cargo Options (User Explicit Requirement) */}
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1 flex items-center justify-between">
                      <span>Bilty No (بلٹی نمبر)</span>
                      <span className="text-[10px] text-cyan-400 font-mono">Bilty Option</span>
                    </label>
                    <input
                      type="text"
                      value={biltyNumber}
                      onChange={(e) => setBiltyNumber(e.target.value)}
                      placeholder="e.g. BLT-98124"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Transport / Courier (ٹرانسپورٹ)
                    </label>
                    <input
                      type="text"
                      value={transportName}
                      onChange={(e) => setTransportName(e.target.value)}
                      placeholder="e.g. Daewoo Cargo, Faisal Movers"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Destination City / Station (منزل اسٹیشن)
                    </label>
                    <input
                      type="text"
                      value={destinationStation}
                      onChange={(e) => setDestinationStation(e.target.value)}
                      placeholder="e.g. Multan, Rawalpindi, Karachi"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-slate-300 font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                    <span>Line Items &amp; Parts Sold</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* F2: Show Stock Items & Select Item */}
                    <button
                      type="button"
                      onClick={() => setIsStockSelectorOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 border border-cyan-400/50 cursor-pointer transition-all active:scale-95"
                      title="F2: Open Stock Items Selector and Select Item"
                    >
                      <Boxes className="w-4 h-4 text-cyan-200 animate-pulse" />
                      <span>[F2] Show Stock &amp; Select Item (دستیاب اسٹاک)</span>
                      <kbd className="px-1.5 py-0.2 rounded bg-slate-950 font-mono text-[9px] font-bold border border-cyan-400/60">
                        F2
                      </kbd>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 cursor-pointer"
                    >
                      + Add Row
                    </button>
                  </div>
                </div>

                {/* ⚡ Hardware Tag & Barcode Fast Scanner Bar (Auto-adds item in pieces!) */}
                <div className="p-3 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 rounded-xl border border-indigo-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                      <Barcode className="w-4 h-4 text-cyan-400" />
                      <span>Tag &amp; Barcode Fast Scanner (ٹیگ اسکینر سے خودکار سیل انٹری)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900 text-indigo-200 border border-indigo-500/30 font-mono">
                        Auto-Connect Sale
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Scan className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={scannerInput}
                        onChange={(e) => setScannerInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleScanTag(scannerInput);
                          }
                        }}
                        placeholder="Scan or type Tag # / Barcode (e.g. TAG-1001, SKU) and press Enter to auto-add..."
                        className="w-full pl-9 pr-24 py-2 bg-slate-950 border border-indigo-500/50 rounded-xl text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleScanTag(scannerInput)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        + Add Tag
                      </button>
                    </div>
                  </div>

                  {/* Feedback notification toast */}
                  {lastScannedFeedback && (
                    <div
                      className={`text-xs px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-2 transition-all ${
                        lastScannedFeedback.startsWith('✓')
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-current animate-ping" />
                      <span>{lastScannedFeedback}</span>
                    </div>
                  )}

                  {/* Quick tag chips for testing */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                    <span className="text-slate-400 text-[10px]">Quick Tags:</span>
                    {products
                      .filter((p) => p.tagNo)
                      .slice(0, 5)
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleScanTag(p.tagNo!)}
                          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-indigo-900 border border-slate-700 text-indigo-300 font-mono text-[10px] transition-colors cursor-pointer"
                          title={`Click to simulate scanning ${p.name}`}
                        >
                          {p.tagNo} ({p.name.slice(0, 14)}...)
                        </button>
                      ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {items.map((line, idx) => {
                    const selectedProd = products.find((p) => p.id === line.productId);
                    const stockAvail = selectedProd ? selectedProd.stockQuantity : null;

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 items-end"
                      >
                        {/* Product selection */}
                        <div className="sm:col-span-4">
                          <label className="block text-slate-400 text-[10px] mb-1">
                            Component / SKU *
                          </label>
                          <select
                            required
                            value={line.productId}
                            onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                          >
                            <option value="">-- Choose Stock Component --</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.sku}) - [{p.stockQuantity} in stock]
                              </option>
                            ))}
                          </select>
                          {stockAvail !== null && (
                            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px]">
                              <span
                                className={`px-1.5 py-0.2 rounded font-semibold ${
                                  stockAvail <= 0
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : stockAvail < line.quantity
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {stockAvail <= 0
                                  ? 'Out of Stock (0 remaining)'
                                  : stockAvail < line.quantity
                                  ? `Low Stock: Only ${stockAvail} available`
                                  : `In Stock: ${stockAvail} ${selectedProd?.unit}`}
                              </span>
                              {stockAvail > 0 && (
                                <span className="text-slate-400">
                                  &rarr; After sale: {Math.max(0, stockAvail - line.quantity)} {selectedProd?.unit}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Tag No / Barcode */}
                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 text-[10px] mb-1 flex items-center justify-between">
                            <span>Tag No / Barcode</span>
                            {line.tagNo && (
                              <span className="text-[9px] text-indigo-400 font-mono font-bold">✓ Tag</span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={line.tagNo || ''}
                            onChange={(e) => handleItemChange(idx, 'tagNo', e.target.value)}
                            placeholder="e.g. TAG-1001"
                            className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        {/* Warranty dropdown */}
                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 text-[10px] mb-1">
                            Warranty Terms
                          </label>
                          <select
                            value={line.warranty}
                            onChange={(e) => handleItemChange(idx, 'warranty', e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-cyan-500 focus:outline-none"
                          >
                            <option value="30 Days Lab Testing Warranty">30 Days Lab Testing</option>
                            <option value="7 Days Checking Warranty">7 Days Checking</option>
                            <option value="90 Days Lab Repair Warranty">90 Days Repair</option>
                            <option value="6 Months Replacement Warranty">6 Months Replacement</option>
                            <option value="1 Year Official Brand Warranty">1 Year Official</option>
                            <option value="Testing On Spot / No Return">Testing On Spot</option>
                          </select>
                        </div>

                        {/* Qty in Pieces */}
                        <div className="sm:col-span-1">
                          <label className="block text-cyan-300 font-bold text-[10px] mb-1">
                            Qty (Pcs / تعداد)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={line.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="sm:col-span-1">
                          <label className="block text-slate-400 text-[10px] mb-1">Unit Price</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={line.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        {/* Line Total */}
                        <div className="sm:col-span-2 flex items-center justify-between gap-1">
                          <div className="text-right flex-1">
                            <span className="block text-slate-400 text-[10px]">Total</span>
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
                    );
                  })}
                </div>
              </div>

              {/* Payment & "Own Pic Billing" Attachment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {/* Left: Financial breakdown & Banking */}
                <div className="space-y-3">
                  <div className="text-slate-300 font-bold text-xs uppercase tracking-wide">
                    Payment &amp; Banking Method
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as CustomerInvoice['paymentMethod'])
                        }
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="CASH">Cash Counter</option>
                        <option value="BANK">Bank Wire / IBFT</option>
                        <option value="ONLINE">Online Portal</option>
                        <option value="CREDIT">On Credit (Khata)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Deposit To Account</label>
                      <select
                        value={bankAccountId}
                        onChange={(e) => setBankAccountId(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-500 focus:outline-none"
                      >
                        {bankAccounts.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.accountName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Paid Now</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Invoice Discount</label>
                      <input
                        type="number"
                        min="0"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Invoice Memo / Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Lab repair delivery, courier tracking number..."
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Right: Invoice Totals & Summary Box */}
                <div className="space-y-3 flex flex-col justify-between">
                  {/* Summary Box */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-slate-400 text-xs">
                      <span>Subtotal:</span>
                      <span className="font-mono text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 text-xs">
                        <span>Discount:</span>
                        <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-bold text-sm border-t border-slate-800 pt-1.5">
                      <span>Grand Total:</span>
                      <span className="font-mono text-cyan-400">{formatCurrency(grandTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-slate-400">Balance Due:</span>
                      <span
                        className={`font-mono font-bold ${
                          dueBalance > 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {formatCurrency(dueBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoCreateJV}
                      onChange={(e) => setAutoCreateJV(e.target.checked)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-950"
                    />
                    <span className="font-semibold text-cyan-300">Auto-create Journal Entry (JV واؤچر اندراج)</span>
                  </label>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">|</span>
                  <span className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5">
                    <span>Press</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[10px]">
                      Ctrl + S
                    </kbd>
                    <span>to save</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreateInvoiceModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                  >
                    Cancel (Esc)
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickSaveAndPrint}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-bold shadow-md shadow-purple-600/30 border border-purple-400/50 cursor-pointer active:scale-95 transition-all"
                    title="Ctrl + P: Quick Save and Print Invoice"
                  >
                    <Printer className="w-4 h-4 text-purple-200" />
                    <span>Quick Save &amp; Print</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-purple-950 font-mono text-[10px] border border-purple-500/50">
                      Ctrl+P
                    </kbd>
                  </button>
                  <button
                    id="btn-save-invoice"
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Invoice (محفوظ کریں)</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-950/40 text-[10px] font-mono text-slate-950 font-bold">
                      Ctrl+S
                    </kbd>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Record Customer Payment</span>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">
                Invoice: <span className="font-mono text-cyan-400 font-bold">{paymentModalInvoice.invoiceNumber}</span>
              </div>
              <div className="text-white font-bold">{paymentModalInvoice.customerName}</div>
              <div className="text-rose-400 font-mono font-bold text-sm">
                Remaining Balance Due: {formatCurrency(paymentModalInvoice.dueBalance)}
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Amount Received *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={paymentModalInvoice.dueBalance}
                  step="any"
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-base font-bold focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Deposit Into Bank / Cash Account
                </label>
                <select
                  value={payBankAccountId}
                  onChange={(e) => setPayBankAccountId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.accountName} ({formatCurrency(b.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Deposit Slip Attachment */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Attach Deposit / Bank Slip Copy (Optional)
                </label>
                <div className="p-2.5 bg-slate-950 border border-dashed border-slate-700 rounded-xl space-y-2">
                  <label className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>Upload Slip Image (JPG / PNG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePayImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {paySlipImage && (
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                      <span>Slip photo attached ✓</span>
                      <button
                        type="button"
                        onClick={() => setPaySlipImage('')}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Payment Reference / Memo</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Received via Bank Transfer TRX-9921"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DELETE INVOICE CONFIRMATION MODAL */}
      {invoiceToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Customer Invoice?</h3>
                <p className="text-xs text-rose-400 font-mono font-semibold">
                  {invoiceToDelete.invoiceNumber}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-white">{invoiceToDelete.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice Date:</span>
                  <span className="font-mono text-slate-300">{invoiceToDelete.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Grand Total:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(invoiceToDelete.grandTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Items Count:</span>
                  <span className="text-cyan-400 font-semibold">
                    {invoiceToDelete.items.length} line items
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Automatic Ledger &amp; Stock Reversal</span>
                </div>
                <p className="text-amber-300/80 leading-relaxed">
                  Deleting will return all sold items back to your inventory stock and subtract{' '}
                  <b className="text-amber-200">{formatCurrency(invoiceToDelete.dueBalance)}</b> from customer's outstanding balance.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setInvoiceToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteInvoice(invoiceToDelete.id);
                  setInvoiceToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* F2 KEY: STOCK ITEMS SELECTOR MODAL */}
      {isStockSelectorOpen && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-cyan-500/70 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                  <Boxes className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white">
                      Stock Inventory &amp; Select Item for Sale (دستیاب اسٹاک لسٹ)
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                      F2 Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Browse all available inventory in Pieces (Pcs / عدد). Click "Select Item" to add directly to invoice.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStockSelectorOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
                title="Close (Esc or F2)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Categories Bar */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  placeholder="Search stock item name, SKU, barcode tag, or category..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-cyan-500/50 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              {/* Category Quick Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 text-xs">
                <button
                  type="button"
                  onClick={() => setStockCategoryFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                    stockCategoryFilter === 'ALL'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({products.length})
                </button>
                {Array.from(new Set(products.map((p) => p.category))).slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setStockCategoryFilter(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                      stockCategoryFilter === cat
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredStockProducts.map((p) => {
                  const isOutOfStock = p.stockQuantity <= 0;
                  const isLow = p.stockQuantity <= p.minStockLevel && !isOutOfStock;

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isOutOfStock
                          ? 'bg-slate-950/40 border-slate-800 opacity-60'
                          : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs truncate" title={p.name}>
                            {p.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-mono text-slate-400 border border-slate-700 shrink-0">
                            {p.sku}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                          <span>Rate: <strong className="text-cyan-300 font-bold">{formatCurrency(p.sellingPrice)}</strong></span>
                          <span>•</span>
                          <span>Tag: <strong className="text-indigo-400">{p.tagNo || 'None'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                              isOutOfStock
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : isLow
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span>
                              {isOutOfStock
                                ? '0 Pcs (Out of Stock)'
                                : `${p.stockQuantity} Pieces (${p.unit}) in Stock`}
                            </span>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectStockItem(p)}
                        className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer ${
                          isOutOfStock
                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-cyan-500/20'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Select (سلیکٹ)</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {filteredStockProducts.length === 0 && (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Boxes className="w-10 h-10 mx-auto opacity-40 text-cyan-400" />
                  <p className="text-sm font-semibold">No stock items found matching your search.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filteredStockProducts.length} inventory products</span>
              <button
                type="button"
                onClick={() => setIsStockSelectorOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
              >
                Close (Esc / F2)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sale Invoice Modal (User Requirement) */}
      {editingInvoice && (
        <EditInvoiceModal
          invoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
        />
      )}
    </div>
  );
};
