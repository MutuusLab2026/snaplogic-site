/* Shared header for every page (skip link, navigation, language switcher, scroll progress bar): edit it here once.
   The <script> tag that loads this file is replaced by the markup synchronously, so the page renders with it from the
   first paint. Each page says who it is on <body>:
     data-page="home|product|resources|pricing|about|contact"  -> marks the current menu item; "home" and "about" start the header dark
                                                 (home: it sits on the navy hero; about: the whole page is dark)
     data-skip="<id>"                          -> where "Skip to main content" jumps (default: main) */
/* Page addresses without ".html" (roiscompany.com/product): GitHub Pages serves product.html for them. A page opened
   straight from the disk (file://) cannot do that, so there the links keep ".html". Used by footer.js too. */
window.pageUrl = function (name, hash) {
  var local = location.protocol === 'file:';
  var path = name === 'home' ? (local ? 'index.html' : './') : name + (local ? '.html' : '');
  return path + (hash || '');
};
/* Links written straight into the pages ("product#logic", also ones made later by scripts) get ".html" when the
   site is opened from the disk, so they work there too. */
if (location.protocol === 'file:') {
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var m = a.getAttribute('href').match(/^(product|resources|pricing|about|contact)(#.*)?$/);
    if (m) a.setAttribute('href', m[1] + '.html' + (m[2] || ''));
  }, true);
}
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
    product: [],   // built from productNav below (three columns)
    resources: [['sub_screens', '제품 화면', '#gallery'], ['sub_videos', '구동 영상', '#videos'], ['sub_docs', '문서', '#docs']],
    pricing: [['pricing_title', '요금제', '#pricing'], ['nav_demo', '도입 문의', '#cta']]
  };
  // The product page's sections, in page order: ONE list for the tab's card (below) and the floating menu on the left
  // of the page (site.js initSideNav). grp: 0 = no group, 1-3 = the Core Modules groups (design / verification and
  // management / collaboration and integration); float: 0 = left out of the floating menu. Edit the page's sections here.
  window.productNav = [
    { id: 'product',   key: 'sub_modules',    label: '핵심 모듈',                       grp: 0, float: 0 },
    { id: 'interface', key: '',               label: 'User Interface',                  grp: 0, float: 1 },
    { id: 'logic',     key: '',               label: 'Logic',                           grp: 1, float: 1 },
    { id: 'integrator',key: '',               label: 'Integrator',                      grp: 1, float: 1 },
    { id: 'harness',   key: '',               label: 'Harness',                         grp: 1, float: 1 },
    { id: 'drc',       key: '',               label: 'DRC / BOM',                       grp: 2, float: 1 },
    { id: 'workflow',  key: 'sub_workflow',   label: '워크플로우',                      grp: 0, float: 1 },
    { id: 'power',     key: '',               label: 'Power Check',                     grp: 2, float: 1 },
    { id: 'variant',   key: '',               label: 'Variant / Option Configuration',  grp: 2, float: 1 },
    { id: 'library',   key: '',               label: 'Library / Symbol Editor',         grp: 2, float: 1 },
    { id: 'ai',        key: '',               label: 'AI Assistant',                    grp: 3, float: 1 },
    { id: 'multiuser', key: '',               label: 'Multiuser Environment',           grp: 3, float: 1 },
    { id: 'bridge',    key: '',               label: '3D CAD Bridge',                   grp: 3, float: 1 }
  ];
  var groupKeys = { 1: ['mod_grp1', '설계'], 2: ['mod_grp2', '검증 · 관리'], 3: ['mod_grp3', '협업 · 연동'] };
  // The product tab's card: the page's own sections on top (Core Modules, User Interface, Workflow), the three module
  // groups side by side below (a dot in the Core Modules colours over each name).
  var productMenu = function () {
    var one = function (it, i) {
      return menuLink('product', [it.key, it.label, '#' + it.id], 'nav-menu-link', i);
    };
    var cols = [1, 2, 3].map(function (g) {
      // --i = the row, so the three columns unfold row by row (CSS "Product card"): the heading is row 0
      return '<div class="nav-menu-col" data-grp="' + g + '"><p class="nav-menu-gh" style="--i:0"><i></i><span data-i18n="' + groupKeys[g][0] + '">' + groupKeys[g][1] + '</span></p>' +
        productNav.filter(function (it) { return it.grp === g; }).map(function (it, i) { return one(it, i + 1); }).join('') + '</div>';
    }).join('');
    return '<div class="nav-menu"><div class="nav-menu-card nav-menu-wide">' +
      '<div class="nav-menu-row">' + productNav.filter(function (it) { return !it.grp; }).map(function (it) { return one(it); }).join('') + '</div>' +
      '<div class="nav-menu-cols">' + cols + '</div></div></div>';
  };
  var menuLink = function (name, item, cls, i) {
    return '<a class="' + cls + '" href="' + pageUrl(name, item[2]) + '"' + (i == null ? '' : ' style="--i:' + i + '"') +
      (item[0] ? ' data-i18n="' + item[0] + '"' : ' translate="no"') + '>' + item[1] + '</a>';
  };
  var menu = function (name) {
    var items = menus[name];
    if (!items) return '';
    if (name === 'product') return productMenu();
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
  // Language buttons: the short visible label, then the language's own name for screen readers (read in that
  // language, so "中" is not read as a Korean word). aria-pressed marks the current one (i18n.js keeps it in sync).
  var langButtons = [['ko', 'KO', ' 한국어'], ['en', 'EN', ' English'], ['zh', '中', '文'], ['ja', '日', '本語']].map(function (l) {
    return '<button type="button" class="lang-btn' + (l[0] === 'ko' ? ' active' : '') + '" data-lang="' + l[0] + '" lang="' + l[0] +
      '" aria-pressed="' + (l[0] === 'ko') + '">' + l[1] + '<span class="sr-only">' + l[2] + '</span></button>';
  }).join('');
  document.currentScript.insertAdjacentHTML('beforebegin', `
<!-- Skip Link -->
<a href="#${skip}" class="skip-link" data-i18n="skip_link">Skip to main content</a>

<!-- ============================================================
     NAV
     ============================================================ -->
<header class="fixed top-0 w-full z-50 glass-nav transition-all${page === 'home' || page === 'about' || page === 'product' ? ' engineering-nav-dark' : ''}" id="nav">
  <nav class="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto" aria-label="Main navigation">
    <a class="text-2xl font-black text-slate-900 font-headline tracking-tighter" href="${pageUrl('home')}">VegaFencer</a>
    <!-- Mobile toggle -->
    <button class="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5" id="navToggle" aria-expanded="false" aria-controls="navLinks" aria-label="Toggle navigation">
      <span class="block w-6 h-0.5 bg-on-surface transition-all origin-center" id="bar1"></span>
      <span class="block w-6 h-0.5 bg-on-surface transition-all origin-center" id="bar2"></span>
      <span class="block w-6 h-0.5 bg-on-surface transition-all origin-center" id="bar3"></span>
    </button>
    <div class="hidden md:flex gap-8" id="navLinks">
      ${tab('about', 'nav_about', 'About')}
      ${tab('product', 'nav_product', 'Product')}
      ${tab('resources', 'nav_resources', 'Resources')}
      ${tab('pricing', 'nav_pricing', 'Pricing')}
      ${tab('contact', 'nav_contact', 'Contact')}
      <!-- Phones only: the header's demo button is hidden below md, so the open menu ends with it -->
      <a class="nav-demo-mobile md:hidden" href="${pageUrl('home', '#cta')}" id="navDemoMobile" data-i18n="nav_demo">도입 문의</a>
    </div>
    <!-- Language Switcher (Desktop) -->
    <div class="hidden md:flex items-center gap-1 font-label text-xs mr-4" id="langSwitcherDesktop" role="group" aria-label="Language">
      ${langButtons}
    </div>
    <!-- Demo request: scrolls to the form when the page has one, otherwise opens it on the home page -->
    <a class="btn btn-primary" href="${pageUrl('home', '#cta')}" id="navDemo" data-i18n="nav_demo">도입 문의</a>
  </nav>
  <!-- Language Switcher (Mobile) -->
  <div class="flex md:hidden items-center justify-center gap-1 font-label text-xs pb-2" id="langSwitcherMobile" role="group" aria-label="Language">
    ${langButtons}
  </div>
</header>

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
  ['navDemo', 'navDemoMobile'].forEach(function (id) {
    document.getElementById(id).addEventListener('click', function (e) {
      var cta = document.getElementById('cta');
      if (!cta) return;
      e.preventDefault();
      cta.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
