import { applyWaveformAlt } from './waveformAlt'
import { DITHER_CATEGORIES } from '../../../utils/constants'
export const waveformAlt = {
  apply: applyWaveformAlt,
  name: 'Waveform Alt',
  description: 'A filter that creates a Waveform effect (a glitch effect) over the image',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'waveformAlt',
}
