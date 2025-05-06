// 8x8 Bayer matrix for ordered dithering
const BAYER_MATRIX = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21]
];

export const applyBayerOrdered = (data: Uint8ClampedArray, width: number, height: number, noise: number = 0): void => {
  // Create a copy of the original data to avoid modifying it during processing
  const originalData = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      
      // Get the grayscale value from the original data
      const gray = (originalData[i] * 0.299 + originalData[i + 1] * 0.587 + originalData[i + 2] * 0.114);
      
      // Get the threshold from the Bayer matrix
      const threshold = (BAYER_MATRIX[y % 8][x % 8] / 64) * 255;
      
      // Add noise if specified
      const noiseValue = noise > 0 ? (Math.random() - 0.5) * noise * 255 : 0;
      
      // Apply threshold with noise
      const newColor = (gray + noiseValue) < threshold ? 0 : 255;
      
      // Set the new color
      data[i] = newColor;     // R
      data[i + 1] = newColor; // G
      data[i + 2] = newColor; // B
      data[i + 3] = 255;      // A
    }
  }
}; 