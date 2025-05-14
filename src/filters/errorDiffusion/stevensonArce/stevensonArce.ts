import { DitherSettings, ImageSettings } from '../../../types';

export const applyStevensonArce = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0 } = settings;

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
      
      // Distribute error
      if (x < width - 1) {
        data[idx + 4] += error * 32/200; // right
      }
      if (x < width - 2) {
        data[idx + 8] += error * 12/200; // right x2
      }
      if (y < height - 1) {
        if (x > 1) {
          data[idx + width * 4 - 8] += error * 5/200; // bottom left x2
        }
        if (x > 0) {
          data[idx + width * 4 - 4] += error * 12/200; // bottom left
        }
        data[idx + width * 4] += error * 26/200; // bottom
        if (x < width - 1) {
          data[idx + width * 4 + 4] += error * 12/200; // bottom right
        }
        if (x < width - 2) {
          data[idx + width * 4 + 8] += error * 5/200; // bottom right x2
        }
      }
      if (y < height - 2) {
        if (x > 2) {
          data[idx + width * 8 - 12] += error * 5/200; // bottom left x3, y+2
        }
        if (x > 1) {
          data[idx + width * 8 - 8] += error * 12/200; // bottom left x2, y+2
        }
        if (x > 0) {
          data[idx + width * 8 - 4] += error * 12/200; // bottom left, y+2
        }
        data[idx + width * 8] += error * 26/200; // bottom, y+2
        if (x < width - 1) {
          data[idx + width * 8 + 4] += error * 12/200; // bottom right, y+2
        }
        if (x < width - 2) {
          data[idx + width * 8 + 8] += error * 12/200; // bottom right x2, y+2
        }
        if (x < width - 3) {
          data[idx + width * 8 + 12] += error * 5/200; // bottom right x3, y+2
        }
      }
    }
  }
}; 