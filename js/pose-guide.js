/* ============================================================
   SnapStrip – Pose guide overlay
   Reference image shown bottom-right so it never covers the face.
   ============================================================ */

const PoseGuide = {
  poses: [],
  currentIndex: 0,
  badgeEl: null,
  instrEl: null,
  imgEl: null,

  init() {
    this.badgeEl = document.getElementById('pose-badge');
    this.instrEl = document.getElementById('pose-instruction');
    this.imgEl = document.getElementById('pose-guide-img');
  },

  setPoses(poses) {
    this.poses = poses;
    this.currentIndex = 0;
  },

  updateOverlay() {
    if (!this.poses.length) return;
    const file = this.poses[this.currentIndex];
    if (this.imgEl) {
      this.imgEl.src = `assets/poses/${file}`;
      this.imgEl.style.display = 'block';
    }
    if (this.badgeEl) {
      this.badgeEl.textContent = `POSE ${this.currentIndex + 1} OF ${this.poses.length}`;
    }
    if (this.instrEl) {
      this.instrEl.textContent = 'Copy the reference image!';
    }
  },

  next() {
    if (this.currentIndex < this.poses.length - 1) {
      this.currentIndex++;
      this.updateOverlay();
    }
  },

  reset() {
    this.currentIndex = 0;
  },
};

document.addEventListener('DOMContentLoaded', () => PoseGuide.init());
window.PoseGuide = PoseGuide;
