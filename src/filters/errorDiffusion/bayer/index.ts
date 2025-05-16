import { applyBayer } from './bayer'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const bayer = {
  apply: applyBayer,
  name: 'Bayer',
  description: 'A dithering algorithm that uses a Bayer matrix to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'bayer',
}
