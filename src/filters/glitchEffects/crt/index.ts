import { applyCrt } from './crt';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const crt = {
  apply: applyCrt,
  name: 'CRT',
  description: 'A filter that creates a CRT effect (aperture grille, RGB split, barrel distortion, etc.)',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'crt',
};
