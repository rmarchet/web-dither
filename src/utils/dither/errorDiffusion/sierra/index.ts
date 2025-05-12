import { applySierra } from './sierra';
import { DITHER_CATEGORIES } from '../../../constants';

export const sierra = {
  apply: applySierra,
  name: 'Sierra',
  description: 'A dithering algorithm that uses a 3x3 grid to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'sierra',
};
