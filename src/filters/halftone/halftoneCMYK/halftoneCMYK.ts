import { ImageSettings, DitherSettings } from "../../../types"

export const applyHalftoneCMYK = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image
  const { noise } = settings

  // Parameters
  const minSpacing = 6
  const maxSpacing = 22
  const safeNoise = Math.max(0, Math.min(1, noise ?? 0))
  const dotSpacing = Math.round(minSpacing + (maxSpacing - minSpacing) * (1 - Math.pow(1 - safeNoise, 2)))
  const minDot = 0.1
  const maxDot = 0.95
  // Angles in degrees for each channel
  const angles = [15, 75, 0, 45] // C, M, Y, K
  const colors = [
    [0, 255, 255],   // Cyan
    [255, 0, 255],   // Magenta
    [255, 255, 0],   // Yellow
    [0, 0, 0],       // Black
  ]

  // Helper: RGB to CMYK (0-1)
  function rgb2cmyk(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255
    const k = 1 - Math.max(r, g, b)
    const c = k < 1 ? (1 - r - k) / (1 - k) : 0
    const m = k < 1 ? (1 - g - k) / (1 - k) : 0
    const y = k < 1 ? (1 - b - k) / (1 - k) : 0
    return [c, m, y, k]
  }

  // Work on a blank white canvas
  const out = new Uint8ClampedArray(data.length)
  for (let i = 0; i < out.length; i += 4) {
    out[i] = 255; out[i + 1] = 255; out[i + 2] = 255; out[i + 3] = 255
  }

  // Precompute CMYK for all pixels
  const cmyk = new Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      cmyk[y * width + x] = rgb2cmyk(data[idx], data[idx + 1], data[idx + 2])
    }
  }

  // For each channel (Y, M, C, K for correct overprint)
  const order = [2, 1, 0, 3]
  const diag = Math.ceil(Math.sqrt(width * width + height * height))
  for (const ch of order) {
    const angle = angles[ch] * Math.PI / 180
    const cosA = Math.cos(angle)
    const sinA = Math.sin(angle)
    // Offset for screen angle
    const x0 = width / 2
    const y0 = height / 2
    for (let gy = -diag; gy < height + diag; gy += dotSpacing) {
      for (let gx = -diag; gx < width + diag; gx += dotSpacing) {
        // Rotate grid
        const rx = Math.round((gx - x0) * cosA - (gy - y0) * sinA + x0)
        const ry = Math.round((gx - x0) * sinA + (gy - y0) * cosA + y0)
        if (rx < 0 || rx >= width || ry < 0 || ry >= height) continue
        const idx = ry * width + rx
        const val = cmyk[idx][ch]
        // Dot size: invert for halftone (darker = bigger dot)
        const dotR = (minDot + (maxDot - minDot) * val) * (dotSpacing / 2)
        // Draw dot
        for (let y = -dotSpacing / 2; y <= dotSpacing / 2; y++) {
          for (let x = -dotSpacing / 2; x <= dotSpacing / 2; x++) {
            if (x * x + y * y > dotR * dotR) continue
            const px = rx + x
            const py = ry + y
            if (px < 0 || px >= width || py < 0 || py >= height) continue
            const pidx = (py * width + px) * 4
            // Alpha blend over previous
            const src = colors[ch]
            const alpha = 0.7
            out[pidx] = Math.round(src[0] * alpha + out[pidx] * (1 - alpha))
            out[pidx + 1] = Math.round(src[1] * alpha + out[pidx + 1] * (1 - alpha))
            out[pidx + 2] = Math.round(src[2] * alpha + out[pidx + 2] * (1 - alpha))
            out[pidx + 3] = 255
          }
        }
      }
    }
  }

  // Copy to data
  for (let i = 0; i < data.length; i++) {
    data[i] = out[i]
  }
}
