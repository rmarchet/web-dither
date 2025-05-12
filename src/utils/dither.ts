import { DitherSettings, ImageSettings } from '../types';
import { scaleDitheredImage } from './scaleDitheredImage';
import { preprocessImage } from './preprocessImage';
import * as dither from './dither/index';

function runDither(image: ImageSettings, settings: DitherSettings) {
  const { data, width, height } = image;
  const { style, noise } = settings;
  switch (style) {
    case 'Floyd-Steinberg':
      dither.floydSteinberg.apply(image, settings);
      break;
    case 'Jarvis-Judice-Ninke':
      dither.jarvisJudiceNinke.apply(image, settings);
      break;
    case 'Sierra-Lite':
      dither.sierraLite.apply(image, settings);
      break;
    case 'Two-Row-Sierra':
      dither.twoRowSierra.apply(image, settings);
      break;
    case 'Stevenson-Arce':
      dither.stevensonArce.apply(image, settings);
      break;
    case 'Ostromukhov':
      dither.ostromukhov.apply(image, settings);
      break;
    case 'Gaussian':
      dither.gaussian.apply(image, settings);
      break;
    case 'Atkinson':
      dither.atkinson.apply(image, settings);
      break;
    case 'Atkinson-VHS':
      dither.applyAtkinsonVHS(image, settings);
      break;
    case 'Bayer':
      dither.bayer.apply(image, settings);
      break;
    case 'Bayer-Ordered':
      dither.bayerOrdered.apply(image, settings);
      break;
    case 'Bayer-Void':
      dither.applyBayerVoid(image, settings);
      break;
    case 'Ordered':
      dither.ordered.apply(image, settings);
      break;
    case 'Random':
      dither.random.apply(image, settings);
      break;
    case 'Random-Ordered':
      dither.applyRandomOrdered(image, settings);
      break;
    case 'Burkes':
      dither.burkes.apply(image, settings);
      break;
    case 'Sierra':
      dither.sierra.apply(image, settings);
      break;
    case 'Halftone':
      dither.halftone.apply(image, settings);
      break;
    case 'Stucki':
      dither.stucki.apply(image, settings);
      break;
    case 'Smooth Diffuse':
      dither.applySmoothDiffuse(image, settings);
      break;
    case 'Modulated Diffuse Y':
      dither.applyModulatedDiffuseY(image, settings);
      break;
    case 'Modulated Diffuse X':
      dither.applyModulatedDiffuseX(image, settings);
      break;
    case 'Composite Video':
      dither.applyCompositeVideo(image, settings);
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
      dither.bayerMatrix2x2.apply(image, settings);
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
    case 'Fractalify':
      dither.applyFractalify(image, settings);
      break;
    case 'LZ77':
      dither.applyLZ77(image, settings);
      break;
    case 'Joy Plot':
      dither.applyJoyPlot(image, settings);
      break;
    case 'Rutt-Etra':
      dither.applyRuttEtra(image, settings);
      break;
    case 'CRT':
      dither.applyCrt(image, settings);
      break;
  }
}

export const applyDither = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  settings: DitherSettings,
) => {
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
    preprocessImage({ data: scaledData, width: ditherWidth, height: ditherHeight }, settings);
    runDither({ data: scaledData, width: ditherWidth, height: ditherHeight }, settings);
    scaledCtx.putImageData(scaledImageData, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(scaledCtx.canvas, 0, 0, width, height);
  } else {
    preprocessImage({ data, width, height }, settings);
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