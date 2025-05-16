import { applyModulatedDiffuseY } from './modulatedDiffuseY'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const modulatedDiffuseY = {
  apply: applyModulatedDiffuseY,
  name: 'Modulated Diffuse Y',
  description: 'A filter that creates a Modulated Diffuse FM effect over the image on the Y axis',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'modulatedDiffuseY',
}
