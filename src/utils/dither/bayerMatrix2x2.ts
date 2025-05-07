import { DitherSettings, ImageSettings } from '../../types';

// 2x2 Bayer matrix
const bayer2x2 = [
  [0, 2],
  [3, 1],
];

export const applyBayerMatrix2x2 = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0 } = settings;
  const matrixSize = 2;
  const matrixScale = 4; // 2x2 matrix has values 0-3

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx]; // Use red channel (assume grayscale input)
      // Add noise
      if (noise > 0) {
        gray += (Math.random() - 0.5) * noise;
      }
      // Get threshold from Bayer matrix
      const threshold = (bayer2x2[y % matrixSize][x % matrixSize] + 0.5) * (255 / matrixScale);
      const value = gray > threshold ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = value;
      data[idx + 3] = 255;
    }
  }
};
