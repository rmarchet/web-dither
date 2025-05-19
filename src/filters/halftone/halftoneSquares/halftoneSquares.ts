import { ImageSettings, DitherSettings } from "../../../types"

export const applyHalftoneSquares = (image: ImageSettings, settings: DitherSettings) => {
  const { width, height, data } = image
  const amplitude = (settings.amplitude || 1)

  // Block size: amplitude controls the size
  const minBlock = 1
  const maxBlock = 8
  const blockSize = Math.round(minBlock + (maxBlock - minBlock) * (1 - amplitude / 10))
  const minW = Math.max(2, Math.round(blockSize * 0.25))
  const minH = minW
  const maxW = blockSize
  const maxH = blockSize
  const original = new Uint8ClampedArray(data)

  // Fill image with black
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 0
    data[i + 1] = 0
    data[i + 2] = 0
    data[i + 3] = 255
  }

  for (let cy = 0; cy < height; cy += blockSize) {
    for (let cx = 0; cx < width; cx += blockSize) {
      // Compute average brightness in the cell
      let sum = 0
      let count = 0
      for (let y = cy; y < Math.min(cy + blockSize, height); y++) {
        for (let x = cx; x < Math.min(cx + blockSize, width); x++) {
          const idx = (y * width + x) * 4
          const gray = 0.299 * original[idx] + 0.587 * original[idx + 1] + 0.114 * original[idx + 2]
          sum += gray
          count++
        }
      }
      const avg = sum / count
      const norm = avg / 255

      let rectW = minW
      let rectH = minH

      if (norm > 0.5) {
        // For higher brightness, width grows, height is max
        rectW = minW + (maxW - minW) * ((norm - 0.5) / 0.5)
        rectH = maxH
      } else if (norm > 0.05) {
        // For mid brightness, width is min, height grows
        rectW = minW
        rectH = minH + (maxH - minH) * (norm / 0.5)
      } else {
        // Very dark: no rectangle (leave block black)
        continue
      }

      // Center the rectangle in the cell
      const startX = Math.round(cx + (blockSize - rectW) / 2)
      const startY = Math.round(cy + (blockSize - rectH) / 2)

      for (let y = startY; y < startY + rectH && y < height; y++) {
        for (let x = startX; x < startX + rectW && x < width; x++) {
          const idx = (y * width + x) * 4
          data[idx] = 255
          data[idx + 1] = 255
          data[idx + 2] = 255
          data[idx + 3] = 255
        }
      }
    }
  }
}
