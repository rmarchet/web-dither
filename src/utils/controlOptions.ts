import * as dither from './dither/index';
import { DITHER_CATEGORIES } from './constants';

const dithers = Object.values(dither);

// Define the dither styles as a const array
export const DITHER_OPTIONS = {
  [DITHER_CATEGORIES.DEFAULT]: [
    'None',
  ],
  [DITHER_CATEGORIES.ERROR_DIFFUSION]: dithers.filter(d => d.category === DITHER_CATEGORIES.ERROR_DIFFUSION).map(d => d.name),
  [DITHER_CATEGORIES.ORDERED_DITHERING]: dithers.filter(d => d.category === DITHER_CATEGORIES.ORDERED_DITHERING).map(d => d.name),
  [DITHER_CATEGORIES.GLITCH_EFFECTS]: dithers.filter(d => d.category === DITHER_CATEGORIES.GLITCH_EFFECTS).map(d => d.name),
} as const;


// Flatten all dither options into a single array
export const DITHER_STYLES = Object.values(DITHER_OPTIONS).flat() as const;

// Add a list of styles that support dithering scale
export const SCALED_STYLES = DITHER_STYLES as const;

export const DEFAULT_SETTINGS = {
  style: DITHER_STYLES[0],
  pixelationScale: 1,
  ditheringScale: 1,
  detailEnhancement: 50,
  brightness: 0,
  midtones: 1,
  noise: 0,
  glow: 0,
  luminanceThreshold: -1,
  verticalScanlineFrequency: -1,
  invert: false,
  blur: 0,
  amplitude: 0.5,
  frequency: 0.02,
  phase: 0,
  blockSize: 1,
  grayscale: true,
};