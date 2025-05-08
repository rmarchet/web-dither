import { DitherSettings, ImageSettings } from '../../types';

export const applyModulatedDiffuseX = (
  image: ImageSettings,
  settings: DitherSettings
) => {
  const { data, width, height } = image;
  const {
    amplitude = 1.0, // FM amplitude
    frequency = 0.08, // FM frequency
    phase = 0,
    ditheringScale = 1,
    blockSize = 1,
  } = settings;

  // Copy original image data for reference
  const original = new Uint8ClampedArray(data);

  // Set all pixels to black
  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i + 1] = data[i + 2] = 0;
    data[i + 3] = 255;
  }

  // 1. FM modulation/demodulation for all columns, collect all demodulated values
  const allDemodulated: number[] = [];
  const demodulatedCols: Float32Array[] = [];
  for (let x = 0; x < width; x++) {
    const signal = new Float32Array(height);
    for (let y = 0; y < height; y++) {
      signal[y] = original[(y * width + x) * 4] / 255.0;
    }
    const omega = 2 * Math.PI * (frequency / ditheringScale);
    let sigInt = 0;
    const modulated = new Float32Array(height);
    for (let y = 0; y < height; y++) {
      sigInt += signal[y] * amplitude;
      modulated[y] = Math.cos(omega * y + sigInt + phase);
    }
    const demodulated = new Float32Array(height);
    for (let y = 1; y < height; y++) {
      demodulated[y] = Math.abs(modulated[y] - modulated[y - 1]);
      allDemodulated.push(demodulated[y]);
    }
    demodulatedCols.push(demodulated);
  }

  // 2. Find global min and max
  let globalMin = Infinity, globalMax = -Infinity;
  for (let i = 0; i < allDemodulated.length; i++) {
    if (allDemodulated[i] < globalMin) globalMin = allDemodulated[i];
    if (allDemodulated[i] > globalMax) globalMax = allDemodulated[i];
  }
  const epsilon = 1e-6;

  // 3. Write back to image using global normalization
  for (let x = 0; x < width; x++) {
    const demodulated = demodulatedCols[x];
    for (let y = 0; y < height; y++) {
      const v = ((demodulated[y] - globalMin) / (globalMax - globalMin + epsilon)) * 255;
      const bw = v > 128 ? 255 : 0;
      for (let dy = -Math.floor(blockSize / 2); dy <= Math.floor(blockSize / 2); dy++) {
        const drawY = y + dy;
        if (drawY >= 0 && drawY < height) {
          const i = (drawY * width + x) * 4;
          data[i] = data[i + 1] = data[i + 2] = bw;
          data[i + 3] = 255;
        }
      }
    }
  }
};
