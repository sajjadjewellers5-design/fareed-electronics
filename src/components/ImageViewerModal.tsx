import React from 'react';
import { X, Download, ZoomIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ImageViewerModal: React.FC = () => {
  const { previewImage, setPreviewImage } = useApp();

  if (!previewImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setPreviewImage(null)}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <ZoomIn className="w-4 h-4 text-cyan-400" />
            <span>Attached Picture &amp; Billing Slip Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={previewImage}
              download="fareed-billing-slip.png"
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => setPreviewImage(null)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image body */}
        <div className="p-4 flex items-center justify-center overflow-auto max-h-[calc(90vh-70px)] bg-slate-950/60">
          <img
            src={previewImage}
            alt="Billing slip / Receipt preview"
            className="max-w-full max-h-[78vh] object-contain rounded-lg border border-slate-800 shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
