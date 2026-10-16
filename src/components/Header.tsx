import React from 'react';
import { Download, Sparkles, RotateCcw, Image as ImageIcon, FolderDown } from 'lucide-react';

interface HeaderProps {
  onExportClick: () => void;
  onResetClick: () => void;
  onOpenSamples: () => void;
  hasImage: boolean;
  activeModel: string;
}

export const Header: React.FC<HeaderProps> = ({
  onExportClick,
  onResetClick,
  onOpenSamples,
  hasImage,
  activeModel,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0">
            AuraClean Studio
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-mono tracking-wide">
            · {activeModel.replace('gemini-', '')}
          </span>
        </div>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button 
            onClick={onOpenSamples}
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            <ImageIcon className="w-4 h-4 text-slate-400" />
            <span>Sample Library</span>
          </button>
          <a href="#canvas" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Studio Canvas
          </a>
          <a href="#presets" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Lighting & Backdrops
          </a>
          <a href="/api/download-zip" download="auraclean-product-studio.zip" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap shrink-0 font-medium">
            <FolderDown className="w-4 h-4" />
            <span>Download Project ZIP</span>
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="/api/download-zip"
            download="auraclean-product-studio.zip"
            title="Download full project code as ZIP for GitHub"
            className="md:hidden p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <FolderDown className="w-4 h-4" />
          </a>
          {hasImage && (
            <button
              onClick={onResetClick}
              title="Reset to original photo"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onExportClick}
            disabled={!hasImage}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer ${
              hasImage
                ? 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Cleaned</span>
          </button>
        </div>
      </div>
    </header>
  );
};
