import { applyJpegGlitch } from "./jpegGlitch"
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const jpegGlitch = {
  apply: applyJpegGlitch,
  name: 'JPEG Glitch',
  description: 'A filter that creates a JPEG Glitch effect',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'jpegGlitch',
}
