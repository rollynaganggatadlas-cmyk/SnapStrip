/* ============================================================
   SnapStrip – Main App Controller
   ============================================================ */

const App = {
  state: {
    screen: 'landing',
    selectedPoses: [],
    captures: [],
    currentCaptureIndex: 0,
  },

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.showScreen('landing');
    console.log('[SnapStrip] App initialized');
  },

  cacheDOM() {
    this.screens = document.querySelectorAll('.screen');
    this.startBtn = document.getElementById('start-btn');
    this.backToLandingFromSelect = document.getElementById('back-to-landing-from-select');
    this.startCaptureBtn = document.getElementById('start-capture-btn');
    this.preSelectorGrid = document.getElementById('pre-selector-grid');
    this.backToLanding = document.getElementById('back-to-landing');
    this.backToCamera = document.getElementById('back-to-camera');
    this.generateBtn = document.getElementById('generate-btn');
    this.retakePhotosBtn = document.getElementById('retake-photos-btn');
    this.anotherStripBtn = document.getElementById('another-strip-btn');
    this.downloadBtn = document.getElementById('download-btn');
  },

  bindEvents() {
    this.startBtn.addEventListener('click', () => {
      this.populatePoseSelector();
      this.showScreen('pose-selection');
    });

    this.backToLandingFromSelect.addEventListener('click', () => {
      this.showScreen('landing');
    });

    this.startCaptureBtn.addEventListener('click', () => {
      if (this.state.selectedPoses.length === 4) {
        this.state.captures = [];
        this.state.currentCaptureIndex = 0;
        this.showScreen('camera');
        if (window.Camera) Camera.start();
      }
    });

    this.backToLanding.addEventListener('click', () => {
      if (window.Camera) Camera.stop();
      this.showScreen('landing');
    });

    this.backToCamera.addEventListener('click', () => {
      this.showScreen('camera');
    });

    this.generateBtn.addEventListener('click', () => {
      if (window.PhotoStrip) {
        PhotoStrip.generate();
        this.showScreen('final');
      }
    });

    this.retakePhotosBtn.addEventListener('click', () => {
      this.state.captures = [];
      this.state.currentCaptureIndex = 0;
      this.showScreen('camera');
      if (window.Camera) Camera.start();
      if (window.Capture) Capture.reset();
    });

    this.anotherStripBtn.addEventListener('click', () => {
      this.state.captures = [];
      this.state.selectedPoses = [];
      this.state.currentCaptureIndex = 0;
      this.showScreen('landing');
      if (window.Capture) Capture.reset();
    });
  },

  showScreen(name) {
    const map = {
      'landing': 'landing',
      'pose-selection': 'pose-selection-screen',
      'camera': 'camera-screen',
      'customize': 'customize-screen',
      'final': 'final-screen',
    };
    const targetId = map[name];
    this.screens.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');
    this.state.screen = name;
  },

  populatePoseSelector() {
    const memes = [
      'meme1.jpg','meme2.jpg','meme3.jpg','meme4.jpg','meme5.jpg',
      'meme6.jpg','meme7.jpg','meme8.jpg','meme9.jpg','meme10.jpg','meme11.jpg','meme12.jpg',
      'meme13.jpg','meme14.jpg','meme15.jpg','meme16.jpg','meme17.jpg','meme18.jpg','meme19.jpg',
      'meme20.jpg'
    ];
    this.preSelectorGrid.innerHTML = '';
    this.state.selectedPoses = [];
    this.startCaptureBtn.disabled = true;
    this.startCaptureBtn.textContent = 'Start Camera (0/4 Selected)';

    memes.forEach(file => {
      const img = document.createElement('img');
      img.src = `assets/poses/${file}`;
      img.className = 'selector-item';
      img.alt = 'Pose reference';
      img.dataset.file = file;
      img.addEventListener('click', () => this.togglePose(img, file));
      this.preSelectorGrid.appendChild(img);
    });
  },

  togglePose(imgEl, file) {
    const idx = this.state.selectedPoses.indexOf(file);
    if (idx > -1) {
      this.state.selectedPoses.splice(idx, 1);
      imgEl.style.borderColor = 'transparent';
      imgEl.style.opacity = '1';
    } else {
      if (this.state.selectedPoses.length >= 4) return;
      this.state.selectedPoses.push(file);
      imgEl.style.borderColor = '#D4AF37';
      imgEl.style.opacity = '0.7';
    }
    const count = this.state.selectedPoses.length;
    this.startCaptureBtn.textContent = `Start Camera (${count}/4 Selected)`;
    this.startCaptureBtn.disabled = count !== 4;

    // Update Pose Guide
    if (window.PoseGuide) PoseGuide.setPoses(this.state.selectedPoses);
    // Preload references for the strip generation
    if (window.PhotoStrip) PhotoStrip.preloadReferences();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
