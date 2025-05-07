import { DitherSettings, ImageSettings } from '../../types';

export const applyWaveform = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0, amplitude = 64, frequency = 0.08, phase = 0 } = settings;
  // For each row, modulate the threshold using a sine wave
  for (let y = 0; y < height; y++) {
    // Calculate the threshold for this row
    const threshold = 128 + amplitude * Math.sin(frequency * y + phase);
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx]; // Use red channel (assume grayscale input)
      // Add noise
      if (noise > 0) {
        gray += (Math.random() - 0.5) * noise;
      }
      const value = gray > threshold ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = value;
      data[idx + 3] = 255;
    }
  }
};
