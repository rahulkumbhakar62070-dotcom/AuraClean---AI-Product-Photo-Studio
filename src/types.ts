export type BackgroundType = 
  | 'transparent' 
  | 'white' 
  | 'travertine' 
  | 'black' 
  | 'wood' 
  | 'slate' 
  | 'studio-gradient'
  | 'custom';

export type ViewMode = 'split' | 'cleaned' | 'original' | 'sideBySide';

export interface StudioSettings {
  exposure: number; // -100 to 100
  contrast: number; // -100 to 100
  warmth: number; // -100 to 100
  saturation: number; // -100 to 100
  sharpness: number; // 0 to 100
  edgeSmooth: number; // 0 to 20
  tolerance: number; // 5 to 90
  contactShadow: boolean;
  shadowOpacity: number; // 0 to 100
  shadowBlur: number; // 0 to 50
  reflection: boolean;
  reflectionOpacity: number; // 0 to 100
  reflectionFalloff: number; // 10 to 100
  customBgColor: string;
}

export interface ProductSample {
  id: string;
  name: string;
  category: string;
  description: string;
  samplePrompt: string;
  thumbnailSvg: string;
  dataUrl: string;
}

export interface InstructionHistoryItem {
  id: string;
  prompt: string;
  timestamp: string;
  model: string;
  thumbnail: string;
}

export interface ProductAnalysis {
  productName: string;
  category: string;
  backgroundType: string;
  detectedIssues: string[];
  recommendedPrompts: string[];
}

export interface ExportConfig {
  format: 'png' | 'jpeg' | 'webp';
  dimension: 'original' | 'amazon' | 'social';
  quality: number;
  transparentIfPng: boolean;
  padding: number;
}
