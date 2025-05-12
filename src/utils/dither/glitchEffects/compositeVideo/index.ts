import { applyCompositeVideo } from './compositeVideo';
import { DITHER_CATEGORIES } from '../../../constants';

export const compositeVideo = {
  apply: applyCompositeVideo,
  name: 'Composite Video',
  description: 'A dithering algorithm that creates a composite video effect',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'compositeVideo',
};
