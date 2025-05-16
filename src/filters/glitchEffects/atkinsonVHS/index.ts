import { applyAtkinsonVHS } from './atkinsonVHS'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const atkinsonVHS = {
  apply: applyAtkinsonVHS,
  name: 'Atkinson-VHS',
  description: 'A dithering algorithm that creates a VHS scanline effect',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'atkinsonVHS',
}
