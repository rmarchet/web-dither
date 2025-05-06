export const applyAtkinson = (data: Uint8ClampedArray, width: number, height: number, noise: number, scale: number = 1) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      
      // Apply threshold
      const newColor = gray < 128 ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
      
      // Calculate error
      const error = (gray - newColor) / 8;
      
      // Distribute error in Atkinson pattern
      if (x + 1 < width) {
        data[idx + 4] += error; // right
        if (x + 2 < width) {
          data[idx + 8] += error; // right x2
        }
      }
      
      if (y + 1 < height) {
        if (x - 1 >= 0) {
          data[idx + width * 4 - 4] += error; // bottom left
        }
        data[idx + width * 4] += error; // bottom
        if (x + 1 < width) {
          data[idx + width * 4 + 4] += error; // bottom right
        }
        if (y + 2 < height) {
          data[idx + width * 8] += error; // bottom x2
        }
      }
    }
  }
}; 