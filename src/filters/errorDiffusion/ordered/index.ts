import { applyOrdered } from './ordered';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const ordered = {
  apply: applyOrdered,
  name: 'Ordered',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'ordered',
  description: 'A dithering algorithm that uses a 3x3 grid to distribute error',
};
