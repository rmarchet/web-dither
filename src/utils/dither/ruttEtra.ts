import { ImageSettings, DitherSettings } from "../../types";
const FREQUENCY_MULTIPLIER = 400;

// Draw a colored line of given width using Bresenham's algorithm
function drawLine(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: [number, number, number],
  lineWidth: number = 1
) {
  let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, e2;
  while (true) {
    for (let w = -Math.floor(lineWidth / 2); w <= Math.floor(lineWidth / 2); w++) {
      const px = x0, py = y0 + w;
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const idx = (py * width + px) * 4;
        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = 255;
      }
    }
    if (x0 === x1 && y0 === y1) break;
    e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

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
