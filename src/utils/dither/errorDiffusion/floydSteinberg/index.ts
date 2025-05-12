import { applyFloydSteinberg } from './floydSteinberg';
import { DITHER_CATEGORIES } from '../../../constants';

export const floydSteinberg = {
  apply: applyFloydSteinberg,
  name: 'Floyd-Steinberg',
  description: 'A dithering algorithm that uses a 3x3 grid to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'floydSteinberg',
};

