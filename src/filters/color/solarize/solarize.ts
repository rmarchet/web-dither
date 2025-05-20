import { ImageSettings, DitherSettings } from "../../../types"
import { rgbToHsv, hsvToRgb } from "../../../utils/effects/effects"

export const applySolarize = (
  image: ImageSettings,
  settings: DitherSettings,
) => {
  const { width, height, data } = image
  const amplitude = Math.max(2, Math.round(settings.amplitude || 4) * 2) // number of color bands
  const frequency = (settings.frequency || 1) * 20 // sharpness of transitions
  const phase = settings.phase || 0 // hue rotation

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      // Convert to HSV
      let v = rgbToHsv(r, g, b)[2]
      // Add noise to v
      if (settings.noise) {
        v += (Math.random() - 0.5) * settings.noise * 0.15
        v = Math.max(0, Math.min(1, v))
      }
      // Smooth banding: blend between bands
      const bandFloat = Math.pow(v, frequency) * amplitude
      const bandA = Math.floor(bandFloat)
      const bandB = Math.min(amplitude - 1, bandA + 1)
      const t = bandFloat - bandA
      const normA = bandA / (amplitude - 1)
      const normB = bandB / (amplitude - 1)
      // Interpolate hue between bands
      const hueA = (normA + phase) % 1
      const hueB = (normB + phase) % 1
      // Shortest hue interpolation
      let dh = hueB - hueA
      if (dh > 0.5) dh -= 1
      if (dh < -0.5) dh += 1
      const hue = (hueA + dh * t + 1) % 1
      // Interpolate saturation and value if desired
      const sat = 0.85 + 0.15 * Math.sin(phase * Math.PI * 2)
      const val = v
      // Compose new color
      const [nr, ng, nb] = hsvToRgb(hue, sat, val)
      data[idx] = nr
      data[idx + 1] = ng
      data[idx + 2] = nb
      // Alpha stays the same
    }
  }
}
