import React, { useState } from 'react';
import { StudioSettings, ProductAnalysis, InstructionHistoryItem } from '../types';
import { 
  Sliders, 
  Sun, 
  Layers, 
  Sparkles, 
  History, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Scissors
} from 'lucide-react';

interface ControlPanelProps {
  settings: StudioSettings;
  onSettingsChange: (newSettings: StudioSettings) => void;
  onRecomputeMatte: () => void;
  analysis: ProductAnalysis | null;
  history: InstructionHistoryItem[];
  onSelectHistoryPrompt: (prompt: string) => void;
  isProcessing: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onSettingsChange,
  onRecomputeMatte,
  analysis,
  history,
  onSelectHistoryPrompt,
  isProcessing,
}) => {
  const [activeTab, setActiveTab] = useState<'lighting' | 'edges' | 'shadows' | 'ai' | 'history'>('lighting');

  const handleResetLighting = () => {
    onSettingsChange({
      ...settings,
      exposure: 0,
      contrast: 0,
      warmth: 0,
      saturation: 0,
      sharpness: 0,
    });
  };

  return (
    <div className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 pb-2.5 mb-5 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('lighting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'lighting'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Studio Lighting & Tone</span>
          </button>

          <button
            onClick={() => setActiveTab('edges')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'edges'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Edge Cutout & Matte</span>
          </button>

          <button
            onClick={() => setActiveTab('shadows')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'shadows'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Shadow & Reflection</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'ai'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Product Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Instruction History ({history.length})</span>
          </button>
        </div>

        {/* Tab 1: Studio Lighting & Tone */}
        {activeTab === 'lighting' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Exposure</span>
                <span className="font-mono text-slate-500">{settings.exposure > 0 ? `+${settings.exposure}` : settings.exposure}%</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={settings.exposure}
                onChange={(e) => onSettingsChange({ ...settings, exposure: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Contrast</span>
                <span className="font-mono text-slate-500">{settings.contrast > 0 ? `+${settings.contrast}` : settings.contrast}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="60"
                value={settings.contrast}
                onChange={(e) => onSettingsChange({ ...settings, contrast: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Warmth (Color Temp)</span>
                <span className="font-mono text-slate-500">{settings.warmth > 0 ? `+${settings.warmth} Warm` : settings.warmth < 0 ? `${settings.warmth} Cool` : 'Neutral'}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={settings.warmth}
                onChange={(e) => onSettingsChange({ ...settings, warmth: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Saturation</span>
                <span className="font-mono text-slate-500">{settings.saturation > 0 ? `+${settings.saturation}` : settings.saturation}%</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={settings.saturation}
                onChange={(e) => onSettingsChange({ ...settings, saturation: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="col-span-full flex justify-end">
              <button
                onClick={handleResetLighting}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Lighting Values</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Edge Cutout & Matte */}
        {activeTab === 'edges' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Matte Sensitivity (Tolerance)</span>
                <span className="font-mono text-slate-500">{settings.tolerance}</span>
              </div>
              <input
                type="range"
                min="15"
                max="75"
                value={settings.tolerance}
                onChange={(e) => onSettingsChange({ ...settings, tolerance: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <p className="text-[11px] text-slate-400">Increase for busy backgrounds; decrease to protect delicate textures.</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Edge Feathering & Defringing</span>
                <span className="font-mono text-slate-500">{settings.edgeSmooth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.edgeSmooth}
                onChange={(e) => onSettingsChange({ ...settings, edgeSmooth: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <p className="text-[11px] text-slate-400">Smooths pixelated edges and blends semi-transparent outlines.</p>
            </div>

            <div>
              <button
                onClick={onRecomputeMatte}
                disabled={isProcessing}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Re-extract Matte</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Shadow & Reflection */}
        {activeTab === 'shadows' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Contact Shadow Opacity</span>
                <span className="font-mono text-slate-500">{settings.shadowOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.shadowOpacity}
                onChange={(e) => onSettingsChange({ ...settings, shadowOpacity: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Shadow Softness / Blur</span>
                <span className="font-mono text-slate-500">{settings.shadowBlur}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="35"
                value={settings.shadowBlur}
                onChange={(e) => onSettingsChange({ ...settings, shadowBlur: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Floor Reflection Opacity</span>
                <span className="font-mono text-slate-500">{settings.reflectionOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                value={settings.reflectionOpacity}
                onChange={(e) => onSettingsChange({ ...settings, reflectionOpacity: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>
          </div>
        )}

        {/* Tab 4: AI Analysis */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            {analysis ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Product & Category
                  </span>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{analysis.productName}</p>
                  <p className="text-xs text-slate-500">{analysis.category}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Detected Imperfections
                  </span>
                  <ul className="mt-1 space-y-1">
                    {analysis.detectedIssues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Tailored AI Actions
                  </span>
                  <div className="mt-1.5 space-y-1.5">
                    {analysis.recommendedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectHistoryPrompt(p)}
                        className="w-full text-left text-xs text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-100 hover:border-indigo-200 p-1.5 rounded transition-colors truncate block cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3">
                No product photo analyzed yet. Load a photo to inspect background composition and defects.
              </p>
            )}
          </div>
        )}

        {/* Tab 5: Instruction History */}
        {activeTab === 'history' && (
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No instructions executed in this session yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectHistoryPrompt(item.prompt)}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-mono">{item.timestamp}</span>
                      <span className="font-mono text-slate-500">{item.model.replace('gemini-', '')}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 line-clamp-2 group-hover:text-slate-900">
                      "{item.prompt}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
