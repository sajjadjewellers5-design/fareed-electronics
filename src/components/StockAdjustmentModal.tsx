import React, { useState } from 'react';
import {
  X,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Printer,
  Boxes,
  FileSpreadsheet,
  Calendar,
  UserCheck,
  FileText,
  Search,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductItem, StockAdjustmentVoucher } from '../types';
import { FareedElectronicsBadge } from './BrandLogo';

export const StockAdjustmentModal: React.FC = () => {
  const {
    isStockAdjustmentModalOpen,
    setIsStockAdjustmentModalOpen,
    products,
    stockAdjustmentVouchers,
    createStockAdjustmentVoucher,
    deleteStockAdjustmentVoucher,
    formatCurrency,
    currentUser,
    getNextAdjustmentNumber,
    setSelectedStockAdjustmentForPrint,
    setIsPrintPreviewOpen,
    openPrintPreview,
  } = useApp();

  const [activeView, setActiveView] = useState<'NEW' | 'LIST'>('NEW');

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [adjustmentType, setAdjustmentType] = useState<'ADDITION' | 'DEDUCTION'>('DEDUCTION');
  const [quantityPcs, setQuantityPcs] = useState<number>(1);
  const [reasonCategory, setReasonCategory] = useState<StockAdjustmentVoucher['reasonCategory']>('DAMAGED_BROKEN');
  const [notes, setNotes] = useState<string>('');
  const [adjustmentDate, setAdjustmentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected Product details
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Live stock calculation
  const currentStock = selectedProduct ? selectedProduct.stockQuantity : 0;
  const newProjectedStock =
    adjustmentType === 'ADDITION'
      ? currentStock + (Number(quantityPcs) || 0)
      : Math.max(0, currentStock - (Number(quantityPcs) || 0));

  const totalValueImpact = selectedProduct
    ? (Number(quantityPcs) || 0) * (selectedProduct.costPrice || 0)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedProduct) {
      setErrorMsg('Please select a valid product to adjust stock.');
      return;
    }

    if (quantityPcs <= 0) {
      setErrorMsg('Adjustment quantity must be at least 1 piece.');
      return;
    }

    if (adjustmentType === 'DEDUCTION' && quantityPcs > currentStock) {
      if (
        !window.confirm(
          `Adjustment quantity (${quantityPcs} pcs) is greater than current stock (${currentStock} pcs). Proceed with deducting? Stock will become 0.`
        )
      ) {
        return;
      }
    }

    try {
      const voucher = createStockAdjustmentVoucher({
        date: adjustmentDate,
        type: adjustmentType,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        sku: selectedProduct.sku,
        tagNo: selectedProduct.tagNo,
        quantity: quantityPcs,
        costPrice: selectedProduct.costPrice,
        totalValue: totalValueImpact,
        reasonCategory,
        notes: notes.trim() || (adjustmentType === 'ADDITION' ? 'Physical stock intake/found' : 'Damage/loss write-off'),
        authorizedBy: currentUser?.fullName || currentUser?.username || 'Administrator',
      });

      setSuccessMsg(
        `Voucher ${voucher.voucherNumber} created! Stock updated from ${currentStock} to ${newProjectedStock} Pcs (اسٹاک ایڈجسٹمنٹ واؤچر کامیابی سے محفوظ ہو گیا).`
      );

      // Offer immediate print preview
      setTimeout(() => {
        openPrintPreview('STOCK_ADJUSTMENT', voucher);
      }, 300);

      // Reset form
      setQuantityPcs(1);
      setNotes('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save stock adjustment voucher.');
    }
  };

  if (!isStockAdjustmentModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Stock Adjustment Voucher (SAV)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 font-mono">
                  اسٹاک ایڈجسٹمنٹ واؤچر
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official voucher for physical count discrepancies, breakage, damages, surplus intake &amp; write-offs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveView('NEW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'NEW'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                + New Voucher
              </button>
              <button
                type="button"
                onClick={() => setActiveView('LIST')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'LIST'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                History ({stockAdjustmentVouchers.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsStockAdjustmentModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeView === 'NEW' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Type Toggle: ADDITION vs DEDUCTION */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAdjustmentType('ADDITION')}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    adjustmentType === 'ADDITION'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm text-emerald-300">ADDITION (+)</div>
                      <div className="text-[11px] text-slate-400">Surplus Found / Recovery / Audit Excess</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    اسٹاک میں اضافہ
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustmentType('DEDUCTION')}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    adjustmentType === 'DEDUCTION'
                      ? 'bg-rose-950/80 border-rose-500 text-white shadow-lg shadow-rose-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                      <Minus className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm text-rose-300">DEDUCTION (-)</div>
                      <div className="text-[11px] text-slate-400">Damaged Goods / Expired / Breakage / Shortage</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/30">
                    اسٹاک میں کمی
                  </span>
                </button>
              </div>

              {/* Product Selection & Live Stock Badge */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-cyan-400" />
                    <span>Select Product for Stock Adjustment</span>
                  </label>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/30">
                    Voucher: {getNextAdjustmentNumber()}
                  </span>
                </div>

                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-amber-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose Product From Inventory --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku || 'No SKU'}) - Current Stock: {p.stockQuantity} Pcs [Cost: {formatCurrency(p.costPrice)}]
                    </option>
                  ))}
                </select>

                {selectedProduct && (
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Current Stock:</span>
                      <span className="font-bold text-cyan-400 text-sm">{currentStock} Pieces (عدد)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Cost Price:</span>
                      <span className="font-bold text-slate-200">{formatCurrency(selectedProduct.costPrice)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Tag / Barcode:</span>
                      <span className="font-mono text-indigo-300">{selectedProduct.tagNo || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Projected New Stock:</span>
                      <span
                        className={`font-bold text-sm ${
                          adjustmentType === 'ADDITION' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {newProjectedStock} Pieces
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity, Reason & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    Adjustment Quantity (Pieces / عدد) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantityPcs}
                    onChange={(e) => setQuantityPcs(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Financial Impact: {formatCurrency(totalValueImpact)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    Reason / Category (وجہ) *
                  </label>
                  <select
                    value={reasonCategory}
                    onChange={(e) => setReasonCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="DAMAGED_BROKEN">Damaged / Broken Goods (خراب یا ٹوٹا ہوا مال)</option>
                    <option value="AUDIT_DIFFERENCE">Physical Audit Discrepancy (آڈٹ میں فرق)</option>
                    <option value="EXPIRED_OBSOLETE">Expired / Obsolete Stock (ناکارہ / ایکسپائرڈ)</option>
                    <option value="SURPLUS_FOUND">Surplus Found / Inventory Recovery (اضافی مال)</option>
                    <option value="TESTING_SAMPLE">Testing / Lab Sample (ٹیسٹنگ یا سیمپل)</option>
                    <option value="OTHER">Other Adjustment (دیگر وجوہات)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    Voucher Date (تاریخ)
                  </label>
                  <input
                    type="date"
                    value={adjustmentDate}
                    onChange={(e) => setAdjustmentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Remarks &amp; Audit Notes (تفصیل و نوٹ)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Found 2 pieces damaged during shelf reorganization..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsStockAdjustmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save &amp; Print Stock Adjustment Voucher</span>
                </button>
              </div>

            </form>
          ) : (
            /* LIST VIEW: Past Stock Adjustment Vouchers */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Adjustment Records: {stockAdjustmentVouchers.length}</span>
              </div>

              {stockAdjustmentVouchers.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Sliders className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p>No stock adjustment vouchers created yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stockAdjustmentVouchers.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg font-bold text-xs ${
                            v.type === 'ADDITION'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {v.type === 'ADDITION' ? '+ ADD' : '- DEDUCT'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-bold text-sm text-white">
                            <span>{v.voucherNumber}</span>
                            <span className="text-xs text-slate-400 font-normal font-mono">
                              ({v.date})
                            </span>
                          </div>
                          <div className="text-xs text-slate-300">
                            {v.productName} - <span className="font-bold text-amber-300">{v.quantity} Pcs</span> ({v.reasonCategory})
                          </div>
                          {v.notes && <div className="text-[11px] text-slate-400 italic">{v.notes}</div>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-300 mr-2">
                          {formatCurrency(v.totalValue)}
                        </span>
                        <button
                          type="button"
                          onClick={() => openPrintPreview('STOCK_ADJUSTMENT', v)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Slip</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete voucher ${v.voucherNumber}? Note: This will not revert stock.`)) {
                              deleteStockAdjustmentVoucher(v.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
