import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CompanyProfile,
  ProductItem,
  StockMovement,
  CustomerInvoice,
  PurchaseInvoice,
  BankAccount,
  BankTransaction,
  Customer,
  Supplier,
  AccountingVoucher,
  UserAccount,
  BackupSnapshot,
  Employee,
  SalarySlip,
  UserActivityLog,
  ThemeColor,
  SaleReturnInvoice,
  AutoBackupSettings,
  RateListVoucher,
  SystemPrinterSettings,
  StockAdjustmentVoucher,
} from '../types';
import {
  initialCompanyProfile,
  initialProducts,
  initialCustomers,
  initialSuppliers,
  initialBankAccounts,
  initialBankTransactions,
  initialCustomerInvoices,
  initialPurchaseInvoices,
  initialStockMovements,
  initialVouchers,
  initialUsers,
  initialEmployees,
  initialSalarySlips,
  initialActivityLogs,
  initialSaleReturns,
} from '../data/initialData';
import {
  Language,
  UrduFontTheme,
  translations,
} from '../data/translations';

interface AppContextType {
  // Language & Urdu Theme
  language: Language;
  setLanguage: (lang: Language) => void;
  urduFontTheme: UrduFontTheme;
  setUrduFontTheme: (theme: UrduFontTheme) => void;
  t: (key: keyof typeof translations.en) => string;

  // Clear / Reset All Data
  clearAllTransactionsAndDemoData: () => void;
  deleteAllData: (wipeInventory?: boolean) => void;
  clearEverySingleEntry: () => void;

  // Company Profile
  companyProfile: CompanyProfile;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;

