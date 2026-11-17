/* Home "Explore the Workspace" (#gallery, right under the hero): real program screens in a row that pages sideways and wraps around.
   The current screen lines up with the heading on the left; a numbered caption block (.ga-info: "01. Logic",
   description, link) sits at its right over the blurred next screen. The block slides out while the row moves
   and comes back with the new screen's caption once the row rests.
   Wrapping: copies of the last and first screens sit at either end of the row. When the row comes to rest on a
   copy it jumps, without animation, to the real screen it copies, so paging past the end carries on from the start.
   Copies are hidden from screen readers and keyboard (inert). Arrow buttons, the left/right keys on the focused
   row, a click on a side screen, or a swipe/trackpad move it. The captions live in each screen's <figcaption>
   (translated by i18n.js) and are copied into the block.
   Autoplay (2026-11-18): under the caption sit one dot per screen and a pause/play button. The current dot is a bar
   that fills over TIME (a CSS animation); when it is full the row moves on. Each time the section comes into view
   it starts over from the first screen. Hovering the caption block, keyboard focus inside the section, or the
   section being off screen hold the bar where it is; the pause button stops it until pressed again. With reduced motion asked for, nothing moves by itself (the button is hidden). */
(function () {
  var root = document.getElementById('gallery');
  if (!root) return;
  var track = root.querySelector('.ga-track');
  var info = root.querySelector('.ga-info');
  var body = root.querySelector('.ga-body');
  var dotsBox = root.querySelector('.ga-dots');
  var pauseBtn = root.querySelector('.ga-pause');
  var stage = root.querySelector('.ga-stage');
  var TIME = 5000;                              // ms per screen
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
  // scroll-padding-left reads back as an unresolved max()/calc() string, so take the same length from padding-left,
  // which reads back in px (both are --ga-left)
  function target(p) { return slides[p].offsetLeft - (parseFloat(getComputedStyle(track).paddingLeft) || 0); }
  function jump(p) {                           // move without animation (wrapping, resizing, first paint)
    track.classList.add('ga-instant');         // the real screen takes the copy's look at once (no grow/sharpen)
    track.style.scrollSnapType = 'none';
    track.scrollLeft = target(p);
    pos = p; paint();
    void track.offsetWidth;
    track.style.scrollSnapType = '';
    track.classList.remove('ga-instant');
  }
  // A move we start (arrow, dot, autoplay) marks its destination at once, so the screen grows and sharpens while
  // the row slides, instead of switching half way and then settling into place.
  var driving = null;
  function go(p) {
    p = Math.max(0, Math.min(slides.length - 1, p));
    if (p === pos) return;
    driving = p; pos = p; paint();
    root.classList.add('ga-moving');
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
    var r = realIndex(pos);
    (dots || []).forEach(function (d, i) {
      var on = i === r;
      if (on && !d.classList.contains('on')) d.querySelector('span').innerHTML = '<i></i>';   // new <i>: the bar starts empty
      d.classList.toggle('on', on);
      if (on) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
  }
  // The caption block shows the resting screen's caption, numbered "01.".
  function fillInfo(force) {
    var r = realIndex(pos);
    if (force || body.dataset.at !== String(r)) {
      body.dataset.at = r;
      body.innerHTML = '<p class="ga-num">' + (r + 1 < 10 ? '0' : '') + (r + 1) + '.</p>' + real[r].querySelector('figcaption').innerHTML;
    }
    root.classList.remove('ga-moving');
  }
  // While scrolling, mark the screen nearest the left edge; once the row rests, swap a copy for the real screen.
  var settle = 0;
  function rest() {
    driving = null;
    pos = nearest();
    if (pos < COPIES || pos >= COPIES + n) jump(COPIES + realIndex(pos));
    // Wide screens have no scroll snap (see site.css), so a swipe that stops between screens glides to the nearest one.
    else if (Math.abs(track.scrollLeft - target(pos)) > 1) {
      track.scrollTo({ left: target(pos), behavior: reduce ? 'auto' : 'smooth' });
      return;
    }
    paint(); fillInfo();
  }
  track.addEventListener('scroll', function () {
    if (Math.abs(target(pos) - track.scrollLeft) > 4) root.classList.add('ga-moving');
    if (driving === null) { pos = nearest(); paint(); }   // a swipe: follow the finger
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

  // Dots: one button per real screen; the current one holds the filling bar.
  var dots = real.map(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span><i></i></span>';
    b.addEventListener('click', function () { go(pos + (i - realIndex(pos))); });
    dotsBox.appendChild(b);
    return b;
  });
  // Autoplay. ga-auto: running; ga-held: paused for a moment (hover, focus, off screen); ga-stopped: paused by the button.
  root.style.setProperty('--ga-time', TIME + 'ms');
  var stopped = reduce, hover = false, focus = false, away = true;
  function state() {
    root.classList.toggle('ga-auto', !stopped);
    root.classList.toggle('ga-stopped', stopped);
    root.classList.toggle('ga-held', hover || focus || away);
    body.setAttribute('aria-live', stopped ? 'polite' : 'off');   // no announcement every few seconds while it runs
    var t = i18n[document.documentElement.lang] || i18n.ko;
    pauseBtn.setAttribute('aria-label', stopped ? t.gal_play : t.gal_pause);
  }
  function restart() {
    driving = null;
    root.classList.remove('ga-moving');
    jump(COPIES); fillInfo(true);
    var on = dotsBox.querySelector('.on span');
    if (on) on.innerHTML = '<i></i>';          // a fresh bar starts empty
  }
  dotsBox.addEventListener('animationend', function (e) {
    if (e.animationName === 'ga-fill' && !stopped) go(pos + 1);
  });
  pauseBtn.addEventListener('click', function () { stopped = !stopped; state(); });
  // hold while the pointer is on the caption block (someone reading it); the screens themselves do not hold it
  info.addEventListener('mouseenter', function () { hover = true; state(); });
  info.addEventListener('mouseleave', function () { hover = false; state(); });
  // keyboard focus only (a mouse click on a dot or the button should not leave it held)
  root.addEventListener('focusin', function (e) { focus = e.target !== pauseBtn && e.target.matches(':focus-visible'); state(); });
  root.addEventListener('focusout', function () { focus = false; state(); });
  if ('IntersectionObserver' in window) {
    // Like the other animated sections, it starts over from the first screen each time it comes into view.
    new IntersectionObserver(function (es) {
      var now = !es[0].isIntersecting;
      if (away && !now) restart();
      away = now; state();
    }, { threshold: 0.5 }).observe(stage);
  } else away = false;
  state();

  // Language switch: accessible names (switchLanguage only rewrites text, not aria-label) and the caption block
  // (a copy of the figcaption, so it is refilled after i18n.js has translated the figcaptions).
  function labels() {
    var t = i18n[document.documentElement.lang] || i18n.ko;
    prev.setAttribute('aria-label', t.gal_prev); next.setAttribute('aria-label', t.gal_next);
    track.setAttribute('aria-label', t.gal_track);
    dots.forEach(function (d, i) { d.setAttribute('aria-label', t.gal_dot.replace('{n}', i + 1)); });
    state();
  }
  new MutationObserver(function () { labels(); setTimeout(function () { fillInfo(true); }, 0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  labels();
  jump(COPIES);
  paint(); fillInfo(true);
})();
