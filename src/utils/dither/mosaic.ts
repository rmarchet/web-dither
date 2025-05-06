export const applyMosaic = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  noise: number = 0,
  blockSize: number = 8,
) => {
  for (let by = 0; by < height; by += blockSize) {
    for (let bx = 0; bx < width; bx += blockSize) {
      // Compute average brightness for the block
      let sum = 0;
      let count = 0;
      for (let y = by; y < by + blockSize && y < height; y++) {
        for (let x = bx; x < bx + blockSize && x < width; x++) {
          const idx = (y * width + x) * 4;
          sum += data[idx]; // Use red channel (assume grayscale input)
          count++;
        }
      }
      let avg = sum / count;
      // Add noise
      if (noise > 0) {
        avg += (Math.random() - 0.5) * noise;
      }
      const value = avg > 128 ? 255 : 0;
      // Set all pixels in the block to the thresholded value
      for (let y = by; y < by + blockSize && y < height; y++) {
        for (let x = bx; x < bx + blockSize && x < width; x++) {
          const idx = (y * width + x) * 4;
          data[idx] = data[idx + 1] = data[idx + 2] = value;
          data[idx + 3] = 255;
        }
      }
    }
  }
};
