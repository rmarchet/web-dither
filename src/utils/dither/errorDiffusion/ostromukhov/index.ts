import { applyOstromukhov } from './ostromukhov';
import { DITHER_CATEGORIES } from '../../../constants';

export const ostromukhov = {
  apply: applyOstromukhov,
  name: 'Ostromukhov',
  description: 'A dithering algorithm that uses a 2x2 grid to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'ostromukhov',
};
