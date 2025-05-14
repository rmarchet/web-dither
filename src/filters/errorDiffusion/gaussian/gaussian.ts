import { DitherSettings, ImageSettings } from '../../../types';

export const applyGaussian = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0 } = settings;
  const scale = 1;

  // Create a copy of the original data
  const originalData = new Uint8ClampedArray(data);
  // Create a buffer for error distribution
  const errorBuffer = new Float32Array(width * height);
  
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
      const errorIdx = y * width + x;
      
      // Get original gray value and add accumulated error
      let gray = originalData[idx] + errorBuffer[errorIdx];
      
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      
      // Apply threshold and ensure strictly black or white
      const newColor = gray < 128 ? 0 : 255;
      data[idx] = newColor;
      data[idx + 1] = newColor;
      data[idx + 2] = newColor;
      data[idx + 3] = 255; // Ensure full opacity
      
      // Calculate error
      const error = gray - newColor;
      
      // Distribute error using Gaussian kernel
      for (let ky = 0; ky < 3; ky++) {
        for (let kx = 0; kx < 3; kx++) {
          const newY = y + (ky - 1);
          const newX = x + (kx - 1);
          
          if (newY >= 0 && newY < height && newX >= 0 && newX < width) {
            const newErrorIdx = newY * width + newX;
            errorBuffer[newErrorIdx] += error * kernel[ky][kx] / kernelSum;
          }
        }
      }
    }
  }
};