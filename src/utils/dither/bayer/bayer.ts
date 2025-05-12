import { DitherSettings, ImageSettings } from '../../types';

export const applyBayer = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0, scale = 1 } = settings;

  // 4x4 Bayer matrix
  const bayerMatrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];
  const matrixSize = 4;
  const threshold = 16;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      
      // Apply Bayer dithering with scaling
      const scaledX = Math.floor(x / scale);
      const scaledY = Math.floor(y / scale);
      const thresholdValue = bayerMatrix[scaledY % matrixSize][scaledX % matrixSize] * threshold;
      
      const newColor = gray < thresholdValue ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
    }
  }
}; 