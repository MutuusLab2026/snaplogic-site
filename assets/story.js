/* Home page, Brand Story: the photo of a navigator's compass pointing at Vega turns into the VegaFencer logo,
   which then fans out into the four product logos (Install, Logic, Library, Symbol) and stops.
   It starts from the beginning every time the card scrolls into view and pauses while it is off screen.
   Visitors who ask for reduced motion see the last frame (the four logos) without the animation.
   All ids are prefixed with "vs-" so they never clash with the At a Glance animation on the same page. */
(function () {
  var box = document.getElementById('storyAnim');
  if (!box) return;
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- the Vega label, in the page's language ---------- */
  var TEXT = {
    ko: { sub: '직녀성 · α Lyrae', line: '별의 밝기에 대한 기준', aria: '항해사의 나침반이 가리키는 별 Vega가 VegaFencer 로고로 바뀌고, Install · Logic · Library · Symbol 네 로고로 펼쳐지는 애니메이션' },
    en: { sub: 'α Lyrae', line: 'The reference for the brightness of stars', aria: 'Animation: Vega, the star a navigator’s compass points to, becomes the VegaFencer logo and opens into the four logos Install, Logic, Library and Symbol' },
    zh: { sub: '织女星 · α Lyrae', line: '星星亮度的基准', aria: '动画：航海者罗盘所指的织女星（Vega）变成VegaFencer标志，并展开为Install、Logic、Library、Symbol四个标志' },
    ja: { sub: 'ベガ（織女星）· α Lyrae', line: '星の明るさの基準', aria: 'アニメーション：航海士のコンパスが指す星ベガがVegaFencerのロゴに変わり、Install・Logic・Library・Symbolの4つのロゴに広がります' }
  };

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
    '<rect id="vs-light" x="-40" y="-40" width="1752" height="1020" fill="#f4f6fb" opacity="0"/>' +
    '<g id="vs-scene">' +
      '<g id="vs-photo"><image href="assets/img/brand-story.webp" width="1672" height="940"/>' +
        '<rect id="vs-dim" width="1672" height="940" fill="#03060d" opacity="0" mask="url(#vs-spot)"/></g>' +
      '<image id="vs-label" opacity="0"/>' +
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
      '<g id="vs-names" opacity="0" font-family="Manrope,\'Noto Sans KR\',sans-serif" font-weight="700" font-size="36" fill="#1d2330" text-anchor="middle" translate="no">' +
        '<text id="vs-n0">Install</text><text id="vs-n1">Logic</text><text id="vs-n2">Library</text><text id="vs-n3">Symbol</text></g>' +
    '</g></svg>';

  var $ = function (id) { return document.getElementById('vs-' + id); };
  var svg = $('st');
  var dr = Array.prototype.slice.call(box.querySelectorAll('.vs-dr'));

  /* ---------- the label is drawn once into a bitmap so it moves with the photo without shimmering ---------- */
  var LABEL = { vega: 36, sub: 21, line: 23 };          // font sizes in photo pixels (the photo is 1672 wide), so they scale with the card
  var LX = 380, LY = 92, LW = 900, LH = 150;   // where the bitmap sits in the photo (Vega is at 387, 210)
  function bakeLabel() {
    var lang = document.documentElement.lang, T = TEXT[lang] || TEXT.ko;
    var fonts = lang === 'ja' ? "'Hiragino Sans','Yu Gothic','Meiryo'," : lang === 'zh' ? "'PingFang SC','Microsoft YaHei'," : "";
    var FH = "Inter,'Noto Sans KR'," + fonts + 'sans-serif', FB = "Manrope,'Noto Sans KR'," + fonts + 'sans-serif';
    var draw = function () {
      var K = 2, c = document.createElement('canvas'); c.width = LW * K; c.height = LH * K;
      var g = c.getContext('2d'); g.scale(K, K); g.translate(-LX, -LY);
      g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 8; g.shadowOffsetY = 1;
      g.strokeStyle = 'rgba(207,224,255,.85)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(410, 188); g.lineTo(446, 150); g.lineTo(476, 150); g.stroke();
      var base = 150 + LABEL.vega * 0.36;   // text centred on the end of the leader line
      g.fillStyle = '#fff'; g.font = '700 ' + LABEL.vega + 'px ' + FH; g.fillText('Vega', 490, base);
      var vw = g.measureText('Vega').width;
      g.fillStyle = '#b9c8e6'; g.font = '500 ' + LABEL.sub + 'px ' + FB; g.fillText(T.sub, 490 + vw + LABEL.sub * 0.5, base);
      g.fillStyle = '#dbe5f7'; g.font = '500 ' + LABEL.line + 'px ' + FB; g.fillText(T.line, 491, base + LABEL.vega * 0.95);
      var img = $('label');
      img.setAttribute('x', LX); img.setAttribute('y', LY); img.setAttribute('width', LW); img.setAttribute('height', LH);
      img.setAttribute('href', c.toDataURL('image/png'));
    };
    svg.setAttribute('aria-label', T.aria);
    if (document.fonts && document.fonts.load) {
      Promise.all(['700 ' + LABEL.vega + 'px Inter', '500 ' + LABEL.sub + 'px Manrope', '500 ' + LABEL.sub + 'px "Noto Sans KR"', '500 ' + LABEL.line + 'px Manrope', '500 ' + LABEL.line + 'px "Noto Sans KR"'].map(function (f) {
        return document.fonts.load(f, 'Vega ' + T.sub + T.line);
      })).then(draw, draw);
    } else draw();
  }
  bakeLabel();
  new MutationObserver(bakeLabel).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  /* ---------- framing: the card is 1.8 : 1, so the photo keeps its top and loses a little at the bottom ---------- */
  var RATIO = 1.8;
  var VW = Math.min(1672, Math.round(940 * RATIO)), VH = Math.min(940, Math.round(1672 / RATIO));
  var GAP = Math.min(380, VW * 0.235);
  var ROW = { gap: GAP, s: GAP / 304, cy: 430, ny: 430 + 123 * GAP / 304 + 70 };
  svg.setAttribute('viewBox', (836 - VW / 2) + ' 0 ' + VW + ' ' + VH);
  for (var i = 0; i < 4; i++) { $('n' + i).setAttribute('x', 836 + (i - 1.5) * ROW.gap); $('n' + i).setAttribute('y', ROW.ny); }

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
  var LOGOC = [C1.x, C1.y - 10 * Ss], ZEND = 2.2 / Ss, SC = [836, 470];
  var END = 10;
  var set = function (el, k, v) { el.setAttribute(k, v); };

  function render(t) {
    var pm = P(t, 4.2, 6.0);
    var z = L(L(1, 1.03, P(t, 0, 3)), ZEND, pm);
    var F = [L(SC[0], LOGOC[0], pm), L(SC[1], LOGOC[1], pm)];
    set($('scene'), 'transform', 'translate(' + SC[0] + ' ' + SC[1] + ') scale(' + z + ') translate(' + (-F[0]) + ' ' + (-F[1]) + ')');
    set($('label'), 'opacity', (P(t, 0.5, 1.1) * (1 - P(t, 2.6, 3.0))).toFixed(3));
    set($('dim'), 'opacity', (0.85 * P(t, 2.4, 3.4)).toFixed(3));
    set($('photo'), 'opacity', (1 - P(t, 4.3, 5.3)).toFixed(3));
    var pose = { x: L(PH.x, C1.x, pm), y: L(PH.y, C1.y, pm), sx: L(PH.sx, C1.sx, pm), sy: L(PH.sy, C1.sy, pm), rot: L(PH.rot, 0, pm) };
    var cT = 'translate(' + pose.x + ' ' + pose.y + ') scale(' + pose.sx + ' ' + pose.sy + ') translate(-128 -133)';
    set($('cLine'), 'transform', cT); set($('cColor'), 'transform', cT);
    set($('needle'), 'transform', 'rotate(' + pose.rot + ' 128 133)');
    var sp = onLine(L(1, 0.5, pm));
    set($('vega'), 'transform', 'translate(' + sp[0] + ' ' + sp[1] + ')');
    set($('glow'), 'opacity', (P(t, 2.4, 2.8) * (1 - P(t, 3.6, 4.3))).toFixed(3));
    set($('glow'), 'r', L(40, 18, P(t, 3.4, 4.2)));
    var ks = L((PH.sx + PH.sy) / 2 * 0.8, Ss, pm) * P(t, 3.5, 4.2);
    set($('starG'), 'transform', 'scale(' + Math.max(ks, 0.001) + ')');
    set($('starLine'), 'opacity', (P(t, 3.5, 3.8) * (1 - P(t, 6.4, 7.2))).toFixed(3));
    set($('starColor'), 'opacity', P(t, 6.0, 7.0).toFixed(3));
    set($('cLine'), 'opacity', (P(t, 3.1, 3.3) * (1 - P(t, 6.4, 7.2))).toFixed(3));
    var pd = P(t, 3.2, 4.2);
    dr.forEach(function (e) { e.style.strokeDasharray = '1 1'; e.style.strokeDashoffset = 1 - pd; });
    var lp = $('loop'); lp.style.strokeDasharray = '1 1'; lp.style.strokeDashoffset = 1 - P(t, 5.0, 6.0);
    set($('ticks'), 'opacity', (P(t, 3.6, 4.2) * 0.9).toFixed(3));
    set($('light'), 'opacity', P(t, 6.0, 7.0).toFixed(3));
    set($('cColor'), 'opacity', P(t, 6.0, 7.0).toFixed(3));
    set($('word'), 'opacity', P(t, 7.0, 8.0).toFixed(3));
    set($('word'), 'transform', 'translate(0 ' + L(6, 0, P(t, 7.0, 8.0)) + ')');
    // hand-off: four identical static logos replace the animated one, then fan out
    var on = t >= 8.05;
    $('scene').style.visibility = on ? 'hidden' : 'visible';
    set($('four'), 'opacity', on ? 1 : 0);
    var ps = P(t, 8.3, 9.5);
    for (var i = 0; i < 4; i++) {
      var s1 = ROW.s, cx = 836 + (i - 1.5) * ROW.gap, x1 = cx - 128 * s1, y1 = ROW.cy - 123 * s1;
      set($('u' + i), 'transform', 'translate(' + L(554.4, x1, ps) + ' ' + L(199.4, y1, ps) + ') scale(' + L(2.2, s1, ps) + ')');
      if (i < 3) set($('u' + i), 'opacity', P(t, 8.3, 8.6).toFixed(3));
    }
    set($('names'), 'opacity', P(t, 9.3, 10.0).toFixed(3));
  }

  /* ---------- player: from the start each time it comes into view ---------- */
  if (REDUCE) { render(END); return; }
  var raf = 0, t0 = 0;
  function frame(now) {
    var t = Math.min(END, (now - t0) / 1000);
    render(t);
    raf = t < END ? requestAnimationFrame(frame) : 0;
  }
  function start() { stop(); render(0); raf = requestAnimationFrame(function (now) { t0 = now; frame(now); }); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  render(0);
  if (!('IntersectionObserver' in window)) { start(); return; }
  var inView = false;
  new IntersectionObserver(function (es) {
    var e = es[es.length - 1];
    if (e.intersectionRatio >= 0.35 && !inView) { inView = true; start(); }
    else if (!e.isIntersecting && inView) { inView = false; stop(); render(0); }
  }, { threshold: [0, 0.35] }).observe(box);
})();
