export type Language = 'en' | 'ur';
export type UrduFontTheme = 'jameel-noori' | 'standard';

export const translations = {
  en: {
    // App Branding
    appName: 'Fareed Electronics',
    appSubtitle: 'Official Tech Store & Lab',
    tagline: 'Precision Accounting, Inventory & Lab Management',
    labErpActive: 'LAB & ERP ACTIVE',
    trn: 'TRN / NTN',

    // Language & Themes
    language: 'Language',
    english: 'English',
    urdu: 'اردو (Urdu)',
    urduTheme: 'Urdu Font Theme',
    jameelNooriTheme: 'Jameel Noori Nastaleeq',
    standardFont: 'Standard Modern Font',
    fontStyle: 'Nastaleeq Calligraphy',

    // Navigation / Sidebar
    dashboard: 'Dashboard',
    stockManagement: 'Stock Management',
    stockReports: 'Stock Reports',
    customerInvoices: 'Customer Invoices',
    purchaseInvoices: 'Purchase Invoices',
    vouchers: 'Pay & Receive Vouchers',
    banking: 'Banking & Own Pic Billing',
    parties: 'Customers & Vendors',
    financialReports: 'Financial Reports',
    users: 'Users & Passwords',
    backup: 'Backup & Restore',
    settings: 'Settings & Branding',

    // Shortcuts & Header Actions
    newCustomerF1: '+ Customer',
    receivePayment: 'Receive Payment',
    payVoucher: 'Pay Voucher',
    saleInvoiceF2: 'Sale Invoice',
    purchaseBillF3: 'Purchase Bill',
    globalSearchF4: 'Global Search',
    chequeSearchF5: 'Cheque Search',
    printCtrlP: 'Print',
    saveCtrlS: 'Save',
    backEsc: 'Back (Esc)',
    shortcuts: 'Shortcuts',

    // Clear Data / Demo Data
    clearDemoData: 'Clear All Demo Data',
    deleteAllData: 'Delete All Data',
    clearDemoTitle: 'Clear Demo Invoices & Records',
    clearDemoDesc: 'Wipe all test customer sales, purchase bills, vouchers, bank transactions, and ledger balances so you can start with a fresh shop ledger.',
    confirmDeleteAll: 'Are you sure you want to delete all data?',
    typeClearToConfirm: 'Type CLEAR to confirm',
    cleanSlateReady: 'System reset to clean live store mode. All demo records cleared.',
    loadSampleData: 'Load Sample Store Records',
    keepInventoryProducts: 'Keep Product Inventory Catalog (Reset stock to 0)',
    wipeAllProducts: 'Completely Wipe Inventory Catalog Too',

    // Invoicing & Sales
    newSaleInvoice: 'New Customer Sale Invoice',
    createInvoice: 'Create Invoice',
    invoiceNumber: 'Invoice #',
    date: 'Date',
    dueDate: 'Due Date',
    customer: 'Customer',
    customerPhone: 'Customer Phone',
    customerAddress: 'Customer Address',
    items: 'Items',
    product: 'Product / Item',
    quantity: 'Qty',
    availableStock: 'Available Stock',
    unitPrice: 'Unit Price',
    warranty: 'Testing Warranty',
    total: 'Total',
    subtotal: 'Subtotal',
    discount: 'Discount',
    tax: 'Tax',
    grandTotal: 'Grand Total',
    paidAmount: 'Paid Amount',
    dueBalance: 'Balance Due',
    paymentStatus: 'Payment Status',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    bank: 'Bank Transfer',
    cheque: 'Cheque',
    credit: 'Credit / Khata',
    notes: 'Remarks / Notes',

    // WhatsApp Invoice Sharing
    whatsappInvoice: 'WhatsApp Invoice',
    sendViaWhatsApp: 'Send via WhatsApp',
    whatsappPromptTitle: 'WhatsApp Invoice to Customer',
    whatsappPromptDesc: 'Instantly send a formatted invoice receipt directly to the customer on WhatsApp.',
    openWhatsApp: 'Open WhatsApp Now',
    recipientPhone: 'WhatsApp Phone Number',
    messagePreview: 'Invoice Message Preview',

    // Inventory Stock Management
    inventoryAutoManaged: 'Inventory stock automatically updated upon sale invoice creation',
    lowStockWarning: 'Low Stock Alert',
    outOfStock: 'Out of Stock',
    stockDeducted: 'Stock successfully deducted from inventory',
    stockRestored: 'Stock restored back to inventory',
    inStock: 'In Stock',

    // Cheques
    chequeRegister: 'Cheque Register & Verification',
    chequeNo: 'Cheque #',
    draweeBank: 'Bank Name',
    partyName: 'Customer / Supplier',
    chequeStatus: 'Cheque Status',
    pendingClearing: 'Pending Clearing',
    cleared: 'Cleared in Bank',
    bounced: 'Returned / Bounced',
    markCleared: 'Mark as Cleared',
    markBounced: 'Mark as Bounced',
    noChequesFound: 'No cheques found matching search.',

    // Common
    searchPlaceholder: 'Search here...',
    actions: 'Actions',
    view: 'View',
    print: 'Print',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    success: 'Success',
    warning: 'Warning',
  },
  ur: {
    // App Branding
    appName: 'فرید الیکٹرانکس',
    appSubtitle: 'آفیشل ٹیک اسٹور اور لیب',
    tagline: 'جدید اکاؤنٹنگ، انوینٹری اسٹاک اور لیب مینجمنٹ سسٹم',
    labErpActive: 'لیب و ای آر پی فعال',
    trn: 'ٹیکس / این ٹی این نمبر',

    // Language & Themes
    language: 'زبان',
    english: 'English (انگریزی)',
    urdu: 'اردو (Urdu)',
    urduTheme: 'اردو فونٹ کا انداز',
    jameelNooriTheme: 'جمیل نوری نستعلیق',
    standardFont: 'عام جدید فونٹ',
    fontStyle: 'خوشخط نستعلیق خطاطی',

    // Navigation / Sidebar
    dashboard: 'ڈیش بورڈ',
    stockManagement: 'اسٹاک مینجمنٹ',
    stockReports: 'اسٹاک رپورٹس',
    customerInvoices: 'کسٹمر سیل انوائسز',
    purchaseInvoices: 'خریداری بل (پرچیز)',
    vouchers: 'واؤچرز اور کھاتہ',
    banking: 'بینکنگ و رسید تصویر',
    parties: 'گاہک اور وینڈرز کھاتہ',
    financialReports: 'مالیاتی رپورٹس و نفع نقصان',
    users: 'صارفین اور پاس ورڈ',
    backup: 'بیک اپ اور بحالی',
    settings: 'سیٹنگز اور برانڈنگ',

    // Shortcuts & Header Actions
    newCustomerF1: '+ نیا گاہک',
    receivePayment: 'وصولی ادائیگی',
    payVoucher: 'ادائیگی واؤچر',
    saleInvoiceF2: 'سیل انوائس',
    purchaseBillF3: 'خریداری بل',
    globalSearchF4: 'فوری تلاش',
    chequeSearchF5: 'چیک سرچ',
    printCtrlP: 'پرنٹ',
    saveCtrlS: 'محفوظ کریں',
    backEsc: 'واپس (Esc)',
    shortcuts: 'شارٹ کٹس',

    // Clear Data / Demo Data
    clearDemoData: 'تمام ڈیمو ڈیٹا صاف کریں',
    deleteAllData: 'مکمل ڈیٹا ڈیلیٹ کریں',
    clearDemoTitle: 'تمام فرضی ریکارڈ اور ڈیمو ڈیٹا صاف کریں',
    clearDemoDesc: 'دکان کے تمام فرضی سیل انوائسز، خریداری بل، واؤچرز، بینک ٹرانزیکشنز اور کھاتہ بیلنس کو صفر کر دیں تاکہ نیا حقیقی ریکارڈ درج کیا جا سکے۔',
    confirmDeleteAll: 'کیا آپ واقعی تمام ڈیٹا صاف کرنا چاہتے ہیں؟',
    typeClearToConfirm: 'تصدیق کے لیے CLEAR لکھیں',
    cleanSlateReady: 'تمام ڈیمو ریکارڈز صاف کر دیے گئے ہیں۔ سسٹم اب بالکل نیا اور تیار ہے۔',
    loadSampleData: 'نمونہ ریکارڈ لوڈ کریں',
    keepInventoryProducts: 'اسٹاک آئٹمز کی لسٹ رکھیں (صرف مقدار 0 کر دی جائے)',
    wipeAllProducts: 'پروڈکٹس اور آئٹمز کی فہرست بھی مکمل ڈیلیٹ کریں',

    // Invoicing & Sales
    newSaleInvoice: 'نیا کسٹمر سیل انوائس',
    createInvoice: 'انوائس تیار کریں',
    invoiceNumber: 'انوائس نمبر',
    date: 'تاریخ',
    dueDate: 'آخری تاریخ',
    customer: 'کسٹمر کا نام',
    customerPhone: 'کسٹمر موبائل نمبر',
    customerAddress: 'کسٹمر کا پتہ',
    items: 'آئٹمز / پرزہ جات',
    product: 'پروڈکٹ / سامان',
    quantity: 'تعداد',
    availableStock: 'موجودہ اسٹاک',
    unitPrice: 'فی یونٹ ریٹ',
    warranty: 'ٹیسٹنگ وارنٹی',
    total: 'کل رقم',
    subtotal: 'سب ٹوٹل',
    discount: 'رعایت (ڈسکاؤنٹ)',
    tax: 'ٹیکس',
    grandTotal: 'کل واجب الادا رقم',
    paidAmount: 'وصول شدہ رقم',
    dueBalance: 'بقایا رقم',
    paymentStatus: 'ادائیگی کی صورتحال',
    paymentMethod: 'طریقہ ادائیگی',
    cash: 'نقد (کیش)',
    bank: 'بینک ٹرانسفر',
    cheque: 'چیک',
    credit: 'ادھار / کھاتہ',
    notes: 'تفصیل یا ریمارکس',

    // WhatsApp Invoice Sharing
    whatsappInvoice: 'واٹس ایپ انوائس',
    sendViaWhatsApp: 'گاہک کو واٹس ایپ بھیجیں',
    whatsappPromptTitle: 'گاہک کو واٹس ایپ پر انوائس بھیجیں',
    whatsappPromptDesc: 'انوائس بنتے ہی گاہک کے واٹس ایپ پر خوبصورت اور مکمل رسید بذریعہ واٹس ایپ بھیجیں۔',
    openWhatsApp: 'واٹس ایپ پر بھیجیں',
    recipientPhone: 'واٹس ایپ نمبر',
    messagePreview: 'میسج کا پیش نظارہ',

    // Inventory Stock Management
    inventoryAutoManaged: 'سیل انوائس بنتے ہی انوینٹری اسٹاک خودکار طور پر کم ہو جائے گا',
    lowStockWarning: 'اسٹاک کم ہونے کا انتباہ',
    outOfStock: 'اسٹاک ختم ہے',
    stockDeducted: 'اسٹاک انوینٹری سے کامیابی سے منہا کر دیا گیا',
    stockRestored: 'اسٹاک واپس انوینٹری میں بحال ہو گیا',
    inStock: 'موجودہ اسٹاک',

    // Cheques
    chequeRegister: 'چیک رجسٹر اور تصدیق',
    chequeNo: 'چیک نمبر',
    draweeBank: 'بینک کا نام',
    partyName: 'گاہک یا سپلائر کا نام',
    chequeStatus: 'چیک کی کیفیت',
    pendingClearing: 'زیر التواء (کلیئرنگ)',
    cleared: 'بینک میں کلیئر ہو گیا',
    bounced: 'چیک باؤنس / واپس',
    markCleared: 'کلیئر مارک کریں',
    markBounced: 'باؤنس مارک کریں',
    noChequesFound: 'کوئی چیک نہیں ملا۔',

    // Common
    searchPlaceholder: 'یہاں تلاش کریں...',
    actions: 'کارروائی',
    view: 'دیکھیں',
    print: 'پرنٹ کریں',
    edit: 'ترمیم',
    delete: 'ڈیلیٹ کریں',
    cancel: 'منسوخ کریں',
    confirm: 'تصدیق کریں',
    close: 'بند کریں',
    success: 'کامیابی',
    warning: 'انتباہ',
  },
};

