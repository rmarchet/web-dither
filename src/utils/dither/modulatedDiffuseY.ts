import { DitherSettings, ImageSettings } from '../../types';

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

  // FM modulation/demodulation per row
  for (let y = 0; y < height; y++) {
    // 1. Get the grayscale signal for this row
    const signal = new Float32Array(width);
    for (let x = 0; x < width; x++) {
      signal[x] = original[(y * width + x) * 4] / 255.0; // normalize to 0..1
    }

    // 2. FM modulation
    const omega = 2 * Math.PI * (frequency / ditheringScale);
    let sigInt = 0;
    let prevM = 0;
    const modulated = new Float32Array(width);
    for (let x = 0; x < width; x++) {
      sigInt += signal[x] * amplitude;
      modulated[x] = Math.cos(omega * x + sigInt + phase);
    }

    // 3. Demodulation (derivative)
    const demodulated = new Float32Array(width);
    for (let x = 1; x < width; x++) {
      demodulated[x] = Math.abs(modulated[x] - modulated[x - 1]);
    }

    // 4. Normalize and write back to image
    let min = Infinity, max = -Infinity;
    for (let x = 0; x < width; x++) {
      if (demodulated[x] < min) min = demodulated[x];
      if (demodulated[x] > max) max = demodulated[x];
    }
    for (let x = 0; x < width; x++) {
      const v = ((demodulated[x] - min) / (max - min)) * 255;
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
