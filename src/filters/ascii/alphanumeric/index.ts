import { applyAlphanumeric } from './alphanumeric'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const alphanumeric = {
  apply: applyAlphanumeric,
  name: 'Alphanumeric',
  handle: 'alphanumeric',
  description: 'A dithering algorithm that uses a 3x3 grid to distribute error',
  category: DITHER_CATEGORIES.ASCII,
}