/* ============================================================
   SnapStrip – Christmas photo strip templates + Canvas generator
   ============================================================ */

const PhotoStripModule = (() => {
  const STRIP_W = 600;
  const STRIP_H = 1800;
  const PHOTO_W = 520;
  const PHOTO_H = 340;          // 520:340 ≈ 1.53 (landscape-ish, like classic strips)
  const PHOTO_X = (STRIP_W - PHOTO_W) / 2;
  const PHOTO_GAP = 22;
  const TOP_MARGIN = 96;
  const BOTTOM_MARGIN = 150;

  const previewCanvas = document.getElementById('strip-preview');
  const finalCanvas = document.getElementById('strip-final');
  const previewCtx = previewCanvas.getContext('2d');
  const finalCtx = finalCanvas.getContext('2d');

  // Ensure canvases are the right size
  previewCanvas.width = STRIP_W; previewCanvas.height = STRIP_H;
  finalCanvas.width = STRIP_W; finalCanvas.height = STRIP_H;

  /* ---------------- Templates ---------------- */
  const FRAMES = [
    {
      id: 'classic-red',
      name: 'Classic Red',
      bg: '#B22222',
      border: '#D4AF37',
      accent: '#FFF8E7',
      text: '#FFF8E7',
      subText: '#F0D77A',
      swatch: 'linear-gradient(135deg,#B22222,#8B1A1A)',
      draw: drawClassicRed,
    },
    {
      id: 'forest-green',
      name: 'Forest Green',
      bg: '#174B35',
      border: '#D4AF37',
      accent: '#FFF8E7',
      text: '#FFF8E7',
      subText: '#F0D77A',
      swatch: 'linear-gradient(135deg,#174B35,#0f2a1e)',
      draw: drawForestGreen,
    },
    {
      id: 'winter-wonderland',
      name: 'Winter Wonderland',
      bg: '#EAF2F8',
      border: '#9FC5E8',
      accent: '#2C3E50',
      text: '#2C3E50',
      subText: '#5D6D7E',
      swatch: 'linear-gradient(135deg,#EAF2F8,#B8D4E8)',
      draw: drawWinterWonderland,
    },
    {
      id: 'golden-elegance',
      name: 'Golden Elegance',
      bg: '#1A1A1A',
      border: '#D4AF37',
      accent: '#F0D77A',
      text: '#F0D77A',
      subText: '#D4AF37',
      swatch: 'linear-gradient(135deg,#2a2a2a,#D4AF37)',
      draw: drawGoldenElegance,
    },
    {
      id: 'gingerbread',
      name: 'Gingerbread',
      bg: '#8B5A2B',
      border: '#F5DEB3',
      accent: '#FFF8E7',
      text: '#FFF8E7',
      subText: '#F5DEB3',
      swatch: 'linear-gradient(135deg,#8B5A2B,#C68B59)',
      draw: drawGingerbread,
    },
  ];

  function getFrames() { return FRAMES; }
  function getFrameById(id) { return FRAMES.find(f => f.id === id) || FRAMES[0]; }

  /* ---------------- Template drawing helpers ---------------- */

  function drawSnowflakes(ctx, count, color, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * STRIP_W;
      const y = Math.random() * STRIP_H;
      const r = Math.random() * 8 + 3;
      drawSnowflakeShape(ctx, x, y, r);
    }
    ctx.restore();
  }

  function drawSnowflakeShape(ctx, x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -r);
      ctx.moveTo(0, -r * 0.55);
      ctx.lineTo(-r * 0.35, -r * 0.8);
      ctx.moveTo(0, -r * 0.55);
      ctx.lineTo(r * 0.35, -r * 0.8);
      ctx.rotate(Math.PI / 3);
    }
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  function drawStars(ctx, count, color, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * STRIP_W;
      const y = Math.random() * STRIP_H;
      const r = Math.random() * 5 + 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawOrnaments(ctx, color) {
    ctx.save();
    ctx.fillStyle = color;
    const spots = [
      [40, 40], [STRIP_W - 40, 40], [40, STRIP_H - 40], [STRIP_W - 40, STRIP_H - 40],
    ];
    spots.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    ctx.restore();
  }

  /* ---------------- Template-specific background draws ---------------- */

  function drawClassicRed(ctx) {
    ctx.fillStyle = '#B22222';
    ctx.fillRect(0, 0, STRIP_W, STRIP_H);
    // border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, STRIP_W - 40, STRIP_H - 40);
    ctx.strokeStyle = 'rgba(255,248,231,0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 34, STRIP_W - 68, STRIP_H - 68);
    drawSnowflakes(ctx, 22, '#FFF8E7', 0.35);
    drawStars(ctx, 12, '#F0D77A', 0.6);
    drawOrnaments(ctx, '#D4AF37');
  }

  function drawForestGreen(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, STRIP_H);
    g.addColorStop(0, '#1d5a3f');
    g.addColorStop(1, '#0f2a1e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, STRIP_W, STRIP_H);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, STRIP_W - 48, STRIP_H - 48);
    // pine silhouettes at bottom
    ctx.fillStyle = 'rgba(10,30,20,0.55)';
    for (let i = 0; i < 7; i++) {
      const bx = 50 + i * 80;
      const by = STRIP_H - 60;
      ctx.beginPath();
      ctx.moveTo(bx, by - 60);
      ctx.lineTo(bx - 30, by);
      ctx.lineTo(bx + 30, by);
      ctx.closePath();
      ctx.fill();
    }
    drawSnowflakes(ctx, 20, '#FFF8E7', 0.4);
    drawStars(ctx, 10, '#F0D77A', 0.55);
  }

  function drawWinterWonderland(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, STRIP_H);
    g.addColorStop(0, '#F4F9FC');
    g.addColorStop(1, '#D6E6F2');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, STRIP_W, STRIP_H);
    ctx.strokeStyle = '#9FC5E8';
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, STRIP_W - 48, STRIP_H - 48);
    drawSnowflakes(ctx, 26, '#5DADE2', 0.55);
    drawStars(ctx, 14, '#2C3E50', 0.35);
    // soft hills
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.moveTo(0, STRIP_H - 80);
    ctx.quadraticCurveTo(STRIP_W / 2, STRIP_H - 140, STRIP_W, STRIP_H - 80);
    ctx.lineTo(STRIP_W, STRIP_H);
    ctx.lineTo(0, STRIP_H);
    ctx.closePath();
    ctx.fill();
  }

  function drawGoldenElegance(ctx) {
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, 0, STRIP_W, STRIP_H);
    // gold double border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 12;
    ctx.strokeRect(22, 22, STRIP_W - 44, STRIP_H - 44);
    ctx.strokeStyle = 'rgba(240,215,122,0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(38, 38, STRIP_W - 76, STRIP_H - 76);
    drawStars(ctx, 40, '#D4AF37', 0.7);
    drawSnowflakes(ctx, 12, '#F0D77A', 0.35);
    // corner flourishes
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    [[50, 50, 1, 1], [STRIP_W - 50, 50, -1, 1], [50, STRIP_H - 50, 1, -1], [STRIP_W - 50, STRIP_H - 50, -1, -1]].forEach(([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + sy * 40);
      ctx.quadraticCurveTo(x, y, x + sx * 40, y);
      ctx.stroke();
    });
  }

  function drawGingerbread(ctx) {
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(0, 0, STRIP_W, STRIP_H);
    // gingerbread dots pattern
    ctx.fillStyle = 'rgba(255,248,231,0.25)';
    for (let y = 40; y < STRIP_H; y += 60) {
      for (let x = 40; x < STRIP_W; x += 60) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.strokeStyle = '#F5DEB3';
    ctx.lineWidth = 10;
    ctx.strokeRect(22, 22, STRIP_W - 44, STRIP_H - 44);
    // candy dots corners
    const candyColors = ['#FFF8E7', '#D4AF37', '#B22222', '#174B35'];
    [[50, 50], [STRIP_W - 50, 50], [50, STRIP_H - 50], [STRIP_W - 50, STRIP_H - 50]].forEach(([x, y], i) => {
      ctx.fillStyle = candyColors[i % candyColors.length];
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
    });
    drawSnowflakes(ctx, 10, '#FFF8E7', 0.3);
  }

  /* ---------------- Strip composition ---------------- */

  function drawStrip(ctx, photos, opts) {
    const frame = getFrameById(opts.frameId);
    const filterId = opts.filterId || 'natural';
    const title = opts.title || 'Merry Christmas';
    const showDate = opts.showDate !== false;

    // 1. background
    frame.draw(ctx);

    // 2. photos
    const positions = [];
    for (let i = 0; i < 4; i++) {
      const y = TOP_MARGIN + i * (PHOTO_H + PHOTO_GAP);
      positions.push({ x: PHOTO_X, y, w: PHOTO_W, h: PHOTO_H });
    }

    const drawImagePromises = photos.slice(0, 4).map((dataUrl, i) => {
      return new Promise((resolve) => {
        if (!dataUrl) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          const p = positions[i];
          // photo shadow / white border
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          ctx.fillRect(p.x + 4, p.y + 4, p.w, p.h);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(p.x - 6, p.y - 6, p.w + 12, p.h + 12);
          ctx.restore();

          // clipped + filtered image
          ctx.save();
          ctx.beginPath();
          ctx.rect(p.x, p.y, p.w, p.h);
          ctx.clip();
          // cover-fit the photo inside the slot
          const imgRatio = img.width / img.height;
          const slotRatio = p.w / p.h;
          let sx, sy, sw, sh;
          if (imgRatio > slotRatio) {
            sh = img.height;
            sw = sh * slotRatio;
            sx = (img.width - sw) / 2;
            sy = 0;
          } else {
            sw = img.width;
            sh = sw / slotRatio;
            sx = 0;
            sy = (img.height - sh) / 2;
          }
          FiltersModule.applyToContext(ctx, img, 0, 0, img.width, img.height, filterId);
          // The above draws full image; we need to use source crop instead.
          // Re-draw with proper crop:
          ctx.clearRect(p.x, p.y, p.w, p.h);
          ctx.save();
          const f = FiltersModule.getById(filterId);
          if (f.css && f.css !== 'none') ctx.filter = f.css;
          ctx.drawImage(img, sx, sy, sw, sh, p.x, p.y, p.w, p.h);
          ctx.restore();
          ctx.restore();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = dataUrl;
      });
    });

    return Promise.all(drawImagePromises).then(() => {
      // 3. title
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // top title
      ctx.font = '700 46px "Mountains of Christmas", "Playfair Display", cursive';
      ctx.fillStyle = frame.text;
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillText(title, STRIP_W / 2, 60);
      ctx.restore();

      // 4. date / footer
      if (showDate) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '600 20px "Nunito", sans-serif';
        ctx.fillStyle = frame.subText;
        const now = new Date();
        const dateStr = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        ctx.fillText(`${dateStr}  ·  ${timeStr}`, STRIP_W / 2, STRIP_H - 78);
        ctx.restore();
      }

      // 5. small footer mark
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 16px "Nunito", sans-serif';
      ctx.fillStyle = frame.subText;
      ctx.globalAlpha = 0.85;
      ctx.fillText('SNAPSTRIP  ·  CHRISTMAS EDITION', STRIP_W / 2, STRIP_H - 46);
      ctx.restore();
    });
  }

  /* ---------------- Preview & Final ---------------- */

  function renderPreview() {
    const photos = SnapStrip.state.photos.length
      ? SnapStrip.state.photos
      : PoseGuideModule.getPhotos();
    const opts = {
      frameId: SnapStrip.state.selectedFrame,
      filterId: SnapStrip.state.selectedFilter,
      title: SnapStrip.state.title,
      showDate: SnapStrip.state.showDate,
    };
    previewCtx.clearRect(0, 0, STRIP_W, STRIP_H);
    drawStrip(previewCtx, photos, opts);
  }

  function generateFinal() {
    const photos = SnapStrip.state.photos.length
      ? SnapStrip.state.photos
      : PoseGuideModule.getPhotos();
    const opts = {
      frameId: SnapStrip.state.selectedFrame,
      filterId: SnapStrip.state.selectedFilter,
      title: SnapStrip.state.title,
      showDate: SnapStrip.state.showDate,
    };
    finalCtx.clearRect(0, 0, STRIP_W, STRIP_H);
    drawStrip(finalCtx, photos, opts);
  }

  /* ---------------- Options UI building ---------------- */

  function buildFilterGrid() {
    const grid = document.getElementById('filter-grid');
    if (!grid) return;
    grid.innerHTML = '';
    FiltersModule.getFilters().forEach(f => {
      const chip = document.createElement('button');
      chip.className = 'filter-chip' + (SnapStrip.state.selectedFilter === f.id ? ' active' : '');
      chip.dataset.filter = f.id;
      chip.innerHTML = `<span class="filter-swatch" style="filter:${f.css};"></span><span>${f.name}</span>`;
      chip.addEventListener('click', () => {
        SnapStrip.state.selectedFilter = f.id;
        grid.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderPreview();
      });
      grid.appendChild(chip);
    });
  }

  function buildFrameGrid() {
    const grid = document.getElementById('frame-grid');
    if (!grid) return;
    grid.innerHTML = '';
    FRAMES.forEach(f => {
      const chip = document.createElement('button');
      chip.className = 'frame-chip' + (SnapStrip.state.selectedFrame === f.id ? ' active' : '');
      chip.dataset.frame = f.id;
      chip.innerHTML = `<span class="frame-swatch" style="background:${f.swatch};"></span><span>${f.name}</span>`;
      chip.addEventListener('click', () => {
        SnapStrip.state.selectedFrame = f.id;
        grid.querySelectorAll('.frame-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderPreview();
      });
      grid.appendChild(chip);
    });
  }

  function init() {
    buildFilterGrid();
    buildFrameGrid();
  }

  // Build options when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for fonts to be ready if possible
    init();
  });

  return {
    getFrames, getFrameById, renderPreview, generateFinal, init,
    STRIP_W, STRIP_H,
  };
})();

window.PhotoStripModule = PhotoStripModule;