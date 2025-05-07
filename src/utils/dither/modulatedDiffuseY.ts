import { DitherSettings, ImageSettings } from '../../types';

// Modulated Diffuse Y: error diffusion with Y-axis modulation that creates vertical streaks
export const applyModulatedDiffuseY = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;
  const { noise = 0 } = settings;
  // Create a copy of the original data
  const originalData = new Uint8ClampedArray(data);
  // Create a buffer for error distribution
  const errorBuffer = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    // Modulation factor: varies from 0 (horizontal) to 1 (vertical) in a sine wave along Y
    // When verticalWeight is high, more error is sent up/down; when low, more is sent left/right
    const verticalWeight = 0.5 + 0.5 * Math.sin((y / height) * Math.PI * 2);
    const horizontalWeight = 1 - verticalWeight;
    // Kernel weights (normalized):
    //   [ 0,   v,  0 ]
    //   [ h,  0,  h ]
    //   [ 0,   v,  0 ]
    // where v = verticalWeight/2, h = horizontalWeight/2
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
      // Distribute error using the modulated kernel
      // Vertical (up/down)
      if (y > 0) {
        errorBuffer[(y - 1) * width + x] += error * (verticalWeight / 2);
      }
      if (y < height - 1) {
        errorBuffer[(y + 1) * width + x] += error * (verticalWeight / 2);
      }
      // Horizontal (left/right)
      if (x > 0) {
        errorBuffer[y * width + (x - 1)] += error * (horizontalWeight / 2);
      }
      if (x < width - 1) {
        errorBuffer[y * width + (x + 1)] += error * (horizontalWeight / 2);
      }
    }
  }
}; 