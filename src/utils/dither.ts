import { DitherSettings } from '../types';

export const applyFloydSteinberg = (data: Uint8ClampedArray, width: number, height: number, noise: number) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      
      // Apply threshold
      const newColor = gray < 128 ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
      
      // Calculate error
      const error = gray - newColor;
      
      // Distribute error (only if not at edges)
      if (x < width - 1) {
        data[idx + 4] += error * 7/16; // right
      }
      if (y < height - 1) {
        if (x > 0) {
          data[idx + width * 4 - 4] += error * 3/16; // bottom left
        }
        data[idx + width * 4] += error * 5/16; // bottom
        if (x < width - 1) {
          data[idx + width * 4 + 4] += error * 1/16; // bottom right
        }
      }
    }
  }
};

export const applyAtkinson = (data: Uint8ClampedArray, width: number, height: number, noise: number) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      
      // Apply threshold
      const newColor = gray < 128 ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
      
      // Calculate error
      const error = (gray - newColor) / 8;
      
      // Distribute error in Atkinson pattern
      const offsets = [
        4,              // right
        8,              // right x2
        width * 4 - 4,  // bottom left
        width * 4,      // bottom
        width * 4 + 4,  // bottom right
        width * 8       // bottom x2
      ];
      
      offsets.forEach(offset => {
        const newIdx = idx + offset;
        if (newIdx < data.length) {
          data[newIdx] += error;
          data[newIdx + 1] += error;
          data[newIdx + 2] += error;
        }
      });
    }
  }
};

export const applyBayer = (data: Uint8ClampedArray, width: number, height: number, noise: number) => {
  // 4x4 Bayer matrix
  const bayerMatrix = [
    [ 0, 8, 2, 10],
    [12, 4, 14, 6],
    [ 3, 11, 1, 9],
    [15, 7, 13, 5]
  ];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      
      // Apply Bayer threshold
      const threshold = (bayerMatrix[y % 4][x % 4] / 16) * 255;
      const newColor = gray < threshold ? 0 : 255;
      
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
    }
  }
};

export const applyOrdered = (data: Uint8ClampedArray, width: number, height: number, noise: number) => {
  // 8x8 ordered dithering matrix
  const matrix = [
    [ 0, 48, 12, 60,  3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [ 8, 56,  4, 52, 11, 59,  7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [ 2, 50, 14, 62,  1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58,  6, 54,  9, 57,  5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      
      // Apply ordered dithering
      const threshold = (matrix[y % 8][x % 8] / 64) * 255;
      const newColor = gray < threshold ? 0 : 255;
      
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
    }
  }
};

export const applyRandom = (data: Uint8ClampedArray, width: number, height: number, noise: number) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add extra noise for random dithering
      gray += (Math.random() - 0.5) * (noise * 2 + 50);
      
      // Apply threshold
      const newColor = gray < 128 ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
    }
  }
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

  // Preprocess image (grayscale, brightness, etc.)
  preprocessImage(data, settings);

  // Apply selected dithering algorithm
  switch (settings.style) {
    case 'Floyd-Steinberg':
      applyFloydSteinberg(data, width, height, settings.noise);
      break;
    case 'Ordered':
      applyOrdered(data, width, height, settings.noise);
      break;
    case 'Atkinson':
      applyAtkinson(data, width, height, settings.noise);
      break;
    case 'Bayer':
      applyBayer(data, width, height, settings.noise);
      break;
    case 'Random':
      applyRandom(data, width, height, settings.noise);
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