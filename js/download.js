/* ============================================================
   SnapStrip – Download final strip as PNG (Mobile Optimized)
   ============================================================ */

const DownloadModule = (() => {
  const finalCanvas = document.getElementById('strip-final');

  function download() {
    if (!finalCanvas) return;

    try {
      // Get the image data as a PNG
      const dataUrl = finalCanvas.toDataURL('image/png');

      if (!dataUrl || dataUrl === 'data:,') {
        alert('The image is empty. Please try generating it again.');
        return;
      }

      // Check if the user is inside a restricted in-app browser (Messenger, FB, IG, TikTok)
      const isInAppBrowser = /FBAN|FBAV|Instagram|Messenger|TikTok/i.test(navigator.userAgent);

      if (isInAppBrowser) {
        // FORCE OPEN IN NEW TAB FOR IN-APP BROWSERS
        // This is the only reliable way to save images in Messenger
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>Save Your Photo Strip</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin:0; background:#174B35; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; color:white; font-family:sans-serif; text-align:center;">
                <p style="font-size:1.2rem; margin-bottom:1rem; padding: 0 20px;">📸 <b>Tap and hold</b> the image below, then select <b>"Save Image"</b> or <b>"Add to Photos"</b>.</p>
                <img src="${dataUrl}" style="max-width:90%; max-height:75vh; border-radius:12px; border:3px solid #D4AF37;">
              </body>
            </html>
          `);
          newTab.document.close();
        } else {
          // If the browser blocks the popup, fallback to opening the data URL directly
          window.open(dataUrl, '_blank');
        }
      } else {
        // STANDARD BROWSER DOWNLOAD (Chrome, Safari, Edge)
        const a = document.createElement('a');
        a.style.display = 'none';
        
        const now = new Date();
        const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        
        a.href = dataUrl;
        a.download = `SnapStrip_${stamp}.png`;
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
        }, 1000);
      }

    } catch (e) {
      console.error('Download failed:', e);
      alert('Sorry, the download failed. Please try opening the link in Chrome or Safari.');
    }
  }

  return { download };
})();

window.DownloadModule = DownloadModule;
