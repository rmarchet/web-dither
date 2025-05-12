import { ImageSettings, DitherSettings } from "../../../../types";
import { getChan, rgb2hsb, map, clamp } from "../../../effects/effects";

export const applyFractalify = (
  image: ImageSettings,
  settings: DitherSettings
) => {
  const { width, height, data } = image;

  // Randomize parameters as in Processing
  const type = Math.random() < 0.5 ? 0 : 1;
  const variant = Math.random() < 0.5 ? 0 : 1;
  const fact1 = Math.random() * 0.5 + 0.8;
  const fact2 = Math.random() * 0.5 + 0.8;
  const chan1 = Math.floor(Math.random() * 6);
  const chan2 = Math.floor(Math.random() * 6);
  const chan3 = Math.floor(Math.random() * 6);
  const chan4 = Math.floor(Math.random() * 6);
  const chan5 = Math.floor(Math.random() * 6);
  const negative = Math.random() < 0.5;
  // Random channel order for output
  const order = [0, 1, 2];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const [h, s, v] = rgb2hsb(r, g, b);
      let zx, zy, cx, cy;
      if (type === 0) {
        zx = fact1 * map(Math.sqrt(getChan(chan1, r, g, b, h, s, v, negative) * getChan(chan2, r, g, b, h, s, v, negative)), 0, 1, -1, 1);
        zy = fact1 * map(Math.sqrt(getChan(chan3, r, g, b, h, s, v, negative) * getChan(chan4, r, g, b, h, s, v, negative)), 0, 1, -1, 1);
        cx = map(x, 0, width, -1.4, 1.4);
        cy = map(y, 0, height, 1.4, -1.4);
      } else {
        cx = fact1 * map(Math.sqrt(getChan(chan1, r, g, b, h, s, v, negative) * getChan(chan2, r, g, b, h, s, v, negative)), 0, 1, -1, 1);
        cy = fact1 * map(Math.sqrt(getChan(chan3, r, g, b, h, s, v, negative) * getChan(chan4, r, g, b, h, s, v, negative)), 0, 1, -1, 1);
        zx = map(x, 0, width, -1.4, 1.4);
        zy = map(y, 0, height, -1.4, 1.4);
      }
      if (variant === 0) {
        cx *= fact2 * Math.sin(getChan(chan5, r, g, b, h, s, v, negative) * 2 * Math.PI);
        cy *= fact2 * Math.cos(getChan(chan5, r, g, b, h, s, v, negative) * 2 * Math.PI);
      } else {
        zx *= Math.sin(getChan(chan5, r, g, b, h, s, v, negative) * 2 * Math.PI);
        zy *= Math.cos(getChan(chan5, r, g, b, h, s, v, negative) * 2 * Math.PI);
      }
      let iter = 500;
      let zxn = zx, zyn = zy;
      while ((zxn * zxn + zyn * zyn) < 4.0 && iter-- > 0) {
        const tmp = zxn * zxn - zyn * zyn + cx;
        zyn = 2.0 * zxn * zyn + cy;
        zxn = tmp;
      }
      zxn = map(zxn, 0, 1.4, 0, 255);
      zyn = map(zyn, 0, 1.4, 0, 255);
      // Output color channels based on random order
      const c1 = order[0] === 0 ? zxn % 255 : order[0] === 1 ? zyn % 255 : 51 * (iter % 6);
      const c2 = order[1] === 0 ? zxn % 255 : order[1] === 1 ? zyn % 255 : 51 * (iter % 6);
      const c3 = order[2] === 0 ? zxn % 255 : order[2] === 1 ? zyn % 255 : 51 * (iter % 6);
      data[idx] = clamp(c1, 0, 255);
      data[idx + 1] = clamp(c2, 0, 255);
      data[idx + 2] = clamp(c3, 0, 255);
      data[idx + 3] = 255;
    }
  }
};
