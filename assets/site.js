/* Shared page behaviour (navigation, forms, gallery, lightbox ...). Runs after i18n.js. */
/* =============================================================
   MODEL — Application Data
   ============================================================= */
const Model = {
  gallery: [
    { img: "assets/img/logic-editor.jpg", caption: "Logic Editor — 회로 설계 뷰" },
    { img: "assets/img/integrator.jpg", caption: "Integrator — 토폴로지 & 라우팅" },
    { img: "assets/img/variant-config.jpg", caption: "Variant / Option / Configuration" },
    { img: "assets/img/drc-bom-report.jpg", caption: "DRC / BOM Report" },
    { img: "assets/img/harness-drawing.jpg", caption: "Harness Drawing — 하네스 도면" },
    { img: "assets/img/ai-assistant.jpg", caption: "AI Assistant — MCP 기반" },
  ],
};

/* =============================================================
   CONTROLLER — Application Logic
   ============================================================= */
const FORM_ENDPOINT = 'https://formspree.io/f/xbggekne';

/* Section id from an address's #part. A malformed one (e.g. "#%" from a cut-off link) gives '' instead of throwing. */
function hashId(hash) {
  try { return decodeURIComponent((hash || '').slice(1)); } catch (err) { return ''; }
}

/* Saved language; storage can be blocked (private mode, strict settings), which must not stop a form send. */
function savedLang() {
  try { return localStorage.getItem('lang') || 'ko'; } catch (err) { return 'ko'; }
}

/* Value of the hidden spam-trap field (see .hp-field). Formspree discards a send whose _gotcha is filled. */
const honeypot = (form) => (form.elements._gotcha && form.elements._gotcha.value) || '';

/* Address shown when a send fails. Same address as contact.html; switch both to a role address (contact@…) once the domain's mail is set up. */
const FORM_TO = 'tobiaskim@mutuus-lab.com';

/* A failed send also offers the address, so a message is never lost when the form service is down. */
function showFormFailure(el, text) {
  const lang = document.documentElement.lang;
  const tail = (i18n[lang] && i18n[lang].form_fallback) || i18n.ko.form_fallback;
  el.textContent = text + ' ' + tail + ' ';
  const a = document.createElement('a');
  a.href = 'mailto:' + FORM_TO;
  a.textContent = FORM_TO;
  a.style.textDecoration = 'underline';
  el.appendChild(a);
  el.classList.remove('hidden');
  el.style.display = 'block';
}

const FREE_EMAIL_DOMAINS = ['gmail.com','yahoo.com','yahoo.co.kr','hotmail.com','outlook.com','live.com','aol.com','icloud.com','me.com','mac.com','mail.com','protonmail.com','zoho.com','yandex.com','gmx.com','naver.com','daum.net','hanmail.net','nate.com','kakao.com','qq.com','163.com','126.com','sina.com','yeah.net'];

function isBusinessEmail(email) {
  const domain = (email.split('@')[1] || '').toLowerCase();
  return domain && !FREE_EMAIL_DOMAINS.includes(domain);
}

