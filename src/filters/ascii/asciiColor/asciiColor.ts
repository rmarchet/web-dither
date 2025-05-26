import { ImageSettings } from "../../../types"

// ANSI 16 color palette (RGB)
const ANSI_COLORS = [
  [0, 0, 0],       // Black
  [128, 0, 0],     // Red
  [0, 128, 0],     // Green
  [128, 128, 0],   // Yellow
  [0, 0, 128],     // Blue
  [128, 0, 128],   // Magenta
  [0, 128, 128],   // Cyan
  [192, 192, 192], // White (light gray)
  [128, 128, 128], // Bright Black (dark gray)
  [255, 0, 0],     // Bright Red
  [0, 255, 0],     // Bright Green
  [255, 255, 0],   // Bright Yellow
  [0, 0, 255],     // Bright Blue
  [255, 0, 255],   // Bright Magenta
  [0, 255, 255],   // Bright Cyan
  [255, 255, 255], // Bright White
]

// ASCII chars (alphanumeric and symbols)
const ASCII_CHARS = ' .:-=+*%@#abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&$@!~?[]{}|/\\<>;:,_^'

function closestAnsiColor(r: number, g: number, b: number) {
  let minDist = Infinity, idx = 0
  for (let i = 0; i < ANSI_COLORS.length; i++) {
    const [cr, cg, cb] = ANSI_COLORS[i]
    const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2
    if (dist < minDist) {
      minDist = dist
      idx = i
    }
  }
  return `rgb(${ANSI_COLORS[idx][0]},${ANSI_COLORS[idx][1]},${ANSI_COLORS[idx][2]})`
}

export const applyAsciiColor = (image: ImageSettings) => {
  const { data, width, height } = image
  const BLOCK_SIZE = 12
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.font = `bold ${BLOCK_SIZE}px monospace`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'

  const original = new Uint8ClampedArray(data)

  for (let y0 = 0; y0 < height; y0 += BLOCK_SIZE) {
    for (let x0 = 0; x0 < width; x0 += BLOCK_SIZE) {
      // Average color in block
      let rSum = 0, gSum = 0, bSum = 0, count = 0
      for (let y = y0; y < Math.min(y0 + BLOCK_SIZE, height); y++) {
        for (let x = x0; x < Math.min(x0 + BLOCK_SIZE, width); x++) {
          const idx = (y * width + x) * 4
          rSum += original[idx]
          gSum += original[idx + 1]
          bSum += original[idx + 2]
          count++
        }
      }
      const rAvg = Math.round(rSum / count)
      const gAvg = Math.round(gSum / count)
      const bAvg = Math.round(bSum / count)
      // Pick background and foreground ANSI colors
      const bgColor = closestAnsiColor(rAvg, gAvg, bAvg)
      // For fg, invert or pick a contrasting color
      const fgColor = closestAnsiColor(255 - rAvg, 255 - gAvg, 255 - bAvg)
      // Pick a char based on brightness
      const lum = 0.299 * rAvg + 0.587 * gAvg + 0.114 * bAvg
      const norm = lum / 255
      const charIdx = Math.floor(norm * (ASCII_CHARS.length - 1))
      const char = ASCII_CHARS[charIdx]
      // Draw block background
      ctx.fillStyle = bgColor
      ctx.fillRect(x0, y0, BLOCK_SIZE, BLOCK_SIZE)
      // Draw char
      ctx.fillStyle = fgColor
      ctx.fillText(char, x0, y0 + BLOCK_SIZE / 2)
    }
  }

  // Copy canvas back to image data
  const asciiImage = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < data.length; i++) {
    data[i] = asciiImage.data[i]
  }
}
