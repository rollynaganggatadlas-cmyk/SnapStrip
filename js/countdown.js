/* ============================================================
   SnapStrip – Countdown + automatic capture sequence
   ============================================================ */

const CountdownModule = (() => {
  const overlay = document.getElementById('countdown-overlay');
  const numberEl = document.getElementById('countdown-number');
  const flashCanvas = document.getElementById('flash-canvas');
  const captureCounter = document.getElementById('capture-counter');
  const hint = document.getElementById('camera-hint');

  let running = false;
  let timer = null;

  function setCounter(n) {
    captureCounter.textContent = `${n} / 4`;
  }

  function flash() {
    flashCanvas.classList.remove('flash');
    void flashCanvas.offsetWidth;
    flashCanvas.classList.add('flash');
    setTimeout(() => flashCanvas.classList.remove('flash'), 450);
  }

  function showCountdownNumber(n) {
    overlay.classList.add('visible');
    numberEl.textContent = n;
    numberEl.style.animation = 'none';
    void numberEl.offsetWidth;
    numberEl.style.animation = '';
  }

  function hideCountdown() {
    overlay.classList.remove('visible');
    numberEl.textContent = '';
  }

  function start() {
    if (running) return;
    if (!window.CameraModule || !CameraModule.isReady()) {
      hint.textContent = 'Camera not ready yet — wait a moment and try again.';
      return;
    }
    running = true;
    hint.textContent = 'Hold your pose…';
    let n = 3;
    showCountdownNumber(n);

    timer = setInterval(() => {
      n--;
      if (n > 0) {
        showCountdownNumber(n);
      } else {
        clearInterval(timer);
        timer = null;
        showCountdownNumber('📸');
        flash();
        setTimeout(() => {
          hideCountdown();
          doCapture();
        }, 260);
      }
    }, 900);
  }

  function startManual() {
    if (!running) start();
  }

  function doCapture() {
    if (!window.CaptureModule) {
      running = false;
      return;
    }
    const dataUrl = CaptureModule.captureFrame();
    if (!dataUrl) {
      hint.textContent = 'Capture failed — please try again.';
      running = false;
      return;
    }

    const idx = PoseGuideModule.getCurrentIndex();
    PoseGuideModule.setPhoto(idx, dataUrl);

    const count = PoseGuideModule.getPhotos().filter(Boolean).length;
    setCounter(count);

    running = false;

    // Move to next pose
    setTimeout(() => {
      hint.textContent = 'Get ready — the countdown starts automatically.';
      PoseGuideModule.advance();

          const photos = PoseGuideModule.getPhotos();
      const complete = photos.length === 4 && photos.every(Boolean);
      
      if (complete) {
        finishSequence();
      } else {
        // Auto-start next pose countdown after 1 second
        setTimeout(() => start(), 1000);
      }

  function finishSequence() {
    hint.textContent = 'All done! Preparing your strip…';
    setTimeout(() => {
      if (window.SnapStrip) {
        SnapStrip.state.photos = PoseGuideModule.getPhotos();
      }
      if (window.CameraModule) CameraModule.stop();
      if (window.PhotoStripModule) PhotoStripModule.renderPreview();
      window.showScreen('customize-screen');
    }, 700);
  }

  function reset() {
    if (timer) { clearInterval(timer); timer = null; }
    running = false;
    hideCountdown();
    setCounter(0);
    hint.textContent = 'Get ready — the countdown starts automatically.';
  }

  return { start, startManual, reset, flash, setCounter };
})();

window.CountdownModule = CountdownModule;
