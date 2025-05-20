import { applySolarize } from "./solarize"
import { DITHER_CATEGORIES } from "../../../utils/constants"

export const solarize = {
  apply: applySolarize,
  category: DITHER_CATEGORIES.COLOR,
  name: "Solarize",
  description: "Applies a solarize effect to the image",
  handle: "solarize",
}
