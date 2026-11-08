/* Shared header for every page (skip link, navigation, language switcher, scroll progress bar): edit it here once.
   The <script> tag that loads this file is replaced by the markup synchronously, so the page renders with it from the
   first paint. Each page says who it is on <body>:
     data-page="home|product|resources|pricing|contact"  -> marks the current menu item; "home" also starts the header dark
                                                 (it sits on the navy hero)
     data-skip="<id>"                          -> where "Skip to main content" jumps (default: main) */
/* Page addresses without ".html" (roiscompany.com/product): GitHub Pages serves product.html for them. A page opened
   straight from the disk (file://) cannot do that, so there the links keep ".html". Used by footer.js too. */
window.pageUrl = function (name, hash) {
  var local = location.protocol === 'file:';
  var path = name === 'home' ? (local ? 'index.html' : './') : name + (local ? '.html' : '');
  return path + (hash || '');
};
(function () {
  var body = document.body;
  var page = body.getAttribute('data-page') || '';
  var skip = body.getAttribute('data-skip') || 'main';
  var link = function (href, key, label, name) {
    var current = page === name ? ' aria-current="page"' : '';
    return '<a class="font-headline font-semibold tracking-tight text-slate-600 hover:text-blue-600 transition-colors" href="' +
      href + '" data-i18n="' + key + '"' + current + '>' + label + '</a>';
  };
  // Drop-down cards under the menu tabs (desktop with a mouse). Each item jumps to a section of that page.
  // An item is [i18n key or '', label, '#section', optional sub-items]; items without a key are names that stay the
  // same in every language. Sub-items hang below their item on a thin line and unfold one by one when the card opens.
  var menus = {
    product: [
      ['sub_modules', '핵심 모듈', '#product', [['', 'Logic', '#logic'], ['', 'Integrator', '#integrator'],
        ['', 'Harness Drawing', '#harness'], ['', 'Variant · DRC · BOM', '#variant'], ['', 'Bridge', '#bridge']]],
      ['sub_workflow', '워크플로우', '#workflow'], ['sub_ai', 'AI 어시스턴트', '#ai'],
      ['sub_integrations', 'CAD 연동', '#integrations'], ['sub_team', '팀 협업', '#enterprise']
    ],
    resources: [['sub_screens', '제품 화면', '#gallery'], ['sub_videos', '구동 영상', '#videos'], ['sub_docs', '문서', '#docs']],
    pricing: [['pricing_title', '요금제', '#pricing'], ['nav_demo', '데모 신청', '#cta']]
  };
  var menuLink = function (name, item, cls, i) {
    return '<a class="' + cls + '" href="' + pageUrl(name, item[2]) + '"' + (i == null ? '' : ' style="--i:' + i + '"') +
      (item[0] ? ' data-i18n="' + item[0] + '"' : ' translate="no"') + '>' + item[1] + '</a>';
  };
  var menu = function (name) {
    var items = menus[name];
    if (!items) return '';
    return '<div class="nav-menu"><div class="nav-menu-card">' + items.map(function (item) {
      var link = menuLink(name, item, 'nav-menu-link');
      if (!item[3]) return link;
      return link + '<div class="nav-menu-sub" style="--n:' + item[3].length + '">' + item[3].map(function (sub, i) {
        return menuLink(name, sub, 'nav-menu-link nav-menu-sublink', i);
      }).join('') + '</div>';
    }).join('') + '</div></div>';
  };
  var tab = function (name, key, label) {
    // The chevron sits next to the link, not inside it: switching language rewrites the link's text.
    var chevron = menus[name] ? '<svg class="nav-chevron" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.75 5 6.75 8 3.75"/></svg>' : '';
    return '<div class="nav-item' + (menus[name] ? ' has-menu' : '') + '">' + link(pageUrl(name), key, label, name) + chevron + menu(name) + '</div>';
  };
  document.currentScript.insertAdjacentHTML('beforebegin', `
<!-- Skip Link -->
<a href="#${skip}" class="skip-link" data-i18n="skip_link">Skip to main content</a>

<!-- ============================================================
     NAV
     ============================================================ -->
<header class="fixed top-0 w-full z-50 glass-nav transition-all${page === 'home' ? ' engineering-nav-dark' : ''}" id="nav">
  <nav class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto" aria-label="Main navigation">
    <a class="text-2xl font-black text-slate-900 font-headline tracking-tighter" href="${pageUrl('home')}">VegaFencer</a>
    <!-- Mobile toggle -->
    <button class="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5" id="navToggle" aria-expanded="false" aria-controls="navLinks" aria-label="Toggle navigation">
      <span class="block w-6 h-0.5 bg-on-surface transition-all origin-center" id="bar1"></span>
      <span class="block w-6 h-0.5 bg-on-surface transition-all origin-center" id="bar2"></span>
      <span class="block w-6 h-0.5 bg-on-surface transition-all origin-center" id="bar3"></span>
    </button>
    <div class="hidden md:flex gap-8" id="navLinks">
      ${tab('product', 'nav_product', 'Product')}
      ${tab('resources', 'nav_resources', 'Resources')}
      ${tab('pricing', 'nav_pricing', 'Pricing')}
      ${tab('contact', 'nav_contact', 'Contact')}
    </div>
    <!-- Language Switcher (Desktop) -->
    <div class="hidden md:flex items-center gap-1 font-label text-xs mr-4" id="langSwitcherDesktop">
      <button class="lang-btn active" data-lang="ko">KO</button>
      <button class="lang-btn" data-lang="en">EN</button>
      <button class="lang-btn" data-lang="zh">中</button>
      <button class="lang-btn" data-lang="ja">日</button>
    </div>
    <!-- Demo request: scrolls to the form when the page has one, otherwise opens it on the home page -->
    <a class="kinetic-gradient text-white px-6 py-2.5 rounded-full font-label font-semibold text-sm hidden md:block hover:opacity-90 transition-opacity" href="${pageUrl('home', '#cta')}" id="navDemo" data-i18n="nav_demo">Request Demo</a>
  </nav>
  <!-- Language Switcher (Mobile) -->
  <div class="flex md:hidden items-center justify-center gap-1 font-label text-xs pb-2" id="langSwitcherMobile">
    <button class="lang-btn active" data-lang="ko">KO</button>
    <button class="lang-btn" data-lang="en">EN</button>
    <button class="lang-btn" data-lang="zh">中</button>
    <button class="lang-btn" data-lang="ja">日</button>
  </div>
</header>

<!-- Scroll Progress Bar -->
<div class="fixed top-0 left-0 h-[3px] z-[60] kinetic-gradient" id="scrollProgress" style="width:0"></div>
`);
  document.querySelectorAll('#navLinks .nav-item.has-menu').forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-menu-link')) return;
      item.classList.add('nav-menu-closed');
      e.target.blur();
    });
    item.addEventListener('mouseleave', function () { item.classList.remove('nav-menu-closed'); });
  });
  document.addEventListener('keydown', function (e) {   // Escape closes a card opened from the keyboard
    var item = e.key === 'Escape' && document.activeElement && document.activeElement.closest('#navLinks .nav-item.has-menu');
    if (!item) return;
    item.classList.add('nav-menu-closed');
    item.querySelector('a').focus();
    item.addEventListener('focusout', function () { item.classList.remove('nav-menu-closed'); }, { once: true });
  });
  document.getElementById('navDemo').addEventListener('click', function (e) {
    var cta = document.getElementById('cta');
    if (!cta) return;
    e.preventDefault();
    cta.scrollIntoView({ behavior: 'smooth' });
  });
})();
