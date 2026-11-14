/* Sections that appear on more than one page (home and product): edit them here once.
   A page shows one with  <script>vfSection('ai')</script>  at the spot where it belongs; the tag is replaced by the
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
      <p class="lg-tagline" data-i18n="modules_title">하나의 플랫폼, 완전한 E/E 설계</p>
      <p class="font-body text-on-surface-variant text-base leading-relaxed lg-lead" data-i18n="modules_desc">회로도의 전기적 의도부터 물리적 하네스 도면까지 — 다섯 개의 핵심 모듈이 끊김 없이 연결됩니다.</p>
    </header>

    <div class="grid sm:grid-cols-2 gap-4 md:gap-6">
      <!-- Logic -->
      <a href="${here('product', '#logic')}" class="reveal reveal-delay-1 group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary-container/10">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5" style="background:#E8F0FE">&#9889;</div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-primary-container transition-colors" data-i18n="mod_logic_title">Logic</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n-html="mod_logic_desc">전기적 설계 의도를 정의하는 핵심 모듈.<br>디바이스 핀 연결부터 전기적 오류 검증까지.</p>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-label font-semibold" style="background:#E8F0FE;color:#1A73E8" data-i18n="mod_logic_tag">Design intent</span>
      </a>

      <!-- Integrator -->
      <a href="${here('product', '#integrator')}" class="reveal reveal-delay-2 group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-secondary/10">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5" style="background:#CCFBF1">&#128279;</div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-secondary transition-colors" data-i18n="mod_integrator_title">Integrator</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_integrator_desc">회로도와 3D 번들 설계를 연결&middot;동기화. 와이어 라우팅, 번들 구성, 토폴로지 검증을 하나의 워크플로우로.</p>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-label font-semibold" style="background:#CCFBF1;color:#0D9488" data-i18n="mod_integrator_tag">Data sync</span>
      </a>

      <!-- Harness Drawing -->
      <a href="${here('product', '#harness')}" class="reveal reveal-delay-3 group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-orange-500/10">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5" style="background:#FFF3E0">&#128208;</div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-orange-600 transition-colors" data-i18n="mod_harness_title">Harness Drawing</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_harness_desc">상세 하네스 도면 자동 생성. 플러그 심볼, 와이어 리스트, 번들 직경 계산까지 원스톱.</p>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-label font-semibold" style="background:#FFF3E0;color:#E8710A" data-i18n="mod_harness_tag">Documentation</span>
      </a>

      <!-- Variant / Config -->
      <a href="${here('product', '#variant')}" class="reveal reveal-delay-4 group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-tertiary/10">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5" style="background:#EDE9FE">&#127899;&#65039;</div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-tertiary transition-colors" data-i18n="mod_variant_title">Variant / Config</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_variant_desc">Variant, Option, Configuration별 다이어그램 필터링. Worst-case 설계 내 특정 구성만 시각화.</p>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-label font-semibold" style="background:#EDE9FE;color:#7C3AED" data-i18n="mod_variant_tag">Flexibility</span>      </a>

      <!-- Bridge -->
      <a href="${here('product', '#bridge')}" class="reveal reveal-delay-5 group block bg-white rounded-[20px] p-5 sm:p-6 md:p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5" style="background:#CFFAFE">&#128268;</div>
        <h3 class="font-headline font-bold text-xl text-on-surface mb-3 group-hover:text-cyan-700 transition-colors" data-i18n="mod_bridge_title">Bridge</h3>
        <p class="font-body text-on-surface-variant text-[15px] leading-relaxed mb-4" data-i18n="mod_bridge_desc">CATIA V5 &amp; NX 3D CAD와의 양방향 상호운용성. 와이어 리스트·번들 길이 데이터를 실시간으로 교환합니다.</p>
        <span class="inline-block px-3 py-1 rounded-full text-xs font-label font-semibold" style="background:#CFFAFE;color:#0E7490" data-i18n="mod_bridge_tag">Interop</span>
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
    <div class="relative mb-20">
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

    <!-- Bottom Glass Cards -->
    <div class="grid md:grid-cols-3 gap-6">
      <div class="glass-card p-8 reveal reveal-delay-1">
        <span class="material-symbols-outlined text-secondary-container mb-4 block" style="font-size:28px">group</span>
        <h3 class="font-headline font-bold text-white text-lg mb-2" data-i18n="wf_card1_title">실시간 협업</h3>
        <p class="font-body text-white/40 text-sm leading-relaxed" data-i18n="wf_card1_desc">Git 기반 버전 관리로 팀 전체가 동일한 설계 데이터에서 작업합니다.</p>
      </div>
      <div class="glass-card p-8 reveal reveal-delay-2">
        <span class="material-symbols-outlined text-secondary-container mb-4 block" style="font-size:28px">verified</span>
        <h3 class="font-headline font-bold text-white text-lg mb-2" data-i18n="wf_card2_title">지능형 DRC</h3>
        <p class="font-body text-white/40 text-sm leading-relaxed" data-i18n="wf_card2_desc">24개 검증 규칙이 설계 오류를 실시간으로 탐지하고 수정을 제안합니다.</p>
      </div>
      <div class="glass-card p-8 reveal reveal-delay-3">
        <span class="material-symbols-outlined text-secondary-container mb-4 block" style="font-size:28px">description</span>
        <h3 class="font-headline font-bold text-white text-lg mb-2" data-i18n="wf_card3_title">원클릭 리포트</h3>
        <p class="font-body text-white/40 text-sm leading-relaxed" data-i18n="wf_card3_desc">BOM, Wire list, Connector list를 한 번의 클릭으로 생성합니다.</p>
      </div>
    </div>
  </div>
</section>
`,
  ai: () => `
<section class="py-12 md:py-24" id="ai">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
    <!-- Text (left) and one app window (right). The window is a little taller than the text (aiWindow sizes it);
         the switch in its title bar slides between the chat demo, the agent demo and a real screenshot. -->
    <div class="ai-row">
      <div class="reveal ai-text" id="aiText">
        <header class="lg-head">
          <p class="lg-kicker" translate="no">EXTENSIONS</p>
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
              <button type="button" role="tab" class="ai-tab-active" aria-selected="true" data-ai-tab="chat" translate="no">AI Chat</button>
              <button type="button" role="tab" aria-selected="false" data-ai-tab="agent" translate="no">AI Agent</button>
              <button type="button" role="tab" aria-selected="false" data-ai-tab="shot" data-i18n="ai_tab_shot">실제 화면</button>
            </div>
          </div>
          <div class="ai-win-body">
            <div id="aiPanelChat" class="ai-panel ai-pane ai-pane-chat">
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
            <div id="aiPanelAgent" class="ai-panel ai-pane ai-pane-agent font-body text-sm hidden">
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
            <div id="aiPanelShot" class="ai-panel ai-pane ai-pane-shot hidden">
              <img src="assets/img/ai-assistant-screen.jpg" width="1400" height="794" alt="VegaFencer AI Assistant screen" loading="lazy">
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
    <div class="text-center mb-16 reveal">
      <p class="font-label text-xs font-bold tracking-[0.2em] uppercase text-primary-container mb-3" data-i18n="int_label">ECOSYSTEM</p>
      <h2 class="font-headline font-black text-2xl sm:text-3xl md:text-5xl tracking-tight text-on-surface mb-4" data-i18n="int_title">기존 도구와 완벽하게 연결</h2>
      <p class="font-body text-on-surface-variant text-lg max-w-2xl mx-auto" data-i18n="int_desc">Git 버전 관리부터 CAD 브릿지까지 — 팀의 기존 워크플로우를 유지합니다.</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" id="intGrid">
      <!-- Git -->
      <div class="reveal reveal-delay-1 bg-white rounded-2xl p-6 text-center border border-outline-variant/15 hover:shadow-lg hover:-translate-y-1 transition-all">
        <span class="material-symbols-outlined text-on-surface-variant mb-3 block" style="font-size:32px">shortcut</span>
        <h3 class="font-headline font-bold text-on-surface text-sm mb-1">Git</h3>
        <p class="font-body text-on-surface-variant text-xs mb-3" data-i18n="int_git_desc">버전 관리 &amp; 협업</p>
        <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-label font-bold bg-secondary-container/30 text-secondary" data-i18n="int_available">Available</span>
      </div>
      <!-- DXF/DWG -->
      <div class="reveal reveal-delay-2 bg-white rounded-2xl p-6 text-center border border-outline-variant/15 hover:shadow-lg hover:-translate-y-1 transition-all">
        <span class="material-symbols-outlined text-on-surface-variant mb-3 block" style="font-size:32px">square</span>
        <h3 class="font-headline font-bold text-on-surface text-sm mb-1">DXF / DWG</h3>
        <p class="font-body text-on-surface-variant text-xs mb-3" data-i18n="int_dxf_desc">CAD 포맷 임포트</p>
        <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-label font-bold bg-secondary-container/30 text-secondary" data-i18n="int_available">Available</span>
      </div>
      <!-- AI/MCP -->
      <div class="reveal reveal-delay-3 bg-white rounded-2xl p-6 text-center border border-outline-variant/15 hover:shadow-lg hover:-translate-y-1 transition-all">
        <span class="material-symbols-outlined text-on-surface-variant mb-3 block" style="font-size:32px">auto_awesome</span>
        <h3 class="font-headline font-bold text-on-surface text-sm mb-1">AI / MCP</h3>
        <p class="font-body text-on-surface-variant text-xs mb-3" data-i18n="int_ai_desc">LLM 연동 프로토콜</p>
        <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-label font-bold bg-secondary-container/30 text-secondary" data-i18n="int_available">Available</span>
      </div>
      <!-- Jira -->
      <div class="reveal reveal-delay-4 bg-white rounded-2xl p-6 text-center border border-outline-variant/15 hover:shadow-lg hover:-translate-y-1 transition-all">
        <span class="material-symbols-outlined text-on-surface-variant mb-3 block" style="font-size:32px">grid_view</span>
        <h3 class="font-headline font-bold text-on-surface text-sm mb-1">Jira</h3>
        <p class="font-body text-on-surface-variant text-xs mb-3" data-i18n="int_jira_desc">프로젝트 관리</p>
        <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-label font-bold bg-error-container/40 text-error" data-i18n="int_coming">Coming soon</span>
      </div>
      <!-- Creo/SOLIDWORKS -->
      <div class="reveal reveal-delay-4 bg-white rounded-2xl p-6 text-center border border-outline-variant/15 hover:shadow-lg hover:-translate-y-1 transition-all col-span-2 md:col-span-1">
        <span class="material-symbols-outlined text-on-surface-variant mb-3 block" style="font-size:32px">hexagon</span>
        <h3 class="font-headline font-bold text-on-surface text-sm mb-1">Creo / SOLIDWORKS</h3>
        <p class="font-body text-on-surface-variant text-xs mb-3" data-i18n="int_cad_desc">3D CAD 브릿지</p>
        <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-label font-bold bg-error-container/40 text-error" data-i18n="int_coming">Coming soon</span>
      </div>
    </div>
  </div>
</section>
`,
  cta: () => `
<section class="py-16 md:py-32 relative overflow-hidden" id="cta" style="background:#0B1120">
  <!-- Radial Glow -->
  <div class="radial-glow" style="top:-200px;left:50%;transform:translateX(-50%)"></div>

  <div class="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10">
    <!-- Badge -->
    <div class="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
      <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
      <span class="font-label text-sm font-medium text-white/70" data-i18n="cta_badge">Enterprise Ready</span>
    </div>

    <h2 class="reveal font-headline font-black text-2xl sm:text-3xl md:text-5xl tracking-tight text-white leading-tight mb-4 md:mb-6" data-i18n-html="cta_title">
      E/E 설계 워크플로우를<br><span class="kinetic-text-gradient">혁신할 준비가 되셨나요?</span>
    </h2>
    <p class="reveal reveal-delay-1 font-body text-white/50 text-lg mb-10 max-w-xl mx-auto" data-i18n="cta_subtitle">
      VegaFencer 데모를 신청하고, 맞춤형 솔루션을 경험하세요. 전문 엔지니어가 귀사의 E/E 설계 프로세스를 분석하여 최적의 워크플로우를 제안합니다.
    </p>

    <!-- Email Form -->
    <div class="reveal reveal-delay-2">
      <form class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" id="ctaForm" onsubmit="return false;">
        <input class="hp-field" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
        <input class="flex-1 px-6 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-primary-container/50 focus:ring-2 focus:ring-primary-container/20 transition-all" type="email" name="email" data-i18n-placeholder="cta_placeholder" placeholder="업무 이메일을 입력하세요" required>
        <button class="kinetic-gradient text-white px-8 py-3.5 rounded-full font-label font-bold text-sm whitespace-nowrap hover:opacity-90 transition-opacity shadow-lg shadow-primary-container/20" type="submit" data-i18n-html="cta_submit">데모 신청 &rarr;</button>
      </form>
      <p class="hidden mt-6 text-secondary-container font-body font-semibold" id="ctaSuccess" data-i18n="cta_success">감사합니다! 곧 연락드리겠습니다.</p>
      <p class="hidden mt-6 text-red-400 font-body font-semibold" id="ctaError" data-i18n="cta_error"></p>
    </div>

  </div>
</section>
`,
  };
  window.vfSection = function (name) {
    document.currentScript.insertAdjacentHTML('beforebegin', sections[name]());
  };
})();
