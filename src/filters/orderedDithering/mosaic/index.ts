import { applyMosaic } from './mosaic'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const mosaic = {
  apply: applyMosaic,
  name: 'Mosaic',
  description: 'A dithering algorithm that uses a mosaic to distribute error',
  category: DITHER_CATEGORIES.ORDERED_DITHERING,
  handle: 'mosaic',
}
