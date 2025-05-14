import { DitherSettings, ImageSettings } from '../../../types';

// 4x4 Bayer matrix
const bayer4x4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
];

export const applyBayerMatrix4x4 = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0 } = settings;
  const matrixSize = 4;
  const matrixScale = 16; // 4x4 matrix has values 0-15

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx]; // Use red channel (assume grayscale input)
      // Add noise
      if (noise > 0) {
        gray += (Math.random() - 0.5) * noise;
      }
      // Get threshold from Bayer matrix
      const threshold = (bayer4x4[y % matrixSize][x % matrixSize] + 0.5) * (255 / matrixScale);
      const value = gray > threshold ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = value;
      data[idx + 3] = 255;
    }
  }
};
