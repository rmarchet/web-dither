import { applyFractalify } from './fractalify'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const fractalify = {
  apply: applyFractalify,
  name: 'Fractalify',
  description: 'A filter that creates a fractal overlay effect (a glitch) over the image',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'fractalify',
}
