/* Home page, "VegaFencer at a Glance": a simplified, looping animation of the five design steps
   (Logic with the AI assistant, Integrator, Harness Drawing, DRC/BOM, CAD link). Not real product screens.
   Everything is scoped to #glance. */
(function () {
  var root = document.getElementById('glance');
  if (!root) return;
  var $ = function (s) { return root.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STOP = {};
  var token = 0;
  var cur = { x: 470, y: 400 };

  /* ---------- timing helpers (all stop when another scene starts) ---------- */
  function guard(p) { var tk = token; return p.then(function (v) { if (tk !== token) throw STOP; return v; }); }
  function wait(ms) { return guard(new Promise(function (r) { setTimeout(r, REDUCE ? 0 : ms); })); }
  function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function tween(ms, fn) {
    var tk = token;
    if (REDUCE) ms = 0;
    return guard(new Promise(function (resolve) {
      if (!ms) { fn(1); return resolve(); }
      var t0 = performance.now();
      (function frame(now) {
        if (tk !== token) return resolve();
        var t = Math.min(1, (now - t0) / ms);
        fn(ease(t));
        if (t < 1) requestAnimationFrame(frame); else resolve();
      })(t0);
    }));
  }
  function fadeIn(el, ms) {
    el.classList.remove('h');
    if (REDUCE) return Promise.resolve();
    return el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms || 300 }).finished;
  }
  function show(sel, ms) { return guard(Promise.all($$(sel).map(function (el) { return fadeIn(el, ms); }))); }
  async function showEach(sel, gap) { var els = $$(sel); for (var i = 0; i < els.length; i++) { fadeIn(els[i], 250); await wait(gap); } }
  function draw(sel, ms, follow) {
    var els = $$(sel);
    els.forEach(function (el) { var L = el.getTotalLength(); el.style.strokeDasharray = L; el.style.strokeDashoffset = L; el.classList.remove('h'); });
    return tween(ms, function (e) {
      els.forEach(function (el) {
        var L = el.getTotalLength();
        el.style.strokeDashoffset = L * (1 - e);
        if (follow) { var p = el.getPointAtLength(L * e); setCursor(p.x, p.y); }
      });
    }).then(function () { els.forEach(function (el) { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; }); });
  }

  /* ---------- cursor ---------- */
  function setCursor(x, y) { cur.x = x; cur.y = y; $('#cursor').setAttribute('transform', 'translate(' + x + ' ' + y + ')'); }
  function move(x, y, ms) { var x0 = cur.x, y0 = cur.y; return tween(ms, function (e) { setCursor(x0 + (x - x0) * e, y0 + (y - y0) * e); }); }
  function click() {
    var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cur.x); c.setAttribute('cy', cur.y); c.setAttribute('r', 12);
    c.setAttribute('fill', 'none'); c.setAttribute('stroke', '#1a5fd0'); c.setAttribute('stroke-width', 1.5);
    c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center';
    $('#fx').appendChild(c);
    if (!REDUCE) c.animate([{ transform: 'scale(.3)', opacity: .9 }, { transform: 'scale(1.2)', opacity: 0 }], { duration: 450, fill: 'forwards' });
    return wait(260);
  }

  /* ---------- panel ---------- */
  function panel(title, html) { $('#pTitle').textContent = title; $('#pBody').innerHTML = html || '<p class="empty">선택된 항목 없음</p>'; }
  function rows(list) {
    return '<dl>' + list.map(function (r) { return '<div class="h"' + (r[2] ? ' id="' + r[2] + '"' : '') + '><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl>';
  }
  function sw(c) { return '<span class="sw" style="background:' + c + '"></span>'; }

  /* ---------- scene frame ---------- */
  var STEPS = ['Logic', 'Integrator', 'Harness Drawing', 'DRC · BOM', 'CAD 연동'];
  var CAPS = [
    '회로도에서 핀 연결을 정의합니다. 직접 그리거나, AI 어시스턴트에게 말로 요청할 수 있습니다.',
    '정의한 와이어를 차량 바닥을 따라가는 경로에 배치하고 번들로 묶습니다.',
    '번들 길이와 직경을 계산해 하네스 도면과 와이어 리스트를 만듭니다.',
    '설계 규칙 검사(DRC)로 오류를 찾고, BOM 리포트로 필요한 목록을 뽑습니다.',
    'CATIA V5, Siemens NX와 와이어 리스트와 번들 길이를 주고받습니다.'
  ];
  // After each caption: a link to that module's section on the product page, in the page's current language.
  var MORE_IDS = ['logic', 'integrator', 'harness', 'variant', 'bridge'];
  var MORE = {
    ko: { names: ['Logic', 'Integrator', 'Harness Drawing', 'DRC · BOM', 'CAD 연동'], fmt: function (n) { return n + ' 자세히 보기'; } },
    en: { names: ['Logic', 'Integrator', 'Harness Drawing', 'DRC · BOM', 'CAD integration'], fmt: function (n) { return 'More on ' + n; } },
    zh: { names: ['Logic', 'Integrator', 'Harness Drawing', 'DRC · BOM', 'CAD 集成'], fmt: function (n) { return '详细了解 ' + n; } },
    ja: { names: ['Logic', 'Integrator', 'Harness Drawing', 'DRC · BOM', 'CAD連携'], fmt: function (n) { return n + '\u2060の詳細'; } }
  };
  var capIndex = 0;
  function setCap(i) {
    capIndex = i;
    var m = MORE[document.documentElement.lang] || MORE.ko;
    var cap = $('#cap');
    cap.textContent = CAPS[i] + ' ';
    var a = document.createElement('a');
    a.className = 'glance-more';
    a.href = 'product#' + MORE_IDS[i];
    a.textContent = m.fmt(m.names[i]);
    a.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg>');
    cap.appendChild(a);
  }
  new MutationObserver(function () { setCap(capIndex); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  $('#steps').innerHTML = STEPS.map(function (s, i) { return '<button type="button" data-i="' + i + '"><i>' + (i + 1) + '</i>' + s + '</button>'; }).join('');
  $('#steps').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) play(+b.dataset.i); });

  function enter(i, markup) {
    root.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
    $('#scene').innerHTML = markup; $('#fx').innerHTML = '';
    $('#cursor').classList.add('h'); setCursor(470, 400);
    $$('#steps button').forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-current', k === i ? 'step' : 'false'); });
    setCap(i);
    panel('Properties');
    if (!REDUCE) $('#stage').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
  }
  async function hold() {
    await wait(3000);
    if (REDUCE) return;
    await guard($('#stage').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).finished);
  }

  /* ---------- shared schematic (scenes 1 and 4) ---------- */
  function schematic(dangling) {
    var w3end = dangling ? 560 : 636;
    return '' +
      '<g id="c8" class="h"><text class="ref" x="120" y="96">C8</text><text class="sub" x="148" y="96">ECU</text>' +
      '<rect class="box" x="120" y="108" width="110" height="220" rx="2"/>' +
      '<g class="pnum"><text x="210" y="154">1</text><text x="210" y="204">2</text><text x="210" y="254">3</text><text x="210" y="304">4</text></g></g>' +
      '<g id="c8pins" class="h"><rect class="pin" x="226" y="146" width="8" height="8"/><rect class="pin" x="226" y="196" width="8" height="8"/>' +
      '<rect class="pin" x="226" y="246" width="8" height="8"/><rect class="pin" x="226" y="296" width="8" height="8"/></g>' +
      '<g id="j1" class="h"><text class="ref" x="640" y="136">J1</text><text class="sub" x="662" y="136">Inline</text>' +
      '<rect class="box" x="640" y="148" width="110" height="220" rx="2"/>' +
      '<g class="pnum"><text x="652" y="194">1</text><text x="652" y="244">2</text><text x="652" y="294">3</text><text x="652" y="344">4</text></g></g>' +
      '<g id="j1pins" class="h"><rect class="pin" x="636" y="186" width="8" height="8"/><rect class="pin" x="636" y="236" width="8" height="8"/>' +
      '<rect class="pin" x="636" y="286" width="8" height="8"/><rect class="pin" x="636" y="336" width="8" height="8"/></g>' +
      '<path id="w1halo" class="halo h" d="M234 150 H420 V190 H636"/>' +
      '<path id="w1" class="wire h" style="stroke:var(--red)" d="M234 150 H420 V190 H636"/>' +
      '<path id="w2" class="wire h" d="M234 200 H450 V240 H636"/>' +
      '<path id="w3" class="wire h" style="stroke:var(--green)" d="M234 250 H480 V290 H' + w3end + '"/>' +
      '<text id="w1l" class="wlabel h" x="252" y="141">W1  AVSS 0.5  R</text>' +
      '<text id="w2l" class="wlabel h" x="252" y="191">W2  AVSS 0.5  B</text>' +
      '<text id="w3l" class="wlabel h" x="252" y="241">W3  AVSS 0.3  G</text>';
  }

  /* ---------- 1. Logic (drawn by hand, then by asking the AI assistant) ---------- */
  function chat() {
    return '<div class="chat"><div class="msgs" id="msgs"></div>' +
      '<div class="input"><span id="typed"></span><span class="caret"></span></div></div>';
  }
  function addMsg(who, html) {
    var d = document.createElement('div');
    d.className = 'msg ' + who + ' h';
    d.innerHTML = (who === 'ai' ? '<b class="who">VegaFencer AI</b>' : '') + html;
    $('#msgs').appendChild(d);
    return guard(fadeIn(d, 250));
  }
  function type(text, ms) {
    var el = $('#typed');
    return tween(ms, function (t) { el.textContent = text.slice(0, Math.round(text.length * t)); });
  }
  async function s1() {
    enter(0, schematic(false) +
      '<path id="w23halo" class="halo h" d="M234 200 H450 V240 H636 M234 250 H480 V290 H636"/>');
    await wait(300);
    show('#c8', 450); await wait(300);
    show('#j1', 450); await wait(400);
    show('#c8pins'); await show('#j1pins');

    // Draw W1 by hand
    setCursor(470, 400); show('#cursor', 200);
    await move(234, 150, 800);
    await click();
    await draw('#w1', 1300, true);
    await show('#w1l');

    // Ask the AI assistant for the other two wires
    $('#pTitle').innerHTML = 'AI Assistant <span class="mcp">MCP 연결됨</span>';
    $('#pBody').innerHTML = chat();
    await move(860, 380, 700);
    $('#cursor').classList.add('h');
    var ask = 'C8의 2, 3번 핀을 J1의 2, 3번 핀에 연결해줘';
    await type(ask, 1600);
    await wait(300);
    $('#typed').textContent = '';
    await addMsg('me', ask);
    await wait(250);
    var dots = document.createElement('div'); dots.className = 'msg ai dots'; dots.innerHTML = '<i></i><i></i><i></i>';
    $('#msgs').appendChild(dots);
    await wait(1000);
    dots.remove();
    await addMsg('ai', '와이어 2개를 만들었습니다.<br><span class="code">W2</span> C8-2 → J1-2<br><span class="code">W3</span> C8-3 → J1-3');
    draw('#w2', 800); await wait(200);
    await draw('#w3', 800);
    show('#w2l'); show('#w3l');
    await show('#w23halo', 250);
    await wait(900);
    $('#w23halo').classList.add('h');

    // Click W1 to see what was defined
    setCursor(560, 380); show('#cursor', 200);
    await move(400, 152, 700);
    await click();
    show('#w1halo', 200);
    panel('Properties', rows([['이름', 'W1'], ['규격', 'AVSS 0.5 mm²'], ['색상', sw('#c8372d') + 'R (빨강)'],
      ['시작', 'C8 · 1번 핀'], ['끝', 'J1 · 1번 핀'], ['하네스', 'MAIN']]));
    await showEach('#pBody .h', 70);
    await hold();
  }

  /* ---------- 2. Integrator ---------- */
  // Vehicle seen from above (front on the left): the harness runs along the floor
  var CAR =
    '<text class="small" x="60" y="92">차량 평면도 · 위에서 본 모습</text>' +
    '<g id="car">' +
    '<path class="cbody h" d="M160 120 H720 Q808 122 818 190 V290 Q808 358 720 360 H160 Q96 358 86 300 V180 Q96 122 160 120 Z" fill="none" stroke="#9aa3ae" stroke-width="1.5"/>' +
    '<g id="carx" class="h" fill="none" stroke="#c4cad2" stroke-width="1.2">' +
    '<rect x="160" y="106" width="66" height="16" rx="5" stroke="#9aa3ae"/><rect x="160" y="358" width="66" height="16" rx="5" stroke="#9aa3ae"/>' +
    '<rect x="640" y="106" width="66" height="16" rx="5" stroke="#9aa3ae"/><rect x="640" y="358" width="66" height="16" rx="5" stroke="#9aa3ae"/>' +
    '<path d="M298 132 Q282 240 298 348"/><path d="M618 136 Q634 240 618 344"/>' +
    '<rect x="370" y="146" width="56" height="62" rx="8"/><rect x="370" y="272" width="56" height="62" rx="8"/>' +
    '<rect x="510" y="146" width="62" height="188" rx="8"/>' +
    '<text x="110" y="244" class="small" style="font-size:10px;fill:#b3b9c2;stroke:none">앞</text>' +
    '<text x="790" y="244" class="small" style="font-size:10px;fill:#b3b9c2;stroke:none">뒤</text></g></g>';
  var ROUTE = 'M236 196 L330 196 L470 240 L690 240';
  async function s2() {
    enter(1, CAR +
      '<path id="route" class="h" d="' + ROUTE + '" fill="none" stroke="#e3e7ec" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path id="branch" class="h" d="M330 196 L330 300 L352 312" fill="none" stroke="#e3e7ec" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path id="bhalo" class="halo h" d="' + ROUTE + '" stroke-width="20"/>' +
      '<path id="rw1" class="wire h" style="stroke:var(--red)" d="M236 193 L329 193 L469 237 L690 237"/>' +
      '<path id="rw2" class="wire h" d="' + ROUTE + '"/>' +
      '<path id="rw3" class="wire h" style="stroke:var(--green)" d="M236 199 L331 199 L471 243 L690 243"/>' +
      '<g id="conns" class="h">' +
      '<rect class="box" x="222" y="188" width="16" height="16"/><text class="ref" x="214" y="186" text-anchor="end">C8</text>' +
      '<rect class="box" x="684" y="232" width="16" height="16"/><text class="ref" x="708" y="246">J1</text>' +
      '<rect class="box" x="350" y="305" width="14" height="14"/><text class="ref" x="370" y="317">C11</text></g>' +
      '<g id="nodes" class="h"><circle cx="330" cy="196" r="4.5" fill="#fff" stroke="#1d2330" stroke-width="1.4"/><text class="small" x="322" y="180">N1</text>' +
      '<circle cx="470" cy="240" r="4.5" fill="#fff" stroke="#1d2330" stroke-width="1.4"/><text class="small" x="462" y="262">N2</text></g>' +
      '<g id="seglen" class="h"><text class="small" x="270" y="220">380</text><text class="small" x="570" y="262">860</text></g>');
    await wait(300);
    show('#carx', 900);
    await draw('.cbody', 1300);
    show('#conns', 400); await wait(400);
    draw('#route', 900); await draw('#branch', 400);
    await show('#nodes');
    draw('#rw1', 1000); await wait(150);
    draw('#rw2', 1000); await wait(150);
    await draw('#rw3', 1000);
    await show('#seglen');
    setCursor(470, 400); show('#cursor', 200);
    await move(400, 219, 700);
    await click();
    show('#bhalo', 200);
    panel('Bundle', rows([['이름', 'B01'], ['와이어', sw('#c8372d') + 'W1 ' + sw('#1d2330') + 'W2 ' + sw('#2f8f4e') + 'W3'],
      ['경로', 'C8 → N1 → N2 → J1'], ['길이', '1,240 mm'], ['토폴로지', '<span class="ok">✓</span> 끊긴 구간 없음', 'topo']]));
    await showEach('#pBody .h:not(#topo)', 70);
    await wait(700);
    await show('#topo');
    await hold();
  }

  /* ---------- 3. Harness Drawing ---------- */
  function cav(x, y) {
    return '<rect x="' + x + '" y="' + y + '" width="14" height="14" fill="#fff" stroke="#1d2330"/>';
  }
  function conn(id, x, y, label) {
    return '<g id="' + id + '" class="h dconn"><text class="ref" x="' + x + '" y="' + (y - 8) + '">' + label + '</text>' +
      '<rect class="box" x="' + x + '" y="' + y + '" width="52" height="60" rx="2"/>' +
      cav(x + 8, y + 10) + cav(x + 30, y + 10) + cav(x + 8, y + 34) + cav(x + 30, y + 34) +
      '<g class="pnum" font-size="9"><text x="' + (x + 12) + '" y="' + (y + 21) + '" style="font-size:9px">1</text><text x="' + (x + 34) + '" y="' + (y + 21) + '" style="font-size:9px">2</text>' +
      '<text x="' + (x + 12) + '" y="' + (y + 45) + '" style="font-size:9px">3</text><text x="' + (x + 34) + '" y="' + (y + 45) + '" style="font-size:9px">4</text></g></g>';
  }
  function tr(id, cells, y, head) {
    var xs = [92, 168, 262, 356, 470, 560];
    return '<g id="' + id + '" class="h trow">' + cells.map(function (c, k) {
      return '<text x="' + xs[k] + '" y="' + y + '" style="font-size:12px;' + (head ? 'fill:#6b7280;font-weight:500' : 'fill:#1d2330') + '">' + c + '</text>';
    }).join('') + '<path d="M88 ' + (y + 8) + ' H640" stroke="' + (head ? '#1d2330' : '#e6e8ec') + '" stroke-width="1"/></g>';
  }
  async function s3() {
    enter(2,
      '<path id="trunk" class="h" d="M150 170 H720" stroke="#2b3240" stroke-width="6" fill="none"/>' +
      '<path id="dbranch" class="h" d="M325 170 V104" stroke="#2b3240" stroke-width="5" fill="none"/>' +
      conn('dc8', 92, 142, 'C8') + conn('dj1', 726, 142, 'J1') +
      '<g id="dc11" class="h dconn"><text class="ref" x="346" y="92">C11</text><rect class="box" x="309" y="78" width="32" height="26" rx="2"/></g>' +
      '<g id="ext" class="h" stroke="#b9bfc8" stroke-width="1"><path d="M150 180 V250"/><path d="M325 180 V222"/><path d="M720 180 V250"/></g>' +
      '<g id="dims1" class="h" stroke="#6b7280" stroke-width="1" fill="none"><path d="M150 214 H325"/><path d="M325 214 H720"/></g>' +
      '<path id="dims2" class="h" d="M150 242 H720" stroke="#6b7280" stroke-width="1" fill="none"/>' +
      '<g id="dimt" class="h small" text-anchor="middle"><text x="237" y="208">380</text><text x="522" y="208">860</text><text x="435" y="236" style="fill:#1d2330;font-weight:600">1,240</text></g>' +
      '<path id="lead" class="h" d="M520 167 L552 126 H600" stroke="#6b7280" stroke-width="1" fill="none"/>' +
      '<text id="dia" class="h" x="558" y="120" style="font-size:13px;font-weight:600;fill:#1d2330">Ø4.2</text>' +
      '<text id="tt" class="h" x="92" y="276" style="font-size:13px;font-weight:600;fill:#1d2330">와이어 리스트</text>' +
      tr('th', ['와이어', '시작', '끝', '규격', '색', '길이 (mm)'], 302, true) +
      tr('r1', ['W1', 'C8-1', 'J1-1', 'AVSS 0.5', 'R', '1,280'], 328) +
      tr('r2', ['W2', 'C8-2', 'J1-2', 'AVSS 0.5', 'B', '1,280'], 352) +
      tr('r3', ['W3', 'C8-3', 'J1-3', 'AVSS 0.3', 'G', '1,280'], 376));
    await wait(300);
    await draw('#trunk', 900);
    await draw('#dbranch', 400);
    await showEach('.dconn', 200);
    await show('#ext', 300);
    await draw('#dims1 path', 500);
    await draw('#dims2', 500);
    await show('#dimt');
    await draw('#lead', 400);
    await show('#dia');
    panel('도면', rows([['번들 길이', '1,240 mm'], ['번들 직경', 'Ø4.2 mm'], ['와이어', '3개'], ['커넥터', 'C8 · J1 · C11']]));
    showEach('#pBody .h', 80);
    await show('#tt');
    await showEach('.trow', 260);
    await hold();
  }

  /* ---------- 4. DRC and BOM report ---------- */
  var K = .78, OX = 50, OY = 52;
  function T(x, y) { return [x * K + OX, y * K + OY]; }
  function btn(id, x, w, label) {
    return '<g id="' + id + '"><rect x="' + x + '" y="70" width="' + w + '" height="26" rx="4" fill="#fff" stroke="#c9ced6"/>' +
      '<text x="' + (x + w / 2) + '" y="87" text-anchor="middle" style="font-size:12px;font-weight:600;fill:#1d2330">' + label + '</text></g>';
  }
  function press(id) {
    var r = $('#' + id + ' rect');
    if (!REDUCE) r.animate([{ fill: '#dce7fb' }, { fill: '#fff' }], { duration: 600 });
  }
  async function s4() {
    var e = T(560, 290);
    enter(3,
      btn('bDrc', 52, 58, 'DRC') + btn('bBom', 118, 100, 'BOM Report') +
      '<g transform="translate(' + OX + ' ' + OY + ') scale(' + K + ')">' + schematic(true) +
      '<circle id="w3err" class="h" cx="560" cy="290" r="10" fill="none" stroke="#c8372d" stroke-width="2"/></g>' +
      '<rect x="50" y="346" width="800" height="70" fill="#fff" stroke="#d9dde3"/>' +
      '<text x="62" y="364" style="font-size:12px;font-weight:600;fill:#6b7280">DRC</text>' +
      '<text id="msum" x="838" y="364" text-anchor="end" class="small"></text>' +
      '<text id="m1" x="62" y="392" style="font-size:12.5px;fill:#1d2330"></text>');
    $$('#c8, #j1, #c8pins, #j1pins, #w1, #w2, #w3, #w1l, #w2l, #w3l').forEach(function (el) { el.classList.remove('h'); });
    await wait(600);
    setCursor(470, 400); show('#cursor', 200);
    await move(81, 84, 800);
    await click(); press('bDrc');
    await wait(300);
    $('#msum').textContent = '규칙 24개 검사 · 오류 1';
    $('#m1').innerHTML = '<tspan style="fill:#c8372d;font-weight:700">●</tspan>  연결성 · W3의 끝이 핀에 연결되지 않았습니다';
    show('#msum'); await show('#m1');
    await move(200, 389, 700);
    await click();
    $('#w3').style.stroke = '#1a5fd0'; $('#w3').style.strokeWidth = 2.4;
    await show('#w3err');
    await move(e[0], e[1], 800);
    await click();
    var j = T(636, 290)[0];
    await tween(700, function (t) {
      var x = 560 + (636 - 560) * t;
      $('#w3').setAttribute('d', 'M234 250 H480 V290 H' + x);
      setCursor(x * K + OX, e[1]);
    });
    $('#w3err').classList.add('h');
    $('#w3').style.stroke = 'var(--green)'; $('#w3').style.strokeWidth = '';
    await wait(300);
    await move(81, 84, 800);
    await click(); press('bDrc');
    await wait(300);
    $('#msum').textContent = '규칙 24개 검사 · 오류 0';
    $('#m1').innerHTML = '<tspan style="fill:#2f8f4e;font-weight:700">✓</tspan>  오류가 없습니다';
    await show('#m1');
    await wait(500);
    await move(168, 84, 600);
    await click(); press('bBom');
    panel('BOM Report',
      '<p class="ptl h">와이어 리스트</p><table class="h"><tr><th>와이어</th><th>규격</th><th class="r">길이</th></tr>' +
      '<tr><td>' + sw('#c8372d') + 'W1</td><td>AVSS 0.5</td><td class="r">1,280</td></tr>' +
      '<tr><td>' + sw('#1d2330') + 'W2</td><td>AVSS 0.5</td><td class="r">1,280</td></tr>' +
      '<tr><td>' + sw('#2f8f4e') + 'W3</td><td>AVSS 0.3</td><td class="r">1,280</td></tr></table>' +
      '<p class="ptl h">커넥터 리스트</p><table class="h"><tr><th>커넥터</th><th>종류</th><th class="r">극수</th></tr>' +
      '<tr><td>C8</td><td>ECU</td><td class="r">4</td></tr><tr><td>J1</td><td>Inline</td><td class="r">4</td></tr></table>');
    await showEach('#pBody .h', 180);
    await hold();
  }

  /* ---------- 5. CAD (Bridge) ---------- */
  function cube(x, y) {
    return '<g stroke="#1d2330" stroke-width="1" stroke-linejoin="round">' +
      '<path d="M' + (x - 9) + ' ' + (y - 5) + ' L' + x + ' ' + (y - 10) + ' L' + (x + 9) + ' ' + (y - 5) + ' L' + x + ' ' + y + ' Z" fill="#fff"/>' +
      '<path d="M' + (x - 9) + ' ' + (y - 5) + ' L' + x + ' ' + y + ' V' + (y + 10) + ' L' + (x - 9) + ' ' + (y + 5) + ' Z" fill="#eef0f3"/>' +
      '<path d="M' + x + ' ' + y + ' L' + (x + 9) + ' ' + (y - 5) + ' V' + (y + 5) + ' L' + x + ' ' + (y + 10) + ' Z" fill="#dfe3e8"/></g>';
  }
  function tube(mid) { return 'M590 300 L' + mid[0] + ' ' + mid[1] + ' L735 285 L800 240'; }
  function packet(id, label, w) {
    return '<g id="' + id + '" class="h"><rect x="' + (-w / 2) + '" y="-11" width="' + w + '" height="22" rx="11" fill="#1a5fd0"/>' +
      '<text x="0" y="4" text-anchor="middle" style="font-size:11.5px;font-weight:600;fill:#fff">' + label + '</text></g>';
  }
  async function s5() {
    var mid = [652, 262];
    enter(4,
      '<g id="vf" class="h"><rect x="60" y="100" width="300" height="250" rx="6" fill="#fff" stroke="#c9ced6"/>' +
      '<text x="80" y="130" style="font-size:15px;font-weight:700;fill:#1d2330">VegaFencer</text><text x="80" y="148" class="small">와이어 리스트</text>' +
      '<g style="font-size:12px;fill:#1d2330"><text x="80" y="180" class="small">와이어</text><text x="150" y="180" class="small">규격</text><text x="340" y="180" text-anchor="end" class="small">길이 (mm)</text>' +
      '<path d="M80 188 H340" stroke="#1d2330"/>' +
      '<text x="80" y="210">W1</text><text x="150" y="210">AVSS 0.5</text><text id="vw1" x="340" y="210" text-anchor="end">1,280</text><path d="M80 218 H340" stroke="#eceef2"/>' +
      '<text x="80" y="236">W2</text><text x="150" y="236">AVSS 0.5</text><text id="vw2" x="340" y="236" text-anchor="end">1,280</text><path d="M80 244 H340" stroke="#eceef2"/>' +
      '<text x="80" y="262">W3</text><text x="150" y="262">AVSS 0.3</text><text id="vw3" x="340" y="262" text-anchor="end">1,280</text><path d="M80 270 H340" stroke="#eceef2"/>' +
      '<text x="80" y="310" class="small">번들 B01 길이</text><text id="vlen" x="340" y="310" text-anchor="end" style="font-weight:600">1,240 mm</text></g></g>' +
      '<g id="cad" class="h"><rect x="540" y="100" width="300" height="250" rx="6" fill="#fff" stroke="#c9ced6"/>' +
      '<text x="560" y="130" style="font-size:15px;font-weight:700;fill:#1d2330">3D CAD</text><text x="560" y="148" class="small">CATIA V5 · Siemens NX</text>' +
      '<g stroke="#9aa0aa" stroke-width="1"><path d="M806 150 L826 140"/><path d="M806 150 L786 140"/><path d="M806 150 V128"/></g>' +
      '<g class="small" style="font-size:9px"><text x="828" y="142">X</text><text x="778" y="142">Y</text><text x="803" y="124">Z</text></g></g>' +
      '<path id="tubeO" class="h" d="' + tube(mid) + '" fill="none" stroke="#2b3240" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path id="tubeI" class="h" d="' + tube(mid) + '" fill="none" stroke="#8b93a0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 -1.5)"/>' +
      '<g id="cubes" class="h">' + cube(590, 300) + cube(800, 240) +
      '<text class="ref" x="578" y="326" style="font-size:12px">C8</text><text class="ref" x="812" y="246" style="font-size:12px">J1</text></g>' +
      '<text id="clen" class="h" x="690" y="315" style="font-size:12px;font-weight:600;fill:#1d2330">1,240 mm</text>' +
      '<g id="a1" class="h"><path d="M372 190 H522" stroke="#1d2330" stroke-width="1.3"/><path d="M522 185 L530 190 L522 195 Z" fill="#1d2330"/>' +
      '<text x="451" y="176" text-anchor="middle" class="small">와이어 리스트 · 번들 정보</text></g>' +
      '<g id="a2" class="h"><path d="M528 270 H378" stroke="#1d2330" stroke-width="1.3"/><path d="M378 265 L370 270 L378 275 Z" fill="#1d2330"/>' +
      '<text x="451" y="294" text-anchor="middle" class="small">번들 길이</text></g>' +
      packet('pk1', 'W1–W3', 70) + packet('pk2', '1,265 mm', 78));
    panel('Bridge', rows([['연동', 'CATIA V5<br>Siemens NX'], ['보냄', '와이어 리스트, 번들 정보'], ['받음', '번들 길이'],
      ['상태', '<span id="st">대기</span>']]));
    await wait(300);
    show('#vf', 400); await wait(250);
    await show('#cad', 400);
    showEach('#pBody .h', 80);
    show('#a1'); await show('#a2');
    await wait(300);
    // Send the wire list to CAD
    var p1 = $('#pk1'); p1.classList.remove('h');
    $('#st').textContent = '보내는 중';
    await tween(1000, function (t) { p1.setAttribute('transform', 'translate(' + (372 + 156 * t) + ' 190)'); });
    p1.classList.add('h');
    $('#st').textContent = 'CAD에서 경로 수정';
    await draw('#tubeO', 900); show('#tubeI', 200);
    show('#cubes'); await show('#clen');
    await wait(500);
    // A designer reroutes the bundle in CAD: it gets longer
    await tween(1000, function (t) {
      var m = [652 + 4 * t, 262 - 26 * t], d = tube(m);
      $('#tubeO').setAttribute('d', d); $('#tubeI').setAttribute('d', d);
      $('#clen').textContent = (1240 + Math.round(25 * t)).toLocaleString('en-US') + ' mm';
    });
    await wait(400);
    // Send the new length back to VegaFencer
    var p2 = $('#pk2'); p2.classList.remove('h');
    $('#st').textContent = '받는 중';
    await tween(1000, function (t) { p2.setAttribute('transform', 'translate(' + (528 - 156 * t) + ' 270)'); });
    p2.classList.add('h');
    ['#vlen', '#vw1', '#vw2', '#vw3'].forEach(function (s) {
      var el = $(s);
      el.textContent = s === '#vlen' ? '1,265 mm' : '1,305';
      el.style.fill = '#1a5fd0'; el.style.fontWeight = 700;
    });
    $('#st').innerHTML = '<span class="ok">✓</span> 동기화 완료';
    await hold();
  }

  /* ---------- player ---------- */
  // Animations cancelled by a scene change reject their promises; that is expected.
  window.addEventListener('unhandledrejection', function (e) { if (e.reason === STOP || (e.reason && e.reason.name === 'AbortError')) e.preventDefault(); });
  var SCENES = [s1, s2, s3, s4, s5];
  async function play(from) {
    var tk = ++token;
    for (var i = from; ; i = (i + 1) % SCENES.length) {
      try { await SCENES[i](); }
      catch (err) { if (err !== STOP && err.name !== 'AbortError') console.error(err); return; }
      if (tk !== token || REDUCE) return;
    }
  }
  // Start from scene 1 every time the animation scrolls into view, and stop while it is off screen.
  if (!('IntersectionObserver' in window)) { play(0); return; }
  var inView = false;
  var io = new IntersectionObserver(function (es) {
    var e = es[es.length - 1];
    if (e.intersectionRatio >= .3 && !inView) { inView = true; play(0); }
    else if (!e.isIntersecting && inView) { inView = false; token++; root.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); }); }
  }, { threshold: [0, .3] });
  io.observe($('#stage'));
})();
