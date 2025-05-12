import { applyStucki } from './stucki';
import { DITHER_CATEGORIES } from '../../../constants';

export const stucki = {
  apply: applyStucki,
  name: 'Stucki',
  description: 'A dithering algorithm that uses a 3x3 grid to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'stucki',
};
