import { DITHER_STYLES } from './utils/constants'

export type DitherStyle = typeof DITHER_STYLES[number];

export interface DitherSettings {
  style: DitherStyle;
  pixelationScale: number;
  ditheringScale: number;
  detailEnhancement: number;
  brightness: number;
  midtones: number;
  noise: number;
  glow: number;
  luminanceThreshold: number;
  verticalScanlineFrequency: number;
  invert: boolean;
  grayscale: boolean;
  amplitude?: number;
  frequency?: number;
  minSpacing?: number;
  maxSpacing?: number;
  maxThickness?: number;
  blockSize?: number;
  scale?: number;
  phase?: number;
  blur: number;
}

export interface ImageSettings {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}
