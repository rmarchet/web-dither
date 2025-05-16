import { DitherSettings, ImageSettings } from '../../../types'

// Atkinson-VHS: Monochrome Atkinson dithering with VHS scanline effect
export const applyAtkinsonVHS = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image
  const { noise = 0 } = settings

  // Atkinson dithering with scanlines (monochrome only)
  const originalData = new Uint8ClampedArray(data)
  const scanlineStrength = 0.25 // 0 = no scanline, 1 = full black

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      // Get grayscale value from original data
      let gray = (originalData[idx] * 0.299 + originalData[idx + 1] * 0.587 + originalData[idx + 2] * 0.114)
      // Add noise
      gray += (Math.random() - 0.5) * noise
      // Atkinson threshold
      const newColor = gray < 128 ? 0 : 255
      // Scanline effect: darken every other row
      let scanline = 1
      if (y % 2 === 1) scanline = 1 - scanlineStrength
      const out = newColor * scanline
      data[idx] = out
      data[idx + 1] = out
      data[idx + 2] = out
      data[idx + 3] = 255
      // Atkinson error diffusion
      const error = (gray - newColor) / 8
      if (x + 1 < width) data[idx + 4] += error
      if (x + 2 < width) data[idx + 8] += error
      if (y + 1 < height) {
        if (x > 0) data[idx + width * 4 - 4] += error
        data[idx + width * 4] += error
        if (x + 1 < width) data[idx + width * 4 + 4] += error
      }
      if (y + 2 < height) data[idx + width * 8] += error
    }
  }
} 
