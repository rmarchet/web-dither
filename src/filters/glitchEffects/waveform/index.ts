import { applyWaveform } from './waveform';
import { DITHER_CATEGORIES } from '../../../utils/constants';

export const waveform = {
  apply: applyWaveform,
  name: 'Waveform',
  description: 'A filter that creates a Waveform effect (a glitch effect) over the image',
  category: DITHER_CATEGORIES.GLITCH_EFFECTS,
  handle: 'waveform',
};
