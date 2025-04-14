export type DitherStyle = 'Floyd-Steinberg' | 'Ordered' | 'Atkinson' | 'Bayer' | 'Random';

export interface DitherSettings {
  style: DitherStyle;
  pixelationScale: number;
  detailEnhancement: number;
  brightness: number;
  midtones: number;
  noise: number;
  glow: number;
}

export const defaultSettings: DitherSettings = {
  style: 'Floyd-Steinberg',
  pixelationScale: 5,
  detailEnhancement: 51,
  brightness: 0,
  midtones: 1.00,
  noise: 16,
  glow: 15
}; 