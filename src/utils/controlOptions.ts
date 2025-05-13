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


export const SETTINGS = {
  style: {
    type: 'select',
    options: DITHER_STYLES,
    defaultValue: DITHER_STYLES[0],
  },
  pixelationScale: {
    type: 'range',
    defaultValue: 1,
    min: 1,
    max: 10,
    step: 1,
  },
  ditheringScale: {
    type: 'range',
    defaultValue: 1,
    min: 1,
    max: 10,
    step: 1,
  },
  detailEnhancement: {
    type: 'range',
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
  },
  brightness: {
    type: 'range',
    defaultValue: 0,
    min: -100,
    max: 100,
    step: 1,
  },
  midtones: {
    type: 'range',
    defaultValue: 1,
    min: 0,
    max: 100,
    step: 1,
  },
  noise: {
    type: 'range',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
  },
  glow: {
    type: 'range',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
  },
  luminanceThreshold: {
    type: 'range',
    defaultValue: -1,
    min: -1,
    max: 1,
    step: 0.01,
  },
  verticalScanlineFrequency: {
    type: 'range',
    defaultValue: -1,
    min: -1,
    max: 1,
    step: 0.01,
  },
  invert: {
    type: 'boolean',
    defaultValue: false,
  },
  blur: {
    type: 'range',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
  },
  amplitude: {
    type: 'range',
    defaultValue: 0.5,
    min: 0,
    max: 3,
    step: 0.01,
  },
  frequency: {
    type: 'range',
    defaultValue: 0.005,
    min: 0,
    max: 0.3,
    step: 0.005,
  },
  phase: {
    type: 'range',
    defaultValue: 0,
    min: 0,
    max: 6,
    step: 0.01,
  },
  blockSize: {
    type: 'range',
    defaultValue: 1,
    min: 1,
    max: 10,
    step: 1,
  },
  grayscale: {
    type: 'boolean',
    defaultValue: false,
  },
}

export const DEFAULT_SETTINGS = Object.fromEntries(
  Object.entries(SETTINGS).map(
    ([key, value]) => [key, value.defaultValue]
  )
);
