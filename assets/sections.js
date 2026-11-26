/* Sections that appear on more than one page (home, product; the CTA also on pricing and resources): edit them here once.
   A page shows one with  <script src="assets/section.js?v=…" data-section="ai"></script>  at the spot where it
   belongs (see section.js); the tag is replaced by the
   markup synchronously (like header.js / footer.js), so i18n and site.js see it as ordinary page content.
   Needs header.js first (pageUrl). */
(function () {
  /* A link to another page, or just the #hash when we are already on that page (no reload). */
  const here = (page, hash) => (document.body.getAttribute('data-page') === page ? hash : pageUrl(page, hash));
  const sections = {
  modules: () => `
<section class="py-12 md:py-24" id="product">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <header class="lg-head modules-head reveal">
      <p class="lg-kicker">PLATFORM</p>
      <h2 class="lg-name" translate="no">Core Modules</h2>
      <p class="lg-tagline" data-i18n="modules_title">설계부터 검증, 협업까지 하나의 플랫폼에서 이어집니다.</p>
      <p class="font-body text-on-surface-variant text-base leading-relaxed lg-lead" data-i18n="modules_desc">회로 설계부터 전원·규칙 검증, 팀 협업과 3D&nbsp;CAD 연동까지 — 열 개의 핵심 모듈이 설계의 전 과정을 함께합니다.</p>
    </header>

    <!-- Module groups: the colour of each card's symbol (engineering.css, data-grp) -->
    <ul class="mod-legend reveal">
      <li data-grp="1"><i></i><span data-i18n="mod_grp1">설계</span></li>
      <li data-grp="2"><i></i><span data-i18n="mod_grp2">검증 · 관리</span></li>
      <li data-grp="3"><i></i><span data-i18n="mod_grp3">협업 · 연동</span></li>
    </ul>

    <div class="grid sm:grid-cols-2 gap-4 md:gap-6 reveal">   <!-- all ten cards rise together (2026-11-23; one by one was too busy) -->
      <a href="${here('product', '#logic')}" data-mod="logic" data-grp="1" class="group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"></div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" translate="no" data-i18n="mod_logic_title">Logic</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_logic_desc">핀 단위로 연결을 정의하고, 전기적 오류를 바로 검증합니다.</p>
        <span class="mod-more" aria-hidden="true"><span data-i18n="gal_more">자세히 보기</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>

      <a href="${here('product', '#integrator')}" data-mod="integrator" data-grp="1" class="group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"></div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" translate="no" data-i18n="mod_integrator_title">Integrator</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_integrator_desc">회로도를 3D 번들 설계와 동기화하고, 토폴로지를 검증합니다.</p>
        <span class="mod-more" aria-hidden="true"><span data-i18n="gal_more">자세히 보기</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>

      <a href="${here('product', '#harness')}" data-mod="harness" data-grp="1" class="group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"></div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" translate="no" data-i18n="mod_harness_title">Harness</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_harness_desc">하네스 도면을 자동 생성하고, 와이어 리스트와 번들 직경을 계산합니다.</p>
        <span class="mod-more" aria-hidden="true"><span data-i18n="gal_more">자세히 보기</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>

      <a href="${here('product', '#main')}" data-mod="power" data-grp="2" class="group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"></div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" translate="no" data-i18n="mod_power_title">Power Check</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_power_desc">전원·퓨즈·부하·접지 역할과 전류값으로 회로의 전원 용량을 점검합니다.</p>
        <span class="mod-more" aria-hidden="true"><span data-i18n="gal_more">자세히 보기</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>

      <a href="${here('product', '#variant')}" data-mod="drc" data-grp="2" class="group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"></div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" translate="no" data-i18n="mod_drc_title">DRC / BOM</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_drc_desc">24개 DRC 규칙으로 설계 오류를 찾고, 와이어·커넥터 BOM을 출력합니다.</p>
        <span class="mod-more" aria-hidden="true"><span data-i18n="gal_more">자세히 보기</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>

      <a href="${here('product', '#variant')}" data-mod="variant" data-grp="2" class="group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"></div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" translate="no" data-i18n="mod_variant_title">Variant / Option Configuration</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_variant_desc">Variant, Option, Configuration 별로 원하는 구성을 표시합니다.</p>
        <span class="mod-more" aria-hidden="true"><span data-i18n="gal_more">자세히 보기</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>

      <a href="${here('product', '#enterprise')}" data-mod="library" data-grp="2" class="group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"></div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" translate="no" data-i18n="mod_library_title">Library / Symbol Editor</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_library_desc">표준화된 라이브러리를 사용자화하고, 필드별 속성을 지정합니다.</p>
        <span class="mod-more" aria-hidden="true"><span data-i18n="gal_more">자세히 보기</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>

      <a href="${here('product', '#enterprise')}" data-mod="multiuser" data-grp="3" class="group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"></div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" translate="no" data-i18n="mod_multiuser_title">Multiuser Environment</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_multiuser_desc">Server/Client로 함께 설계합니다. 사용자별 권한, 편집 중 도면 자동 잠금.</p>
        <span class="mod-more" aria-hidden="true"><span data-i18n="gal_more">자세히 보기</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>

      <a href="${here('product', '#ai')}" data-mod="ai" data-grp="3" class="group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"></div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" translate="no" data-i18n="mod_ai_title">AI Assistant</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_ai_desc">MCP 기반 AI 어시스턴트. 자연어로 설계 데이터를 조회·수정합니다.</p>
        <span class="mod-more" aria-hidden="true"><span data-i18n="gal_more">자세히 보기</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>

      <a href="${here('product', '#bridge')}" data-mod="bridge" data-grp="3" class="group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"></div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" translate="no" data-i18n="mod_bridge_title">3D CAD Bridge</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_bridge_desc">CATIA V5·NX와 와이어 리스트·번들 길이 데이터를 양방향으로 주고받습니다.</p>
        <span class="mod-more" aria-hidden="true"><span data-i18n="gal_more">자세히 보기</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></span>
      </a>
    </div>
  </div>
</section>
`,
  workflow: () => `
<section class="py-12 md:py-24 relative overflow-hidden" id="workflow" style="background:#0B1120">
  <!-- Dot Grid Overlay -->
  <div class="absolute inset-0 dot-grid"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
    <header class="lg-head wf-head reveal">
      <p class="lg-kicker" translate="no">PROCESS</p>
      <h2 class="lg-name" translate="no">Design Workflow</h2>
      <p class="lg-tagline" data-i18n="wf_title">설계에서 양산까지, 하나의 흐름.</p>
      <p class="font-body text-base leading-relaxed lg-lead" data-i18n="wf_desc">각 단계의 데이터가 자동으로 다음 단계에 전달되어, 수작업 변환 없이 일관된 설계를 보장합니다.</p>
    </header>

    <!-- Steps Row -->
    <div class="relative">
      <!-- Connector Line -->
      <div class="workflow-motion-line hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5" style="background:linear-gradient(90deg, #1A73E8, #006a61, #E8710A, #732de4); opacity:0.3;"></div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Step 01 -->
        <div class="workflow-step reveal reveal-delay-1 text-center relative">
          <div class="w-12 h-12 rounded-full border-2 flex items-center justify-center mx-auto mb-4 text-sm font-label font-bold relative z-10" style="border-color:rgba(26,115,232,0.5);background:rgba(26,115,232,0.12);color:#1A73E8">01</div>
          <span class="material-symbols-outlined text-white/30 mb-3 block" style="font-size:32px">schema</span>
          <h3 class="font-headline font-bold text-white text-lg mb-2" data-i18n="wf_step1_title">회로 설계</h3>
          <p class="font-body text-white/40 text-sm" data-i18n-html="wf_step1_desc">Logic에서 전기적 설계 의도를 <br class="wf-br">정의하고 기능 구조를 설계합니다.</p>
        </div>
        <!-- Step 02 -->
        <div class="workflow-step reveal reveal-delay-2 text-center relative">
          <div class="w-12 h-12 rounded-full border-2 flex items-center justify-center mx-auto mb-4 text-sm font-label font-bold relative z-10" style="border-color:rgba(0,106,97,0.5);background:rgba(0,106,97,0.12);color:#006a61">02</div>
          <span class="material-symbols-outlined text-white/30 mb-3 block" style="font-size:32px">hub</span>
          <h3 class="font-headline font-bold text-white text-lg mb-2" data-i18n="wf_step2_title">토폴로지 통합</h3>
          <p class="font-body text-white/40 text-sm" data-i18n-html="wf_step2_desc">Integrator가 논리 설계를 <br class="wf-br">차량 토폴로지에 매핑합니다.</p>
        </div>
        <!-- Step 03 -->
        <div class="workflow-step reveal reveal-delay-3 text-center relative">
          <div class="w-12 h-12 rounded-full border-2 flex items-center justify-center mx-auto mb-4 text-sm font-label font-bold relative z-10" style="border-color:rgba(232,113,10,0.5);background:rgba(232,113,10,0.12);color:#E8710A">03</div>
          <span class="material-symbols-outlined text-white/30 mb-3 block" style="font-size:32px">polyline</span>
          <h3 class="font-headline font-bold text-white text-lg mb-2" data-i18n="wf_step3_title">하네스 도면</h3>
          <p class="font-body text-white/40 text-sm" data-i18n="wf_step3_desc">상세 도면과 와이어 리스트를 자동 생성합니다.</p>
        </div>
        <!-- Step 04 -->
        <div class="workflow-step reveal reveal-delay-4 text-center relative">
          <div class="w-12 h-12 rounded-full border-2 flex items-center justify-center mx-auto mb-4 text-sm font-label font-bold relative z-10" style="border-color:rgba(115,45,228,0.5);background:rgba(115,45,228,0.12);color:#732de4">04</div>
          <span class="material-symbols-outlined text-white/30 mb-3 block" style="font-size:32px">fact_check</span>
          <h3 class="font-headline font-bold text-white text-lg mb-2" data-i18n="wf_step4_title">검증 &amp; 출력</h3>
          <p class="font-body text-white/40 text-sm" data-i18n-html="wf_step4_desc">DRC 24개 규칙 검증 후 <br class="wf-br">BOM 리포트를 출력합니다.</p>
        </div>
      </div>
    </div>

  </div>
</section>
`,
  integrator: (o) => `
<section class="py-12 md:py-24 bg-surface-container-low" id="integrator">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

    <!-- Module header and checklist (left), the module's screen (right): same layout as Logic -->
    <div class="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
      <div class="reveal">
        <header class="lg-head" id="integratorHead">
          <p class="lg-kicker" translate="no">${o.kicker || 'MODULE 02'}</p>
          <h2 class="lg-name" translate="no">Integrator</h2>
          <p class="lg-tagline" data-i18n="in_title">논리 설계와 3D 번들의 동기화</p>
          <p class="font-body text-on-surface-variant text-base leading-relaxed lg-lead mb-6" data-i18n-html="in_lead">Integrator는 회로도의 논리적 연결을 실제 차량의 번들 경로와 연결합니다.<br>두 설계 사이의 데이터 일관성을 유지하고, 변경 사항을 서로 반영합니다.</p>
        </header>
        <ul class="space-y-3">
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="in_r1_t">논리 설계 데이터 통합</span>
          </li>
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="in_r2_t">와이어 라우팅과 번들 구성</span>
          </li>
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="in_r3_t">번들 직경과 길이 산출</span>
          </li>
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="in_r4_t">회로도와 하네스 간 일관성 검증</span>
          </li>
        </ul>
      </div>
      <div class="reveal reveal-delay-2">
        ${o.frame != null ? `<!-- data-frame: an app window like Explore the Workspace, without the FIG. caption -->
        <div class="ga-frame"><div class="ga-bar" aria-hidden="true"><i></i><i></i><i></i><span translate="no">VegaFencer — Integrator</span></div><img src="assets/img/integrator-ws.webp" width="1920" height="1012" alt="" loading="lazy" decoding="async"></div>` : `<!-- engineering.js adds FIG. 02 under the first .rounded-2xl card in #integrator -->
        <div class="bg-white rounded-2xl shadow-lg shadow-on-surface/5 overflow-hidden border border-outline-variant/15">
          <img src="assets/img/integrator-ws.webp" width="1920" height="1012" alt="" loading="lazy" class="w-full block">
        </div>`}
      </div>
    </div>
  </div>
</section>
`,
  harness: (o) => `
<section class="py-12 md:py-24" id="harness">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

    <!-- Module header and checklist (left), the module's screen (right): same layout as Logic -->
    <div class="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
      <div class="reveal">
        <header class="lg-head" id="harnessHead">
          <p class="lg-kicker" translate="no">${o.kicker || 'MODULE 03'}</p>
          <h2 class="lg-name" translate="no">Harness</h2>
          <p class="lg-tagline" data-i18n="hd_title">상세 하네스 도면 자동 생성</p>
          <p class="font-body text-on-surface-variant text-base leading-relaxed lg-lead mb-6" data-i18n-html="hd_lead">Harness는 Logic과 Integrator의 데이터로 상세 도면을 만듭니다.<br>플러그 심볼, 번들 길이, 와이어 리스트를 한 장의 도면에 정리합니다.</p>
        </header>
        <ul class="space-y-3">
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="hd_r1_t">하네스 도면 생성과 시각화</span>
          </li>
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="hd_r2_t">플러그 심볼과 와이어 리스트 테이블</span>
          </li>
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="hd_r3_t">번들 직경 계산과 와이어 경로 추적</span>
          </li>
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="hd_r4_t">Variant·Option별 레이아웃 필터링</span>
          </li>
        </ul>
      </div>
      <div class="reveal reveal-delay-2">
        ${o.frame != null ? `<!-- data-frame: an app window like Explore the Workspace, without the FIG. caption -->
        <div class="ga-frame"><div class="ga-bar" aria-hidden="true"><i></i><i></i><i></i><span translate="no">VegaFencer — Harness</span></div><img src="assets/img/harness-ws.webp" width="1745" height="914" alt="" loading="lazy" decoding="async"></div>` : `<!-- engineering.js adds FIG. 03 under the first .rounded-2xl card in #harness -->
        <div class="bg-white rounded-2xl shadow-lg shadow-on-surface/5 overflow-hidden border border-outline-variant/15">
          <img src="assets/img/harness-ws.webp" width="1745" height="914" alt="" loading="lazy" class="w-full block">
        </div>`}
      </div>
    </div>
  </div>
</section>
`,
  ai: (o) => `
<section class="py-12 md:py-24" id="ai">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <!-- Text (left) and one app window (right). The window is a little taller than the text (aiWindow sizes it);
         the switch in its title bar slides between the chat demo, the agent demo and a real screenshot. -->
    <div class="ai-row">
      <div class="reveal ai-text" id="aiText">
        <header class="lg-head">
          <p class="lg-kicker" translate="no">${o.kicker || 'EXTENSIONS'}</p>
          <h2 class="lg-name" translate="no">AI Assistant</h2>
          <p class="lg-tagline" data-i18n="ai_title">자연어로 설계를 탐색하다</p>
          <p class="font-body text-on-surface-variant text-base leading-relaxed lg-lead mb-6" data-i18n="ai_desc">MCP (Model Context Protocol) 기반 AI 어시스턴트가 설계 데이터에 직접 접근하여, 복잡한 쿼리도 즉시 답변합니다.</p>
        </header>
        <ul class="space-y-3">
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="ai_c1">와이어 정보 즉시 조회 &mdash; 굵기, 색상, 재질, 연결 경로</span>
          </li>
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="ai_c2">커넥터별 연결/미연결 와이어 자동 분석</span>
          </li>
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="ai_c3">설계 오류 사전 탐지 및 수정 제안</span>
          </li>
          <li class="flex items-start gap-3 font-body text-[15px] text-on-surface">
            <span class="material-symbols-outlined text-secondary mt-0.5" style="font-size:20px">check</span>
            <span data-i18n="ai_c4">OpenAI API 연동 &mdash; 사내 LLM 교체 가능</span>
          </li>
        </ul>
      </div>

      <div class="reveal reveal-delay-2">
        <div class="ai-win" id="aiWindow">
          <div class="ai-win-head">
            <span class="ai-win-dot"></span>
            <span class="ai-win-title" data-for="chat" data-i18n="chat_title">VegaFencer AI</span>
            <span class="ai-win-title" data-for="agent" data-i18n="agent_title" hidden>VegaFencer Agent</span>
            <span class="ai-win-title" data-for="shot" data-i18n="chat_title" hidden>VegaFencer AI</span>
            <div class="ai-seg" role="tablist" aria-label="AI modes">
              <span class="ai-seg-thumb" aria-hidden="true"></span>
              <button type="button" role="tab" id="aiTabChat" aria-controls="aiPanelChat" class="ai-tab-active" aria-selected="true" data-ai-tab="chat" translate="no">AI Chat</button>
              <button type="button" role="tab" id="aiTabAgent" aria-controls="aiPanelAgent" aria-selected="false" tabindex="-1" data-ai-tab="agent" translate="no">AI Agent</button>
              <button type="button" role="tab" id="aiTabShot" aria-controls="aiPanelShot" aria-selected="false" tabindex="-1" data-ai-tab="shot" data-i18n="ai_tab_shot">실제 화면</button>
            </div>
          </div>
          <div class="ai-win-body">
            <div id="aiPanelChat" role="tabpanel" aria-labelledby="aiTabChat" tabindex="0" class="ai-panel ai-pane ai-pane-chat">
              <div class="space-y-4" id="chatMessages">
              <div class="flex justify-end">
                <div class="bg-primary-container text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-[80%] font-body text-sm" data-i18n="chat_user1">
                  BA91 Wire 정보를 부탁해.
                </div>
              </div>
              <div class="flex justify-start">
                <div class="bg-surface-container-high/60 text-on-surface px-4 py-3 rounded-2xl rounded-bl-sm max-w-[85%]">
                  <p class="font-body text-sm leading-relaxed mb-3" data-i18n-html="chat_ai1">BA91 와이어는 <code class="bg-primary-container/10 px-1.5 py-0.5 rounded text-primary-container font-label text-xs">0.5mm&sup2;</code> 굵기이며, 색상은 <code class="bg-primary-container/10 px-1.5 py-0.5 rounded text-primary-container font-label text-xs">녹색(G)</code>, <code class="bg-primary-container/10 px-1.5 py-0.5 rounded text-primary-container font-label text-xs">AVSS</code> 재질입니다.</p>
                  <table class="w-full text-xs font-label border-collapse">
                    <tr class="border-b border-outline-variant/15">
                      <td class="py-1.5 text-on-surface-variant" data-i18n="chat_ai1_from">출발</td>
                      <td class="py-1.5 font-semibold text-on-surface">UH_BOX 핀 18</td>
                    </tr>
                    <tr>
                      <td class="py-1.5 text-on-surface-variant" data-i18n="chat_ai1_to">도착</td>
                      <td class="py-1.5 font-semibold text-on-surface">UH_BOX 핀 88</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="flex justify-end">
                <div class="bg-primary-container text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-[80%] font-body text-sm leading-relaxed" data-i18n-html="chat_user2">
                  UH_BOX에 연결된 Wire를 보여주고,<br>연결이 안 된 Wire를 알려줘?
                </div>
              </div>
              <div class="flex justify-start">
                <div class="bg-surface-container-high/60 text-on-surface px-4 py-3 rounded-2xl rounded-bl-sm max-w-[85%]">
                  <p class="font-body text-sm leading-relaxed mb-3" data-i18n-html="chat_ai2">UH_BOX 연결 와이어 <code class="bg-primary-container/10 px-1.5 py-0.5 rounded text-primary-container font-label text-xs">12개</code> 확인.<br>미연결 와이어 <code class="bg-error/10 px-1.5 py-0.5 rounded text-error font-label text-xs">3개</code> 발견<br>&mdash; BA95, BA97, BC01.</p>
                  <div class="flex gap-2 mt-3">
                    <button class="px-3 py-1.5 rounded-lg bg-primary-container/10 text-primary-container text-xs font-label font-semibold hover:bg-primary-container/20 transition-colors" data-i18n="chat_btn_drc">DRC 리포트 반영</button>
                    <button class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-xs font-label font-semibold hover:bg-surface-container-high transition-colors" data-i18n="chat_btn_detail">상세 보기</button>
                  </div>
                </div>
              </div>
              </div>
            </div>
            <div id="aiPanelAgent" role="tabpanel" aria-labelledby="aiTabAgent" tabindex="0" class="ai-panel ai-pane ai-pane-agent font-body text-sm hidden">
              <!-- Steps run one after another each time the Agent tab opens (site.js initAgentAnimation). -->
              <div class="ag-q"><div class="bg-primary-container text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%] leading-relaxed" data-i18n="agent_task">C29 커넥터 2번 핀에 와이어를 연결하고 DRC를 실행해줘.</div></div>
              <div class="ag-a bg-surface-container-high/60 text-on-surface px-4 py-3 rounded-2xl rounded-bl-sm" id="agentSteps">
                <div class="ag-step">
                  <div class="ag-line ag-run-line"><span class="material-symbols-outlined text-primary-container ag-turn">autorenew</span><span><span data-i18n="ag_run1">와이어 연결 후보 검색 중</span> <span class="ag-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></span></div>
                  <div class="ag-line ag-done-line"><span class="material-symbols-outlined text-secondary">check_circle</span><span data-i18n="ag_done1">와이어 연결 후보 검색 &mdash; 3개 발견</span></div>
                  <div class="ag-sub bar"><span>AVSS</span><span>CIVUS</span><span>AVX</span></div>
                </div>
                <div class="ag-step">
                  <div class="ag-line ag-run-line"><span class="material-symbols-outlined text-primary-container ag-turn">autorenew</span><span><span data-i18n="ag_run2">최적 경로 설정 중</span> <span class="ag-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></span></div>
                  <div class="ag-line ag-done-line"><span class="material-symbols-outlined text-secondary">check_circle</span><span data-i18n="ag_done2">최적 경로 설정 완료</span></div>
                  <div class="ag-sub dash"><span>AVSS 0.5mm&sup2;</span></div>
                </div>
                <div class="ag-step">
                  <div class="ag-line ag-run-line"><span class="material-symbols-outlined text-primary-container ag-turn">autorenew</span><span><span data-i18n="ag_run3">핀 연결 실행 중</span> <span class="ag-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></span></div>
                  <div class="ag-line ag-done-line"><span class="material-symbols-outlined text-secondary">check_circle</span><span data-i18n="ag_done3">핀 연결 실행 완료</span></div>
                  <div class="ag-sub dash"><span data-i18n="ag_res3">UH_BOX 핀 88</span></div>
                </div>
                <div class="ag-step">
                  <div class="ag-line ag-run-line"><span class="material-symbols-outlined text-primary-container ag-turn">autorenew</span><span><span data-i18n="ag_run4">DRC 24개 규칙 검증 중</span> <span class="ag-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></span></div>
                  <div class="ag-line ag-done-line"><span class="material-symbols-outlined text-secondary">check_circle</span><span data-i18n="ag_done4">DRC 24개 규칙 검증 완료</span></div>
                  <div class="ag-sub dash"><span data-i18n="ag_res4">이상 없음</span></div>
                </div>
              </div>
            </div>
            <div id="aiPanelShot" role="tabpanel" aria-labelledby="aiTabShot" tabindex="0" class="ai-panel ai-pane ai-pane-shot hidden">
              <img src="assets/img/ai-assistant-screen.jpg" width="1400" height="794" alt="" loading="lazy">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`,
  ecosystem: () => `
<section class="py-12 md:py-24 bg-surface-container-low" id="integrations">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <header class="reveal lg-head mb-12">
      <p class="lg-kicker">ECOSYSTEM</p>
      <h2 class="lg-name" translate="no">Integrations</h2>
      <p class="lg-tagline" data-i18n="int_title">기존 도구와 완벽하게 연결</p>
      <p class="font-body text-on-surface-variant text-base leading-relaxed lg-lead" data-i18n="int_desc">Git 버전 관리부터 CAD 브릿지까지 — 팀의 기존 워크플로우를 유지합니다.</p>
    </header>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" id="intGrid">
      <!-- Git -->
      <div class="reveal reveal-delay-1 bg-white rounded-2xl p-6 text-center border border-outline-variant/15 hover:shadow-lg hover:-translate-y-1 transition-all">
        <span class="material-symbols-outlined text-on-surface-variant mb-3 block" style="font-size:32px">shortcut</span>
        <h3 class="font-headline font-bold text-on-surface text-sm mb-1">Git</h3>
        <p class="font-body text-on-surface-variant text-xs mb-3" data-i18n="int_git_desc">버전 관리 &amp; 협업</p>
        <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-label font-bold bg-secondary-container/30 text-secondary" data-i18n="int_available">Available</span>
      </div>
      <!-- DXF/DWG -->
      <div class="reveal reveal-delay-2 bg-white rounded-2xl p-6 text-center border border-outline-variant/15 hover:shadow-lg hover:-translate-y-1 transition-all">
        <span class="material-symbols-outlined text-on-surface-variant mb-3 block" style="font-size:32px">square</span>
        <h3 class="font-headline font-bold text-on-surface text-sm mb-1">DXF / DWG</h3>
        <p class="font-body text-on-surface-variant text-xs mb-3" data-i18n="int_dxf_desc">CAD 포맷 임포트</p>
        <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-label font-bold bg-secondary-container/30 text-secondary" data-i18n="int_available">Available</span>
      </div>
      <!-- AI/MCP -->
      <div class="reveal reveal-delay-3 bg-white rounded-2xl p-6 text-center border border-outline-variant/15 hover:shadow-lg hover:-translate-y-1 transition-all">
        <span class="material-symbols-outlined text-on-surface-variant mb-3 block" style="font-size:32px">auto_awesome</span>
        <h3 class="font-headline font-bold text-on-surface text-sm mb-1">AI / MCP</h3>
        <p class="font-body text-on-surface-variant text-xs mb-3" data-i18n="int_ai_desc">LLM 연동 프로토콜</p>
        <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-label font-bold bg-secondary-container/30 text-secondary" data-i18n="int_available">Available</span>
      </div>
      <!-- Jira -->
      <div class="reveal reveal-delay-4 bg-white rounded-2xl p-6 text-center border border-outline-variant/15 hover:shadow-lg hover:-translate-y-1 transition-all">
        <span class="material-symbols-outlined text-on-surface-variant mb-3 block" style="font-size:32px">grid_view</span>
        <h3 class="font-headline font-bold text-on-surface text-sm mb-1">Jira</h3>
        <p class="font-body text-on-surface-variant text-xs mb-3" data-i18n="int_jira_desc">프로젝트 관리</p>
        <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-label font-bold bg-error-container/40 text-error" data-i18n="int_coming">Coming soon</span>
      </div>
      <!-- Creo/SOLIDWORKS -->
      <div class="reveal reveal-delay-4 bg-white rounded-2xl p-6 text-center border border-outline-variant/15 hover:shadow-lg hover:-translate-y-1 transition-all col-span-2 md:col-span-1">
        <span class="material-symbols-outlined text-on-surface-variant mb-3 block" style="font-size:32px">hexagon</span>
        <h3 class="font-headline font-bold text-on-surface text-sm mb-1">Creo / SOLIDWORKS</h3>
        <p class="font-body text-on-surface-variant text-xs mb-3" data-i18n="int_cad_desc">3D CAD 브릿지</p>
        <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-label font-bold bg-error-container/40 text-error" data-i18n="int_coming">Coming soon</span>
      </div>
    </div>
  </div>
</section>
`,
  cta: () => `
<!-- Last CTA (2026-11-25): navy band with the original glow at the top and a faint blueprint grid;
     one line in the title in light blue; email + "ask about the product" and what happens next -->
<section class="cta3 py-16 md:py-32 relative overflow-hidden" id="cta">
  <div class="radial-glow" style="top:-200px;left:50%;transform:translateX(-50%)"></div>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10">
    <h2 class="reveal font-headline font-black text-2xl sm:text-3xl md:text-5xl tracking-tight text-white leading-tight mb-4 md:mb-6" data-i18n-html="cta_title">
      E/E 설계 워크플로우를<br><em>혁신할 준비</em>가 되셨나요?
    </h2>
    <p class="cta3-sub reveal reveal-delay-1" data-i18n-html="cta_subtitle">VegaFencer 상담을 신청하고, 맞춤형 솔루션을 경험하세요.<br class="cta3-br"> 전문 엔지니어가 귀사의 E/E 설계 프로세스를 분석하여<br class="cta3-br"> 최적의 워크플로우를 제안합니다.</p>

    <!-- Email Form -->
    <div class="reveal reveal-delay-2">
      <form class="cta3-form" id="ctaForm" method="post">
        <input class="hp-field" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="sr-only" for="ctaEmail" data-i18n="cta_email_label">업무 이메일</label>
        <input class="cta3-input" id="ctaEmail" type="email" name="email" autocomplete="email" data-i18n-placeholder="cta_placeholder" placeholder="업무 이메일을 입력하세요" required>
        <button class="cta3-btn btn-primary-dark" type="submit"><span data-i18n="hcta1_contact">제품 문의</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8"/></svg></button>
      </form>
      <p class="cta3-next" id="ctaNext" data-i18n="cta_next">담당 엔지니어가 영업일 기준 3일 안에 메일로 연락드립니다.</p>
      <p class="hidden mt-6 text-secondary-container font-body font-semibold" id="ctaSuccess" data-i18n="cta_success">감사합니다! 곧 연락드리겠습니다.</p>
      <p class="hidden mt-6 text-red-400 font-body font-semibold" id="ctaError" data-i18n="cta_error"></p>
    </div>

  </div>
</section>
`,
  };
  // opts: the tag's data-* attributes; data-kicker swaps the small line above a section's name for this page.
  window.vfSection = function (name, opts) {
    document.currentScript.insertAdjacentHTML('beforebegin', sections[name](opts || {}));
  };
})();
