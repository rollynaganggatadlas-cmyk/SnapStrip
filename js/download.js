/* ============================================================
   SnapStrip – Download final strip as PNG
   ============================================================ */

const DownloadModule = (() => {
  const finalCanvas = document.getElementById('strip-final');

  function download() {
    if (!finalCanvas) return;

    try {
      const dataUrl = finalCanvas.toDataURL('image/png');
      const now = new Date();
      const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      const filename = `SnapStrip_Christmas_${stamp}.png`;

      // Check if the user is in a restricted in-app browser (Messenger, FB, IG, etc.)
      const isInAppBrowser = /FBAN|FBAV|Instagram|Messenger/i.test(navigator.userAgent);

      if (isInAppBrowser) {
        // Open the image in a new tab so they can long-press and save
        const newTab = window.open();
        newTab.document.write(`
          <html>
            <head><title>Save Image</title></head>
            <body style="margin:0; background:#174B35; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; color:white; font-family:sans-serif;">
              <p style="font-size:1.2rem; margin-bottom:1rem; text-align:center; padding: 0 20px;">Tap and hold the image to Save to Photos</p>
              <img src="${dataUrl}" style="max-width:100%; max-height:80vh; border-radius:12px; border:2px solid #D4AF37;">
            </body>
          </html>
        `);
        newTab.document.close();
      } else {
        // Standard browser download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 1000);
      }

    } catch (e) {
      console.error('Download failed:', e);
      alert('Download failed. Please open this link in Chrome or Safari to download.');
    }
  }

  return { download };
})();

window.DownloadModule = DownloadModule;