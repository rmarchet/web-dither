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
      
      // Distribute error in Atkinson pattern with scaling
      const scaledX = Math.floor(x / scale);
      const scaledY = Math.floor(y / scale);
      const offsets = [
        4,              // right
        8,              // right x2
        width * 4 - 4,  // bottom left
        width * 4,      // bottom
        width * 4 + 4,  // bottom right
        width * 8       // bottom x2
      ];
      
      offsets.forEach(offset => {
        const newIdx = idx + offset;
        if (newIdx < data.length) {
          data[newIdx] += error;
          data[newIdx + 1] += error;
          data[newIdx + 2] += error;
        }
      });
    }
  }
}; 