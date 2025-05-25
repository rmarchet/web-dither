import { applyHalftoneCMYK } from "./halftoneCMYK"
import { DITHER_CATEGORIES } from "../../../utils/constants"

export const halftoneCMYK = {
  name: "Halftone CMYK",
  category: DITHER_CATEGORIES.HALFTONE,
  apply: applyHalftoneCMYK,
  handle: "halftoneCMYK",
  description: "Apply CMYK color halftone effect to the image",
}
