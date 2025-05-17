import { applyHalftone } from './halftone'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const halftone = {
  apply: applyHalftone,
  name: 'Halftone',
  description: 'A dithering algorithm that uses a 2x2 grid to distribute error',
  category: DITHER_CATEGORIES.HALFTONE,
  handle: 'halftone',
}
