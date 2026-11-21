/* Local motion, zero rendering dependencies or background video downloads. */
(() => {
  'use strict';

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
  const drcGroups = [['CONNECTIVITY', 6], ['CONSISTENCY', 13], ['NAMING', 5]];
  let cell = 0;
  figures.variant = { no: '04', key: 'fig_drc', card: 1, svg: drcGroups.map(([name, count], g) => {
    const x0 = 10 + cell * 16 + g * 6, width = count * 16 - 3;
    const cells = Array.from({ length: count }, (_, i) => {
      const x = x0 + i * 16, delay = (.15 + (cell + i) * .055).toFixed(3);
      return '<rect class="fig-cell" x="' + x + '" y="40" width="13" height="22" rx="2"/><rect class="fp fig-cell-pass" style="--d:' + delay + 's" x="' + x + '" y="40" width="13" height="22" rx="2"/>';
    }).join('');
    cell += count;
    return '<text class="fig-label fig-group" x="' + (x0 + width / 2) + '" y="30">' + name + '</text>' + cells +
      '<path class="fig-dim" d="M' + x0 + ' 70V75H' + (x0 + width) + 'V70"/><text class="fig-count" x="' + (x0 + width / 2) + '" y="90">' + count + '</text>';
  }).join(''), status: '24/24 PASS' };

  // Bridge: CAD ⇄ VegaFencer exchange, replacing the static CATIA ⇄ NX tiles. Packets loop while visible.
  const bridgeSvg = '<svg class="eng-bridge" viewBox="0 0 400 150" role="img" aria-label="CATIA V5 / Siemens NX ⇄ VegaFencer: Bundle · Length → , ← Wire list">' +
    '<rect class="bridge-cad" x="8" y="14" width="112" height="46" rx="6"/><text class="bridge-name" x="64" y="33">CATIA V5</text><text class="bridge-vendor" x="64" y="51">Dassault Systèmes</text>' +
    '<rect class="bridge-cad" x="8" y="90" width="112" height="46" rx="6"/><text class="bridge-name" x="64" y="109">Siemens NX</text><text class="bridge-vendor" x="64" y="127">Siemens</text>' +
    '<path class="bridge-lane" d="M120 37H150V84M120 113H150V66M150 66H272M150 84H272"/>' +
    '<path class="bridge-arrow bridge-in" d="M262 62L268 66L262 70"/><path class="bridge-arrow bridge-out" d="M160 80L154 84L160 88"/>' +
    '<text class="bridge-lane-text bridge-in" x="211" y="58">BUNDLE · LENGTH</text><text class="bridge-lane-text bridge-out" x="211" y="101">WIRE LIST</text>' +
    '<circle class="bp bp-in" cx="150" cy="66" r="3.5"/><circle class="bp bp-in" style="animation-delay:-1.2s" cx="150" cy="66" r="3.5"/>' +
    '<circle class="bp bp-out" style="animation-delay:-.6s" cx="272" cy="84" r="3.5"/><circle class="bp bp-out" style="animation-delay:-1.8s" cx="272" cy="84" r="3.5"/>' +
    '<rect class="bridge-core" x="272" y="38" width="120" height="74" rx="8"/><text class="bridge-core-name" x="332" y="72">VegaFencer</text><text class="bridge-core-sub" x="332" y="89">BRIDGE</text></svg>';

  /* Scale of the hero, header (and on the home page every section below the hero) from the window size.
     1x at 1440 wide, 1.2x at 1920, 1.6x at 2560 and no more (ultrawide screens keep the content in the middle),
     straight lines in between. Never more than the height allows (1x = 790 tall, so the hero fits one screen),
     and never below .8. */
  const heroScale = (w, h) => {
    const byWidth = w <= 1440 ? w / 1440 : w <= 1920 ? 1 + (w - 1440) / 480 * .2 : Math.min(1.6, 1.2 + (w - 1920) / 640 * .4);
    return Math.max(.8, Math.min(byWidth, h / 790));
  };
  document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('about');
    const nav = document.getElementById('nav');
    // Pages without the hero still size the header like the home page does (same scale from the window size).
    if (!hero) {
      const wideOnly = window.matchMedia('(min-width: 1101px)');
      const setScale = () => {
        const w = document.documentElement.clientWidth, h = window.innerHeight;
        const s = wideOnly.matches ? heroScale(w, h) : 1;
        document.documentElement.style.setProperty('--hero-s', s.toFixed(4));
      };
      addEventListener('resize', setScale);
      setScale();
    }
    if (hero) {   // home page only
      // Wide desktop: scale the whole hero as one block (heroScale above).
      const scaleBox = hero.querySelector('.engineering-scale');
      const wide = window.matchMedia('(min-width: 1101px)');
      const fitHero = () => {
        const w = document.documentElement.clientWidth, h = window.innerHeight;
        const s = wide.matches ? heroScale(w, h) : 1;
        // On the root so the header can use the same scale as the hero.
        document.documentElement.style.setProperty('--hero-s', s.toFixed(4));
        // If the content is taller than the screen allows (very low windows), the hero grows instead of clipping.
        hero.style.setProperty('--hero-need', wide.matches ? Math.floor(nav.offsetHeight + scaleBox.offsetHeight * s) + 'px' : '0px');
      };
      if (scaleBox) {
        addEventListener('resize', fitHero);
        wide.addEventListener('change', fitHero);
        if (window.ResizeObserver) new ResizeObserver(fitHero).observe(scaleBox);
        fitHero();
      }
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

      // The header stays dark through the hero and the fade below it, and turns light once the fade is nearly over.
      const fadeEl = document.querySelector('.engineering-after');   // carries --fade
      let heroWatch = null;
      const watchHero = () => {
        if (heroWatch) heroWatch.disconnect();
        const fade = fadeEl ? (parseFloat(getComputedStyle(fadeEl).getPropertyValue('--fade')) || 0) * (fadeEl.currentCSSZoom || 1) : 0;   // x page zoom (wide screens)
        // root edge sits where the hero's bottom must be for the fade to end 40px under the header
        const top = fade - (nav.offsetHeight + 40);
        heroWatch = new IntersectionObserver(([entry]) => {
          document.body.classList.toggle('engineering-motion-offscreen', !entry.isIntersecting);
          nav.classList.toggle('engineering-nav-dark', entry.isIntersecting);
        }, { rootMargin: top + 'px 0px 0px 0px' });
        heroWatch.observe(hero);
      };
      watchHero();
      window.matchMedia('(max-width: 800px)').addEventListener('change', watchHero);
      window.matchMedia('(max-width: 767px)').addEventListener('change', watchHero);

      // Mouse wheel paging: the hero, the second screen, Core Modules and Product Gallery. One notch of a mouse wheel
      // moves to the next (or previous) of them, so a section is never left half under the fixed header. (With a
      // wheel, Chrome would also stall half way before the hero/second-screen snap.) Trackpads, keyboard, touch, the
      // scrollbar and everything below Product Gallery are left to the browser. Set WHEEL_PAGING to false to switch
      // this off.
      const WHEEL_PAGING = true;
      const PAGED = [];   // sections after the second screen that a wheel notch also pages to, e.g. ['product', 'gallery'] (off: user, 2026-11-16)
      const second = document.querySelector('.engineering-after');   // carries the snap (and its scroll-margin)

      // Below the second screen the snap has nothing left to do, but a browser can still pull the page back up to it
      // (e.g. the elastic bounce at the very bottom on a Mac). So once past the middle of the second screen, snapping
      // is switched off (switching inside the tall second-screen block moves nothing); it comes back on above it.
      if (second) {
        const root = document.documentElement;
        const freeFrom = () => second.getBoundingClientRect().top + scrollY + innerHeight * 0.6;
        let free = false, limit = freeFrom();
        const check = () => {
          const now = scrollY > limit;
          if (now !== free) { free = now; root.classList.toggle('engineering-free-scroll', free); }
        };
        addEventListener('scroll', check, { passive: true });
        addEventListener('resize', () => { limit = freeFrom(); check(); });
        check();
      }
      if (WHEEL_PAGING && second) {
        const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
        let busyUntil = 0, lastWheel = 0;
        // where the snap rests on the second screen (its top edge plus its scroll-margin, which is negative)
        const secondStop = () => second.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(second).scrollMarginTop) || 0) * (second.currentCSSZoom || 1);
        // A mouse wheel turns in whole notches (multiples of 120 in wheelDelta, or line steps in Firefox);
        // a trackpad sends many small, uneven steps.
        const isMouseWheel = e => e.deltaMode === 1 ||
          (Math.abs(e.wheelDeltaY) >= 120 && e.wheelDeltaY % 120 === 0);
        // leave the wheel alone over anything that scrolls by itself (a list or panel inside the page)
        const innerScroller = (el, dy) => {
          for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
            const oy = getComputedStyle(el).overflowY;
            if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight &&
                (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0)) return true;
          }
          return false;
        };
        addEventListener('wheel', e => {
          const now = performance.now(), gap = now - lastWheel;
          lastWheel = now;
          // While we move, and as long as the same turn keeps going, swallow it, so one turn stops on one screen.
          if (now < busyUntil) { e.preventDefault(); busyUntil = Math.max(busyUntil, now + 200); return; }
          if (calm.matches || e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
          if (gap < 120 || !isMouseWheel(e) || innerScroller(e.target, e.deltaY)) return;   // only the first notch of a fresh turn
          // Pages: the hero, the second screen, then Core Modules and Product Gallery with their tops just under the
          // fixed header (user decision 2026-11-16: one notch should land on a whole section, not leave it half
          // under the header). A page taller than the window scrolls normally inside (s..e) until its end.
          // Below the last page the wheel is left alone.
          const nav = document.getElementById('nav'), navH = nav ? nav.getBoundingClientRect().height : 0;
          const room = innerHeight - navH;
          const pages = [{ s: 0, e: 0 }, { s: Math.round(secondStop()), e: Math.round(secondStop()) }];
          PAGED.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const r = el.getBoundingClientRect(), s = Math.round(r.top + scrollY - navH);
            pages.push({ s, e: s + Math.max(0, Math.round(r.height - room)) });
          });
          const y = scrollY, last = pages[pages.length - 1];
          const inside = pages.find(p => y > p.s + 1 && y < p.e - 1);   // part-way through a tall page
          let target = null;
          if (e.deltaY > 0) {
            if (y >= last.e - 1 || inside) return;
            const nextPage = pages.find(p => p.s > y + 1);
            if (nextPage) target = nextPage.s;
          } else {
            if (y > last.e + room || inside || y <= 0) return;   // within a screen below the last page: back onto it
            const prevPage = pages.filter(p => p.s < y - 1).pop();
            if (prevPage) target = prevPage.s;
          }
          if (target === null) return;
          e.preventDefault();
          busyUntil = now + 900;
          scrollTo({ top: target, behavior: 'smooth' });
        }, { passive: false });
      }
    }

    const workflow = document.getElementById('workflow');
    if (workflow) {
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
      // Wide screens: equal gaps between the step numbers, first and last step flush with the content edges,
      // and the connector line running from the first number to the last (see #workflow in engineering.css).
      const wfSteps = [...workflow.querySelectorAll('.workflow-step')];
      const wfLine = workflow.querySelector('.workflow-motion-line');
      const wfGrid = wfSteps.length ? wfSteps[0].parentElement : null;
      const layoutFlow = () => {
        if (!wfGrid || wfSteps.length < 2) return;
        wfSteps.forEach(step => { step.style.marginLeft = ''; });
        if (wfLine) ['left', 'right', 'top'].forEach(p => wfLine.style.removeProperty(p));
        if (!window.matchMedia('(min-width: 1024px)').matches) return;
        // Screen sizes divided by the page zoom (the home page grows on wide screens) give CSS pixels for the margins.
        const z = wfGrid.currentCSSZoom || 1;
        const width = wfGrid.getBoundingClientRect().width / z;
        const w = wfSteps.map(step => step.getBoundingClientRect().width / z);
        const first = w[0] / 2, last = width - w[w.length - 1] / 2, gap = (last - first) / (wfSteps.length - 1);
        let x = 0;
        wfSteps.forEach((step, i) => { const left = first + i * gap - w[i] / 2; step.style.marginLeft = (left - x) + 'px'; x = left + w[i]; });
        if (wfLine) {
          const dot = wfSteps[0].firstElementChild;   // offsets, not screen positions: the steps slide up while they fade in (.reveal)
          wfLine.style.left = first + 'px';
          wfLine.style.right = (width - last) + 'px';
          wfLine.style.setProperty('top', (wfSteps[0].offsetTop + dot.offsetTop + dot.offsetHeight / 2 - 1) + 'px', 'important');   // the stylesheet's top is !important
        }
      };
      layoutFlow();
      window.addEventListener('resize', layoutFlow);
      // Again whenever a step's width changes: web fonts arriving late, or a language switch.
      if ('ResizeObserver' in window) {
        let queued = false;
        const ro = new ResizeObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; layoutFlow(); }); } });
        wfSteps.forEach(step => ro.observe(step));
      }
    }

    const lang = i18n[document.documentElement.lang] || i18n.ko;
    const figureObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-drawn');
      figureObserver.unobserve(entry.target);
    }), { threshold: .5 });
    Object.entries(figures).forEach(([id, figure]) => {
      const card = document.querySelectorAll('#' + id + ' .rounded-2xl')[figure.card || 0];
      if (!card) return;
      card.insertAdjacentHTML('beforeend', '<figure class="eng-fig eng-fig-' + id + '"><figcaption><span translate="no">FIG. ' + figure.no + '</span>' +
        '<span data-i18n="' + figure.key + '">' + lang[figure.key] + '</span>' +
        (figure.status ? '<em class="fig-status fp" style="--d:1.65s" translate="no">' + figure.status + '</em>' : '') + '</figcaption>' +
        '<svg viewBox="0 0 400 112" aria-hidden="true">' + figure.svg + '</svg></figure>');
      figureObserver.observe(card.lastElementChild);
    });
    const bridgeCard = document.querySelector('#bridge .rounded-2xl');
    if (bridgeCard && bridgeCard.firstElementChild) {
      bridgeCard.firstElementChild.outerHTML = bridgeSvg;
      new IntersectionObserver(([entry]) => bridgeCard.classList.toggle('is-offscreen', !entry.isIntersecting)).observe(bridgeCard);
    }

    // Placeholder-only fields get an accessible name that follows language switches.
    const nameFields = () => document.querySelectorAll('form input[placeholder], form textarea[placeholder]').forEach(field => {
      if (!(field.labels && field.labels.length)) field.setAttribute('aria-label', field.placeholder);
    });
    nameFields();
    document.querySelectorAll('form').forEach(form => new MutationObserver(nameFields).observe(form, { subtree: true, attributeFilter: ['placeholder'] }));

    // Escape closes the mobile menu and returns focus to its toggle.
    const navToggle = document.getElementById('navToggle');
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || navToggle.getAttribute('aria-expanded') !== 'true') return;
      navToggle.click();
      navToggle.focus();
    });

    // Expose the section in view as the current navigation location.
    const sectionLinks = [...document.querySelectorAll('#navLinks a[href^="#"]')];
    const linkFor = new Map(sectionLinks.map(link => [document.querySelector(link.getAttribute('href')), link]).filter(([section]) => section));
    const spy = new IntersectionObserver(entries => entries.forEach(entry => {
      const link = linkFor.get(entry.target);
      if (entry.isIntersecting) {
        sectionLinks.forEach(other => other.removeAttribute('aria-current'));
        link.setAttribute('aria-current', 'location');
      } else if (link.hasAttribute('aria-current')) {
        link.removeAttribute('aria-current');
      }
    }), { rootMargin: '-45% 0px -50% 0px' });
    linkFor.forEach((_, section) => spy.observe(section));

    const enterpriseIcons = [
      ['#1557b0', '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2c2.8.4 5 2.8 5 5.8"/>'],
      ['#0b6b62', '<rect x="3" y="3" width="13" height="13" rx="2"/><path d="M7 8h5M7 11.5h3M12 21v-2.5l7-7 2.5 2.5-7 7z"/>'],
      ['#a34a06', '<ellipse cx="10" cy="5" rx="7" ry="2.5"/><path d="M3 5v10c0 1.4 3.1 2.5 7 2.5M17 5v5M3 10c0 1.4 3.1 2.5 7 2.5M14 18h8m-3-3 3 3-3 3"/>']
    ];
    document.querySelectorAll('#enterprise span.w-10.h-10').forEach((badge, index) => {
      const [color, paths] = enterpriseIcons[index] || [];
      if (!paths) return;
      badge.classList.add('engineering-ent-icon');
      badge.style.color = color;
      badge.setAttribute('aria-hidden', 'true');
      badge.innerHTML = '<svg viewBox="0 0 24 24">' + paths + '</svg>';
    });

    const scrollTop = document.getElementById('scrollTopBtn');
    const narrow = window.matchMedia('(max-width: 767px)');
    let lastY = scrollY;
    window.addEventListener('scroll', () => {
      const y = scrollY;
      if (Math.abs(y - lastY) < 8) return;
      scrollTop.classList.toggle('scroll-top-resting', narrow.matches && y > lastY);
      lastY = y;
    }, { passive: true });

    const updateVisibility = () => document.body.classList.toggle('engineering-page-hidden', document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    updateVisibility();

    // one connector-style line symbol per module (data-mod on the card in sections.js)
    const symbols = {
      logic: '<path d="M3 7h7v14H3m18-14h-7v14h7M10 11h4m-4 6h4M6 3v4m0 14v4m12-22v4m0 14v4"/>',
      integrator: '<path d="M4 6h7v6H4zm13 10h7v6h-7zM11 9h9v7M7 12v7h10"/><circle cx="20" cy="6" r="2"/><circle cx="7" cy="22" r="2"/>',
      harness: '<path d="M3 7h8l5 7h9M3 21h8l5-7M5 4v6m0 8v6m17-13v6M11 7v14"/>',
      power: '<path d="M3 9h19v10H3zm19 3h3v4h-3"/><path d="M13.5 10.5 10 14.5h4.5L11 18"/>',
      multiuser: '<circle cx="10" cy="9" r="3.5"/><path d="M3 23c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/><circle cx="19.5" cy="8" r="2.8"/><path d="M18.5 14.5c3.3 0 5.5 2.2 5.5 5.5"/>',
      ai: '<path d="M4 5h20v13H12l-5 5v-5H4z"/><path d="M14 7.5l1.2 2.8L18 11.5l-2.8 1.2L14 15.5l-1.2-2.8L10 11.5l2.8-1.2z"/>',
      drc: '<path d="M6 3h16v22H6z"/><path d="M9 9.5l2 2 3.5-4M9 18l2 2 3.5-4M17 9.5h2.5M17 18h2.5"/>',
      variant: '<path d="M4 7h20M4 14h20M4 21h20"/><path d="M9 4v6m10 1v6m-7 1v6" stroke-width="3"/>',
      bridge: '<path d="M4 8h7v12H4m20-12h-7v12h7M11 11h6m-6 6h6M7 4v4m14-4v4M7 20v4m14-4v4"/>'
    };
    document.querySelectorAll('#product > div > .grid > a').forEach((card) => {
      const symbol = card.firstElementChild;
      symbol.classList.add('engineering-module-symbol');
      symbol.innerHTML = '<svg viewBox="0 0 28 28" aria-hidden="true">' + (symbols[card.dataset.mod] || '') + '</svg>';
      card.insertAdjacentHTML('beforeend', '<svg class="engineering-module-trace" viewBox="0 0 80 26" aria-hidden="true"><path d="M0 20h24L39 5h41M40 20h40"/><path class="trace-runner" d="M0 20h24L39 5h41"/><circle cx="24" cy="20" r="2"/><circle cx="65" cy="5" r="2"/></svg>');
    });
  });
})();

