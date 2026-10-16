import React, { useState, useRef } from 'react';
import { SAMPLE_PRODUCTS } from '../utils/samples';
import { ProductSample } from '../types';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  X, 
  ArrowRight,
  ClipboardPaste
} from 'lucide-react';

interface SamplePickerProps {
  onSelectSample: (sample: ProductSample) => void;
  onUploadCustom: (dataUrl: string, filename: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SamplePicker: React.FC<SamplePickerProps> = ({
  onSelectSample,
  onUploadCustom,
  isOpen,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  if (!isOpen) return null;

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUploadCustom(dataUrl, file.name);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop file
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUploadCustom(dataUrl, file.name);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  // Paste from clipboard
  const handlePasteClipboard = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              if (dataUrl) {
                onUploadCustom(dataUrl, 'clipboard-image.png');
                onClose();
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
    } catch {
      alert('No image found in clipboard or clipboard permission not granted.');
    }
  };

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'environment' } 
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Unable to access camera: ' + err);
    }
  };

  // Capture Snapshot from Camera
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    // Stop tracks
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
    onUploadCustom(dataUrl, 'camera-capture.jpg');
    onClose();
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">Product Photo Gallery</h2>
            <p className="text-xs text-slate-500">
              Pick a realistic demo product or upload your own to test background removal and cleanup instructions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload & Capture Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="p-4 border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100"
            >
              <Upload className="w-6 h-6 text-slate-500 mb-1" />
              <span className="text-xs font-semibold text-slate-800">Upload Photo</span>
              <span className="text-[11px] text-slate-500">Drop PNG, JPG or WEBP</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <button
              onClick={startCamera}
              className="p-4 border border-slate-200 hover:border-slate-400 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100"
            >
              <Camera className="w-6 h-6 text-indigo-600 mb-1" />
              <span className="text-xs font-semibold text-slate-800">Snap with Camera</span>
              <span className="text-[11px] text-slate-500">Photograph a product</span>
            </button>

            <button
              onClick={handlePasteClipboard}
              className="p-4 border border-slate-200 hover:border-slate-400 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100"
            >
              <ClipboardPaste className="w-6 h-6 text-emerald-600 mb-1" />
              <span className="text-xs font-semibold text-slate-800">Paste from Clipboard</span>
              <span className="text-[11px] text-slate-500">Ctrl+V / Cmd+V</span>
            </button>
          </div>

          {/* Active Camera View */}
          {isCameraActive && (
            <div className="p-4 bg-slate-900 rounded-xl flex flex-col items-center gap-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="rounded-lg max-h-64 w-auto bg-black"
              />
              <div className="flex gap-3">
                <button
                  onClick={captureSnapshot}
                  className="px-4 py-2 bg-white text-slate-900 font-semibold text-xs rounded-lg shadow cursor-pointer hover:bg-slate-100"
                >
                  Capture Photo
                </button>
                <button
                  onClick={closeCamera}
                  className="px-4 py-2 bg-slate-700 text-white font-medium text-xs rounded-lg cursor-pointer hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Sample Products Grid */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Instant Sample Products (Ready to clean & isolate)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SAMPLE_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onSelectSample(prod);
                    onClose();
                  }}
                  className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-800 hover:shadow-md rounded-xl p-3 flex flex-col transition-all cursor-pointer"
                >
                  <div className="aspect-square w-full rounded-lg bg-slate-200/70 overflow-hidden flex items-center justify-center mb-2.5">
                    <img
                      src={prod.dataUrl}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="text-[11px] font-medium text-indigo-600 mb-0.5">
                    {prod.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 mb-2">
                    {prod.description}
                  </p>

                  <div className="mt-auto pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-800 group-hover:text-indigo-600">
                    <span>Load Studio Scene</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
