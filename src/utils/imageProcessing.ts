import { StudioSettings, BackgroundType, ExportConfig } from '../types';

/**
 * Loads an image from Data URL or path into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = src;
  });
}

/**
 * Intelligent Foreground Isolation & Background Removal Engine
 * Works seamlessly client-side using edge flood-fill, perimeter color clustering & alpha feathering
 */
export async function removeBackgroundLocally(
  img: HTMLImageElement,
  tolerance = 38,
  edgeSmooth = 3
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2D context');

  ctx.drawImage(img, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Sample background colors along perimeter (top, bottom, left, right edges)
  const bgSamples: [number, number, number][] = [];
  const step = Math.max(1, Math.floor(Math.min(width, height) / 40));

  for (let x = 0; x < width; x += step) {
    const idxTop = (x * 4);
    const idxBottom = ((height - 1) * width + x) * 4;
    bgSamples.push([data[idxTop], data[idxTop + 1], data[idxTop + 2]]);
    bgSamples.push([data[idxBottom], data[idxBottom + 1], data[idxBottom + 2]]);
  }

  for (let y = 0; y < height; y += step) {
    const idxLeft = (y * width) * 4;
    const idxRight = (y * width + (width - 1)) * 4;
    bgSamples.push([data[idxLeft], data[idxLeft + 1], data[idxLeft + 2]]);
    bgSamples.push([data[idxRight], data[idxRight + 1], data[idxRight + 2]]);
  }

  // Calculate average perimeter color
  let avgR = 0, avgG = 0, avgB = 0;
  for (const [r, g, b] of bgSamples) {
    avgR += r;
    avgG += g;
    avgB += b;
  }
  avgR /= bgSamples.length;
  avgG /= bgSamples.length;
  avgB /= bgSamples.length;

  const centerDistMax = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
  const tolSq = (tolerance * 2.8) ** 2;

  // Mask pass
  const mask = new Uint8ClampedArray(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x);
      const idx = i * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Distance to perimeter colors
      let minDiffSq = Infinity;
      // Test against average and representative samples
      const diffAvgSq = (r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2;
      minDiffSq = diffAvgSq;

      for (let s = 0; s < bgSamples.length; s += 4) {
        const [sr, sg, sb] = bgSamples[s];
        const dSq = (r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2;
        if (dSq < minDiffSq) minDiffSq = dSq;
      }

      // Proximity to image center (products are placed centrally in photo frame)
      const dx = x - width / 2;
      const dy = y - height / 2;
      const centerDist = Math.sqrt(dx * dx + dy * dy);
      const centerWeight = 1 - Math.min(1, centerDist / (centerDistMax * 0.95));

      // Effective tolerance adjusted by central protection
      const effectiveTolSq = tolSq * (1 - centerWeight * 0.55);

      if (minDiffSq < effectiveTolSq) {
        mask[i] = 0; // background
      } else {
        mask[i] = 255; // foreground product
      }
    }
  }

  // Smooth & Defringe Alpha
  const smoothedMask = new Uint8ClampedArray(width * height);
  const radius = Math.max(1, edgeSmooth);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (radius <= 1) {
        smoothedMask[idx] = mask[idx];
        continue;
      }

      let sum = 0;
      let count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          sum += mask[ny * width + nx];
          count++;
        }
      }
      smoothedMask[idx] = Math.round(sum / count);
    }
  }

  // Apply smoothed mask to alpha channel
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const alphaVal = smoothedMask[i];
    data[idx + 3] = alphaVal;
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Applies Inpaint/Spot Retouching on targeted strokes
 */
