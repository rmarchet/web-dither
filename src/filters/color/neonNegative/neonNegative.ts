import { ImageSettings, DitherSettings } from "../../../types"

// Helper: linear interpolation between two colors
function lerpColor(a: number[], b: number[], t: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

// Helper: interpolate between two palettes
function lerpPalette(p1: number[][], p2: number[][], t: number) {
  return [
    lerpColor(p1[0], p2[0], t),
    lerpColor(p1[1], p2[1], t),
  ]
}

// Neon palettes
const PALETTES = [
  [[225, 0, 152], [255, 255, 0]],   // Magenta/Yellow
  [[0, 255, 255], [255, 255, 0]],   // Cyan/Yellow
  [[0, 255, 128], [225, 0, 152]],   // Green/Magenta
  [[0, 128, 255], [255, 128, 0]],   // Blue/Orange
]

export const applyNeonNegative = (image: ImageSettings, settings: DitherSettings) => {
  const { width, height, data } = image
  const amplitude = settings.amplitude
  const phase = settings.phase
  const frequency = settings.frequency * 4
  const noise = settings.noise

  // Interpolate between palettes for base and overlay
  const palettePos = frequency * (PALETTES.length - 1)
  const paletteIdx = Math.floor(palettePos)
  const paletteT = palettePos - paletteIdx
  const paletteA = PALETTES[paletteIdx]
  const paletteB = PALETTES[Math.min(paletteIdx + 1, PALETTES.length - 1)]
  const [colorA1, colorB1] = lerpPalette(paletteA, paletteB, paletteT)

  // For overlay, use the next palette (or wrap around)
  const overlayIdx = (paletteIdx + 1) % PALETTES.length
  const [colorA2, colorB2] = PALETTES[overlayIdx]

  // Store the original image data for overlays
  const original = new Uint8ClampedArray(data)

  // Store the original duotone
  const duotone = new Uint8ClampedArray(data.length)

  // First pass: duotone for the base image
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4
    // Invert
    const r = 255 - original[idx]
    const g = 255 - original[idx + 1]
    const b = 255 - original[idx + 2]
    // Grayscale (brightness)
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    // Map to duotone with noise
    const t = Math.min(1, Math.max(0, gray / 255 + (Math.random() - 0.5) * noise / 100))
    const [nr, ng, nb] = lerpColor(colorA1, colorB1, t)
    duotone[idx] = nr
    duotone[idx + 1] = ng
    duotone[idx + 2] = nb
    duotone[idx + 3] = 255
  }

  // Second pass: overlay a mirrored, scaled, recolored duplicate
  const scale = amplitude + 1.18
  const offsetX = -Math.round(width * phase)
  const offsetY = -Math.round(height * phase)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      // Start with the base duotone
      let r = duotone[idx]
      let g = duotone[idx + 1]
      let b = duotone[idx + 2]

      // Inverse mapping: for each output pixel, find the corresponding source pixel in the scaled, shifted duplicate
      const sx = width - 1 - Math.round((x - offsetX) / scale)
      const sy = Math.round((y - offsetY) / scale)
      if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
        const sidx = (sy * width + sx) * 4
        // Invert and duotone with the overlay palette, using the original image
        const sr = 255 - original[sidx]
        const sg = 255 - original[sidx + 1]
        const sb = 255 - original[sidx + 2]
        const sgray = 0.299 * sr + 0.587 * sg + 0.114 * sb
        const t = Math.min(1, Math.max(0, sgray / 255 + (Math.random() - 0.5) * noise / 100))
        const [dr, dg, db] = lerpColor(colorA2, colorB2, t)
        // Soft blend: alpha blend (60% base, 40% duplicate)
        r = Math.round(r * 0.6 + dr * 0.4)
        g = Math.round(g * 0.6 + dg * 0.4)
        b = Math.round(b * 0.6 + db * 0.4)
      }

      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = 255
    }
  }
}
