import { ImageSettings } from "../../../types"

export const applyHalftoneCircles = (image: ImageSettings) => {
  const { width, height, data } = image

  // Work on a copy of the original data for calculations
  const original = new Uint8ClampedArray(data)
  // Prepare an output buffer for the effect
  const out = new Uint8ClampedArray(data.length)

  // Parameters
  const minRadius = 6
  const maxRadius = 32
  const bgColor = [245, 235, 200] // tan background
  const dotColor = [30, 30, 200] // blue dots

  // Fill background in output buffer
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4
    out[idx] = bgColor[0]
    out[idx + 1] = bgColor[1]
    out[idx + 2] = bgColor[2]
    out[idx + 3] = 255
  }

  // Helper: get grayscale brightness at (x, y) from original
  function getGray(x: number, y: number) {
    const idx = (y * width + x) * 4
    return 0.299 * original[idx] + 0.587 * original[idx + 1] + 0.114 * original[idx + 2]
  }

  // Helper: draw a filled circle into out array
  function drawCircle(cx: number, cy: number, r: number, color: number[]) {
    const r2 = r * r
    const x0 = Math.max(0, Math.floor(cx - r))
    const x1 = Math.min(width - 1, Math.ceil(cx + r))
    const y0 = Math.max(0, Math.floor(cy - r))
    const y1 = Math.min(height - 1, Math.ceil(cy + r))
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx
        const dy = y - cy
        if (dx * dx + dy * dy <= r2) {
          const idx = (y * width + x) * 4
          out[idx] = color[0]
          out[idx + 1] = color[1]
          out[idx + 2] = color[2]
          out[idx + 3] = 255
        }
      }
    }
  }

  // Use a lower-res mask for speed
  const maskStep = 4
  const maskW = Math.ceil(width / maskStep)
  const maskH = Math.ceil(height / maskStep)
  const filled = new Uint8Array(maskW * maskH)

  function isFilled(cx: number, cy: number, r: number) {
    const r2 = r * r
    for (let yy = -r; yy <= r; yy++) {
      for (let xx = -r; xx <= r; xx++) {
        if (xx * xx + yy * yy > r2) continue
        const nx = cx + xx, ny = cy + yy
        const mx = Math.floor(nx / maskStep)
        const my = Math.floor(ny / maskStep)
        if (mx < 0 || mx >= maskW || my < 0 || my >= maskH) continue
        if (filled[my * maskW + mx]) return true
      }
    }
    return false
  }

  function markFilled(cx: number, cy: number, r: number) {
    const r2 = r * r
    for (let yy = -r; yy <= r; yy++) {
      for (let xx = -r; xx <= r; xx++) {
        if (xx * xx + yy * yy > r2) continue
        const nx = cx + xx, ny = cy + yy
        const mx = Math.floor(nx / maskStep)
        const my = Math.floor(ny / maskStep)
        if (mx < 0 || mx >= maskW || my < 0 || my >= maskH) continue
        filled[my * maskW + mx] = 1
      }
    }
  }

  // Coarse-to-fine: big circles first, then smaller
  for (let r = maxRadius; r >= minRadius; r -= 4) {
    const step = Math.max(4, Math.floor(r * 0.8))
    for (let y = r; y < height - r; y += step) {
      for (let x = r; x < width - r; x += step) {
        if (isFilled(x, y, r)) continue
        const gray = getGray(x, y)
        if (gray > 180) continue
        drawCircle(x, y, r, dotColor)
        markFilled(x, y, r)
      }
    }
  }

  // Copy output buffer to data array
  for (let i = 0; i < data.length; i++) {
    data[i] = out[i]
  }
}

