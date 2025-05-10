import { DitherSettings, ImageSettings } from '../../types';

// --- YIQ conversion ---
function rgb2yiq(r: number, g: number, b: number): [number, number, number] {
  // Scale input to 0-1 range
  r = r / 255;
  g = g / 255;
  b = b / 255;
  
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const i = 0.596 * r - 0.274 * g - 0.322 * b;
  const q = 0.211 * r - 0.523 * g + 0.312 * b;
  
  // Scale output to match Processing's range
  return [y * 256, i * 256, q * 256];
}

function yiq2rgb(y: number, i: number, q: number): [number, number, number] {
  // Scale input from Processing's range to 0-1
  y = y / 256;
  i = i / 256;
  q = q / 256;
  
  let r = y + 0.956 * i + 0.621 * q;
  let g = y - 0.272 * i - 0.647 * q;
  let b = y - 1.106 * i + 1.703 * q;
  
  // Scale back to 0-255 and clamp
  r = Math.max(0, Math.min(255, r * 255));
  g = Math.max(0, Math.min(255, g * 255));
  b = Math.max(0, Math.min(255, b * 255));
  
  return [r, g, b];
}

// --- LowpassFilter class ---
class LowpassFilter {
  private prev = 0;
  private alpha = 0;
  setFilter(rate: number, hz: number) {
    const timeInterval = 1.0 / rate;
    const tau = 1.0 / (hz * 2 * Math.PI);
    this.alpha = timeInterval / (tau + timeInterval);
  }
  resetFilter(val = 0) { this.prev = val; }
  lowpass(sample: number) {
    this.prev = this.prev + this.alpha * (sample - this.prev);
    return this.prev;
  }
  highpass(sample: number) {
    return sample - this.lowpass(sample);
  }
}

// --- Helper functions ---
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

