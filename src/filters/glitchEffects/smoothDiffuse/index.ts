import { applySmoothDiffuse } from './smoothDiffuse';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const smoothDiffuse = {
  apply: applySmoothDiffuse,
  name: 'Smooth Diffuse',
  description: 'A filter that creates a Smooth Diffuse dithering effect',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'smoothDiffuse',
};
