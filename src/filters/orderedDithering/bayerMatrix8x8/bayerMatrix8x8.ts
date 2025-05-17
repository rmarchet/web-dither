import { DitherSettings, ImageSettings } from '../../../types'

const bayer8x8 = [
  [ 0,  32,  8,  40,  2,  34, 10, 42],
  [48,  16, 56,  24, 50,  18, 58, 26],
  [12,  44,  4,  36, 14,  46,  6, 38],
  [60,  28, 52,  20, 62,  30, 54, 22],
  [ 3,  35, 11,  43,  1,  33,  9, 41],
  [51,  19, 59,  27, 49,  17, 57, 25],
  [15,  47,  7,  39, 13,  45,  5, 37],
  [63,  31, 55,  23, 61,  29, 53, 21],
]

export const applyBayerMatrix8x8 = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image
  const { noise = 0 } = settings

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      // Convert to grayscale
      let gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]
      // Add noise if needed
      if (noise > 0) {
        gray += (Math.random() - 0.5) * noise
      }
      // Normalize gray to [0, 1]
      const normGray = gray / 255
      // Get Bayer threshold for this pixel, normalized to [0, 1]
      const threshold = bayer8x8[y % 8][x % 8] / 64
      // Dither
      const value = normGray > threshold ? 255 : 0
      data[idx] = data[idx + 1] = data[idx + 2] = value
      data[idx + 3] = 255
    }
  }
}
