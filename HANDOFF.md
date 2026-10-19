# VegaFencer 홈페이지 인수인계 가이드

## 1. 프로젝트 개요

| 항목 | 정보 |
|------|------|
| **사이트 도메인** | `roiscompany.com` (DNS 전파 완료, 2026-10-20 확인) |
| **임시 URL** | https://mutuuslab.github.io/snaplogic-site/ |
| **기술 스택** | 단일 `index.html` + Tailwind CSS CDN (빌드 도구 없음) |
| **호스팅** | GitHub Pages |
| **저장소** | https://github.com/mutuuslab/snaplogic-site |
| **파일 수** | 1개 HTML, 17개 이미지 (`images/`) |

---

## 2. 인계 시 필요한 접근 권한

### 필수

| 항목 | 위치 | 용도 |
|------|------|------|
| **GitHub 저장소** | https://github.com/mutuuslab/snaplogic-site | 코드 수정 및 배포 |
| **GitHub 계정** | `mutuuslab` 조직에 collaborator로 초대 | 푸시 권한 |
| **Cloudflare 계정** | https://dash.cloudflare.com (`tobiaskim@mutuus-lab.com`) | DNS 관리 |
| **도메인 등록 업체** | whoisdomain.kr | 네임서버 변경 시 |

### 옵션 (필요 시)

- **EmailJS 계정** (현재 미사용, 키만 보관 중)
  - Public Key: `TDdpK1auQGjiS1TYa`
  - Private Key: `xmVBn0R-bwsI0Tq0AQEpZ`
- **FormSubmit.co**: 가입 불필요, 이메일 활성화 링크만 클릭하면 됨

### 2-1. 권한 부여 현황 (2026-10-20 기준)

| 항목 | 상태 | 내용 |
|------|------|------|
| **GitHub 저장소 권한** | ✅ 초대 발송 (수락 대기) | `ditmergus`를 **Write** 협업자로 초대 — 수락 시 push 권한 |
| **DNS (Cloudflare)** | ⏳ 계정 권한 미이관 | 레코드 설정·전파는 정상. 계정 멤버 초대로 넘겨야 함 |
| **도메인 등록업체 (whoisdomain.kr)** | ⏳ 미완료 | 네임서버 변경 권한 이관 필요 |

> ⚠️ `mutuuslab`은 **조직(Organization)이 아니라 개인 계정**입니다. 그래서 "조직 collaborator 초대"는 존재하지 않고, **저장소 단위 협업자 초대**가 요청하신 푸시 권한과 동일한 효과를 냅니다.
> 초대 수락 위치: 초대 메일 → 또는 https://github.com/mutuuslab/snaplogic-site/invitations → 또는 저장소 **Settings > Collaborators**
> 부여 범위는 **Write(푸시·배포)** 이며, 저장소 설정 변경 권한(Admin)과 소유권은 넘기지 않았습니다. 완전 이관이 필요하면 아래 옵션 B를 사용하세요.

---

## 3. 인계 방법 (3가지 옵션)

### 옵션 A: GitHub Collaborator 추가 (권장)
1. https://github.com/mutuuslab/snaplogic-site/settings/access
2. **Add people** 클릭 → 후임자 GitHub ID 입력
3. **Write** 권한 부여
4. 후임자가 `git clone https://github.com/mutuuslab/snaplogic-site.git`로 시작

> ✅ 2026-10-20 기준 `ditmergus` 초대 **발송 완료** — 후임자 수락만 남았습니다. (수락 후 `Settings > Collaborators`에 표시됨)

### 옵션 B: 저장소 소유권 이전
- Settings > General > Danger Zone > **Transfer ownership**
- 다른 GitHub 계정/조직으로 완전 이전

### 옵션 C: Fork 또는 Mirror
- 후임자가 직접 fork 후 신규 저장소로 작업 (DNS만 새 저장소로 변경)

---

## 4. 로컬 개발 환경

### 클론
```bash
git clone https://github.com/mutuuslab/snaplogic-site.git
cd snaplogic-site
```

### 로컬 실행
- 브라우저에서 `index.html` 직접 열기 (서버 불필요)
- 또는: `python -m http.server 9001` → http://localhost:9001

### 배포
```bash
git add index.html
git commit -m "메시지"
git push origin main
# → GitHub Pages 자동 배포 (1~2분 소요)
```

