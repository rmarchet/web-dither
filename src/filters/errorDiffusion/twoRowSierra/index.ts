import { applyTwoRowSierra } from './twoRowSierra';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const twoRowSierra = {
  apply: applyTwoRowSierra,
  name: 'Two Row Sierra',
  description: 'A dithering algorithm that uses a 2x2 grid to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'twoRowSierra',
};
