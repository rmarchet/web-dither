import { ImageSettings, DitherSettings } from "../../../types"
import { applyBarrelDistortion, applyVignette } from "../../../utils/effects/effects"

export const applyCrt = (image: ImageSettings, settings: DitherSettings) => {
  const { width, height, data } = image

  // Parameters mapped from settings
  const scanlineDensity = Math.max(1, settings.frequency * 12.5) // more frequency = denser scanlines
  const scanlineStrength = 0.35 + 2.25 * (settings.frequency - 1)
  const vignetteStrength = 0.5
  const barrelStrength = (settings.amplitude ?? 1) * 0.25 // more amplitude = more curve
  const colorBoost = 1.25 + 0.25 * ((settings.amplitude ?? 1) - 1) // boost with amplitude
  const glitchStrength = (settings.noise ?? 0) * 0.0005
  const phase = settings.phase ?? 0

  const orig = new Uint8ClampedArray(data)

  const rgbShift = 2 + (settings.noise ?? 0) * 2

  // Aperture grille mask (vertical RGB stripes)
  const maskStrength = 0.6 // 0 = no mask, 1 = only one color per stripe
  const maskType = 'stripe' // or 'dot' for dot mask

  for (let y = 0; y < height; y++) {
    // Scanline: smooth sine-based
    const scanline = 1.0 - scanlineStrength * (Math.sin((y / scanlineDensity) + phase * Math.PI * 2) * 0.5 + 0.5)
    // Glitch: sine-based horizontal offset
    const glitch = glitchStrength > 0
      ? Math.round(Math.sin(y * 0.12 + phase * 10) * glitchStrength)
      : 0

    for (let x = 0; x < width; x++) {
      // Barrel distortion (as in shader)
      const [sx, sy] = applyBarrelDistortion(x, y, width, height, barrelStrength, glitch)
      // Clamp to image bounds
      const srcX = Math.max(0, Math.min(width - 1, Math.round(sx)))
      const srcY = Math.max(0, Math.min(height - 1, Math.round(sy)))

      // RGB shift
      const rSrcX = Math.max(0, Math.min(width - 1, Math.round(sx - rgbShift)))
      const bSrcX = Math.max(0, Math.min(width - 1, Math.round(sx + rgbShift)))
      const rIdx = (srcY * width + rSrcX) * 4
      const gIdx = (srcY * width + srcX) * 4
      const bIdx = (srcY * width + bSrcX) * 4

      let rCol = orig[rIdx]
      let gCol = orig[gIdx + 1]
      let bCol = orig[bIdx + 2]

      // Apply scanline
      rCol *= scanline
      gCol *= scanline
      bCol *= scanline

      // Vignette/edge fade (as in shader)
      const vignette = applyVignette(x, y, width, height, vignetteStrength)
      rCol *= vignette
      gCol *= vignette
      bCol *= vignette

      // Color boost (nonlinear for glow)
      rCol = Math.pow(rCol / 255, 0.9) * 255 * colorBoost
      gCol = Math.pow(gCol / 255, 0.9) * 255 * colorBoost
      bCol = Math.pow(bCol / 255, 0.9) * 255 * colorBoost

      // Apply aperture grille mask
      if (maskType === 'stripe') {
        if (x % 3 === 0) { // Red stripe
          gCol *= maskStrength
          bCol *= maskStrength
        } else if (x % 3 === 1) { // Green stripe
          rCol *= maskStrength
          bCol *= maskStrength
        } else { // Blue stripe
          rCol *= maskStrength
          gCol *= maskStrength
        }
      }

      // Clamp
      const idx = (y * width + x) * 4
      data[idx] = Math.max(0, Math.min(255, rCol))
      data[idx + 1] = Math.max(0, Math.min(255, gCol))
      data[idx + 2] = Math.max(0, Math.min(255, bCol))
      data[idx + 3] = 255
    }
  }
}
