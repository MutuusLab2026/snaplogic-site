# VegaFencer 홈페이지 인수인계 가이드

## 1. 프로젝트 개요

| 항목 | 정보 |
|------|------|
| **사이트 도메인** | `roiscompany.com` (DNS 전파 완료, 2026-10-20 확인) |
| **임시 URL** | https://MutuusLab2026.github.io/snaplogic-site/ |
| **기술 스택** | 단일 `index.html` + Tailwind CSS CDN (빌드 도구 없음) |
| **호스팅** | GitHub Pages |
| **저장소** | https://github.com/MutuusLab2026/snaplogic-site (**2026-10-20 조직으로 이관 완료**) |
| **파일 수** | 1개 HTML, 17개 이미지 (`images/`) |

---

## 2. 인계 시 필요한 접근 권한

### 필수

| 항목 | 위치 | 용도 |
|------|------|------|
| **GitHub 저장소** | https://github.com/MutuusLab2026/snaplogic-site | 코드 수정 및 배포 |
| **GitHub 계정** | `MutuusLab2026` **조직** 저장소에 collaborator(**admin**)로 초대 | 푸시·배포 + 저장소 설정 |
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
| **GitHub 저장소 권한** | ✅ **Admin** 초대 발송 (수락 대기) | `ditmergus` (**= `leesh000404@gmail.com`**) 에 **Admin** 권한 초대 — 2026-10-20 조직 이관 후 write → admin 상향. 수락 전이라 협업자 목록에는 아직 미포함 |
| **DNS (Cloudflare)** | ⏳ 초대 대상 확정, 발송 대기 | `leesh000404@gmail.com` — **`roiscompany.com` 존 한정 `Domain DNS`** 으로만 초대. **계정 전역 역할 부여 금지** (§7-2) |
| **도메인 등록업체 (whoisdomain.kr)** | ⏳ 미완료 | 네임서버 변경 권한 이관 필요 |

> 📦 **2026-10-20 저장소 이관 완료**: `mutuuslab/snaplogic-site`(개인 계정) → `MutuusLab2026/snaplogic-site`(**조직**)
> **이유**: 개인 계정 소유 저장소는 협업자 최대 권한이 **Write**라서 Admin 부여가 원천 차단됩니다
> (`422 Validation Failed: You can only give write access to user-owned repositories`). 조직 소유로 옮겨야 Admin 역할이 생깁니다.
> **이관 후 검증**: Pages `built` 유지 / 커스텀 도메인 `roiscompany.com` HTTP 200 정상 / 임시 URL만 `MutuusLab2026.github.io/snaplogic-site`로 변경
> **저장소 이전은 웹 UI 전용**입니다 (GraphQL에 `transferRepository` mutation 없음) — 추후 재이전 시 참고

> ⚠️ `MutuusLab2026`은 **조직(Organization)**, `mutuuslab`은 **개인 계정**입니다. 조직 저장소에서만 `admin`/`maintain` 역할이 존재합니다.
> 초대 수락 위치: 초대 메일 → 또는 https://github.com/MutuusLab2026/snaplogic-site/invitations
> 권한 상향 명령: `gh api -X PATCH repos/MutuusLab2026/snaplogic-site/invitations/338547131 -f permissions=admin`

---

## 3. 인계 방법 (3가지 옵션)

### 옵션 A: GitHub Collaborator 추가 (✅ 완료)
1. https://github.com/MutuusLab2026/snaplogic-site/settings/access
2. **Add people** 클릭 → GitHub **ID** 입력 (이메일 아님)
   - `leesh000404@gmail.com`의 GitHub 계정은 **`ditmergus`**
   - 확인 명령: `gh api users/ditmergus --jq .email` → `leesh000404@gmail.com`
3. 권한: **Admin** (조직 저장소라 admin 가능. 개인 계정 저장소였으면 write가 상한)
4. 후임자: `git clone https://github.com/MutuusLab2026/snaplogic-site.git`

