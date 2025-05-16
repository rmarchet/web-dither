import { ImageSettings, DitherSettings } from "../../../types"
import { rgbToHsl, hslToRgb } from "../../../utils/effects/effects"

const BLOCK_SIZE = 16
export const applyJpegGlitch = (image: ImageSettings, settings: DitherSettings) => {
  const { width, height, data } = image
  const { noise = 1 } = settings

  // Choose a corruption start line (e.g., 30% to 70% of the image)
  const startLine = Math.floor(height * (0.1 + Math.random() * 0.5))
  const blockSize = BLOCK_SIZE
  const out = new Uint8ClampedArray(data)

  // Global horizontal shift and color tint for the corrupted area
  const globalShift = Math.floor((Math.random() - 0.5) * width * 0.2)
  const globalHueShift = Math.random()

  for (let y = 0; y < height; y++) {
    if (y < startLine) {
      // Copy line as is
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4
        out[idx] = data[idx]
        out[idx + 1] = data[idx + 1]
        out[idx + 2] = data[idx + 2]
        out[idx + 3] = data[idx + 3]
      }
    }
  }

  // Helper to corrupt blocks in a region
  function corruptBlocksInRegion({
    yStart,
    yEnd,
    blockStart,
    compensateGlobalShift = false
  }: {
    yStart: number,
    yEnd: number,
    blockStart: number,
    compensateGlobalShift?: boolean
  }) {
    // Each block is either BLOCK_SIZE or full width, probability of BLOCK_SIZE is noise/50
    const probBlockSize = Math.max(0, Math.min(1, noise / 50))
    let lastWasFullWidth = false
    for (let by = yStart; by < yEnd; by += blockSize) {
      for (let bx = blockStart; bx < width;) {
        // Never allow two full-width blocks in a row
        let useBlockSize
        if (lastWasFullWidth) {
          useBlockSize = true
        } else {
          useBlockSize = Math.random() < probBlockSize
        }
        const blockWidth = useBlockSize ? blockSize : width - bx
        lastWasFullWidth = !useBlockSize
        // Pick corruption params for this block
        const corruptionType = Math.random()
        const shiftX = Math.floor((Math.random() - 0.5) * blockSize * 2) + globalShift
        const hueShift = (globalHueShift + Math.random() * 0.2) % 1
        const quant = 32 + Math.floor(Math.random() * 96)
        let channelsOrder = [0, 1, 2]
        if (Math.random() < 0.5) channelsOrder = [2, 0, 1]
        for (let y = by; y < by + blockSize && y < height && y < yEnd; y++) {
          for (let x = bx; x < bx + blockWidth && x < width; x++) {
            let dstX = x + shiftX
            if (compensateGlobalShift) dstX -= globalShift
            dstX = Math.max(0, Math.min(width - 1, dstX))
            const srcIdx = (y * width + x) * 4
            const dstIdx = (y * width + dstX) * 4
            let r = data[srcIdx]
            let g = data[srcIdx + 1]
            let b = data[srcIdx + 2]
            const a = data[srcIdx + 3]
            if (corruptionType < 0.4) {
              let [h, s, l] = rgbToHsl(r, g, b)
              h = (h + hueShift) % 1
              s = Math.min(1, s + 0.5 * Math.random());
              [r, g, b] = hslToRgb(h, s, l)
              out[dstIdx] = r
              out[dstIdx + 1] = g
              out[dstIdx + 2] = b
              out[dstIdx + 3] = a
            } else if (corruptionType < 0.8) {
              let channels = [r, g, b]
              channels = [channels[channelsOrder[0]], channels[channelsOrder[1]], channels[channelsOrder[2]]]
              r = Math.round(channels[0] / quant) * quant
              g = Math.round(channels[1] / quant) * quant
              b = Math.round(channels[2] / quant) * quant
              out[dstIdx] = r
              out[dstIdx + 1] = g
              out[dstIdx + 2] = b
              out[dstIdx + 3] = a
            } else {
              out[dstIdx] = Math.floor(Math.random() * 256)
              out[dstIdx + 1] = Math.floor(Math.random() * 256)
              out[dstIdx + 2] = Math.floor(Math.random() * 256)
              out[dstIdx + 3] = a
            }
          }
        }
        bx += blockWidth
      }
    }
  }
  // 1. Extra row above the first corrupted row, with random block offset
  if (startLine - blockSize >= 0) {
    const y = startLine - blockSize
    const blockStart = Math.floor(Math.random() * width - blockSize)
    corruptBlocksInRegion({
      yStart: y,
      yEnd: y + blockSize,
      blockStart,
      compensateGlobalShift: false
    })
  }
  // 2. Main corrupted area, always start at x=0
  corruptBlocksInRegion({
    yStart: startLine,
    yEnd: height,
    blockStart: 0,
    compensateGlobalShift: true
  })
  // Copy the result back to the original data array
  for (let i = 0; i < data.length; i++) {
    data[i] = out[i]
  }
}
