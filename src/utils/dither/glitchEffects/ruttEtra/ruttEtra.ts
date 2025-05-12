import { ImageSettings, DitherSettings } from "../../../../types";
import { drawLine } from "../../../effects/effects";
const FREQUENCY_MULTIPLIER = 400;

export const applyRuttEtra = (image: ImageSettings, settings: DitherSettings) => {
  const { width, height, data } = image;
  const frequency = settings.frequency ?? 1;
  const amplitude = settings.amplitude ?? 1;
  const phase = settings.phase ?? 0;
  const noise = settings.noise ?? 0;
  const numLines = Math.max(10, Math.floor(frequency * FREQUENCY_MULTIPLIER));
  const lineSpacing = Math.floor(height / numLines);
  const scale = amplitude * 100;
  const phaseOffset = Math.round(phase * lineSpacing);
  const lineWidth = 1;

  // Create a black working buffer
  const out = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < out.length; i += 4) {
    out[i] = 0;
    out[i + 1] = 0;
    out[i + 2] = 0;
    out[i + 3] = 255;
  }

  // For each scanline
  for (let i = 0; i < numLines; i++) {
    const y = i * lineSpacing + phaseOffset;
    if (y >= height) break;
    // 1. Extract brightness and color for this row
    const line: number[] = [];
    const colors: [number, number, number][] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      line.push(brightness);
      colors.push([r, g, b]);
    }
    // 2. Normalize brightness (0 = black, 1 = white)
    const minB = Math.min(...line);
    const maxB = Math.max(...line);
    const norm = line.map(v => (v - minB) / (maxB - minB + 1e-6));
    // 3. Draw the modulated colored line
    let prevX = 0, prevY = Math.max(0, Math.min(height - 1, Math.round(y - norm[0] * scale + (Math.random() * 2 - 1) * noise)));
    let prevColor = colors[0];
    for (let x = 1; x < width; x++) {
      const noiseVal = (Math.random() * 2 - 1) * noise;
      const plotY = Math.max(0, Math.min(height - 1, Math.round(y - norm[x] * scale + noiseVal)));
      const color = colors[x];
      drawLine(out, width, height, prevX, prevY, x, plotY, color, lineWidth);
      prevX = x;
      prevY = plotY;
      prevColor = color;
    }
  }

  // Copy the result back to the original data array
  for (let i = 0; i < data.length; i++) {
    data[i] = out[i];
  }
};
