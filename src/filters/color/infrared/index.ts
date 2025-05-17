import { applyInfrared } from "./infrared"
import { DITHER_CATEGORIES } from '../../../utils/constants'

export const infrared = {
  apply: applyInfrared,
  name: 'Infrared',
  handle: 'infrared',
  description: 'Simulate an infrared camera filter',
  category: DITHER_CATEGORIES.COLOR,
}
