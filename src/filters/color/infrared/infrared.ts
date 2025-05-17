import { ImageSettings } from "../../../types"

const GREEN_DOMINANCE_SOFTNESS = 96 // Softer transition, broader selection
const FOLIAGE_RED = (g: number, b: number) => Math.min(255, g * 1.1 + b * 1.0) // Less intense magenta
const FOLIAGE_BLUE = (b: number, g: number) => Math.min(255, b * 1.0 + g * 0.2) // Less intense magenta
const FOLIAGE_GREEN = 0 // Suppress green for magenta

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0
  const d = max - min
  const s = max === 0 ? 0 : d / max
  const v = max
  if (max !== min) {
    switch (max) {
    case r: h = (g - b) / d + (g < b ? 6 : 0); break
    case g: h = (b - r) / d + 2; break
    case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return [h, s, v]
}

function hsvToRgb(h: number, s: number, v: number) {
  let r = 0, g = 0, b = 0
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  switch (i % 6) {
  case 0: r = v; g = t; b = p; break
  case 1: r = q; g = v; b = p; break
  case 2: r = p; g = v; b = t; break
  case 3: r = p; g = q; b = v; break
  case 4: r = t; g = p; b = v; break
  case 5: r = v; g = p; b = q; break
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

export const applyInfrared = (image: ImageSettings) => {
  const { width, height, data } = image
  const original = new Uint8ClampedArray(data)

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4
    const r = original[idx]
    const g = original[idx + 1]
    const b = original[idx + 2]

    // Invert and keep only red channel
    const invR = 255 - r
    const inv = [invR, 0, 0]

    // Convert both to HSV
    const [h1, s1, v1] = rgbToHsv(r, g, b)
    const [h2] = rgbToHsv(inv[0], inv[1], inv[2])

    // Blend hue channels
    const hue = 0.9 * h2 + 0.9 * h1
    const s = s1
    const v = v1

    // Convert back to RGB
    const [nr, ng, nb] = hsvToRgb(hue % 1, s, v)

    // Soft foliage mask: how much green dominates
    const avgRB = (r + b) / 2
    const greenDominance = Math.max(0, (g - avgRB) / GREEN_DOMINANCE_SOFTNESS)

    // Blend between HSV effect and magenta foliage based on green dominance
    data[idx]     = nr * (1 - greenDominance) + FOLIAGE_RED(g, b) * greenDominance
    data[idx + 1] = ng * (1 - greenDominance) + FOLIAGE_GREEN * greenDominance
    data[idx + 2] = nb * (1 - greenDominance) + FOLIAGE_BLUE(b, g) * greenDominance
    // Alpha stays the same
  }
}
