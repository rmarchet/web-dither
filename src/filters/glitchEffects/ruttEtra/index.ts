import { applyRuttEtra } from './ruttEtra';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const ruttEtra = {
  apply: applyRuttEtra,
  name: 'Rutt-Etra',
  description: 'A filter that creates a Rutt-Etra effect (a glitch effect)',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'ruttEtra',
};
