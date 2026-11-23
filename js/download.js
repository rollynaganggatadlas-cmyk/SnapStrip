/* ============================================================
   SnapStrip – Download final strip as PNG
   ============================================================ */

const Downloader = {
  init() {
    const btn = document.getElementById('download-btn');
    if (btn) btn.addEventListener('click', () => this.download());
  },

  download() {
    const canvas = document.getElementById('strip-final');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `snapstrip-christmas-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  },
};

document.addEventListener('DOMContentLoaded', () => Downloader.init());
