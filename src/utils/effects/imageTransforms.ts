import { DitherSettings } from '../../types'

export function toGrayscale(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = data[i + 1] = data[i + 2] = gray
  }
}

export function applyDetailEnhancement(data: Uint8ClampedArray, detail: number) {
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) { // R, G, B
      const diff = data[i + c] - 128
      const val = 128 + diff * detail
      data[i + c] = Math.max(0, Math.min(255, val))
    }
    // Alpha channel remains unchanged
  }
}

export function applyBrightness(data: Uint8ClampedArray, settings: DitherSettings) {
  const { brightness, invert } = settings
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) { // R, G, B
      const val = invert ? data[i + c] - brightness : data[i + c] + brightness
      data[i + c] = Math.max(0, Math.min(255, val))
    }
    // Alpha channel remains unchanged
  }
}

export function applyMidtones(data: Uint8ClampedArray, settings: DitherSettings) {
  const { midtones, invert } = settings
  const exponent = invert ? 1 / midtones : midtones
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) { // R, G, B
      const val = Math.pow(data[i + c] / 255, exponent) * 255
      data[i + c] = Math.max(0, Math.min(255, val))
    }
    // Alpha channel remains unchanged
  }
}

export function invertImage(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) { // R, G, B
      data[i + c] = 255 - data[i + c]
    }
    // Alpha channel remains unchanged
  }
}
