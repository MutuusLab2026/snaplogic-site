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
/* Where every form on the site is sent: Formspree form "VegaFencer Website" (account vegafencer.admin@gmail.com,
   dashboard at formspree.io). Messages go to that address; copies to others are set up as Gmail forwarding. */
const FORM_TO = 'vegafencer.admin@gmail.com';
const FORM_ENDPOINT = 'https://formspree.io/f/xbggekne';

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

  init() {
    this.initScrollReveal();
    this.initNavScroll();
    this.initMobileMenu();
    this.initGalleryEvents();
    this.initLightbox();
    this.initCtaForm();
    this.initScrollToTop();
    this.initLanguage();
    this.initScrollProgress();
    this.initNavActiveState();
    this.initCounters();
    this.initChatAnimation();
    this.initContactForm();
    this.initHeroSlideshow();
    this.initAiTabs();
    this.initAnchorSettle();
    this.initContactPage();
  },

  /* In-page links: images further down load while the page scrolls and push the target lower, so once the
     scroll ends, check where the section really is and finish the trip (at most three corrections). */
  initAnchorSettle() {
    // Arriving from another page with #section: once everything has loaded (and pushed things down), go there again.
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    // Jump (no smooth animation: the page is still growing, which would end a slow trip short), then re-check twice.
    if (target) addEventListener('load', () => {
      const go = () => {
        const want = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        if (Math.abs(target.getBoundingClientRect().top - want) > 2) target.scrollIntoView({ behavior: 'instant' });
      };
      [50, 400, 1200].forEach((ms) => setTimeout(go, ms));
    }, { once: true });
    if (!('onscrollend' in window)) return;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      const id = a && a.getAttribute('href').slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      let tries = 0;
      const settle = () => {
        const want = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
        const atEnd = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
        if (++tries > 3 || atEnd || Math.abs(el.getBoundingClientRect().top - want) <= 2) return;
        el.scrollIntoView({ behavior: 'smooth' });
        addEventListener('scrollend', settle, { once: true });
      };
      addEventListener('scrollend', settle, { once: true });
    });
  },

  /* Language — initialize from localStorage or default to 'ko' */
  initLanguage() {
    var savedLang = localStorage.getItem('lang') || 'ko';
    // Validate saved language
    if (!i18n[savedLang]) savedLang = 'ko';
    switchLanguage(savedLang);

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
    }, { threshold: 0.1 });
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
      const lang = localStorage.getItem('lang') || 'ko';
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

      // Send via FormSubmit.co (no signup required)
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          _subject: 'VegaFencer Demo Request from ' + email.value,
          message: 'New demo request from: ' + email.value,
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
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          observer.unobserve(entry.target);
          const delays = [0, 800, 1800, 2600];
          messages.forEach((msg, i) => {
            setTimeout(() => {
              if (i === 1 || i === 3) {
                const dot = document.createElement('div');
                dot.className = 'flex justify-start chat-visible';
                dot.innerHTML = '<div class="bg-surface-container-high/60 px-4 py-3 rounded-2xl rounded-bl-sm"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
                container.insertBefore(dot, msg);
                setTimeout(() => { dot.remove(); msg.classList.add('chat-visible'); }, 600);
              } else {
                msg.classList.add('chat-visible');
              }
            }, delays[i]);
          });
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
  /* AI Chat / Agent tabs */
  initAiTabs() {
    const tabs = document.querySelectorAll('[data-ai-tab]');
    if (!tabs.length) return;
    const panels = {
      chat: document.getElementById('aiPanelChat'),
      agent: document.getElementById('aiPanelAgent'),
    };
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const name = tab.dataset.aiTab;
        Object.keys(panels).forEach((key) => {
          if (panels[key]) panels[key].classList.toggle('hidden', key !== name);
        });
        tabs.forEach((t) => t.classList.toggle('ai-tab-active', t.dataset.aiTab === name));
      });
    });
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
      const lang = localStorage.getItem('lang') || 'ko';
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
      const lang = localStorage.getItem('lang') || 'ko';
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
