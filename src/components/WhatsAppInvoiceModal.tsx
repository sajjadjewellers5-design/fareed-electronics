import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Copy,
  Check,
  Phone,
  FileText,
  User,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  generateWhatsAppInvoiceMessage,
  formatWhatsAppPhoneNumber,
} from '../data/translations';

export const WhatsAppInvoiceModal: React.FC = () => {
  const {
    whatsAppModalInvoice,
    setWhatsAppModalInvoice,
    companyProfile,
    language,
    t,
  } = useApp();

  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'en' | 'ur'>('ur');

  useEffect(() => {
    if (whatsAppModalInvoice) {
      setPhone(whatsAppModalInvoice.customerPhone || '');
      setSelectedLang(language === 'ur' ? 'ur' : 'en');
    }
  }, [whatsAppModalInvoice, language]);

  if (!whatsAppModalInvoice) return null;

  const inv = whatsAppModalInvoice;
  const formattedPhone = formatWhatsAppPhoneNumber(phone);
  const invoiceMessage = generateWhatsAppInvoiceMessage(
    {
      invoiceNumber: inv.invoiceNumber,
      customerName: inv.customerName,
      customerPhone: inv.customerPhone,
      date: inv.date,
      items: inv.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total,
      })),
      grandTotal: inv.grandTotal,
      paidAmount: inv.paidAmount,
      dueBalance: inv.dueBalance,
      notes: inv.notes,
    },
    companyProfile.name || 'Fareed Electronics',
    companyProfile.phone || '+92 300 1234567',
    selectedLang
  );

  const handleSendWhatsApp = () => {
    if (!formattedPhone) return;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(invoiceMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(invoiceMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={() => setWhatsAppModalInvoice(null)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{t('whatsappPromptTitle')}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WhatsApp Direct
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {t('whatsappPromptDesc')}
            </p>
          </div>
        </div>

        {/* Invoice Summary Pill */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>{inv.invoiceNumber}</span>
            </div>
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <User className="w-3 h-3 text-slate-500" />
              <span>{inv.customerName}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Amount</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">
              Rs. {inv.grandTotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Recipient Phone Input & Language Switcher */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('recipientPhone')}</span>
            </label>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedLang('ur')}
                className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  selectedLang === 'ur'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                اردو فارمیٹ
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  selectedLang === 'en'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0300 1234567 or 923001234567"
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-sm rounded-xl px-4 py-2.5 outline-none font-mono"
            />
            {formattedPhone && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400 font-mono font-semibold">
                wa.me/+{formattedPhone}
              </span>
            )}
          </div>
        </div>

        {/* Formatted Message Preview */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">{t('messagePreview')}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed select-all">
            {invoiceMessage}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setWhatsAppModalInvoice(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            {t('close')} (Esc)
          </button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            disabled={!formattedPhone}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{t('openWhatsApp')}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
};
