import { ImageSettings, DitherSettings } from "../../../types"

export const applyColorMosaic = (image: ImageSettings, settings: DitherSettings) => {
  const { width, height, data } = image
  const { noise = 1 } = settings
  const blockSize = 8
  const numBlocks = Math.floor(noise * (width * height) / (blockSize * blockSize) * 0.5)

  // Copy the original image
  const out = new Uint8ClampedArray(data)

  for (let n = 0; n < numBlocks; n++) {
    const bx = Math.floor(Math.random() * (width / blockSize))
    const by = Math.floor(Math.random() * (height / blockSize))
    const shift = Math.floor((Math.random() - 0.5) * blockSize * 2)

    for (let y = 0; y < blockSize; y++) {
      const srcY = by * blockSize + y
      if (srcY >= height) continue
      for (let x = 0; x < blockSize; x++) {
        const srcX = bx * blockSize + x
        const dstX = Math.max(0, Math.min(width - 1, srcX + shift))
        if (srcX >= width) continue
        const srcIdx = (srcY * width + srcX) * 4
        const dstIdx = (srcY * width + dstX) * 4
        out[dstIdx] = data[srcIdx]
        out[dstIdx + 1] = data[srcIdx + 1]
        out[dstIdx + 2] = data[srcIdx + 2]
        out[dstIdx + 3] = data[srcIdx + 3]
      }
    }
  }

  // Copy the result back to the original data array
  for (let i = 0; i < data.length; i++) {
    data[i] = out[i]
  }
}
