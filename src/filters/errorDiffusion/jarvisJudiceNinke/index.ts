import { applyJarvisJudiceNinke } from './jarvisJudiceNinke'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const jarvisJudiceNinke = {
  apply: applyJarvisJudiceNinke,
  name: 'Jarvis-Judice-Ninke',
  description: 'A dithering algorithm that uses a 3x3 grid to distribute error',
  category: DITHER_CATEGORIES.ERROR_DIFFUSION,
  handle: 'jarvisJudiceNinke',
}
