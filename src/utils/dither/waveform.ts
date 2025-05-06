export const applyWaveform = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  noise: number = 0,
  amplitude: number = 64, // amplitude of the threshold wave
  frequency: number = 0.08, // frequency of the wave
  phase: number = 0, // phase offset
) => {
  // For each row, modulate the threshold using a sine wave
  for (let y = 0; y < height; y++) {
    // Calculate the threshold for this row
    const threshold = 128 + amplitude * Math.sin(frequency * y + phase);
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let gray = data[idx]; // Use red channel (assume grayscale input)
      // Add noise
      if (noise > 0) {
        gray += (Math.random() - 0.5) * noise;
      }
      const value = gray > threshold ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = value;
      data[idx + 3] = 255;
    }
  }
};
