import { DitherSettings, ImageSettings } from '../../types';

export const applyOrdered = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0, scale = 1 } = settings;

  // 8x8 ordered dithering matrix
  const orderedMatrix = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ];
  const matrixSize = 8;
  const threshold = 4;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      
      // Apply ordered dithering with scaling
      const scaledX = Math.floor(x / scale);
      const scaledY = Math.floor(y / scale);
      const thresholdValue = orderedMatrix[scaledY % matrixSize][scaledX % matrixSize] * threshold;
      
      const newColor = gray < thresholdValue ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
    }
  }
}; 