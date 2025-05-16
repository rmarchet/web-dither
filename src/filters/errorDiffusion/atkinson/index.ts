import { applyAtkinson } from './atkinson'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const atkinson = {
  apply: applyAtkinson,
  name: 'Atkinson',
  handle: 'atkinson',
  description: 'A dithering algorithm that uses a 3x3 grid to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
}
