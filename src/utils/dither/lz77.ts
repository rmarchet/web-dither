import { ImageSettings, DitherSettings } from "../../types";
import { clamp, rgb2hsb, hsb2rgb } from "../effects/effects";

const FREQUENCY_MULTIPLIER = 400;
const COMPRESSION_MULTIPLIER = 200;

// LZ77 Tuple
export class Tuple {
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
export class LZ77 {
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
  const { noise = 0 } = settings;

  // Randomize color space
  const useHSB = Math.random() < 0.4;
  // Randomize compressor attributes
  const compressor_attributes = [
    [Math.floor(Math.random() * COMPRESSION_MULTIPLIER + 20), Math.floor(Math.random() * 20 + 5)],
    [Math.floor(Math.random() * COMPRESSION_MULTIPLIER + 20), Math.floor(Math.random() * 20 + 5)],
    [Math.floor(Math.random() * COMPRESSION_MULTIPLIER + 20), Math.floor(Math.random() * 20 + 5)],
  ];
  // Use noise to control number and strength of glitches
  const amplitude = settings.amplitude ?? 1;
  const frequency = (settings.frequency ?? 1) * FREQUENCY_MULTIPLIER;
  const phase = settings.phase ?? 0;

  const baseGlitches = Math.floor((noise + 1) * 40 * frequency);
  const glitchFactor = (0.1 + (noise + 1) * 0.09) * amplitude;
  const phaseOffset = Math.floor(phase * 1000); // or use as a seed

  const number_of_glitches = [
    [baseGlitches, glitchFactor, phaseOffset],
    [baseGlitches, glitchFactor, phaseOffset],
    [baseGlitches, glitchFactor, phaseOffset],
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
