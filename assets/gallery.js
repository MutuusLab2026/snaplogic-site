/* Home "Product Gallery" (#gallery): real program screens in a row that pages sideways and wraps around.
   The current screen sits in the middle; its neighbours show blurred at the sides.
   Wrapping: copies of the last and first screens sit at either end of the row. When the row comes to rest on a
   copy it jumps, without animation, to the real screen it copies, so paging past the end carries on from the start.
   Copies are hidden from screen readers and keyboard (inert). Arrow buttons, the left/right keys on the focused
   row, a click on a side screen, or a swipe/trackpad move it. */
(function () {
  var root = document.getElementById('gallery');
  if (!root) return;
  var track = root.querySelector('.ga-track');
  var real = Array.prototype.slice.call(track.querySelectorAll('.ga-slide'));
  var n = real.length;
  var COPIES = 2;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function copy(s) {
    var c = s.cloneNode(true);
    c.classList.add('ga-copy'); c.setAttribute('aria-hidden', 'true'); c.inert = true;
    c.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    return c;
  }
  for (var k = 0; k < COPIES; k++) {
    track.insertBefore(copy(real[n - 1 - k]), track.firstChild);
    track.appendChild(copy(real[k]));
  }
  var slides = Array.prototype.slice.call(track.querySelectorAll('.ga-slide'));   // copies included
  var prev = root.querySelector('.ga-prev'), next = root.querySelector('.ga-next');
  var count = root.querySelector('.ga-count');
  var pos = COPIES;                           // index in slides (copies included)

  function realIndex(p) { return ((p - COPIES) % n + n) % n; }
  function target(p) { var s = slides[p]; return s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2; }
  function jump(p) {                           // move without animation (wrapping, resizing, first paint)
    track.style.scrollSnapType = 'none';
    track.scrollLeft = target(p);
    void track.offsetWidth;
    track.style.scrollSnapType = '';
    pos = p;
  }
  function go(p) {
    p = Math.max(0, Math.min(slides.length - 1, p));
    track.scrollTo({ left: target(p), behavior: reduce ? 'auto' : 'smooth' });
  }
  function nearest() {
    var best = 0, bd = Infinity;
    slides.forEach(function (s, i) { var d = Math.abs(target(i) - track.scrollLeft); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  function paint() {
    slides.forEach(function (s, i) {
      var on = i === pos;
      s.classList.toggle('is-on', on);
      if (!s.classList.contains('ga-copy')) s.setAttribute('aria-hidden', String(!on));
    });
    if (count) count.textContent = (realIndex(pos) + 1) + ' / ' + n;
  }
  // While scrolling, mark the screen nearest the middle; once the row rests, swap a copy for the real screen.
  var settle = 0;
  function rest() {
    pos = nearest();
    if (pos < COPIES || pos >= COPIES + n) jump(COPIES + realIndex(pos));
    paint();
  }
  track.addEventListener('scroll', function () {
    pos = nearest(); paint();
    clearTimeout(settle); settle = setTimeout(rest, 140);
  }, { passive: true });
  if ('onscrollend' in window) track.addEventListener('scrollend', function () { clearTimeout(settle); rest(); });
  prev.addEventListener('click', function () { go(pos - 1); });
  next.addEventListener('click', function () { go(pos + 1); });
  slides.forEach(function (s, i) { s.addEventListener('click', function (e) { if (i !== pos) { e.preventDefault(); go(i); } }); });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(pos + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(pos - 1); }
  });
  window.addEventListener('resize', function () { jump(pos); paint(); });

  // Accessible names follow the page language (switchLanguage only rewrites text, not aria-label).
  function labels() {
    var t = i18n[document.documentElement.lang] || i18n.ko;
    prev.setAttribute('aria-label', t.gal_prev); next.setAttribute('aria-label', t.gal_next);
    track.setAttribute('aria-label', t.gal_track);
  }
  new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  labels();
  jump(COPIES);
  paint();
})();
