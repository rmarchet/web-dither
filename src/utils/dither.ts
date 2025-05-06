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
  applyHalftone,
  applyStucki
} from './dither/index';

const scaleDitheredImage = (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
  // Create a temporary canvas at reduced size
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = Math.floor(width / scale);
  tempCanvas.height = Math.floor(height / scale);
  const tempCtx = tempCanvas.getContext('2d')!;
  
  // Draw the original image scaled down
  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(ctx.canvas, 0, 0, tempCanvas.width, tempCanvas.height);
  
  // Get the scaled down image data
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = imageData.data;
  
  // Return the scaled down context and dimensions
  return { tempCtx, scaledWidth: tempCanvas.width, scaledHeight: tempCanvas.height, imageData, data };
};

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

  // If dithering scale is greater than 1, scale down first
  if (settings.ditheringScale > 1) {
    const scaled = scaleDitheredImage(ctx, width, height, settings.ditheringScale);
    const { tempCtx: scaledCtx, scaledWidth: ditherWidth, scaledHeight: ditherHeight, imageData: scaledImageData, data: scaledData } = scaled;
    
    // Preprocess the scaled down image
    preprocessImage(scaledData, settings);
    
    // Apply selected dithering algorithm to scaled down image
    switch (settings.style) {
      case 'Floyd-Steinberg':
        applyFloydSteinberg(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Jarvis-Judice-Ninke':
        applyJarvisJudiceNinke(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Sierra-Lite':
        applySierraLite(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Two-Row-Sierra':
        applyTwoRowSierra(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Stevenson-Arce':
        applyStevensonArce(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Ostromukhov':
        applyOstromukhov(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Gaussian':
        applyGaussian(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Atkinson':
        applyAtkinson(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Bayer':
        applyBayer(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Ordered':
        applyOrdered(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Random':
        applyRandom(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Burkes':
        applyBurkes(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Sierra':
        applySierra(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Halftone':
        applyHalftone(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
      case 'Stucki':
        applyStucki(scaledData, ditherWidth, ditherHeight, settings.noise);
        break;
    }
    
    // Put the scaled down dithered image back to the scaled canvas
    scaledCtx.putImageData(scaledImageData, 0, 0);
    
    // Draw the scaled up result back to the main canvas
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(scaledCtx.canvas, 0, 0, width, height);
  } else {
    // Preprocess the full resolution image
    preprocessImage(data, settings);
    
    // Apply dithering at full resolution
    switch (settings.style) {
      case 'Floyd-Steinberg':
        applyFloydSteinberg(data, width, height, settings.noise);
        break;
      case 'Jarvis-Judice-Ninke':
        applyJarvisJudiceNinke(data, width, height, settings.noise);
        break;
      case 'Sierra-Lite':
        applySierraLite(data, width, height, settings.noise);
        break;
      case 'Two-Row-Sierra':
        applyTwoRowSierra(data, width, height, settings.noise);
        break;
      case 'Stevenson-Arce':
        applyStevensonArce(data, width, height, settings.noise);
        break;
      case 'Ostromukhov':
        applyOstromukhov(data, width, height, settings.noise);
        break;
      case 'Gaussian':
        applyGaussian(data, width, height, settings.noise);
        break;
      case 'Atkinson':
        applyAtkinson(data, width, height, settings.noise);
        break;
      case 'Bayer':
        applyBayer(data, width, height, settings.noise);
        break;
      case 'Ordered':
        applyOrdered(data, width, height, settings.noise);
        break;
      case 'Random':
        applyRandom(data, width, height, settings.noise);
        break;
      case 'Burkes':
        applyBurkes(data, width, height, settings.noise);
        break;
      case 'Sierra':
        applySierra(data, width, height, settings.noise);
        break;
      case 'Halftone':
        applyHalftone(data, width, height, settings.noise);
        break;
      case 'Stucki':
        applyStucki(data, width, height, settings.noise);
        break;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Apply glow effect if enabled
  if (settings.glow > 0) {
    ctx.filter = `blur(${settings.glow / 10}px)`;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';
  }
}; 