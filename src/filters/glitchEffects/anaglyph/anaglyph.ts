import { ImageSettings, DitherSettings } from '../../../types'

export const applyAnaglyph = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image
  const amplitude = settings.amplitude * 20
  const frequency = settings.frequency * 10

  // Copy original data to avoid overwriting source pixels
  const original = new Uint8ClampedArray(data)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      // Offset each channel by a different amount
      const redX = Math.max(0, Math.min(width - 1, x - Math.round(amplitude)))
      const greenX = Math.max(0, Math.min(width - 1, x + Math.round(amplitude * frequency)))
      const blueX = Math.max(0, Math.min(width - 1, x - Math.round(amplitude * frequency)))
      const redIdx = (y * width + redX) * 4
      const greenIdx = (y * width + greenX) * 4
      const blueIdx = (y * width + blueX) * 4
      data[idx] = original[redIdx]         // Red
      data[idx + 1] = original[greenIdx+1] // Green
      data[idx + 2] = original[blueIdx+2]  // Blue
      data[idx + 3] = 255
    }
  }
}