> ✅ 2026-10-20 기준 `ditmergus`에 **Admin 초대 발송 완료** (invitation id `338547131`, `expired: false`) — **수락만 남았습니다.**
> 수락 전에는 권한이 실제로 생기지 않습니다. 수락 후 `Settings > Collaborators` 에 표시됩니다.
> 초대 메일을 못 받았다면: Members/Invitations 화면에서 재발송하거나, 초대를 취소 후 `PUT /collaborators/ditmergus` 로 다시 생성.

### 옵션 B: 저장소 소유권 이전 (2026-10-20 실행 완료)
- Settings > General > Danger Zone > **Transfer ownership** → `MutuusLab2026`
- API(GraphQL)로는 불가 — 웹 UI 전용. 조직 owner 권한이면 상대 수락 없이 즉시 이전됨

### 옵션 C: Fork 또는 Mirror
- 후임자가 직접 fork 후 신규 저장소로 작업 (DNS만 새 저장소로 변경)

---

## 4. 로컬 개발 환경

### 클론
```bash
git clone https://github.com/MutuusLab2026/snaplogic-site.git
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

> 📌 **등록 요청된 초대 대상: `leesh000404@gmail.com`** (2026-10-20 요청)
> 저장소에는 Cloudflare API 토큰이 없어 **대시보드에서 직접** 진행해야 합니다.

> 🔒 **접근 범위 요구사항 (2026-10-20)**: **`roiscompany.com` 존 하나에만** 접근. 그 외 존·계정 설정·결제·멤버 관리는 **불가**여야 함.
> 반드시 **Zone-scoped policy**로 부여하세요. **Account 범위 `Administrator` / `DNS` 역할을 주면 이 요구사항 위반**입니다.
>
> | 초대 대상이 보게 될 것 | 보지 못하게 될 것 |
> |---|---|
> | 계정 이름, `roiscompany.com` 존 1개, DNS 레코드 | 다른 존, 계정 설정, 결제, 멤버 초대, API 토큰 발급 |
>
> 이 저장소(roiscompany.com)와 무관한 다른 사이트/도메인은 계정에 없더라도 **원칙적으로 zone 스코프**를 사용합니다.

**사전 조건**

- 초대하려면 초대자 계정이 **Super Administrator** 역할이고, **이메일 인증(verified email)** 이 완료되어 있어야 합니다.
  (`tobiaskim@mutuus-lab.com` 계정으로 확인)
- 프로필 아이콘 → **Manage Account** 메뉴가 보이지 않으면 Super Administrator 권한이 없는 것입니다.

**초대 절차**

1. https://dash.cloudflare.com/?to=/:account/members 접속 (`tobiaskim@mutuus-lab.com` 로그인)
   - 계정이 여러 개면 좌측 상단에서 **roiscompany.com이 속한 계정**을 먼저 선택
2. **Invite members** 클릭
3. **Add email addresses** 에 `leesh000404@gmail.com` 입력 (여러 명은 쉼표로 구분)
4. **Add permission policies** 에서 권한 설계 → 아래 표 참고
5. **Invite members** 클릭 → Members 목록에 **Pending** 상태로 표시
6. 초대 대상이 메일의 수락 링크를 클릭하면 **Active** 로 전환 (필요 시 `...` > **Resend invite**)

**권한(정책) 설계 — 최소 권한 원칙**

| 목적 | Scope | Role | 비고 |
|------|-------|------|------|
| DNS 레코드만 수정 (권장) | **Specific zone** → `roiscompany.com` | `Domain DNS` | A/CNAME/NS 변경만 가능. 계정 설정·멤버 관리 불가 |
| 계정 전체 DNS 관리 | Account | `DNS` | 모든 도메인 대상 — 도메인이 1개뿐이면 실익 없음 |
| 도메인 설정까지 위임 | **Specific zone** → `roiscompany.com` | `Domain Administrator` | SSL/TLS·캐시·Rules까지. DNS 외 설정 변경 필요 시 |
| 완전 이관(소유권 이양) | Account | `Super Administrator` | 최후 수단. 멤버 관리·결제·토큰 발급까지 가능 |

- 정책은 여러 개 추가 가능합니다. 예: `Domain DNS`(존 범위) + `Analytics`(계정 범위, 조회용)
- 최소 권한으로 시작하고, 필요해지면 **View & Edit permission policies** 에서 승격하는 편이 안전합니다
- **비밀번호·API 키는 절대 공유하지 말 것** — 멤버 초대 방식은 감사 로그(Audit Logs)도 남습니다

**초대 후 확인 체크리스트**

- [ ] Members 목록에 `leesh000404@gmail.com` **Pending** 표시 확인
- [ ] 초대 메일 수락 후 **Active** 전환 확인
- [ ] 해당 계정으로 로그인해 **roiscompany.com 존이 보이는지** 확인 (안 보이면 정책 Scope 누락)
- [ ] `Domain DNS`만 부여한 경우, DNS 외 메뉴가 잠겨 있는지 확인
- [ ] DNS 레코드가 여전히 정상인지 확인 — A 레코드 4개 + **DNS only(회색 구름)** 유지

**API로 초대하려면 (선택 — zone 스코프)**

`roles` 방식은 **계정 전역** 권한이므로 이 요구사항에 쓰면 안 됩니다. 존 한정은 **`policies` + `resource_groups`** 로 지정합니다.

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/members" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "email": "leesh000404@gmail.com",
    "status": "pending",
    "policies": [{
      "access": "allow",
      "permission_groups": [{ "id": "<DNS permission group id>" }],
      "resource_groups": [{ "id": "<roiscompany.com zone resource group id>" }]
    }]
  }'
```

