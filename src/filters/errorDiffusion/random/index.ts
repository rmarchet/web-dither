import { applyRandom } from './random';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const random = {
  apply: applyRandom,
  name: 'Random',
  description: 'A dithering algorithm that uses a random pattern to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'random',
};
