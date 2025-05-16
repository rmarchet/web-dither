import { applyBitTone } from './bitTone'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const bitTone = {
  apply: applyBitTone,
  name: 'Bit Tone',
  description: 'A dithering algorithm that uses a bit tone to distribute error',
  category: DITHER_CATEGORIES.ORDERED_DITHERING,
  handle: 'bitTone',
}
