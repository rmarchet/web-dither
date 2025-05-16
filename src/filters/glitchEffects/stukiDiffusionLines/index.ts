import { applyStukiDiffusionLines } from './stukiDiffusionLines'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const stukiDiffusionLines = {
  apply: applyStukiDiffusionLines,
  name: 'Stuki Diffusion Lines',
  description: 'A filter that creates Diffusion Lines effect (a glitch effect) with Stuki\'s algorithm',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'stukiDiffusionLines',
}
