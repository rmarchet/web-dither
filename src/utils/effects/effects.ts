export const clamp = (val: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, val));
}

// Draw a colored line of given width using Bresenham's algorithm
export const drawLine =(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: [number, number, number],
  lineWidth: number = 1
) => {
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

export const applyVignette = (x: number, y: number, width: number, height: number, vignetteStrength: number) => {
  const cx = width / 2, cy = height / 2;
  const dx = (x - cx) / cx;
  const dy = (y - cy) / cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return 1.0 - vignetteStrength * Math.pow(dist, 2.5);
}

export const applyBarrelDistortion = (x: number, y: number, width: number, height: number, barrelStrength: number, glitch: number): [number, number] => {
  const cx = width / 2, cy = height / 2;
  const nx = (x - cx) / cx;
  const ny = (y - cy) / cy;
  const r = Math.sqrt(nx * nx + ny * ny);
  const theta = Math.atan2(ny, nx);
  const rn = r + barrelStrength * Math.pow(r, 3);
  const sx = cx + rn * cx * Math.cos(theta) + glitch;
  const sy = cy + rn * cy * Math.sin(theta);
  return [sx, sy];
}

// --- YIQ conversion ---
export const rgb2yiq = (r: number, g: number, b: number): [number, number, number] => {
  // Scale input to 0-1 range
  r = r / 255;
  g = g / 255;
  b = b / 255;
  
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const i = 0.596 * r - 0.274 * g - 0.322 * b;
  const q = 0.211 * r - 0.523 * g + 0.312 * b;
  
  // Scale output to match Processing's range
  return [y * 256, i * 256, q * 256];
}

export const yiq2rgb = (y: number, i: number, q: number): [number, number, number] => {
  // Scale input from Processing's range to 0-1
  y = y / 256;
  i = i / 256;
  q = q / 256;
  
  let r = y + 0.956 * i + 0.621 * q;
  let g = y - 0.272 * i - 0.647 * q;
  let b = y - 1.106 * i + 1.703 * q;
  
  // Scale back to 0-255 and clamp
  r = Math.max(0, Math.min(255, r * 255));
  g = Math.max(0, Math.min(255, g * 255));
  b = Math.max(0, Math.min(255, b * 255));
  
  return [r, g, b];
}


// Helper: RGB to HSB
export const rgb2hsb = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) h = 0;
  else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 255, s * 255, v * 255];
}

// Helper: HSB to RGB
export const hsb2rgb = (h: number, s: number, v: number): [number, number, number] => {
  h /= 255; s /= 255; v /= 255;
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return [clamp(Math.round(r * 255), 0, 255), clamp(Math.round(g * 255), 0, 255), clamp(Math.round(b * 255), 0, 255)];
}

export const valueNoise = (x: number, seed: number = 0) => {
  const n = Math.sin(x * 12.9898 + seed * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

// Simple 1D box blur for smoothing
export const smoothLine = (line: number[], roughness: number): number[] => {
  const radius = Math.max(1, Math.round(roughness));
  const smoothed = new Array(line.length).fill(0);
  for (let i = 0; i < line.length; i++) {
    let sum = 0, count = 0;
    for (let k = -radius; k <= radius; k++) {
      const idx = i + k;
      if (idx >= 0 && idx < line.length) {
        sum += line[idx];
        count++;
      }
    }
    smoothed[i] = sum / count;
  }
  return smoothed;
}