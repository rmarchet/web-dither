import { applyHalftoneLines } from "./halftoneLines"
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const halftoneLines = {
  apply: applyHalftoneLines,
  name: 'Halftone Lines',
  description: 'Halftone Lines filter with adjustable frequency, phase, and amplitude',
  category: DITHER_CATEGORIES.HALFTONE,
  handle: 'halftone-lines',
}