  // User Authentication & Management
  currentUser: UserAccount | null;
  users: UserAccount[];
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  updateUser: (id: string, updates: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;

  // Snapshots & System Backup
  backupSnapshots: BackupSnapshot[];
  createBackupSnapshot: (name?: string) => BackupSnapshot;
  restoreBackupSnapshot: (snapshotId: string) => boolean;
  deleteBackupSnapshot: (snapshotId: string) => void;

  // Products / Stock
  products: ProductItem[];
  addProduct: (product: Omit<ProductItem, 'id' | 'lastUpdated'>) => ProductItem;
  updateProduct: (id: string, updates: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (
    productId: string,
    newQuantity: number,
    type: StockMovement['type'],
    notes?: string
  ) => void;

  // Stock Ledger
  stockMovements: StockMovement[];

  // Customer Invoices (Sales)
  invoices: CustomerInvoice[];
  createInvoice: (
    invoice: Omit<CustomerInvoice, 'id' | 'invoiceNumber' | 'createdAt'>
  ) => CustomerInvoice;
  recordInvoicePayment: (
    invoiceId: string,
    amount: number,
    bankAccountId: string,
    notes?: string,
    receiptImage?: string
  ) => void;
  updateInvoice: (invoiceId: string, invoiceData: Partial<CustomerInvoice>) => void;
  deleteInvoice: (id: string) => void;

  // Purchase Invoices (Purchases)
  purchaseInvoices: PurchaseInvoice[];
  createPurchaseInvoice: (
    purchase: Omit<PurchaseInvoice, 'id' | 'billNumber' | 'createdAt'>
  ) => PurchaseInvoice;
  updatePurchaseInvoice: (purchaseId: string, purchaseData: Partial<PurchaseInvoice>) => void;
  recordPurchasePayment: (
    purchaseId: string,
    amount: number,
    bankAccountId: string,
    notes?: string,
    slipImage?: string
  ) => void;
  deletePurchaseInvoice: (id: string) => void;

  // Accounting Vouchers (Receive Payment, Payable & Journal Vouchers)
  vouchers: AccountingVoucher[];
  createReceiptVoucher: (
    data: Omit<AccountingVoucher, 'id' | 'voucherNumber' | 'voucherType' | 'createdAt'>
  ) => AccountingVoucher;
  createPaymentVoucher: (
    data: Omit<AccountingVoucher, 'id' | 'voucherNumber' | 'voucherType' | 'createdAt'>
  ) => AccountingVoucher;
  createJournalVoucher: (data: {
    date: string;
    debitAccountId: string;
    debitAccountName: string;
    creditAccountId: string;
    creditAccountName: string;
    amount: number;
    narration: string;
    voucherImage?: string;
  }) => AccountingVoucher;
  deleteVoucher: (id: string) => void;
  selectedVoucherForPrint: AccountingVoucher | null;
  setSelectedVoucherForPrint: (v: AccountingVoucher | null) => void;
  isReceivePaymentModalOpen: boolean;
  setIsReceivePaymentModalOpen: (open: boolean) => void;
  isPaymentVoucherModalOpen: boolean;
  setIsPaymentVoucherModalOpen: (open: boolean) => void;
  isJournalVoucherModalOpen: boolean;
  setIsJournalVoucherModalOpen: (open: boolean) => void;
  lastAutoBackupTime: string;

  // Banking
  bankAccounts: BankAccount[];
  bankTransactions: BankTransaction[];
  addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => void;
  addBankTransaction: (
    transaction: Omit<BankTransaction, 'id'>
  ) => BankTransaction;
  deleteBankTransaction: (id: string) => void;

  // Parties
  customers: Customer[];
  suppliers: Supplier[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalPurchased' | 'currentBalance'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'totalSupplied' | 'currentBalance'>) => Supplier;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;

  // Data management
  resetToDefaultData: () => void;
  loadSampleData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;

  // Active view / modal state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedInvoiceForPrint: CustomerInvoice | null;
  setSelectedInvoiceForPrint: (inv: CustomerInvoice | null) => void;
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  formatCurrency: (amount: number) => string;

  // Global Shortcut Modal States (F1, F2, F3, F4, F5, Esc, WhatsApp, Clear Data)
  isNewCustomerModalOpen: boolean;
  setIsNewCustomerModalOpen: (open: boolean) => void;
  isCreateInvoiceModalOpen: boolean;
  setIsCreateInvoiceModalOpen: (open: boolean) => void;
  isCreatePurchaseModalOpen: boolean;
  setIsCreatePurchaseModalOpen: (open: boolean) => void;
  isShortcutsHelpOpen: boolean;
  setIsShortcutsHelpOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  isChequeSearchOpen: boolean;
  setIsChequeSearchOpen: (open: boolean) => void;
  isClearDemoDataModalOpen: boolean;
  setIsClearDemoDataModalOpen: (open: boolean) => void;
  whatsAppModalInvoice: CustomerInvoice | null;
  setWhatsAppModalInvoice: (inv: CustomerInvoice | null) => void;
  selectedCustomerForLedger: Customer | null;
  setSelectedCustomerForLedger: (c: Customer | null) => void;
  openCustomerLedger: (customerId: string) => void;

  // Theme
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;

  // Employees & Payroll
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  giveEmployeeAdvance: (employeeId: string, amount: number, bankAccountId: string, notes?: string) => void;

  // Salary Slips
  salarySlips: SalarySlip[];
  generateSalarySlip: (slip: Omit<SalarySlip, 'id' | 'slipNumber' | 'paidAt'>) => SalarySlip;
  paySalarySlip: (slipId: string, paymentMethod: 'CASH' | 'BANK', bankAccountId?: string) => void;
  deleteSalarySlip: (id: string) => void;
  selectedSalarySlipForPrint: SalarySlip | null;
  setSelectedSalarySlipForPrint: (slip: SalarySlip | null) => void;

  // User Activity Audit Log
  activityLogs: UserActivityLog[];
  logUserActivity: (action: UserActivityLog['action'], description: string, details?: string) => void;

  // Category Price Adjustment
  adjustCategoryPrices: (
    category: string,
    type: 'PERCENT' | 'FIXED',
    value: number,
    direction: 'INCREASE' | 'DECREASE',
    targetField: 'SALE' | 'COST' | 'BOTH'
  ) => { updatedCount: number };

  // Cheque Verification & Sound Reminder
  updateChequeStatus: (voucherId: string, status: 'CLEARED' | 'PENDING' | 'BOUNCED' | 'CLAIMED') => void;
  playChequeChimeSound: () => void;

  // Bilty / Transport Management
  isBiltyUpdateModalOpen: boolean;
  setIsBiltyUpdateModalOpen: (open: boolean) => void;
  selectedInvoiceForBilty: CustomerInvoice | null;
  setSelectedInvoiceForBilty: (inv: CustomerInvoice | null) => void;
  updateInvoiceBilty: (invoiceId: string, biltyData: Partial<CustomerInvoice>) => void;

  // Account Information & Shortcuts
  isAccountInfoModalOpen: boolean;
  setIsAccountInfoModalOpen: (open: boolean) => void;
  isNewProductModalOpen: boolean;
  setIsNewProductModalOpen: (open: boolean) => void;
  isBankEntryModalOpen: boolean;
  setIsBankEntryModalOpen: (open: boolean) => void;

  // Admin User Deletion & Owner Login
  deleteAllOtherUsers: () => { deletedCount: number };
  loginAsOwner: () => { success: boolean };

  // Sale Return Invoices
  saleReturnInvoices: SaleReturnInvoice[];
  createSaleReturnInvoice: (data: Omit<SaleReturnInvoice, 'id' | 'createdAt'>) => SaleReturnInvoice;
  deleteSaleReturnInvoice: (id: string) => void;
  selectedSaleReturnForPrint: SaleReturnInvoice | null;
  setSelectedSaleReturnForPrint: (sr: SaleReturnInvoice | null) => void;
  isSaleReturnModalOpen: boolean;
  setIsSaleReturnModalOpen: (open: boolean) => void;

  // Auto Backup Customization
  autoBackupSettings: AutoBackupSettings;
  setAutoBackupSettings: (settings: Partial<AutoBackupSettings>) => void;
  triggerManualAutoBackup: (downloadFile?: boolean) => void;

  // Rate List Voucher & Edit
  rateListVouchers: RateListVoucher[];
  createRateListVoucher: (data: Omit<RateListVoucher, 'id' | 'createdAt' | 'voucherNumber'>) => RateListVoucher;
  deleteRateListVoucher: (id: string) => void;
  selectedRateListForPrint: RateListVoucher | null;
  setSelectedRateListForPrint: (rl: RateListVoucher | null) => void;
  isRateListModalOpen: boolean;
  setIsRateListModalOpen: (open: boolean) => void;

  // Strict Sequential Next Numbers & Historical Record (Guaranteed NEVER repeat or reuse previous/deleted numbers)
  historicalInvoiceNumbers: string[];
  historicalPurchaseNumbers: string[];
  historicalVoucherNumbers: string[];
  historicalSaleReturnNumbers: string[];
  getNextInvoiceNumber: () => string;
  getNextPurchaseNumber: () => string;
  getNextVoucherNumber: (type: 'RECEIPT' | 'PAYMENT' | 'JOURNAL') => string;
  getNextSaleReturnNumber: () => string;

  // System Default Printer Link
  systemPrinterSettings: SystemPrinterSettings;
  updateSystemPrinterSettings: (settings: Partial<SystemPrinterSettings>) => void;
  triggerSystemPrint: () => void;

  // Tag Printing System
  isTagPrintingModalOpen: boolean;
  setIsTagPrintingModalOpen: (open: boolean) => void;
  selectedProductForTag: ProductItem | null;
  setSelectedProductForTag: (prod: ProductItem | null) => void;
  historicalTagNumbers: string[];
  lastTagSerialNumber: number;
  getNextTagSerialNumber: () => string;
  recordPrintedTagSerial: (tagNo: string) => void;

  // Stock Adjustment Voucher
  stockAdjustmentVouchers: StockAdjustmentVoucher[];
  createStockAdjustmentVoucher: (data: Omit<StockAdjustmentVoucher, 'id' | 'createdAt' | 'voucherNumber'>) => StockAdjustmentVoucher;
  deleteStockAdjustmentVoucher: (id: string) => void;
  isStockAdjustmentModalOpen: boolean;
  setIsStockAdjustmentModalOpen: (open: boolean) => void;
  selectedStockAdjustmentForPrint: StockAdjustmentVoucher | null;
  setSelectedStockAdjustmentForPrint: (sav: StockAdjustmentVoucher | null) => void;
  historicalAdjustmentNumbers: string[];
  getNextAdjustmentNumber: () => string;

  // Universal Print Preview
  isPrintPreviewOpen: boolean;
  setIsPrintPreviewOpen: (open: boolean) => void;
  printPreviewData: { type: 'INVOICE' | 'VOUCHER' | 'STOCK_ADJUSTMENT' | 'TAG'; data: any } | null;
  openPrintPreview: (type: 'INVOICE' | 'VOUCHER' | 'STOCK_ADJUSTMENT' | 'TAG', data: any) => void;

  // Startup Splash Animation (10s)
  isStartupSplashVisible: boolean;
  setIsStartupSplashVisible: (visible: boolean) => void;
  triggerStartupSplash: () => void;

  // Tag / Barcode Audio Beep Synthesizer
  playScannerBeep: (success?: boolean) => void;

  // AI Agent Guide & Software Guidelines
  isAIGuideModalOpen: boolean;
  setIsAIGuideModalOpen: (open: boolean) => void;
  aiGuideInitialTab: 'CHAT' | 'VOICE' | 'MANUAL';
  setAiGuideInitialTab: (tab: 'CHAT' | 'VOICE' | 'MANUAL') => void;
  openCopilotVoice: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'fe_erp_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<CustomerInvoice | null>(null);
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<AccountingVoucher | null>(null);
  const [isReceivePaymentModalOpen, setIsReceivePaymentModalOpen] = useState(false);
  const [isPaymentVoucherModalOpen, setIsPaymentVoucherModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Shortcut modal states
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [isCreatePurchaseModalOpen, setIsCreatePurchaseModalOpen] = useState(false);
  const [isJournalVoucherModalOpen, setIsJournalVoucherModalOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isChequeSearchOpen, setIsChequeSearchOpen] = useState(false);
  const [isClearDemoDataModalOpen, setIsClearDemoDataModalOpen] = useState(false);
  const [whatsAppModalInvoice, setWhatsAppModalInvoice] = useState<CustomerInvoice | null>(null);
  const [selectedCustomerForLedger, setSelectedCustomerForLedger] = useState<Customer | null>(null);
  const [lastAutoBackupTime, setLastAutoBackupTime] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PREFIX + 'last_autobackup') || 'Active (30m)';
  });

  // Language & Urdu font theme state
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'language');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const [urduFontTheme, setUrduFontThemeState] = useState<UrduFontTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'urdu_theme');
      return (saved as UrduFontTheme) || 'jameel-noori';
    } catch {
      return 'jameel-noori';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_PREFIX + 'language', lang);
  };

  const setUrduFontTheme = (theme: UrduFontTheme) => {
    setUrduFontThemeState(theme);
    localStorage.setItem(STORAGE_KEY_PREFIX + 'urdu_theme', theme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('data-lang', language);
    document.documentElement.setAttribute('data-urdu-theme', urduFontTheme);
    if (language === 'ur') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.removeAttribute('dir');
    }
  }, [language, urduFontTheme]);

  const t = (key: keyof typeof translations.en) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // Helper for localStorage with initial fallback
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const isInitialized = localStorage.getItem(STORAGE_KEY_PREFIX + 'initialized');
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + key);

      // If initialized and key exists in storage, trust saved value even if empty array []
      if (isInitialized && saved !== null) {
        return JSON.parse(saved);
      }

      // First run before initialization: use fallback and mark initialized
      if (!saved) {
        localStorage.setItem(STORAGE_KEY_PREFIX + 'initialized', 'true');
        return fallback;
      }

      return JSON.parse(saved);
    } catch {
      return fallback;
    }
  };

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() =>
    loadStored('profile', initialCompanyProfile)
  );
  const [products, setProducts] = useState<ProductItem[]>(() =>
    loadStored('products', initialProducts)
  );
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() =>
    loadStored('stock_movements', [])
  );
  const [invoices, setInvoices] = useState<CustomerInvoice[]>(() =>
    loadStored('invoices', [])
  );
  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>(() =>
    loadStored('purchase_invoices', [])
  );
  const [vouchers, setVouchers] = useState<AccountingVoucher[]>(() =>
    loadStored('vouchers', [])
  );
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() =>
    loadStored('bank_accounts', initialBankAccounts)
  );
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(() =>
    loadStored('bank_transactions', [])
  );
  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadStored(
      'customers',
      initialCustomers.map((c) => ({ ...c, totalPurchased: 0, currentBalance: 0 }))
    )
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    loadStored(
      'suppliers',
      initialSuppliers.map((s) => ({ ...s, totalSupplied: 0, currentBalance: 0 }))
    )
  );
  const [users, setUsers] = useState<UserAccount[]>(() =>
    loadStored('users', initialUsers)
  );
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [backupSnapshots, setBackupSnapshots] = useState<BackupSnapshot[]>(() =>
    loadStored('snapshots', [])
  );

  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadStored('employees', initialEmployees)
  );
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>(() =>
    loadStored('salary_slips', initialSalarySlips)
  );
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>(() =>
    loadStored('activity_logs', initialActivityLogs)
  );
  const [theme, setThemeState] = useState<ThemeColor>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'theme');
      return (saved as ThemeColor) || 'peacock-blue';
    } catch {
      return 'peacock-blue';
    }
  });

  const setTheme = (newTheme: ThemeColor) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY_PREFIX + 'theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Modal states for user requests
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isBankEntryModalOpen, setIsBankEntryModalOpen] = useState(false);
  const [isBiltyUpdateModalOpen, setIsBiltyUpdateModalOpen] = useState(false);
  const [selectedInvoiceForBilty, setSelectedInvoiceForBilty] = useState<CustomerInvoice | null>(null);
  const [isAccountInfoModalOpen, setIsAccountInfoModalOpen] = useState(false);
  const [selectedSalarySlipForPrint, setSelectedSalarySlipForPrint] = useState<SalarySlip | null>(null);

  // Sale Return Invoices State
  const [saleReturnInvoices, setSaleReturnInvoices] = useState<SaleReturnInvoice[]>(() =>
    loadStored('sale_returns', initialSaleReturns)
  );
  const [selectedSaleReturnForPrint, setSelectedSaleReturnForPrint] = useState<SaleReturnInvoice | null>(null);
  const [isSaleReturnModalOpen, setIsSaleReturnModalOpen] = useState(false);

  // Auto Backup Settings State (30-Minute customizable)
  const [autoBackupSettings, setAutoBackupSettingsState] = useState<AutoBackupSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'autobackup_settings');
      return saved
        ? JSON.parse(saved)
        : {
            enabled: true,
            intervalMinutes: 30,
            autoDownloadJson: false,
            lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
    } catch {
      return {
        enabled: true,
        intervalMinutes: 30,
        autoDownloadJson: false,
        lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }
  });

  const setAutoBackupSettings = (updates: Partial<AutoBackupSettings>) => {
    setAutoBackupSettingsState((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY_PREFIX + 'autobackup_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // System Default Printer Link State
  const [systemPrinterSettings, setSystemPrinterSettingsState] = useState<SystemPrinterSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'printer_settings');
      return saved
        ? JSON.parse(saved)
        : {
            printerType: 'system_default',
            printerName: 'System Default Printer (سسٹم ڈیفالٹ پرنٹر)',
            autoPrintOnInvoiceSave: true,
            autoPrintOnVoucherSave: false,
            printCopies: 1,
          };
    } catch {
      return {
        printerType: 'system_default',
        printerName: 'System Default Printer (سسٹم ڈیفالٹ پرنٹر)',
        autoPrintOnInvoiceSave: true,
        autoPrintOnVoucherSave: false,
        printCopies: 1,
      };
    }
  });

  const updateSystemPrinterSettings = (updates: Partial<SystemPrinterSettings>) => {
    setSystemPrinterSettingsState((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY_PREFIX + 'printer_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const triggerSystemPrint = () => {
    window.print();
  };

  // Tag Printing System State
  const [isTagPrintingModalOpen, setIsTagPrintingModalOpen] = useState(false);
  const [selectedProductForTag, setSelectedProductForTag] = useState<ProductItem | null>(null);

  // Tag Serial Number Monotonic Progression State (Never prints previous number)
  const [historicalTagNumbers, setHistoricalTagNumbers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'historical_tag_numbers');
      return saved
        ? JSON.parse(saved)
        : ['TAG-1001', 'TAG-1002', 'TAG-1003', 'TAG-1004', 'TAG-1005', 'TAG-1006', 'TAG-1007', 'TAG-1008', 'TAG-1009', 'TAG-1010'];
    } catch {
      return [];
    }
  });

  const [lastTagSerialNumber, setLastTagSerialNumber] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'last_tag_seq');
      return saved ? parseInt(saved, 10) : 1010;
    } catch {
      return 1010;
    }
  });

  const getNextTagSerialNumber = (): string => {
    const currentYear = new Date().getFullYear();
    let nextSeq = lastTagSerialNumber + 1;
    let candidate = `TAG-${currentYear}-${String(nextSeq).padStart(5, '0')}`;
    while (
      products.some((p) => p.tagNo === candidate) ||
      historicalTagNumbers.includes(candidate)
    ) {
      nextSeq++;
      candidate = `TAG-${currentYear}-${String(nextSeq).padStart(5, '0')}`;
    }
    return candidate;
  };

  const recordPrintedTagSerial = (tagNo: string) => {
    setHistoricalTagNumbers((prev) => {
      if (prev.includes(tagNo)) return prev;
      const updated = [...prev, tagNo];
      localStorage.setItem(STORAGE_KEY_PREFIX + 'historical_tag_numbers', JSON.stringify(updated));
      return updated;
    });
    const match = tagNo.match(/(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > lastTagSerialNumber) {
        setLastTagSerialNumber(num);
        localStorage.setItem(STORAGE_KEY_PREFIX + 'last_tag_seq', String(num));
      }
    }
  };

  // Stock Adjustment Voucher State
  const [stockAdjustmentVouchers, setStockAdjustmentVouchers] = useState<StockAdjustmentVoucher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'stock_adjustment_vouchers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isStockAdjustmentModalOpen, setIsStockAdjustmentModalOpen] = useState(false);
  const [selectedStockAdjustmentForPrint, setSelectedStockAdjustmentForPrint] = useState<StockAdjustmentVoucher | null>(null);

  const [historicalAdjustmentNumbers, setHistoricalAdjustmentNumbers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'historical_sav_numbers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const getNextAdjustmentNumber = (): string => {
    const currentYear = new Date().getFullYear();
    const prefix = `SAV-${currentYear}-`;
    let maxNum = 0;
    stockAdjustmentVouchers.forEach((v) => {
      const match = v.voucherNumber?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    historicalAdjustmentNumbers.forEach((vNo) => {
      const match = vNo?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const stored = parseInt(localStorage.getItem(STORAGE_KEY_PREFIX + 'next_sav_seq') || '0', 10);
    if (stored > maxNum) maxNum = stored;

    let nextNum = maxNum + 1;
    let candidate = `${prefix}${String(nextNum).padStart(4, '0')}`;
    while (
      stockAdjustmentVouchers.some((v) => v.voucherNumber === candidate) ||
      historicalAdjustmentNumbers.includes(candidate)
    ) {
      nextNum++;
      candidate = `${prefix}${String(nextNum).padStart(4, '0')}`;
    }
    localStorage.setItem(STORAGE_KEY_PREFIX + 'next_sav_seq', String(nextNum));
    return candidate;
  };

  const createStockAdjustmentVoucher = (
    data: Omit<StockAdjustmentVoucher, 'id' | 'createdAt' | 'voucherNumber'>
  ): StockAdjustmentVoucher => {
    const voucherNumber = getNextAdjustmentNumber();
    const newVoucher: StockAdjustmentVoucher = {
      ...data,
      id: `sav-${Date.now()}`,
      voucherNumber,
      createdAt: new Date().toISOString(),
    };

    setStockAdjustmentVouchers((prev) => {
      const updated = [newVoucher, ...prev];
      localStorage.setItem(STORAGE_KEY_PREFIX + 'stock_adjustment_vouchers', JSON.stringify(updated));
      return updated;
    });

    setHistoricalAdjustmentNumbers((prev) => {
      if (prev.includes(voucherNumber)) return prev;
      const updated = [...prev, voucherNumber];
      localStorage.setItem(STORAGE_KEY_PREFIX + 'historical_sav_numbers', JSON.stringify(updated));
      return updated;
    });

    // Automatically update product stock in Pieces
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === data.productId) {
          const oldStock = p.stockQuantity;
          const delta = data.quantity;
          const updatedStock =
            data.type === 'ADDITION'
              ? oldStock + delta
              : Math.max(0, oldStock - delta);

          // Add StockMovement record
          const movement: StockMovement = {
            id: `mov-${Date.now()}`,
            date: data.date,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            type: 'ADJUSTMENT',
            quantity: delta,
            previousStock: oldStock,
            newStock: updatedStock,
            referenceId: voucherNumber,
            notes: `Stock Adjustment [${voucherNumber}]: ${data.reasonCategory} - ${data.notes || ''}`,
          };
          setStockMovements((mPrev) => [movement, ...mPrev]);

          return {
            ...p,
            stockQuantity: updatedStock,
            lastUpdated: data.date,
          };
        }
        return p;
      })
    );

    return newVoucher;
  };

  const deleteStockAdjustmentVoucher = (id: string) => {
    setStockAdjustmentVouchers((prev) => {
      const updated = prev.filter((v) => v.id !== id);
      localStorage.setItem(STORAGE_KEY_PREFIX + 'stock_adjustment_vouchers', JSON.stringify(updated));
      return updated;
    });
  };

  // Universal Print Preview State
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [printPreviewData, setPrintPreviewData] = useState<{
    type: 'INVOICE' | 'VOUCHER' | 'STOCK_ADJUSTMENT' | 'TAG';
    data: any;
  } | null>(null);

  const openPrintPreview = (
    type: 'INVOICE' | 'VOUCHER' | 'STOCK_ADJUSTMENT' | 'TAG',
    data: any
  ) => {
    setPrintPreviewData({ type, data });
    setIsPrintPreviewOpen(true);
  };

  // Startup Splash Animation (10s)
  const [isStartupSplashVisible, setIsStartupSplashVisible] = useState(() => {
    // Show on initial session open
    return true;
  });

  const triggerStartupSplash = () => {
    setIsStartupSplashVisible(true);
  };

  // Tag / Barcode Audio Beep Synthesizer using Web Audio API
  const playScannerBeep = (success = true) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = success ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(success ? 1046.5 : 300, ctx.currentTime); // C6 or low error tone
      if (success) {
        osc.frequency.exponentialRampToValueAtTime(1318.5, ctx.currentTime + 0.08); // E6
      }

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {
      // Audio autoplay might be restricted before interaction; safe silent catch
    }
  };

  // AI Agent Guide Modal State & Voice Copilot
  const [isAIGuideModalOpen, setIsAIGuideModalOpen] = useState(false);
  const [aiGuideInitialTab, setAiGuideInitialTab] = useState<'CHAT' | 'VOICE' | 'MANUAL'>('CHAT');

  const openCopilotVoice = () => {
    setAiGuideInitialTab('VOICE');
    setIsAIGuideModalOpen(true);
    // Dispatch custom event to trigger auto-listening if already mounted
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('erp-open-voice-mode'));
    }, 50);
  };

  // Historical Used & Voided Sequence Numbers (Ensures NO previous number is ever generated again)
  const [historicalInvoiceNumbers, setHistoricalInvoiceNumbers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'historical_inv_numbers');
      if (saved) return JSON.parse(saved);
      return initialCustomerInvoices.map((i) => i.invoiceNumber);
    } catch {
      return initialCustomerInvoices.map((i) => i.invoiceNumber);
    }
  });

  const [historicalPurchaseNumbers, setHistoricalPurchaseNumbers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'historical_pur_numbers');
      if (saved) return JSON.parse(saved);
      return initialPurchaseInvoices.map((p) => p.billNumber);
    } catch {
      return initialPurchaseInvoices.map((p) => p.billNumber);
    }
  });

  const [historicalVoucherNumbers, setHistoricalVoucherNumbers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'historical_vch_numbers');
      if (saved) return JSON.parse(saved);
      return initialVouchers.map((v) => v.voucherNumber);
    } catch {
      return initialVouchers.map((v) => v.voucherNumber);
    }
  });

  const [historicalSaleReturnNumbers, setHistoricalSaleReturnNumbers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'historical_sr_numbers');
      if (saved) return JSON.parse(saved);
      return initialSaleReturns.map((s) => s.returnNumber);
    } catch {
      return initialSaleReturns.map((s) => s.returnNumber);
    }
  });

  // Rate List Voucher State
  const [rateListVouchers, setRateListVouchers] = useState<RateListVoucher[]>(() =>
    loadStored('rate_list_vouchers', [])
  );
  const [selectedRateListForPrint, setSelectedRateListForPrint] = useState<RateListVoucher | null>(null);
  const [isRateListModalOpen, setIsRateListModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'sale_returns', JSON.stringify(saleReturnInvoices));
  }, [saleReturnInvoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'rate_list_vouchers', JSON.stringify(rateListVouchers));
  }, [rateListVouchers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'salary_slips', JSON.stringify(salarySlips));
  }, [salarySlips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Auto-wipe demo records on startup to fulfill "all dimo data calear every singal entrys"
  useEffect(() => {
    const isWiped = localStorage.getItem(STORAGE_KEY_PREFIX + 'v3_demo_wiped');
    if (!isWiped) {
      setInvoices([]);
      setPurchaseInvoices([]);
      setVouchers([]);
      setBankTransactions([]);
      setStockMovements([]);
      setCustomers((prev) =>
        prev.map((c) => ({ ...c, totalPurchased: 0, currentBalance: 0 }))
      );
      setSuppliers((prev) =>
        prev.map((s) => ({ ...s, totalSupplied: 0, currentBalance: 0 }))
      );
      setBankAccounts((prev) =>
        prev.map((b) => ({ ...b, currentBalance: 0 }))
      );
      localStorage.setItem(STORAGE_KEY_PREFIX + 'invoices', JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'purchase_invoices', JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'vouchers', JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'bank_transactions', JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'stock_movements', JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'v3_demo_wiped', 'true');
    }
  }, []);

  // Automated Customizable Save and Backup System (Every 30 Minutes or Custom Interval)
  useEffect(() => {
    if (!autoBackupSettings.enabled) return;

    const intervalMs = Math.max(5, autoBackupSettings.intervalMinutes || 30) * 60 * 1000;

    const performAutoBackup = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const snapName = `[Auto-Backup ${autoBackupSettings.intervalMinutes}m] ${now.toLocaleDateString()} ${timeStr}`;

      const snapshot: BackupSnapshot = {
        id: `snap-${Date.now()}`,
        date: new Date().toLocaleString(),
        name: snapName,
        counts: {
          products: products.length,
          invoices: invoices.length,
          purchases: purchaseInvoices.length,
          vouchers: vouchers.length,
          transactions: bankTransactions.length,
        },
        payload: exportDataJson(),
      };

      setBackupSnapshots((prev) => [snapshot, ...prev.slice(0, 19)]);
      setLastAutoBackupTime(timeStr);
      setAutoBackupSettings({ lastSavedAt: timeStr });
      localStorage.setItem(STORAGE_KEY_PREFIX + 'last_autobackup', timeStr);

      if (autoBackupSettings.autoDownloadJson) {
        try {
          const blob = new Blob([snapshot.payload], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `fareed_erp_autobackup_${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch {
          // ignore download errors
        }
      }

      window.dispatchEvent(
        new CustomEvent('erp-auto-backup-done', { detail: { time: timeStr, name: snapName } })
      );
    };

    const intervalId = setInterval(performAutoBackup, intervalMs);
    return () => clearInterval(intervalId);
  }, [
    products,
    invoices,
    purchaseInvoices,
    vouchers,
    bankTransactions,
    customers,
    suppliers,
    autoBackupSettings.intervalMinutes,
    autoBackupSettings.enabled,
    autoBackupSettings.autoDownloadJson,
  ]);

  const triggerManualAutoBackup = (downloadFile = false) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const snapName = `[Manual/Customized Save] ${now.toLocaleDateString()} ${timeStr}`;
    const snap = createBackupSnapshot(snapName);
    setAutoBackupSettings({ lastSavedAt: timeStr });
    setLastAutoBackupTime(timeStr);
    if (downloadFile || autoBackupSettings.autoDownloadJson) {
      try {
        const jsonStr = exportDataJson();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fareed_backup_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        // ignore
      }
    }
    window.dispatchEvent(
      new CustomEvent('erp-auto-backup-done', { detail: { time: timeStr, name: snapName } })
    );
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'profile', JSON.stringify(companyProfile));
  }, [companyProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'snapshots', JSON.stringify(backupSnapshots));
  }, [backupSnapshots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'purchase_invoices', JSON.stringify(purchaseInvoices));
  }, [purchaseInvoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'bank_accounts', JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'bank_transactions', JSON.stringify(bankTransactions));
  }, [bankTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  // Format currency helper (Enforce Pakistani Rupee Rs.)
  const formatCurrency = (amount: number): string => {
    const symbol = companyProfile.currency || 'Rs.';
    return `${symbol} ${Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // Monotonic strictly sequential invoice & voucher number generators
  // Ensures new invoices/vouchers get the next sequential number and CANNOT repeat or duplicate previous numbers
  const getNextInvoiceNumber = (): string => {
    const prefix = `${companyProfile.invoicePrefix || 'FE-INV-'}${new Date().getFullYear()}-`;
    let maxNum = 0;
    invoices.forEach((inv) => {
      const match = inv.invoiceNumber?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    historicalInvoiceNumbers.forEach((invNo) => {
      const match = invNo?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const stored = parseInt(localStorage.getItem(STORAGE_KEY_PREFIX + 'next_inv_seq') || '0', 10);
    if (stored > maxNum) maxNum = stored;
    let nextNum = maxNum + 1;
    let candidate = `${prefix}${String(nextNum).padStart(4, '0')}`;
    while (
      invoices.some((i) => i.invoiceNumber === candidate) ||
      historicalInvoiceNumbers.includes(candidate)
    ) {
      nextNum++;
      candidate = `${prefix}${String(nextNum).padStart(4, '0')}`;
    }
    localStorage.setItem(STORAGE_KEY_PREFIX + 'next_inv_seq', String(nextNum));
    return candidate;
  };

  const getNextPurchaseNumber = (): string => {
    const prefix = `${companyProfile.purchasePrefix || 'FE-PUR-'}${new Date().getFullYear()}-`;
    let maxNum = 0;
    purchaseInvoices.forEach((pur) => {
      const match = pur.billNumber?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    historicalPurchaseNumbers.forEach((billNo) => {
      const match = billNo?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const stored = parseInt(localStorage.getItem(STORAGE_KEY_PREFIX + 'next_pur_seq') || '0', 10);
    if (stored > maxNum) maxNum = stored;
    let nextNum = maxNum + 1;
    let candidate = `${prefix}${String(nextNum).padStart(4, '0')}`;
    while (
      purchaseInvoices.some((p) => p.billNumber === candidate) ||
      historicalPurchaseNumbers.includes(candidate)
    ) {
      nextNum++;
      candidate = `${prefix}${String(nextNum).padStart(4, '0')}`;
    }
    localStorage.setItem(STORAGE_KEY_PREFIX + 'next_pur_seq', String(nextNum));
    return candidate;
  };

  const getNextVoucherNumber = (type: 'RECEIPT' | 'PAYMENT' | 'JOURNAL'): string => {
    const prefixCode = type === 'RECEIPT' ? 'RV' : type === 'PAYMENT' ? 'PV' : 'JV';
    const prefix = `FE-${prefixCode}-${new Date().getFullYear()}-`;
    let maxNum = 0;
    vouchers.filter((v) => v.voucherType === type).forEach((vch) => {
      const match = vch.voucherNumber?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    historicalVoucherNumbers.filter((no) => no.includes(`-${prefixCode}-`)).forEach((vNo) => {
      const match = vNo?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const key = `${STORAGE_KEY_PREFIX}next_vch_${prefixCode}_seq`;
    const stored = parseInt(localStorage.getItem(key) || '0', 10);
    if (stored > maxNum) maxNum = stored;
    let nextNum = maxNum + 1;
    let candidate = `${prefix}${String(nextNum).padStart(4, '0')}`;
    while (
      vouchers.some((v) => v.voucherNumber === candidate) ||
      historicalVoucherNumbers.includes(candidate)
    ) {
      nextNum++;
      candidate = `${prefix}${String(nextNum).padStart(4, '0')}`;
    }
    localStorage.setItem(key, String(nextNum));
    return candidate;
  };

  const getNextSaleReturnNumber = (): string => {
    const prefix = `FE-SR-${new Date().getFullYear()}-`;
    let maxNum = 0;
    saleReturnInvoices.forEach((sr) => {
      const match = sr.returnNumber?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    historicalSaleReturnNumbers.forEach((srNo) => {
      const match = srNo?.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const stored = parseInt(localStorage.getItem(STORAGE_KEY_PREFIX + 'next_sr_seq') || '0', 10);
    if (stored > maxNum) maxNum = stored;
    let nextNum = maxNum + 1;
    let candidate = `${prefix}${String(nextNum).padStart(4, '0')}`;
    while (
      saleReturnInvoices.some((s) => s.returnNumber === candidate) ||
      historicalSaleReturnNumbers.includes(candidate)
    ) {
      nextNum++;
      candidate = `${prefix}${String(nextNum).padStart(4, '0')}`;
    }
    localStorage.setItem(STORAGE_KEY_PREFIX + 'next_sr_seq', String(nextNum));
    return candidate;
  };

  const updateCompanyProfile = (updates: Partial<CompanyProfile>) => {
    setCompanyProfile((prev) => ({ ...prev, ...updates }));
  };

  // Product management (Merges quantity into existing item if same name exists)
  const addProduct = (item: Omit<ProductItem, 'id' | 'lastUpdated'>) => {
    const today = new Date().toISOString().split('T')[0];
    const normalizedName = item.name.trim().toLowerCase();
    const existingIndex = products.findIndex(
      (p) => p.name.trim().toLowerCase() === normalizedName
    );

    // USER REQUIREMENT: ALL NEW INVENTORY ITEM QUANTITY SAVE IN PREVIOUS SAME NAME QUANTITY
    if (existingIndex >= 0) {
      const existing = products[existingIndex];
      const prevStock = existing.stockQuantity;
      const addedQty = Number(item.stockQuantity) || 0;
      const updatedStock = prevStock + addedQty;

      const mergedProduct: ProductItem = {
        ...existing,
        stockQuantity: updatedStock,
        costPrice: item.costPrice || existing.costPrice,
        salePrice: item.salePrice || existing.salePrice,
        tagNo: item.tagNo || existing.tagNo,
        location: item.location || existing.location,
        category: item.category || existing.category,
        image: item.image || existing.image,
        notes: item.notes
          ? `${existing.notes ? existing.notes + ' | ' : ''}${item.notes}`
          : existing.notes,
        lastUpdated: today,
      };

      setProducts((prev) =>
        prev.map((p) => (p.id === existing.id ? mergedProduct : p))
      );

      if (addedQty > 0) {
        const movement: StockMovement = {
          id: `mov-${Date.now()}`,
          date: today,
          productId: existing.id,
          productName: existing.name,
          sku: existing.sku,
          type: 'IN',
          quantity: addedQty,
          previousStock: prevStock,
          newStock: updatedStock,
          notes: `Added quantity to existing product: +${addedQty} pcs (Merged with previous stock of ${prevStock} pcs)`,
        };
        setStockMovements((prev) => [movement, ...prev]);
      }
      return mergedProduct;
    }

    const newProduct: ProductItem = {
      ...item,
      id: `prod-${Date.now()}`,
      lastUpdated: today,
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Record initial stock entry
    if (newProduct.stockQuantity > 0) {
      const movement: StockMovement = {
        id: `mov-${Date.now()}`,
        date: today,
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        type: 'IN',
        quantity: newProduct.stockQuantity,
        previousStock: 0,
        newStock: newProduct.stockQuantity,
        notes: 'Initial stock intake upon product registration',
      };
      setStockMovements((prev) => [movement, ...prev]);
    }
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<ProductItem>) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const adjustStock = (
    productId: string,
    newQuantity: number,
    type: StockMovement['type'],
    notes?: string
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const prevQty = prod.stockQuantity;
    const diff = Math.abs(newQuantity - prevQty);

    updateProduct(productId, { stockQuantity: newQuantity });

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      type,
      quantity: diff,
      previousStock: prevQty,
      newStock: newQuantity,
      notes: notes || `Manual stock adjustment to ${newQuantity} ${prod.unit}`,
    };
    setStockMovements((prev) => [movement, ...prev]);
  };

  // Customer Invoices
  const createInvoice = (
    invoiceData: Omit<CustomerInvoice, 'id' | 'invoiceNumber' | 'createdAt'>
  ): CustomerInvoice => {
    const invoiceNumber = getNextInvoiceNumber();

    const newInvoice: CustomerInvoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNumber,
      createdAt: new Date().toISOString(),
    };

    setHistoricalInvoiceNumbers((prev) => {
      if (prev.includes(invoiceNumber)) return prev;
      const updated = [...prev, invoiceNumber];
      localStorage.setItem(STORAGE_KEY_PREFIX + 'historical_inv_numbers', JSON.stringify(updated));
      return updated;
    });

    // 1. Deduct Stock atomically for each line item and create movement logs
    const today = new Date().toISOString().split('T')[0];
    const generatedMovements: StockMovement[] = [];

    setProducts((prev) => {
      let updated = [...prev];
      invoiceData.items.forEach((line) => {
        if (!line.productId) return;
        const target = updated.find((p) => p.id === line.productId);
        if (target) {
          const prevStock = target.stockQuantity;
          const newStock = Math.max(0, prevStock - line.quantity);

          generatedMovements.push({
            id: `mov-${Date.now()}-${line.productId}-${Math.random().toString(36).substring(2, 6)}`,
            date: today,
            productId: target.id,
            productName: target.name,
            sku: target.sku,
            type: 'OUT',
            quantity: line.quantity,
            previousStock: prevStock,
            newStock: newStock,
            referenceId: invoiceNumber,
            notes: `Sold to customer ${invoiceData.customerName}`,
          });

          updated = updated.map((p) =>
            p.id === target.id
              ? { ...p, stockQuantity: newStock, lastUpdated: today }
              : p
          );
        }
      });
      return updated;
    });

    if (generatedMovements.length > 0) {
      setStockMovements((prev) => [...generatedMovements, ...prev]);
    }

    // 2. If paid amount > 0 and bank account selected, credit bank account and create transaction
    if (newInvoice.paidAmount > 0 && newInvoice.bankAccountId) {
      const account = bankAccounts.find((b) => b.id === newInvoice.bankAccountId);
      if (account) {
        setBankAccounts((prev) =>
          prev.map((b) =>
            b.id === account.id ? { ...b, currentBalance: b.currentBalance + newInvoice.paidAmount } : b
          )
        );

        const bankTx: BankTransaction = {
          id: `tx-${Date.now()}`,
          date: newInvoice.date,
          accountId: account.id,
          accountName: account.accountName,
          type: 'CUSTOMER_PAYMENT',
          category: 'Customer Sale',
          amount: newInvoice.paidAmount,
          referenceNo: invoiceNumber,
          description: `Sale payment received from ${newInvoice.customerName} for ${invoiceNumber}`,
          receiptPhoto: newInvoice.receiptImage || '',
          status: 'CLEARED',
        };
        setBankTransactions((prev) => [bankTx, ...prev]);
      }
    }

    // 3. Save to Customer Ledger: Always link every invoice to a customer profile
    setCustomers((prev) => {
      const cleanName = (newInvoice.customerName || 'Cash Customer').trim();
      const cleanLower = cleanName.toLowerCase();

      // Find matching customer by ID or by case-insensitive name
      const existingIdx = prev.findIndex(
        (c) =>
          (newInvoice.customerId && c.id === newInvoice.customerId) ||
          c.name.trim().toLowerCase() === cleanLower
      );

      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        newInvoice.customerId = existing.id; // Ensure invoice links to persistent customer ID
        const updated = [...prev];
        updated[existingIdx] = {
          ...existing,
          totalPurchased: (existing.totalPurchased || 0) + newInvoice.grandTotal,
          currentBalance: (existing.currentBalance || 0) + newInvoice.dueBalance,
          phone: existing.phone || newInvoice.customerPhone || '',
          address: existing.address || newInvoice.customerAddress || '',
        };
        return updated;
      } else {
        // Customer does not exist yet: create persistent customer record for ledger
        const newCustId = newInvoice.customerId || `cust-${Date.now()}`;
        newInvoice.customerId = newCustId;
        const newCustomer: Customer = {
          id: newCustId,
          name: cleanName,
          phone: newInvoice.customerPhone || '',
          address: newInvoice.customerAddress || '',
          totalPurchased: newInvoice.grandTotal,
          currentBalance: newInvoice.dueBalance,
        };
        return [...prev, newCustomer];
      }
    });

    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const recordInvoicePayment = (
    invoiceId: string,
    amount: number,
    bankAccountId: string,
    notes?: string,
    receiptImage?: string
  ) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    const newPaid = inv.paidAmount + amount;
    const newDue = Math.max(0, inv.grandTotal - newPaid);
    const newStatus: CustomerInvoice['paymentStatus'] =
      newDue <= 0 ? 'PAID' : newPaid > 0 ? 'PARTIAL' : 'UNPAID';

    setInvoices((prev) =>
      prev.map((i) =>
        i.id === invoiceId
          ? {
              ...i,
              paidAmount: newPaid,
              dueBalance: newDue,
              paymentStatus: newStatus,
              receiptImage: receiptImage || i.receiptImage,
            }
          : i
      )
    );

    // Update bank balance & add transaction
    const account = bankAccounts.find((b) => b.id === bankAccountId);
    if (account) {
      setBankAccounts((prev) =>
        prev.map((b) =>
          b.id === account.id ? { ...b, currentBalance: b.currentBalance + amount } : b
        )
      );

      const bankTx: BankTransaction = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        accountId: account.id,
        accountName: account.accountName,
        type: 'CUSTOMER_PAYMENT',
        category: 'Customer Sale',
        amount: amount,
        referenceNo: inv.invoiceNumber,
        description: `Payment received for ${inv.invoiceNumber} (${inv.customerName}) ${notes ? `- ${notes}` : ''}`,
        receiptPhoto: receiptImage || '',
        status: 'CLEARED',
      };
      setBankTransactions((prev) => [bankTx, ...prev]);
    }

    // Update customer receivable balance
    if (inv.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === inv.customerId ? { ...c, currentBalance: Math.max(0, c.currentBalance - amount) } : c
        )
      );
    }
  };

  const openCustomerLedger = (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (cust) {
      setSelectedCustomerForLedger(cust);
    }
  };

  const updateInvoice = (invoiceId: string, invoiceData: Partial<CustomerInvoice>) => {
    let oldInv: CustomerInvoice | undefined;
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        oldInv = inv;
        return { ...inv, ...invoiceData };
      })
    );

    // If grandTotal or dueBalance changed, update customer ledger
    if (oldInv && (invoiceData.grandTotal !== undefined || invoiceData.dueBalance !== undefined)) {
      const prevTotal = oldInv.grandTotal;
      const newTotal = invoiceData.grandTotal ?? oldInv.grandTotal;
      const prevDue = oldInv.dueBalance;
      const newDue = invoiceData.dueBalance ?? oldInv.dueBalance;
      const targetCustId = invoiceData.customerId || oldInv.customerId;
      const targetCustName = (invoiceData.customerName || oldInv.customerName || '').trim().toLowerCase();

      setCustomers((prev) =>
        prev.map((c) => {
          if (
            (targetCustId && c.id === targetCustId) ||
            c.name.trim().toLowerCase() === targetCustName
          ) {
            return {
              ...c,
              totalPurchased: Math.max(0, (c.totalPurchased || 0) + (newTotal - prevTotal)),
              currentBalance: Math.max(0, (c.currentBalance || 0) + (newDue - prevDue)),
            };
          }
          return c;
        })
      );
    }
  };

  const deleteInvoice = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return;

    // Permanently record in historical list so it CANNOT ever be generated again
    if (inv.invoiceNumber) {
      setHistoricalInvoiceNumbers((prev) => {
        if (prev.includes(inv.invoiceNumber)) return prev;
        const updated = [...prev, inv.invoiceNumber];
        localStorage.setItem(STORAGE_KEY_PREFIX + 'historical_inv_numbers', JSON.stringify(updated));
        return updated;
      });
    }

    const today = new Date().toISOString().split('T')[0];

    // 1. Restore Stock back to inventory for all items
    inv.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const prevStock = product.stockQuantity;
        const newStock = prevStock + item.quantity;
        updateProduct(product.id, { stockQuantity: newStock });

        const movement: StockMovement = {
          id: `mov-${Date.now()}-${item.productId}`,
          date: today,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          type: 'ADJUSTMENT',
          quantity: item.quantity,
          previousStock: prevStock,
          newStock: newStock,
          referenceId: inv.invoiceNumber,
          notes: `Restored stock from deleted sale invoice ${inv.invoiceNumber}`,
        };
        setStockMovements((prev) => [movement, ...prev]);
      }
    });

    // 2. Adjust Customer balance in ledger
    setCustomers((prev) =>
      prev.map((c) => {
        if (
          (inv.customerId && c.id === inv.customerId) ||
          (inv.customerName && c.name.trim().toLowerCase() === inv.customerName.trim().toLowerCase())
        ) {
          return {
            ...c,
            totalPurchased: Math.max(0, (c.totalPurchased || 0) - inv.grandTotal),
            currentBalance: Math.max(0, (c.currentBalance || 0) - inv.dueBalance),
          };
        }
        return c;
      })
    );

    // 3. Revert bank balance if paid amount exists
    if (inv.paidAmount > 0 && inv.bankAccountId) {
      setBankAccounts((prev) =>
        prev.map((b) =>
          b.id === inv.bankAccountId
            ? { ...b, currentBalance: Math.max(0, b.currentBalance - inv.paidAmount) }
            : b
        )
      );
    }

    // 4. Remove invoice
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  };

  // Purchase Invoices (Suppliers)
  const createPurchaseInvoice = (
    purchaseData: Omit<PurchaseInvoice, 'id' | 'billNumber' | 'createdAt'>
  ): PurchaseInvoice => {
    const billNumber = getNextPurchaseNumber();

    const newPurchase: PurchaseInvoice = {
      ...purchaseData,
      id: `pur-${Date.now()}`,
      billNumber,
      createdAt: new Date().toISOString(),
    };

    setHistoricalPurchaseNumbers((prev) => {
      if (prev.includes(billNumber)) return prev;
      const updated = [...prev, billNumber];
      localStorage.setItem(STORAGE_KEY_PREFIX + 'historical_pur_numbers', JSON.stringify(updated));
      return updated;
    });

    const today = new Date().toISOString().split('T')[0];

    // 1. Increase Stock in inventory
    purchaseData.items.forEach((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (product) {
        const prevStock = product.stockQuantity;
        const newStock = prevStock + line.quantity;
        // Optionally update cost price if new unit cost provided
        updateProduct(product.id, {
          stockQuantity: newStock,
          costPrice: line.unitCost || product.costPrice,
        });

        const movement: StockMovement = {
          id: `mov-${Date.now()}-${line.productId}`,
          date: today,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          type: 'IN',
          quantity: line.quantity,
          previousStock: prevStock,
          newStock: newStock,
          referenceId: billNumber,
          notes: `Goods received from ${purchaseData.supplierName} (Ref #${purchaseData.supplierInvoiceNo || 'N/A'})`,
        };
        setStockMovements((prev) => [movement, ...prev]);
      }
    });

    // 2. If paid amount > 0, deduct from bank account & add bank transaction
    if (newPurchase.paidAmount > 0 && newPurchase.bankAccountId) {
      const account = bankAccounts.find((b) => b.id === newPurchase.bankAccountId);
      if (account) {
        setBankAccounts((prev) =>
          prev.map((b) =>
            b.id === account.id ? { ...b, currentBalance: b.currentBalance - newPurchase.paidAmount } : b
          )
        );

        const bankTx: BankTransaction = {
          id: `tx-${Date.now()}`,
          date: newPurchase.date,
          accountId: account.id,
          accountName: account.accountName,
          type: 'SUPPLIER_PAYMENT',
          category: 'Supplier Bill',
          amount: newPurchase.paidAmount,
          referenceNo: billNumber,
          description: `Supplier payment paid to ${newPurchase.supplierName} for ${billNumber}`,
          receiptPhoto: newPurchase.billImage || '',
          status: 'CLEARED',
        };
        setBankTransactions((prev) => [bankTx, ...prev]);
      }
    }

    // 3. Update Supplier balance payable
    if (newPurchase.supplierId) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === newPurchase.supplierId
            ? {
                ...s,
                totalSupplied: s.totalSupplied + newPurchase.grandTotal,
                currentBalance: s.currentBalance + newPurchase.dueBalance,
              }
            : s
        )
      );
    }

    setPurchaseInvoices((prev) => [newPurchase, ...prev]);
    return newPurchase;
  };

  const recordPurchasePayment = (
    purchaseId: string,
    amount: number,
    bankAccountId: string,
    notes?: string,
    slipImage?: string
  ) => {
    const bill = purchaseInvoices.find((p) => p.id === purchaseId);
    if (!bill) return;

    const newPaid = bill.paidAmount + amount;
    const newDue = Math.max(0, bill.grandTotal - newPaid);
    const newStatus: PurchaseInvoice['paymentStatus'] =
      newDue <= 0 ? 'PAID' : newPaid > 0 ? 'PARTIAL' : 'UNPAID';

    setPurchaseInvoices((prev) =>
      prev.map((p) =>
        p.id === purchaseId
          ? {
              ...p,
              paidAmount: newPaid,
              dueBalance: newDue,
              paymentStatus: newStatus,
              billImage: slipImage || p.billImage,
            }
          : p
      )
    );

    // Deduct from bank account
    const account = bankAccounts.find((b) => b.id === bankAccountId);
    if (account) {
      setBankAccounts((prev) =>
        prev.map((b) =>
          b.id === account.id ? { ...b, currentBalance: b.currentBalance - amount } : b
        )
      );

      const bankTx: BankTransaction = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        accountId: account.id,
        accountName: account.accountName,
        type: 'SUPPLIER_PAYMENT',
        category: 'Supplier Bill',
        amount: amount,
        referenceNo: bill.billNumber,
        description: `Payment released for ${bill.billNumber} (${bill.supplierName}) ${notes ? `- ${notes}` : ''}`,
        receiptPhoto: slipImage || '',
        status: 'CLEARED',
      };
      setBankTransactions((prev) => [bankTx, ...prev]);
    }

    // Update supplier payable balance
    if (bill.supplierId) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === bill.supplierId ? { ...s, currentBalance: Math.max(0, s.currentBalance - amount) } : s
        )
      );
    }
  };

  const updatePurchaseInvoice = (purchaseId: string, purchaseData: Partial<PurchaseInvoice>) => {
    setPurchaseInvoices((prev) =>
      prev.map((bill) => {
        if (bill.id !== purchaseId) return bill;
        return { ...bill, ...purchaseData };
      })
    );
  };

  const deletePurchaseInvoice = (id: string) => {
    const bill = purchaseInvoices.find((p) => p.id === id);
    if (!bill) return;

    if (bill.billNumber) {
      setHistoricalPurchaseNumbers((prev) => {
        if (prev.includes(bill.billNumber)) return prev;
        const updated = [...prev, bill.billNumber];
        localStorage.setItem(STORAGE_KEY_PREFIX + 'historical_pur_numbers', JSON.stringify(updated));
        return updated;
      });
    }

    const today = new Date().toISOString().split('T')[0];

    // 1. Deduct inward stock from inventory
    bill.items.forEach((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (product) {
        const prevStock = product.stockQuantity;
        const newStock = Math.max(0, prevStock - line.quantity);
        updateProduct(product.id, { stockQuantity: newStock });

        const movement: StockMovement = {
          id: `mov-${Date.now()}-${line.productId}`,
          date: today,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          type: 'ADJUSTMENT',
          quantity: line.quantity,
          previousStock: prevStock,
          newStock: newStock,
          referenceId: bill.billNumber,
          notes: `Reversed inward stock from deleted purchase bill ${bill.billNumber}`,
        };
        setStockMovements((prev) => [movement, ...prev]);
      }
    });

    // 2. Adjust Supplier balance
    if (bill.supplierId) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === bill.supplierId
            ? {
                ...s,
                totalSupplied: Math.max(0, s.totalSupplied - bill.grandTotal),
                currentBalance: Math.max(0, s.currentBalance - bill.dueBalance),
              }
            : s
        )
      );
    }

    // 3. Revert bank balance if paid amount exists
    if (bill.paidAmount > 0 && bill.bankAccountId) {
      setBankAccounts((prev) =>
        prev.map((b) =>
          b.id === bill.bankAccountId
            ? { ...b, currentBalance: b.currentBalance + bill.paidAmount }
            : b
        )
      );
    }

    // 4. Remove purchase invoice
    setPurchaseInvoices((prev) => prev.filter((p) => p.id !== id));
  };

  // Voucher Operations (Receive Payment & Payable Vouchers)
  const createReceiptVoucher = (
    data: Omit<AccountingVoucher, 'id' | 'voucherNumber' | 'voucherType' | 'createdAt'>
  ): AccountingVoucher => {
    const voucherNumber = getNextVoucherNumber('RECEIPT');

    const newVoucher: AccountingVoucher = {
      ...data,
      id: `vch-${Date.now()}`,
      voucherNumber,
      voucherType: 'RECEIPT',
      createdAt: new Date().toISOString(),
    };

    // 1. Credit bank account & log bank transaction
    const account = bankAccounts.find((b) => b.id === data.bankAccountId);
    if (account) {
      setBankAccounts((prev) =>
        prev.map((b) =>
          b.id === account.id ? { ...b, currentBalance: b.currentBalance + data.amount } : b
        )
      );

      const bankTx: BankTransaction = {
        id: `tx-${Date.now()}`,
        date: data.date,
        accountId: account.id,
        accountName: account.accountName,
        type: 'CUSTOMER_PAYMENT',
        category: 'Customer Sale Receipt',
        amount: data.amount,
        referenceNo: voucherNumber,
        description: `Receipt voucher from ${data.partyName} (${voucherNumber})${
          data.notes ? ` - ${data.notes}` : ''
        }`,
        receiptPhoto: data.voucherImage || '',
        status: 'CLEARED',
      };
      setBankTransactions((prev) => [bankTx, ...prev]);
    }

    // 2. Reduce Customer receivable balance
    if (data.partyId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === data.partyId
            ? { ...c, currentBalance: Math.max(0, c.currentBalance - data.amount) }
            : c
        )
      );
    }

    // 3. If allocated to specific invoice, update invoice
    if (data.allocatedInvoiceId) {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === data.allocatedInvoiceId) {
            const newPaid = inv.paidAmount + data.amount;
            const newDue = Math.max(0, inv.grandTotal - newPaid);
            const newStatus: CustomerInvoice['paymentStatus'] =
              newDue <= 0 ? 'PAID' : newPaid > 0 ? 'PARTIAL' : 'UNPAID';
            return {
              ...inv,
              paidAmount: newPaid,
              dueBalance: newDue,
              paymentStatus: newStatus,
              receiptImage: data.voucherImage || inv.receiptImage,
            };
          }
          return inv;
        })
      );
    }

    setVouchers((prev) => [newVoucher, ...prev]);
    return newVoucher;
  };

  const createPaymentVoucher = (
    data: Omit<AccountingVoucher, 'id' | 'voucherNumber' | 'voucherType' | 'createdAt'>
  ): AccountingVoucher => {
    const voucherNumber = getNextVoucherNumber('PAYMENT');

    const newVoucher: AccountingVoucher = {
      ...data,
      id: `vch-${Date.now()}`,
      voucherNumber,
      voucherType: 'PAYMENT',
      createdAt: new Date().toISOString(),
    };

    // 1. Debit bank account & log bank transaction
    const account = bankAccounts.find((b) => b.id === data.bankAccountId);
    if (account) {
      setBankAccounts((prev) =>
        prev.map((b) =>
          b.id === account.id ? { ...b, currentBalance: b.currentBalance - data.amount } : b
        )
      );

      const bankTx: BankTransaction = {
        id: `tx-${Date.now()}`,
        date: data.date,
        accountId: account.id,
        accountName: account.accountName,
        type: 'SUPPLIER_PAYMENT',
        category: 'Supplier Bill Payment',
        amount: data.amount,
        referenceNo: voucherNumber,
        description: `Payment voucher paid to ${data.partyName} (${voucherNumber})${
          data.notes ? ` - ${data.notes}` : ''
        }`,
        receiptPhoto: data.voucherImage || '',
        status: 'CLEARED',
      };
      setBankTransactions((prev) => [bankTx, ...prev]);
    }

    // 2. Reduce Supplier payable balance
    if (data.partyId) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === data.partyId
            ? { ...s, currentBalance: Math.max(0, s.currentBalance - data.amount) }
            : s
        )
      );
    }

    // 3. If allocated to specific purchase bill, update bill
    if (data.allocatedInvoiceId) {
      setPurchaseInvoices((prev) =>
        prev.map((bill) => {
          if (bill.id === data.allocatedInvoiceId) {
            const newPaid = bill.paidAmount + data.amount;
            const newDue = Math.max(0, bill.grandTotal - newPaid);
            const newStatus: PurchaseInvoice['paymentStatus'] =
              newDue <= 0 ? 'PAID' : newPaid > 0 ? 'PARTIAL' : 'UNPAID';
            return {
              ...bill,
              paidAmount: newPaid,
              dueBalance: newDue,
              paymentStatus: newStatus,
              billImage: data.voucherImage || bill.billImage,
            };
          }
          return bill;
        })
      );
    }

    setVouchers((prev) => [newVoucher, ...prev]);
    return newVoucher;
  };

  const createJournalVoucher = (data: {
    date: string;
    debitAccountId: string;
    debitAccountName: string;
    creditAccountId: string;
    creditAccountName: string;
    amount: number;
    narration: string;
    voucherImage?: string;
  }): AccountingVoucher => {
    const voucherNumber = getNextVoucherNumber('JOURNAL');

    const newVoucher: AccountingVoucher = {
      id: `vch-${Date.now()}`,
      voucherNumber,
      voucherType: 'JOURNAL',
      date: data.date,
      debitAccountId: data.debitAccountId,
      debitAccountName: data.debitAccountName,
      creditAccountId: data.creditAccountId,
      creditAccountName: data.creditAccountName,
      paymentMode: 'JOURNAL',
      amount: data.amount,
      notes: data.narration,
      voucherImage: data.voucherImage,
      createdAt: new Date().toISOString(),
    };

    // Double entry adjustments
    const debitBank = bankAccounts.find((b) => b.id === data.debitAccountId);
    if (debitBank) {
      setBankAccounts((prev) =>
        prev.map((b) => (b.id === debitBank.id ? { ...b, currentBalance: b.currentBalance + data.amount } : b))
      );
    }
    const creditBank = bankAccounts.find((b) => b.id === data.creditAccountId);
    if (creditBank) {
      setBankAccounts((prev) =>
        prev.map((b) => (b.id === creditBank.id ? { ...b, currentBalance: b.currentBalance - data.amount } : b))
      );
    }

    const debitCust = customers.find((c) => c.id === data.debitAccountId);
    if (debitCust) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === debitCust.id ? { ...c, currentBalance: c.currentBalance + data.amount } : c))
      );
    }
    const creditCust = customers.find((c) => c.id === data.creditAccountId);
    if (creditCust) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === creditCust.id ? { ...c, currentBalance: Math.max(0, c.currentBalance - data.amount) } : c))
      );
    }

    const debitSupp = suppliers.find((s) => s.id === data.debitAccountId);
    if (debitSupp) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === debitSupp.id ? { ...s, currentBalance: Math.max(0, s.currentBalance - data.amount) } : s))
      );
    }
    const creditSupp = suppliers.find((s) => s.id === data.creditAccountId);
    if (creditSupp) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === creditSupp.id ? { ...s, currentBalance: s.currentBalance + data.amount } : s))
      );
    }

    setVouchers((prev) => [newVoucher, ...prev]);
    return newVoucher;
  };

  const deleteVoucher = (id: string) => {
    const vch = vouchers.find((v) => v.id === id);
    if (!vch) return;

    if (vch.voucherType === 'RECEIPT') {
      // 1. Revert Bank Balance (deduct the amount that was received)
      if (vch.bankAccountId) {
        setBankAccounts((prev) =>
          prev.map((b) =>
            b.id === vch.bankAccountId
              ? { ...b, currentBalance: Math.max(0, b.currentBalance - vch.amount) }
              : b
          )
        );
      }
      // 2. Restore customer receivable balance
      if (vch.partyId) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === vch.partyId ? { ...c, currentBalance: c.currentBalance + vch.amount } : c
          )
        );
      }
      // 3. If allocated to invoice, restore due balance
      if (vch.allocatedInvoiceId) {
        setInvoices((prev) =>
          prev.map((inv) => {
            if (inv.id === vch.allocatedInvoiceId) {
              const newPaid = Math.max(0, inv.paidAmount - vch.amount);
              const newDue = inv.grandTotal - newPaid;
              return {
                ...inv,
                paidAmount: newPaid,
                dueBalance: newDue,
                paymentStatus: newPaid <= 0 ? 'UNPAID' : 'PARTIAL',
              };
            }
            return inv;
          })
        );
      }
    } else if (vch.voucherType === 'PAYMENT') {
      // 1. Revert Bank Balance (add back the amount that was paid out)
      if (vch.bankAccountId) {
        setBankAccounts((prev) =>
          prev.map((b) =>
            b.id === vch.bankAccountId ? { ...b, currentBalance: b.currentBalance + vch.amount } : b
          )
        );
      }
      // 2. Restore supplier payable balance
      if (vch.partyId) {
        setSuppliers((prev) =>
          prev.map((s) =>
            s.id === vch.partyId ? { ...s, currentBalance: s.currentBalance + vch.amount } : s
          )
        );
      }
      // 3. If allocated to purchase bill, restore due balance
      if (vch.allocatedInvoiceId) {
        setPurchaseInvoices((prev) =>
          prev.map((bill) => {
            if (bill.id === vch.allocatedInvoiceId) {
              const newPaid = Math.max(0, bill.paidAmount - vch.amount);
              const newDue = bill.grandTotal - newPaid;
              return {
                ...bill,
                paidAmount: newPaid,
                dueBalance: newDue,
                paymentStatus: newPaid <= 0 ? 'UNPAID' : 'PARTIAL',
              };
            }
            return bill;
          })
        );
      }
    } else if (vch.voucherType === 'JOURNAL') {
      // Revert Debit Account
      if (vch.debitAccountId) {
        const debitBank = bankAccounts.find((b) => b.id === vch.debitAccountId);
        if (debitBank) {
          setBankAccounts((prev) =>
            prev.map((b) => (b.id === debitBank.id ? { ...b, currentBalance: Math.max(0, b.currentBalance - vch.amount) } : b))
          );
        }
        const debitCust = customers.find((c) => c.id === vch.debitAccountId);
        if (debitCust) {
          setCustomers((prev) =>
            prev.map((c) => (c.id === debitCust.id ? { ...c, currentBalance: Math.max(0, c.currentBalance - vch.amount) } : c))
          );
        }
      }
      // Revert Credit Account
      if (vch.creditAccountId) {
        const creditBank = bankAccounts.find((b) => b.id === vch.creditAccountId);
        if (creditBank) {
          setBankAccounts((prev) =>
            prev.map((b) => (b.id === creditBank.id ? { ...b, currentBalance: b.currentBalance + vch.amount } : b))
          );
        }
        const creditCust = customers.find((c) => c.id === vch.creditAccountId);
        if (creditCust) {
          setCustomers((prev) =>
            prev.map((c) => (c.id === creditCust.id ? { ...c, currentBalance: c.currentBalance + vch.amount } : c))
          );
        }
      }
    }

    if (vch.voucherNumber) {
      setHistoricalVoucherNumbers((prev) => {
        if (prev.includes(vch.voucherNumber)) return prev;
        const updated = [...prev, vch.voucherNumber];
        localStorage.setItem(STORAGE_KEY_PREFIX + 'historical_vch_numbers', JSON.stringify(updated));
        return updated;
      });
    }

    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  // Banking Operations
  const addBankAccount = (acc: Omit<BankAccount, 'id'>) => {
    const newAcc: BankAccount = {
      ...acc,
      id: `bank-${Date.now()}`,
    };
    setBankAccounts((prev) => [...prev, newAcc]);
  };

  const updateBankAccount = (id: string, updates: Partial<BankAccount>) => {
    setBankAccounts((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const addBankTransaction = (txData: Omit<BankTransaction, 'id'>): BankTransaction => {
    const newTx: BankTransaction = {
      ...txData,
      id: `tx-${Date.now()}`,
    };

    // Update bank balance according to transaction type
    setBankAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === txData.accountId) {
          if (
            txData.type === 'DEPOSIT' ||
            txData.type === 'CUSTOMER_PAYMENT'
          ) {
            return { ...acc, currentBalance: acc.currentBalance + txData.amount };
          } else if (
            txData.type === 'WITHDRAWAL' ||
            txData.type === 'SUPPLIER_PAYMENT' ||
            txData.type === 'EXPENSE'
          ) {
            return { ...acc, currentBalance: acc.currentBalance - txData.amount };
          } else if (txData.type === 'TRANSFER') {
            return { ...acc, currentBalance: acc.currentBalance - txData.amount };
          }
        }

        // If transfer, credit destination account
        if (txData.type === 'TRANSFER' && acc.id === txData.transferToAccountId) {
          return { ...acc, currentBalance: acc.currentBalance + txData.amount };
        }

        return acc;
      })
    );

    setBankTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const deleteBankTransaction = (id: string) => {
    setBankTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Customers & Suppliers
  const addCustomer = (data: Omit<Customer, 'id' | 'totalPurchased' | 'currentBalance'>) => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      totalPurchased: 0,
      currentBalance: 0,
    };
    setCustomers((prev) => [...prev, newCust]);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const addSupplier = (data: Omit<Supplier, 'id' | 'totalSupplied' | 'currentBalance'>) => {
    const newSupp: Supplier = {
      ...data,
      id: `supp-${Date.now()}`,
      totalSupplied: 0,
      currentBalance: 0,
    };
    setSuppliers((prev) => [...prev, newSupp]);
    return newSupp;
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  // User Authentication & Management
  const logUserActivity = (
    action: UserActivityLog['action'],
    description: string,
    details?: string
  ) => {
    const user = currentUser || {
      id: 'usr-sys',
      username: 'system',
      fullName: 'System Operator',
      role: 'ADMIN',
    };
    const newLog: UserActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      username: user.username,
      userFullName: user.fullName,
      role: user.role,
      action,
      description,
      timestamp: new Date().toLocaleString(),
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  };

  const login = (usernameOrEmail: string, password: string): { success: boolean; error?: string } => {
    const identifier = usernameOrEmail.toLowerCase().trim();
    const user = users.find(
      (u) =>
        (u.username.toLowerCase().trim() === identifier ||
          (u.email && u.email.toLowerCase().trim() === identifier)) &&
        u.password === password
    );

    if (!user) {
      return { success: false, error: 'Invalid username/email or password.' };
    }

    if (user.status === 'INACTIVE') {
      return { success: false, error: 'This user account is currently deactivated. Contact admin.' };
    }

    const updatedUser: UserAccount = {
      ...user,
      lastLogin: new Date().toLocaleString(),
    };

    updateUser(user.id, { lastLogin: updatedUser.lastLogin });
    setCurrentUser(updatedUser);
    logUserActivity('LOGIN', `${user.fullName} logged in (${user.role})`, `Login Terminal: ${user.username}`);
    return { success: true };
  };

  const loginAsOwner = (): { success: boolean } => {
    const owner = users.find(
      (u) =>
        u.email === 'bhattijee695@gmail.com' ||
        u.username === 'bhattijee695@gmail.com' ||
        u.role === 'ADMIN'
    ) || initialUsers[0];
    setCurrentUser(owner);
    logUserActivity('LOGIN', `Super Admin ${owner.fullName} logged in`, 'Owner Email Auth');
    return { success: true };
  };

  const deleteAllOtherUsers = (): { deletedCount: number } => {
    const keepId = currentUser ? currentUser.id : users.find((u) => u.role === 'ADMIN')?.id || users[0]?.id;
    const initialCount = users.length;
    setUsers((prev) => prev.filter((u) => u.id === keepId || u.id === 'usr-bhatti-owner'));
    const remainingCount = users.filter((u) => u.id === keepId || u.id === 'usr-bhatti-owner').length;
    const deletedCount = initialCount - remainingCount;
    logUserActivity('BACKUP', `Admin wiped/deleted ${deletedCount} user accounts`, `Kept active admin`);
    return { deletedCount };
  };

  const logout = () => {
    if (currentUser) {
      logUserActivity('LOGOUT', `${currentUser.fullName} logged out`, `Terminal session closed`);
    }
    setCurrentUser(null);
  };

  const addUser = (
    userData: Omit<UserAccount, 'id' | 'createdAt'>
  ): { success: boolean; error?: string } => {
    const exists = users.some(
      (u) => u.username.toLowerCase().trim() === userData.username.toLowerCase().trim()
    );
    if (exists) {
      return { success: false, error: `Username "${userData.username}" is already taken.` };
    }

    const newUser: UserAccount = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: userData.status || 'ACTIVE',
    };

    setUsers((prev) => [...prev, newUser]);
    logUserActivity('STOCK_UPDATE', `Created user account: ${newUser.username} (${newUser.role})`);
    return { success: true };
  };

  const updateUser = (id: string, updates: Partial<UserAccount>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    if (currentUser && currentUser.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
    }
  };

  // Sale Return Invoices Operations
  const createSaleReturnInvoice = (
    data: Omit<SaleReturnInvoice, 'id' | 'createdAt'>
  ): SaleReturnInvoice => {
    const returnNumber = data.returnNumber || getNextSaleReturnNumber();
    const newReturn: SaleReturnInvoice = {
      ...data,
      id: `sr-${Date.now()}`,
      returnNumber,
      createdAt: new Date().toISOString(),
    };

    const today = new Date().toISOString().split('T')[0];

    // 1. If restock inventory, add items back to product stock
    if (newReturn.restockInventory) {
      setProducts((prev) => {
        let updated = [...prev];
        newReturn.items.forEach((item) => {
          if (!item.productId) return;
          const retQty = item.returnQuantity ?? item.quantity ?? 1;
          const target = updated.find((p) => p.id === item.productId);
          if (target) {
            const prevStock = target.stockQuantity;
            const newStock = prevStock + retQty;
            updated = updated.map((p) =>
              p.id === target.id
                ? { ...p, stockQuantity: newStock, lastUpdated: today }
                : p
            );
          }
        });
        return updated;
      });

      // Stock movements
      const movements: StockMovement[] = newReturn.items.map((item) => {
        const retQty = item.returnQuantity ?? item.quantity ?? 1;
        return {
          id: `mov-${Date.now()}-${item.productId}`,
          date: today,
          productId: item.productId,
          productName: item.productName,
          sku: item.sku,
          type: 'IN',
          quantity: retQty,
          previousStock: 0,
          newStock: retQty,
          referenceId: newReturn.returnNumber,
          notes: `Customer return (${item.condition}): ${item.reason || item.returnReason || 'Sale Return'}`,
        };
      });
      setStockMovements((prev) => [...movements, ...prev]);
    }

    // 2. Adjust Financial ledger
    if (newReturn.refundMethod === 'KHATA_CREDIT') {
      if (newReturn.customerId) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === newReturn.customerId
              ? {
                  ...c,
                  totalPurchased: Math.max(0, c.totalPurchased - newReturn.grandTotal),
                  currentBalance: c.currentBalance - newReturn.grandTotal,
                }
              : c
          )
        );
      }
    } else if ((newReturn.refundMethod === 'CASH' || newReturn.refundMethod === 'BANK') && newReturn.bankAccountId) {
      const account = bankAccounts.find((b) => b.id === newReturn.bankAccountId);
      if (account) {
        setBankAccounts((prev) =>
          prev.map((b) =>
            b.id === account.id ? { ...b, currentBalance: b.currentBalance - newReturn.grandTotal } : b
          )
        );
        const bankTx: BankTransaction = {
          id: `tx-${Date.now()}`,
          date: newReturn.date,
          accountId: account.id,
          accountName: account.accountName,
          type: 'WITHDRAWAL',
          category: 'Customer Sale Return Refund',
          amount: newReturn.grandTotal,
          referenceNo: newReturn.returnNumber,
          description: `Sale Return refund for ${newReturn.returnNumber} to ${newReturn.customerName}`,
          status: 'CLEARED',
        };
        setBankTransactions((prev) => [bankTx, ...prev]);
      }
    }

    setHistoricalSaleReturnNumbers((prev) => {
      if (prev.includes(newReturn.returnNumber)) return prev;
      const updated = [...prev, newReturn.returnNumber];
      localStorage.setItem(STORAGE_KEY_PREFIX + 'historical_sr_numbers', JSON.stringify(updated));
      return updated;
    });

    setSaleReturnInvoices((prev) => [newReturn, ...prev]);
    logUserActivity(
      'SALE_INVOICE',
      `Processed Sale Return #${newReturn.returnNumber} from ${newReturn.customerName} (${formatCurrency(newReturn.grandTotal)})`,
      `Bilty: ${newReturn.biltyNumber || 'None'}, Restocked: ${newReturn.restockInventory ? 'Yes' : 'No'}`
    );
    return newReturn;
  };

  const deleteSaleReturnInvoice = (id: string) => {
    const sr = saleReturnInvoices.find((s) => s.id === id);
    if (!sr) return;

    if (sr.returnNumber) {
      setHistoricalSaleReturnNumbers((prev) => {
        if (prev.includes(sr.returnNumber)) return prev;
        const updated = [...prev, sr.returnNumber];
        localStorage.setItem(STORAGE_KEY_PREFIX + 'historical_sr_numbers', JSON.stringify(updated));
        return updated;
      });
    }

    // Reverse restock if items were restocked
    if (sr.restockInventory) {
      setProducts((prev) => {
        let updated = [...prev];
        sr.items.forEach((item) => {
          const target = updated.find((p) => p.id === item.productId);
          if (target) {
            updated = updated.map((p) =>
              p.id === target.id
                ? { ...p, stockQuantity: Math.max(0, p.stockQuantity - (item.returnQuantity ?? item.quantity ?? 1)) }
                : p
            );
          }
        });
        return updated;
      });
    }

    // Reverse ledger
    if (sr.refundMethod === 'KHATA_CREDIT' && sr.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === sr.customerId
            ? {
                ...c,
                totalPurchased: c.totalPurchased + sr.grandTotal,
                currentBalance: c.currentBalance + sr.grandTotal,
              }
            : c
        )
      );
    } else if (sr.bankAccountId) {
      setBankAccounts((prev) =>
        prev.map((b) =>
          b.id === sr.bankAccountId ? { ...b, currentBalance: b.currentBalance + sr.grandTotal } : b
        )
      );
    }

    setSaleReturnInvoices((prev) => prev.filter((s) => s.id !== id));
    logUserActivity('BACKUP', `Deleted Sale Return #${sr.returnNumber}`);
  };

  // Rate List Vouchers Operations
  const createRateListVoucher = (
    data: Omit<RateListVoucher, 'id' | 'createdAt' | 'voucherNumber'>
  ): RateListVoucher => {
    const num = `RLV-${new Date().getFullYear()}-${String(rateListVouchers.length + 1).padStart(3, '0')}`;
    const newVoucher: RateListVoucher = {
      ...data,
      id: `rlv-${Date.now()}`,
      voucherNumber: num,
      createdAt: new Date().toISOString(),
    };
    setRateListVouchers((prev) => [newVoucher, ...prev]);
    logUserActivity('PRICE_ADJUSTMENT', `Created Rate List Voucher #${num} (${data.category})`);
    return newVoucher;
  };

  const deleteRateListVoucher = (id: string) => {
    setRateListVouchers((prev) => prev.filter((r) => r.id !== id));
  };


  // Employee Record & Advance Management
  const addEmployee = (empData: Omit<Employee, 'id'>): Employee => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [...prev, newEmp]);
    logUserActivity('STOCK_UPDATE', `Added employee record: ${newEmp.name} (${newEmp.employeeCode})`);
    return newEmp;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const giveEmployeeAdvance = (
    employeeId: string,
    amount: number,
    bankAccountId: string,
    notes?: string
  ) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp || amount <= 0) return;

    updateEmployee(employeeId, {
      advanceBalance: emp.advanceBalance + amount,
    });

    const account = bankAccounts.find((b) => b.id === bankAccountId);
    if (account) {
      addBankTransaction({
        date: new Date().toISOString().split('T')[0],
        accountId: bankAccountId,
        accountName: account.accountName,
        type: 'WITHDRAWAL',
        category: 'Staff Advance',
        amount,
        referenceNo: `ADV-${emp.employeeCode}`,
        description: `Salary Advance given to ${emp.name} (${emp.employeeCode})${notes ? ': ' + notes : ''}`,
        status: 'CLEARED',
      });
    }

    createPaymentVoucher({
      date: new Date().toISOString().split('T')[0],
      partyType: 'GENERAL',
      partyName: emp.name,
      partyPhone: emp.phone,
      bankAccountId,
      bankAccountName: account?.accountName,
      paymentMode: account?.type === 'CASH' ? 'CASH' : 'BANK_TRANSFER',
      referenceNo: `ADV-${emp.employeeCode}`,
      amount,
      notes: `Staff Advance payment to ${emp.name}. Balance receivable: ${emp.advanceBalance + amount}`,
    });

    logUserActivity('VOUCHER', `Issued salary advance ${formatCurrency(amount)} to ${emp.name}`);
  };

  // Salary Slip Generation & Payroll Disbursement
  const generateSalarySlip = (
    slipData: Omit<SalarySlip, 'id' | 'slipNumber' | 'paidAt'>
  ): SalarySlip => {
    const slipNumber = `SLIP-${slipData.month}-${String(salarySlips.length + 1).padStart(3, '0')}`;
    const newSlip: SalarySlip = {
      ...slipData,
      id: `slip-${Date.now()}`,
      slipNumber,
    };
    setSalarySlips((prev) => [newSlip, ...prev]);
    logUserActivity('VOUCHER', `Generated Salary Slip ${slipNumber} for ${newSlip.employeeName} (${formatCurrency(newSlip.netSalary)})`);
    return newSlip;
  };

  const paySalarySlip = (
    slipId: string,
    paymentMethod: 'CASH' | 'BANK',
    bankAccountId?: string
  ) => {
    const target = salarySlips.find((s) => s.id === slipId);
    if (!target) return;

    const account = bankAccounts.find((b) => b.id === bankAccountId) || bankAccounts[0];
    const paidAt = new Date().toISOString().split('T')[0];

    setSalarySlips((prev) =>
      prev.map((s) =>
        s.id === slipId
          ? {
              ...s,
              paymentStatus: 'PAID',
              paymentMethod,
              bankAccountId: account?.id,
              bankAccountName: account?.accountName,
              paidAt,
            }
          : s
      )
    );

    if (target.advanceDeduction > 0) {
      const emp = employees.find((e) => e.id === target.employeeId);
      if (emp) {
        updateEmployee(emp.id, {
          advanceBalance: Math.max(0, emp.advanceBalance - target.advanceDeduction),
        });
      }
    }

    if (account && target.netSalary > 0) {
      addBankTransaction({
        date: paidAt,
        accountId: account.id,
        accountName: account.accountName,
        type: 'EXPENSE',
        category: 'Salaries & Wages',
        amount: target.netSalary,
        referenceNo: target.slipNumber,
        description: `Payroll Salary Disbursement for ${target.employeeName} (${target.month})`,
        status: 'CLEARED',
      });
    }

    createPaymentVoucher({
      date: paidAt,
      partyType: 'GENERAL',
      partyName: target.employeeName,
      bankAccountId: account?.id,
      bankAccountName: account?.accountName,
      paymentMode: paymentMethod === 'CASH' ? 'CASH' : 'BANK_TRANSFER',
      referenceNo: target.slipNumber,
      amount: target.netSalary,
      notes: `Salary disbursement for month ${target.month} to ${target.employeeName}. Net: ${target.netSalary}`,
    });

    logUserActivity('VOUCHER', `Disbursed Salary ${target.slipNumber} to ${target.employeeName} (${formatCurrency(target.netSalary)})`);
  };

  const deleteSalarySlip = (id: string) => {
    setSalarySlips((prev) => prev.filter((s) => s.id !== id));
  };

  // Category Price Adjustment (+/-)
  const adjustCategoryPrices = (
    category: string,
    type: 'PERCENT' | 'FIXED',
    value: number,
    direction: 'INCREASE' | 'DECREASE',
    targetField: 'SALE' | 'COST' | 'BOTH'
  ): { updatedCount: number } => {
    let count = 0;
    const factor = direction === 'INCREASE' ? 1 : -1;

    setProducts((prev) =>
      prev.map((p) => {
        if (category !== 'ALL' && p.category !== category) return p;

        count++;
        let newSale = p.salePrice;
        let newCost = p.costPrice;

        if (targetField === 'SALE' || targetField === 'BOTH') {
          if (type === 'PERCENT') {
            newSale = Math.round(p.salePrice + factor * (p.salePrice * (value / 100)));
          } else {
            newSale = Math.max(0, p.salePrice + factor * value);
          }
        }

        if (targetField === 'COST' || targetField === 'BOTH') {
          if (type === 'PERCENT') {
            newCost = Math.round(p.costPrice + factor * (p.costPrice * (value / 100)));
          } else {
            newCost = Math.max(0, p.costPrice + factor * value);
          }
        }

        return {
          ...p,
          salePrice: Math.max(0, newSale),
          costPrice: Math.max(0, newCost),
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      })
    );

    logUserActivity(
      'PRICE_ADJUSTMENT',
      `Category Price Adjustment: ${category} (${direction === 'INCREASE' ? '+' : '-'}${value}${type === 'PERCENT' ? '%' : ' Rs.'}) on ${targetField}`,
      `Modified ${count} SKUs`
    );

    return { updatedCount: count };
  };

  // Cheque Verification & Status Updates
  const updateChequeStatus = (
    voucherId: string,
    status: 'CLEARED' | 'PENDING' | 'BOUNCED' | 'CLAIMED'
  ) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, chequeStatus: status } : v))
    );
    logUserActivity('VOUCHER', `Cheque status set to ${status} for voucher #${voucherId}`);
  };

  const playChequeChimeSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.45);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.16); // A5
      gain2.gain.setValueAtTime(0.2, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.7);
    } catch (err) {
      console.warn('Audio chime note:', err);
    }
  };

  // Bilty / Transport Management
  const updateInvoiceBilty = (invoiceId: string, biltyData: Partial<CustomerInvoice>) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              ...biltyData,
              biltyStatus: biltyData.biltyStatus || 'BOOKED',
            }
          : inv
      )
    );
    logUserActivity(
      'BILTY_UPDATE',
      `Updated Bilty info for Invoice #${invoiceId}: Bilty ${biltyData.biltyNumber || 'Updated'}, ${biltyData.transportName || ''}`
    );
  };

  // Snapshots & Automated Backups
  const createBackupSnapshot = (name?: string): BackupSnapshot => {
    const jsonStr = exportDataJson();
    const snapshot: BackupSnapshot = {
      id: `snap-${Date.now()}`,
      date: new Date().toLocaleString(),
      name: name || `Backup Snapshot (${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      counts: {
        products: products.length,
        invoices: invoices.length,
        purchases: purchaseInvoices.length,
        vouchers: vouchers.length,
        transactions: bankTransactions.length,
      },
      payload: jsonStr,
    };

    setBackupSnapshots((prev) => [snapshot, ...prev.slice(0, 9)]);
    return snapshot;
  };

  const restoreBackupSnapshot = (snapshotId: string): boolean => {
    const snap = backupSnapshots.find((s) => s.id === snapshotId);
    if (!snap) return false;
    return importDataJson(snap.payload);
  };

  const deleteBackupSnapshot = (snapshotId: string) => {
    setBackupSnapshots((prev) => prev.filter((s) => s.id !== snapshotId));
  };

  // Reset to default
  const resetToDefaultData = () => {
    setCompanyProfile(initialCompanyProfile);
    setProducts(initialProducts);
    setStockMovements(initialStockMovements);
    setInvoices(initialCustomerInvoices);
    setPurchaseInvoices(initialPurchaseInvoices);
    setVouchers(initialVouchers);
    setBankAccounts(initialBankAccounts);
    setBankTransactions(initialBankTransactions);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setUsers(initialUsers);
  };

  const loadSampleData = () => {
    resetToDefaultData();
  };

  // Clear All Demo Data (Clear Invoices, Purchases, Vouchers, Transactions, Ledger Balances)
  const clearAllTransactionsAndDemoData = () => {
    setInvoices([]);
    setPurchaseInvoices([]);
    setVouchers([]);
    setBankTransactions([]);
    setStockMovements([]);

    // Reset customer and vendor balances to 0
    setCustomers((prev) =>
      prev.map((c) => ({ ...c, totalPurchased: 0, currentBalance: 0 }))
    );
    setSuppliers((prev) =>
      prev.map((s) => ({ ...s, totalSupplied: 0, currentBalance: 0 }))
    );
    // Reset bank accounts balances to 0
    setBankAccounts((prev) =>
      prev.map((b) => ({ ...b, currentBalance: 0 }))
    );

    localStorage.setItem(STORAGE_KEY_PREFIX + 'initialized', 'true');
    localStorage.setItem(STORAGE_KEY_PREFIX + 'invoices', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'purchase_invoices', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'vouchers', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'bank_transactions', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'stock_movements', JSON.stringify([]));
    localStorage.setItem(
      STORAGE_KEY_PREFIX + 'customers',
      JSON.stringify(customers.map((c) => ({ ...c, totalPurchased: 0, currentBalance: 0 })))
    );
    localStorage.setItem(
      STORAGE_KEY_PREFIX + 'suppliers',
      JSON.stringify(suppliers.map((s) => ({ ...s, totalSupplied: 0, currentBalance: 0 })))
    );
  };

  const deleteAllData = (wipeInventory = false) => {
    clearAllTransactionsAndDemoData();

    if (wipeInventory) {
      setProducts([]);
      localStorage.setItem(STORAGE_KEY_PREFIX + 'products', JSON.stringify([]));
    } else {
      // Keep product catalog names/prices, but reset stock quantities to 0
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          stockQuantity: 0,
          lastUpdated: new Date().toISOString().split('T')[0],
        }))
      );
    }
  };

  // Clear every single entry across entire ERP (Invoices, Bills, Vouchers, Movements, Products, Customers, Suppliers)
  const clearEverySingleEntry = () => {
    setInvoices([]);
    setPurchaseInvoices([]);
    setVouchers([]);
    setBankTransactions([]);
    setStockMovements([]);
    setProducts([]);
    setCustomers([]);
    setSuppliers([]);

    const cleanCashAccount: BankAccount[] = [
      {
        id: 'bank-cash-01',
        bankName: 'Cash',
        accountName: 'Main Cash Register',
        accountNumber: 'CASH-001',
        type: 'CASH',
        currentBalance: 0,
      },
    ];
    setBankAccounts(cleanCashAccount);

    localStorage.setItem(STORAGE_KEY_PREFIX + 'initialized', 'true');
    localStorage.setItem(STORAGE_KEY_PREFIX + 'invoices', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'purchase_invoices', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'vouchers', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'bank_transactions', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'stock_movements', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'products', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'customers', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'suppliers', JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'bank_accounts', JSON.stringify(cleanCashAccount));
  };

  // Export & Import
  const exportDataJson = () => {
    const fullBackup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      companyProfile,
      users,
      products,
      stockMovements,
      invoices,
      purchaseInvoices,
      vouchers,
      bankAccounts,
      bankTransactions,
      customers,
      suppliers,
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.companyProfile) setCompanyProfile(data.companyProfile);
      if (Array.isArray(data.users)) setUsers(data.users);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.stockMovements)) setStockMovements(data.stockMovements);
      if (Array.isArray(data.invoices)) setInvoices(data.invoices);
      if (Array.isArray(data.purchaseInvoices)) setPurchaseInvoices(data.purchaseInvoices);
      if (Array.isArray(data.vouchers)) setVouchers(data.vouchers);
      if (Array.isArray(data.bankAccounts)) setBankAccounts(data.bankAccounts);
      if (Array.isArray(data.bankTransactions)) setBankTransactions(data.bankTransactions);
      if (Array.isArray(data.customers)) setCustomers(data.customers);
      if (Array.isArray(data.suppliers)) setSuppliers(data.suppliers);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        companyProfile,
        updateCompanyProfile,
        currentUser,
        users,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        backupSnapshots,
        createBackupSnapshot,
        restoreBackupSnapshot,
        deleteBackupSnapshot,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        stockMovements,
        invoices,
        createInvoice,
        updateInvoice,
        recordInvoicePayment,
        deleteInvoice,
        purchaseInvoices,
        createPurchaseInvoice,
        updatePurchaseInvoice,
        recordPurchasePayment,
        deletePurchaseInvoice,
        vouchers,
        createReceiptVoucher,
        createPaymentVoucher,
        createJournalVoucher,
        deleteVoucher,
        selectedVoucherForPrint,
        setSelectedVoucherForPrint,
        isReceivePaymentModalOpen,
        setIsReceivePaymentModalOpen,
        isPaymentVoucherModalOpen,
        setIsPaymentVoucherModalOpen,
        isJournalVoucherModalOpen,
        setIsJournalVoucherModalOpen,
        lastAutoBackupTime,
        bankAccounts,
        bankTransactions,
        addBankAccount,
        updateBankAccount,
        addBankTransaction,
        deleteBankTransaction,
        customers,
        suppliers,
        addCustomer,
        updateCustomer,
        addSupplier,
        updateSupplier,
        resetToDefaultData,
        loadSampleData,
        exportDataJson,
        importDataJson,
        activeTab,
        setActiveTab,
        selectedInvoiceForPrint,
        setSelectedInvoiceForPrint,
        previewImage,
        setPreviewImage,
        formatCurrency,
        language,
        setLanguage,
        urduFontTheme,
        setUrduFontTheme,
        t,
        clearAllTransactionsAndDemoData,
        deleteAllData,
        clearEverySingleEntry,
        isNewCustomerModalOpen,
        setIsNewCustomerModalOpen,
        isCreateInvoiceModalOpen,
        setIsCreateInvoiceModalOpen,
        isCreatePurchaseModalOpen,
        setIsCreatePurchaseModalOpen,
        isShortcutsHelpOpen,
        setIsShortcutsHelpOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        isChequeSearchOpen,
        setIsChequeSearchOpen,
        isClearDemoDataModalOpen,
        setIsClearDemoDataModalOpen,
        whatsAppModalInvoice,
        setWhatsAppModalInvoice,
        selectedCustomerForLedger,
        setSelectedCustomerForLedger,
        openCustomerLedger,
        theme,
        setTheme,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        giveEmployeeAdvance,
        salarySlips,
        generateSalarySlip,
        paySalarySlip,
        deleteSalarySlip,
        selectedSalarySlipForPrint,
        setSelectedSalarySlipForPrint,
        activityLogs,
        logUserActivity,
        adjustCategoryPrices,
        updateChequeStatus,
        playChequeChimeSound,
        isBiltyUpdateModalOpen,
        setIsBiltyUpdateModalOpen,
        selectedInvoiceForBilty,
        setSelectedInvoiceForBilty,
        updateInvoiceBilty,
        isAccountInfoModalOpen,
        setIsAccountInfoModalOpen,
        isNewProductModalOpen,
        setIsNewProductModalOpen,
        isBankEntryModalOpen,
        setIsBankEntryModalOpen,
        deleteAllOtherUsers,
        loginAsOwner,
        saleReturnInvoices,
        createSaleReturnInvoice,
        deleteSaleReturnInvoice,
        selectedSaleReturnForPrint,
        setSelectedSaleReturnForPrint,
        isSaleReturnModalOpen,
        setIsSaleReturnModalOpen,
        autoBackupSettings,
        setAutoBackupSettings,
        triggerManualAutoBackup,
        rateListVouchers,
        createRateListVoucher,
        deleteRateListVoucher,
        selectedRateListForPrint,
        setSelectedRateListForPrint,
        isRateListModalOpen,
        setIsRateListModalOpen,
        historicalInvoiceNumbers,
        historicalPurchaseNumbers,
        historicalVoucherNumbers,
        historicalSaleReturnNumbers,
        getNextInvoiceNumber,
        getNextPurchaseNumber,
        getNextVoucherNumber,
        getNextSaleReturnNumber,
        systemPrinterSettings,
        updateSystemPrinterSettings,
        triggerSystemPrint,
        isTagPrintingModalOpen,
        setIsTagPrintingModalOpen,
        selectedProductForTag,
        setSelectedProductForTag,
        historicalTagNumbers,
        lastTagSerialNumber,
        getNextTagSerialNumber,
        recordPrintedTagSerial,
        stockAdjustmentVouchers,
        createStockAdjustmentVoucher,
        deleteStockAdjustmentVoucher,
        isStockAdjustmentModalOpen,
        setIsStockAdjustmentModalOpen,
        selectedStockAdjustmentForPrint,
        setSelectedStockAdjustmentForPrint,
        historicalAdjustmentNumbers,
        getNextAdjustmentNumber,
        isPrintPreviewOpen,
        setIsPrintPreviewOpen,
        printPreviewData,
        openPrintPreview,
        isStartupSplashVisible,
        setIsStartupSplashVisible,
        triggerStartupSplash,
        playScannerBeep,
        isAIGuideModalOpen,
        setIsAIGuideModalOpen,
        aiGuideInitialTab,
        setAiGuideInitialTab,
        openCopilotVoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
