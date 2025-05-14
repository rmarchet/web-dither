import { DitherSettings, ImageSettings } from '../../../types';

export const applyWaveform = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0, amplitude = 1, frequency = 0.08, phase = 0 } = settings;
  // For each pixel, modulate the displacement using a 2D sine wave
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 2D sine wave for smooth displacement
      const randomDisplacement = (Math.random() - 0.5) * (noise || 1) * 2; // scale as needed
      const displacement = (amplitude * 40) * Math.sin(
         frequency * y + phase + frequency * x
      );
      const idx = (y * width + x) * 4;
      
      // Use floating point source position for smooth interpolation
      const sourceX = x + displacement + randomDisplacement;
      const x0 = Math.floor(sourceX);
      const x1 = Math.min(x0 + 1, width - 1);
      const t = sourceX - x0;
      const srcIdx0 = (y * width + Math.max(0, x0)) * 4;
      const srcIdx1 = (y * width + x1) * 4;
      
      // Linear interpolation for each channel
      for (let c = 0; c < 3; c++) {
        let value = (1 - t) * data[srcIdx0 + c] + t * data[srcIdx1 + c];
        // Add noise if enabled
        if (noise > 0) {
          value += (Math.random() - 0.5) * noise * 0.5;
        }
        data[idx + c] = value;
      }
      // Keep alpha at full
      data[idx + 3] = 255;
    }
  }
};
