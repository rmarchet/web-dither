import { ImageSettings } from "../../../types"

export const applySymbols = (image: ImageSettings) => {
  const { data, width, height } = image
  // Ordered by brightness
  const SYMBOLS = [' ', '.', ':', '-', '+', '=', '*', '@', '#', '%']
  const FONT_SIZE = 13
  const BLOCK_H = FONT_SIZE
  const BLOCK_W = Math.round(FONT_SIZE * 0.7)
  const PALETTE = [
    '#00f6ff', // cyan
    '#ff5edc', // magenta
  ]

  // Prepare canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)
  ctx.font = `bold ${FONT_SIZE}px monospace`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'

  const original = new Uint8ClampedArray(data)

  for (let y0 = 0; y0 < height; y0 += BLOCK_H) {
    for (let x0 = 0; x0 < width; x0 += BLOCK_W) {
      // Sample center pixel only
      const cx = Math.min(width - 1, Math.floor(x0 + BLOCK_W / 2))
      const cy = Math.min(height - 1, Math.floor(y0 + BLOCK_H / 2))
      const idx = (cy * width + cx) * 4
      const lum = 0.299 * original[idx] + 0.587 * original[idx + 1] + 0.114 * original[idx + 2]
      const norm = lum / 255
      // Map brightness to symbol
      const symbolIdx = Math.floor(norm * (SYMBOLS.length - 1))
      const symbol = SYMBOLS[symbolIdx]
      // Alternate color by position and symbol
      const colorIdx = ((x0 / BLOCK_W + y0 / BLOCK_H + symbolIdx) % 2 === 0) ? 0 : 1
      ctx.fillStyle = PALETTE[colorIdx]
      ctx.fillText(symbol, x0, y0 + BLOCK_H / 2)
    }
  }

  // Copy canvas back to image data
  const asciiImage = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < data.length; i++) {
    data[i] = asciiImage.data[i]
  }
}
