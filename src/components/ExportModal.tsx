import React, { useState } from 'react';
import { ExportConfig } from '../types';
import { exportProductImage, copyCanvasToClipboard } from '../utils/imageProcessing';
import { Download, Copy, Check, X, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';

interface ExportModalProps {
  canvas: HTMLCanvasElement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ canvas, isOpen, onClose }) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [dimension, setDimension] = useState<'original' | 'amazon' | 'social'>('amazon');
  const [quality, setQuality] = useState<number>(95);
  const [padding, setPadding] = useState<number>(10); // percentage 0 to 25
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen || !canvas) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const config: ExportConfig = {
        format,
        dimension,
        quality,
        transparentIfPng: format === 'png',
        padding: padding / 100,
      };

      const result = await exportProductImage(canvas, config);
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.filename;
      link.click();
      onClose();
    } catch (err) {
      alert('Export failed: ' + err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyClipboard = async () => {
    if (!canvas) return;
    const success = await copyCanvasToClipboard(canvas);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('Unable to copy directly. Please use Download instead.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-slate-800" />
            <h3 className="text-base font-bold text-slate-900 font-display">Export Cleaned Product</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Image Format</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('png')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                  format === 'png'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                PNG (Transparent)
              </button>
              <button
                type="button"
                onClick={() => setFormat('jpeg')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                  format === 'jpeg'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                JPG (White / Solid)
              </button>
              <button
                type="button"
                onClick={() => setFormat('webp')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                  format === 'webp'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                WebP (Optimized)
              </button>
            </div>
          </div>

          {/* Sizing Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Resolution & Platform</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDimension('amazon')}
                className={`p-2.5 text-left border rounded-lg transition-all cursor-pointer ${
                  dimension === 'amazon'
                    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1 text-slate-900 font-semibold text-xs">
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
                  <span>Amazon Listing</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">2000 × 2000 px</span>
              </button>

              <button
                type="button"
                onClick={() => setDimension('original')}
                className={`p-2.5 text-left border rounded-lg transition-all cursor-pointer ${
                  dimension === 'original'
                    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1 text-slate-900 font-semibold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Original Size</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {canvas.width} × {canvas.height} px
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDimension('social')}
                className={`p-2.5 text-left border rounded-lg transition-all cursor-pointer ${
                  dimension === 'social'
                    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1 text-slate-900 font-semibold text-xs">
                  <span>Square 1:1</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">1080 × 1080 px</span>
              </button>
            </div>
          </div>

          {/* Amazon Listing Safety Box Notice */}
          {dimension === 'amazon' && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Amazon E-Commerce Standard:</span>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Centered with 10% breathing space, 2000px resolution enables zoom functionality on marketplace product pages.
                </p>
              </div>
            </div>
          )}

          {/* Padding / Margin Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Product Margins (Padding)</span>
              <span className="font-mono text-slate-500">{padding}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>

          {/* Quality Slider (for JPG/WebP) */}
          {format !== 'png' && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Compression Quality</span>
                <span className="font-mono text-slate-500">{quality}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
            <button
              onClick={handleCopyClipboard}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating File...' : 'Download File'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
