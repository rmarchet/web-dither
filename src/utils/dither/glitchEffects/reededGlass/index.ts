import { applyReededGlass } from "./reededGlass";
import { DITHER_CATEGORIES } from '../../../constants';

export const reededGlass = {
  apply: applyReededGlass,
  name: 'Reeded Glass',
  description: 'A filter that creates a Reeded Glass effect on the image',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'reededGlass',
};
