import { applyColorMosaic } from "./colorMosaic";
import { DITHER_CATEGORIES } from '../../../constants';

export const colorMosaic = {
  apply: applyColorMosaic,
  name: 'Color Mosaic',
  description: 'A filter that creates a color mosaic effect',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'colorMosaic',
};
