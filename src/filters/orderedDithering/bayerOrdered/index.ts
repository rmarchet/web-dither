import { applyBayerOrdered } from './bayerOrdered'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const bayerOrdered = {
  apply: applyBayerOrdered,
  name: 'Bayer Ordered',
  description: 'A dithering algorithm that uses a Bayer matrix to distribute error',
  category: DITHER_CATEGORIES.ORDERED_DITHERING,
  handle: 'bayerOrdered',
}
