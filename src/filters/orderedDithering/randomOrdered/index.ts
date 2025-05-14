import { applyRandomOrdered } from './randomOrdered';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const randomOrdered = {
  apply: applyRandomOrdered,
  name: 'Random-Ordered',
  description: 'A dithering algorithm that uses a random order to distribute error',
  category: DITHER_CATEGORIES.ORDERED_DITHERING,
  handle: 'randomOrdered',
};
