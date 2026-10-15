export interface CompanyProfile {
  name: string;
  subtitle: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  ntn: string;
  currency: string;
  logoUrl?: string;
  signatureUrl?: string;
  terms: string;
  invoicePrefix: string;
  purchasePrefix: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stockQuantity: number;
  minStockLevel: number;
  unit: string;
  location: string;
  tagNo?: string;
  notes?: string;
  image?: string;
  lastUpdated: string;
}

export type Product = ProductItem;

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'DAMAGE' | 'LAB_USAGE';
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  notes?: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  costPrice: number;
  quantity: number;
  discount: number;
  warranty: string;
  tagNo?: string;
  total: number;
}

export interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  dueBalance: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  paymentMethod: 'CASH' | 'BANK' | 'CREDIT' | 'ONLINE';
  bankAccountId?: string;
  bankAccountName?: string;
  notes?: string;
  receiptImage?: string; // Picture of customer payment slip or lab handover
  // Transport & Bilty Information
  biltyNumber?: string;
  transportName?: string;
  destinationStation?: string;
  vehicleNumber?: string;
  cartonCount?: number;
  freightType?: 'PAID' | 'TO_PAY';
  freightAmount?: number;
  biltyDate?: string;
  biltyStatus?: 'PENDING' | 'BOOKED' | 'DISPATCHED' | 'DELIVERED';
  createdAt: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  sku: string;
  unitCost: number;
  quantity: number;
  total: number;
}

export interface PurchaseInvoice {
  id: string;
  billNumber: string;
  supplierInvoiceNo: string;
  date: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  items: PurchaseItem[];
  grandTotal: number;
  paidAmount: number;
  dueBalance: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  paymentMethod: 'CASH' | 'BANK' | 'CREDIT';
  bankAccountId?: string;
  bankAccountName?: string;
  notes?: string;
  billImage?: string; // "own pic billing" - attached image of vendor invoice or physical voucher
  createdAt: string;
}

export interface BankAccount {
  id: string;
  accountName: string;
  type: 'BANK' | 'CASH' | 'DIGITAL_WALLET';
  bankName: string;
  accountNumber: string;
  branchName?: string;
  currentBalance: number;
}

export interface BankTransaction {
  id: string;
  date: string;
  accountId: string;
  accountName: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'CUSTOMER_PAYMENT' | 'SUPPLIER_PAYMENT' | 'EXPENSE';
  category: string;
  amount: number;
  referenceNo?: string;
  description: string;
  receiptPhoto?: string; // "banking with own pic billing" - slip / receipt image
  status: 'CLEARED' | 'PENDING';
  transferToAccountId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  cnic?: string;
  creditLimit?: number;
  totalPurchased: number;
  currentBalance: number; // positive = customer owes money (receivable)
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  totalSupplied: number;
  currentBalance: number; // positive = we owe supplier money (payable)
}

export interface AccountingVoucher {
  id: string;
  voucherNumber: string; // e.g. FE-RV-2026-0001, FE-PV-2026-0001, or FE-JV-2026-0001
  voucherType: 'RECEIPT' | 'PAYMENT' | 'JOURNAL'; // RECEIPT = Money In, PAYMENT = Money Out, JOURNAL = General / Adjustment
  date: string;
  partyType?: 'CUSTOMER' | 'SUPPLIER' | 'GENERAL';
  partyId?: string;
  partyName?: string;
  partyPhone?: string;
  bankAccountId?: string;
  bankAccountName?: string;
  paymentMode: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE' | 'JOURNAL';
  referenceNo?: string;
  amount: number;
  allocatedInvoiceId?: string;
  allocatedInvoiceNo?: string;
  notes?: string;
  voucherImage?: string; // "own pic billing" slip/cheque photo
  // Journal Voucher specific fields
  debitAccountName?: string;
  debitAccountId?: string;
  creditAccountName?: string;
  creditAccountId?: string;
  // Cheque Verification & Status
  chequeStatus?: 'CLEARED' | 'PENDING' | 'BOUNCED' | 'CLAIMED';
  chequeDueDate?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeCode: string; // e.g. EMP-01
  name: string;
  designation: string; // Senior Technician, Cashier, Sales Exec, etc.
  phone: string;
  cnic: string;
  joiningDate: string;
  basicSalary: number;
  allowance: number;
  advanceBalance: number; // Employee Receivable
  status: 'ACTIVE' | 'INACTIVE';
  photo?: string;
}

