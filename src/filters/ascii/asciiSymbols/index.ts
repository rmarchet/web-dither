import { applyAsciiSymbols } from "./asciiSymbols"
import { DITHER_CATEGORIES } from "../../../utils/constants"

export const asciiSymbols = {
  name: "Ascii Symbols",
  handle: "asciiSymbols",
  category: DITHER_CATEGORIES.ASCII,
  apply: applyAsciiSymbols,
  description: "Apply ASCII art using symbols only",
}