| 준비물 | 얻는 방법 |
|---|---|
| `$ACCOUNT_ID` | 대시보드 URL `dash.cloudflare.com/<32자리>` (Zone ID `0e70e42f353398607218374e53eced87`와 다름) |
| `$CF_API_TOKEN` | My Profile > API Tokens > Create Token — 필요한 권한: **`Account Settings Write`** (문서상 accepted permission: `SCIM Provisioning` 또는 `Account Settings Write`) |
| DNS permission group id | `GET /accounts/{id}/tokens/permission_groups` → 이름에 `DNS` 포함된 항목 |
| zone resource group id | 기존 멤버 조회(`GET /accounts/{id}/members`)의 `policies[].resource_groups[].scope.objects[].key` 에서 `com.cloudflare.api.account.zone.<ZONE_ID>` 형태로 확인 |

- API 초대도 동일하게 **메일 발송 → 수락** 절차를 거칩니다 (`status: "pending"`)
- 토큰을 채팅에 붙여넣지 말고 환경변수(`$env:CF_API_TOKEN`)로만 다루세요
- 스키마 출처: [Add Member API](https://developers.cloudflare.com/api/resources/accounts/subresources/members/methods/create/) · [Member roles](https://developers.cloudflare.com/fundamentals/manage-members/roles/)

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
- [x] 저장소를 조직 `MutuusLab2026`으로 이관 — Pages·도메인 정상 유지 확인 (2026-10-20)
- [x] GitHub `ditmergus` **Admin** 초대 발송 (조직 이관 후 상향, 2026-10-20)
- [ ] GitHub `ditmergus` 초대 **수락** 확인 — 수락 전에는 권한 없음
- [ ] Cloudflare 멤버 초대 — `leesh000404@gmail.com` / **`roiscompany.com` 존 한정 `Domain DNS`** (계정 전역 금지, §7-2)
- [ ] Cloudflare 초대 수락 확인 (Members 목록 **Active** 전환)
- [ ] whoisdomain.kr 계정 이관 (네임서버 변경 권한, §7-3)

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
