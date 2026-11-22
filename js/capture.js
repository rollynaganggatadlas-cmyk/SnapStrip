/* ============================================================
   SnapStrip – Frame capture from video to canvas
   ============================================================ */

const CaptureModule = (() => {
  const captureCanvas = document.getElementById('capture-canvas');
  const ctx = captureCanvas.getContext('2d');

  const TARGET_W = 720;
  const TARGET_H = 960; // 3:4 portrait

  function reset() {
    // nothing persistent to reset; placeholder for symmetry
  }

  /**
   * Capture the current video frame and return a data URL (JPEG).
   * Handles mirroring for front camera to match the preview.
   */
  function captureFrame() {
    const video = window.CameraModule ? CameraModule.getVideo() : null;
    if (!video || video.videoWidth === 0) return null;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // Compute source crop to match 3:4 aspect ratio (cover)
    const targetRatio = TARGET_W / TARGET_H;
    const srcRatio = vw / vh;

    let sx, sy, sw, sh;
    if (srcRatio > targetRatio) {
      // video is wider than target — crop sides
      sh = vh;
      sw = Math.round(vh * targetRatio);
      sx = Math.round((vw - sw) / 2);
      sy = 0;
    } else {
      // video is taller — crop top/bottom
      sw = vw;
      sh = Math.round(vw / targetRatio);
      sx = 0;
      sy = Math.round((vh - sh) / 2);
    }

    captureCanvas.width = TARGET_W;
    captureCanvas.height = TARGET_H;
    ctx.clearRect(0, 0, TARGET_W, TARGET_H);

    // Mirror horizontally if front camera (to match mirrored preview)
    const facing = window.CameraModule ? CameraModule.getFacingMode() : 'user';
    if (facing === 'user') {
      ctx.save();
      ctx.translate(TARGET_W, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, TARGET_W, TARGET_H);
      ctx.restore();
    } else {
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, TARGET_W, TARGET_H);
    }

    try {
      return captureCanvas.toDataURL('image/jpeg', 0.92);
    } catch (e) {
      console.error('toDataURL failed:', e);
      return null;
    }
  }

  return { captureFrame, reset };
})();

window.CaptureModule = CaptureModule;