export function applyInpaintPatch(
  canvas: HTMLCanvasElement,
  points: { x: number; y: number }[],
  brushRadius = 16
) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || points.length === 0) return;

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // For each stroke point, sample neighboring pixels outside the spot and blend smoothly
  for (const pt of points) {
    const cx = Math.round(pt.x);
    const cy = Math.round(pt.y);
    const r = brushRadius;

    let sampleR = 0, sampleG = 0, sampleB = 0, sampleA = 0, count = 0;
    // Sample ring around the spot
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const sx = Math.round(cx + Math.cos(angle) * (r + 3));
      const sy = Math.round(cy + Math.sin(angle) * (r + 3));
      if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
        const sIdx = (sy * width + sx) * 4;
        sampleR += data[sIdx];
        sampleG += data[sIdx + 1];
        sampleB += data[sIdx + 2];
        sampleA += data[sIdx + 3];
        count++;
      }
    }

    if (count > 0) {
      const avgR = sampleR / count;
      const avgG = sampleG / count;
      const avgB = sampleB / count;
      const avgA = sampleA / count;

      // Fill inner circle with soft falloff
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= r) {
            const px = cx + dx;
            const py = cy + dy;
            if (px >= 0 && px < width && py >= 0 && py < height) {
              const pIdx = (py * width + px) * 4;
              const weight = 1 - (dist / r);
              data[pIdx] = Math.round(data[pIdx] * (1 - weight) + avgR * weight);
              data[pIdx + 1] = Math.round(data[pIdx + 1] * (1 - weight) + avgG * weight);
              data[pIdx + 2] = Math.round(data[pIdx + 2] * (1 - weight) + avgB * weight);
              data[pIdx + 3] = Math.round(data[pIdx + 3] * (1 - weight) + avgA * weight);
            }
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Finds the bounding box of non-transparent pixels
 */
export function getForegroundBounds(canvas: HTMLCanvasElement): { minX: number; maxX: number; minY: number; maxY: number } {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { minX: 0, maxX: canvas.width, minY: 0, maxY: canvas.height };

  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;

  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (minX > maxX) {
    return { minX: 0, maxX: width, minY: 0, maxY: height };
  }

  return { minX, maxX, minY, maxY };
}

/**
 * Render Studio Scene with custom background, contact shadows, reflections, and lighting
 */
export function renderStudioScene(
  foregroundCanvas: HTMLCanvasElement,
  background: BackgroundType,
  settings: StudioSettings
): HTMLCanvasElement {
  const width = foregroundCanvas.width;
  const height = foregroundCanvas.height;

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = width;
  outputCanvas.height = height;
  const ctx = outputCanvas.getContext('2d');
  if (!ctx) return foregroundCanvas;

  // 1. Draw Background
  if (background === 'transparent') {
    // Left completely transparent for PNG export
  } else if (background === 'white') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (background === 'black') {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
  } else if (background === 'custom') {
    ctx.fillStyle = settings.customBgColor || '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
  } else if (background === 'studio-gradient') {
    const grad = ctx.createRadialGradient(width / 2, height * 0.45, width * 0.1, width / 2, height * 0.5, width * 0.7);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.6, '#f1f5f9');
    grad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (background === 'travertine') {
    // Luxury travertine / warm limestone background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#faf6f0');
    grad.addColorStop(0.4, '#f2ebe0');
    grad.addColorStop(0.8, '#e8ded0');
    grad.addColorStop(1, '#dbcdbc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle stone veins
    ctx.strokeStyle = 'rgba(168, 148, 128, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.3);
    ctx.bezierCurveTo(width * 0.3, height * 0.35, width * 0.6, height * 0.25, width, height * 0.4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    ctx.bezierCurveTo(width * 0.4, height * 0.65, width * 0.7, height * 0.78, width, height * 0.72);
    ctx.stroke();
  } else if (background === 'slate') {
    // Dark Charcoal Slate
    const grad = ctx.createRadialGradient(width / 2, height * 0.4, width * 0.1, width / 2, height * 0.5, width * 0.8);
    grad.addColorStop(0, '#334155');
    grad.addColorStop(0.6, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (background === 'wood') {
    // Warm natural oak
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#543419');
    grad.addColorStop(0.5, '#78431e');
    grad.addColorStop(1, '#3b1d0c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  const bounds = getForegroundBounds(foregroundCanvas);
  const prodCenterX = (bounds.minX + bounds.maxX) / 2;
  const prodBaseY = bounds.maxY;
  const prodWidth = Math.max(20, bounds.maxX - bounds.minX);
  const prodHeight = Math.max(20, bounds.maxY - bounds.minY);

  // 2. Floor Reflection (if enabled)
  if (settings.reflection && background !== 'transparent') {
    ctx.save();
    const reflOpacity = (settings.reflectionOpacity || 30) / 100;
    ctx.globalAlpha = reflOpacity;

    // Flip vertically below base
    ctx.translate(0, prodBaseY * 2);
    ctx.scale(1, -1);
    ctx.drawImage(foregroundCanvas, 0, 0);

    // Fade reflection out with gradient mask
    ctx.globalCompositeOperation = 'destination-out';
    const fadeGrad = ctx.createLinearGradient(0, prodBaseY, 0, prodBaseY + prodHeight * 0.5);
    fadeGrad.addColorStop(0, 'rgba(0,0,0,0)');
    fadeGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(0, prodBaseY, width, prodHeight);

    ctx.restore();
  }

  // 3. Contact Shadow (if enabled)
  if (settings.contactShadow && background !== 'transparent') {
    ctx.save();
    const shadowOpacity = (settings.shadowOpacity || 55) / 100;
    const shadowBlur = settings.shadowBlur || 14;

    // Soft blurred elliptical shadow
    ctx.filter = `blur(${shadowBlur}px)`;
    ctx.fillStyle = `rgba(15, 23, 42, ${shadowOpacity})`;

    ctx.beginPath();
    ctx.ellipse(
      prodCenterX,
      prodBaseY + 4,
      prodWidth * 0.42,
      Math.max(6, prodHeight * 0.06),
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Secondary tighter occlusion shadow right beneath base
    ctx.filter = `blur(${Math.max(2, shadowBlur * 0.35)}px)`;
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity * 1.25})`;
    ctx.beginPath();
    ctx.ellipse(
      prodCenterX,
      prodBaseY + 1,
      prodWidth * 0.32,
      Math.max(3, prodHeight * 0.025),
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  // 4. Draw Isolated Foreground Product
  ctx.save();

  // Color & Light adjustments
  const exp = settings.exposure || 0; // -100 to 100
  const con = settings.contrast || 0;
  const sat = settings.saturation || 0;

  const brightness = 100 + exp;
  const contrast = 100 + con;
  const saturate = 100 + sat;

  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
  ctx.drawImage(foregroundCanvas, 0, 0);

  // Warmth filter overlay
  if (settings.warmth !== 0) {
    const warmthVal = settings.warmth;
    ctx.globalCompositeOperation = warmthVal > 0 ? 'color' : 'color';
    ctx.globalAlpha = Math.abs(warmthVal) / 280;
    ctx.fillStyle = warmthVal > 0 ? '#ffb74d' : '#64b5f6';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();

  return outputCanvas;
}

/**
 * Export Helper (PNG, JPG, WebP with custom resolutions)
 */
export async function exportProductImage(
  canvas: HTMLCanvasElement,
  config: ExportConfig
): Promise<{ blob: Blob; url: string; filename: string }> {
  let targetWidth = canvas.width;
  let targetHeight = canvas.height;

  if (config.dimension === 'amazon') {
    targetWidth = 2000;
    targetHeight = 2000;
  } else if (config.dimension === 'social') {
    targetWidth = 1080;
    targetHeight = 1080;
  }

  const outCanvas = document.createElement('canvas');
  outCanvas.width = targetWidth;
  outCanvas.height = targetHeight;
  const ctx = outCanvas.getContext('2d');
  if (!ctx) throw new Error('Export canvas context error');

  // Fill white if JPG or user prefers white
  if (config.format === 'jpeg' || (!config.transparentIfPng && config.format === 'png')) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Calculate scaled & centered aspect ratio fit
  const padding = config.padding || 0.1; // 10% padding for Amazon listings
  const availWidth = targetWidth * (1 - padding * 2);
  const availHeight = targetHeight * (1 - padding * 2);

  const scale = Math.min(availWidth / canvas.width, availHeight / canvas.height);
  const drawW = canvas.width * scale;
  const drawH = canvas.height * scale;
  const drawX = (targetWidth - drawW) / 2;
  const drawY = (targetHeight - drawH) / 2;

  ctx.drawImage(canvas, drawX, drawY, drawW, drawH);

  const mime = config.format === 'png' ? 'image/png' : config.format === 'webp' ? 'image/webp' : 'image/jpeg';
  const ext = config.format === 'jpeg' ? 'jpg' : config.format;

  return new Promise((resolve) => {
    outCanvas.toBlob(
      (blob) => {
        if (!blob) throw new Error('Failed to create blob');
        const url = URL.createObjectURL(blob);
        const filename = `product-cleaned-${Date.now()}.${ext}`;
        resolve({ blob, url, filename });
      },
      mime,
      (config.quality || 95) / 100
    );
  });
}

/**
 * Direct clipboard copy helper
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          resolve(true);
        } catch {
          resolve(false);
        }
      }, 'image/png');
    });
  } catch {
    return false;
  }
}
