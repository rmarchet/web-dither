import { applyBayerMatrix2x2 } from './bayerMatrix2x2';
import { DITHER_CATEGORIES } from '../../../constants';

export const bayerMatrix2x2 = {
  apply: applyBayerMatrix2x2,
  name: 'Bayer Matrix 2x2',
  description: 'A dithering algorithm that uses a 2x2 grid to distribute error',
  category: DITHER_CATEGORIES.ORDERED_DITHERING,
  handle: 'bayerMatrix2x2',
};
