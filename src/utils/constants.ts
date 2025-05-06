//  <optgroup label="_________">

// Define the dither styles as a const array
export const DITHER_OPTIONS = {
  'Default': [
    'None',
  ],
  'Error Diffusion': [
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
  'Ordered Dithering': [
    'Bayer-Ordered',
    'Bayer-Void',
    'Random-Ordered',
    'Bit Tone',
    'Mosaic'
  ],
  'Glitch Effects': [
    'Atkinson-VHS',
    'Modulated Diffuse Y',
    'Smooth Diffuse',
    'Glitch',
  ],
} as const;

// Flatten all dither options into a single array
export const DITHER_STYLES = Object.values(DITHER_OPTIONS).flat() as const;

// Add a list of styles that support dithering scale
export const SCALED_STYLES = DITHER_STYLES as const;
