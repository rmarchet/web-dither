// --- LowpassFilter class ---
export class LowpassFilter {
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