/**
 * Format WhatsApp bill text for sending to customer
 */
export function generateWhatsAppInvoiceMessage(
  invoice: {
    invoiceNumber: string;
    customerName: string;
    customerPhone: string;
    date: string;
    items: Array<{ productName: string; quantity: number; unitPrice: number; total: number }>;
    grandTotal: number;
    paidAmount: number;
    dueBalance: number;
    notes?: string;
  },
  companyName = 'Fareed Electronics',
  companyPhone = '+92 300 1234567',
  lang: Language = 'en'
): string {
  const isUrdu = lang === 'ur';

  if (isUrdu) {
    let msg = `*${companyName}*\n`;
    msg += `آفیشل ٹیک اسٹور اور لیب\n`;
    msg += `--------------------------------\n`;
    msg += `📄 *انوائس نمبر:* ${invoice.invoiceNumber}\n`;
    msg += `👤 *گاہک کا نام:* ${invoice.customerName}\n`;
    msg += `📅 *تاریخ:* ${invoice.date}\n`;
    msg += `--------------------------------\n`;
    msg += `🛒 *خریداری کی تفصیل:*\n`;

    invoice.items.forEach((item, index) => {
      msg += `${index + 1}. ${item.productName} (تعداد: ${item.quantity} x Rs. ${item.unitPrice.toLocaleString()}) = *Rs. ${item.total.toLocaleString()}*\n`;
    });

    msg += `--------------------------------\n`;
    msg += `💰 *کل رقم:* Rs. ${invoice.grandTotal.toLocaleString()}\n`;
    msg += `💵 *وصول شدہ رقم:* Rs. ${invoice.paidAmount.toLocaleString()}\n`;
    msg += `⚠️ *بقایا واجب الادا:* Rs. ${invoice.dueBalance.toLocaleString()}\n`;
    if (invoice.notes) {
      msg += `📝 *نوٹ:* ${invoice.notes}\n`;
    }
    msg += `--------------------------------\n`;
    msg += `فرید الیکٹرانکس کا انتخاب کرنے کا بہت شکریہ!\n`;
    msg += `رابطہ نمبر: ${companyPhone}\n`;
    return msg;
  }

  // English format
  let msg = `*${companyName.toUpperCase()}*\n`;
  msg += `Official Tech Store & Lab\n`;
  msg += `--------------------------------\n`;
  msg += `📄 *Invoice #:* ${invoice.invoiceNumber}\n`;
  msg += `👤 *Customer:* ${invoice.customerName}\n`;
  msg += `📅 *Date:* ${invoice.date}\n`;
  msg += `--------------------------------\n`;
  msg += `🛒 *Items Purchased:*\n`;

  invoice.items.forEach((item, index) => {
    msg += `${index + 1}. ${item.productName} (Qty: ${item.quantity} x Rs. ${item.unitPrice.toLocaleString()}) = *Rs. ${item.total.toLocaleString()}*\n`;
  });

  msg += `--------------------------------\n`;
  msg += `💰 *Grand Total:* Rs. ${invoice.grandTotal.toLocaleString()}\n`;
  msg += `💵 *Paid Amount:* Rs. ${invoice.paidAmount.toLocaleString()}\n`;
  msg += `⚠️ *Balance Due:* Rs. ${invoice.dueBalance.toLocaleString()}\n`;
  if (invoice.notes) {
    msg += `📝 *Notes:* ${invoice.notes}\n`;
  }
  msg += `--------------------------------\n`;
  msg += `Thank you for shopping at Fareed Electronics!\n`;
  msg += `Helpline: ${companyPhone}\n`;
  return msg;
}

/**
 * Format Pakistani phone number for WhatsApp link
 * e.g. 03001234567 -> 923001234567
 */
export function formatWhatsAppPhoneNumber(phone: string): string {
  if (!phone) return '';
  // Remove non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    // Replace leading 0 with 92 (Pakistan)
    cleaned = '92' + cleaned.substring(1);
  } else if (!cleaned.startsWith('92') && cleaned.length === 10) {
    cleaned = '92' + cleaned;
  }
  return cleaned;
}
