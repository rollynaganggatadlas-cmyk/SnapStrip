/* ============================================================
   SnapStrip – Expanded Filters
   ============================================================ */

const Filters = {
  current: 'none',
  list: [
    { id: 'none', name: 'Original', css: 'none' },
    { id: 'warm', name: 'Warm', css: 'sepia(0.35) saturate(1.3) brightness(1.05)' },
    { id: 'cool', name: 'Cool', css: 'hue-rotate(180deg) saturate(0.9) brightness(1.05)' },
    { id: 'bw', name: 'B&W', css: 'grayscale(1) contrast(1.1)' },
    { id: 'vintage', name: 'Vintage', css: 'sepia(0.6) contrast(1.1) brightness(0.95)' },
    { id: 'festive', name: 'Festive', css: 'saturate(1.6) contrast(1.1) hue-rotate(-10deg)' },
    { id: 'noir', name: 'Noir', css: 'grayscale(1) contrast(1.5) brightness(0.8)' },
    { id: 'dreamy', name: 'Dreamy', css: 'saturate(1.2) brightness(1.1) blur(1px)' },
    { id: 'cross', name: 'Cross', css: 'sepia(0.4) hue-rotate(-30deg) saturate(2) contrast(1.2)' },
  ],

  init() {
    this.renderGrid();
  },

  getCSS() {
    const f = this.list.find(x => x.id === this.current);
    return f ? f.css : 'none';
  },

  set(id) {
    this.current = id;
    this.renderGrid();
    if (window.PhotoStrip) PhotoStrip.renderPreview();
  },

  renderGrid() {
    const grid = document.getElementById('filter-grid');
    if (!grid) return;
    grid.innerHTML = '';
    this.list.forEach(f => {
      const chip = document.createElement('div');
      chip.className = 'filter-chip' + (f.id === this.current ? ' active' : '');
      chip.innerHTML = `<div class="filter-swatch" style="filter:${f.css}"></div><span>${f.name}</span>`;
      chip.addEventListener('click', () => this.set(f.id));
      grid.appendChild(chip);
    });
  },
};

document.addEventListener('DOMContentLoaded', () => Filters.init());
window.Filters = Filters;