---

## 5. 파일 구조

```
snaplogic-site/
├── index.html         # 메인 파일 (~2400줄, HTML+CSS+JS 통합)
├── images/            # 제품 스크린샷 17개 (슬라이드1~17.JPG)
├── CNAME              # roiscompany.com (커스텀 도메인 설정)
├── HANDOFF.md         # 이 문서
├── stitch/            # 디자인 참고 자료
└── stitch-prompts.md  # 초기 디자인 프롬프트
```

### index.html 내부 구조 (라인 번호는 변동될 수 있음)

| 영역 | 라인 (대략) | 설명 |
|------|------|------|
| `<head>` + Tailwind config + CSS | 1-470 | 폰트, 컬러 토큰, 커스텀 CSS |
| HTML body (Hero/Modules/...) | 471-1100 | 모든 섹션의 HTML 마크업 |
| i18n 4개 언어 (KO/EN/ZH/JA) | 1200-1900 | 다국어 텍스트 객체 |
| JS Controller | 1900-끝 | 애니메이션, 슬라이드쇼, 폼 등 |

---

## 6. 주요 기능 및 코드 위치

### 폼 이메일 발송 (FormSubmit.co)
- **데모 신청 폼**: `index.html`에서 `initCtaForm` 검색
- **문의 폼 (Footer)**: `initContactForm` 검색
- **수신자**: `tobiaskim@mutuus-lab.com` (CC: `srlee711@mutuus-lab.com`, `srlee711@gmail.com`, `tobiaskim2017@gmail.com`)
- **비즈니스 이메일 검증**: `FREE_EMAIL_DOMAINS` 배열 (Gmail, Naver 등 차단)
- **활성화 절차**: 첫 신청 시 `tobiaskim@mutuus-lab.com`으로 오는 FormSubmit.co 메일에서 **Confirm** 클릭 1회 필요

### 다국어 (i18n)
- 4개 언어 객체: `i18n.ko`, `i18n.en`, `i18n.zh`, `i18n.ja`
- 새 키 추가 시 **4개 언어 모두**에 동일 키 추가 필수
- HTML 사용:
  - `data-i18n="key"` → `textContent`로 적용
  - `data-i18n-html="key"` → `innerHTML`로 적용 (`<br>` 등 HTML 태그 포함 시)
  - `data-i18n-placeholder="key"` → input placeholder

### 동적 기능
- **히어로 슬라이드쇼**: `initHeroSlideshow()` — 5개 이미지 4초 간격 자동 전환
- **스탯 카운터**: `initCounters()` — 0에서 목표값까지 카운트업
- **AI 채팅 애니메이션**: `initChatAnimation()` — 메시지 순차 등장 + 타이핑 인디케이터
- **네비 활성 상태**: `initNavActiveState()` — 현재 섹션 강조
- **스크롤 진행 표시줄**: `initScrollProgress()` — 페이지 상단 그라디언트 바
- **라이트박스**: `initLightbox()` — 갤러리 클릭 확대, 터치 스와이프 지원

---

## 7. DNS 설정 (Cloudflare)

| 항목 | 값 |
|------|-----|
| Zone ID | `0e70e42f353398607218374e53eced87` |
| A 레코드 | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages) |
| 네임서버 | `evelyn.ns.cloudflare.com`, `julian.ns.cloudflare.com` |
| Proxy 상태 | **DNS only** (회색 구름) — Proxied로 하면 HTTPS 인증서 발급 실패 |

### 7-1. DNS 전파 확인 결과 (2026-10-20)

```
NS          evelyn.ns.cloudflare.com / julian.ns.cloudflare.com   ✅
A 레코드     185.199.108~111.153 (GitHub Pages) 4개 정상 응답      ✅
CNAME       roiscompany.com (저장소 CNAME 파일과 일치)             ✅
```

### 7-2. Cloudflare 계정 권한 이관 절차 (수동)

1. https://dash.cloudflare.com 로그인 (`tobiaskim@mutuus-lab.com`)
2. 도메인 선택 → **Manage Account > Members > Invite**
3. 후임자 이메일 입력, 역할은 **Administrator** 또는 **DNS** 최소 권한
4. 초대 메일 수락 후, 해당 도메인만 보이도록 Zone 권한 제한 (Account > Members > member > Zone access)
5. 비밀번호는 절대 공유하지 말 것 — 멤버 초대 방식이 감사 로그도 남아 안전함

