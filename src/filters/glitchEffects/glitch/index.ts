import { applyGlitch } from './glitch';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const glitch = {
  apply: applyGlitch,
  name: 'Glitch',
  description: 'A filter that creates a dithering with a glitch effect',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'glitch',
};