export interface SalarySlip {
  id: string;
  slipNumber: string; // e.g. SLIP-2026-10-001
  employeeId: string;
  employeeName: string;
  designation: string;
  month: string; // e.g. '2026-10'
  date: string;
  basicSalary: number;
  bonus: number;
  allowances: number;
  deductions: number;
  advanceDeduction: number;
  netSalary: number;
  paymentStatus: 'PAID' | 'PENDING';
  paymentMethod: 'CASH' | 'BANK';
  bankAccountId?: string;
  bankAccountName?: string;
  notes?: string;
  paidAt?: string;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  username: string;
  userFullName: string;
  role: string;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'SALE_INVOICE'
    | 'PURCHASE_BILL'
    | 'STOCK_ADD'
    | 'STOCK_UPDATE'
    | 'PRICE_ADJUSTMENT'
    | 'VOUCHER'
    | 'BILTY_UPDATE'
    | 'BACKUP';
  description: string;
  timestamp: string;
  details?: string;
}

export type ThemeColor = 'peacock-blue' | 'classic-slate';

export type UserRole = 'ADMIN' | 'ACCOUNTANT' | 'LAB_TECH' | 'CASHIER';

export interface UserAccount {
  id: string;
  username: string;
  email?: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  lastLogin?: string;
}

export interface SaleReturnItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity?: number;
  total?: number;
  returnQuantity?: number;
  totalRefund?: number;
  reason?: string;
  returnReason?: string;
  tagNo?: string;
  condition: 'GOOD' | 'FAULTY' | 'TESTING_FAILED' | 'RESTOCKABLE';
}

export interface SaleReturnInvoice {
  id: string;
  returnNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  originalInvoiceId?: string;
  originalInvoiceNumber?: string;
  items: SaleReturnItem[];
  subtotal: number;
  grandTotal: number;
  refundMethod: 'KHATA_CREDIT' | 'CASH' | 'BANK' | 'BANK_REFUND' | 'CASH_REFUND' | 'CREDIT_KHATA';
  bankAccountId?: string;
  bankAccountName?: string;
  biltyNumber?: string;
  transportName?: string;
  destinationStation?: string;
  biltyStatus?: 'RETURN_RECEIVED' | 'IN_TRANSIT' | 'CLAIMED';
  restockInventory?: boolean;
  notes?: string;
  createdAt: string;
}

export interface AutoBackupSettings {
  enabled: boolean;
  intervalMinutes: number;
  autoDownloadJson: boolean;
  lastSavedAt: string;
}

export interface BackupSnapshot {
  id: string;
  date: string;
  name: string;
  counts: {
    products: number;
    invoices: number;
    purchases: number;
    vouchers: number;
    transactions: number;
  };
  payload: string;
}

export interface RateListVoucher {
  id: string;
  voucherNumber: string;
  date: string;
  title: string;
  category: string;
  items: {
    productId: string;
    productName: string;
    sku: string;
    tagNo?: string;
    costPrice: number;
    salePrice: number;
    wholesalePrice?: number;
    minStockLevel: number;
    warranty: string;
  }[];
  notes?: string;
  authorizedBy: string;
  createdAt: string;
}

export interface StockAdjustmentVoucher {
  id: string;
  voucherNumber: string; // e.g. SAV-2026-0001
  date: string;
  type: 'ADDITION' | 'DEDUCTION';
  productId: string;
  productName: string;
  sku: string;
  tagNo?: string;
  quantity: number; // in pieces
  costPrice: number;
  totalValue: number;
  reasonCategory: 'AUDIT_DIFFERENCE' | 'DAMAGED_BROKEN' | 'EXPIRED_OBSOLETE' | 'SURPLUS_FOUND' | 'TESTING_SAMPLE' | 'OTHER';
  notes: string;
  authorizedBy: string;
  createdAt: string;
}

export type TagSizeFormat =
  | 'thermal_50x25'
  | 'thermal_40x20'
  | 'wine_70x160'
  | 'jewelry_barbell'
  | 'shipping_100x150'
  | 'a4_sheet_grid';

export interface TagPrintConfig {
  tagFormat: TagSizeFormat;
  productId?: string;
  productName: string;
  sku: string;
  tagNo: string;
  salePrice: number;
  costPrice?: number;
  category: string;
  warranty: string;
  companyName: string;
  copies: number;
  autoSerialProgression: boolean;
  productImage?: string;
  showBarcode: boolean;
  showQrCode: boolean;
  showPrice: boolean;
  showDate: boolean;
}

export interface SystemPrinterSettings {
  printerType: 'system_default' | 'thermal_80mm' | 'thermal_58mm' | 'tag_barcode_roll' | 'laser_a4';
  printerName: string;
  autoPrintOnInvoiceSave: boolean;
  autoPrintOnVoucherSave: boolean;
  printCopies: number;
}

