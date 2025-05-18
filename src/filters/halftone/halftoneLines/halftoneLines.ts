import { ImageSettings, DitherSettings } from "../../../types"

export const applyHalftoneLines = (image: ImageSettings, settings: DitherSettings) => {
  const { width, height, data } = image
  const { phase = 0 } = settings
  const amplitude = ( settings.amplitude || 0.5 ) * 8
  const frequency = ( settings.frequency || 0.005 ) * 5

  // Copy original data
  const original = new Uint8ClampedArray(data)

  // Fill image with white
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255
    data[i + 1] = 255
    data[i + 2] = 255
    data[i + 3] = 255
  }

  // For each pixel, determine if it should be part of a line
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      // Get brightness at this pixel
      const gray = 0.299 * original[idx] + 0.587 * original[idx + 1] + 0.114 * original[idx + 2]
      // Map brightness to line thickness (darker = thicker)
      const thickness = 1 + amplitude * (1 - gray / 255)
      // Diagonal coordinate (45-degree lines)
      const d = (x + y + phase * 100) * frequency
      // If within the thickness, draw black
      if ((d % amplitude) < thickness) {
        data[idx] = 0
        data[idx + 1] = 0
        data[idx + 2] = 0
        data[idx + 3] = 255
      }
    }
  }
}
