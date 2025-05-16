import { ImageSettings, DitherSettings } from "../../../types"
import { smoothLine } from "../../../utils/effects/effects"

const FREQUENCY_MULTIPLIER = 400

// Draw a white line of given width using Bresenham's algorithm
export const drawLine = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  lineWidth: number = 1
) => {
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1
  let err = dx + dy, e2
  while (true) {
    for (let w = -Math.floor(lineWidth / 2); w <= Math.floor(lineWidth / 2); w++) {
      const px = x0, py = y0 + w
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const idx = (py * width + px) * 4
        data[idx] = 255
        data[idx + 1] = 255
        data[idx + 2] = 255
        data[idx + 3] = 255
      }
    }
    if (x0 === x1 && y0 === y1) break
    e2 = 2 * err
    if (e2 >= dy) { err += dy; x0 += sx }
    if (e2 <= dx) { err += dx; y0 += sy }
  }
}

export const applyJoyPlot = (
  image: ImageSettings,
  settings: DitherSettings
) => {
  const { width, height, data } = image
  // Parameters (now computed from settings, with sensible defaults)
  const numLines = Math.max(10, Math.floor((settings.frequency ?? 1) * FREQUENCY_MULTIPLIER)) // more frequency = more lines
  const lineSpacing = Math.floor(height / numLines)
  const scale = (settings.amplitude ?? 1) * 100 // amplitude controls elevation scale
  const roughness = Math.max(0, (settings.phase ?? 1) * 2) // phase controls smoothing radius
  const lineWidth = 1 // can be parameterized

  // Create a black working buffer
  const out = new Uint8ClampedArray(width * height * 4)
  for (let i = 0; i < out.length; i += 4) {
    out[i] = 0
    out[i + 1] = 0
    out[i + 2] = 0
    out[i + 3] = 255
  }

  let globalMin = 255, globalMax = 0
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4
    const r = data[idx]
    const g = data[idx + 1]
    const b = data[idx + 2]
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b
    if (brightness < globalMin) globalMin = brightness
    if (brightness > globalMax) globalMax = brightness
  }

  // For each line
  for (let i = 0; i < numLines; i++) {
    // Add vertical offset based on settings.phase
    const phaseOffset = Math.round((settings.phase ?? 0) * lineSpacing)
    const y = i * lineSpacing + phaseOffset
    if (y >= height) break

    // 1. Extract brightness for this row
    const line: number[] = []
    for (let x = 0; x < width; x++) {
      // Instead of y, sample at a vertical offset
      const sampleY = Math.round((i / numLines) * (height - 1))
      const idx = (sampleY * width + x) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b
      line.push(brightness)
    }

    // 2. Normalize and invert (so higher brightness = higher elevation)
    const localMin = Math.min(...line)
    const localMax = Math.max(...line)
    const norm = line.map(v => (v - localMin) / (localMax - localMin + 1e-6))

    // 3. Scale elevation and add noise
    const noiseAmount = settings.noise ?? 0
    const elevation = norm.map((v, x) => {
      // Add small random noise to the altitude
      const noise = (Math.random() * 2 - 1) * noiseAmount
      return v * scale + noise
    })

    // 4. Smooth the elevation
    const smooth = smoothLine(elevation, roughness)

    // 5. Draw the continuous line (on the out buffer)
    let prevX = 0, prevY = Math.max(0, Math.min(height - 1, Math.round(y + smooth[0])))
    for (let x = 1; x < width; x++) {
      const plotY = Math.max(0, Math.min(height - 1, Math.round(y + smooth[x])))
      // Fill under the line with black (leave the line itself white)
      for (let fillY = plotY + 1; fillY < height; fillY++) {
        const idx = (fillY * width + x) * 4
        out[idx] = 0
        out[idx + 1] = 0
        out[idx + 2] = 0
        out[idx + 3] = 255
      }
      drawLine(out, width, height, prevX, prevY, x, plotY, lineWidth)
      prevX = x
      prevY = plotY
    }
  }

  // Copy the result back to the original data array
  for (let i = 0; i < data.length; i++) {
    data[i] = out[i]
  }
}
