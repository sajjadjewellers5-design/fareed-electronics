import React, { useState } from 'react';
import {
  Settings,
  Building,
  Upload,
  Download,
  RotateCcw,
  CheckCircle2,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Shield,
  Save,
  Trash2,
  Languages,
  Sparkles,
  Printer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const SettingsModule: React.FC = () => {
  const {
    companyProfile,
    updateCompanyProfile,
    exportDataJson,
    importDataJson,
    resetToDefaultData,
    setActiveTab,
    language,
    setLanguage,
    urduFontTheme,
    setUrduFontTheme,
    setIsClearDemoDataModalOpen,
    systemPrinterSettings,
    updateSystemPrinterSettings,
    triggerSystemPrint,
    t,
  } = useApp();

  const [formData, setFormData] = useState({ ...companyProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');

  // Handle Logo Upload (user's own picture)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const base64 = uploadEvent.target.result as string;
          setFormData((prev) => ({ ...prev, logoUrl: base64 }));
          updateCompanyProfile({ logoUrl: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearCustomLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: undefined }));
    updateCompanyProfile({ logoUrl: undefined });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fareed_electronics_erp_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJson(content);
        if (success) {
          setImportStatus('Backup data restored successfully!');
          setTimeout(() => setImportStatus(''), 4000);
        } else {
          setImportStatus('Error: Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Store Settings &amp; Brand Customization</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure company identity, custom pictures, currency, invoice terms, and data backup.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manage Users &amp; Passwords</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Full Backup Hub</span>
          </button>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings Saved!</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Business Information Form */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>Store &amp; Tech Lab Profile</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Store &amp; Lab Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Tagline / Mission</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Tax / NTN Registration</label>
                <input
                  type="text"
                  value={formData.ntn}
                  onChange={(e) => setFormData({ ...formData, ntn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Shop &amp; Lab Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Currency Symbol</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none font-bold"
                >
                  <option value="₨">₨ (PKR - Pakistani Rupee)</option>
                  <option value="$">$ (USD - US Dollar)</option>
                  <option value="€">€ (EUR - Euro)</option>
                  <option value="£">£ (GBP - British Pound)</option>
                  <option value="AED">AED (UAE Dirham)</option>
                  <option value="SAR">SAR (Saudi Riyal)</option>
                  <option value="₹">₹ (INR - Indian Rupee)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Invoice Terms &amp; Warranty Conditions
              </label>
              <textarea
                rows={4}
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none font-mono text-[11px] leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Custom Logo Picture & Backup/Restore */}
        <div className="space-y-6">
          {/* Logo & Picture Customization */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide border-b border-slate-800 pb-2.5">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Brand Logo &amp; Picture</span>
            </div>

            {/* Current Active Preview */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-500 mb-2">Live Logo Display</span>
              <BrandLogo
                customLogoUrl={formData.logoUrl}
                size="lg"
                showSubtitle={true}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-400 font-medium">
                Upload Custom Logo / Store Picture ("Own Pic")
              </label>
              <div className="p-3 bg-slate-950 border border-dashed border-slate-700 rounded-xl text-center">
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="text-slate-300 font-semibold text-xs">Choose Image File</span>
                  <span className="text-[10px] text-slate-500">PNG, JPG, or SVG</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={handleClearCustomLogo}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revert to Default Fareed Electronics Logo</span>
                </button>
              )}
            </div>
          </div>

          {/* Language & Jameel Noori Typography */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide border-b border-slate-800 pb-2.5">
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>Language &amp; Urdu Calligraphy (زبان اور خطاطی)</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1.5 font-semibold">
                  System Language / نظام کی زبان:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('ur')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      language === 'ur'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/10'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    🇵🇰 اردو (Urdu)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/10'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1.5 font-semibold">
                  Urdu Typography Theme / خط کا انداز:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrduFontTheme('jameel-noori')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      urduFontTheme === 'jameel-noori'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    جمیل نوری نستعلیق
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrduFontTheme('standard')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      urduFontTheme === 'standard'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    عام جدید فونٹ
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">پیش نظارہ (Preview): </span>
                <span className={urduFontTheme === 'jameel-noori' ? 'font-jameel text-amber-300 text-sm' : 'text-slate-200'}>
                  فرید الیکٹرانکس &mdash; آفیشل ٹیک اسٹور اور لیب اکاؤنٹنگ سسٹم
                </span>
              </div>
            </div>
          </div>

          {/* System Default Printer & POS Hardware Link */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide">
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>System Default Printer Link (پرنٹر لنک)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                Connected (Active)
              </span>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Link the software directly with your computer's default system printer (Windows, Mac, or thermal POS printer) for instant 1-click printing without manual preview pauses.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Printer Hardware Profile (پرنٹر کی قسم):
                </label>
                <select
                  value={systemPrinterSettings.printerType}
                  onChange={(e) =>
                    updateSystemPrinterSettings({
                      printerType: e.target.value as typeof systemPrinterSettings.printerType,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:border-cyan-500 focus:outline-none"
                >
                  <option value="system_default">System Default Printer (سسٹم ڈیفالٹ پرنٹر)</option>
                  <option value="thermal_80mm">Thermal Slip POS (80mm / 3-inch Roll)</option>
                  <option value="thermal_58mm">Thermal Slip Mini (58mm / 2-inch Roll)</option>
                  <option value="tag_barcode_roll">Barcode Label / Tag Printer (Xprinter / Zebra / Rongta)</option>
                  <option value="laser_a4">Laser / Inkjet A4 / A5 Document Printer</option>
                </select>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-800">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={systemPrinterSettings.autoPrintOnInvoiceSave}
                    onChange={(e) =>
                      updateSystemPrinterSettings({ autoPrintOnInvoiceSave: e.target.checked })
                    }
                    className="rounded text-cyan-500 w-4 h-4"
                  />
                  <span>Auto-Send to Default Printer upon Saving Invoice</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={systemPrinterSettings.autoPrintOnVoucherSave}
                    onChange={(e) =>
                      updateSystemPrinterSettings({ autoPrintOnVoucherSave: e.target.checked })
                    }
                    className="rounded text-cyan-500 w-4 h-4"
                  />
                  <span>Auto-Send to Default Printer upon Saving Voucher</span>
                </label>
              </div>

              <button
                type="button"
                onClick={triggerSystemPrint}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold cursor-pointer shadow-md shadow-cyan-600/20"
              >
                <Printer className="w-4 h-4" />
                <span>Test Print via System Default Printer</span>
              </button>
            </div>
          </div>

          {/* Backup & Restore Data */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide border-b border-slate-800 pb-2.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Data Backup &amp; Portability</span>
            </div>

            <p className="text-slate-400 text-[11px]">
              All stock inventory, invoices, purchase bills, and banking statements can be exported to JSON or imported anytime.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Full JSON Backup</span>
              </button>

              <label className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold cursor-pointer">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Restore from JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              {importStatus && (
                <div className="text-[11px] font-semibold text-emerald-400 text-center py-1">
                  {importStatus}
                </div>
              )}
            </div>

            {/* CLEAR ALL DEMO DATA & RESET OPTIONS */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => setIsClearDemoDataModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>{language === 'ur' ? 'تمام ڈیمو ڈیٹا صاف کریں' : 'Delete All Data / Clear Demo Records'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetToDefaultData();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Sample Store Records</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
