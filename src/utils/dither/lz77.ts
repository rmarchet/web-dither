import { ImageSettings, DitherSettings } from "../../types";

// Helper: clamp
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

// Helper: RGB to HSB
function rgb2hsb(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) h = 0;
  else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 255, s * 255, v * 255];
}

// Helper: HSB to RGB
function hsb2rgb(h: number, s: number, v: number): [number, number, number] {
  h /= 255; s /= 255; v /= 255;
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return [clamp(Math.round(r * 255), 0, 255), clamp(Math.round(g * 255), 0, 255), clamp(Math.round(b * 255), 0, 255)];
}

// LZ77 Tuple
class Tuple {
  offset: number;
  len: number;
  chr: number;
  constructor(offset: number, len: number, chr: number) {
    this.offset = offset;
    this.len = len;
    this.chr = chr;
  }
}

// LZ77 Compressor/Decompressor/Glitcher
class LZ77 {
  windowWidth: number;
  lookAheadWidth: number;
  clist: Tuple[] = [];
  constructor(windowWidth: number, lookAheadWidth: number) {
    this.windowWidth = windowWidth;
    this.lookAheadWidth = lookAheadWidth;
  }
  glitch(no: number, fac: number) {
    for (let i = 0; i < no; i++) {
      const r = this.clist[Math.floor(Math.random() * this.clist.length)];
      const what = Math.floor(Math.random() * 3);
      switch (what) {
        case 0: r.chr = Math.floor(Math.random() * 256); break;
        case 1: r.offset = Math.floor(Math.random() * (2 * this.windowWidth * fac)); break;
        default: r.len = Math.floor(Math.random() * (2 * this.lookAheadWidth * fac));
      }
    }
  }
  doCompress(buff: Uint8Array) {
    this.clist = [];
    let currByte = 1;
    this.clist.push(new Tuple(0, 0, buff[0]));
    while (currByte < buff.length) {
      const bend = Math.max(currByte - this.windowWidth, 0);
      let boff = 0, blen = 0;
      if (currByte < buff.length - 1) {
        for (let i = currByte - 1; i >= bend; i--) {
          if (buff[currByte] === buff[i]) {
            const tboff = Math.abs(i - currByte);
            let tblen = 1;
            const laEnd = Math.min(currByte + this.lookAheadWidth, buff.length - 1);
            let mi = currByte + 1;
            while (mi < laEnd && (i + mi - currByte) < currByte) {
              if (buff[mi] === buff[i + mi - currByte]) {
                mi++;
                tblen++;
              } else {
                break;
              }
            }
            if (tblen > blen) {
              blen = tblen;
              boff = tboff;
            }
          }
        }
      }
      currByte += blen + 1;
      this.clist.push(new Tuple(boff, blen, buff[currByte - 1]));
    }
  }
  doDecompress(buff: Uint8Array) {
    let i = 0;
    for (const t of this.clist) {
      if (i >= buff.length) break;
      if (t.offset === 0) {
        buff[i++] = t.chr;
      } else {
        const start = i - t.offset;
        const end = start + t.len;
        for (let c = start; c < end; c++) {
          const pos = clamp(c, 0, buff.length - 1);
          buff[clamp(i++, 0, buff.length - 1)] = buff[pos];
          if (i >= buff.length) break;
        }
        if (i >= buff.length) break;
        buff[i++] = t.chr;
      }
    }
  }
}

export const applyLZ77 = (
  image: ImageSettings,
  settings: DitherSettings
) => {
  const { width, height, data } = image;
  // Randomize color space
  const useHSB = Math.random() < 0.4;
  // Randomize compressor attributes and glitch params
  const compressor_attributes = [
    [Math.floor(Math.random() * 2900 + 100), Math.floor(Math.random() * 0.4 * (Math.random() * 2900 + 100) + 0.1 * (Math.random() * 2900 + 100))],
    [Math.floor(Math.random() * 2900 + 100), Math.floor(Math.random() * 0.4 * (Math.random() * 2900 + 100) + 0.1 * (Math.random() * 2900 + 100))],
    [Math.floor(Math.random() * 2900 + 100), Math.floor(Math.random() * 0.4 * (Math.random() * 2900 + 100) + 0.1 * (Math.random() * 2900 + 100))],
  ];
  const number_of_glitches = [
    [Math.floor(Math.random() * 980 + 20), Math.random() * 1.9 + 0.1],
    [Math.floor(Math.random() * 980 + 20), Math.random() * 1.9 + 0.1],
    [Math.floor(Math.random() * 980 + 20), Math.random() * 1.9 + 0.1],
  ];
  // Extract channels
  const len = width * height;
  const ch1 = new Uint8Array(len);
  const ch2 = new Uint8Array(len);
  const ch3 = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    if (useHSB) {
      const [h, s, v] = rgb2hsb(r, g, b);
      ch1[i] = Math.round(h);
      ch2[i] = Math.round(s);
      ch3[i] = Math.round(v);
    } else {
      ch1[i] = r;
      ch2[i] = g;
      ch3[i] = b;
    }
  }
  // Process each channel
  const comp1 = new LZ77(compressor_attributes[0][0], compressor_attributes[0][1]);
  const comp2 = new LZ77(compressor_attributes[1][0], compressor_attributes[1][1]);
  const comp3 = new LZ77(compressor_attributes[2][0], compressor_attributes[2][1]);
  comp1.doCompress(ch1);
  comp1.glitch(number_of_glitches[0][0], number_of_glitches[0][1]);
  comp1.doDecompress(ch1);
  comp2.doCompress(ch2);
  comp2.glitch(number_of_glitches[1][0], number_of_glitches[1][1]);
  comp2.doDecompress(ch2);
  comp3.doCompress(ch3);
  comp3.glitch(number_of_glitches[2][0], number_of_glitches[2][1]);
  comp3.doDecompress(ch3);
  // Write back to data
  for (let i = 0; i < len; i++) {
    const idx = i * 4;
    let r, g, b;
    if (useHSB) {
      [r, g, b] = hsb2rgb(ch1[i], ch2[i], ch3[i]);
    } else {
      r = ch1[i];
      g = ch2[i];
      b = ch3[i];
    }
    data[idx] = r;
    data[idx + 1] = g;
    data[idx + 2] = b;
    data[idx + 3] = 255;
  }
}
