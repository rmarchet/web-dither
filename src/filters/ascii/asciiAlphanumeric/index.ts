import { applyAsciiAlphanumeric } from './asciiAlphanumeric'
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const asciiAlphanumeric = {
  apply: applyAsciiAlphanumeric,
  name: 'Ascii Alphanumeric',
  handle: 'asciiAlphanumeric',
  description: 'A ASCII art effect that uses alphanumeric characters to represent the image',
  category: DITHER_CATEGORIES.ASCII,
}
