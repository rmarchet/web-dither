import { applyBayerMatrix8x8 } from './bayerMatrix8x8'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const bayerMatrix8x8 = {
  apply: applyBayerMatrix8x8,
  name: 'Bayer Matrix 8x8',
  description: 'A dithering algorithm that uses a 8x8 grid to distribute error',
  category: DITHER_CATEGORIES.ORDERED_DITHERING,
  handle: 'bayerMatrix8x8',
}