### 7-3. 도메인 등록업체 (whoisdomain.kr) 이관 절차

1. https://whoisdomain.kr 로그인 (도메인 소유 계정)
2. **네임서버 변경** 권한이 필요하므로, 계정 자체를 인계하거나 공동 관리자 추가
3. 네임서버는 아래 값 유지 (Cloudflare):
   - `evelyn.ns.cloudflare.com`
   - `julian.ns.cloudflare.com`
4. 등록업체 계정 이관 시 **2차 인증(OTP) 기기 이전**까지 함께 처리해야 잠기지 않음

---

## 8. 디자인 시스템

### 컬러 토큰 (Tailwind config)
- `primary-container`: `#1a73e8` (블루)
- `secondary`: `#006a61` (틸)
- `kinetic-gradient`: `linear-gradient(135deg, #1A73E8, #006a61)` (CTA 버튼)
- 헤드라인 폰트: **Inter** (영문) + **Noto Sans KR/JP/SC**
- 본문 폰트: **Manrope**
- 라벨 폰트: **Space Grotesk**

### 반응형 브레이크포인트
- `sm`: 640px / `md`: 768px / `lg`: 1024px
- 모바일 최적화 미디어 쿼리: `@media (max-width: 479px/639px/767px)`

---

## 9. 주의사항 및 팁

- 단일 파일 구조라 CSS/JS 모두 `index.html` 안에 있음
- **빌드 도구 없음** — Tailwind CDN 사용 (수정 즉시 반영)
- 모든 변경은 `git push origin main`으로 자동 배포
- 이미지 텍스트 수정이 필요한 경우 Python + Pillow 스크립트로 처리한 이력 있음 (`fix_images.py` 패턴)
- HTML 검증 시 `<script>`, `<style>`, `<head>`, `<body>` 태그가 제대로 닫혔는지 확인
- 라인 번호로 코드를 찾을 때는 `Grep`/`Search` 도구로 식별자 검색 권장 (라인은 변동됨)

---

## 10. 개선 진행 중/예정 사항

- [x] 모바일 반응형 최적화
- [x] 이메일 폼 (데모 신청 + 푸터 문의) 작동
- [x] 다국어 4개 (KO/EN/ZH/JA)
- [x] 동적 효과 (스크롤 카운터, 채팅 애니메이션, 히어로 슬라이드쇼)
- [x] 비즈니스 이메일만 허용 (Gmail/Naver 등 차단)
- [ ] FormSubmit.co 활성화 — `tobiaskim@mutuus-lab.com`이 첫 신청 메일에서 Confirm 클릭 필요
- [ ] "독일 개발" 강조 문구 — KO/EN만 적용됨, ZH/JA 추가 필요
- [x] DNS 전파 완료 확인 — 2026-10-20 기준 NS·A 레코드 정상 응답
- [x] GitHub `ditmergus` Write 초대 발송
- [ ] GitHub `ditmergus` 초대 **수락** 확인
- [ ] Cloudflare 계정 멤버 초대 / whoisdomain.kr 계정 이관

---

## 11. 문제 발생 시 트러블슈팅

| 문제 | 원인 | 해결 |
|------|------|------|
| 폼 메일이 안 옴 | FormSubmit.co 활성화 미완료 | `tobiaskim@mutuus-lab.com` 받은편지함/스팸함의 Activate 메일 클릭 |
| 사이트 접속 안 됨 (DNS) | 네임서버 미반영 | Cloudflare 대시보드에서 Zone 상태 `active` 확인 |
| HTTPS 인증서 오류 | Cloudflare Proxy 활성 | A 레코드 Proxy를 **DNS only** (회색)로 변경 |
| GitHub Pages 빌드 실패 | CNAME 충돌 | Settings > Pages에서 도메인 재등록 |
| 다국어 키 누락 | 4개 언어 중 하나에 키 없음 | i18n 객체 4곳 모두 동일한 키가 있는지 확인 |

---

## 12. 연락처 (작업 인계 시점 기준)

- **현재 운영자**: tobiaskim@mutuus-lab.com
- **공동 수신자**: srlee711@mutuus-lab.com
