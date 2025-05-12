import { applyGaussian } from './gaussian';
import { DITHER_CATEGORIES } from '../../../constants';

export const gaussian = {
  apply: applyGaussian,
  name: 'Gaussian',
  description: 'A dithering algorithm that uses a Gaussian distribution to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'gaussian',
};
