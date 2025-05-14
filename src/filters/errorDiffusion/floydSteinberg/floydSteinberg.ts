import { DitherSettings, ImageSettings } from '../../../types';

export const applyFloydSteinberg = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0 } = settings;
  const scale = 1;

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
      
      // Distribute error in Floyd-Steinberg pattern
      if (x + 1 < width) {
        data[idx + 4] += error * 7/16; // right
      }
      
      if (y + 1 < height) {
        if (x - 1 >= 0) {
          data[idx + width * 4 - 4] += error * 3/16; // bottom left
        }
        data[idx + width * 4] += error * 5/16; // bottom
        if (x + 1 < width) {
          data[idx + width * 4 + 4] += error * 1/16; // bottom right
        }
      }
    }
  }
}; 