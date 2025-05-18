import { applyNeonNegative } from "./neonNegative"
import { DITHER_CATEGORIES } from "../../../utils/constants"

export const neonNegative = {
  apply: applyNeonNegative,
  name: 'Neon Negative',
  description: 'Neon Negative filter',
  category: DITHER_CATEGORIES.COLOR,
  handle: 'neon-negative',
}
