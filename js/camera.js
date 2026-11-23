/* ============================================================
   SnapStrip – Camera handling
   ============================================================ */

const Camera = {
  stream: null,
  facingMode: 'user',
  video: null,
  messageEl: null,
  retryBtn: null,
  flipBtn: null,

  init() {
    this.video = document.getElementById('video');
    this.messageEl = document.getElementById('camera-message');
    this.retryBtn = document.getElementById('retry-camera');
    this.flipBtn = document.getElementById('flip-camera');

    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => this.start());
    }
    if (this.flipBtn) {
      this.flipBtn.addEventListener('click', () => this.flip());
    }
  },

  async start() {
    try {
      if (this.stream) this.stop();
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.facingMode, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      this.video.srcObject = this.stream;
      this.video.classList.toggle('mirrored', this.facingMode === 'user');
      if (this.messageEl) this.messageEl.classList.add('hidden');
      await this.video.play();
      if (window.PoseGuide) PoseGuide.updateOverlay();
      if (window.Countdown) Countdown.start();
    } catch (err) {
      console.error('[Camera] Error:', err);
      if (this.messageEl) this.messageEl.classList.remove('hidden');
    }
  },

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (window.Countdown) Countdown.stop();
  },

  flip() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.start();
  },
};

document.addEventListener('DOMContentLoaded', () => Camera.init());
window.Camera = Camera;
