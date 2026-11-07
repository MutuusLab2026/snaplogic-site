/* Web fonts: Google Fonts only for Korean and English, loaded without blocking the page (Chinese and Japanese use the device fonts). */
window.loadWebFonts = function (lang) {
  if (window.__webFontsLoaded || (lang !== 'ko' && lang !== 'en')) return;
  window.__webFontsLoaded = true;
  var pc = document.createElement('link'); pc.rel = 'preconnect'; pc.href = 'https://fonts.googleapis.com';
  var pg = document.createElement('link'); pg.rel = 'preconnect'; pg.href = 'https://fonts.gstatic.com'; pg.crossOrigin = '';
  var css = document.createElement('link'); css.rel = 'stylesheet';
  css.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&family=Inter:wght@400..800&family=Space+Grotesk:wght@400..700&family=Noto+Sans+KR:wght@400..700&display=swap';
  document.head.appendChild(pc); document.head.appendChild(pg); document.head.appendChild(css);
};
(function () {
  var saved = null, nav = (navigator.language || '').toLowerCase();
  try { saved = localStorage.getItem('lang'); } catch (_) {}
  var lang = saved || (nav.indexOf('zh') === 0 ? 'zh' : 'ko');
  window.addEventListener('load', function () { window.loadWebFonts(lang); });
})();
