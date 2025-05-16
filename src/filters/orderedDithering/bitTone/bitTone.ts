import { DitherSettings, ImageSettings } from '../../../types'

export const applyBitTone = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image
  const { noise = 0 } = settings
  let levels = 4

  // Clamp levels to at least 2
  levels = Math.max(2, Math.round(levels))
  const step = 255 / (levels - 1)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      let gray = data[idx] // Use red channel (assume grayscale input)
      // Add noise
      if (noise > 0) {
        gray += (Math.random() - 0.5) * noise
      }
      // Quantize to nearest level
      const quant = Math.round(gray / step) * step
      // Threshold to black or white based on quantized value
      const value = quant > 128 ? 255 : 0
      data[idx] = data[idx + 1] = data[idx + 2] = value
      data[idx + 3] = 255
    }
  }
}
