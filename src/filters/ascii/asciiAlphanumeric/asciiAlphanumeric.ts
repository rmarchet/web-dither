import { DitherSettings, ImageSettings } from '../../../types'

// Default ASCII characters size
const DEFAULT_ASCII_SIZE = 13
  
export const applyAsciiAlphanumeric = (image: ImageSettings, settings: DitherSettings) => {
  const { width, height } = image
  const verticalBlockSize = DEFAULT_ASCII_SIZE
  const horizontalBlockSize = DEFAULT_ASCII_SIZE * 0.604
  const ASCII_CHARS = '@#W$9876543210?!abc;:+=-,._ '
  const negative = settings.invert ?? false
  const gamma = 0.7

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = negative ? 'black' : 'white'
  ctx.fillRect(0, 0, width, height)
  ctx.font = `bold ${verticalBlockSize}px monospace`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillStyle = negative ? 'white' : 'black'

  const original = new Uint8ClampedArray(image.data)

  for (let y0 = 0; y0 < height; y0 += verticalBlockSize) {
    let rowString = ''
    for (let x0 = 0; x0 < width; x0 += horizontalBlockSize) {
      // Sample center pixel only
      const cx = Math.min(width - 1, Math.floor(x0 + horizontalBlockSize / 2))
      const cy = Math.min(height - 1, Math.floor(y0 + verticalBlockSize / 2))
      const idx = (cy * width + cx) * 4
      const lum = 0.299 * original[idx] + 0.587 * original[idx + 1] + 0.114 * original[idx + 2]
      const normBrightness = Math.pow(lum / 255, gamma)
      let charIdx = Math.floor(normBrightness * (ASCII_CHARS.length - 1))
      if (negative) {
        charIdx = ASCII_CHARS.length - 1 - charIdx
      }
      const char = ASCII_CHARS[charIdx]
      rowString += char
    }
    ctx.fillText(rowString, 0, y0 + verticalBlockSize / 2)
  }

  const asciiImage = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < image.data.length; i++) {
    image.data[i] = asciiImage.data[i]
  }
}
