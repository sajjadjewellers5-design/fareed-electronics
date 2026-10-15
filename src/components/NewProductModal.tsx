import React, { useState } from 'react';
import {
  Boxes,
  X,
  Camera,
  CheckCircle2,
  PackagePlus,
  Layers,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NewProductModal: React.FC = () => {
  const {
    isNewProductModalOpen,
    setIsNewProductModalOpen,
    addProduct,
    formatCurrency,
    products,
    getNextTagSerialNumber,
  } = useApp();

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [tagNo, setTagNo] = useState('');
  const [category, setCategory] = useState('Displays & Panels');
  const [costPrice, setCostPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [minStockLevel, setMinStockLevel] = useState('5');
  const [unit, setUnit] = useState('pcs');
  const [location, setLocation] = useState('Safe Cabinet A-1');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState('');

  if (!isNewProductModalOpen) return null;

  const categories = [
    'Displays & Panels',
    'Batteries & Power',
    'ICs & Micro-Controllers',
    'Charging Ports & Flexes',
    'Cameras & Sensors',
    'Housings & Frames',
    'Lab Diagnostic Tools',
    'Accessories & Cables',
    'Soldering & Consumables',
  ];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !costPrice || !salePrice) {
      alert('Please fill in product name, cost price, and sale price.');
      return;
    }

    const genSku =
      sku.trim() ||
      `FE-${category.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addProduct({
      sku: genSku,
      name: name.trim(),
      category,
      costPrice: Number(costPrice) || 0,
      salePrice: Number(salePrice) || 0,
      stockQuantity: Number(stockQuantity) || 0,
      minStockLevel: Number(minStockLevel) || 5,
      unit: unit || 'pcs',
      location: location || 'Main Storage Rack',
      tagNo: tagNo.trim() || undefined,
      notes: notes || undefined,
      image: image || undefined,
    });

    // Reset form
    setSku('');
    setName('');
    setTagNo('');
    setCostPrice('');
    setSalePrice('');
    setStockQuantity('10');
    setMinStockLevel('5');
    setNotes('');
    setImage('');
    setIsNewProductModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#072836] border border-[#0d556e]/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#051f2b] via-[#093c4e] to-[#0d526a] border-b border-[#0f5f7a]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-wide">
                  New Stock Entry (نیا سامان و پرزہ جات)
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  F6
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                نئے پرزے، ڈسپلے یا لیب آئٹم کا اندراج بمعہ تصویر و قیمت
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewProductModalOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Check if product with same name already exists */}
          {(() => {
            const existingProduct = products.find(
              (p) => name.trim() && p.name.trim().toLowerCase() === name.trim().toLowerCase()
            );
            if (!existingProduct) return null;
            const newTotal = (existingProduct.stockQuantity || 0) + (Number(stockQuantity) || 0);
            return (
              <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Same Product Already in Stock: {existingProduct.name}</span>
                  </div>
                  <div className="text-[11px] text-emerald-300/90">
                    Current: <strong>{existingProduct.stockQuantity} Pcs</strong> &rarr; Adding {Number(stockQuantity) || 0} Pcs will save new total: <strong className="text-white underline">{newTotal} Pieces (عدد)</strong>!
                  </div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-900 border border-emerald-500/40 text-emerald-200 font-mono font-bold">
                  Auto-Merge Stock
                </span>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Product / Component Name * (نام پروڈکٹ / پرزہ)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Samsung 43 Inch Smart 4K UHD LED"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category (کیٹیگری) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Tag No (ٹیگ نمبر)</span>
                <button
                  type="button"
                  onClick={() => setTagNo(getNextTagSerialNumber())}
                  className="text-[10px] text-cyan-400 hover:underline"
                >
                  Generate Next
                </button>
              </label>
              <input
                type="text"
                placeholder="e.g. TAG-2026-00001"
                value={tagNo}
                onChange={(e) => setTagNo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-indigo-300 focus:outline-none focus:border-indigo-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                SKU / Barcode (اختیاری کوڈ)
              </label>
              <input
                type="text"
                placeholder="Auto-generated if empty"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cost Price (خرید قیمت - Rs.) *
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="e.g. 42000"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sale Price (فروخت قیمت - Rs.) *
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="e.g. 56000"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cyan-300 mb-1">
                Stock Qty in Pieces (تعداد عدد / Pieces) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Min Stock Warning Level
              </label>
              <input
                type="number"
                min="0"
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unit of Measure
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="pcs">Pieces (pcs)</option>
                <option value="box">Box / Pack</option>
                <option value="set">Set / Pair</option>
                <option value="roll">Roll / Reel</option>
                <option value="kg">Kilogram (kg)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Storage Location / Rack
              </label>
              <input
                type="text"
                placeholder="e.g. Lab Safe Rack B-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Product Picture Option */}
            <div className="sm:col-span-2 bg-slate-900/60 p-3.5 rounded-2xl border border-cyan-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Item Picture / Photo Option (تصویر سامان)</span>
                </span>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage('')}
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
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-xl border border-cyan-400 shrink-0"
                  />
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Technical Notes / Compatibility
              </label>
              <input
                type="text"
                placeholder="e.g. Compatible with A17 Pro logic board; tested EEPROM"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setIsNewProductModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel (Esc)
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Product (نیا سامان شامل کریں)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
