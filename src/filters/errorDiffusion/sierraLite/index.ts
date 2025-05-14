import { applySierraLite } from './sierraLite';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const sierraLite = {
  apply: applySierraLite,
  name: 'Sierra Lite',
  description: 'A dithering algorithm that uses a 2x2 grid to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'sierraLite',
};
