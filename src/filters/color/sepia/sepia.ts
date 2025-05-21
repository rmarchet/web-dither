import { ImageSettings, DitherSettings } from "../../../types"

export const applySepia = (image: ImageSettings, settings: DitherSettings) => {
  const { width, height, data } = image
  const { noise } = settings

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      // Classic sepia formula
      let tr = 0.393 * r + 0.769 * g + 0.189 * b
      let tg = 0.349 * r + 0.686 * g + 0.168 * b
      let tb = 0.272 * r + 0.534 * g + 0.131 * b
      // Add noise for aging effect (monochromatic)
      if (noise) {
        const n = (Math.random() - 0.5) * noise * 20
        tr += n
        tg += n
        tb += n
      }
      // Clamp
      data[idx]     = Math.max(0, Math.min(255, Math.round(tr)))
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(tg)))
      data[idx + 2] = Math.max(0, Math.min(255, Math.round(tb)))
      // Alpha stays the same
    }
  }
}
