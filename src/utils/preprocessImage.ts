import { DitherSettings, ImageSettings } from '../types';
import { fastBoxBlur } from './fastBoxBlur';

export const preprocessImage = (image: ImageSettings, settings: DitherSettings) => {
  const { data, width, height } = image;

  // 1. Convert to grayscale
  for (let i = 0; i < data.length; i += 4) {
    let gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = gray;
  }

  // 2. Apply blur ONCE to the grayscale image
  if (settings.blur > 0) {
    const blurRadius = Math.round(settings.blur / 20); // adjust as needed
    fastBoxBlur(data, width, height, blurRadius);
  }

  // 3. Per-pixel adjustments (detail, brightness, midtones, invert, etc)
  for (let i = 0; i < data.length; i += 4) {
    let gray = data[i];
    let detail = settings.detailEnhancement / 50; // 0–2, higher = more contrast
    let brightness = settings.brightness;
    let midtones = settings.midtones;
    if (settings.invert) {
      brightness = -brightness;
      midtones = 1 / midtones;
    }
    // Apply detail enhancement
    if (detail !== 1) {
      const diff = gray - 128;
      gray = 128 + diff * detail;
    }
    // Apply brightness
    gray = Math.max(0, Math.min(255, gray + brightness));
    // Apply midtones
    gray = Math.pow(gray / 255, midtones) * 255;
    // Apply luminance threshold (binarize) only if set
    if (settings.luminanceThreshold >= 0) {
      // gray = gray < settings.luminanceThreshold ? 0 : 255;
    }
    // Invert if requested
    if (settings.invert) {
      gray = 255 - gray;
    }
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
}
