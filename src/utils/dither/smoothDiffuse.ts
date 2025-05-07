import { DitherSettings, ImageSettings } from '../../types';

// Smooth Diffuse: error diffusion with a soft, normalized 3x3 kernel
export const applySmoothDiffuse = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0 } = settings;
  // Create a copy of the original data
  const originalData = new Uint8ClampedArray(data);
  // Create a buffer for error distribution
  const errorBuffer = new Float32Array(width * height);

  // Soft 3x3 kernel (Gaussian-like)
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
      let gray = (originalData[idx] * 0.299 + originalData[idx + 1] * 0.587 + originalData[idx + 2] * 0.114) + errorBuffer[errorIdx];
      // Add noise
      gray += (Math.random() - 0.5) * noise;
      // Threshold to black or white
      const newColor = gray < 128 ? 0 : 255;
      data[idx] = newColor;
      data[idx + 1] = newColor;
      data[idx + 2] = newColor;
      data[idx + 3] = 255;
      // Calculate error
      const error = gray - newColor;
      // Distribute error using the soft kernel
      for (let ky = 0; ky < 3; ky++) {
        for (let kx = 0; kx < 3; kx++) {
          if (ky === 1 && kx === 1) continue; // skip center
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