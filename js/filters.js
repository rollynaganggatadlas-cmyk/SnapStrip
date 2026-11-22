/* ============================================================
   SnapStrip – Photo filters (canvas-based)
   ============================================================ */

const FiltersModule = (() => {
  const FILTERS = [
    { id: 'natural',   name: 'Natural',   css: 'none' },
    { id: 'vintage',   name: 'Vintage',   css: 'sepia(0.45) contrast(0.9) brightness(1.05) saturate(0.85)' },
    { id: 'warm',      name: 'Warm Xmas', css: 'sepia(0.25) saturate(1.35) brightness(1.06) hue-rotate(-8deg)' },
    { id: 'bw',        name: 'B & W',     css: 'grayscale(1) contrast(1.12) brightness(1.02)' },
    { id: 'glow',      name: 'Soft Glow', css: 'brightness(1.12) contrast(0.92) saturate(1.1) blur(0.3px)' },
    { id: 'retro',     name: 'Retro Film',css: 'sepia(0.35) contrast(1.15) saturate(0.9) brightness(1.02) hue-rotate(-5deg)' },
    { id: 'cinema',    name: 'Cinema',    css: 'contrast(1.3) saturate(0.8) sepia(0.2) brightness(0.9) hue-rotate(-10deg)' },
    { id: 'cyberpunk', name: 'Cyberpunk', css: 'contrast(1.2) saturate(2) hue-rotate(180deg)' },
    { id: 'dreamy',    name: 'Dreamy',    css: 'brightness(1.1) contrast(0.8) saturate(1.2) blur(1px)' },
    { id: 'vivid',     name: 'Vivid Pop', css: 'contrast(1.4) saturate(1.8) brightness(1.1)' }
  ];

  function getFilters() { return FILTERS; }

  function getById(id) {
    return FILTERS.find(f => f.id === id) || FILTERS[0];
  }

  /**
   * Apply a filter to an image (HTMLImageElement or canvas) and draw onto target ctx.
   * We use canvas filter property for simplicity and performance.
   */
  function applyToContext(ctx, source, dx, dy, dw, dh, filterId) {
    const f = getById(filterId);
    ctx.save();
    if (f.css && f.css !== 'none') {
      ctx.filter = f.css;
    }
    ctx.drawImage(source, dx, dy, dw, dh);
    ctx.restore();
  }

  /**
   * Filter an image data URL and return a new data URL.
   * Used for generating filtered thumbnails if needed.
   */
  function filterImageDataUrl(dataUrl, filterId, w, h) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = w || img.width;
        c.height = h || img.height;
        const cx = c.getContext('2d');
        applyToContext(cx, img, 0, 0, c.width, c.height, filterId);
        resolve(c.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  return { getFilters, getById, applyToContext, filterImageDataUrl };
})();

window.FiltersModule = FiltersModule;
