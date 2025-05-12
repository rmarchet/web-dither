export const DITHER_CATEGORIES = {
  DEFAULT: 'Default',
  ERROR_DIFFUSION: 'Error Diffusion',
  ORDERED_DITHERING: 'Ordered Dithering',
  GLITCH_EFFECTS: 'Glitch Effects',
} as const;

// Define the dither styles as a const array
export const DITHER_OPTIONS = {
  [DITHER_CATEGORIES.DEFAULT]: [
    'None',
  ],
  [DITHER_CATEGORIES.ERROR_DIFFUSION]: [
    'Floyd-Steinberg',
    'Ordered',
    'Atkinson',
    'Bayer',
    'Random',
    'Stucki',
    'Burkes',
    'Sierra',
    'Halftone',
    'Jarvis-Judice-Ninke',
    'Sierra-Lite',
    'Two-Row-Sierra',
    'Stevenson-Arce',
    'Ostromukhov',
    'Gaussian'
  ],
  [DITHER_CATEGORIES.ORDERED_DITHERING]: [
    'Bayer-Ordered',
    'Bayer-Void',
    'Random-Ordered',
    'Bit Tone',
    'Mosaic',
    'Bayer Matrix 2x2',
    'Bayer Matrix 4x4',
  ],
  [DITHER_CATEGORIES.GLITCH_EFFECTS]: [
    'Atkinson-VHS',
    'Glitch',
    'Modulated Diffuse Y',
    'Modulated Diffuse X',
    'Waveform',
    'Smooth Diffuse',
    'Lines Glitch',
    'Stuki Diffusion Lines',
    'Composite Video',
    'Fractalify',
    'LZ77',
    'Joy Plot',
    'Rutt-Etra',
    'CRT',
  ],
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

export const STORAGE_KEY = 'web-dither-image';
export const FILE_NAME_PREFIX = 'ditr-image';

