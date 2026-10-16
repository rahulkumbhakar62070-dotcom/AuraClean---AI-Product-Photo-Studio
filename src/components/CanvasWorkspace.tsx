import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ViewMode, BackgroundType, StudioSettings } from '../types';
import { 
  Split, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Paintbrush, 
  Layers, 
  Undo2, 
  Check, 
  Sparkles,
  Move
} from 'lucide-react';
import { applyInpaintPatch } from '../utils/imageProcessing';

interface CanvasWorkspaceProps {
  originalImage: string | null;
  cleanedCanvas: HTMLCanvasElement | null;
  renderedSceneCanvas: HTMLCanvasElement | null;
  backgroundType: BackgroundType;
  onBackgroundChange: (bg: BackgroundType) => void;
  settings: StudioSettings;
  onSettingsChange: (settings: StudioSettings) => void;
  onRefreshRender: () => void;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  originalImage,
  cleanedCanvas,
  renderedSceneCanvas,
  backgroundType,
  onBackgroundChange,
  settings,
  onSettingsChange,
  onRefreshRender,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0-100
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPanMode, setIsPanMode] = useState<boolean>(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Inpaint / Retouch Brush State
  const [isBrushMode, setIsBrushMode] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState<number>(18);
  const [brushStrokes, setBrushStrokes] = useState<{ x: number; y: number }[]>([]);
  const [isDrawingStroke, setIsDrawingStroke] = useState<boolean>(false);
  const inpaintCanvasRef = useRef<HTMLCanvasElement>(null);

  // Background Options
  const BACKGROUND_OPTIONS: { id: BackgroundType; label: string; previewClass: string }[] = [
    { id: 'transparent', label: 'Transparent', previewClass: 'bg-checkered border border-slate-300' },
    { id: 'white', label: 'Studio White', previewClass: 'bg-white border border-slate-300' },
    { id: 'travertine', label: 'Travertine', previewClass: 'bg-amber-100 border border-amber-300' },
    { id: 'slate', label: 'Dark Slate', previewClass: 'bg-slate-900 border border-slate-700' },
    { id: 'studio-gradient', label: 'Soft Gradient', previewClass: 'bg-gradient-to-b from-white to-slate-200 border border-slate-300' },
    { id: 'wood', label: 'Natural Wood', previewClass: 'bg-amber-900 border border-amber-950' },
    { id: 'black', label: 'Pure Black', previewClass: 'bg-black border border-slate-800' },
  ];

  // Mouse drag for Before/After Slider
  const handleSliderMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pct);
    },
    []
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      } else if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    };

    const onMouseUp = () => {
      setIsDraggingSlider(false);
      setIsPanning(false);
      setIsDrawingStroke(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDraggingSlider, isPanning, handleSliderMove, panStart]);

  // Touch Support for mobile
  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider && e.touches[0]) {
        handleSliderMove(e.touches[0].clientX);
      }
    };
    const onTouchEnd = () => setIsDraggingSlider(false);

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDraggingSlider, handleSliderMove]);

  // Handle Brush inpaint drawing
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanMode) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    if (!isBrushMode || !cleanedCanvas) return;
    const canvas = inpaintCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDrawingStroke(true);
    setBrushStrokes((prev) => [...prev, { x, y }]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingStroke || !isBrushMode) return;
    const canvas = inpaintCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setBrushStrokes((prev) => [...prev, { x, y }]);
  };

  // Draw inpaint stroke overlay
  useEffect(() => {
    if (!inpaintCanvasRef.current || !cleanedCanvas) return;
    const canvas = inpaintCanvasRef.current;
    canvas.width = cleanedCanvas.width;
    canvas.height = cleanedCanvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (brushStrokes.length > 0) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (const pt of brushStrokes) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [brushStrokes, brushSize, cleanedCanvas]);

  // Apply inpaint patch to cleanedCanvas
  const handleApplyInpaint = () => {
    if (!cleanedCanvas || brushStrokes.length === 0) return;
    applyInpaintPatch(cleanedCanvas, brushStrokes, brushSize);
    setBrushStrokes([]);
    setIsBrushMode(false);
    onRefreshRender();
  };

  const handleClearInpaint = () => {
    setBrushStrokes([]);
  };

  const currentDisplayUrl = renderedSceneCanvas
    ? renderedSceneCanvas.toDataURL()
    : cleanedCanvas
    ? cleanedCanvas.toDataURL()
    : originalImage;

  return (
    <div id="canvas" className="relative flex flex-col flex-1 bg-slate-100 min-h-[580px] select-none border-b border-slate-200">
      {/* Top Workspace Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* View Mode Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>
          <button
            onClick={() => setViewMode('cleaned')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'cleaned' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Cleaned Only</span>
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'original' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Original</span>
          </button>
          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'sideBySide' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Side-by-Side</span>
          </button>
        </div>

        {/* Retouch Spot Cleanup Brush */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsBrushMode(!isBrushMode);
              setIsPanMode(false);
            }}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border ${
              isBrushMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Highlight dust, scratches, or unwanted spots to clean up"
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>{isBrushMode ? 'Retouching Brush Active' : 'Spot Retouch Brush'}</span>
          </button>

          {isBrushMode && (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200 animate-fadeIn">
              <span className="text-slate-500 text-[11px]">Size:</span>
              <input
                type="range"
                min="6"
                max="40"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              {brushStrokes.length > 0 && (
                <>
                  <button
                    onClick={handleApplyInpaint}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Clean ({brushStrokes.length})</span>
                  </button>
                  <button
                    onClick={handleClearInpaint}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                    title="Clear strokes"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1 text-slate-600">
          <button
            onClick={() => {
              setIsPanMode(!isPanMode);
              setIsBrushMode(false);
            }}
            className={`p-1.5 rounded hover:bg-slate-100 cursor-pointer ${
              isPanMode ? 'bg-slate-200 text-slate-900' : ''
            }`}
            title="Pan mode"
          >
            <Move className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
            className="p-1.5 rounded hover:bg-slate-100 cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1 text-[11px] font-mono tabular-nums text-slate-500">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
            className="p-1.5 rounded hover:bg-slate-100 cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="p-1.5 rounded hover:bg-slate-100 cursor-pointer"
            title="Reset view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Display Stage */}
      <div 
        ref={containerRef}
        className={`relative flex-1 overflow-hidden flex items-center justify-center p-4 sm:p-8 min-h-[460px] ${
          backgroundType === 'transparent' ? 'bg-checkered' : 'bg-slate-100'
        } ${isPanMode ? 'cursor-grab active:cursor-grabbing' : isBrushMode ? 'cursor-crosshair' : ''}`}
      >
        {!originalImage ? (
          <div className="text-center p-8 max-w-md">
            <Layers className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No Product Loaded Yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select one of our studio sample items or drag and drop a product photo above to clean and isolate it.
            </p>
          </div>
        ) : viewMode === 'sideBySide' ? (
          /* Side-by-Side Dual View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl h-full items-center">
            {/* Original Card */}
            <div className="flex flex-col items-center bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="w-full py-2 px-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 flex justify-between">
                <span>Original Photograph</span>
                <span className="text-slate-400 font-normal">Before cleanup</span>
              </div>
              <div className="p-4 flex items-center justify-center max-h-[420px]">
                <img
                  src={originalImage}
                  alt="Original Product"
                  referrerPolicy="no-referrer"
                  className="max-h-[380px] w-auto object-contain rounded"
                />
              </div>
            </div>

            {/* Cleaned Card */}
            <div className="flex flex-col items-center bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="w-full py-2 px-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-900 flex justify-between">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Isolated & Studio Cleaned</span>
                </span>
                <span className="text-slate-500 capitalize">{backgroundType} Backdrop</span>
              </div>
              <div className={`p-4 flex items-center justify-center max-h-[420px] w-full ${backgroundType === 'transparent' ? 'bg-checkered' : ''}`}>
                {currentDisplayUrl && (
                  <img
                    src={currentDisplayUrl}
                    alt="Cleaned Studio Product"
                    referrerPolicy="no-referrer"
                    className="max-h-[380px] w-auto object-contain rounded"
                  />
                )}
              </div>
            </div>
          </div>
        ) : viewMode === 'original' ? (
          /* Original Only */
          <div 
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transition: isPanning ? 'none' : 'transform 0.15s ease-out',
            }}
            className="max-w-full max-h-full flex items-center justify-center"
          >
            <img
              src={originalImage}
              alt="Original Product"
              referrerPolicy="no-referrer"
              className="max-h-[500px] w-auto object-contain shadow-md rounded-lg"
            />
          </div>
        ) : viewMode === 'cleaned' ? (
          /* Cleaned Only */
          <div 
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transition: isPanning ? 'none' : 'transform 0.15s ease-out',
            }}
            className="relative max-w-full max-h-full flex items-center justify-center"
          >
            {currentDisplayUrl && (
              <img
                src={currentDisplayUrl}
                alt="Cleaned Product"
                referrerPolicy="no-referrer"
                className="max-h-[500px] w-auto object-contain shadow-lg rounded-lg"
              />
            )}
            {/* Inpaint Stroke Overlay Canvas */}
            {isBrushMode && (
              <canvas
                ref={inpaintCanvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                className="absolute inset-0 max-h-[500px] w-auto object-contain z-30"
              />
            )}
          </div>
        ) : (
          /* Split Slider View (Before vs After) */
          <div
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transition: isPanning ? 'none' : 'transform 0.15s ease-out',
            }}
            className="relative max-h-[500px] max-w-3xl flex items-center justify-center overflow-hidden rounded-xl shadow-xl border border-slate-300"
          >
            {/* Background Layer: Cleaned Studio Product */}
            <div className={`w-full h-full flex items-center justify-center ${backgroundType === 'transparent' ? 'bg-checkered' : ''}`}>
              {currentDisplayUrl && (
                <img
                  src={currentDisplayUrl}
                  alt="Cleaned Product"
                  referrerPolicy="no-referrer"
                  className="max-h-[500px] max-w-full object-contain block"
                />
              )}
            </div>

            {/* Foreground Clipped Layer: Original Image */}
            <div
              style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
            >
              <img
                src={originalImage}
                alt="Original Messy Photo"
                referrerPolicy="no-referrer"
                className="max-h-[500px] max-w-full object-contain block"
              />
            </div>

            {/* Inpaint canvas if active in split mode */}
            {isBrushMode && (
              <canvas
                ref={inpaintCanvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                className="absolute inset-0 max-h-[500px] w-full object-contain z-20"
              />
            )}

            {/* Draggable Divider Handle */}
            <div
              style={{ left: `${sliderPos}%` }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingSlider(true);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                setIsDraggingSlider(true);
              }}
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30 flex items-center justify-center shadow-lg hover:w-1.5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-white pointer-events-auto">
                <Split className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* Floating Labels */}
            <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur text-white text-[10px] font-medium px-2 py-0.5 rounded shadow pointer-events-none z-10">
              Original Photo
            </div>
            <div className="absolute top-3 right-3 bg-indigo-600/90 backdrop-blur text-white text-[10px] font-medium px-2 py-0.5 rounded shadow pointer-events-none z-10">
              Cleaned Studio Result
            </div>
          </div>
        )}
      </div>

      {/* Bottom Surface & Background Switcher Dock */}
      <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4 overflow-x-auto text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-semibold text-slate-700">Studio Surface:</span>
          <div className="flex items-center gap-1.5">
            {BACKGROUND_OPTIONS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onBackgroundChange(bg.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  backgroundType === bg.id
                    ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${bg.previewClass}`} />
                <span>{bg.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Contact Shadow & Reflection Toggles */}
        <div className="flex items-center gap-3 shrink-0 text-slate-600">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.contactShadow}
              onChange={(e) => onSettingsChange({ ...settings, contactShadow: e.target.checked })}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-3.5 h-3.5"
            />
            <span>Contact Shadow</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.reflection}
              onChange={(e) => onSettingsChange({ ...settings, reflection: e.target.checked })}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-3.5 h-3.5"
            />
            <span>Floor Reflection</span>
          </label>
        </div>
      </div>
    </div>
  );
};
