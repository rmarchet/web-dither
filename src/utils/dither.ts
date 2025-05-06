import { DitherSettings } from '../types';
import * as dither from './dither/index';

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

function runDither(style: string, data: Uint8ClampedArray, width: number, height: number, noise: number) {
  switch (style) {
    case 'Floyd-Steinberg':
      dither.applyFloydSteinberg(data, width, height, noise);
      break;
    case 'Jarvis-Judice-Ninke':
      dither.applyJarvisJudiceNinke(data, width, height, noise);
      break;
    case 'Sierra-Lite':
      dither.applySierraLite(data, width, height, noise);
      break;
    case 'Two-Row-Sierra':
      dither.applyTwoRowSierra(data, width, height, noise);
      break;
    case 'Stevenson-Arce':
      dither.applyStevensonArce(data, width, height, noise);
      break;
    case 'Ostromukhov':
      dither.applyOstromukhov(data, width, height, noise);
      break;
    case 'Gaussian':
      dither.applyGaussian(data, width, height, noise);
      break;
    case 'Atkinson':
      dither.applyAtkinson(data, width, height, noise);
      break;
    case 'Atkinson-VHS':
      dither.applyAtkinsonVHS(data, width, height, noise);
      break;
    case 'Bayer':
      dither.applyBayer(data, width, height, noise);
      break;
    case 'Bayer-Ordered':
      dither.applyBayerOrdered(data, width, height, noise);
      break;
    case 'Bayer-Void':
      dither.applyBayerVoid(data, width, height, noise);
      break;
    case 'Ordered':
      dither.applyOrdered(data, width, height, noise);
      break;
    case 'Random':
      dither.applyRandom(data, width, height, noise);
      break;
    case 'Random-Ordered':
      dither.applyRandomOrdered(data, width, height, noise);
      break;
    case 'Burkes':
      dither.applyBurkes(data, width, height, noise);
      break;
    case 'Sierra':
      dither.applySierra(data, width, height, noise);
      break;
    case 'Halftone':
      dither.applyHalftone(data, width, height, noise);
      break;
    case 'Stucki':
      dither.applyStucki(data, width, height, noise);
      break;
    case 'Smooth Diffuse':
      dither.applySmoothDiffuse(data, width, height, noise);
      break;
    case 'Modulated Diffuse Y':
      dither.applyModulatedDiffuseY(data, width, height, noise);
      break;
  }
}

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

  if (settings.ditheringScale > 1) {
    const scaled = scaleDitheredImage(ctx, width, height, settings.ditheringScale);
    const { tempCtx: scaledCtx, scaledWidth: ditherWidth, scaledHeight: ditherHeight, imageData: scaledImageData, data: scaledData } = scaled;
    preprocessImage(scaledData, settings);
    runDither(settings.style, scaledData, ditherWidth, ditherHeight, settings.noise);
    scaledCtx.putImageData(scaledImageData, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(scaledCtx.canvas, 0, 0, width, height);
  } else {
    preprocessImage(data, settings);
    runDither(settings.style, data, width, height, settings.noise);
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