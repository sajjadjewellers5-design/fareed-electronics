import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Barcode,
  QrCode,
  Camera,
  Layers,
  Sparkles,
  Tag,
  Check,
  Copy,
  RotateCcw,
  Sliders,
  Wine,
  Gem,
  Package,
  FileText,
  Eye,
  Settings2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductItem, TagSizeFormat } from '../types';
import { WebcamCaptureModal } from './WebcamCaptureModal';
import { FareedElectronicsBadge } from './BrandLogo';

export const TagPrintingModal: React.FC = () => {
  const {
    isTagPrintingModalOpen,
    setIsTagPrintingModalOpen,
    products,
    selectedProductForTag,
    setSelectedProductForTag,
    formatCurrency,
    companyProfile,
    systemPrinterSettings,
    updateSystemPrinterSettings,
    historicalTagNumbers,
    getNextTagSerialNumber,
    recordPrintedTagSerial,
  } = useApp();

  // Selected tag format
  const [tagFormat, setTagFormat] = useState<TagSizeFormat>('thermal_50x25');

  // Form Fields
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productName, setProductName] = useState<string>('Samsung 43" Smart 4K UHD LED');
  const [sku, setSku] = useState<string>('SAM-LED-43');
  const [tagNo, setTagNo] = useState<string>('TAG-2026-00001');
  const [salePrice, setSalePrice] = useState<number>(85000);
  const [costCode, setCostCode] = useState<string>('PR-680'); // encrypted cost code
  const [category, setCategory] = useState<string>('Smart Displays');
  const [warranty, setWarranty] = useState<string>('1 Year Official Brand Warranty');
  const [copies, setCopies] = useState<number>(2);
  const [autoSerialProgression, setAutoSerialProgression] = useState<boolean>(true);
  const [tagImage, setTagImage] = useState<string>('');
  const [isWebcamOpen, setIsWebcamOpen] = useState<boolean>(false);

  // Toggles
  const [showBarcode, setShowBarcode] = useState<boolean>(true);
  const [showQrCode, setShowQrCode] = useState<boolean>(true);
  const [showPrice, setShowPrice] = useState<boolean>(true);
  const [showCompanyLogo, setShowCompanyLogo] = useState<boolean>(true);
  const [printerSelection, setPrinterSelection] = useState<string>(
    systemPrinterSettings.printerType || 'system_default'
  );

  // Sync when selectedProductForTag changes
  useEffect(() => {
    if (selectedProductForTag) {
      setSelectedProductId(selectedProductForTag.id);
      setProductName(selectedProductForTag.name);
      setSku(selectedProductForTag.sku || '');
      setTagNo(selectedProductForTag.tagNo || getNextTagSerialNumber());
      setSalePrice(selectedProductForTag.salePrice || 0);
      setCategory(selectedProductForTag.category || 'General');
      if (selectedProductForTag.image) {
        setTagImage(selectedProductForTag.image);
      }
    } else if (isTagPrintingModalOpen && !tagNo) {
      setTagNo(getNextTagSerialNumber());
    }
  }, [selectedProductForTag, isTagPrintingModalOpen]);

  // Handle product dropdown change
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setProductName(prod.name);
      setSku(prod.sku || '');
      setTagNo(prod.tagNo || getNextTagSerialNumber());
      setSalePrice(prod.salePrice);
      setCategory(prod.category);
      if (prod.image) setTagImage(prod.image);
    }
  };

  // Generate sequence of serial numbers for the copies
  const generateSerialList = (): string[] => {
    if (!autoSerialProgression || copies <= 1) {
      return Array(copies).fill(tagNo || 'TAG-2026-00001');
    }
    const list: string[] = [];
    const prefixMatch = (tagNo || 'TAG-2026-00001').match(/^(.*?)(\d+)$/);
    if (!prefixMatch) {
      return Array(copies).fill(tagNo);
    }
    const prefix = prefixMatch[1];
    let num = parseInt(prefixMatch[2], 10);
    const numDigits = prefixMatch[2].length;

    for (let i = 0; i < copies; i++) {
      const formatted = `${prefix}${String(num + i).padStart(numDigits, '0')}`;
      list.push(formatted);
    }
    return list;
  };

  const serialList = generateSerialList();

  // Print execution
  const handlePrint = () => {
    // Record printed tags to persistent sequential history so they are NEVER reused
    serialList.forEach((sn) => {
      recordPrintedTagSerial(sn);
    });

    // Update default printer if changed
    updateSystemPrinterSettings({
      printerType: printerSelection as any,
    });

    // Allow DOM to render then trigger system print dialog
    setTimeout(() => {
      window.print();
    }, 200);
  };

  if (!isTagPrintingModalOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
          
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>All-Size Tag &amp; Barcode Printing System</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                    تمام سائز کے ٹیگ
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Print thermal rolls, jewelry barbells, bottle neck tags, large carton tags &amp; A4 sheets with auto-serial numbers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tags (پرنٹ کریں)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsTagPrintingModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Left Controls, Right Live Preview */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
            
            {/* Left Column: Form & Configuration (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* 1. Tag Size Format Selector */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>1. Select Tag Size &amp; Shape (سائز منتخب کریں)</span>
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  {/* 50x25mm Standard */}
                  <button
                    type="button"
                    onClick={() => setTagFormat('thermal_50x25')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      tagFormat === 'thermal_50x25'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Barcode className="w-4 h-4 text-cyan-400" />
                      <span>50x25mm Standard</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      2" x 1" Thermal Barcode Roll
                    </div>
                  </button>

                  {/* 40x20mm Small */}
                  <button
                    type="button"
                    onClick={() => setTagFormat('thermal_40x20')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      tagFormat === 'thermal_40x20'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Barcode className="w-4 h-4 text-indigo-400" />
                      <span>40x20mm Small</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Mini Accessories &amp; Parts
                    </div>
                  </button>

                  {/* Wine / Bottle Neck 70x160mm */}
                  <button
                    type="button"
                    onClick={() => setTagFormat('wine_70x160')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      tagFormat === 'wine_70x160'
                        ? 'bg-amber-600/20 border-amber-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Wine className="w-4 h-4 text-amber-400" />
                      <span>70x160mm Bottle Tag</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      With Neck Hole Cutout Guide
                    </div>
                  </button>

                  {/* Jewelry Barbell Tag */}
                  <button
                    type="button"
                    onClick={() => setTagFormat('jewelry_barbell')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      tagFormat === 'jewelry_barbell'
                        ? 'bg-pink-600/20 border-pink-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Gem className="w-4 h-4 text-pink-400" />
                      <span>Jewelry Barbell Tag</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Dumbbell for Rings &amp; Eyewear
                    </div>
                  </button>

                  {/* 100x150mm Shipping */}
                  <button
                    type="button"
                    onClick={() => setTagFormat('shipping_100x150')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      tagFormat === 'shipping_100x150'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <span>100x150mm Pallet</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      4" x 6" Carton &amp; Bilty Label
                    </div>
                  </button>

                  {/* A4 Sheet Grid */}
                  <button
                    type="button"
                    onClick={() => setTagFormat('a4_sheet_grid')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      tagFormat === 'a4_sheet_grid'
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>A4 Multi-Label Grid</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      24 Labels / A4 Sheet (3x8)
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Product Picker or Custom Entry */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    <span>2. Product &amp; Price Details</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsWebcamOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-900 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Snap Photo</span>
                  </button>
                </div>

                {/* Dropdown to pick existing product */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Pick From Existing Stock (اختیاری)</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">-- Choose Existing Item or Type Custom --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) - {formatCurrency(p.salePrice)} [Stock: {p.stockQuantity} Pcs]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Product Title on Tag</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* SKU, Tag No, Price */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">SKU Code</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tag Serial #</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tagNo}
                        onChange={(e) => setTagNo(e.target.value)}
                        className="w-full px-2 py-2 bg-slate-900 border border-indigo-500/50 rounded-xl text-xs text-indigo-300 font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Sale Price (Rs)</label>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-emerald-400 font-bold"
                    />
                  </div>
                </div>

                {/* Category & Warranty */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Category / Type</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Warranty Term</label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Copies & Serial Monotonic Progression */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Copy className="w-4 h-4" />
                  <span>3. Copies &amp; Serial Progression (کاپیاں اور تسلسل)</span>
                </label>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] text-slate-400 mb-1">Number of Tags to Print</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={copies}
                      onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white"
                    />
                  </div>

                  <div className="flex-1 pt-4">
                    <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSerialProgression}
                        onChange={(e) => setAutoSerialProgression(e.target.checked)}
                        className="rounded text-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Auto-Increment Serial across copies</span>
                    </label>
                    <p className="text-[10px] text-indigo-400 mt-1">
                      Guaranteed never reuses or prints previous numbers!
                    </p>
                  </div>
                </div>

                {/* Printer Selection Option */}
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                    <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Target Printer Hardware Profile</span>
                  </label>
                  <select
                    value={printerSelection}
                    onChange={(e) => setPrinterSelection(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="system_default">System Default Printer (سسٹم ڈیفالٹ پرنٹر)</option>
                    <option value="tag_barcode_roll">Barcode Label Printer (Xprinter / Zebra / TSC / Rongta)</option>
                    <option value="thermal_80mm">Thermal 80mm Slip Printer</option>
                    <option value="thermal_58mm">Thermal 58mm Slip Mini Printer</option>
                    <option value="laser_a4">Laser / Inkjet A4 Sticker Sheet</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Right Column: Live Interactive Print Preview (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-start min-h-[450px] overflow-y-auto">
              
              <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>Live Tag Print Preview ({copies} {copies === 1 ? 'Tag' : 'Tags'})</span>
                </span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  {tagFormat.toUpperCase().replace('_', ' ')}
                </span>
              </div>

              {/* Printable Wrapper (Used for both Screen preview and actual @media print) */}
              <div
                id="printable-tag-area"
                className="w-full flex flex-wrap gap-4 items-start justify-center"
              >
                {serialList.map((sn, idx) => (
                  <div
                    key={idx}
                    className="tag-print-item bg-white text-black rounded-lg shadow-xl border border-slate-300 relative overflow-hidden transition-all select-none"
                    style={{
                      // Precise physical styling based on format
                      width:
                        tagFormat === 'thermal_50x25'
                          ? '220px'
                          : tagFormat === 'thermal_40x20'
                          ? '180px'
                          : tagFormat === 'wine_70x160'
                          ? '260px'
                          : tagFormat === 'jewelry_barbell'
                          ? '280px'
                          : tagFormat === 'shipping_100x150'
                          ? '340px'
                          : '190px',
                      minHeight:
                        tagFormat === 'thermal_50x25'
                          ? '120px'
                          : tagFormat === 'thermal_40x20'
                          ? '95px'
                          : tagFormat === 'wine_70x160'
                          ? '420px'
                          : tagFormat === 'jewelry_barbell'
                          ? '80px'
                          : tagFormat === 'shipping_100x150'
                          ? '480px'
                          : '120px',
                      padding:
                        tagFormat === 'jewelry_barbell'
                          ? '4px'
                          : tagFormat === 'thermal_40x20'
                          ? '6px'
                          : '10px',
                    }}
                  >

                    {/* FORMAT A: WINE / BOTTLE NECK TAG (70x160mm) */}
                    {tagFormat === 'wine_70x160' && (
                      <div className="flex flex-col items-center text-center h-full space-y-3">
                        {/* Cutout punch hole for bottle neck */}
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-400 flex flex-col items-center justify-center bg-slate-50 mt-2">
                          <Wine className="w-5 h-5 text-slate-400" />
                          <span className="text-[8px] text-slate-500 font-mono">BOTTLE NECK HOLE</span>
                        </div>
                        <div className="w-full border-t border-dashed border-slate-400 my-1">
                          <span className="text-[8px] text-slate-400 uppercase font-mono tracking-widest">FOLD LINE</span>
                        </div>

                        {/* Brand header */}
                        <div className="flex items-center gap-1.5">
                          <FareedElectronicsBadge size={28} />
                          <span className="font-bold text-sm tracking-wide">FAREED ELECTRONICS</span>
                        </div>

                        {tagImage && (
                          <img
                            src={tagImage}
                            alt=""
                            className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                          />
                        )}

                        <div className="text-base font-bold font-serif px-2 leading-tight">
                          {productName}
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono">
                          {sku} | {category}
                        </div>

                        {/* Price box */}
                        <div className="w-full bg-slate-900 text-white py-1.5 rounded-lg text-center font-bold text-lg font-mono">
                          {formatCurrency(salePrice)}
                        </div>

                        {/* Barcode & Serial */}
                        <div className="pt-2 w-full flex flex-col items-center">
                          <svg className="w-48 h-10" viewBox="0 0 200 40">
                            {/* Realistic Barcode bars pattern */}
                            <rect x="10" y="5" width="2" height="30" fill="#000" />
                            <rect x="15" y="5" width="3" height="30" fill="#000" />
                            <rect x="22" y="5" width="1" height="30" fill="#000" />
                            <rect x="26" y="5" width="4" height="30" fill="#000" />
                            <rect x="34" y="5" width="2" height="30" fill="#000" />
                            <rect x="40" y="5" width="3" height="30" fill="#000" />
                            <rect x="48" y="5" width="1" height="30" fill="#000" />
                            <rect x="54" y="5" width="4" height="30" fill="#000" />
                            <rect x="62" y="5" width="2" height="30" fill="#000" />
                            <rect x="68" y="5" width="3" height="30" fill="#000" />
                            <rect x="76" y="5" width="1" height="30" fill="#000" />
                            <rect x="82" y="5" width="4" height="30" fill="#000" />
                            <rect x="90" y="5" width="2" height="30" fill="#000" />
                            <rect x="96" y="5" width="3" height="30" fill="#000" />
                            <rect x="104" y="5" width="2" height="30" fill="#000" />
                            <rect x="110" y="5" width="4" height="30" fill="#000" />
                            <rect x="118" y="5" width="1" height="30" fill="#000" />
                            <rect x="124" y="5" width="3" height="30" fill="#000" />
                            <rect x="132" y="5" width="2" height="30" fill="#000" />
                            <rect x="140" y="5" width="4" height="30" fill="#000" />
                            <rect x="148" y="5" width="2" height="30" fill="#000" />
                            <rect x="154" y="5" width="3" height="30" fill="#000" />
                            <rect x="162" y="5" width="1" height="30" fill="#000" />
                            <rect x="170" y="5" width="4" height="30" fill="#000" />
                            <rect x="180" y="5" width="2" height="30" fill="#000" />
                          </svg>
                          <span className="font-mono text-xs font-bold tracking-widest">{sn}</span>
                          <span className="text-[9px] text-slate-500">{warranty}</span>
                        </div>
                      </div>
                    )}

                    {/* FORMAT B: JEWELRY BARBELL TAG (Dumbbell shape) */}
                    {tagFormat === 'jewelry_barbell' && (
                      <div className="flex items-center justify-between h-full w-full">
                        {/* Left Wing (Head 1) */}
                        <div className="w-[105px] border border-slate-300 rounded p-1 flex flex-col justify-between h-full bg-slate-50 text-[9px]">
                          <div className="font-bold truncate text-black font-serif">FAREED–ELEC</div>
                          <div className="font-bold truncate text-[10px] text-indigo-900">{productName}</div>
                          <div className="font-mono font-bold text-[11px] text-black">{formatCurrency(salePrice)}</div>
                        </div>

                        {/* Narrow central bridge for ring/frame wrap */}
                        <div className="flex-1 flex flex-col items-center justify-center px-1">
                          <div className="w-full h-1 bg-slate-300 rounded" />
                          <span className="text-[7px] text-slate-400 font-mono tracking-tighter">WRAP</span>
                        </div>

                        {/* Right Wing (Head 2) */}
                        <div className="w-[105px] border border-slate-300 rounded p-1 flex flex-col items-center justify-between h-full bg-slate-50 text-[8px]">
                          <div className="font-mono font-bold text-[9px]">{sn}</div>
                          {/* Mini barcode */}
                          <svg className="w-20 h-5" viewBox="0 0 100 20">
                            <rect x="5" y="2" width="2" height="16" fill="#000" />
                            <rect x="10" y="2" width="3" height="16" fill="#000" />
                            <rect x="16" y="2" width="1" height="16" fill="#000" />
                            <rect x="20" y="2" width="4" height="16" fill="#000" />
                            <rect x="28" y="2" width="2" height="16" fill="#000" />
                            <rect x="34" y="2" width="3" height="16" fill="#000" />
                            <rect x="42" y="2" width="1" height="16" fill="#000" />
                            <rect x="48" y="2" width="4" height="16" fill="#000" />
                            <rect x="56" y="2" width="2" height="16" fill="#000" />
                            <rect x="62" y="2" width="3" height="16" fill="#000" />
                            <rect x="70" y="2" width="1" height="16" fill="#000" />
                            <rect x="76" y="2" width="4" height="16" fill="#000" />
                            <rect x="85" y="2" width="2" height="16" fill="#000" />
                            <rect x="90" y="2" width="3" height="16" fill="#000" />
                          </svg>
                          <div className="text-[7px] text-slate-500 truncate w-full text-center">{sku}</div>
                        </div>
                      </div>
                    )}

                    {/* FORMAT C: STANDARD THERMAL (50x25mm / 40x20mm / A4 Grid) */}
                    {(tagFormat === 'thermal_50x25' ||
                      tagFormat === 'thermal_40x20' ||
                      tagFormat === 'a4_sheet_grid') && (
                      <div className="flex flex-col justify-between h-full">
                        {/* Top Line: Brand & Serial */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                          <div className="flex items-center gap-1">
                            <FareedElectronicsBadge size={14} />
                            <span className="font-bold text-[10px] tracking-tight">
                              FAREED ELECTRONICS
                            </span>
                          </div>
                          <span className="font-mono text-[9px] font-bold bg-slate-100 px-1 rounded">
                            {sn}
                          </span>
                        </div>

                        {/* Middle: Title & SKU */}
                        <div className="py-1">
                          <div className="font-bold text-[11px] leading-tight text-slate-900 truncate">
                            {productName}
                          </div>
                          <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono mt-0.5">
                            <span>SKU: {sku}</span>
                            <span>{category}</span>
                          </div>
                        </div>

                        {/* Barcode graphic */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <svg className="w-32 h-6" viewBox="0 0 150 25">
                              <rect x="5" y="2" width="2" height="20" fill="#000" />
                              <rect x="10" y="2" width="3" height="20" fill="#000" />
                              <rect x="15" y="2" width="1" height="20" fill="#000" />
                              <rect x="18" y="2" width="4" height="20" fill="#000" />
                              <rect x="25" y="2" width="2" height="20" fill="#000" />
                              <rect x="30" y="2" width="3" height="20" fill="#000" />
                              <rect x="36" y="2" width="1" height="20" fill="#000" />
                              <rect x="40" y="2" width="4" height="20" fill="#000" />
                              <rect x="47" y="2" width="2" height="20" fill="#000" />
                              <rect x="52" y="2" width="3" height="20" fill="#000" />
                              <rect x="58" y="2" width="1" height="20" fill="#000" />
                              <rect x="62" y="2" width="4" height="20" fill="#000" />
                              <rect x="69" y="2" width="2" height="20" fill="#000" />
                              <rect x="74" y="2" width="3" height="20" fill="#000" />
                              <rect x="80" y="2" width="1" height="20" fill="#000" />
                              <rect x="84" y="2" width="4" height="20" fill="#000" />
                              <rect x="91" y="2" width="2" height="20" fill="#000" />
                              <rect x="96" y="2" width="3" height="20" fill="#000" />
                              <rect x="102" y="2" width="1" height="20" fill="#000" />
                              <rect x="106" y="2" width="4" height="20" fill="#000" />
                              <rect x="113" y="2" width="2" height="20" fill="#000" />
                              <rect x="118" y="2" width="3" height="20" fill="#000" />
                              <rect x="125" y="2" width="1" height="20" fill="#000" />
                              <rect x="130" y="2" width="4" height="20" fill="#000" />
                            </svg>
                            <span className="font-mono text-[8px] text-center">{sn}</span>
                          </div>

                          {/* Price Tag */}
                          <div className="text-right">
                            <span className="text-[7px] text-slate-400 block">NET PRICE</span>
                            <span className="text-sm font-bold font-mono text-black">
                              {formatCurrency(salePrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FORMAT D: 100x150mm SHIPPING / CARTON LABEL */}
                    {tagFormat === 'shipping_100x150' && (
                      <div className="flex flex-col justify-between h-full p-2 space-y-3">
                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                          <div className="flex items-center gap-2">
                            <FareedElectronicsBadge size={36} />
                            <div>
                              <div className="font-bold text-base">FAREED ELECTRONICS</div>
                              <div className="text-[10px] text-slate-600 font-mono">OFFICIAL WAREHOUSE LOGISTICS</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-black text-white px-2 py-1 text-xs font-mono font-bold rounded">
                              EXPRESS FREIGHT
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs border-b pb-2">
                          <div>
                            <span className="text-[9px] text-slate-500 block uppercase font-mono">Item Name</span>
                            <span className="font-bold text-sm">{productName}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 block uppercase font-mono">Serial / Bilty</span>
                            <span className="font-mono font-black text-base">{sn}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-500 block font-mono">SKU / CATEGORY</span>
                            <span className="font-bold font-mono">{sku} / {category}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 block font-mono">RETAIL VALUE</span>
                            <span className="text-xl font-mono font-black">{formatCurrency(salePrice)}</span>
                          </div>
                        </div>

                        {/* Large barcode */}
                        <div className="pt-2 flex flex-col items-center border-t border-slate-300">
                          <svg className="w-full h-16" viewBox="0 0 250 50">
                            {/* Barcode bars */}
                            <rect x="15" y="5" width="3" height="40" fill="#000" />
                            <rect x="22" y="5" width="4" height="40" fill="#000" />
                            <rect x="30" y="5" width="2" height="40" fill="#000" />
                            <rect x="36" y="5" width="5" height="40" fill="#000" />
                            <rect x="46" y="5" width="3" height="40" fill="#000" />
                            <rect x="54" y="5" width="4" height="40" fill="#000" />
                            <rect x="64" y="5" width="2" height="40" fill="#000" />
                            <rect x="72" y="5" width="5" height="40" fill="#000" />
                            <rect x="82" y="5" width="3" height="40" fill="#000" />
                            <rect x="90" y="5" width="4" height="40" fill="#000" />
                            <rect x="100" y="5" width="2" height="40" fill="#000" />
                            <rect x="108" y="5" width="5" height="40" fill="#000" />
                            <rect x="118" y="5" width="3" height="40" fill="#000" />
                            <rect x="126" y="5" width="4" height="40" fill="#000" />
                            <rect x="136" y="5" width="2" height="40" fill="#000" />
                            <rect x="144" y="5" width="5" height="40" fill="#000" />
                            <rect x="154" y="5" width="3" height="40" fill="#000" />
                            <rect x="162" y="5" width="4" height="40" fill="#000" />
                            <rect x="172" y="5" width="2" height="40" fill="#000" />
                            <rect x="180" y="5" width="5" height="40" fill="#000" />
                            <rect x="190" y="5" width="3" height="40" fill="#000" />
                            <rect x="198" y="5" width="4" height="40" fill="#000" />
                            <rect x="208" y="5" width="2" height="40" fill="#000" />
                            <rect x="216" y="5" width="5" height="40" fill="#000" />
                          </svg>
                          <span className="font-mono text-sm font-bold tracking-widest">{sn}</span>
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ready for System Default Printer (`window.print()`)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsTagPrintingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print {copies} {copies === 1 ? 'Tag' : 'Tags'} Now</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Webcam photo capture modal */}
      {isWebcamOpen && (
        <WebcamCaptureModal
          isOpen={isWebcamOpen}
          onClose={() => setIsWebcamOpen(false)}
          onCapture={(dataUrl) => {
            setTagImage(dataUrl);
            setIsWebcamOpen(false);
          }}
          title="Snap Tag Product Photo"
        />
      )}
    </>
  );
};
