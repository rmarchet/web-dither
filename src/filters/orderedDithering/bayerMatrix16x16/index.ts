import { applyBayerMatrix16x16 } from './bayerMatrix16x16'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const bayerMatrix16x16 = {
  apply: applyBayerMatrix16x16,
  name: 'Bayer Matrix 16x16',
  description: 'A dithering algorithm that uses a 16x16 grid to distribute error',
  category: DITHER_CATEGORIES.ORDERED_DITHERING,
  handle: 'bayerMatrix16x16',
}
