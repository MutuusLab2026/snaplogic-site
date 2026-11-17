/* Home "Quick Tour" (#gallery, right under the hero): real program screens in a row that pages sideways and wraps around.
   The current screen lines up with the heading on the left; a numbered caption block (.ga-info: "01. Logic",
   description, link) sits at its right over the blurred next screen. The block slides out while the row moves
   and comes back with the new screen's caption once the row rests.
   Wrapping: copies of the last and first screens sit at either end of the row. When the row comes to rest on a
   copy it jumps, without animation, to the real screen it copies, so paging past the end carries on from the start.
   Copies are hidden from screen readers and keyboard (inert). Arrow buttons, the left/right keys on the focused
   row, a click on a side screen, or a swipe/trackpad move it. The captions live in each screen's <figcaption>
   (translated by i18n.js) and are copied into the block. */
(function () {
  var root = document.getElementById('gallery');
  if (!root) return;
  var track = root.querySelector('.ga-track');
  var info = root.querySelector('.ga-info');
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
  function target(p) { return slides[p].offsetLeft - (parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0); }
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
  // The caption block shows the resting screen's caption, numbered "01.".
  function fillInfo(force) {
    var r = realIndex(pos);
    if (force || info.dataset.at !== String(r)) {
      info.dataset.at = r;
      info.innerHTML = '<p class="ga-num">' + (r + 1 < 10 ? '0' : '') + (r + 1) + '.</p>' + real[r].querySelector('figcaption').innerHTML;
    }
    root.classList.remove('ga-moving');
  }
  // While scrolling, mark the screen nearest the left edge; once the row rests, swap a copy for the real screen.
  var settle = 0;
  function rest() {
    pos = nearest();
    if (pos < COPIES || pos >= COPIES + n) jump(COPIES + realIndex(pos));
    paint(); fillInfo();
  }
  track.addEventListener('scroll', function () {
    if (Math.abs(target(pos) - track.scrollLeft) > 4) root.classList.add('ga-moving');
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

  // Language switch: accessible names (switchLanguage only rewrites text, not aria-label) and the caption block
  // (a copy of the figcaption, so it is refilled after i18n.js has translated the figcaptions).
  function labels() {
    var t = i18n[document.documentElement.lang] || i18n.ko;
    prev.setAttribute('aria-label', t.gal_prev); next.setAttribute('aria-label', t.gal_next);
    track.setAttribute('aria-label', t.gal_track);
  }
  new MutationObserver(function () { labels(); setTimeout(function () { fillInfo(true); }, 0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  labels();
  jump(COPIES);
  paint(); fillInfo(true);
})();
