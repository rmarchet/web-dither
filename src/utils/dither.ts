import { DitherSettings, ImageSettings } from '../types';
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
    
    // Reverse controls if invert is true
    let detail = settings.detailEnhancement / 50; // 0–2, higher = more contrast
    let brightness = settings.brightness;
    let midtones = settings.midtones;
    if (settings.invert) {
      brightness = -brightness;
      midtones = 1 / midtones;
    }

    // Apply detail enhancement
    if (detail !== 1) {
      const diff = gray - 128;
      gray = 128 + diff * detail;
    }

    // Apply brightness
    gray = Math.max(0, Math.min(255, gray + brightness));
    
    // Apply midtones
    gray = Math.pow(gray / 255, midtones) * 255;

    // Apply luminance threshold (binarize) only if set
    if (settings.luminanceThreshold >= 0) {
     // gray = gray < settings.luminanceThreshold ? 0 : 255;
    }

    // Invert if requested
    if (settings.invert) {
      gray = 255 - gray;
    }

    data[i] = data[i + 1] = data[i + 2] = gray;
  }
};

function runDither(image: ImageSettings, settings: DitherSettings) {
  const { data, width, height } = image;
  const { style, noise } = settings;
  switch (style) {
    case 'Floyd-Steinberg':
      dither.applyFloydSteinberg(image, settings);
      break;
    case 'Jarvis-Judice-Ninke':
      dither.applyJarvisJudiceNinke(image, settings);
      break;
    case 'Sierra-Lite':
      dither.applySierraLite(image, settings);
      break;
    case 'Two-Row-Sierra':
      dither.applyTwoRowSierra(image, settings);
      break;
    case 'Stevenson-Arce':
      dither.applyStevensonArce(image, settings);
      break;
    case 'Ostromukhov':
      dither.applyOstromukhov(image, settings);
      break;
    case 'Gaussian':
      dither.applyGaussian(image, settings);
      break;
    case 'Atkinson':
      dither.applyAtkinson(image, settings);
      break;
    case 'Atkinson-VHS':
      dither.applyAtkinsonVHS(image, settings);
      break;
    case 'Bayer':
      dither.applyBayer(image, settings);
      break;
    case 'Bayer-Ordered':
      dither.applyBayerOrdered(image, settings);
      break;
    case 'Bayer-Void':
      dither.applyBayerVoid(image, settings);
      break;
    case 'Ordered':
      dither.applyOrdered(image, settings);
      break;
    case 'Random':
      dither.applyRandom(image, settings);
      break;
    case 'Random-Ordered':
      dither.applyRandomOrdered(image, settings);
      break;
    case 'Burkes':
      dither.applyBurkes(image, settings);
      break;
    case 'Sierra':
      dither.applySierra(image, settings);
      break;
    case 'Halftone':
      dither.applyHalftone(image, settings);
      break;
    case 'Stucki':
      dither.applyStucki(image, settings);
      break;
    case 'Smooth Diffuse':
      dither.applySmoothDiffuse(image, settings);
      break;
    case 'Modulated Diffuse Y':
      dither.applyModulatedDiffuseY(image, settings);
      break;
    case 'Glitch':
      dither.applyGlitch(image, settings);
      break;
    case 'Lines Glitch':
      dither.applyLinesGlitch(image, settings);
      break;
    case 'Waveform':
      dither.applyWaveform(image, settings);
      break;
    case 'Bayer Matrix 2x2':
      dither.applyBayerMatrix2x2(image, settings);
      break;
    case 'Bayer Matrix 4x4':
      dither.applyBayerMatrix4x4(image, settings);
      break;
    case 'Mosaic':
      dither.applyMosaic(image, settings);
      break;
    case 'Bit Tone':
      dither.applyBitTone(image, settings);
      break;
    case 'Stuki Diffusion Lines':
      dither.applyStukiDiffusionLines(image, settings);
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
    runDither({ data: scaledData, width: ditherWidth, height: ditherHeight }, settings);
    scaledCtx.putImageData(scaledImageData, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(scaledCtx.canvas, 0, 0, width, height);
  } else {
    preprocessImage(data, settings);
    runDither({ data, width, height }, settings);
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