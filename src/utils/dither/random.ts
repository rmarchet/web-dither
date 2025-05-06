export const applyRandom = (data: Uint8ClampedArray, width: number, height: number, noise: number, scale: number = 1) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx];
      
      // Add noise and random threshold
      const threshold = Math.random() * 255;
      gray += (Math.random() - 0.5) * noise;
      
      // Apply random dithering
      const newColor = gray < threshold ? 0 : 255;
      data[idx] = data[idx + 1] = data[idx + 2] = newColor;
    }
  }
}; 