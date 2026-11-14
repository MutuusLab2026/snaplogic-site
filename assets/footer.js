/* Shared footer for every page (with the contact form), plus the scroll-to-top button and the image lightbox: edit
   it here once. The <script> tag that loads this file is replaced by the markup synchronously. */
document.currentScript.insertAdjacentHTML('beforebegin', `
<!-- ============================================================
     FOOTER
     ============================================================ -->
<footer class="bg-slate-50 border-t border-outline-variant/20 py-10 md:py-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
      <!-- Brand -->
      <div>
        <div class="font-headline font-black text-xl text-on-surface mb-3">VegaFencer</div>
        <p class="font-body text-on-surface-variant text-sm leading-relaxed" data-i18n-html="footer_tagline">아키텍처 설계에서 양산까지.<br>차량 E/E 아키텍처·와이어링 하네스 설계 소프트웨어.</p>
      </div>
      <!-- Platform -->
      <div>
        <h2 class="font-headline font-bold text-on-surface text-sm mb-4" data-i18n="footer_platform">Platform</h2>
        <div class="flex flex-col gap-2.5">
          <a href="${pageUrl('product', '#logic')}" class="font-body text-on-surface-variant text-sm hover:text-primary-container transition-colors">Logic</a>
          <a href="${pageUrl('product', '#integrator')}" class="font-body text-on-surface-variant text-sm hover:text-primary-container transition-colors">Integrator</a>
          <a href="${pageUrl('product', '#harness')}" class="font-body text-on-surface-variant text-sm hover:text-primary-container transition-colors">Harness Drawing</a>
          <a href="${pageUrl('product', '#ai')}" class="font-body text-on-surface-variant text-sm hover:text-primary-container transition-colors">AI Assistant</a>
        </div>
      </div>
      <!-- Resources -->
      <div>
        <h2 class="font-headline font-bold text-on-surface text-sm mb-4" data-i18n="footer_resources">Resources</h2>
        <div class="flex flex-col gap-2.5">
          <a href="${pageUrl('resources', '#gallery')}" class="font-body text-on-surface-variant text-sm hover:text-primary-container transition-colors" data-i18n="footer_gallery">Gallery</a>
          <a href="${pageUrl('product', '#workflow')}" class="font-body text-on-surface-variant text-sm hover:text-primary-container transition-colors" data-i18n="footer_workflow">Workflow</a>
          <a href="${pageUrl('product', '#integrations')}" class="font-body text-on-surface-variant text-sm hover:text-primary-container transition-colors" data-i18n="footer_integrations">Integrations</a>
        </div>
      </div>
      <!-- Contact Form (hidden on the contact page, which has its own form) -->
      <div class="md:col-span-2 lg:col-span-1 footer-contact">
        <h2 class="font-headline font-bold text-on-surface text-sm mb-4" data-i18n="contact_title">Contact Us</h2>
        <form class="flex flex-col gap-2.5" id="contactForm" onsubmit="return false;">
          <input class="hp-field" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
          <input class="px-3 py-2 rounded-lg border border-outline-variant/30 bg-white text-sm font-body text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container/50 focus:ring-1 focus:ring-primary-container/20" type="text" name="name" data-i18n-placeholder="contact_name" placeholder="이름" required>
          <input class="px-3 py-2 rounded-lg border border-outline-variant/30 bg-white text-sm font-body text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container/50 focus:ring-1 focus:ring-primary-container/20" type="text" name="company" data-i18n-placeholder="contact_company" placeholder="회사명">
          <input class="px-3 py-2 rounded-lg border border-outline-variant/30 bg-white text-sm font-body text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container/50 focus:ring-1 focus:ring-primary-container/20" type="email" name="email" data-i18n-placeholder="contact_email" placeholder="이메일" required>
          <textarea class="px-3 py-2 rounded-lg border border-outline-variant/30 bg-white text-sm font-body text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container/50 focus:ring-1 focus:ring-primary-container/20 resize-none" name="message" rows="3" data-i18n-placeholder="contact_message" placeholder="문의 내용" required></textarea>
          <button class="kinetic-gradient text-white px-4 py-2 rounded-lg font-label font-semibold text-sm hover:opacity-90 transition-opacity" type="submit" data-i18n="contact_submit">문의하기</button>
          <p class="hidden text-xs text-secondary font-body" id="contactSuccess" data-i18n="contact_success">감사합니다! 곧 답변드리겠습니다.</p>
          <p class="hidden text-xs text-red-500 font-body" id="contactError" data-i18n="contact_error">전송에 실패했습니다.</p>
        </form>
      </div>
    </div>
    <!-- Bottom -->
    <div class="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-outline-variant/15 gap-4">
      <span class="font-body text-on-surface-variant text-xs" data-i18n-html="footer_copy">&copy; 2026 VegaFencer. All rights reserved.</span>
      <span class="font-body text-on-surface-variant text-xs" data-i18n-html="footer_legal">Privacy &middot; Terms &middot; Security</span>
    </div>
  </div>
</footer>

<!-- ============================================================
     SCROLL TO TOP
     ============================================================ -->
<button class="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-lg z-[100] opacity-0 translate-y-5 transition-all duration-300 shadow-lg" id="scrollTopBtn" aria-label="Scroll to top" style="background:linear-gradient(135deg,#1A73E8,#006a61);box-shadow:0 4px 16px rgba(26,115,232,0.3)">&uarr;</button>

<!-- ============================================================
     LIGHTBOX
     ============================================================ -->
<div class="fixed inset-0 z-[2000] bg-black/90 hidden items-center justify-center p-4 md:p-8 cursor-zoom-out" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
  <button class="absolute top-3 right-3 md:top-6 md:right-6 w-12 h-12 rounded-full bg-white/10 text-white text-2xl flex items-center justify-center hover:bg-white/25 transition-colors z-10" aria-label="Close" onclick="closeLightbox()">&times;</button>
  <button class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white text-2xl md:text-3xl flex items-center justify-center hover:bg-white/25 transition-colors z-10" aria-label="Previous" onclick="navigateLightbox(-1)">&#8249;</button>
  <img id="lightboxImg" class="max-w-[95%] max-h-[85vh] md:max-h-[90vh] rounded-xl object-contain" src="" alt="">
  <button class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white text-2xl md:text-3xl flex items-center justify-center hover:bg-white/25 transition-colors z-10" aria-label="Next" onclick="navigateLightbox(1)">&#8250;</button>
</div>
`);
