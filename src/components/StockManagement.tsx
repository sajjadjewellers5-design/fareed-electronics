import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Edit2,
  Trash2,
  ArrowUpDown,
  CheckCircle2,
  X,
  PackagePlus,
  MapPin,
  FileSpreadsheet,
  Camera,
  DollarSign,
  Tag,
  Sliders,
} from 'lucide-react';
import { ProductItem, StockMovement } from '../types';
import { useApp } from '../context/AppContext';

interface StockManagementProps {
  onAddStockModalOpen?: () => void;
}

export const StockManagement: React.FC<StockManagementProps> = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    formatCurrency,
    setActiveTab,
    setIsNewProductModalOpen,
    setPreviewImage,
    setIsStockAdjustmentModalOpen,
    setIsTagPrintingModalOpen,
    setSelectedProductForTag,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'IN_STOCK' | 'OUT'>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<ProductItem | null>(null);

  // New product form state
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Displays & Panels',
    costPrice: '',
    salePrice: '',
    stockQuantity: '',
    minStockLevel: '5',
    unit: 'pcs',
    location: 'Lab Rack A-1',
    notes: '',
    image: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormData((prev) => ({
            ...prev,
            image: uploadEvent.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setEditingProduct({
            ...editingProduct,
            image: uploadEvent.target?.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Adjustment form state
  const [adjustmentQty, setAdjustmentQty] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<StockMovement['type']>('ADJUSTMENT');
  const [adjustmentNote, setAdjustmentNote] = useState('');

  // Categories list
  const categories = [
    'ALL',
    'Displays & Panels',
    'Batteries & Power',
    'Microchips & ICs',
    'Lab Equipment',
    'Lab Consumables',
    'Accessories & Power',
  ];

  // Filtering
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.location && prod.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || prod.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'LOW') {
      matchesStock = prod.stockQuantity <= prod.minStockLevel && prod.stockQuantity > 0;
    } else if (stockFilter === 'OUT') {
      matchesStock = prod.stockQuantity <= 0;
    } else if (stockFilter === 'IN_STOCK') {
      matchesStock = prod.stockQuantity > prod.minStockLevel;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Handle Create Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    addProduct({
      sku: formData.sku.toUpperCase(),
      name: formData.name,
      category: formData.category,
      costPrice: parseFloat(formData.costPrice) || 0,
      salePrice: parseFloat(formData.salePrice) || 0,
      stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
      minStockLevel: parseInt(formData.minStockLevel, 10) || 5,
      unit: formData.unit || 'pcs',
      location: formData.location || 'Lab Tray',
      notes: formData.notes,
      image: formData.image || undefined,
    });

    setIsAddModalOpen(false);
    setFormData({
      sku: '',
      name: '',
      category: 'Displays & Panels',
      costPrice: '',
      salePrice: '',
      stockQuantity: '',
      minStockLevel: '5',
      unit: 'pcs',
      location: 'Lab Rack A-1',
      notes: '',
      image: '',
    });
  };

  // Handle Edit Save
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      sku: editingProduct.sku.toUpperCase(),
      name: editingProduct.name,
      category: editingProduct.category,
      costPrice: editingProduct.costPrice,
      salePrice: editingProduct.salePrice,
      minStockLevel: editingProduct.minStockLevel,
      unit: editingProduct.unit,
      location: editingProduct.location,
      notes: editingProduct.notes,
      image: editingProduct.image,
    });

    setEditingProduct(null);
  };

  // Handle Stock Adjustment
  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    const newQty = parseInt(adjustmentQty, 10);
    if (isNaN(newQty)) return;

    adjustStock(adjustingProduct.id, newQty, adjustmentType, adjustmentNote);
    setAdjustingProduct(null);
    setAdjustmentQty('');
    setAdjustmentNote('');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-cyan-400" />
            <span>Stock &amp; Inventory Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage electronic components, displays, IC microchips, lab equipment, and consumables.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('price-list')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-purple-950/70 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
            title="Open Price List & +/- Category Adjustments"
          >
            <DollarSign className="w-3.5 h-3.5 text-purple-400" />
            <span>Price List &amp; +/- Adjust</span>
          </button>

          <button
            onClick={() => setIsStockAdjustmentModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 shadow transition-all cursor-pointer"
            title="Create Stock Adjustment Voucher (اسٹاک ایڈجسٹمنٹ واؤچر)"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Stock Adjustment (ایڈجسٹمنٹ واؤچر)</span>
          </button>

          <button
            onClick={() => {
              setSelectedProductForTag(null);
              setIsTagPrintingModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 shadow transition-all cursor-pointer"
            title="All-Size Tag Printing System (ٹیگ پرنٹ کریں)"
          >
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print Tags (ٹیگ پرنٹ)</span>
          </button>

          <button
            onClick={() => setActiveTab('stock-reports')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span>Stock Reports</span>
          </button>

          {/* New Stock Entry F6 button */}
          <button
            onClick={() => setIsNewProductModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            title="F6: New Stock Entry (نیا اسٹاک اندراج)"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Stock</span>
            <kbd className="px-1.5 py-0.2 rounded bg-slate-950 text-cyan-300 font-mono text-[9px] font-bold">
              F6
            </kbd>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by part name, SKU code (e.g. FE-DISP), or lab shelf..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {/* Quick status tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setStockFilter('ALL')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                stockFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter('LOW')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                stockFilter === 'LOW'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              Low Stock
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-3 text-center">Pic (تصویر)</th>
                <th className="py-3 px-4">Item &amp; SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-right">Cost Price</th>
                <th className="py-3 px-3 text-right">Sale Price</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No components found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isLow = product.stockQuantity <= product.minStockLevel && product.stockQuantity > 0;
                  const isOut = product.stockQuantity <= 0;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-2 px-3 text-center">
                        {product.image ? (
                          <button
                            onClick={() => setPreviewImage(product.image || null)}
                            className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden hover:border-cyan-400 transition-all inline-flex items-center justify-center cursor-pointer shadow-sm group/img"
                            title="Click to zoom item picture"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                            />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="w-8 h-8 rounded-xl border border-dashed border-slate-700/80 bg-slate-950/40 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors inline-flex items-center justify-center cursor-pointer"
                            title="Attach picture to component"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-xs leading-snug">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="font-mono text-cyan-400 font-semibold">{product.sku}</span>
                          {product.notes && (
                            <>
                              <span>·</span>
                              <span className="text-slate-500 truncate max-w-xs">{product.notes}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300 font-medium">
                        {product.category}
                      </td>

                      <td className="py-3 px-3 text-slate-400">
                        <span className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{product.location || 'Lab Shelf'}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {formatCurrency(product.costPrice)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        {formatCurrency(product.salePrice)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono border ${
                              isOut
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                : isLow
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {product.stockQuantity} {product.unit}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">
                            Min: {product.minStockLevel}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setAdjustingProduct(product);
                              setAdjustmentQty(String(product.stockQuantity));
                            }}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Quick Adjust Stock"
                          >
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedProductForTag(product);
                              setIsTagPrintingModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title={`Print Price Tags for ${product.name}`}
                          >
                            <Tag className="w-3.5 h-3.5 text-indigo-400" />
                          </button>

                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Item Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <PackagePlus className="w-5 h-5 text-cyan-400" />
                <span>Register New Component / Stock Item</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">SKU / Item Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="FE-PART-001"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {categories
                      .filter((c) => c !== 'ALL')
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Product / Component Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. iPhone 15 Pro OLED Display (OEM Grade)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Cost Price (Buy)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="42000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Sale Price (Retail)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="56000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Initial Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    placeholder="10"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Min Alert Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                    placeholder="5"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Lab / Store Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Rack A-01, Safe Drawer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Measuring Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="units">Units</option>
                    <option value="boxes">Boxes</option>
                    <option value="reels">Reels / Rolls</option>
                    <option value="meters">Meters</option>
                    <option value="sets">Sets</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Technical Specifications / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Compatible with IC reprogramming, 120Hz refresh support..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Product Picture Upload (تصویر سامان) */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Item Picture / Photo Option (تصویر سامان)
                </label>
                <div className="flex items-center gap-3">
                  {formData.image ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-cyan-500/50 bg-slate-950 shrink-0">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 flex items-center justify-center text-slate-500 shrink-0">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                    />
                    <div className="text-[11px] text-slate-500 mt-1">
                      Upload photo, lab component sticker, barcode or package picture.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Edit2 className="w-5 h-5 text-blue-400" />
                <span>Edit Product Details</span>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {categories
                      .filter((c) => c !== 'ALL')
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Cost Price</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={editingProduct.costPrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        costPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Sale Price</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={editingProduct.salePrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        salePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Min Alert Level</label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.minStockLevel}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        minStockLevel: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Lab Location</label>
                  <input
                    type="text"
                    value={editingProduct.location}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, location: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Measuring Unit</label>
                  <input
                    type="text"
                    value={editingProduct.unit}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editingProduct.notes || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Product Picture Upload in Edit Modal */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Item Picture / Photo Option (تصویر سامان)
                </label>
                <div className="flex items-center gap-3">
                  {editingProduct.image ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-blue-500/50 bg-slate-950 shrink-0">
                      <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({ ...editingProduct, image: undefined })
                        }
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 flex items-center justify-center text-slate-500 shrink-0">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30 cursor-pointer"
                    />
                    <div className="text-[11px] text-slate-500 mt-1">
                      Change or replace product photo, package snapshot, or part schematic.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Adjust Stock Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ArrowUpDown className="w-5 h-5 text-cyan-400" />
                <span>Adjust Stock Quantity</span>
              </div>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="font-bold text-white text-xs">{adjustingProduct.name}</div>
              <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                Current Stock: {adjustingProduct.stockQuantity} {adjustingProduct.unit}
              </div>
            </div>

            <form onSubmit={handleStockAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">New Total Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-base font-bold focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Adjustment Reason / Type</label>
                <select
                  value={adjustmentType}
                  onChange={(e) =>
                    setAdjustmentType(e.target.value as StockMovement['type'])
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="ADJUSTMENT">Inventory Physical Count Audit</option>
                  <option value="LAB_USAGE">Lab Testing / Internal Rework Usage</option>
                  <option value="DAMAGE">Damaged / Defective Stock Spoilage</option>
                  <option value="IN">Direct Stock Received</option>
                  <option value="OUT">Direct Stock Out</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Adjustment Notes / Memo</label>
                <input
                  type="text"
                  value={adjustmentNote}
                  onChange={(e) => setAdjustmentNote(e.target.value)}
                  placeholder="e.g. Discovered 2 missing units during physical inventory audit"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md cursor-pointer"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
