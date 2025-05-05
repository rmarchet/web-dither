import { DitherSettings } from '../types';
import {
  applyFloydSteinberg,
  applyJarvisJudiceNinke,
  applySierraLite,
  applyTwoRowSierra,
  applyStevensonArce,
  applyOstromukhov,
  applyGaussian,
  applyAtkinson,
  applyBayer,
  applyOrdered,
  applyRandom,
  applyBurkes,
  applySierra,
  applyHalftone
} from './dither/index';

export const preprocessImage = (data: Uint8ClampedArray, settings: DitherSettings) => {
  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale
    let gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    
    // Apply detail enhancement
    const detail = settings.detailEnhancement / 50; // Convert to 0-2 range
    if (detail !== 1) {
      const diff = gray - 128;
      gray = 128 + diff * detail;
    }

    // Apply brightness
    gray = Math.max(0, Math.min(255, gray + settings.brightness));
    
    // Apply midtones
    gray = Math.pow(gray / 255, settings.midtones) * 255;

    data[i] = data[i + 1] = data[i + 2] = gray;
  }
};

export const applyDither = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, settings: DitherSettings) => {
  const { width, height } = ctx.canvas;

  // Clear the canvas
  ctx.clearRect(0, 0, width, height);
  
  // Calculate scaled dimensions for pixelation
  const scaledWidth = Math.floor(width / settings.pixelationScale);
  const scaledHeight = Math.floor(height / settings.pixelationScale);

  // Create a temporary canvas for the intermediate step
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = scaledWidth;
  tempCanvas.height = scaledHeight;
  const tempCtx = tempCanvas.getContext('2d')!;
  
  // Draw scaled down on temp canvas
  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
  
  // Draw from temp canvas to main canvas with crisp pixels
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, width, height);
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Preprocess image (grayscale, brightness, etc.)
  preprocessImage(data, settings);

  // Apply selected dithering algorithm with dithering scale
  switch (settings.style) {
    case 'Floyd-Steinberg':
      applyFloydSteinberg(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Jarvis-Judice-Ninke':
      applyJarvisJudiceNinke(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Sierra-Lite':
      applySierraLite(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Two-Row-Sierra':
      applyTwoRowSierra(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Stevenson-Arce':
      applyStevensonArce(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Ostromukhov':
      applyOstromukhov(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Gaussian':
      applyGaussian(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Atkinson':
      applyAtkinson(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Bayer':
      applyBayer(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Ordered':
      applyOrdered(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Random':
      applyRandom(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Burkes':
      applyBurkes(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Sierra':
      applySierra(data, width, height, settings.noise, settings.ditheringScale);
      break;
    case 'Halftone':
      applyHalftone(data, width, height, settings.noise, settings.ditheringScale);
      break;
  }

  // Apply the dithered image
  ctx.putImageData(imageData, 0, 0);

  // Apply glow effect if enabled
  if (settings.glow > 0) {
    ctx.filter = `blur(${settings.glow / 10}px)`;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';
  }
}; 