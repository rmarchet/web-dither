import { applyModulatedDiffuseX } from './modulatedDiffuseX';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const modulatedDiffuseX = {
  apply: applyModulatedDiffuseX,
  name: 'Modulated Diffuse X',
  description: 'A filter that creates a Modulated Diffuse FM effect over the image on the X axis',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'modulatedDiffuseX',
};
