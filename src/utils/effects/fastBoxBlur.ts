export const fastBoxBlur = (data: Uint8ClampedArray, width: number, height: number, radius: number) => {
  if (radius < 1) return;
  const copy = new Uint8ClampedArray(data);

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    let sum = [0, 0, 0], count = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (x === 0) {
        // Initialize sum for the first pixel in the row
        sum = [0, 0, 0]; count = 0;
        for (let k = -radius; k <= radius; k++) {
          const nx = x + k;
          if (nx >= 0 && nx < width) {
            for (let c = 0; c < 3; c++) {
              sum[c] += copy[(y * width + nx) * 4 + c];
            }
            count++;
          }
        }
      } else {
        // Slide window: remove leftmost, add rightmost
        const prev = x - radius - 1;
        const next = x + radius;
        if (prev >= 0) {
          for (let c = 0; c < 3; c++) {
            sum[c] -= copy[(y * width + prev) * 4 + c];
          }
          count--;
        }
        if (next < width) {
          for (let c = 0; c < 3; c++) {
            sum[c] += copy[(y * width + next) * 4 + c];
          }
          count++;
        }
      }
      for (let c = 0; c < 3; c++) {
        data[idx + c] = sum[c] / count;
      }
      // Alpha channel remains unchanged
    }
  }

  // Vertical pass
  copy.set(data);
  for (let x = 0; x < width; x++) {
    let sum = [0, 0, 0], count = 0;
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4;
      if (y === 0) {
        sum = [0, 0, 0]; count = 0;
        for (let k = -radius; k <= radius; k++) {
          const ny = y + k;
          if (ny >= 0 && ny < height) {
            for (let c = 0; c < 3; c++) {
              sum[c] += copy[(ny * width + x) * 4 + c];
            }
            count++;
          }
        }
      } else {
        const prev = y - radius - 1;
        const next = y + radius;
        if (prev >= 0) {
          for (let c = 0; c < 3; c++) {
            sum[c] -= copy[(prev * width + x) * 4 + c];
          }
          count--;
        }
        if (next < height) {
          for (let c = 0; c < 3; c++) {
            sum[c] += copy[(next * width + x) * 4 + c];
          }
          count++;
        }
      }
      for (let c = 0; c < 3; c++) {
        data[idx + c] = sum[c] / count;
      }
      // Alpha channel remains unchanged
    }
  }
}
