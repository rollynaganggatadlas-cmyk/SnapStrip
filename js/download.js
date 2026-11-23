/* ============================================================
   SnapStrip – Download final strip as PNG (Mobile Optimized)
   ============================================================ */

const DownloadModule = (() => {
  const finalCanvas = document.getElementById('strip-final');

  function download() {
    if (!finalCanvas) return;

    try {
      const dataUrl = finalCanvas.toDataURL('image/png');
      const now = new Date();
      const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      const filename = `SnapStrip_${stamp}.png`;

      // Create a temporary link element
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = dataUrl;
      a.download = filename;
      
      // Append to body (required for Firefox and some mobile browsers)
      document.body.appendChild(a);
      
      // Trigger the click
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
      }, 1000);

    } catch (e) {
      console.error('Download failed:', e);
      alert('Download failed. Please open this link in Chrome or Safari to download.');
    }
  }

  return { download };
})();

window.DownloadModule = DownloadModule;
