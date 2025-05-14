import { applyCrt } from './crt';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const crt = {
  apply: applyCrt,
  name: 'CRT',
  description: 'A dithering algorithm that creates a CRT effect',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'crt',
};
