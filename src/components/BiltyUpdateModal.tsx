import React, { useState, useEffect } from 'react';
import {
  Truck,
  X,
  CheckCircle2,
  Search,
  Receipt,
  MapPin,
  Calendar,
  Layers,
  DollarSign,
  Camera,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BiltyUpdateModal: React.FC = () => {
  const {
    isBiltyUpdateModalOpen,
    setIsBiltyUpdateModalOpen,
    selectedInvoiceForBilty,
    setSelectedInvoiceForBilty,
    invoices,
    updateInvoiceBilty,
    formatCurrency,
  } = useApp();

  const [activeInvoiceId, setActiveInvoiceId] = useState('');
  const [biltyNumber, setBiltyNumber] = useState('');
  const [transportName, setTransportName] = useState('Daewoo Cargo Express');
  const [destinationStation, setDestinationStation] = useState('Lahore Station');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [cartonCount, setCartonCount] = useState<number>(1);
  const [freightType, setFreightType] = useState<'PAID' | 'TO_PAY'>('TO_PAY');
  const [freightAmount, setFreightAmount] = useState<number>(0);
  const [biltyDate, setBiltyDate] = useState(new Date().toISOString().split('T')[0]);
  const [biltyStatus, setBiltyStatus] = useState<'PENDING' | 'BOOKED' | 'DISPATCHED' | 'DELIVERED'>('DISPATCHED');
  const [biltyImage, setBiltyImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync selected invoice if passed in
  useEffect(() => {
    if (selectedInvoiceForBilty) {
      setActiveInvoiceId(selectedInvoiceForBilty.id);
      setBiltyNumber(selectedInvoiceForBilty.biltyNumber || '');
      setTransportName(selectedInvoiceForBilty.transportName || 'Daewoo Cargo Express');
      setDestinationStation(selectedInvoiceForBilty.destinationStation || 'Lahore Station');
      setVehicleNumber(selectedInvoiceForBilty.vehicleNumber || '');
      setCartonCount(selectedInvoiceForBilty.cartonCount || 1);
      setFreightType(selectedInvoiceForBilty.freightType || 'TO_PAY');
      setFreightAmount(selectedInvoiceForBilty.freightAmount || 0);
      setBiltyDate(selectedInvoiceForBilty.biltyDate || new Date().toISOString().split('T')[0]);
      setBiltyStatus(selectedInvoiceForBilty.biltyStatus || 'DISPATCHED');
    } else if (invoices.length > 0 && !activeInvoiceId) {
      const first = invoices[0];
      setActiveInvoiceId(first.id);
      setBiltyNumber(first.biltyNumber || '');
      setTransportName(first.transportName || 'Daewoo Cargo Express');
      setDestinationStation(first.destinationStation || 'Lahore Station');
      setBiltyStatus(first.biltyStatus || 'DISPATCHED');
    }
  }, [selectedInvoiceForBilty, invoices]);

  if (!isBiltyUpdateModalOpen) return null;

  const handleSelectInvoice = (id: string) => {
    setActiveInvoiceId(id);
    const inv = invoices.find((i) => i.id === id);
    if (inv) {
      setBiltyNumber(inv.biltyNumber || '');
      setTransportName(inv.transportName || 'Daewoo Cargo Express');
      setDestinationStation(inv.destinationStation || 'Lahore Station');
      setVehicleNumber(inv.vehicleNumber || '');
      setCartonCount(inv.cartonCount || 1);
      setFreightType(inv.freightType || 'TO_PAY');
      setFreightAmount(inv.freightAmount || 0);
      setBiltyDate(inv.biltyDate || new Date().toISOString().split('T')[0]);
      setBiltyStatus(inv.biltyStatus || 'DISPATCHED');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoiceId) {
      alert('Please select an invoice to update bilty details.');
      return;
    }

    updateInvoiceBilty(activeInvoiceId, {
      biltyNumber: biltyNumber.trim(),
      transportName: transportName.trim(),
      destinationStation: destinationStation.trim(),
      vehicleNumber: vehicleNumber.trim() || undefined,
      cartonCount: Number(cartonCount) || 1,
      freightType,
      freightAmount: Number(freightAmount) || 0,
      biltyDate,
      biltyStatus,
    });

    setIsBiltyUpdateModalOpen(false);
    setSelectedInvoiceForBilty(null);
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.biltyNumber && inv.biltyNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#072836] border border-[#0d556e]/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#051f2b] via-[#093c4e] to-[#0d526a] border-b border-[#0f5f7a]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide">
                Bilty &amp; Cargo Dispatch Tracking (بلٹی اپڈیٹ و کارگو)
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                بلٹی نمبر، ٹرانسپورٹ کمپنی اور کارگو روانگی کی معلومات درج کریں
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsBiltyUpdateModalOpen(false);
              setSelectedInvoiceForBilty(null);
            }}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Invoice Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Select Customer Invoice * (انوائس منتخب کریں)</span>
              <span className="text-[11px] text-slate-400">{invoices.length} invoices available</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search invoice or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <select
                value={activeInvoiceId}
                onChange={(e) => handleSelectInvoice(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-medium"
              >
                {filteredInvoices.slice(0, 25).map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} — {inv.customerName} ({formatCurrency(inv.grandTotal)})
                    {inv.biltyNumber ? ` [Bilty: ${inv.biltyNumber}]` : ' [No Bilty]'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bilty Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-900/60 p-4 rounded-2xl border border-cyan-500/20">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bilty Number * (بلٹی نمبر)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BL-99201, DAEWOO-410"
                value={biltyNumber}
                onChange={(e) => setBiltyNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Transport / Cargo Name (ٹرانسپورٹ کمپنی) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Daewoo Express, Faisal Movers, M&P"
                value={transportName}
                onChange={(e) => setTransportName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Destination Station / City (منزل اسٹیشن / شہر) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Faisalabad Cargo Terminal, Multan, Karachi"
                value={destinationStation}
                onChange={(e) => setDestinationStation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vehicle / Booking Reference No.
              </label>
              <input
                type="text"
                placeholder="e.g. LHR-9081 / Cargo Bus 14"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cartons / Boxes Count (تعداد بنڈل / کارٹن)
              </label>
              <input
                type="number"
                min="1"
                value={cartonCount}
                onChange={(e) => setCartonCount(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Freight Payment Type (کرایہ ادائیگی)
              </label>
              <select
                value={freightType}
                onChange={(e) => setFreightType(e.target.value as 'PAID' | 'TO_PAY')}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="TO_PAY">To Pay / باقاعدہ پارٹی ادا کرے گی (وصول پر)</option>
                <option value="PAID">Paid / ادا شدہ (دکان سے ادا کیا گیا)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Freight Charges (کرایہ بلٹی - Rs.)
              </label>
              <input
                type="number"
                min="0"
                value={freightAmount}
                onChange={(e) => setFreightAmount(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dispatch Status (اسٹیٹس)
              </label>
              <select
                value={biltyStatus}
                onChange={(e) =>
                  setBiltyStatus(e.target.value as typeof biltyStatus)
                }
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-semibold"
              >
                <option value="BOOKED">Booked (بکنگ ہو گئی)</option>
                <option value="DISPATCHED">Dispatched (روانہ کر دیا گیا)</option>
                <option value="DELIVERED">Delivered (پہنچ گیا)</option>
                <option value="PENDING">Pending (زیر التواء)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Booking / Dispatch Date (تاریخ روانگی)
              </label>
              <input
                type="date"
                required
                value={biltyDate}
                onChange={(e) => setBiltyDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Bilty Receipt Picture / WebCam Attachment */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bilty / Cargo Receipt Document</span>
              </label>

              <div className="p-3 bg-slate-950 border border-dashed border-slate-700 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <label className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Upload Bilty Receipt Image / File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) setBiltyImage(ev.target.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {biltyImage && (
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <img src={biltyImage} alt="Bilty" className="w-8 h-8 rounded object-cover border border-cyan-500" />
                      <span>Bilty receipt photo attached ✓</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBiltyImage('')}
                      className="text-rose-400 hover:text-rose-300 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setIsBiltyUpdateModalOpen(false);
                setSelectedInvoiceForBilty(null);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel (Esc)
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save &amp; Update Bilty (بلٹی محفوظ کریں)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
