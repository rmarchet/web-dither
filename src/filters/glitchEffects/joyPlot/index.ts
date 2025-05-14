import { applyJoyPlot } from './joyPlot';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const joyPlot = {
  apply: applyJoyPlot,
  name: 'Joy Plot',
  description: 'A filter that creates a Joy Plot effect similar to the one seen on the Joy Division album cover',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'joyPlot',
};
