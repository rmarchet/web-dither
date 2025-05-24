import { applySymbols } from "./symbols"
import { DITHER_CATEGORIES } from "../../../utils/constants"

export const symbols = {
  name: "Symbols",
  handle: "symbols",
  category: DITHER_CATEGORIES.ASCII,
  apply: applySymbols,
  description: "Apply ASCII art using symbols",
}