// --- Main composite video simulation ---
export const applyCompositeVideo = (
  image: ImageSettings,
  settings: DitherSettings
) => {
  const { data, width, height } = image;
  const amplitude = settings.amplitude ?? 1;
  const phase = settings.phase ?? 0;
  const noise = settings.noise ?? 0;
  const frequency = settings.frequency ?? 1;

  // --- Parameters (tune as needed or expose as settings) ---
  const composite_in_chroma_lowpass = true;
  const subcarrier_amplitude = 40 * amplitude;
  const subcarrier_amplitude_back = 40 * amplitude;
  const video_scanline_phase_shift = phase;
  const video_scanline_phase_shift_offset = phase;
  const composite_preemphasis = 1; // Composite preemphasis: controls the amount of preemphasis applied to the signal
  const composite_preemphasis_cut = 315000000 / 88.0;
  const video_noise = 4000 * noise;
  const video_chroma_noise = 4000 * noise;
  const video_chroma_phase_noise = 15 * amplitude;
  const composite_out_chroma_lowpass = true;
  const composite_out_chroma_lowpass_lite = false;
  const video_chroma_loss = 0.124; // loss of color information
  const vhs_chroma_vert_blend = true;
  const vhs_sharpen = true;
  const vhs_out_sharpen = 2;
  const video_recombine = 0;
  const scanlines_scale = 1.5;
  const fm = true;
  const fm_omega = 0.62 * frequency;
  const fm_phase = phase; // FM phase: controls the phase of the FM wave
  const fm_lightness = 0.62; // FM lightness: controls how much of the signal is used for FM
  const fm_quantize = 0; // FM quantization: controls how much of the signal is quantized
  const fm_noise = noise > 0; // FM noise: controls if noise is added to the FM signal
  const fm_noise_start = 0.92 - 0.5 * noise;
  const fm_noise_stop = 1.0 + 0.5 * noise;
  const emulating_vhs = [2400000, 320000, 9]; // VHS_SP
  const fm_modulation_strength = 32 * amplitude; // Use in FM modulation step
  const brightness_compensation = 30; // Use in FM modulation step

  // --- 1. Convert to YIQ ---
  const Y = new Float32Array(width * height);
  const I = new Float32Array(width * height);
  const Q = new Float32Array(width * height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [yy, ii, qq] = rgb2yiq(data[idx], data[idx + 1], data[idx + 2]);
      Y[y * width + x] = yy;
      I[y * width + x] = ii;
      Q[y * width + x] = qq;
    }
  }

  // --- 2. Chroma lowpass (horizontal blur) ---
  function composite_lowpass(I: Float32Array, Q: Float32Array) {
    for (let y = 0; y < height; y++) {
      let prevI = I[y * width];
      let prevQ = Q[y * width];
      for (let x = 1; x < width; x++) {
        const idx = y * width + x;
        I[idx] = (I[idx] + prevI) / 2;
        Q[idx] = (Q[idx] + prevQ) / 2;
        prevI = I[idx];
        prevQ = Q[idx];
      }
    }
  }
  if (composite_in_chroma_lowpass) composite_lowpass(I, Q);

  // --- 3. QAM: chroma_into_luma ---
  const Umult = [1, 0, -1, 0];
  const Vmult = [0, 1, 0, -1];
  function chroma_into_luma(Y: Float32Array, I: Float32Array, Q: Float32Array) {
    for (let y = 0; y < height; y++) {
      let xi;
      if (video_scanline_phase_shift === 90)
        xi = (video_scanline_phase_shift_offset + (y >> 1)) & 3;
      else if (video_scanline_phase_shift === 180)
        xi = ((y & 2) + video_scanline_phase_shift_offset) & 3;
      else if (video_scanline_phase_shift === 270)
        xi = (video_scanline_phase_shift_offset - (y >> 1)) & 3;
      else
        xi = video_scanline_phase_shift_offset & 3;
      for (let x = 0; x < width; x++) {
        const sxi = (x + xi) & 3;
        const idx = y * width + x;
        let chroma = I[idx] * subcarrier_amplitude * Umult[sxi];
        chroma += Q[idx] * subcarrier_amplitude * Vmult[sxi];
        Y[idx] += chroma / 50;
        I[idx] = 0;
        Q[idx] = 0;
      }
    }
  }
  chroma_into_luma(Y, I, Q);

  // --- 4. Preemphasis (luma highpass) ---
  if (composite_preemphasis !== 0.0 && composite_preemphasis_cut > 0) {
    const pre = new LowpassFilter();
    pre.setFilter((315000000.0 * 4.0) / 88.0, composite_preemphasis_cut);
    for (let y = 0; y < height; y++) {
      pre.resetFilter(16);
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        let s = Y[idx];
        s += pre.highpass(s) * composite_preemphasis;
        Y[idx] = s;
      }
    }
  }

  // --- 5. Luma noise ---
  if (video_noise !== 0) {
    const noise_amplitude = video_noise / 32; // much lower, tune as needed
    for (let i = 0; i < Y.length; i++) {
      Y[i] = clamp(Y[i] + (Math.random() - 0.5) * noise_amplitude, 0, 255);
    }
  }

  // --- 6. QAM: chroma_from_luma ---
  function chroma_from_luma(Y: Float32Array, I: Float32Array, Q: Float32Array) {
    const chroma = new Float32Array(width);
    for (let y = 0; y < height; y++) {
      let sum = 0;
      const delay = [0, 0, 0, 0];
      let off = y * width;
      delay[2] = Y[off];
      sum += delay[2];
      delay[3] = Y[off + 1];
      sum += delay[3];
      let x;
      for (x = 0; x < width; x++) {
        let c;
        if ((x + 2) < width) c = Y[off + x + 2];
        else c = 0;
        sum -= delay[0];
        for (let j = 0; j < 3; j++) delay[j] = delay[j + 1];
        delay[3] = c;
        sum += delay[3];
        Y[x + off] = sum / 4;
        chroma[x] = c - Y[x + off];
      }
      let xi;
      if (video_scanline_phase_shift === 90)
        xi = (video_scanline_phase_shift_offset + (y >> 1)) & 3;
      else if (video_scanline_phase_shift === 180)
        xi = ((y & 2) + video_scanline_phase_shift_offset) & 3;
      else if (video_scanline_phase_shift === 270)
        xi = (video_scanline_phase_shift_offset - (y >> 1)) & 3;
      else
        xi = video_scanline_phase_shift_offset & 3;
      for (x = ((4 - xi) & 3); (x + 3) < width; x += 4) {
        chroma[x + 2] = -chroma[x + 2];
        chroma[x + 3] = -chroma[x + 3];
      }
      for (x = 0; x < width; x++) {
        chroma[x] = (chroma[x] * 50) / subcarrier_amplitude_back;
      }
      for (x = 0; (x + xi + 1) < width; x += 2) {
        I[x + off] = -chroma[x + xi];
        Q[x + off] = -chroma[x + xi + 1];
      }
      for (; x < width; x += 2) {
        I[x + off] = 0;
        Q[x + off] = 0;
      }
      for (x = 0; (x + 2) < width; x += 2) {
        I[x + off + 1] = (I[x + off] + I[x + off + 2]) / 2;
        Q[x + off + 1] = (Q[x + off] + Q[x + off + 2]) / 2;
      }
      for (; x < width; x++) {
        I[x + off] = 0;
        Q[x + off] = 0;
      }
    }
  }
  chroma_from_luma(Y, I, Q);

  // --- 7. FM/tape errors ---
  if (fm) {
    const lpf = new LowpassFilter();
    const lpf2 = new LowpassFilter();
    const lpf3 = new LowpassFilter();
    lpf.setFilter(emulating_vhs[0], emulating_vhs[1]);
    lpf2.setFilter(emulating_vhs[0], emulating_vhs[1]);
    lpf3.setFilter(emulating_vhs[0], emulating_vhs[1]);
    for (let y = 0; y < height; y++) {
      let sig_int = 0;
      let pre_m = 0;
      lpf.resetFilter();
      lpf2.resetFilter();
      lpf3.resetFilter();
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        // Scale Y value to proper range for FM modulation
        let ncs = ((Y[idx] - 128) / 128) * fm_phase;
        sig_int += ncs;
        let m = Math.sin(x * fm_omega + sig_int);
        if (fm_quantize > 0) {
          m = ((Math.round(((m + 1) / 2) * fm_quantize) / fm_quantize) * 2) - 1;
        }
        let dem = Math.abs(m - pre_m);
        const ystart = Math.floor(fm_noise_start * height);
        const ystop = Math.floor(fm_noise_stop * height);
        if (y > ystart && y < ystop && fm_noise) {
          if (Math.random() < 0.05) { // Lowered noise probability
            const s = Math.tan(((y - ystart) / (ystop - ystart)) * Math.PI - Math.PI / 2);
            if (Math.random() < s * Math.random()) {
              dem = Math.random() * 1 + 0.5; // Lowered noise amplitude
            }
          }
        }
        pre_m = m;
        let fdem = dem;
        fdem = lpf.lowpass(fdem);
        fdem = lpf2.lowpass(fdem);
        fdem = lpf3.lowpass(fdem);
        const modulated = Y[idx] + (fdem - 0.5) * fm_modulation_strength;
        Y[idx] = clamp(
          fm_lightness * Y[idx] + (1 - fm_lightness) * modulated + brightness_compensation,
          0, 255
        );
      }
    }
  }

  // Clamp Y, I, Q after FM and before chroma noise
  for (let i = 0; i < Y.length; i++) {
    Y[i] = clamp(Y[i], 0, 255);
    I[i] = clamp(I[i], -128, 128);
    Q[i] = clamp(Q[i], -128, 128);
  }

  // --- 8. Chroma noise ---
  if (video_chroma_noise !== 0) {
    let noiseU = 0, noiseV = 0;
    const noise_mod = 500; // Lowered chroma noise
    for (let i = 0; i < I.length; i++) {
      I[i] += noiseU;
      Q[i] += noiseV;
      noiseU += (Math.floor(Math.random() * noise_mod) - noise_mod / 2);
      noiseU >>= 2;
      noiseV += (Math.floor(Math.random() * noise_mod) - noise_mod / 2);
      noiseV >>= 2;
    }
  }

  // Clamp again after chroma noise
  for (let i = 0; i < Y.length; i++) {
    Y[i] = clamp(Y[i], 0, 255);
    I[i] = clamp(I[i], -128, 128);
    Q[i] = clamp(Q[i], -128, 128);
  }

  // --- 9. Chroma phase noise (hue noise) ---
  if (video_chroma_phase_noise !== 0) {
    let noise = 0;
    const noise_mod = (video_chroma_phase_noise * 2) + 1;
    for (let y = 0; y < height; y++) {
      noise += (Math.floor(Math.random() * noise_mod) - video_chroma_phase_noise);
      noise >>= 1;
      const pi = (noise * Math.PI) / 100.0;
      const sinpi = Math.sin(pi);
      const cospi = Math.cos(pi);
      const off = y * width;
      for (let x = 0; x < width; x++) {
        const idx = off + x;
        const u = I[idx];
        const v = Q[idx];
        I[idx] = u * cospi - v * sinpi;
        Q[idx] = u * sinpi + v * cospi;
      }
    }
  }

  // --- 10. VHS luma lowpass and sharpening ---
  if (emulating_vhs) {
    const luma_cut = emulating_vhs[0];
    const chroma_cut = emulating_vhs[1];
    const chroma_delay = emulating_vhs[2];
    // Luma lowpass
    const lp = [new LowpassFilter(), new LowpassFilter(), new LowpassFilter()];
    const pre = new LowpassFilter();
    for (let f = 0; f < 3; f++) lp[f].setFilter((315000000.0 * 4.0) / 88.0, luma_cut);
    pre.setFilter((315000000.0 * 4.0) / 88.0, luma_cut / 3);
    for (let y = 0; y < height; y++) {
      for (let f = 0; f < 3; f++) lp[f].resetFilter(16);
      pre.resetFilter(16);
      const off = y * width;
      for (let x = 0; x < width; x++) {
        let s = Y[x + off];
        for (let f = 0; f < 3; f++) s = lp[f].lowpass(s);
        s += pre.highpass(s) * 1.6;
        Y[x + off] = s;
      }
    }
    // Chroma lowpass
    const lpU = [new LowpassFilter(), new LowpassFilter(), new LowpassFilter()];
    const lpV = [new LowpassFilter(), new LowpassFilter(), new LowpassFilter()];
    for (let f = 0; f < 3; f++) {
      lpU[f].setFilter((315000000.0 * 4.0) / 88.0, chroma_cut);
      lpV[f].setFilter((315000000.0 * 4.0) / 88.0, chroma_cut);
    }
    for (let y = 0; y < height; y++) {
      for (let f = 0; f < 3; f++) {
        lpU[f].resetFilter(0);
        lpV[f].resetFilter(0);
      }
      const off = y * width;
      for (let x = 0; x < width; x++) {
        let s = I[x + off];
        for (let f = 0; f < 3; f++) s = lpU[f].lowpass(s);
        if (x >= chroma_delay) I[x + off - chroma_delay] = s;
        s = Q[x + off];
        for (let f = 0; f < 3; f++) s = lpV[f].lowpass(s);
        if (x >= chroma_delay) Q[x + off - chroma_delay] = s;
      }
    }
    // Chroma vertical blend
    if (vhs_chroma_vert_blend) {
      const delayU = new Float32Array(width);
      const delayV = new Float32Array(width);
      for (let y = 0; y < height; y++) {
        const off = y * width;
        for (let x = 0; x < width; x++) {
          const cU = I[x + off];
          const cV = Q[x + off];
          I[x + off] = (delayU[x] + cU + 1) / 2;
          Q[x + off] = (delayV[x] + cV + 1) / 2;
          delayU[x] = cU;
          delayV[x] = cV;
        }
      }
    }
    // VHS sharpen
    if (vhs_sharpen) {
      for (let f = 0; f < 3; f++) lp[f].setFilter((315000000.0 * 4.0) / 88.0, luma_cut * 4);
      for (let y = 0; y < height; y++) {
        for (let f = 0; f < 3; f++) lp[f].resetFilter(0);
        const off = y * width;
        for (let x = 0; x < width; x++) {
          let s = Y[x + off];
          let ts = s;
          for (let f = 0; f < 3; f++) ts = lp[f].lowpass(ts);
          Y[x + off] = s + ((s - ts) * vhs_out_sharpen * 2.0);
        }
      }
    }
  }

  // --- 11. Chroma loss ---
  if (video_chroma_loss !== 0) {
    for (let y = 0; y < height; y++) {
      if (Math.random() < video_chroma_loss) {
        const off = y * width;
        for (let x = 0; x < width; x++) {
          I[x + off] = 0;
          Q[x + off] = 0;
        }
      }
    }
  }

  // --- 12. Device-to-device simulation ---
  for (let i = 0; i < video_recombine; i++) {
    chroma_into_luma(Y, I, Q);
    chroma_from_luma(Y, I, Q);
  }

  // --- 13. Output chroma lowpass ---
  function composite_lowpass_tv(I: Float32Array, Q: Float32Array) {
    for (let y = 0; y < height; y++) {
      let prevI = I[y * width];
      let prevQ = Q[y * width];
      for (let x = 1; x < width; x++) {
        const idx = y * width + x;
        I[idx] = (I[idx] + prevI) / 2;
        Q[idx] = (Q[idx] + prevQ) / 2;
        prevI = I[idx];
        prevQ = Q[idx];
      }
    }
  }
  if (composite_out_chroma_lowpass) {
    if (composite_out_chroma_lowpass_lite) composite_lowpass_tv(I, Q);
    else composite_lowpass(I, Q);
  }

  // --- 14. Convert back to RGB ---
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b] = yiq2rgb(Y[y * width + x], I[y * width + x], Q[y * width + x]);
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  // --- 15. Scanlines overlay ---
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      data[idx] = data[idx] * 0.8;
      data[idx + 1] = data[idx + 1] * 0.5;
      data[idx + 2] = data[idx + 2] * 0.1;
    }
    if (y + 1 < height) {
      for (let x = 0; x < width; x++) {
        const idx = ((y + 1) * width + x) * 4;
        data[idx] = data[idx] * 0.1;
        data[idx + 1] = data[idx + 1] * 0.8;
        data[idx + 2] = data[idx + 2] * 0.5;
      }
    }
    if (y + 2 < height) {
      for (let x = 0; x < width; x++) {
        const idx = ((y + 2) * width + x) * 4;
        data[idx] = data[idx] * 0.5;
        data[idx + 1] = data[idx + 1] * 0.1;
        data[idx + 2] = data[idx + 2] * 0.8;
      }
    }
  }
};
