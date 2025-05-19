import { applyHalftoneSquares } from "./halftoneSquares"
import { DITHER_CATEGORIES } from "../../../utils/constants"

export const halftoneSquares = {
  apply: applyHalftoneSquares,
  name: "Halftone Squares",
  description: "Apply a halftone pattern to the image",
  category: DITHER_CATEGORIES.HALFTONE,
  handle: "halftone-squares",
}
