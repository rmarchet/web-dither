import { applyAsciiColor } from "./asciiColor"
import { DITHER_CATEGORIES } from "../../../utils/constants"
export const asciiColor = {
  name: "Ascii Color",
  handle: "asciiColor",
  apply: applyAsciiColor,
  description: "Apply ASCII art with text and background color",
  category: DITHER_CATEGORIES.ASCII,
}
