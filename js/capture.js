/* ============================================================
   SnapStrip – Capture logic
   ============================================================ */

const Capture = {
  canvas: null,
  ctx: null,
  counterEl: null,
  retakeBtn: null,
  skipBtn: null,
  shootBtn: null,
  dots: [],
  max: 4,

  init() {
    this.canvas = document.getElementById('capture-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.counterEl = document.getElementById('capture-counter');
    this.retakeBtn = document.getElementById('retake-btn');
    this.skipBtn = document.getElementById('skip-btn');
    this.shootBtn = document.getElementById('shoot-btn');
    this.dots = Array.from(document.querySelectorAll('.progress-dots .dot'));

    if (this.shootBtn) this.shootBtn.addEventListener('click', () => this.take());
    if (this.retakeBtn) this.retakeBtn.addEventListener('click', () => this.retake());
    if (this.skipBtn) this.skipBtn.addEventListener('click', () => this.goToCustomize());
  },

  reset() {
    App.state.captures = [];
    App.state.currentCaptureIndex = 0;
    this.updateUI();
    if (window.PoseGuide) {
      PoseGuide.reset();
      PoseGuide.updateOverlay();
    }
  },

  take() {
    if (App.state.captures.length >= this.max) return;
    const video = document.getElementById('video');
    if (!video || !video.videoWidth) return;

    this.canvas.width = video.videoWidth;
    this.canvas.height = video.videoHeight;
    this.ctx.save();
    if (video.classList.contains('mirrored')) {
      this.ctx.translate(this.canvas.width, 0);
      this.ctx.scale(-1, 1);
    }
    this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    const dataURL = this.canvas.toDataURL('image/png');
    App.state.captures.push(dataURL);

    // Flash
    const flash = document.getElementById('flash-canvas');
    if (flash) {
      flash.classList.remove('flash');
      void flash.offsetWidth;
      flash.classList.add('flash');
    }

    App.state.currentCaptureIndex = App.state.captures.length;
    this.updateUI();

    if (App.state.captures.length >= this.max) {
      setTimeout(() => this.goToCustomize(), 600);
    } else {
      if (window.PoseGuide) PoseGuide.next();
      if (window.Countdown) {
        Countdown.value = 5;
        setTimeout(() => Countdown.start(), 600);
      }
    }
  },

  retake() {
    if (App.state.captures.length === 0) return;
    App.state.captures.pop();
    App.state.currentCaptureIndex = App.state.captures.length;
    if (window.PoseGuide && PoseGuide.currentIndex > 0) PoseGuide.currentIndex--;
    this.updateUI();
  },

  updateUI() {
    const n = App.state.captures.length;
    if (this.counterEl) this.counterEl.textContent = `${n} / ${this.max}`;
    this.dots.forEach((d, i) => {
      d.classList.toggle('done', i < n);
      d.classList.toggle('active', i === n);
    });
    if (this.retakeBtn) this.retakeBtn.disabled = n === 0;
    if (this.skipBtn) this.skipBtn.disabled = n < this.max;
  },

  goToCustomize() {
    if (window.Countdown) Countdown.stop();
    if (window.PhotoStrip) PhotoStrip.renderPreview();
    App.showScreen('customize');
  },
};

document.addEventListener('DOMContentLoaded', () => Capture.init());
window.Capture = Capture;
