import { applyHalftoneDots } from './halftoneDots';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const halftoneDots = {
  apply: applyHalftoneDots,
  name: 'Halftone Dots',
  description: 'A filter that creates a halftone dots effect',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'halftone-dots',
};
