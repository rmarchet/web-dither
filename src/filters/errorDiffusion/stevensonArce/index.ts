import { applyStevensonArce } from './stevensonArce';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const stevensonArce = {
  apply: applyStevensonArce,
  name: 'Stevenson-Arce',
  description: 'A dithering algorithm that uses a 3x3 grid to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'stevensonArce',
};
