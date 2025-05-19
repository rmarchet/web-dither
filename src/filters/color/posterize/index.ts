import { applyPosterize } from "./posterize"
import { DITHER_CATEGORIES } from "../../../utils/constants"

export const posterize = {
  name: "Posterize",
  category: DITHER_CATEGORIES.COLOR,
  apply: applyPosterize,
  description: "Posterize the image",
  handle: 'posterize',
}
