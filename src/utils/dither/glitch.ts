// Glitch dither: horizontal sine-wave displacement of a dithered image
export const applyGlitch = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  amplitude: number = 10,
  frequency: number = 0.05
) => {
  for (let y = 0; y < height; y++) {
    // Calculate horizontal glitch offset for this row
    const dx = Math.round(amplitude * Math.sin(frequency * y));
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx]; // Only use red channel for error diffusion
      const newColor = gray < 128 ? 0 : 255;
      // Set all channels to monochrome value
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
      const error = gray - newColor;
      // Distribute error in a glitched Floyd-Steinberg pattern (red channel only)
      const distribute = (offsetIdx: number, factor: number) => {
        if (offsetIdx >= 0 && offsetIdx < width * height * 4) {
          data[offsetIdx] = Math.max(0, Math.min(255, data[offsetIdx] + error * factor));
        }
      };
      // Right neighbor (glitched)
      const xr = x + 1 + dx;
      if (xr >= 0 && xr < width) {
        distribute((y * width + xr) * 4, 7/16);
      }
      // Bottom neighbors (glitched)
      if (y + 1 < height) {
        // Bottom left
        const xbl = x - 1 + dx;
        if (xbl >= 0 && xbl < width) {
          distribute(((y + 1) * width + xbl) * 4, 3/16);
        }
        // Bottom
        const xb = x + dx;
        if (xb >= 0 && xb < width) {
          distribute(((y + 1) * width + xb) * 4, 5/16);
        }
        // Bottom right
        const xbr = x + 1 + dx;
        if (xbr >= 0 && xbr < width) {
          distribute(((y + 1) * width + xbr) * 4, 1/16);
        }
      }
    }
  }
  // After error diffusion, ensure all channels are strictly 0 or 255
  for (let i = 0; i < data.length; i += 4) {
    const v = data[i] < 128 ? 0 : 255;
    data[i] = data[i + 1] = data[i + 2] = v;
  }
}; 