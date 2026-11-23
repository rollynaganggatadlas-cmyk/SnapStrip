/* ============================================================
   SnapStrip – Pose guide system with Pre-Selection
   ============================================================ */

const PoseGuideModule = (() => {
  const POSES = [
    { id: 'p1', title: 'POSE 1 OF 4', instruction: 'Copy the reference image!', image: 'assets/poses/pointing.svg' },
    { id: 'p2', title: 'POSE 2 OF 4', instruction: 'Copy the reference image!', image: 'assets/poses/peace-sign.svg' },
    { id: 'p3', title: 'POSE 3 OF 4', instruction: 'Copy the reference image!', image: 'assets/poses/finger-heart.svg' },
    { id: 'p4', title: 'POSE 4 OF 4', instruction: 'Copy the reference image!', image: 'assets/poses/cute-pose.svg' }
  ];

  const GALLERY_REFERENCES = [
    'meme1.jpg', 'meme2.jpg', 'meme3.jpg', 'meme4.jpg', 'meme5.jpg',
    'meme6.jpg', 'meme7.jpg', 'meme8.jpg', 'meme9.jpg', 'meme10.jpg'
  ];

  const badgeEl = document.getElementById('pose-badge');
  const instructionEl = document.getElementById('pose-instruction');
  const guideImgEl = document.getElementById('pose-guide-img');
  const progressDots = document.querySelectorAll('#progress-dots .dot');
  const retakeBtn = document.getElementById('retake-btn');
  
  const preSelectorGrid = document.getElementById('pre-selector-grid');
  const startCaptureBtn = document.getElementById('start-capture-btn');

  let currentIndex = 0;
  let photos = [];       
  let active = false;
  let customImages = []; // Stores the 4 selected meme URLs

  function getCurrentIndex() { return currentIndex; }
  function getPhotos() { return photos.slice(); }
  function getCustomImages() { return customImages; }

  function setPhoto(index, dataUrl) {
    photos[index] = dataUrl;
    updateProgressDots();
    updateRetakeButton();
  }

  function updateProgressDots() {
    progressDots.forEach((dot, i) => {
      dot.classList.remove('done', 'active');
      if (i < photos.length && photos[i]) dot.classList.add('done');
      if (i === currentIndex) dot.classList.add('active');
    });
  }

  function updateRetakeButton() {
    const canRetake = !!photos[currentIndex] && active;
    retakeBtn.disabled = !canRetake;
  }

  // Build the grid of 10 images for the Pre-Selection Screen
  function buildPreSelectionGrid() {
    preSelectorGrid.innerHTML = '';
    customImages = []; 
    
    GALLERY_REFERENCES.forEach(imgName => {
      const img = document.createElement('img');
      img.src = `assets/poses/${imgName}`;
      img.className = 'selector-item';
      
      img.onclick = () => {
        if (customImages.includes(img.src)) {
          // Deselect
          customImages = customImages.filter(src => src !== img.src);
          img.style.border = '2px solid transparent';
        } else {
          // Select (max 4)
          if (customImages.length < 4) {
            customImages.push(img.src);
            img.style.border = '4px solid #D4AF37'; // Gold border
          } else {
            alert("You can only select 4 poses. Tap one to remove it first.");
          }
        }
        
        startCaptureBtn.textContent = `Start Camera (${customImages.length}/4 Selected)`;
        startCaptureBtn.disabled = customImages.length !== 4;
      };
      preSelectorGrid.appendChild(img);
    });
  }

  // Called when they click "Start Camera"
  function beginSequence() {
    active = true;
    photos = [];
    currentIndex = 0;
    showPose(0);
    updateProgressDots();
    
    if (window.CountdownModule) {
      setTimeout(() => CountdownModule.start(), 1000);
    }
  }

  function showPose(index) {
    if (index < 0 || index >= POSES.length) return;
    currentIndex = index;
    badgeEl.textContent = POSES[index].title;
    instructionEl.textContent = POSES[index].instruction;
    
    // Use the selected meme, or fallback to the default SVG
    if (customImages[index]) {
      guideImgEl.src = customImages[index];
    } else {
      guideImgEl.src = POSES[index].image;
    }
    guideImgEl.style.display = 'block'; 

    updateProgressDots();
    updateRetakeButton();
  }

  function advance() {
    if (!active) return;
    if (currentIndex < POSES.length - 1) {
      showPose(currentIndex + 1);
    } else {
      active = false;
      if (window.CountdownModule) CountdownModule.finishSequence();
    }
  }

  function skip() {
    if (!active) return;
    if (window.CountdownModule) CountdownModule.startManual();
  }

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
    customImages = [];
    currentIndex = 0;
    buildPreSelectionGrid();
    startCaptureBtn.textContent = `Start Camera (0/4 Selected)`;
    startCaptureBtn.disabled = true;
    progressDots.forEach(dot => dot.classList.remove('done', 'active'));
    retakeBtn.disabled = true;
  }

  if (startCaptureBtn) {
    startCaptureBtn.addEventListener('click', () => {
      window.showScreen('camera-screen');
      if (window.CameraModule) window.CameraModule.start();
      beginSequence();
    });
  }

  return {
    getCurrentIndex, getPhotos, setPhoto, getCustomImages,
    beginSequence, advance, skip, retake, reset, showPose,
    buildPreSelectionGrid, isActive: () => active,
  };
})();

window.PoseGuideModule = PoseGuideModule;
