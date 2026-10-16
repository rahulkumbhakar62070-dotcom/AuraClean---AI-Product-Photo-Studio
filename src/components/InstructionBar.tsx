import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wand2, Sliders, CheckCircle2 } from 'lucide-react';

interface InstructionBarProps {
  onApplyInstruction: (instruction: string, model: string) => Promise<void>;
  isProcessing: boolean;
  statusMessage?: string;
  recommendedPrompts?: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  hasImage: boolean;
}

const DEFAULT_INSPIRATIONS = [
  'Remove background completely and make it 100% transparent PNG',
  'Place on pure #FFFFFF white studio backdrop with soft contact shadow',
  'Clean up dust, scratches and finger smudges on the surface',
  'Place on polished luxury travertine marble with warm morning sun',
  'Isolate product on dark slate podium with dramatic studio rim light',
  'Brighten lighting, remove harsh glare reflections, smooth reflections',
];

export const InstructionBar: React.FC<InstructionBarProps> = ({
  onApplyInstruction,
  isProcessing,
  statusMessage,
  recommendedPrompts,
  selectedModel,
  onModelChange,
  hasImage,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing || !hasImage) return;
    onApplyInstruction(prompt, selectedModel);
  };

  const handleInspirationClick = (text: string) => {
    setPrompt(text);
    if (hasImage) {
      onApplyInstruction(text, selectedModel);
    }
  };

  const suggestions = (recommendedPrompts && recommendedPrompts.length > 0) 
    ? recommendedPrompts 
    : DEFAULT_INSPIRATIONS;

  return (
    <div className="w-full bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-3">
        {/* Main Instruction Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 bg-slate-50 border border-slate-300 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/10 rounded-xl transition-all shadow-sm">
            <div className="flex items-center pl-3 pr-1 text-slate-400">
              <Wand2 className="w-5 h-5 text-indigo-600" />
            </div>

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                hasImage
                  ? "Type your instructions... (e.g. 'Remove background and put on white marble counter with soft morning shadow')"
                  : "First select a sample product below or upload a photo to start editing..."
              }
              disabled={isProcessing || !hasImage}
              className="flex-1 bg-transparent py-2.5 px-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none disabled:opacity-60 font-sans"
            />

            <div className="flex items-center gap-2 px-1">
              {/* Model Selector */}
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => onModelChange(e.target.value)}
                  disabled={isProcessing}
                  className="text-xs font-mono font-medium bg-white text-slate-700 py-2 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="gemini-nano-banana-2.1">Gemini Nano Banana 2.1 (Flagship)</option>
                  <option value="gemini-3.1-flash-lite-image">Gemini 3.1 Flash Lite Image</option>
                  <option value="local-studio-engine">Instant Studio Engine (Local)</option>
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!prompt.trim() || isProcessing || !hasImage}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  prompt.trim() && hasImage && !isProcessing
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Apply Instruction</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Processing Step Notice */}
        {isProcessing && statusMessage && (
          <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50/70 border border-indigo-100 rounded-lg px-3 py-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
            <span className="font-medium">{statusMessage}</span>
          </div>
        )}

        {/* Quick Inspiration Prompts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-500 no-scrollbar">
          <span className="shrink-0 font-medium text-slate-400 flex items-center gap-1 pl-1">
            <Sliders className="w-3 h-3" />
            <span>Try:</span>
          </span>
          {suggestions.slice(0, 4).map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing || !hasImage}
              onClick={() => handleInspirationClick(item)}
              className="shrink-0 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors text-left truncate max-w-xs cursor-pointer border border-slate-200/60"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
