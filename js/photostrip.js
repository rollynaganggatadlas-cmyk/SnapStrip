/* ============================================================
   SnapStrip – Photo strip rendering (preview + final)
   ============================================================ */

const PhotoStrip = {
  width: 1200,
  height: 1500,

  init() {
    const titleInput = document.getElementById('strip-title');
    const dateToggle = document.getElementById('show-date');
    if (titleInput) titleInput.addEventListener('input', () => this.renderPreview());
    if (dateToggle) dateToggle.addEventListener('change', () => this.renderPreview());
    this.renderFrames();
  },

  renderFrames() {
    const grid = document.getElementById('frame-grid');
    if (!grid) return;
    const frames = [
      { id: 'classic', name: 'Classic', color: '#FFF8E7' },
      { id: 'red', name: 'Red', color: '#B22222' },
      { id: 'green', name: 'Green', color: '#174B35' },
    ];
    this.frameId = 'classic';
    grid.innerHTML = '';
    frames.forEach(f => {
      const chip = document.createElement('div');
      chip.className = 'frame-chip' + (f.id === this.frameId ? ' active' : '');
      chip.innerHTML = `<span class="frame-swatch" style="background:${f.color}"></span><span>${f.name}</span>`;
      chip.addEventListener('click', () => {
        this.frameId = f.id;
        grid.querySelectorAll('.frame-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.renderPreview();
      });
      grid.appendChild(chip);
    });
  },

  getFrameColor() {
    if (this.frameId === 'red') return '#B22222';
    if (this.frameId === 'green') return '#174B35';
    return '#FFF8E7';
  },

  renderPreview() {
    const canvas = document.getElementById('strip-preview');
    if (!canvas) return;
    this.draw(canvas);
  },

  draw(canvas) {
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    const frameColor = this.getFrameColor();
    const isDark = frameColor === '#174B35' || frameColor === '#B22222';
    const textColor = isDark ? '#FFF8E7' : '#174B35';

    // Background
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // Border inset
    ctx.strokeStyle = isDark ? 'rgba(255,248,231,0.5)' : 'rgba(178,34,34,0.5)';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, this.width - 40, this.height - 40);

    // Photos (4 slots, 2x2 grid)
    const padding = 50;
    const gap = 24;
    const photoW = (this.width - padding * 2 - gap) / 2;
    const photoH = photoW * 0.75;
    const startY = 180;
    const captures = App.state.captures;

    ctx.save();
    ctx.filter = Filters.getCSS();
    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = padding + col * (photoW + gap);
      const y = startY + row * (photoH + gap);

      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(x, y, photoW, photoH);

      if (captures[i]) {
        const img = new Image();
        img.src = captures[i];
        if (img.complete) {
          this.drawImageCover(ctx, img, x, y, photoW, photoH);
        } else {
          img.onload = () => {
            this.drawImageCover(ctx, img, x, y, photoW, photoH);
          };
        }
      }
    }
    ctx.restore();

    // Title
    const title = (document.getElementById('strip-title')?.value || 'Merry Christmas').trim();
    ctx.fillStyle = textColor;
    ctx.font = '700 56px "Mountains of Christmas", cursive';
    ctx.textAlign = 'center';
    ctx.fillText(title || 'Merry Christmas', this.width / 2, 110);

    // Date
    if (document.getElementById('show-date')?.checked) {
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      ctx.font = 'italic 400 32px "Playfair Display", serif';
      ctx.fillStyle = isDark ? 'rgba(255,248,231,0.8)' : 'rgba(23,75,53,0.8)';
      ctx.fillText(date, this.width / 2, this.height - 60);
    }
  },

  drawImageCover(ctx, img, x, y, w, h) {
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
  },

  generate() {
    const finalCanvas = document.getElementById('strip-final');
    if (!finalCanvas) return;
    this.draw(finalCanvas);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  PhotoStrip.init();
  // Re-render preview when entering customize screen
  const observer = new MutationObserver(() => {
    const customize = document.getElementById('customize-screen');
    if (customize && customize.classList.contains('active')) {
      PhotoStrip.renderPreview();
    }
  });
  document.querySelectorAll('.screen').forEach(s => {
    observer.observe(s, { attributes: true, attributeFilter: ['class'] });
  });
});
window.PhotoStrip = PhotoStrip;
