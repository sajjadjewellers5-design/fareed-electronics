export interface GuidelineSection {
  id: string;
  title: string;
  titleUrdu: string;
  icon: string;
  category: 'TAGS' | 'SALES' | 'STOCK' | 'ACCOUNTING' | 'HARDWARE' | 'SHORTCUTS';
  summary: string;
  summaryUrdu: string;
  steps: string[];
  stepsUrdu: string[];
  tips: string[];
  actionTab?: string;
  actionModal?: 'TAG_PRINT' | 'STOCK_ADJUST' | 'CREATE_SALE' | 'NEW_PRODUCT' | 'ACCOUNT_INFO';
}

export const SOFTWARE_GUIDELINES: GuidelineSection[] = [
  {
    id: 'tag-printing-system',
    title: 'All-Size Tag Printing System',
    titleUrdu: 'تمام سائز کے ٹیگ پرنٹنگ سسٹم کی مکمل رہنمائی',
    icon: 'Tag',
    category: 'TAGS',
    summary:
      'Print barcode and price tags in 6 physical formats with automatic non-repeating serial numbers and live photo capture.',
    summaryUrdu:
      'تمام سائز کے بارکوڈ اور پرائس ٹیگ پرنٹ کریں خودکار نان ریپیٹنگ سیریل نمبرز اور کیمرہ فوٹو کے ساتھ۔',
    steps: [
      '1. Open "Print Tags" from the Sidebar, Dashboard, or click the Tag icon on any product in Stock Management.',
      '2. Select your desired Tag Size & Shape: 50x25mm Standard Thermal, 40x20mm Small, 70x160mm Wine/Bottle Neck (with circular cutout guide), Jewelry Barbell (dumbbell shape for rings & eyewear), 100x150mm Pallet/Shipping, or A4 24-Label Grid.',
      '3. Pick an existing stock product from the dropdown or type custom item details (Product Name, SKU, Tag Serial #, Sale Price, Category, Warranty).',
      '4. Optional: Click "Snap Photo" to use your device webcam to capture a live product photo onto the tag.',
      '5. Specify the number of copies to print. Keep "Auto-Increment Serial across copies" checked so each copy gets a unique non-repeating sequential serial number.',
      '6. Inspect the live interactive print preview on the right side.',
      '7. Click "Print Tags Now" to trigger the system printer with zero-gap top margin layout.',
    ],
    stepsUrdu: [
      '1. سائیڈ بار، ڈیش بورڈ، یا اسٹاک میں کسی بھی آئٹم پر ٹیگ آئیکن پر کلک کر کے "Print Tags" کھولیں۔',
      '2. مطلوبہ ٹیگ سائز منتخب کریں: 50x25mm معیاری تھرمل، 40x20mm چھوٹا، 70x160mm بوتل نیک ٹیگ، جیولری باربیل ٹیگ، 100x150mm شپنگ کارٹن، یا A4 24-لیبل شیٹ۔',
      '3. موجودہ اسٹاک میں سے پروڈکٹ منتخب کریں یا نیا نام، ریٹ، اور تفصیل درج کریں۔',
      '4. اختیاری: "Snap Photo" پر کلک کر کے کیمرے سے تصویر کھینچ کر ٹیگ پر لگائیں۔',
      '5. جتنے ٹیگ پرنٹ کرنے ہیں تعداد منتخب کریں۔ آٹو انکریمنٹ چیک رکھیں تاکہ ہر ٹیگ کو الگ سیریل نمبر ملے۔',
      '6. دائیں جانب لائیو پرنٹ پرویو دیکھیں۔',
      '7. "Print Tags Now" پر کلک کر کے پرنٹر سے پرنٹ کریں۔',
    ],
    tips: [
      'The monotonic sequence progression guarantees previously printed tag numbers are never reused or duplicated.',
      'For thermal roll printers (e.g. Xprinter, Zebra), select "Barcode Label Printer" in target printer hardware.',
    ],
    actionModal: 'TAG_PRINT',
  },
  {
    id: 'tag-scanner-auto-connect',
    title: 'Tag & Barcode Scanner with Auto-Connect Sales',
    titleUrdu: 'ٹیگ اسکینر اور خودکار سیل انٹری',
    icon: 'Barcode',
    category: 'SALES',
    summary:
      'Instantly scan product tags or barcodes with hardware USB scanners or live camera to auto-add items to sale invoices in pieces.',
    summaryUrdu:
      'یو ایس بی بارکوڈ اسکینر یا کیمرے سے ٹیگ اسکین کر کے فوری سیل انوائس میں خودکار انٹری کریں۔',
    steps: [
      '1. Press F2 or click "+ New Sale Invoice" in Customer Sales.',
      '2. Select or enter the customer name and phone number.',
      '3. Locate the dedicated "Tag & Barcode Fast Scanner" bar directly above the line items table.',
      '4. Using a USB or Bluetooth barcode scanner, scan the tag on the product (or type the Tag No / SKU and press Enter).',
      '5. The software automatically connects with sales: it immediately appends the product to the invoice with 1 Piece quantity, pulls the price, and recalculates totals.',
      '6. If you scan the same tag again, the software automatically increments the Pieces quantity (+1 Pcs).',
      '7. A clear audio chime sounds and a green confirmation toast displays the scanned item name.',
      '8. Alternatively, click "Camera Scanner" to scan via device webcam.',
    ],
    stepsUrdu: [
      '1. F2 دبائیں یا کسٹمر سیلز میں "+ New Sale Invoice" پر کلک کریں۔',
      '2. کسٹمر کا نام اور فون نمبر درج کریں۔',
      '3. آئٹمز ٹیبل کے اوپر موجود "Tag & Barcode Fast Scanner" بار پر فوکس کریں۔',
      '4. بارکوڈ اسکینر سے پروڈکٹ کا ٹیگ اسکین کریں (یا ٹیگ نمبر لکھ کر Enter دبائیں)۔',
      '5. سافٹ ویئر خودکار طور پر پروڈکٹ کو 1 عدد تعداد کے ساتھ بل میں شامل کر دے گا۔',
      '6. اگر وہی ٹیگ دوبارہ اسکین کریں تو تعداد میں 1 کا اضافہ (+1 Pcs) ہو جائے گا۔',
      '7. اسکین ہونے پر کمپیوٹر سے بیپ کی آواز اور اسکرین پر نوٹیفکیشن آئے گا۔',
    ],
    tips: [
      'No mouse clicks are needed while scanning items—keep scanning tags continuously for high-speed POS checkout.',
    ],
    actionModal: 'CREATE_SALE',
  },
  {
    id: 'stock-pieces-auto-merge',
    title: 'Pieces Stock & Same-Name Auto-Merge',
    titleUrdu: 'اسٹاک پیسز اور ایک جیسے نام پر خودکار انٹری جمع ہونا',
    icon: 'Boxes',
    category: 'STOCK',
    summary:
      'Inventory is strictly tracked in Pieces (Pcs). Adding an item with the same name automatically merges and adds to previous stock quantity.',
    summaryUrdu:
      'اسٹاک پیسز (عدد) میں ٹریک ہوتا ہے۔ اگر پہلے سے موجود نام کا پروڈکٹ دوبارہ داخل کریں تو پچھلے اسٹاک میں نئی تعداد خود بخود جمع ہو جاتی ہے۔',
    steps: [
      '1. Press F6 or click "+ New Stock" in Stock Management.',
      '2. Enter the Product Name (e.g. "Samsung 43 Inch Smart 4K UHD LED").',
      '3. If an existing product with the same name already exists in inventory, a prominent green banner immediately appears informing you: "Same Product Already in Stock: Current X Pcs -> Adding Y Pcs will save new total: (X+Y) Pieces".',
      '4. Enter the stock quantity in Pieces (عدد / Pcs), cost price, and sale price.',
      '5. Upon clicking "Save Product", the new pieces quantity is automatically added to the existing product\'s stock balance.',
      '6. The software records an atomic Stock Intake ("IN") movement log noting the merged intake.',
      '7. When creating sale invoices, items sold in Pieces are automatically subtracted ("auto -") from stock.',
    ],
    stepsUrdu: [
      '1. F6 دبائیں یا اسٹاک مینجمنٹ میں "+ New Stock" پر کلک کریں۔',
      '2. پروڈکٹ کا نام درج کریں۔',
      '3. اگر یہ پروڈکٹ پہلے سے اسٹاک میں موجود ہو تو اسکرین پر سبز نوٹیفکیشن ظاہر ہو گا کہ اس میں نیا اسٹاک جمع ہو گا۔',
      '4. پیسز کی تعداد (Pcs)، خرید قیمت، اور فروخت قیمت درج کریں۔',
      '5. محفوظ کرنے پر نئی تعداد پچھلے اسٹاک میں جمع ہو جائے گی اور ڈپلیکیٹ آئٹم نہیں بنے گا۔',
      '6. جب آپ سیل انوائس بنائیں گے تو اتنے پیسز خود بخود اسٹاک سے مائنس ہو جائیں گے۔',
    ],
    tips: [
      'This prevents confusing duplicate rows for the same product and keeps accurate stock counts in Pieces.',
    ],
    actionModal: 'NEW_PRODUCT',
  },
  {
    id: 'stock-adjustment-voucher',
    title: 'Stock Adjustment Voucher (SAV)',
    titleUrdu: 'اسٹاک ایڈجسٹمنٹ واؤچر (اسٹاک کمی یا زیادتی)',
    icon: 'Sliders',
    category: 'STOCK',
    summary:
      'Official voucher system (SAV-2026-XXXX) for physical audit discrepancies, breakage, damages, surplus found, and write-offs.',
    summaryUrdu:
      'فزیکل آڈٹ کے فرق، ٹوٹ پھوٹ، خراب مال، یا اضافی مال کو باقاعدہ واؤچر کے ذریعے ایڈجسٹ کرنے کا طریقہ۔',
    steps: [
      '1. Click "Stock Adjustment (ایڈجسٹمنٹ واؤچر)" from the Sidebar, Dashboard, or Stock Management.',
      '2. Select the Voucher Type: ADDITION (+) for found surplus stock/recovery, or DEDUCTION (-) for damaged, expired, or missing stock.',
      '3. Select the Product from inventory. The voucher shows the current stock in Pieces and projected new stock in real time.',
      '4. Enter the adjustment quantity in Pieces (عدد) and select the reason category (Damaged/Broken, Audit Discrepancy, Expired, Surplus Found, Testing Sample, Other).',
      '5. Enter detailed audit notes and remarks.',
      '6. Click "Save & Print Stock Adjustment Voucher".',
      '7. The inventory stock is instantly adjusted in real time and an official Stock Adjustment Voucher slip preview opens for printing.',
    ],
    stepsUrdu: [
      '1. سائیڈ بار، ڈیش بورڈ، یا اسٹاک سے "Stock Adjustment" پر کلک کریں۔',
      '2. واؤچر کی قسم منتخب کریں: ADDITION (+) اگر اضافی مال ملا ہو، یا DEDUCTION (-) اگر مال ٹوٹا یا کم ہو۔',
      '3. پروڈکٹ منتخب کریں۔ موجودہ اسٹاک اور نیا متوقع اسٹاک سامنے آئے گا۔',
      '4. پیسز کی تعداد اور وجہ منتخب کریں (خراب مال، آڈٹ میں فرق، وغیرہ)۔',
      '5. آڈٹ نوٹ لکھیں اور "Save & Print" پر کلک کریں۔',
      '6. اسٹاک فوری اپڈیٹ ہو جائے گا اور پرنٹ سلپ سامنے آ جائے گی۔',
    ],
    tips: [
      'All SAV vouchers calculate the exact cost value impact and are archived in the History tab for auditing.',
    ],
    actionModal: 'STOCK_ADJUST',
  },
  {
    id: 'customer-sales-bilty-print',
    title: 'Customer Sales, Transport Bilty & Print Preview',
    titleUrdu: 'کسٹمر سیلز، کارگو بلٹی اور پرنٹ پرویو',
    icon: 'Receipt',
    category: 'SALES',
    summary:
      'Create sales invoices with pieces quantities, customer due balances, bilty cargo logistics, and thermal or A4 print preview.',
    summaryUrdu:
      'سیل انوائس بنائیں، کارگو بلٹی نمبر درج کریں اور تھرمل یا A4 میں پرنٹ پرویو دیکھیں۔',
    steps: [
      '1. Press F2 to open the Create Sale Invoice modal.',
      '2. Choose a registered customer from the dropdown or type a walk-in customer name and phone.',
      '3. Scan tags or pick products from the list. Specify quantity in Pieces.',
      '4. Optional Bilty Transport details: enter Bilty #, Transport Cargo service (e.g. Daewoo Express, Faisal Movers, Goods Transport), Destination Station (City), and Carton Count.',
      '5. Enter Paid Amount (cash, bank, or partial). Remaining balance will automatically be tracked on the customer\'s ledger.',
      '6. Click "Save & Generate Invoice".',
      '7. To preview before printing, click the "Print Preview" (Eye icon) button on any invoice row: choose between Thermal 80mm Slip or Official A4 Tax Invoice.',
    ],
    stepsUrdu: [
      '1. F2 دبائیں اور کسٹمر سیل انوائس کھولیں۔',
      '2. کسٹمر منتخب کریں، آئٹمز اور پیسز کی تعداد درج کریں۔',
      '3. اگر مال کارگو سے بھیجنا ہو تو بلٹی نمبر، ٹرانسپورٹ کا نام اور شہر درج کریں۔',
      '4. وصول شدہ رقم درج کریں، بقایا کسٹمر کے کھاتے میں خود بخود جمع ہو جائے گا۔',
      '5. محفوظ کریں اور "Print Preview" پر کلک کر کے 80mm تھرمل یا A4 بل منتخب کر کے پرنٹ کریں۔',
    ],
    tips: [
      'Click the WhatsApp button on any invoice to instantly send invoice details to the customer.',
    ],
    actionTab: 'customer-invoices',
  },
  {
    id: 'accounting-daybook-ledgers',
    title: 'Day Book, Accounting Vouchers & Ledgers',
    titleUrdu: 'روزنامچہ، واؤچرز اور کھاتہ جات (لیجر)',
    icon: 'FileText',
    category: 'ACCOUNTING',
    summary:
      'Full double-entry accounting with Day Book (Roznamcha), Receipt (RV), Payment (PV), and Journal (JV) vouchers.',
    summaryUrdu:
      'روزنامچہ، وصولی واؤچر (RV)، ادائیگی واؤچر (PV)، جنرل واؤچر (JV) اور کسٹمر و سپلائر لیجر۔',
    steps: [
      '1. Day Book (روزنامچہ): Click "Day Book" from Sidebar to view real-time daily cash inflows, sales, purchases, bank deposits, and expenses.',
      '2. Receipt Voucher (RV): Press F4 to record customer cash/bank receipts.',
      '3. Payment Voucher (PV): Use to record payments to suppliers or lab expenses.',
      '4. Journal Voucher (JV): For adjustments and non-cash debits/credits across the 14 Chart of Accounts heads.',
      '5. Customer & Supplier Ledgers: Click "Customer & Vendor Ledgers" in Sidebar to view detailed debit/credit statements with running balance.',
    ],
    stepsUrdu: [
      '1. روزنامچہ: سائیڈ بار سے "Day Book" کھولیں اور دن بھر کی تمام کیش و بینک آمدن و اخراجات دیکھیں۔',
      '2. وصولی واؤچر (RV): F4 دبا کر کسٹمر سے وصولی درج کریں۔',
      '3. ادائیگی واؤچر (PV): سپلائر کو ادائیگی یا دکان کے خرچے درج کریں۔',
      '4. لیجر: کسٹمر اور سپلائر کے کھاتوں کی مکمل تاریخ اور رننگ بیلنس دیکھیں۔',
    ],
    tips: [
      'Auto-JV is created automatically when creating sales invoices with partial payments or credit.',
    ],
    actionTab: 'day-book',
  },
  {
    id: 'printers-hardware-settings',
    title: 'Printer Selection & Hardware Profiles',
    titleUrdu: 'پرنٹر سلیکشن اور ہارڈویئر سیٹنگز',
    icon: 'Printer',
    category: 'HARDWARE',
    summary:
      'Configure system default printers, 80mm thermal pos slips, 58mm mini receipts, barcode rolls, or A4 page printers.',
    summaryUrdu:
      'تھرمل 80mm، منی 58mm، بارکوڈ رول، یا لیزر A4 پرنٹر کے پروفائلز کی ترتیب۔',
    steps: [
      '1. Open Settings from Sidebar or open the Print Preview modal on any document.',
      '2. In the "Printer Hardware Profile" dropdown, select your preferred hardware:',
      '   - System Default Printer (سسٹم ڈیفالٹ پرنٹر - window.print())',
      '   - Thermal 80mm Slip (3-inch POS receipts)',
      '   - Thermal 58mm Slip Mini (2-inch compact receipts)',
      '   - Barcode Label Printer (Xprinter / Zebra / TSC / Rongta rolls)',
      '   - Laser / Inkjet A4 Printer (Standard office sheets)',
      '3. In Print Preview, switch between Thermal and A4 layouts to match your paper stock.',
      '4. Configure auto-print options upon invoice saving if desired.',
    ],
    stepsUrdu: [
      '1. سیٹنگز یا پرنٹ پرویو اسکرین کھولیں۔',
      '2. پرنٹر ہارڈویئر لسٹ میں سے اپنا پرنٹر منتخب کریں (سسٹم ڈیفالٹ، تھرمل 80mm، بارکوڈ لیبل، یا A4)۔',
      '3. پرویو میں تھرمل یا A4 لے آؤٹ منتخب کریں۔',
      '4. "Print Document" پر کلک کریں اور مطلوبہ پرنٹر پر بھیجیں۔',
    ],
    tips: [
      'All layouts have optimized @media print CSS to print starting at top of page without blank headers.',
    ],
    actionTab: 'settings',
  },
  {
    id: 'keyboard-shortcuts-directory',
    title: 'Keyboard Shortcuts Reference (کی بورڈ شارٹ کٹس)',
    titleUrdu: 'کی بورڈ شارٹ کٹس کی مکمل فہرست',
    icon: 'Keyboard',
    category: 'SHORTCUTS',
    summary:
      'Master the system with ultra-fast keyboard shortcuts for sales, purchases, payments, stock, and navigation.',
    summaryUrdu:
      'کی بورڈ شارٹ کٹس کے ذریعے ماؤس کے بغیر تیز ترین کام کریں۔',
    steps: [
      '• Esc: Close active modal or return to Dashboard.',
      '• F1: Open Keyboard Shortcuts & Help Center.',
      '• F2: Create New Sale Invoice.',
      '• F3: Create New Purchase Invoice (اسٹاک خریداری).',
      '• F4: Receive Customer Payment (وصولی واؤچر).',
      '• F6: New Stock Intake Entry (نیا اسٹاک اندراج).',
      '• F7: Record Payment Voucher (ادائیگی واؤچر).',
      '• F8: Record Journal Voucher (جنرل واؤچر انٹری).',
      '• F9: Global Smart Search (پوری ایپ میں فوری تلاش).',
      '• F10: Cheque Search & Clearance (چیک کلیئرنس تلاش).',
    ],
    stepsUrdu: [
      '• Esc: ونڈو بند کریں یا ڈیش بورڈ پر واپس جائیں۔',
      '• F1: مدد اور شارٹ کٹس گائیڈ کھولیں۔',
      '• F2: نئی سیل انوائس بنائیں۔',
      '• F3: نئی پرچیز انوائس (خریداری) بنائیں۔',
      '• F4: کسٹمر سے وصولی درج کریں۔',
      '• F6: نیا اسٹاک پروڈکٹ داخل کریں۔',
      '• F7: ادائیگی واؤچر درج کریں۔',
      '• F8: جنرل واؤچر انٹری (JV) بنائیں۔',
      '• F9: گلوبل سرچ کھولیں۔',
      '• F10: چیک تلاش اور کلیئرنس کریں۔',
    ],
    tips: [
      'Press Esc anytime to dismiss any popup window instantly.',
    ],
  },
];
