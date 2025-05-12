import { DitherSettings, ImageSettings } from '../../../../types';

export const applyModulatedDiffuseY = (
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

  // 1. FM modulation/demodulation for all rows, collect all demodulated values
  const allDemodulated: number[] = [];
  const demodulatedRows: Float32Array[] = [];
  for (let y = 0; y < height; y++) {
    const signal = new Float32Array(width);
    for (let x = 0; x < width; x++) {
      signal[x] = original[(y * width + x) * 4] / 255.0;
    }
    const omega = 2 * Math.PI * (frequency / ditheringScale);
    let sigInt = 0;
    const modulated = new Float32Array(width);
    for (let x = 0; x < width; x++) {
      sigInt += signal[x] * amplitude;
      modulated[x] = Math.cos(omega * x + sigInt + phase);
    }
    const demodulated = new Float32Array(width);
    for (let x = 1; x < width; x++) {
      demodulated[x] = Math.abs(modulated[x] - modulated[x - 1]);
      allDemodulated.push(demodulated[x]);
    }
    demodulatedRows.push(demodulated);
  }

  // 2. Find global min and max
  let globalMin = Infinity, globalMax = -Infinity;
  for (let i = 0; i < allDemodulated.length; i++) {
    if (allDemodulated[i] < globalMin) globalMin = allDemodulated[i];
    if (allDemodulated[i] > globalMax) globalMax = allDemodulated[i];
  }
  const epsilon = 1e-6;

  // 3. Write back to image using global normalization
  for (let y = 0; y < height; y++) {
    const demodulated = demodulatedRows[y];
    for (let x = 0; x < width; x++) {
      const v = ((demodulated[x] - globalMin) / (globalMax - globalMin + epsilon)) * 255;
      const bw = v > 128 ? 255 : 0;
      for (let dx = -Math.floor(blockSize / 2); dx <= Math.floor(blockSize / 2); dx++) {
        const drawX = x + dx;
        if (drawX >= 0 && drawX < width) {
          const i = (y * width + drawX) * 4;
          data[i] = data[i + 1] = data[i + 2] = bw;
          data[i + 3] = 255;
        }
      }
    }
  }
};