const Controller = {
  currentLightboxIndex: -1,
  previousFocus: null,

  /* Each step runs on its own: one that throws (a missing element, blocked storage, a malformed address) is
     logged and skipped, and the rest still run, so the forms always get their handlers. */
  init() {
    [
      'initScrollReveal',
      'initNavScroll',
      'initMobileMenu',
      'initGalleryEvents',
      'initLightbox',
      'initCtaForm',
      'initScrollToTop',
      'initLanguage',
      'initScrollProgress',
      'initNavActiveState',
      'initCounters',
      'initChatAnimation',
      'initContactForm',
      'initHeroSlideshow',
      'initAiTabs',
      'initAgentAnimation',
      'initAnchorSettle',
      'initContactPage',
      'initLogicTour',
    ].forEach((step) => {
      try { this[step](); } catch (err) { console.error('VegaFencer: ' + step + ' failed', err); }
    });
  },

  /* Product page. Interface tour: hovering an area of the screenshot, or hovering/focusing its item in the list,
     lights that area up (the rest dims); a tap keeps it lit until tapped again. */
  initLogicTour() {
    const tour = document.getElementById('logicTour');
    if (!tour) return;
    const items = document.querySelectorAll('.lg-legend button');
    let pinned = null;
    const light = (id) => {
      if (id) tour.dataset.active = id; else delete tour.dataset.active;
      items.forEach((b) => b.classList.toggle('on', b.dataset.area === id));
    };
    items.forEach((b) => {
      b.addEventListener('mouseenter', () => light(b.dataset.area));
      b.addEventListener('mouseleave', () => light(pinned));
      b.addEventListener('focus', () => light(b.dataset.area));
      b.addEventListener('blur', () => light(pinned));
      b.addEventListener('click', () => { pinned = pinned === b.dataset.area ? null : b.dataset.area; light(pinned); });
    });
    // The screenshot itself: the area under the pointer lights up; a tap pins it like the list does.
    tour.querySelectorAll('.lg-area').forEach((area) => {
      area.addEventListener('mouseenter', () => light(area.dataset.area));
      area.addEventListener('click', () => { pinned = pinned === area.dataset.area ? null : area.dataset.area; light(pinned); });
    });
    tour.addEventListener('mouseleave', () => light(pinned));
  },

  /* In-page links: images further down load while the page scrolls and push the target lower, so once the
     scroll ends, check where the section really is and finish the trip (at most three corrections). */
  initAnchorSettle() {
    // Arriving from another page with #section: once everything has loaded (and pushed things down), go there again.
    const targetId = hashId(location.hash);
    const target = targetId && document.getElementById(targetId);
    // Jump (no smooth animation: the page is still growing, which would end a slow trip short), then re-check twice.
    if (target) addEventListener('load', () => {
      const go = () => {
        const want = (parseFloat(getComputedStyle(target).scrollMarginTop) || 0) * (target.currentCSSZoom || 1);   // the home page zooms on wide screens
        if (Math.abs(target.getBoundingClientRect().top - want) > 2) target.scrollIntoView({ behavior: 'instant' });
      };
      [50, 400, 1200].forEach((ms) => setTimeout(go, ms));
    }, { once: true });
    if (!('onscrollend' in window)) return;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname) return;   // another page: handled there on arrival
      const id = hashId(url.hash);
      const el = id && document.getElementById(id);
      if (!el) return;
      let tries = 0;
      const settle = () => {
        const want = (parseFloat(getComputedStyle(el).scrollMarginTop) || 0) * (el.currentCSSZoom || 1);
        const atEnd = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
        if (++tries > 3 || atEnd || Math.abs(el.getBoundingClientRect().top - want) <= 2) return;
        el.scrollIntoView({ behavior: 'smooth' });
        addEventListener('scrollend', settle, { once: true });
      };
      addEventListener('scrollend', settle, { once: true });
    });
  },

  /* Language — the saved choice, or Korean */
  initLanguage() {
    var lang = savedLang();
    if (!Object.prototype.hasOwnProperty.call(i18n, lang)) lang = 'ko';   // also rejects '__proto__' and the like
    switchLanguage(lang);

    // Attach click handlers to all lang-btn elements
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var lang = btn.getAttribute('data-lang');
        switchLanguage(lang);
      });
    });
  },

  /* Scroll Reveal — IntersectionObserver for .reveal elements */
  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    // Starts once the element is a little way up the screen (not while only its top edge peeks in at the
    // bottom), so the fade-in happens where the reader is looking.
    }, { threshold: 0.1, rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  },

  /* Nav — add shadow class on scroll */
  initNavScroll() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }, { passive: true });
  },

  /* Mobile Menu — toggle navLinks visibility + hamburger animation */
  initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isOpen);

      if (!isOpen) {
        links.classList.add('nav-open');
        toggle.classList.add('hamburger-open');
      } else {
        links.classList.remove('nav-open');
        toggle.classList.remove('hamburger-open');
      }
    });

    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('nav-open');
        toggle.classList.remove('hamburger-open');
      });
    });
  },

  /* Gallery — event delegation for click + keyboard (Enter/Space) */
  initGalleryEvents() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.addEventListener('click', (e) => {
      const item = e.target.closest('[data-gallery-index]');
      if (item) openLightbox(parseInt(item.dataset.galleryIndex));
    });
    grid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const item = e.target.closest('[data-gallery-index]');
        if (item) {
          e.preventDefault();
          openLightbox(parseInt(item.dataset.galleryIndex));
        }
      }
    });
  },

  /* Lightbox — overlay click to close, keyboard, touch swipe */
  initLightbox() {
    const lb = document.getElementById('lightbox');
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
      // Focus trap
      if (e.key === 'Tab') {
        const focusable = lb.querySelectorAll('button');
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    // Touch swipe for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    lb.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) navigateLightbox(-1);
        else navigateLightbox(1);
      }
    }, { passive: true });
  },

  /* CTA Form — prevent default, validate, show success message */
  initCtaForm() {
    const form = document.getElementById('ctaForm');
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById('ctaSuccess');
    const errorEl = document.getElementById('ctaError');
    const originalBtnHTML = submitBtn.innerHTML;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[name="email"]');
      if (!email.value || !email.checkValidity()) {
        email.reportValidity();
        return;
      }
      const lang = savedLang();
      if (!isBusinessEmail(email.value)) {
        errorEl.textContent = (i18n[lang] && i18n[lang].cta_business_only) || 'Please enter a business email.';
        errorEl.classList.remove('hidden');
        errorEl.style.display = 'block';
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.textContent = (i18n[lang] && i18n[lang].cta_sending) || 'Sending...';
      errorEl.classList.add('hidden');

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          _subject: 'VegaFencer Demo Request from ' + email.value,
          message: 'New demo request from: ' + email.value,
          _gotcha: honeypot(form),
        }),
      }).then(r => r.json().then(body => ({ success: r.ok && body.ok !== false }))).then(data => {
        if (data.success) {
          form.style.display = 'none';
          successEl.classList.remove('hidden');
          successEl.style.display = 'block';
        } else { throw new Error(); }
      }).catch(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        showFormFailure(errorEl, (i18n[lang] && i18n[lang].cta_error) || 'Failed to send.');
      });
    });
  },

  /* Scroll To Top — show/hide on scroll */
  initScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
      } else {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
      }
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  /* Scroll Progress Bar */
  initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  },

  /* Nav Active State — highlight current section link */
  initNavActiveState() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navLinks a[href^="#"]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('nav-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach(s => observer.observe(s));
  },

  /* Animated Counters — count from 0 to target on scroll */
  initCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.countTo);
          const suffix = el.dataset.countSuffix || '';
          const textVal = el.dataset.countText;
          observer.unobserve(el);
          if (textVal && target === 0) { el.textContent = textVal; return; }
          let current = 0;
          const step = Math.max(1, Math.floor(target / 60));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current + suffix;
          }, 20);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(el => observer.observe(el));
  },

  /* Chat Sequential Animation — reveal messages one by one */
  initChatAnimation() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const messages = Array.from(container.querySelectorAll(':scope > div'));
    // Home window: the chat pane scrolls like a messenger. Each new message appears under the last one and the
    // pane follows it, so the earliest messages slide up out of view (the scrollbar brings them back).
    // The top edge fades only while something is scrolled above it.
    const pane = container.closest('.ai-pane-chat');
    const follow = () => {
      if (pane) pane.scrollTo({ top: pane.scrollHeight, behavior: 'smooth' });
    };
    if (pane) {
      const edge = () => pane.classList.toggle('ai-scrolled', pane.scrollTop > 2);
      pane.addEventListener('scroll', edge, { passive: true });
      edge();
    }
    const delays = pane ? [400, 1400, 3200, 4200] : [0, 800, 1800, 2600];   // home: Q1 rises in a moment after the window shows; a little longer to read Q1/A1
    let timers = [];
    const play = () => {
      messages.forEach((msg, i) => {
        timers.push(setTimeout(() => {
          if (i === 1 || i === 3) {
            const dot = document.createElement('div');
            dot.className = 'flex justify-start chat-visible chat-typing';
            dot.innerHTML = '<div class="bg-surface-container-high/60 px-4 py-3 rounded-2xl rounded-bl-sm"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
            container.insertBefore(dot, msg);
            follow();
            timers.push(setTimeout(() => { dot.remove(); msg.classList.add('chat-visible'); follow(); }, 600));
          } else {
            msg.classList.add('chat-visible');
            follow();
          }
        }, delays[i]));
      });
    };
    // Home: the conversation starts over each time the window comes back into view (like At a Glance and
    // Brand Story), on the Chat tab. Elsewhere it plays once.
    const reset = () => {
      timers.forEach(clearTimeout);
      timers = [];
      container.querySelectorAll('.chat-typing').forEach((d) => d.remove());
      messages.forEach((m) => m.classList.remove('chat-visible'));
      pane.scrollTop = 0;
    };
    const win = pane && pane.closest('#aiWindow');
    if (win) {
      let inView = false;
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !inView) {
            inView = true;
            reset();
            const chatTab = win.querySelector('[data-ai-tab="chat"]');
            if (chatTab && !chatTab.classList.contains('ai-tab-active')) chatTab.click();
            play();
          } else if (!entry.isIntersecting) {
            inView = false;
          }
        });
      }, { threshold: 0.2 }).observe(win);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          play();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(container);
  },

  /* Product screens — run only while visible and motion is enabled. */
  initHeroSlideshow() {
    const container = document.getElementById('heroSlideshow');
    if (!container) return;
    const slides = Array.from(container.querySelectorAll('img'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    const title = document.getElementById('heroWindowTitle');
    const titles = ['VegaFencer — Logic Editor', 'VegaFencer — Integrator', 'VegaFencer — Harness Drawing', 'VegaFencer — Variant Config', 'VegaFencer — AI Assistant'];
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let interval;
    let inViewport = false;
    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      container.style.transform = 'translateX(-' + (current * 100 / slides.length) + '%)';
      dots.forEach((dot, i) => {
        dot.classList.toggle('hero-dot-active', i === current);
        dot.classList.toggle('bg-primary-container', i === current);
        dot.classList.toggle('bg-outline-variant/40', i !== current);
        dot.setAttribute('aria-pressed', String(i === current));
      });
      title.textContent = titles[current];
    };
    const updatePlayback = () => {
      clearInterval(interval);
      if (inViewport && !document.hidden && !preference.matches && !document.body.classList.contains('engineering-motion-paused')) {
        interval = setInterval(() => goTo(current + 1), 5000);
      }
    };
    dots.forEach((dot, index) => dot.addEventListener('click', () => {
      goTo(index);
      updatePlayback();
    }));
    new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      updatePlayback();
    }).observe(container);
    preference.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);
    document.addEventListener('engineering-motion-change', updatePlayback);
  },

  /* Contact Form — Footer inquiry form */
  /* Home AI window, Agent tab: the request is shown, then each step runs ("… 중" with turning arrows and darkening
     dots) and turns into a checked result. Starts over every time the Agent tab is opened. */
  initAgentAnimation() {
    const pane = document.getElementById('aiPanelAgent');
    const steps = pane && pane.querySelectorAll('.ag-step');
    if (!steps || !steps.length || !pane.classList.contains('ai-pane-agent')) return;
    const tab = document.querySelector('#aiWindow [data-ai-tab="agent"]');
    const runFor = [1600, 1500, 1400, 1700];   // how long each step "works" before it is done
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timers = [];
    const follow = () => pane.scrollTo({ top: pane.scrollHeight, behavior: still.matches ? 'auto' : 'smooth' });
    const edge = () => pane.classList.toggle('ai-scrolled', pane.scrollTop > 2);
    pane.addEventListener('scroll', edge, { passive: true });
    const play = () => {
      timers.forEach(clearTimeout);
      timers = [];
      const ask = pane.querySelector('.ag-q');
      steps.forEach((st) => st.classList.remove('run', 'done'));
      ask.classList.remove('on');
      pane.scrollTop = 0;
      edge();
      if (still.matches) { ask.classList.add('on'); steps.forEach((st) => st.classList.add('done')); return; }
      timers.push(setTimeout(() => ask.classList.add('on'), 300));   // the request rises in first, like a sent message
      let t = 1100;
      steps.forEach((st, i) => {
        timers.push(setTimeout(() => { st.classList.add('run'); follow(); }, t));
        t += runFor[i];
        timers.push(setTimeout(() => { st.classList.remove('run'); st.classList.add('done'); follow(); }, t));
        t += 200 + st.querySelectorAll('.ag-sub > span').length * 140 + 250;
      });
    };
    if (tab) tab.addEventListener('click', play);
  },

  /* AI Chat / Agent tabs */
  initAiTabs() {
    const tabs = document.querySelectorAll('[data-ai-tab]');
    if (!tabs.length) return;
    const panels = {
      chat: document.getElementById('aiPanelChat'),
      agent: document.getElementById('aiPanelAgent'),
      shot: document.getElementById('aiPanelShot'),
    };
    const win = document.getElementById('aiWindow');   // home: one window with a sliding switch in its title bar
    const thumb = win && win.querySelector('.ai-seg-thumb');
    const moveThumb = () => {
      const active = thumb && win.querySelector('.ai-seg .ai-tab-active');
      if (!active) return;
      thumb.style.left = active.offsetLeft + 'px';
      thumb.style.width = active.offsetWidth + 'px';
    };
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const name = tab.dataset.aiTab;
        Object.keys(panels).forEach((key) => {
          if (panels[key]) panels[key].classList.toggle('hidden', key !== name);
        });
        tabs.forEach((t) => {
          t.classList.toggle('ai-tab-active', t.dataset.aiTab === name);
          if (t.hasAttribute('aria-selected')) t.setAttribute('aria-selected', String(t.dataset.aiTab === name));
        });
        if (win) win.querySelectorAll('.ai-win-title').forEach((t) => { t.hidden = t.dataset.for !== name; });
        moveThumb();
      });
    });
    if (!win) return;
    // Wide screens: the window is 70px taller than the text beside it; narrower, it keeps its CSS height.
    const text = document.getElementById('aiText');
    const wide = window.matchMedia('(min-width: 1024px)');
    const size = () => {
      win.style.height = wide.matches && text ? (text.offsetHeight + 70) + 'px' : '';
      moveThumb();
    };
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(size);
      if (text) ro.observe(text);
      ro.observe(win.querySelector('.ai-seg'));   // labels change width when the language changes
    }
    wide.addEventListener('change', size);
    size();
    requestAnimationFrame(() => win.querySelector('.ai-seg').classList.add('ready'));   // no slide on first placement
  },

  /* Contact page — inquiry form with a type (purchase / support / partnership / other) */
  initContactPage() {
    const form = document.getElementById('contactPageForm');
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById('contactPageSuccess');
    const errorEl = document.getElementById('contactPageError');
    const field = (name) => form.elements[name];
    const showError = (text) => { errorEl.textContent = text; errorEl.classList.remove('hidden'); };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const lang = savedLang();
      const t = i18n[lang] || i18n.ko;
      if (!isBusinessEmail(field('email').value)) { showError(t.cta_business_only || 'Please enter a business email.'); return; }
      const type = field('type').options[field('type').selectedIndex].text;
      const original = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = t.cta_sending || 'Sending...';
      errorEl.classList.add('hidden');
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          type: type,
          name: field('name').value,
          company: field('company').value || '-',
          email: field('email').value,
          phone: field('phone').value || '-',
          message: field('message').value,
          _subject: 'VegaFencer Contact [' + type + '] from ' + field('name').value,
          _gotcha: honeypot(form),
        }),
      }).then(r => r.json().then(body => ({ success: r.ok && body.ok !== false }))).then(data => {
        if (!data.success) throw new Error();
        form.style.display = 'none';
        successEl.classList.remove('hidden');
      }).catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
        showFormFailure(errorEl, t.contact_error || 'Failed to send.');
      });
    });
  },

  initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById('contactSuccess');
    const errorEl = document.getElementById('contactError');
    const originalText = submitBtn.textContent;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('input[name="name"]');
      const email = form.querySelector('input[name="email"]');
      const message = form.querySelector('textarea[name="message"]');
      if (!email.value || !email.checkValidity() || !name.value || !message.value) {
        form.reportValidity();
        return;
      }
      const lang = savedLang();
      if (!isBusinessEmail(email.value)) {
        errorEl.textContent = (i18n[lang] && i18n[lang].cta_business_only) || 'Please enter a business email.';
        errorEl.classList.remove('hidden');
        errorEl.style.display = 'block';
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = (i18n[lang] && i18n[lang].cta_sending) || 'Sending...';
      errorEl.classList.add('hidden');

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: name.value,
          company: form.querySelector('input[name="company"]').value || '-',
          email: email.value,
          message: message.value,
          _subject: 'VegaFencer Contact from ' + name.value,
          _gotcha: honeypot(form),
        }),
      }).then(r => r.json().then(body => ({ success: r.ok && body.ok !== false }))).then(data => {
        if (data.success) {
          // the thank-you line sits inside this form, so hide the fields rather than the whole form
          Array.from(form.children).forEach((el) => { if (el !== successEl) el.style.display = 'none'; });
          successEl.classList.remove('hidden');
          successEl.style.display = 'block';
        } else { throw new Error(); }
      }).catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        showFormFailure(errorEl, (i18n[lang] && i18n[lang].contact_error) || 'Failed to send.');
      });
    });
  },
};

/* =============================================================
   Lightbox Functions
   ============================================================= */
function openLightbox(index) {
  Controller.previousFocus = document.activeElement;
  Controller.currentLightboxIndex = index;
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = Model.gallery[index].img;
  document.getElementById('lightboxImg').alt = Model.gallery[index].caption;
  lb.style.display = 'flex';
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  lb.querySelectorAll('button')[0].focus();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('active');
  setTimeout(() => { lb.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
  if (Controller.previousFocus) Controller.previousFocus.focus();
}

function navigateLightbox(dir) {
  const len = Model.gallery.length;
  Controller.currentLightboxIndex = (Controller.currentLightboxIndex + dir + len) % len;
  const item = Model.gallery[Controller.currentLightboxIndex];
  document.getElementById('lightboxImg').src = item.img;
  document.getElementById('lightboxImg').alt = item.caption;
}

/* =============================================================
   BOOTSTRAP
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => Controller.init());
