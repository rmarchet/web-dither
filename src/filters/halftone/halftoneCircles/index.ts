import { applyHalftoneCircles } from "./halftoneCircles"
import { DITHER_CATEGORIES } from "../../../utils/constants"

export const halftoneCircles = {
  handle: "halftoneCircles",
  name: "Halftone Circles",
  description: "Apply a halftone circles effect to the image",
  category: DITHER_CATEGORIES.HALFTONE,
  apply: applyHalftoneCircles,
}
