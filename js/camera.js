
/* ============================================================
   SnapStrip – Camera module (MediaDevices API)
   ============================================================ */

const CameraModule = (() => {
  const video = document.getElementById('video');
  const videoWrap = document.getElementById('video-wrap');
  const messageEl = document.getElementById('camera-message');
  const messageTitle = document.getElementById('message-title');
  const messageText = document.getElementById('message-text');
  const messageIcon = document.getElementById('message-icon');

  let stream = null;
  let facingMode = 'user'; // 'user' or 'environment'
  let started = false;

  function showMessage(icon, title, text) {
    messageIcon.textContent = icon;
    messageTitle.textContent = title;
    messageText.textContent = text;
    messageEl.classList.remove('hidden');
  }
  function hideMessage() {
    messageEl.classList.add('hidden');
  }

  async function start() {
    if (started && stream) {
      // already running – just make sure video plays
      if (video.paused) video.play().catch(() => {});
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showMessage('🚫', 'Camera not supported', 'Your browser does not support camera access. Try a modern browser on HTTPS.');
      return;
    }

    showMessage('📷', 'Requesting camera…', 'Please allow camera access in your browser.');
    hideMessage(); // we'll only show on error, but keep the card ready

    try {
            const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 3840 },  // 4K resolution (phone will downscale to its max)
          height: { ideal: 2160 }, // 4K resolution
        },
        audio: false,
      };

      // Stop any existing stream first
      stop();

      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.setAttribute('playsinline', '');
      video.muted = true;

      await video.play().catch(() => {});

      // Mirror front camera for natural selfie view
      applyMirror();

      started = true;
      hideMessage();
    } catch (err) {
      console.error('Camera error:', err);
      let title = 'Camera access needed';
      let text = 'We need your permission to use the camera so you can see yourself while posing.';
      let icon = '📷';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        title = 'Permission denied';
        text = 'Camera access was blocked. Please enable it in your browser settings and try again.';
        icon = '🚫';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        title = 'No camera found';
        text = 'We could not find a camera on this device. You can still try again.';
        icon = '📵';
      } else if (err.name === 'NotReadableError') {
        title = 'Camera busy';
        text = 'Your camera is being used by another app. Close it and try again.';
        icon = '⚠️';
      } else if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        title = 'Secure connection required';
        text = 'Camera access requires HTTPS or localhost. Please open this site over HTTPS.';
        icon = '🔒';
      }
      showMessage(icon, title, text);
    }
  }

  function applyMirror() {
    if (facingMode === 'user') {
      video.classList.add('mirrored');
    } else {
      video.classList.remove('mirrored');
    }
  }

  function stop() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    video.srcObject = null;
    started = false;
  }

  async function flip() {
    facingMode = facingMode === 'user' ? 'environment' : 'user';
    const wasRunning = started;
    stop();
    if (wasRunning || document.getElementById('camera-screen').classList.contains('active')) {
      await start();
    }
  }

  function isReady() {
    return !!stream && video.readyState >= 2 && video.videoWidth > 0;
  }

  function getVideo() { return video; }
  function getStream() { return stream; }
  function getFacingMode() { return facingMode; }

  // Stop camera when leaving the page / tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && started) {
      // keep stream but pause playback; re-play when visible
      video.pause();
    } else if (!document.hidden && started) {
      video.play().catch(() => {});
    }
  });

  return { start, stop, flip, isReady, getVideo, getStream, getFacingMode };
})();

window.CameraModule = CameraModule;