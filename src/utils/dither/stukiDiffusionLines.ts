import { DitherSettings, ImageSettings } from '../../types';

// Stucki error diffusion weights (horizontal and vertical only)
const weights = [
  { dx: 1, dy: 0, factor: 8 / 42 }, // right
  { dx: 2, dy: 0, factor: 4 / 42 }, // right 2
  { dx: -2, dy: 1, factor: 2 / 42 }, // next line, left 2
  { dx: -1, dy: 1, factor: 4 / 42 }, // next line, left 1
  { dx: 0, dy: 1, factor: 8 / 42 }, // next line, same x
  { dx: 1, dy: 1, factor: 4 / 42 }, // next line, right 1
  { dx: 2, dy: 1, factor: 2 / 42 }, // next line, right 2
];

export const applyStukiDiffusionLines = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0 } = settings;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      if (noise > 0) {
        gray += (Math.random() - 0.5) * noise;
      }
      const newColor = gray < 128 ? 0 : 255;
      const error = gray - newColor;
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
      data[idx + 3] = 255;
      // Diffuse error horizontally and to the next line
      for (const w of weights) {
        const nx = x + w.dx;
        const ny = y + w.dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nidx = (ny * width + nx) * 4;
          data[nidx] += error * w.factor;
        }
      }
    }
  }
};
