import { applySepia } from "./sepia"
import { DITHER_CATEGORIES } from "../../../utils/constants"

export const sepia = {
  handle: "sepia",
  name: "Sepia",
  apply: applySepia,
  description: "Apply a sepia tone to the image",
  category: DITHER_CATEGORIES.COLOR,
}
