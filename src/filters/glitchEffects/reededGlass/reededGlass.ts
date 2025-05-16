import { ImageSettings, DitherSettings } from "../../../types"

// Bilinear interpolation helper
export const bilinearSample = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number
): [number, number, number, number] => {
  const x0 = Math.floor(x)
  const x1 = Math.min(x0 + 1, width - 1)
  const y0 = Math.floor(y)
  const y1 = Math.min(y0 + 1, height - 1)
  const dx = x - x0
  const dy = y - y0

  function getPixel(ix: number, iy: number) {
    const idx = (iy * width + ix) * 4
    return [
      data[idx],
      data[idx + 1],
      data[idx + 2],
      data[idx + 3]
    ]
  }

  const c00 = getPixel(x0, y0)
  const c10 = getPixel(x1, y0)
  const c01 = getPixel(x0, y1)
  const c11 = getPixel(x1, y1)

  const c0 = c00.map((v, i) => v * (1 - dx) + c10[i] * dx)
  const c1 = c01.map((v, i) => v * (1 - dx) + c11[i] * dx)
  return c0.map((v, i) => Math.round(v * (1 - dy) + c1[i] * dy)) as [number, number, number, number]
}

// Simple 1D horizontal box blur for demonstration
function boxBlurX(
  src: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number
): Uint8ClampedArray {
  const dst = new Uint8ClampedArray(src.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0
      for (let dx = -radius; dx <= radius; dx++) {
        const xx = Math.max(0, Math.min(width - 1, x + dx))
        const idx = (y * width + xx) * 4
        r += src[idx]
        g += src[idx + 1]
        b += src[idx + 2]
        a += src[idx + 3]
        count++
      }
      const idx = (y * width + x) * 4
      dst[idx] = r / count
      dst[idx + 1] = g / count
      dst[idx + 2] = b / count
      dst[idx + 3] = a / count
    }
  }
  return dst
}

export function applyReededGlass(
  image: ImageSettings,
  settings: DitherSettings
): void {
  const { width, height, data } = image
  const amplitude = (settings.amplitude ?? 1) * 30
  const frequency = (settings.frequency ?? 1) * 600
  const phase = settings.phase ?? 0
  const blurRadius = settings.blurRadius ?? 3
  const sharpness = settings.sharpness ?? 2.5 // try 2.5 for a sharp lens

  const original = new Uint8ClampedArray(data)
  const blurred = boxBlurX(original, width, height, blurRadius)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width
      const flutePos = (u * frequency + phase / (2 * Math.PI)) % 1
      const fluteCenter = flutePos - 0.5
      // Sharper lens: sin^sharpness
      const lensOffset = amplitude * Math.sign(fluteCenter) * Math.pow(Math.abs(Math.sin(Math.PI * fluteCenter)), sharpness)
      const sampleX = Math.max(0, Math.min(width - 1, x + lensOffset))
      const colorSharp = bilinearSample(original, width, height, sampleX, y)
      const colorBlur = bilinearSample(blurred, width, height, sampleX, y)

      // Sharper blur transition at edge
      const edgeDist = Math.abs(fluteCenter) * 2 // 0 at center, 1 at edge
      const blend = Math.min(1, Math.max(0, (edgeDist - 0.85) / 0.15)) // sharper edge

      const idx = (y * width + x) * 4
      for (let c = 0; c < 4; c++) {
        data[idx + c] = Math.round(colorSharp[c] * (1 - blend) + colorBlur[c] * blend)
      }
    }
  }
}

