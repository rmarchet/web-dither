export const applyGaussian = (data: Uint8ClampedArray, width: number, height: number, noise: number, scale: number = 1) => {
  // Create a 3x3 Gaussian kernel
  const kernel = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
  ];
  const kernelSum = 16; // Sum of all kernel values

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
      const error = gray - newColor;
      
      // Distribute error using Gaussian kernel
      for (let ky = 0; ky < 3; ky++) {
        for (let kx = 0; kx < 3; kx++) {
          const newY = y + (ky - 1);
          const newX = x + (kx - 1);
          
          if (newY >= 0 && newY < height && newX >= 0 && newX < width) {
            const newIdx = (newY * width + newX) * 4;
            data[newIdx] += error * kernel[ky][kx] / kernelSum;
            data[newIdx + 1] += error * kernel[ky][kx] / kernelSum;
            data[newIdx + 2] += error * kernel[ky][kx] / kernelSum;
          }
        }
      }
    }
  }
}; 