/* ============================================================
   SnapStrip – App bootstrap, screen navigation, snowfall
   ============================================================ */

const SnapStrip = {
  state: {
    currentScreen: 'landing',
    photos: [],          // array of data URLs (4 max)
    currentPoseIndex: 0,
    selectedFilter: 'natural',
    selectedFrame: 'classic-red',
    title: 'Merry Christmas',
    showDate: true,
  },
};

/* ---------- Screen navigation ---------- */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add('active');
  SnapStrip.state.currentScreen = id;
  window.scrollTo(0, 0);
}

/* ---------- App initialisation ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initSnowfall();
  initLanding();
  initCameraScreen();
  initCustomizeScreen();
  initFinalScreen();
  registerServiceWorker();
});

/* ---------- Landing ---------- */
/* ---------- Landing ---------- */
function initLanding() {
  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', () => {
    resetSession();
    showScreen('camera-screen');
    
    // Camera module will request access on screen activation
    if (window.CameraModule) {
      window.CameraModule.start();
    }

    // 🔥 THIS IS THE MISSING FIX: Start the pose guide sequence!
    if (window.PoseGuideModule) {
      window.PoseGuideModule.start();
    }
  });
}

function resetSession() {
  SnapStrip.state.photos = [];
  SnapStrip.state.currentPoseIndex = 0;
  SnapStrip.state.selectedFilter = 'natural';
  SnapStrip.state.selectedFrame = 'classic-red';
  SnapStrip.state.title = 'Merry Christmas';
  SnapStrip.state.showDate = true;

  const titleInput = document.getElementById('strip-title');
  if (titleInput) titleInput.value = 'Merry Christmas';
  const dateToggle = document.getElementById('show-date');
  if (dateToggle) dateToggle.checked = true;

  if (window.CaptureModule) CaptureModule.reset();
  if (window.PoseGuideModule) PoseGuideModule.reset();
}

/* ---------- Camera screen hooks ---------- */
function initCameraScreen() {
  document.getElementById('back-to-landing').addEventListener('click', () => {
    if (window.CameraModule) CameraModule.stop();
    showScreen('landing');
  });

  document.getElementById('flip-camera').addEventListener('click', () => {
    if (window.CameraModule) CameraModule.flip();
  });

  document.getElementById('retry-camera').addEventListener('click', () => {
    if (window.CameraModule) CameraModule.start();
  });

  document.getElementById('shoot-btn').addEventListener('click', () => {
    if (window.CountdownModule) CountdownModule.startManual();
  });

  document.getElementById('skip-btn').addEventListener('click', () => {
    if (window.PoseGuideModule) PoseGuideModule.skip();
  });

  document.getElementById('retake-btn').addEventListener('click', () => {
    if (window.PoseGuideModule) PoseGuideModule.retake();
  });
}

/* ---------- Customize screen hooks ---------- */
function initCustomizeScreen() {
  document.getElementById('back-to-camera').addEventListener('click', () => {
    showScreen('camera-screen');
    if (window.CameraModule) CameraModule.start();
  });

  const titleInput = document.getElementById('strip-title');
  titleInput.addEventListener('input', (e) => {
    SnapStrip.state.title = e.target.value.trim() || 'Merry Christmas';
    if (window.PhotoStripModule) PhotoStripModule.renderPreview();
  });

  const dateToggle = document.getElementById('show-date');
  dateToggle.addEventListener('change', (e) => {
    SnapStrip.state.showDate = e.target.checked;
    if (window.PhotoStripModule) PhotoStripModule.renderPreview();
  });

  document.getElementById('generate-btn').addEventListener('click', () => {
    if (window.PhotoStripModule) {
      PhotoStripModule.generateFinal();
      showScreen('final-screen');
    }
  });
}

/* ---------- Final screen hooks ---------- */
function initFinalScreen() {
  document.getElementById('download-btn').addEventListener('click', () => {
    if (window.DownloadModule) DownloadModule.download();
  });

  document.getElementById('retake-photos-btn').addEventListener('click', () => {
    resetSession();
    showScreen('camera-screen');
    if (window.CameraModule) CameraModule.start();
  });

  document.getElementById('another-strip-btn').addEventListener('click', () => {
    if (window.PhotoStripModule) PhotoStripModule.renderPreview();
    showScreen('customize-screen');
  });
}

/* ---------- Service worker ---------- */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  }
}

/* ============================================================
   Snowfall effect
   ============================================================ */
function initSnowfall() {
  const canvas = document.getElementById('snowfall');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let flakes = [];
  const FLAKE_COUNT = window.innerWidth < 600 ? 45 : 80;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makeFlake() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + 1,
      speed: Math.random() * 0.7 + 0.3,
      drift: Math.random() * 0.6 - 0.3,
      opacity: Math.random() * 0.5 + 0.35,
    };
  }
  for (let i = 0; i < FLAKE_COUNT; i++) flakes.push(makeFlake());

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(now - last, 40);
    last = now;
    ctx.clearRect(0, 0, W, H);

    for (const f of flakes) {
      f.y += f.speed * (dt / 16);
      f.x += f.drift * (dt / 16);
      if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
      if (f.x > W + 5) f.x = -5;
      if (f.x < -5) f.x = W + 5;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* Expose globals for other modules */
window.SnapStrip = SnapStrip;
window.showScreen = showScreen;
window.resetSession = resetSession;