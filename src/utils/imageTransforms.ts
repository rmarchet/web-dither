import { DitherSettings } from '../types';

export function toGrayscale(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
}

export function applyDetailEnhancement(data: Uint8ClampedArray, detail: number) {
  for (let i = 0; i < data.length; i += 4) {
    const diff = data[i] - 128;
    const gray = 128 + diff * detail;
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
}

export function applyBrightness(data: Uint8ClampedArray, settings: DitherSettings) {
  const { brightness, invert } = settings;
  for (let i = 0; i < data.length; i += 4) {
    let gray = invert ? data[i] - brightness : data[i] + brightness;
    gray = Math.max(0, Math.min(255, gray));
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
}

export function applyMidtones(data: Uint8ClampedArray, settings: DitherSettings) {
  const { midtones, invert } = settings;
  const exponent = invert ? 1 / midtones : midtones;
  for (let i = 0; i < data.length; i += 4) {
    let gray = Math.pow(data[i] / 255, exponent) * 255;
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
}

export function invertImage(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const gray = 255 - data[i];
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
}
