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
