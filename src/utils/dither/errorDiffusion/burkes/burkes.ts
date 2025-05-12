import { DitherSettings, ImageSettings } from '../../../../types';

export const applyBurkes = (image: ImageSettings, settings: DitherSettings) => {
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
      
      // Distribute error with scaling
      const scaledX = Math.floor(x / scale);
      const scaledY = Math.floor(y / scale);
      
      if (x < width - 1) {
        data[idx + 4] += error * 8/32; // right
      }
      if (x < width - 2) {
        data[idx + 8] += error * 4/32; // right x2
      }
      if (y < height - 1) {
        if (x > 1) {
          data[idx + width * 4 - 8] += error * 2/32; // bottom left x2
        }
        if (x > 0) {
          data[idx + width * 4 - 4] += error * 4/32; // bottom left
        }
        data[idx + width * 4] += error * 8/32; // bottom
        if (x < width - 1) {
          data[idx + width * 4 + 4] += error * 4/32; // bottom right
        }
        if (x < width - 2) {
          data[idx + width * 4 + 8] += error * 2/32; // bottom right x2
        }
      }
    }
  }
}; 