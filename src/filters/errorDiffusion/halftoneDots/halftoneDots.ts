import { ImageSettings, DitherSettings } from "../../../types";

export const applyHalftoneDots = (imageSettings: ImageSettings, ditherSettings: DitherSettings) => {
  const { width, height, data } = imageSettings;
  
  const minRadius = 1;
  const maxRadius = 8;
  const cellSize = maxRadius * 2; // Distance between dot centers

  // Create a copy of the original data
  const original = new Uint8ClampedArray(data);

  // Fill image with white
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = 255;
  }

  // For each cell in the grid
  for (let cy = 0; cy < height; cy += cellSize) {
    for (let cx = 0; cx < width; cx += cellSize) {
      // Compute average brightness in the cell
      let sum = 0;
      let count = 0;
      for (let y = cy; y < Math.min(cy + cellSize, height); y++) {
        for (let x = cx; x < Math.min(cx + cellSize, width); x++) {
          const idx = (y * width + x) * 4;
          // Use luminosity formula for grayscale
          const gray = 0.299 * original[idx] + 0.587 * original[idx + 1] + 0.114 * original[idx + 2];
          sum += gray;
          count++;
        }
      }
      const avg = sum / count;
      // Map brightness to dot radius (darker = bigger dot)
      const radius = minRadius + (maxRadius - minRadius) * (1 - avg / 255);
      // Draw dot at cell center
      const centerX = cx + cellSize / 2;
      const centerY = cy + cellSize / 2;
      for (let y = cy; y < Math.min(cy + cellSize, height); y++) {
        for (let x = cx; x < Math.min(cx + cellSize, width); x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          if (dx * dx + dy * dy <= radius * radius) {
            const idx = (y * width + x) * 4;
            data[idx] = 0;
            data[idx + 1] = 0;
            data[idx + 2] = 0;
            data[idx + 3] = 255;
          }
        }
      }
    }
  }
};
