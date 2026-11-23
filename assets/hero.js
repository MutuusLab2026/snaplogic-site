/* Home hero (#hero): a photo of an engineer at a monitor that shows the real Logic screen (the screenshot is baked
   into the photo: assets/img/hero-office-*.webp).
   Wide windows (over 767px): the photo is laid out in the same scaled units as the text (--hero-s, set by
   engineering.js), so the person's face always sits the same distance from the headline whatever the window size;
   wider windows only show more of the background colour at the sides (the photo's own faded edges, site.css).
   The photo is centred vertically on the monitor. Phones: the photo simply fills its box (site.css).
   Also keeps the header dark while the hero is under it. */
(function () {
  var hero = document.getElementById('hero'), nav = document.getElementById('nav');
  if (!hero || !nav) return;
  var box = hero.querySelector('.hero-photo'), img = hero.querySelector('.hero-bg'), title = hero.querySelector('h1');
  var W = 1300;                           // photo width at scale 1 (1440-wide design)
  var FACE = 420;                         // the face's distance from the headline's left edge at scale 1
  var FACE_X = 0.25;                      // the face, as a share of the photo width
  var MON_MID = (500 + 1072) / 2 / 1536;  // the monitor's vertical middle, as a share of the photo height
  var wide = window.matchMedia('(min-width: 768px)');
  function place() {
    if (!wide.matches) { img.style.cssText = ''; return; }
    var s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hero-s')) || 1;
    if (innerWidth <= 1100) s = 1;        // engineering.js scales only above 1100px
    var w = W * s, h = w / 2;
    img.style.width = w + 'px'; img.style.height = h + 'px';
    img.style.left = Math.round(title.getBoundingClientRect().left + FACE * s - FACE_X * w) + 'px';
    img.style.top = Math.round(box.clientHeight / 2 - MON_MID * h) + 'px';
  }
  place();
  addEventListener('resize', place);
  // engineering.js sets --hero-s on DOMContentLoaded, after this listener; place again on the next tick, then show the
  // photo (it is hidden until then, site.css), so it never appears off to the side and slides into place (2026-11-24)
  addEventListener('DOMContentLoaded', function () { setTimeout(function () { place(); img.classList.add('is-placed'); }, 0); });
  addEventListener('load', place);
  wide.addEventListener('change', place);
  if (window.ResizeObserver) new ResizeObserver(place).observe(box);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);   // the headline moves once fonts load

  var watch = null;
  function watchHero() {
    if (watch) watch.disconnect();
    watch = new IntersectionObserver(function (es) {
      nav.classList.toggle('engineering-nav-dark', es[0].isIntersecting);
    }, { rootMargin: '-' + (nav.offsetHeight - 1) + 'px 0px 0px 0px' });
    watch.observe(hero);
  }
  watchHero();
  wide.addEventListener('change', watchHero);   // the header is taller on phones
})();
