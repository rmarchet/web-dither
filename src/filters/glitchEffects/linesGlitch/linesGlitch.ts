import { DitherSettings, ImageSettings } from '../../../types'

export const applyLinesGlitch = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image
  const { amplitude = 21, minSpacing = 4, maxSpacing = 16, maxThickness = 6 } = settings

  // Copy original data for sampling
  const original = new Uint8ClampedArray(data)

  for (let y = 0; y < height; y++) {
    let x = 0
    while (x < width) {
      const idx = (y * width + x) * 4
      const gray = original[idx] // Use red channel (assume grayscale input)
      const offset = Math.round(amplitude * (gray / 255 - 0.5))
      // Variable line spacing based on brightness (white = minSpacing, black = maxSpacing)
      const spacing = minSpacing + (maxSpacing - minSpacing) * (1 - gray / 255)
      const isLine = ((x + offset) % Math.round(spacing) === 0)

      if (isLine) {
        // Make lines thicker in bright areas (smaller spacing)
        // The closer spacing is to minSpacing, the thicker the line
        const thickness = Math.max(1, Math.round(maxThickness - (spacing - minSpacing)))
        for (let t = 0; t < thickness && x + t < width; t++) {
          const idx2 = (y * width + (x + t)) * 4
          data[idx2] = data[idx2 + 1] = data[idx2 + 2] = 255
          data[idx2 + 3] = 255
        }
        x += thickness // Skip the next (thickness-1) pixels
      } else {
        data[idx] = data[idx + 1] = data[idx + 2] = 0
        data[idx + 3] = 255
        x++
      }
    }
  }
}