/* Keep labels inside scaled drawings at 11px or more on screen (site rule, REVIEW.md).
   The hero drawing and the brand-story card shrink with the window, so a fixed font-size cannot hold 11px at every
   size: measure how much each drawing is scaled down and enlarge its labels only when they would fall below 11px.
   The At a Glance diagram is not included: its labels sit beside pins and boxes and would collide if enlarged. */
(() => {
  const MIN = 11.2;
  const TARGETS = ['.engineering-drawing .diagram-label', '.engineering-drawing .dimension-text', '#vs-names'];
  function fit() {
    TARGETS.forEach((sel) => document.querySelectorAll(sel).forEach((el) => {
      el.style.fontSize = '';
      const m = el.getScreenCTM && el.getScreenCTM();
      const base = parseFloat(getComputedStyle(el).fontSize);
      if (!m || !base) return;
      const scale = Math.hypot(m.a, m.b);
      if (scale > 0 && base * scale < MIN) el.style.fontSize = (MIN / scale).toFixed(2) + 'px';
    }));
  }
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; fit(); }); } };
  window.addEventListener('load', () => {
    fit();
    // Drawings also change size without a window resize (web fonts arriving, layout settling), so watch them.
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(later);
      document.querySelectorAll('.engineering-drawing, #vs-st').forEach((svg) => ro.observe(svg));
    }
  });
  window.addEventListener('resize', later);
})();
