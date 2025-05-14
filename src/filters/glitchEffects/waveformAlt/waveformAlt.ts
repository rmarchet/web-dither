import { DitherSettings, ImageSettings } from '../../../types';

export const applyWaveformAlt = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { amplitude = 1, frequency = 0.08, phase = 0, noise = 0 } = settings;

  // Map noise (0-50) to bandHeight (0.25*height to 1*height)
  const minBand = 0.25;
  const maxBand = 1.0;
  const bandFraction = minBand + (maxBand - minBand) * (noise / 50);
  const bandHeight = Math.floor(height * bandFraction);
  const bandCenter = Math.floor(height * (0.55 + 0.3 * Math.sin(phase)));
  const bandStart = bandCenter - Math.floor(bandHeight / 2);
  const bandEnd = bandStart + bandHeight;

  // Helper for smooth feathering
  function smoothstep(edge0: number, edge1: number, x: number) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  // Copy original data to avoid overwriting source pixels
  const original = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    // Feathering: 0 outside band, 1 in center, smooth at edges
    let feather = 0;
    if (y >= bandStart && y <= bandEnd) {
      feather = smoothstep(bandStart, bandStart + bandHeight * 0.15, y) *
                (1 - smoothstep(bandEnd - bandHeight * 0.15, bandEnd, y));
    }
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (feather > 0) {
        // Sine wave displacement, feathered
        const displacement = feather * (amplitude * 40) * Math.sin(frequency * y + phase);
        const sourceX = Math.max(0, Math.min(width - 1, x + displacement));
        const x0 = Math.floor(sourceX);
        const x1 = Math.min(x0 + 1, width - 1);
        const t = sourceX - x0;
        const srcIdx0 = (y * width + x0) * 4;
        const srcIdx1 = (y * width + x1) * 4;
        for (let c = 0; c < 3; c++) {
          data[idx + c] = (1 - t) * original[srcIdx0 + c] + t * original[srcIdx1 + c];
        }
        data[idx + 3] = 255;
      } else {
        // Copy original pixel
        data[idx] = original[idx];
        data[idx + 1] = original[idx + 1];
        data[idx + 2] = original[idx + 2];
        data[idx + 3] = original[idx + 3];
      }
    }
  }
};