/* Local motion, zero rendering dependencies or background video downloads. */
(() => {
  'use strict';

  const copy = {
    ko: {
      hero_title: '모든 연결에,<br>설계의 확신을.',
      hero_subtitle: '전기적 설계 의도에서 실제 와이어링 하네스까지. VegaFencer는 차량 E/E 아키텍처의 모든 연결을 하나의 일관된 데이터로 이어줍니다.',
      hero_cta_demo: '데모 신청하기', motion_kicker: 'VegaFencer / 차량 E/E 엔지니어링',
      motion_explore: '설계 흐름 살펴보기', motion_origin: '독일에서 개발한 정밀 엔지니어링 플랫폼',
      motion_drawing: 'E/E 아키텍처 · 개념도', motion_pause: '모션 일시정지', motion_resume: '모션 재생',
      motion_static: '모션 감소 적용', motion_model: '논리적 연결에서 물리적 배선으로', motion_concept: '개념 시각화',
      motion_power: '전원 분배', motion_data: '데이터 연결', motion_control: '제어 신호',
      motion_scroll: '플랫폼 살펴보기', motion_interface_label: 'VegaFencer 작업 환경',
      motion_interface_title: '복잡한 설계도,<br>명확한 하나의 화면으로.',
      motion_interface_desc: '회로 설계, 토폴로지 통합, 하네스 도면과 검증까지. 실제 제품 화면에서 연결된 워크플로우를 확인하세요.'
    },
    en: {
      hero_title: 'Every connection.<br>Engineered with intent.',
      hero_subtitle: 'From electrical intent to the physical wiring harness. VegaFencer connects every part of your vehicle E/E architecture through one consistent data model.',
      hero_cta_demo: 'Request a demo', motion_kicker: 'VegaFencer / Vehicle E/E engineering',
      motion_explore: 'Explore the workflow', motion_origin: 'Precision engineering. Developed in Germany.',
      motion_drawing: 'E/E architecture · concept', motion_pause: 'Pause motion', motion_resume: 'Play motion',
      motion_static: 'Reduced motion', motion_model: 'From logical connections to physical wiring', motion_concept: 'Concept visualization',
      motion_power: 'Power distribution', motion_data: 'Data connection', motion_control: 'Control signal',
      motion_scroll: 'Explore the platform', motion_interface_label: 'Inside VegaFencer',
      motion_interface_title: 'Complex engineering.<br>One clear workspace.',
      motion_interface_desc: 'Circuit design, topology integration, harness drawings and verification. Explore the connected workflow in the actual product interface.'
    },
    zh: {
      hero_title: '每一处连接，<br>皆有设计依据。',
      hero_subtitle: '从电气设计意图到实际线束。VegaFencer 通过一致的数据模型，连接车辆 E/E 架构的每一个环节。',
      hero_cta_demo: '申请演示', motion_kicker: 'VegaFencer / 车辆 E/E 工程',
      motion_explore: '探索设计流程', motion_origin: '源自德国的精密工程平台',
      motion_drawing: 'E/E 架构 · 概念图', motion_pause: '暂停动画', motion_resume: '播放动画',
      motion_static: '已减少动态效果', motion_model: '从逻辑连接到物理布线', motion_concept: '概念可视化',
      motion_power: '电源分配', motion_data: '数据连接', motion_control: '控制信号',
      motion_scroll: '探索平台', motion_interface_label: 'VegaFencer 工作环境',
      motion_interface_title: '复杂工程，<br>清晰呈现。',
      motion_interface_desc: '从电路设计、拓扑集成到线束图纸与验证，在实际产品界面中探索连贯的工作流程。'
    },
    ja: {
      hero_title: 'すべての接続に、<br>確かな設計意図を。',
      hero_subtitle: '電気的な設計意図から実際のワイヤーハーネスまで。VegaFencerは、一貫したデータモデルで車両E/Eアーキテクチャのすべてをつなぎます。',
      hero_cta_demo: 'デモを申し込む', motion_kicker: 'VegaFencer / 車両E/Eエンジニアリング',
      motion_explore: '設計フローを見る', motion_origin: 'ドイツで開発された精密エンジニアリング',
      motion_drawing: 'E/Eアーキテクチャ · 概念図', motion_pause: 'モーションを停止', motion_resume: 'モーションを再生',
      motion_static: '動きを抑える設定', motion_model: '論理的な接続から物理的な配線へ', motion_concept: '概念ビジュアライゼーション',
      motion_power: '電源分配', motion_data: 'データ接続', motion_control: '制御信号',
      motion_scroll: 'プラットフォームを見る', motion_interface_label: 'VegaFencerの作業環境',
      motion_interface_title: '複雑な設計を、<br>明確なワークスペースに。',
      motion_interface_desc: '回路設計、トポロジー統合、ハーネス図面、検証まで。実際の製品画面でつながるワークフローをご覧ください。'
    }
  };
  Object.assign(copy.ko, { fig_logic: '핀 단위 연결 의도와 신호 타입', fig_int: '회로 넷과 토폴로지 세그먼트의 동기화', fig_harness: '번들 길이·직경 자동 산출' });
  Object.assign(copy.en, { fig_logic: 'Pin-level intent and signal types', fig_int: 'Circuit nets and topology segments, in sync', fig_harness: 'Bundle lengths and diameters, calculated' });
  Object.assign(copy.zh, { fig_logic: '引脚级连接意图与信号类型', fig_int: '电路网络与拓扑段同步', fig_harness: '自动计算线束长度与直径' });
  Object.assign(copy.ja, { fig_logic: 'ピン単位の接続意図と信号タイプ', fig_int: '回路ネットとトポロジーセグメントの同期', fig_harness: 'バンドル長・径を自動算出' });
  Object.entries(copy).forEach(([lang, values]) => Object.assign(i18n[lang], values));

  // Drawing strips under the feature screenshots. .fd paths draw, .fp parts appear; --d sequences them.
  const d = (path, delay, extra = '') => '<path class="fd' + extra + '" pathLength="1" style="--d:' + delay + 's" d="' + path + '"/>';
  const tag = (x, y, text, delay) => '<g class="fp" style="--d:' + delay + 's"><rect class="fig-tag" x="' + (x - 21) + '" y="' + (y - 8) + '" width="42" height="16" rx="3"/><text class="fig-tag-text" x="' + x + '" y="' + (y + 3.5) + '">' + text + '</text></g>';
  const figures = {
    logic: { no: '01', key: 'fig_logic', svg:
      '<rect class="fig-ink" x="10" y="14" width="70" height="84" rx="3"/><text class="fig-label" x="45" y="10">ECU</text>' +
      '<rect class="fig-ink" x="320" y="14" width="70" height="84" rx="3"/><text class="fig-label" x="355" y="10">LAMP</text>' +
      [32, 56, 80].map((y, i) => '<rect class="fig-pin" x="77" y="' + (y - 3) + '" width="6" height="6"/><text class="fig-pin-text" x="70" y="' + (y + 3) + '">' + (i + 1) + '</text>' +
        '<rect class="fig-pin" x="317" y="' + (y - 3) + '" width="6" height="6"/><text class="fig-pin-text" x="330" y="' + (y + 3) + '">' + (i + 1) + '</text>').join('') +
      d('M83 32H317', .1, ' fig-accent') + d('M83 56H170V80H317', .55, ' fig-accent') + d('M83 80H130V102H250V56H317', 1, ' fig-accent') +
      tag(200, 32, '12V', .8) + tag(214, 80, 'CAN', 1.25) + tag(190, 102, 'PWM', 1.7) },
    integrator: { no: '02', key: 'fig_int', svg:
      [24, 56, 88].map((y, i) => '<circle class="fig-node" cx="18" cy="' + y + '" r="3"/><path class="fig-ink" d="M18 ' + y + 'H112"/><circle class="fig-node" cx="112" cy="' + y + '" r="3"/><text class="fig-pin-text" x="40" y="' + (y - 6) + '">N' + (i + 1) + '</text>').join('') +
      '<path class="fig-ink" d="M250 30L318 26L372 52L330 92L262 84Z"/>' +
      [[250, 30], [318, 26], [372, 52], [330, 92], [262, 84]].map(([x, y]) => '<circle class="fig-node" cx="' + x + '" cy="' + y + '" r="4"/>').join('') +
      d('M115 24C180 -2 230 8 284 28', .15, ' fig-map') + d('M115 56C200 82 262 46 351 72', .55, ' fig-map') + d('M115 88C180 114 230 106 296 88', .95, ' fig-map') +
      d('M250 30L318 26', .7, ' fig-accent') + d('M372 52L330 92', 1.1, ' fig-accent') + d('M330 92L262 84', 1.5, ' fig-accent') +
      tag(372, 100, 'SYNC', 1.9) },
    harness: { no: '03', key: 'fig_harness', svg:
      '<path class="fig-dim" d="M28 18V30M120 18V30M262 18V30M372 18V30M28 24H372M120 30V58M262 30V58"/>' +
      d('M28 64H372', .1, ' fig-bundle') + d('M120 64L150 96H196', .6, ' fig-bundle') + d('M262 64L292 34H330', .9, ' fig-bundle') +
      [[14, 64], [386, 64], [204, 96], [338, 34]].map(([x, y], i) => '<g class="fp" style="--d:' + (1.15 + i * .12) + 's"><rect class="fig-plug" x="' + (x - 8) + '" y="' + (y - 9) + '" width="16" height="18" rx="2"/><path class="fig-plug-pin" d="M' + (x - 3) + ' ' + (y - 4) + 'v8M' + (x + 3) + ' ' + (y - 4) + 'v8"/></g>').join('') +
      '<g class="fp" style="--d:1.6s"><text class="fig-dim-text" x="74" y="16">230 mm</text><text class="fig-dim-text" x="191" y="16">350 mm</text><text class="fig-dim-text" x="317" y="16">270 mm</text></g>' +
      '<g class="fp" style="--d:1.85s"><path class="fig-dim" d="M232 64L246 92H276"/><text class="fig-dim-text" x="300" y="95">Ø 11.6</text></g>' }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('about');
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('engineeringMotionToggle');
    const label = toggle.querySelector('[data-i18n]');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = false;
    try { paused = localStorage.getItem('engineering-motion-paused') === 'true'; } catch (_) { /* Optional preference storage. */ }

    const updateMotion = () => {
      const stopped = paused || preference.matches;
      document.body.classList.toggle('engineering-motion-paused', stopped);
      toggle.setAttribute('aria-pressed', String(stopped));
      toggle.disabled = preference.matches;
      label.dataset.i18n = preference.matches ? 'motion_static' : stopped ? 'motion_resume' : 'motion_pause';
      label.textContent = (i18n[document.documentElement.lang] || i18n.ko)[label.dataset.i18n];
      document.dispatchEvent(new Event('engineering-motion-change'));
    };
    toggle.addEventListener('click', () => {
      paused = !paused;
      try { localStorage.setItem('engineering-motion-paused', String(paused)); } catch (_) { /* Optional preference storage. */ }
      updateMotion();
    });
    preference.addEventListener('change', updateMotion);
    updateMotion();

    new IntersectionObserver(([entry]) => {
      document.body.classList.toggle('engineering-motion-offscreen', !entry.isIntersecting);
      nav.classList.toggle('engineering-nav-dark', entry.isIntersecting);
    }, { rootMargin: '-90px 0px 0px 0px' }).observe(hero);
    const workflow = document.getElementById('workflow');
    new IntersectionObserver(([entry]) => {
      workflow.classList.toggle('workflow-motion-offscreen', !entry.isIntersecting);
    }).observe(workflow);
    // Each stage: a schematic that redraws itself when the data packet arrives, plus the artifact it hands on.
    const draw = (d, n) => '<path class="wf-draw" pathLength="1" style="--n:' + n + '" d="' + d + '"/>';
    const stages = [
      { artifact: 'Logic netlist', paths: ['M20 14H52', 'M20 22H32V30H52', 'M20 30H26V40H60V37'],
        extra: '<rect class="wf-base" x="4" y="7" width="16" height="30" rx="2"/><rect class="wf-base" x="52" y="7" width="16" height="30" rx="2"/>' },
      { artifact: 'Topology model', paths: ['M36 22L11 8', 'M36 22L61 8', 'M36 22L11 36', 'M36 22L61 36'],
        extra: '<circle class="wf-base" cx="36" cy="22" r="5"/><circle class="wf-base" cx="9" cy="7" r="2.5"/><circle class="wf-base" cx="63" cy="7" r="2.5"/><circle class="wf-base" cx="9" cy="37" r="2.5"/><circle class="wf-base" cx="63" cy="37" r="2.5"/>' },
      { artifact: 'Wire list · Drawing', paths: ['M6 22H66', 'M22 22L30 8H38', 'M42 22L50 36H58'],
        extra: '<rect class="wf-base" x="1" y="18" width="5" height="8" rx="1"/><rect class="wf-base" x="66" y="18" width="5" height="8" rx="1"/><rect class="wf-base" x="38" y="5" width="5" height="6" rx="1"/><rect class="wf-base" x="58" y="33" width="5" height="6" rx="1"/>' },
      { artifact: 'DRC · BOM report', paths: ['M15 9.5L17 11.5L21 7.5', 'M15 21.5L17 23.5L21 19.5', 'M15 33.5L17 35.5L21 31.5'],
        extra: '<rect class="wf-base" x="13" y="5" width="10" height="9" rx="2"/><rect class="wf-base" x="13" y="17" width="10" height="9" rx="2"/><rect class="wf-base" x="13" y="29" width="10" height="9" rx="2"/><path class="wf-base" d="M29 9.5H59M29 21.5H53M29 33.5H57"/>' }
    ];
    workflow.querySelectorAll('.workflow-step').forEach((step, index) => {
      const stage = stages[index];
      const circle = step.firstElementChild;
      const icon = step.querySelector('.material-symbols-outlined');
      if (!stage || !icon) return;
      step.style.setProperty('--wf-delay', (index * 2.5) + 's');
      circle.removeAttribute('style'); // inline colours would outrank the keyframes
      icon.outerHTML = '<svg class="wf-glyph" viewBox="0 0 72 44" aria-hidden="true">' + stage.extra +
        stage.paths.map(d => '<path class="wf-base" d="' + d + '"/>').join('') +
        stage.paths.map(draw).join('') + '</svg>';
      step.insertAdjacentHTML('beforeend', '<span class="wf-artifact" translate="no">' + stage.artifact + '</span>');
    });

    const lang = i18n[document.documentElement.lang] || i18n.ko;
    const figureObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-drawn');
      figureObserver.unobserve(entry.target);
    }), { threshold: .5 });
    Object.entries(figures).forEach(([id, figure]) => {
      const card = document.querySelector('#' + id + ' .rounded-2xl');
      if (!card) return;
      card.insertAdjacentHTML('beforeend', '<figure class="eng-fig eng-fig-' + id + '"><figcaption><span translate="no">FIG. ' + figure.no + '</span>' +
        '<span data-i18n="' + figure.key + '">' + lang[figure.key] + '</span></figcaption>' +
        '<svg viewBox="0 0 400 112" aria-hidden="true">' + figure.svg + '</svg></figure>');
      figureObserver.observe(card.lastElementChild);
    });

    const updateVisibility = () => document.body.classList.toggle('engineering-page-hidden', document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    updateVisibility();

    const symbols = [
      '<path d="M3 7h7v14H3m18-14h-7v14h7M10 11h4m-4 6h4M6 3v4m0 14v4m12-22v4m0 14v4"/>',
      '<path d="M4 6h7v6H4zm13 10h7v6h-7zM11 9h9v7M7 12v7h10"/><circle cx="20" cy="6" r="2"/><circle cx="7" cy="22" r="2"/>',
      '<path d="M3 7h8l5 7h9M3 21h8l5-7M5 4v6m0 8v6m17-13v6M11 7v14"/>',
      '<path d="M4 7h20M4 14h20M4 21h20"/><path d="M9 4v6m10 1v6m-7 1v6" stroke-width="3"/>',
      '<path d="M4 8h7v12H4m20-12h-7v12h7M11 11h6m-6 6h6M7 4v4m14-4v4M7 20v4m14-4v4"/>'
    ];
    document.querySelectorAll('#product > div > .grid > a').forEach((card, index) => {
      const symbol = card.firstElementChild;
      symbol.classList.add('engineering-module-symbol');
      symbol.innerHTML = '<svg viewBox="0 0 28 28" aria-hidden="true">' + symbols[index] + '</svg>';
      card.insertAdjacentHTML('beforeend', '<svg class="engineering-module-trace" viewBox="0 0 80 26" aria-hidden="true"><path d="M0 20h24L39 5h41M40 20h40"/><path class="trace-runner" d="M0 20h24L39 5h41"/><circle cx="24" cy="20" r="2"/><circle cx="65" cy="5" r="2"/></svg>');
    });
  });
})();
