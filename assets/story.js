/* About page, Brand Story: the photo of a navigator's compass pointing at Vega turns into the VegaFencer logo,
   which then fans out into the four product logos (Install, Logic, Library, Symbol) and stops.
   Order (2026-11-27): a zoom into the photo (2 s), the leader line draws out of Vega, the Vega label appears,
   then the compass becomes the logo. It stays on the night-sky colour to the end (the page is dark), and on wide
   screens the logos land to the left of the text card (#storyText), centred on it.
   It starts from the beginning every time the card scrolls into view and pauses while it is off screen.
   Visitors who ask for reduced motion see the last frame (the four logos) without the animation.
   All ids are prefixed with "vs-" so they never clash with the At a Glance animation on the same page. */
(function () {
  var box = document.getElementById('storyAnim');
  if (!box) return;
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- the Vega label, in the page's language (story_* in i18n.js) ---------- */

  /* ---------- SVG ---------- */
  var LOGO =
    '<circle cx="223" cy="43" r="13.5" fill="none" stroke="#ff8e00" stroke-width="9" clip-path="url(#vs-loopLR)"/>' +
    '<circle cx="223" cy="43" r="13.5" fill="none" stroke="#ffb454" stroke-width="9" clip-path="url(#vs-loopUL)"/>' +
    '<circle cx="128" cy="133" r="113" fill="#ffb454"/>' +
    '<circle cx="128" cy="133" r="113" fill="#ffe278" clip-path="url(#vs-ul)"/>' +
    '<circle cx="128" cy="133" r="80" fill="#d5e7f6"/>' +
    '<circle cx="128" cy="133" r="80" fill="#f4f4f6" clip-path="url(#vs-ul)"/>' +
    '<rect x="120" y="53" width="14" height="22" rx="7" fill="#806e66"/>' +
    '<rect x="48" y="126" width="24" height="14" rx="7" fill="#806e66"/>' +
    '<rect x="120" y="190" width="14" height="22" rx="7" fill="#4f4540"/>' +
    '<rect x="183" y="126" width="24" height="14" rx="7" fill="#4f4540"/>' +
    '<polygon points="83,93 148,112 107,153" fill="#ff7d47" stroke="#ff7d47" stroke-width="7" stroke-linejoin="round"/>' +
    '<polygon points="148,112 107,153 170,175" fill="#93c6ec" stroke="#93c6ec" stroke-width="7" stroke-linejoin="round"/>';
  var WORDMARK = function (extra) {
    return '<g filter="url(#vs-tshadow)" font-family="\'Malgun Gothic\',\'Apple SD Gothic Neo\',\'Segoe UI\',Arial,sans-serif" font-weight="800"' + (extra || '') + '>' +
      '<text x="99" y="97" font-size="31" fill="#0000ff" letter-spacing="-.5">Vega</text>' +
      '<text x="147" y="120" font-size="25" fill="#c00000" letter-spacing="-.3">Fencer</text></g>';
  };
  var STAR = 'M0,-60 L17,-17 L59,0 L17,17 L0,60 L-17,17 L-59,0 L-17,-17 Z';
  var ticks = '';
  for (var a = 0; a < 360; a += 10) {
    var r = a * Math.PI / 180, l = a % 30 ? 4 : 8;
    ticks += '<line x1="' + (128 + Math.sin(r) * 80) + '" y1="' + (133 - Math.cos(r) * 80) + '" x2="' + (128 + Math.sin(r) * (80 - l)) + '" y2="' + (133 - Math.cos(r) * (80 - l)) + '"/>';
  }
  box.innerHTML =
    '<svg id="vs-st" viewBox="0 0 1672 929" preserveAspectRatio="xMidYMin slice" role="img">' +
    '<defs>' +
      '<radialGradient id="vs-vg"><stop offset="0" stop-color="#fff"/><stop offset=".12" stop-color="#dfeaff" stop-opacity=".95"/><stop offset=".35" stop-color="#8fb4ff" stop-opacity=".35"/><stop offset="1" stop-color="#5a86ff" stop-opacity="0"/></radialGradient>' +
      '<filter id="vs-tshadow" x="-10%" y="-20%" width="130%" height="150%"><feDropShadow dx="1.2" dy="1.2" stdDeviation=".6" flood-color="#000" flood-opacity=".35"/></filter>' +
      '<filter id="vs-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter>' +
      '<clipPath id="vs-ul"><polygon points="-60,-60 321,-60 -60,321"/></clipPath>' +
      '<clipPath id="vs-loopUL"><polygon points="180,-10 276,-10 180,86"/></clipPath>' +
      '<clipPath id="vs-loopLR"><polygon points="276,-10 276,86 180,86"/></clipPath>' +
      '<mask id="vs-spot"><rect width="1672" height="940" fill="#fff"/><g filter="url(#vs-soft)"><ellipse cx="817" cy="845" rx="225" ry="185" fill="#000"/>' +
        '<line x1="387" y1="210" x2="760" y2="747" stroke="#000" stroke-width="34" stroke-linecap="round"/><circle cx="387" cy="210" r="40" fill="#000"/></g></mask>' +
      '<g id="vs-logo">' + LOGO + WORDMARK() + '<path d="M61,2 L78,45 L120,62 L78,79 L61,122 L44,79 L2,62 L44,45 Z" fill="currentColor" stroke="#6b8da6" stroke-width="1.2" stroke-linejoin="round"/></g>' +
    '</defs>' +
    '<rect x="-40" y="-40" width="1752" height="1020" fill="#0f1a24"/>' +   // the page colour behind the photo, so the white line art shows once the photo fades
    '<g id="vs-scene">' +
      '<g id="vs-photo"><image href="assets/img/brand-story-night.webp" width="1672" height="940"/>' +
        '<rect id="vs-dim" width="1672" height="940" fill="#03060d" opacity="0" mask="url(#vs-spot)"/></g>' +
      '<path id="vs-label" d="M428 210L610 210" pathLength="1" fill="none" stroke="rgba(207,224,255,.85)" stroke-width="2" opacity="0"/>' +
      '<g id="vs-cLine" fill="none" stroke="#e6eeff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0">' +
        '<circle class="vs-dr" cx="128" cy="133" r="113" pathLength="1"/>' +
        '<circle class="vs-dr" cx="128" cy="133" r="80" pathLength="1"/>' +
        '<circle cx="128" cy="133" r="72" pathLength="1" stroke-opacity=".45" stroke-dasharray="0.004 0.012"/>' +
        '<g id="vs-ticks" stroke-opacity=".55" opacity="0">' + ticks + '</g>' +
        '<rect class="vs-dr" x="120" y="53" width="14" height="22" rx="7" pathLength="1"/>' +
        '<rect class="vs-dr" x="120" y="190" width="14" height="22" rx="7" pathLength="1"/>' +
        '<rect class="vs-dr" x="48" y="126" width="24" height="14" rx="7" pathLength="1"/>' +
        '<rect class="vs-dr" x="183" y="126" width="24" height="14" rx="7" pathLength="1"/>' +
        '<circle id="vs-loop" cx="223" cy="43" r="13.5" pathLength="1"/>' +
        '<g id="vs-needle"><polygon class="vs-dr" points="83,93 148,112 107,153" pathLength="1"/><polygon class="vs-dr" points="148,112 107,153 170,175" pathLength="1"/></g>' +
      '</g>' +
      '<g id="vs-cColor" opacity="0">' + LOGO + WORDMARK(' id="vs-word" opacity="0"') + '</g>' +
      '<g id="vs-vega"><circle id="vs-glow" r="46" fill="url(#vs-vg)" opacity="0"/>' +
        '<g id="vs-starG"><path id="vs-starLine" d="' + STAR + '" fill="none" stroke="#e6eeff" stroke-width="1.3" stroke-linejoin="round" opacity="0"/>' +
        '<path id="vs-starColor" d="' + STAR + '" fill="#ffff00" stroke="#6b8da6" stroke-width="1.2" opacity="0"/></g></g>' +
    '</g>' +
    '<g id="vs-four" opacity="0">' +
      '<use id="vs-u0" href="#vs-logo" style="color:#00b050"/><use id="vs-u1" href="#vs-logo" style="color:#ff0000"/>' +
      '<use id="vs-u2" href="#vs-logo" style="color:#7030a0"/><use id="vs-u3" href="#vs-logo" style="color:#ffff00"/>' +
      '<g id="vs-names" opacity="0" font-family="Manrope,\'Noto Sans KR\',sans-serif" font-weight="700" font-size="36" fill="#e6eef6" text-anchor="middle" translate="no">' +
        '<text id="vs-n0">Install</text><text id="vs-n1">Logic</text><text id="vs-n2">Library</text><text id="vs-n3">Symbol</text></g>' +
    '</g></svg>';

  var $ = function (id) { return document.getElementById('vs-' + id); };
  var svg = $('st');
  var dr = Array.prototype.slice.call(box.querySelectorAll('.vs-dr'));

  /* ---------- the Vega label ----------
     The words are ordinary page text laid over the card, sized in card widths (cqw) so they scale with the card,
     and they do not take part in the slow zoom. Drawn into the zooming picture they shimmered and looked soft on
     standard-density monitors (27" QHD); still text stays sharp. Only the leader line zooms with the photo, and the
     zoom is just 3%, so the text stays next to it. */
  var label = document.createElement('div');
  label.className = 'story-label';
  label.setAttribute('aria-hidden', 'true');
  label.style.opacity = '0';
  box.appendChild(label);
  function setLabel() {
    var T = i18n[document.documentElement.lang] || i18n.ko;
    label.innerHTML = '<span class="story-label-1"><b translate="no">Vega</b><span></span></span><span class="story-label-2"></span>';
    label.querySelector('.story-label-1 span').textContent = T.story_vega_sub;
    label.querySelector('.story-label-2').textContent = T.story_vega_line;
    svg.setAttribute('aria-label', T.story_aria);
    updateCtl();
  }
  var ctl = null, bar = null, bPause = null, bReplay = null, paused = false, ended = false;   // the progress bar and its two buttons (made below)
  setLabel();
  new MutationObserver(setLabel).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  /* ---------- framing ----------
     The picture follows the box's shape: at 1.8 : 1 (narrow screens) it keeps the photo's top and loses a little at
     the bottom; on wide screens the box is one window tall (site.css), and a box narrower than 1.8 : 1 loses the
     photo's sides instead (rigging and sky), so the compass and Vega always stay in. Phones (a box about as tall as
     wide): the photo is cropped to a column that keeps Vega and the compass (x about 190-1090) instead of its middle. */
  var VW = 1672, VH = 929, x0 = 0, y0 = 0, PORT = false;
  var PHONE_PX = 11.5;   // the Vega label never goes below this size
  function fit() {
    var w = box.offsetWidth, h = box.offsetHeight, r = w && h ? w / h : 1.8;
    VW = Math.min(1672, Math.round(940 * r)); VH = Math.min(940, Math.round(1672 / r)); x0 = 836 - VW / 2;
    PORT = r < 1.3;
    if (PORT) x0 = Math.max(0, Math.min(1672 - VW, 640 - VW / 2));
    y0 = Math.max(0, 929 - VH);   // wider than 1.8 : 1 (up to 1.92 : 1, site.css): a little of the sky goes, not the compass
    svg.setAttribute('viewBox', x0 + ' ' + y0 + ' ' + VW + ' ' + VH);
    /* The label is page text laid over the picture: placed and sized in picture units (k = CSS px per unit, offsetWidth
       is in CSS pixels, so this also holds when the page is zoomed). 20.9 units per em = 1.25/100 of the full photo
       width. The leader line runs level with Vega (387, 210) out to (610, 210), seen at (603.2, 202.2) after the 3% zoom; the label starts 18.4
       units to its right, and its first line (1.9em tall) is centred on it. */
    var k = w / VW, em = 20.9;
    var fpx = Math.max(em * k, PHONE_PX);
    label.style.fontSize = fpx + 'px';
    var lx = (603.2 + 18.4 - x0) * k;
    label.style.left = lx + 'px';
    label.style.top = ((202.2 - y0) * k - 0.95 * 1.9 * fpx) + 'px';
    // phone: the longer lines (English, Japanese) wrap inside the picture instead of running off its edge
    label.style.whiteSpace = PORT ? 'normal' : '';
    label.style.maxWidth = PORT ? Math.max(120, w - lx - 12) + 'px' : '';
  }
  fit();
  /* Where the logo zooms to (SC) and where the four logos end (ROW). Without a card beside the animation: centred
     across it. With the card on the right (wide screens): in the space to its left, the row (logos and names)
     centred on the card's middle. Picture units = card pixels / k. */
  var card = document.getElementById('storyText'), art = box.parentNode;
  var SC, ROW;
  function layout() {
    fit();
    var gap = Math.min(380, VW * 0.235), cx = 836, cy = 430, fs = 36, sx = 836, sy = 470;
    var b = box.getBoundingClientRect(), c = card && card.getBoundingClientRect();
    if (c) {   // without the card's own fade-in shift (.reveal), which may still be running
      var tf = getComputedStyle(card).transform, m = tf && tf !== 'none' ? new DOMMatrixReadOnly(tf) : null;
      if (m) c = { left: c.left - m.e, right: c.right - m.e, top: c.top - m.f, bottom: c.bottom - m.f, width: c.width, height: c.height };
    }
    var beside = c && c.width && c.left - b.left > b.width / 2 && c.top < b.bottom, lo = 0, hi = 0;
    if (beside) {
      var k = b.width / VW;
      /* Across: centred between the left edge of the header's "VegaFencer" and the card's left edge (the page's
         content column), with 96px kept clear at each end (so the row sits apart from the card and in proportion to its smaller type). The row's ink runs from the first star tip (126s left of
         the first logo's centre) to the last logo's ring (108s right of the fourth), so it is moved 9s right. */
      var home = document.querySelector('#nav nav > a'), hr = home && home.getBoundingClientRect();
      lo = hr && hr.width ? hr.left - b.left : b.right - c.right; hi = c.left - b.left;
      gap = Math.min(380, (hi - lo - 2 * 96) / k / 3.84);
      var s = gap / 304;
      var M = x0 + (lo + hi) / 2 / k;   // the column's middle, in picture units
      cx = M + 9 * s;
      sx = M + 9 * 2.2;   // the merged logo (2.2x) has the same lean: its ink runs from x 2 to 236.5 around 128
      fs = Math.max(24, Math.min(36, gap * 0.15));
      var mid = y0 + (c.top + c.height / 2 - b.top) / k;
      cy = mid + 4 * s - 1.08 * fs;   // the row runs from the star tip (cy - 131s) to under the names (ny + .22fs)
      /* The merged logo: its compass circle (the big round mass, centre at logo y 133) sits on the card's middle, not
         the whole drawing with the star tip (centre y 123): with the star counted the circle looked low. SC is where
         logo y 123 lands, so it is 10 logo units (x 2.2) above the card's middle. Across: centred on the column. */
      sy = mid - 10 * 2.2;
    }
    var grid = null;   // the four logos' places when they are not in one row (phone: two by two)
    if (PORT && !beside) {   // phone (no card beside): the merged logo is centred on the picture, the four logos two by two
      var M2 = x0 + VW / 2, vcy = y0 + VH / 2;
      sx = M2 + 9 * 2.2; sy = vcy - 10 * 2.2;
      /* Two by two, close together and clear of the progress bar at the bottom: each block (star tip to the bottom of the
         name) is 254s + 2.16fs tall; the two blocks and a gap of 40 fill at most 80% of the picture's height, and the
         whole sits 20 units above the middle. Across, the two columns are gx apart, the ink (126s left of a logo's
         centre to 108s right) moved 9s right to centre it. */
      fs = 32;
      var s2 = Math.min(1.0, ((VH * 0.80 - 40) / 2 - 2.16 * fs) / 254), gx = Math.min(VW * 0.34, 330), blk = 254 * s2 + 2.16 * fs, top0 = vcy - 20 - (2 * blk + 40) / 2;
      grid = { s: s2, p: [] };
      for (var q = 0; q < 4; q++) {
        var gcy = top0 + (q >> 1) * (blk + 40) + 131 * s2;
        grid.p.push({ cx: M2 + ((q % 2) - 0.5) * gx + 9 * s2, cy: gcy, ny: gcy + 123 * s2 + 1.94 * fs });
      }
    }
    AXISX = beside ? (lo + hi) / 2 : b.width / 2;   // visual px from the box's left: where the progress bar is centred (the logos' axis)
    SC = [sx, sy];
    ROW = grid || { s: gap / 304, p: [] };
    if (!grid) for (var j = 0; j < 4; j++) ROW.p.push({ cx: cx + (j - 1.5) * gap, cy: cy, ny: cy + 123 * gap / 304 + 1.94 * fs });
    $('names').setAttribute('font-size', fs);
    for (var i = 0; i < 4; i++) { $('n' + i).setAttribute('x', ROW.p[i].cx); $('n' + i).setAttribute('y', ROW.p[i].ny); }
    placeCtl();
  }
  /* The progress bar sits at the picture's bottom, centred on the logos' axis (the buttons hang to its right) (the middle of the column
     left of the text card on wide screens, the picture's middle on narrow ones). Offsets are layout px, so the page's
     zoom on wide screens is divided out. */
  var AXISX = 0;
  function placeCtl() {
    if (!ctl) return;
    var b = box.getBoundingClientRect(), st = ctl.parentNode.getBoundingClientRect(), z = b.width / box.offsetWidth || 1, art = box.parentNode;
    ctl.style.left = ((b.left - st.left + AXISX) / z) + 'px';
    ctl.style.top = (art.offsetTop + art.offsetHeight - 30 - ctl.offsetHeight / 2) + 'px';   // the bar's middle 30px above the picture's bottom
  }
  layout();

  /* ---------- timeline (seconds) ---------- */
  var ease = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var P = function (t, a, b) { return ease(Math.min(1, Math.max(0, (t - a) / (b - a)))); };
  var L = function (a, b, p) { return a + (b - a) * p; };
  var VEGA0 = [387, 210], TIP = [760, 747.5];   // Vega and the compass needle tip in the photo
  var onLine = function (u) { return [L(TIP[0], VEGA0[0], u), L(TIP[1], VEGA0[1], u)]; };
  var PH = { x: 817, y: 845, sx: 1.823, sy: 1.416, rot: 23.2 };   // the compass in the photo
  var Ss = 1.6, starOff = [(61 - 128) * Ss, (62 - 133) * Ss];
  var STAR1 = onLine(0.5);   // star and compass meet halfway along the red line
  var C1 = { x: STAR1[0] - starOff[0], y: STAR1[1] - starOff[1], sx: Ss, sy: Ss };
  var LOGOC = [C1.x, C1.y - 10 * Ss], ZEND = 2.2 / Ss;
  var SHIFT = 3.0;            // everything after the label starts this much later than the original timeline
  var END = 10 + SHIFT;
  var set = function (el, k, v) { el.setAttribute(k, v); };

  var lastT = 0;
  function render(t) {
    lastT = t;
    var u = t - SHIFT;   // the old timeline from the dimming on
    var pm = P(u, 4.2, 6.0);
    var z = L(L(1, 1.03, P(t, 0, 2)), ZEND, pm);   // zoom over 2 s, then it holds
    // the opening zoom pivots on the picture's centre (the label's place is set for that); the logo then travels to SC
    var A = [L(836, SC[0], pm), L(470, SC[1], pm)], F = [L(836, LOGOC[0], pm), L(470, LOGOC[1], pm)];
    set($('scene'), 'transform', 'translate(' + A[0] + ' ' + A[1] + ') scale(' + z + ') translate(' + (-F[0]) + ' ' + (-F[1]) + ')');
    // the leader line draws out of Vega as soon as the zoom stops (2-3 s), then the label appears (3-3.6 s) and stays 2 s; both go as the photo dims
    var out = 1 - P(u, 2.6, 3.0);
    set($('label'), 'opacity', (t >= 2 ? out : 0).toFixed(3));
    $('label').style.strokeDasharray = '1 1'; $('label').style.strokeDashoffset = 1 - P(t, 2, 3);
    label.style.opacity = (P(t, 3, 3.6) * out).toFixed(3);
    set($('dim'), 'opacity', (0.85 * P(u, 2.4, 3.4)).toFixed(3));
    set($('photo'), 'opacity', (1 - P(u, 4.3, 5.3)).toFixed(3));
    if (art) art.classList.toggle('story-clear', u >= 5.4);   // photo gone: drop the edge fade (the ground is the page colour)
    var pose = { x: L(PH.x, C1.x, pm), y: L(PH.y, C1.y, pm), sx: L(PH.sx, C1.sx, pm), sy: L(PH.sy, C1.sy, pm), rot: L(PH.rot, 0, pm) };
    var cT = 'translate(' + pose.x + ' ' + pose.y + ') scale(' + pose.sx + ' ' + pose.sy + ') translate(-128 -133)';
    set($('cLine'), 'transform', cT); set($('cColor'), 'transform', cT);
    set($('needle'), 'transform', 'rotate(' + pose.rot + ' 128 133)');
    var sp = onLine(L(1, 0.5, pm));
    set($('vega'), 'transform', 'translate(' + sp[0] + ' ' + sp[1] + ')');
    set($('glow'), 'opacity', (P(u, 2.4, 2.8) * (1 - P(u, 3.6, 4.3))).toFixed(3));
    set($('glow'), 'r', L(40, 18, P(u, 3.4, 4.2)));
    var ks = L((PH.sx + PH.sy) / 2 * 0.8, Ss, pm) * P(u, 3.5, 4.2);
    set($('starG'), 'transform', 'scale(' + Math.max(ks, 0.001) + ')');
    set($('starLine'), 'opacity', (P(u, 3.5, 3.8) * (1 - P(u, 6.4, 7.2))).toFixed(3));
    set($('starColor'), 'opacity', P(u, 6.0, 7.0).toFixed(3));
    set($('cLine'), 'opacity', (P(u, 3.1, 3.3) * (1 - P(u, 6.4, 7.2))).toFixed(3));
    var pd = P(u, 3.2, 4.2);
    dr.forEach(function (e) { e.style.strokeDasharray = '1 1'; e.style.strokeDashoffset = 1 - pd; });
    var lp = $('loop'); lp.style.strokeDasharray = '1 1'; lp.style.strokeDashoffset = 1 - P(u, 5.0, 6.0);
    set($('ticks'), 'opacity', (P(u, 3.6, 4.2) * 0.9).toFixed(3));
    set($('cColor'), 'opacity', P(u, 6.0, 7.0).toFixed(3));
    set($('word'), 'opacity', P(u, 7.0, 8.0).toFixed(3));
    set($('word'), 'transform', 'translate(0 ' + L(6, 0, P(u, 7.0, 8.0)) + ')');
    // hand-off: four identical static logos replace the animated one, then fan out
    var on = u >= 8.05;
    $('scene').style.visibility = on ? 'hidden' : 'visible';
    set($('four'), 'opacity', on ? 1 : 0);
    var ps = P(u, 8.3, 9.5);
    for (var i = 0; i < 4; i++) {
      var s1 = ROW.s, x1 = ROW.p[i].cx - 128 * s1, y1 = ROW.p[i].cy - 123 * s1;
      set($('u' + i), 'transform', 'translate(' + L(SC[0] - 128 * 2.2, x1, ps) + ' ' + L(SC[1] - 123 * 2.2, y1, ps) + ') scale(' + L(2.2, s1, ps) + ')');
      if (i < 3) set($('u' + i), 'opacity', P(u, 8.3, 8.6).toFixed(3));
    }
    set($('names'), 'opacity', P(u, 9.3, 10.0).toFixed(3));
  }

  /* ---------- player: from the start each time it comes into view (and again after the text card has scrolled away) ---------- */
  var relayout = function () { layout(); render(lastT); };   // layout() also places the progress bar
  if ('ResizeObserver' in window) { var ro = new ResizeObserver(relayout); ro.observe(box); if (card) ro.observe(card); }
  else window.addEventListener('resize', relayout);
  if (REDUCE) { render(END); return; }
  /* The progress bar (fills with the time), a pause / play button and a replay button, at the picture's bottom. Made only
     when the animation plays (not for reduced motion). It shows while playing and stays full at the end; when the
     text card has scrolled away and the animation goes back to its first frame, it hides until it plays again. */
  var ICON = {
    pause: '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="1" width="3" height="10" rx="1"/><rect x="7" y="1" width="3" height="10" rx="1"/></svg>',
    play: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.4v9.2L10.6 6z"/></svg>',
    replay: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.2A4.8 4.8 0 1 0 10.6 7.4H9.2A3.5 3.5 0 1 1 6 2.5c.9 0 1.7.3 2.3.9L6.6 5.1H11V.7L9.6 2.1A4.8 4.8 0 0 0 6 1.2z"/></svg>'
  };
  ctl = document.createElement('div');
  ctl.className = 'story-ctl off';
  ctl.innerHTML = '<div class="story-bar" aria-hidden="true"><i></i></div><div class="story-btns"><button type="button" class="story-btn"></button><button type="button" class="story-btn"></button></div>';
  (document.getElementById('story') || box.parentNode.parentNode).appendChild(ctl);
  bar = ctl.querySelector('.story-bar i'); bPause = ctl.querySelectorAll('.story-btn')[0]; bReplay = ctl.querySelectorAll('.story-btn')[1];
  function updateCtl() {
    if (!ctl) return;
    var T = i18n[document.documentElement.lang] || i18n.ko;
    var lp = paused ? (T.story_play || 'Play') : (T.story_pause || 'Pause'), lr = T.story_replay || 'Replay';
    bPause.innerHTML = paused ? ICON.play : ICON.pause; bPause.setAttribute('aria-label', lp); bPause.title = lp; bPause.disabled = ended;
    bReplay.innerHTML = ICON.replay; bReplay.setAttribute('aria-label', lr); bReplay.title = lr;
  }
  var setBar = function (t) { bar.style.transform = 'scaleX(' + (t / END).toFixed(4) + ')'; };
  var raf = 0, t0 = 0, tPlay = 0;
  function frame(now) {
    var t = Math.min(END, (now - t0) / 1000);
    tPlay = t; render(t); setBar(t);
    if (t < END) raf = requestAnimationFrame(frame);
    else { raf = 0; ended = true; updateCtl(); }
  }
  function start() {
    stop(); paused = false; ended = false; ctl.classList.remove('off'); updateCtl();
    render(0); setBar(0); placeCtl();
    raf = requestAnimationFrame(function (now) { t0 = now; frame(now); });
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  bPause.addEventListener('click', function () {
    if (paused) { paused = false; raf = requestAnimationFrame(function (now) { t0 = now - tPlay * 1000; frame(now); }); }
    else if (raf) { stop(); paused = true; }
    updateCtl();
  });
  bReplay.addEventListener('click', start);
  placeCtl(); updateCtl();
  render(0);
  if (!('IntersectionObserver' in window)) { start(); return; }
  var inView = false, boxRatio = 0;
  var restart = function () { inView = true; start(); };
  var reset = function () { inView = false; stop(); paused = false; ended = false; render(0); setBar(0); ctl.classList.add('off'); updateCtl(); };
  new IntersectionObserver(function (es) {
    var e = es[es.length - 1];
    boxRatio = e.intersectionRatio;
    if (e.intersectionRatio >= 0.35 && !inView) restart();
    else if (!e.isIntersecting && inView) reset();
  }, { threshold: [0, 0.35] }).observe(box);
  /* The text card scrolled up out of sight (behind the header counts as out): back to the first frame, and it plays
     again when the card (and the picture) come back into view. */
  if (card) {
    var nav = document.getElementById('nav'), navH = nav ? nav.offsetHeight : 0;
    new IntersectionObserver(function (es) {
      var e = es[es.length - 1];
      if (!e.isIntersecting && e.boundingClientRect.bottom <= navH + 1 && inView) reset();
      else if (e.isIntersecting && !inView && boxRatio >= 0.35) restart();
    }, { rootMargin: '-' + navH + 'px 0px 0px 0px', threshold: [0] }).observe(card);
  }
})();
