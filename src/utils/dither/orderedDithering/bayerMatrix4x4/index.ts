import { applyBayerMatrix4x4 } from './bayerMatrix4x4';
import { DITHER_CATEGORIES } from '../../../constants';

export const bayerMatrix4x4 = {
  apply: applyBayerMatrix4x4,
  name: 'Bayer Matrix 4x4',
  description: 'A dithering algorithm that uses a 4x4 grid to distribute error',
  category: DITHER_CATEGORIES.ORDERED_DITHERING,
  handle: 'bayerMatrix4x4',
};
