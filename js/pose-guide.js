/* ============================================================
   SnapStrip – Pose guide system with Reference Gallery
   ============================================================ */

const PoseGuideModule = (() => {
  const POSES = [
    { id: 'pointing', title: 'POSE 1 OF 4', instruction: 'Point at the camera and wink.', image: 'assets/poses/pointing.jpg' },
    { id: 'peace', title: 'POSE 2 OF 4', instruction: 'Show your peace sign!', image: 'assets/poses/peace.jpg' },
    { id: 'heart', title: 'POSE 3 OF 4', instruction: 'Make a little heart with your fingers.', image: 'assets/poses/heart.jpg' },
    { id: 'cute', title: 'POSE 4 OF 4', instruction: 'Put your hands beside your cheeks and smile!', image: 'assets/poses/cute.jpg' },
  ];

  // 🔥 YOUR MEME IMAGES
  const GALLERY_REFERENCES = [
    'meme1.jpg',
    'meme2.jpg',
    'meme3.jpg',
    'meme4.jpg',
    'meme5.jpg',
    'meme6.jpg',
    'meme7.jpg',
    'meme8.jpg',
    'meme9.jpg',
    'meme10.jpg'
  ];

  const badgeEl = document.getElementById('pose-badge');
  const instructionEl = document.getElementById('pose-instruction');
  const guideImgEl = document.getElementById('pose-guide-img');
  const progressDots = document.querySelectorAll('#progress-dots .dot');
  const retakeBtn = document.getElementById('retake-btn');
  
  const galleryModal = document.getElementById('gallery-modal');
  const openGalleryBtn = document.getElementById('open-gallery-btn');
  const closeGalleryBtn = document.getElementById('close-gallery-btn');
  const galleryGrid = document.getElementById('gallery-grid');

  let currentIndex = 0;
  let photos = [];       
  let onComplete = null; 
  let active = false;
  let customImages = {}; 

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
    const canRetake = !!photos[currentIndex] && active;
    retakeBtn.disabled = !canRetake;
  }

  function showPose(index) {
    if (index < 0 || index >= POSES.length) return;
    currentIndex = index;
    const pose = POSES[index];

    badgeEl.textContent = pose.title;
    instructionEl.textContent = pose.instruction;
    
    if (customImages[index]) {
      guideImgEl.src = customImages[index];
      guideImgEl.style.display = 'block';
    } else {
      guideImgEl.src = pose.image;
      guideImgEl.style.display = 'block'; 
    }

    updateProgressDots();
    updateRetakeButton();
  }

  function buildGallery() {
    galleryGrid.innerHTML = '';
    GALLERY_REFERENCES.forEach(imgName => {
      const img = document.createElement('img');
      img.src = `assets/poses/${imgName}`;
      img.className = 'gallery-item';
      img.onclick = () => {
        customImages[currentIndex] = img.src;
        showPose(currentIndex);
        closeGallery();
      };
      galleryGrid.appendChild(img);
    });
  }

  function openGallery() { galleryModal.classList.remove('hidden'); }
  function closeGallery() { galleryModal.classList.add('hidden'); }

  if (openGalleryBtn) openGalleryBtn.addEventListener('click', openGallery);
  if (closeGalleryBtn) closeGalleryBtn.addEventListener('click', closeGallery);
  if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) closeGallery();
    });
  }

  function start(callback) {
    active = true;
    photos = [];
    customImages = {}; 
    onComplete = callback || null;
    currentIndex = 0;
    buildGallery(); 
    showPose(0);
    updateProgressDots();
    updateRetakeButton();

    if (window.CountdownModule) {
      setTimeout(() => CountdownModule.start(), 1000);
    }
  }

  function advance() {
    if (!active) return;
    if (currentIndex < POSES.length - 1) {
      showPose(currentIndex + 1);
    } else {
      active = false;
      if (typeof onComplete === 'function') onComplete(photos.slice());
    }
  }

  function skip() { if (!active) return; advance(); }

  function retake() {
    if (!active) return;
    photos[currentIndex] = null;
    updateProgressDots();
    updateRetakeButton();
    showPose(currentIndex);
    if (window.CountdownModule) CountdownModule.start();
  }

  function reset() {
    active = false;
    photos = [];
    customImages = {};
    currentIndex = 0;
    onComplete = null;
    badgeEl.textContent = 'POSE 1 OF 4';
    instructionEl.textContent = 'Point at the camera and wink.';
    guideImgEl.src = 'assets/poses/pointing.jpg';
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
