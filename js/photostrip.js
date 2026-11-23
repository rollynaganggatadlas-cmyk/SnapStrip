/* ============================================================
   SnapStrip – Advanced Photo Strip Generation (Side-by-Side)
   ============================================================ */

const PhotoStrip = {
  width: 1200,
  height: 2400, // Taller canvas to fit 4 rows of side-by-side images
  imagesCache: {}, 

  init() {
    const titleInput = document.getElementById('strip-title');
    const dateToggle = document.getElementById('show-date');
    if (titleInput) titleInput.addEventListener('input', () => this.renderPreview());
    if (dateToggle) dateToggle.addEventListener('change', () => this.renderPreview());
    this.renderFrames();
    this.preloadReferences();
  },

  preloadReferences() {
    if (!window.App || !App.state.selectedPoses) return;
    App.state.selectedPoses.forEach(file => {
      const img = new Image();
      img.src = `assets/poses/${file}`;
      this.imagesCache[file] = img;
    });
  },

  renderFrames() {
    const grid = document.getElementById('frame-grid');
    if (!grid) return;
    
    const frames = [
      { id: 'classic', name: 'Classic', swatch: 'swatch-classic', color: '#FFF8E7', text: '#174B35' },
      { id: 'red', name: 'Red', swatch: 'swatch-red', color: '#B22222', text: '#FFF8E7' },
      { id: 'green', name: 'Green', swatch: 'swatch-green', color: '#174B35', text: '#FFF8E7' },
      { id: 'cinema', name: 'Cinema', swatch: 'swatch-cinema', color: '#000000', text: '#FFFFFF' },
      { id: 'vintage', name: 'Vintage', swatch: 'swatch-vintage', color: '#E6D5B8', text: '#75513B' },
    ];
    
    this.frameId = 'classic';
    grid.innerHTML = '';
    
    frames.forEach(f => {
      const chip = document.createElement('div');
      chip.className = 'frame-chip' + (f.id === this.frameId ? ' active' : '');
      chip.innerHTML = `<div class="frame-swatch ${f.swatch}"></div><span>${f.name}</span>`;
      
      chip.addEventListener('click', () => {
        this.frameId = f.id;
        grid.querySelectorAll('.frame-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.renderPreview();
      });
      grid.appendChild(chip);
    });
  },

  getFrameStyle() {
    return {
      classic: { bg: '#FFF8E7', text: '#174B35', border: '#D4AF37' },
      red: { bg: '#B22222', text: '#FFF8E7', border: '#8B1A1A' },
      green: { bg: '#174B35', text: '#FFF8E7', border: '#23684A' },
      cinema: { bg: '#000000', text: '#FFFFFF', border: '#333333' },
      vintage: { bg: '#E6D5B8', text: '#75513B', border: '#8B6B4A' }
    }[this.frameId] || { bg: '#FFF8E7', text: '#174B35', border: '#D4AF37' };
  },

  renderPreview() {
    const canvas = document.getElementById('strip-preview');
    if (!canvas) return;
    this.draw(canvas);
  },

  draw(canvas) {
    // Force the correct canvas size
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    const style = this.getFrameStyle();
    
    // Get data from App state
    const captures = window.App ? App.state.captures : [];
    const references = window.App ? App.state.selectedPoses : [];
    
    // 1. Draw Background
    ctx.fillStyle = style.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw Frame Borders
    if (this.frameId === 'cinema') {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, this.width, 150); // Top bar
      ctx.fillRect(0, this.height - 150, this.width, 150); // Bottom bar
    } else {
      ctx.strokeStyle = style.border;
      ctx.lineWidth = 16;
      ctx.strokeRect(40, 40, this.width - 80, this.height - 80);
    }

    // 2. Layout Math for Side-by-Side
    const padding = 80;
    const gap = 30;
    // Split the width in half, minus the padding
    const colW = (this.width - padding * 2 - gap) / 2; 
    // 4 rows, leaving room for the title and date
    const startY = 200; 
    const rowH = (this.height - startY - 200 - (gap * 3)) / 4; 

    // 3. Draw Title
    const title = (document.getElementById('strip-title')?.value || 'Merry Christmas').trim();
    ctx.fillStyle = style.text;
    ctx.font = '700 80px "Mountains of Christmas", cursive';
    ctx.textAlign = 'center';
    ctx.fillText(title || 'Merry Christmas', this.width / 2, 130);

    // 4. Draw Photos and References Side-by-Side
    for (let i = 0; i < 4; i++) {
      const y = startY + i * (rowH + gap);

      // --- LEFT SIDE: YOUR CAPTURED PHOTO ---
      const photoX = padding;
      
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(photoX, y, colW, rowH);

      if (captures[i]) {
        const img = new Image();
        img.src = captures[i];
        // We draw immediately assuming the image is loaded (dataURLs load instantly)
        this.drawImageCover(ctx, img, photoX, y, colW, rowH);
      }

      // --- RIGHT SIDE: REFERENCE IMAGE ---
      const refX = padding + colW + gap;

      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(refX, y, colW, rowH);

      if (references[i] && this.imagesCache[references[i]]) {
        const refImg = this.imagesCache[references[i]];
        this.drawImageCover(ctx, refImg, refX, y, colW, rowH);
      }

      // Draw a divider line between them
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(this.width / 2, y);
      ctx.lineTo(this.width / 2, y + rowH);
      ctx.stroke();
    }

    // 5. Draw Date
    if (document.getElementById('show-date')?.checked) {
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      ctx.font = 'italic 400 48px "Playfair Display", serif';
      ctx.fillStyle = this.frameId === 'cinema' ? 'rgba(255,255,255,0.6)' : (this.frameId === 'vintage' ? 'rgba(117,81,59,0.8)' : 'rgba(23,75,53,0.8)');
      ctx.fillText(date, this.width / 2, this.height - 80);
    }
  },

  drawImageCover(ctx, img, x, y, w, h) {
    ctx.save();
    // Apply the selected filter to the context
    ctx.filter = Filters.getCSS();
    
    // Math to crop the image nicely (like CSS object-fit: cover)
    const imgRatio = img.width / img.height;
    const boxRatio = w / h;
    let sx, sy, sw, sh;
    
    if (imgRatio > boxRatio) {
      sh = img.height;
      sw = sh * boxRatio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / boxRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }
    
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    ctx.restore();
  },

  generate() {
    const finalCanvas = document.getElementById('strip-final');
    if (!finalCanvas) return;
    this.draw(finalCanvas);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  PhotoStrip.init();
  
  // Re-render the preview automatically when the screen changes to Customize
  const observer = new MutationObserver(() => {
    const customize = document.getElementById('customize-screen');
    if (customize && customize.classList.contains('active')) {
      PhotoStrip.preloadReferences();
      PhotoStrip.renderPreview();
    }
  });
  
  document.querySelectorAll('.screen').forEach(s => {
    observer.observe(s, { attributes: true, attributeFilter: ['class'] });
  });
});

window.PhotoStrip = PhotoStrip;
