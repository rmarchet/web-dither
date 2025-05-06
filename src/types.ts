import { DITHER_STYLES } from './utils/constants';

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
}

export const defaultSettings: DitherSettings = {
  style: 'Floyd-Steinberg',
  pixelationScale: 5,
  ditheringScale: 1,
  detailEnhancement: 51,
  brightness: 0,
  midtones: 1.00,
  noise: 16,
  glow: 15,
  luminanceThreshold: -1,
  verticalScanlineFrequency: -1,
  invert: false
}; 