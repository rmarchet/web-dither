import { ImageSettings, DitherSettings } from '../../../types';

export const applyAnaglyph = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const amplitude = settings.amplitude * 10;

  // Copy original data to avoid overwriting source pixels
  const original = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // Offset red channel to the left
      const redX = Math.max(0, x - Math.round(amplitude));
      const redIdx = (y * width + redX) * 4;
      // Offset green/blue channels to the right
      const cyanX = Math.min(width - 1, x + Math.round(amplitude));
      const cyanIdx = (y * width + cyanX) * 4;
      data[idx] = original[redIdx]; // Red
      data[idx + 1] = original[cyanIdx + 1]; // Green
      data[idx + 2] = original[cyanIdx + 2]; // Blue
      data[idx + 3] = 255;
    }
  }
};