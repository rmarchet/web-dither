import { DitherSettings, ImageSettings } from '../../types';

export const applyHalftone = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0 } = settings;
  const scale = 1;

  // 2x2 halftone pattern
  const halftoneMatrix = [
    [0, 2],
    [3, 1]
  ];
  const matrixSize = 2;
  const threshold = 64;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      
      // Apply halftone dithering with scaling
      const scaledX = Math.floor(x / scale);
      const scaledY = Math.floor(y / scale);
      const thresholdValue = halftoneMatrix[scaledY % matrixSize][scaledX % matrixSize] * threshold;
      
      const newColor = gray < thresholdValue ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
    }
  }
}; 