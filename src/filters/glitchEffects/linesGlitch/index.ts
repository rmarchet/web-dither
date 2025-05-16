import { applyLinesGlitch } from './linesGlitch'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const linesGlitch = {
  apply: applyLinesGlitch,
  name: 'Lines Glitch',
  description: 'A filter that creates a Lines Glitch effect (a glitch effect)',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'linesGlitch',
}
