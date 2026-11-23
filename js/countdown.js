/* ============================================================
   SnapStrip – Auto countdown between captures
   ============================================================ */

const Countdown = {
  overlay: null,
  numEl: null,
  timer: null,
  running: false,
  value: 5,

  init() {
    this.overlay = document.getElementById('countdown-overlay');
    this.numEl = document.getElementById('countdown-number');
  },

  start() {
    this.stop();
    this.running = true;
    this.tick();
  },

  tick() {
    if (!this.running) return;
    if (this.value > 0) {
      this.overlay.classList.add('visible');
      this.numEl.textContent = this.value;
      this.numEl.style.animation = 'none';
      void this.numEl.offsetWidth;
      this.numEl.style.animation = 'popCount 0.9s cubic-bezier(0.22,1,0.36,1)';
      this.value--;
      this.timer = setTimeout(() => this.tick(), 1000);
    } else {
      this.value = 3;
      this.overlay.classList.remove('visible');
      if (window.Capture) Capture.take();
    }
  },

  stop() {
    this.running = false;
    this.value = 3;
    clearTimeout(this.timer);
    if (this.overlay) this.overlay.classList.remove('visible');
  },
};

document.addEventListener('DOMContentLoaded', () => Countdown.init());
window.Countdown = Countdown;
