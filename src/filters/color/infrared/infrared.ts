import { ImageSettings } from "../../../types"
import { rgbToHsv, hsvToRgb } from "../../../utils/effects/effects"

const GREEN_DOMINANCE_SOFTNESS = 96 // Softer transition, broader selection
const FOLIAGE_RED = (g: number, b: number) => Math.min(255, g * 1.1 + b * 1.0) // Less intense magenta
const FOLIAGE_BLUE = (b: number, g: number) => Math.min(255, b * 1.0 + g * 0.2) // Less intense magenta
const FOLIAGE_GREEN = 0 // Suppress green for magenta

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
