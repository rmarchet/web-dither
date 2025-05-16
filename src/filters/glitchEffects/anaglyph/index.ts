import { applyAnaglyph } from './anaglyph'
import { DITHER_CATEGORIES } from '../../../utils/constants'
export const anaglyph = {
  apply: applyAnaglyph,
  name: 'Anaglyph',
  description: 'A filter that creates an Anaglyph effect (a glitch effect) over the image',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'anaglyph',
}
