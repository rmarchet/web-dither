import { applyBayerVoid } from './bayerVoid';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const bayerVoid = {
  apply: applyBayerVoid,
  name: 'Bayer Void',
  description: 'A dithering algorithm that uses a Bayer matrix to distribute error',
  category: DITHER_CATEGORIES.ORDERED_DITHERING,
  handle: 'bayerVoid',
};
