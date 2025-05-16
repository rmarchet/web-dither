import { applyLZ77 } from './lz77'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const lz77 = {
  apply: applyLZ77,
  name: 'LZ77',
  description: 'A filter that simulates LZ77 compression',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'lz77',
}
