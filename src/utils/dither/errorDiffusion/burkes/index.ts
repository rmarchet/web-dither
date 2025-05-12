import { applyBurkes } from './burkes';
import { DITHER_CATEGORIES } from '../../../constants';

export const burkes = {
  apply: applyBurkes,
  name: 'Burkes',
  description: 'A dithering algorithm that uses a 3x3 grid to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'burkes',
};
