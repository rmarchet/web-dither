import { DitherSettings, ImageSettings } from '../../types';
import { fastBoxBlur } from './fastBoxBlur';
import {
  toGrayscale,
  applyDetailEnhancement,
  applyBrightness,
  applyMidtones,
  invertImage
} from './imageTransforms';

export const preprocessImage = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;

  // force grayscale
  if (settings.grayscale) {
    toGrayscale(data);
  }

  if (settings.blur > 0) {
    const blurRadius = Math.round(settings.blur / 20);
    fastBoxBlur(data, width, height, blurRadius);
  }

  if (settings.detailEnhancement !== 50) {
    applyDetailEnhancement(data, settings.detailEnhancement / 50);
  }

  if (settings.brightness !== 0) {
    applyBrightness(data, settings);
  }

  if (settings.midtones !== 1) {
    applyMidtones(data, settings);
  }

  if (settings.invert) {
    invertImage(data);
  }
};
