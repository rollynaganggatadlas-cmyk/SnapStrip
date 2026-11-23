/* ============================================================
   SnapStrip – 2x2 Grid Photo Strip Generator
   ============================================================ */

const PhotoStripModule = (() => {
  const STRIP_W = 1200;
  const STRIP_H = 1500;
  
  const CELL_W = 560;
  const CELL_H = 680;
  const GAP = 20;
  const MARGIN_X = 20;
  const MARGIN_Y = 30;

  const previewCanvas = document.getElementById('strip-preview');
  const finalCanvas = document.getElementById('strip-final');
  const previewCtx = previewCanvas.getContext('2d');
  const finalCtx = finalCanvas.getContext('2d');

  previewCanvas.width = STRIP_W; previewCanvas.height = STRIP_H;
  finalCanvas.width = STRIP_W; finalCanvas.height = STRIP_H;

  const FRAMES = [
    {
      id: 'classic-blue', name: 'Classic Blue', bg: '#2A3B5C', text: '#FFFFFF', subText: '#A9B9D1',
      swatch: 'linear-gradient(135deg,#2A3B5C,#1A263C)', draw: drawClassicBlue,
    },
    {
      id: 'classic-red', name: 'Classic Red', bg: '#B22222', text: '#FFF8E7', subText: '#F0D77A',
      swatch: 'linear-gradient(135deg,#B22222,#8B1A1A)', draw: drawClassicRed,
    },
    {
      id: 'cinema', name: 'Cinema', bg: '#000000', text: '#FFF8E7', subText: '#888888',
      swatch: 'linear-gradient(135deg,#000000,#333333)', draw: drawCinema,
    },
  ];

  function getFrames() { return FRAMES; }
  function getFrameById(id) { return FRAMES.find(f => f.id === id) || FRAMES[0]; }

  function drawClassicBlue(ctx) {
    ctx.fillStyle = '#2A3B5C'; ctx.fillRect(0, 0, STRIP_W, STRIP_H);
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.strokeRect(15, 15, STRIP_W - 30, STRIP_H - 30);
  }
  function drawClassicRed(ctx) {
    ctx.fillStyle = '#B22222'; ctx.fillRect(0, 0, STRIP_W, STRIP_H);
    ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = 10; ctx.strokeRect(20, 20, STRIP_W - 40, STRIP_H - 40);
  }
  function drawCinema(ctx) {
    ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, STRIP_W, STRIP_H);
    ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, STRIP_W, 60); ctx.fillRect(0, STRIP_H - 60, STRIP_W, 60);
  }

  function drawStrip(ctx, photos, opts) {
    const frame = getFrameById(opts.frameId);
    const filterId = opts.filterId || 'natural';
    const title = opts.title || 'Merry Christmas';
    const showDate = opts.showDate !== false;

    frame.draw(ctx);

    // 4 Grid Positions
    const positions = [
      { x: MARGIN_X, y: MARGIN_Y },                             
      { x: MARGIN_X + CELL_W + GAP, y: MARGIN_Y },              
      { x: MARGIN_X, y: MARGIN_Y + CELL_H + GAP },              
      { x: MARGIN_X + CELL_W + GAP, y: MARGIN_Y + CELL_H + GAP }
    ];

    const loadPromises = [];

    for (let i = 0; i < 4; i++) {
      const userPhotoUrl = photos[i];
      const memeUrl = opts.customImages[i];
      const pos = positions[i];

      // Left: User Photo
      loadPromises.push(new Promise((resolve) => {
        if (!userPhotoUrl) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          ctx.save(); ctx.beginPath(); ctx.rect(pos.x, pos.y, (CELL_W/2)-2, CELL_H); ctx.clip();
          
          const imgRatio = img.width / img.height;
          const slotRatio = (CELL_W/2) / CELL_H;
          let sx, sy, sw, sh;
          if (imgRatio > slotRatio) { sh = img.height; sw = sh * slotRatio; sx = (img.width - sw) / 2; sy = 0; }
          else { sw = img.width; sh = sw / slotRatio; sx = 0; sy = (img.height - sh) / 2; }
          
          const f = FiltersModule.getById(filterId);
          if (f.css && f.css !== 'none') ctx.filter = f.css;
          ctx.drawImage(img, sx, sy, sw, sh, pos.x, pos.y, (CELL_W/2)-2, CELL_H);
          ctx.restore(); resolve();
        };
        img.onerror = () => resolve(); img.src = userPhotoUrl;
      }));

      // Right: Meme
      loadPromises.push(new Promise((resolve) => {
        if (!memeUrl) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          ctx.save(); ctx.beginPath(); ctx.rect(pos.x + (CELL_W/2) + 4, pos.y, (CELL_W/2)-2, CELL_H); ctx.clip();
          
          const imgRatio = img.width / img.height;
          const slotRatio = (CELL_W/2) / CELL_H;
          let sx, sy, sw, sh;
          if (imgRatio > slotRatio) { sh = img.height; sw = sh * slotRatio; sx = (img.width - sw) / 2; sy = 0; }
          else { sw = img.width; sh = sw / slotRatio; sx = 0; sy = (img.height - sh) / 2; }
          
          ctx.drawImage(img, sx, sy, sw, sh, pos.x + (CELL_W/2) + 4, pos.y, (CELL_W/2)-2, CELL_H);
          ctx.restore(); resolve();
        };
        img.onerror = () => resolve(); img.src = memeUrl;
      }));
    }

    return Promise.all(loadPromises).then(() => {
      ctx.save();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '700 50px "Mountains of Christmas", "Playfair Display", cursive'; ctx.fillStyle = frame.text;
      ctx.fillText(title, STRIP_W / 2, 70);
      ctx.restore();

      if (showDate) {
        ctx.save();
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '600 24px "Nunito", sans-serif'; ctx.fillStyle = frame.subText;
        const now = new Date();
        const dateStr = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        ctx.fillText(`${dateStr}  ·  ${timeStr}`, STRIP_W / 2, STRIP_H - 50);
        ctx.restore();
      }
    });
  }

  function renderPreview() {
    const photos = SnapStrip.state.photos.length ? SnapStrip.state.photos : PoseGuideModule.getPhotos();
    const opts = {
      frameId: SnapStrip.state.selectedFrame,
      filterId: SnapStrip.state.selectedFilter,
      title: SnapStrip.state.title,
      showDate: SnapStrip.state.showDate,
      customImages: PoseGuideModule.getCustomImages()
    };
    previewCtx.clearRect(0, 0, STRIP_W, STRIP_H);
    drawStrip(previewCtx, photos, opts);
  }

  function generateFinal() {
    const photos = SnapStrip.state.photos.length ? SnapStrip.state.photos : PoseGuideModule.getPhotos();
    const opts = {
      frameId: SnapStrip.state.selectedFrame,
      filterId: SnapStrip.state.selectedFilter,
      title: SnapStrip.state.title,
      showDate: SnapStrip.state.showDate,
      customImages: PoseGuideModule.getCustomImages()
    };
    finalCtx.clearRect(0, 0, STRIP_W, STRIP_H);
    drawStrip(finalCtx, photos, opts);
  }

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

  function init() { buildFilterGrid(); buildFrameGrid(); }
  document.addEventListener('DOMContentLoaded', () => { init(); });

  return { getFrames, getFrameById, renderPreview, generateFinal, init, STRIP_W, STRIP_H };
})();

window.PhotoStripModule = PhotoStripModule;
