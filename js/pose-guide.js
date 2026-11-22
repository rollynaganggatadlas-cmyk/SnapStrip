/* ============================================================
   SnapStrip – Pose guide system
   ============================================================ */

const PoseGuideModule = (() => {
  const POSES = [
    {
      id: 'pointing',
      title: 'POSE 1 OF 4',
      instruction: 'Point at the camera and wink.',
      image: 'assets/poses/pointing.svg',
    },
    {
      id: 'peace',
      title: 'POSE 2 OF 4',
      instruction: 'Show your peace sign!',
      image: 'assets/poses/peace-sign.svg',
    },
    {
      id: 'heart',
      title: 'POSE 3 OF 4',
      instruction: 'Make a little heart with your fingers.',
      image: 'assets/poses/finger-heart.svg',
    },
    {
      id: 'cute',
      title: 'POSE 4 OF 4',
      instruction: 'Put your hands beside your cheeks and smile!',
      image: 'assets/poses/cute-pose.svg',
    },
  ];

  const badgeEl = document.getElementById('pose-badge');
  const instructionEl = document.getElementById('pose-instruction');
  const guideImgEl = document.getElementById('pose-guide-img');
  const progressDots = document.querySelectorAll('#progress-dots .dot');
  const retakeBtn = document.getElementById('retake-btn');

  let currentIndex = 0;
  let photos = [];       // data URLs of captured frames
  let onComplete = null; // callback when 4 done
  let active = false;

  function getPoses() { return POSES; }
  function getCurrentIndex() { return currentIndex; }
  function getPhotos() { return photos.slice(); }

  function setPhoto(index, dataUrl) {
    photos[index] = dataUrl;
    updateProgressDots();
    updateRetakeButton();
  }

  function updateProgressDots() {
    progressDots.forEach((dot, i) => {
      dot.classList.remove('done', 'active');
      if (i < photos.length && photos[i]) dot.classList.add('done');
      if (i === currentIndex && !photos[i]) dot.classList.add('active');
      if (i === currentIndex && photos[i]) dot.classList.add('active');
    });
  }

  function updateRetakeButton() {
    // Retake is available only if the current pose slot already has a photo
    const canRetake = !!photos[currentIndex] && active;
    retakeBtn.disabled = !canRetake;
  }

  function showPose(index) {
    if (index < 0 || index >= POSES.length) return;
    currentIndex = index;
    const pose = POSES[index];

    badgeEl.textContent = pose.title;
    instructionEl.textContent = pose.instruction;
    guideImgEl.src = pose.image;
    guideImgEl.alt = pose.instruction + ' guide';

    updateProgressDots();
    updateRetakeButton();
  }

    function start(callback) {
    active = true;
    photos = [];
    onComplete = callback || null;
    currentIndex = 0;
    showPose(0);
    updateProgressDots();
    updateRetakeButton();

    // 🔥 THIS IS THE FIX: Automatically start the countdown for Pose 1
    if (window.CountdownModule) {
      setTimeout(() => CountdownModule.start(), 1000);
    }
  }

  function advance() {
    if (!active) return;
    if (currentIndex < POSES.length - 1) {
      showPose(currentIndex + 1);
    } else {
      // Finished all 4
      active = false;
      if (typeof onComplete === 'function') onComplete(photos.slice());
    }
  }

  function skip() {
    if (!active) return;
    // If current pose has no photo, leave it empty (will be filled by a later retake).
    // Move to next pose.
    advance();
  }

  function retake() {
    if (!active) return;
    // Clear current photo and let user redo this pose
    photos[currentIndex] = null;
    updateProgressDots();
    updateRetakeButton();
    // Re-show instruction and restart countdown
    showPose(currentIndex);
    if (window.CountdownModule) CountdownModule.start();
  }

  function reset() {
    active = false;
    photos = [];
    currentIndex = 0;
    onComplete = null;
    badgeEl.textContent = 'POSE 1 OF 4';
    instructionEl.textContent = 'Point at the camera and wink.';
    guideImgEl.src = 'assets/poses/pointing.svg';
    progressDots.forEach(dot => dot.classList.remove('done', 'active'));
    retakeBtn.disabled = true;
  }

  return {
    getPoses, getCurrentIndex, getPhotos, setPhoto,
    start, advance, skip, retake, reset, showPose,
    isActive: () => active,
  };
})();

window.PoseGuideModule = PoseGuideModule;