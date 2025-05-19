import { ImageSettings, DitherSettings } from "../../../types"

// Example palettes (you can add more or make them configurable)
const PALETTES = [
  // Obama Hope style
  [
    [29, 54, 93],    // dark blue
    [217, 58, 41],   // red
    [235, 224, 170], // cream
    [112, 150, 158], // light blue
  ],
  // Pop art yellow/blue
  [
    [44, 27, 87],    // purple
    [255, 255, 102], // yellow
    [66, 135, 245],  // blue
    [255, 255, 255], // white
  ],
  // Retro green/orange
  [
    [34, 40, 49],    // dark
    [255, 87, 34],   // orange
    [139, 195, 74],  // green
    [255, 255, 255], // white
  ],
  // Vaporwave
  [
    [255, 0, 110],   // pink
    [0, 255, 255],   // cyan
    [255, 255, 255], // white
    [32, 0, 44],     // deep purple
  ],
  // Classic comic
  [
    [0, 0, 0],       // black
    [255, 221, 51],  // yellow
    [51, 102, 204],  // blue
    [255, 255, 255], // white
  ]
]

export const applyPosterize = (image: ImageSettings, settings: DitherSettings) => {
  const { width, height, data } = image
  const amplitude = Math.max(2, Math.round(settings.amplitude || 4)) // number of bands/colors
  const frequency = settings.frequency || 0
  const noise = settings.noise || 0
  const phase = settings.phase || 0

  // Palette selection/blending logic
  const paletteCount = PALETTES.length
  // Clamp phase to [0, paletteCount-1]
  const clampedPhase = Math.max(0, Math.min(paletteCount - 1, phase))
  const paletteIdxA = Math.floor(clampedPhase)
  const paletteIdxB = Math.min(paletteCount - 1, paletteIdxA + 1)
  const t = clampedPhase - paletteIdxA
  const paletteA = PALETTES[paletteIdxA]
  const paletteB = PALETTES[paletteIdxB]
  // Use the smaller of the two palettes for band count
  const numBands = Math.min(amplitude, paletteA.length, paletteB.length)

  // Helper to blend two colors
  function blendColor(a: number[], b: number[], t: number) {
    return [
      Math.round(a[0] * (1 - t) + b[0] * t),
      Math.round(a[1] * (1 - t) + b[1] * t),
      Math.round(a[2] * (1 - t) + b[2] * t),
    ]
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4

      // Grayscale (brightness)
      let gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]
      // Add noise
      gray += (Math.random() - 0.5) * noise

      // Clamp
      gray = Math.max(0, Math.min(255, gray))

      // Normalize gray to [0, 1]
      let norm = gray / 255
      // Apply sharpness: higher frequency = sharper
      const sharpness = Math.max(1, frequency * 10) // adjust scaling as needed
      norm = Math.pow(norm, sharpness)
      const band = Math.floor(norm * numBands)
      // Blend between palettes for this band
      const color = blendColor(
        paletteA[Math.min(band, numBands - 1)],
        paletteB[Math.min(band, numBands - 1)],
        t
      )

      data[idx] = color[0]
      data[idx + 1] = color[1]
      data[idx + 2] = color[2]
      // Alpha stays the same
    }
  }
}
