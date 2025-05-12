import { DitherSettings, ImageSettings } from '../../../../types';

export const applyStucki = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0, scale = 1 } = settings;

  for (let y = 0; y < height; y += scale) {
    for (let x = 0; x < width; x += scale) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      
      // Apply threshold
      const newColor = gray < 128 ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
      
      // Calculate error
      const error = gray - newColor;
      
      // Distribute error using Stucki matrix
      // First row
      if (x < width - scale) {
        data[idx + scale * 4] += error * 8/42;
      }
      if (x < width - scale * 2) {
        data[idx + scale * 8] += error * 4/42;
      }
      
      // Second row
      if (y < height - scale) {
        const nextRow = idx + width * scale * 4;
        if (x > 0) {
          data[nextRow - scale * 4] += error * 2/42;
        }
        if (x < width - scale) {
          data[nextRow + scale * 4] += error * 4/42;
        }
        if (x < width - scale * 2) {
          data[nextRow + scale * 8] += error * 2/42;
        }
        data[nextRow] += error * 8/42;
        if (x < width - scale) {
          data[nextRow + scale * 4] += error * 4/42;
        }
      }
      
      // Third row
      if (y < height - scale * 2) {
        const nextNextRow = idx + width * scale * 8;
        if (x > 0) {
          data[nextNextRow - scale * 4] += error * 1/42;
        }
        if (x < width - scale) {
          data[nextNextRow + scale * 4] += error * 2/42;
        }
        if (x < width - scale * 2) {
          data[nextNextRow + scale * 8] += error * 1/42;
        }
        data[nextNextRow] += error * 4/42;
        if (x < width - scale) {
          data[nextNextRow + scale * 4] += error * 2/42;
        }
      }
    }
  }
}; 