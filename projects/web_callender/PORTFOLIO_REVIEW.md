# 포트폴리오 웹 프로젝트 — 시니어 프론트엔드 리뷰 보고서

> 작성자: Portfolio Project Manager Agent  
> 검토 일자: 2026-05-21  
> 프로젝트 경로: `C:\Users\User\Desktop\서재현\web_callender`

---

## 목차

1. [현황 요약](#1-현황-요약)
2. [UI/UX 품질 평가](#2-uiux-품질-평가)
3. [코드 품질 평가](#3-코드-품질-평가)
4. [성능 고려사항](#4-성능-고려사항)
5. [접근성 이슈](#5-접근성-이슈)
6. [훌륭한-포트폴리오를-위해-부족한-요소들](#6-훌륭한-포트폴리오를-위해-부족한-요소들)
7. [우선순위별 개선 권고사항](#7-우선순위별-개선-권고사항)
8. [서브 에이전트 로드맵](#8-서브-에이전트-로드맵)
9. [이번 세션에서 직접 적용한 개선사항](#9-이번-세션에서-직접-적용한-개선사항)

---

## 1. 현황 요약

### 프로젝트 구성

| 파일 | 역할 |
|------|------|
| `index.html` | 2026년 5월 고정 이모지 캘린더 마크업 (464줄) |
| `style.css` | 캘린더 전용 스타일시트 (159줄) |

### 현재 작동하는 것

- 7×5 CSS Grid 기반 월 달력 레이아웃이 올바르게 구현되어 있음
- 각 날짜 셀에 고유한 SVG 이모지가 배치되어 있음 (외부 라이브러리 없이 인라인 SVG 활용)
- 호버 시 카드 부상(translateY) + 이모지 확대(scale) 애니메이션이 부드럽게 동작함
- 5월 18일에 `.today` 클래스를 통한 초록색 하이라이트 적용
- 일요일(빨강)/토요일(파랑) 요일 색상 구분
- `box-shadow`와 `border-radius`를 활용한 카드형 UI

### 프로젝트 성격 파악

현재 결과물은 **포트폴리오라기보다 단일 UI 컴포넌트 데모**에 가깝습니다. 이모지 캘린더 자체는 완성도 있는 소품이지만, 이것을 포트폴리오로 발전시키려면 아래에 기술한 다층적 개선이 필요합니다.

---

## 2. UI/UX 품질 평가

### 잘 된 점

- **디자인 일관성**: Slate 계열(`#0f172a`, `#f1f5f9`, `#64748b`) 색상 시스템을 일관되게 사용하고 있어 전체적인 톤이 조화롭습니다.
- **마이크로 인터랙션**: 호버 시 `translateY(-2px)` + `scale(1.15)` 조합이 경쾌하게 느껴집니다. cubic-bezier 값도 적절합니다.
- **시각적 계층**: `aspect-ratio: 1/1.15`로 날짜 카드의 높이 비율을 일정하게 유지한 점은 그리드 안정감에 기여합니다.
- **Today 강조**: 초록 테두리 + 배경 + 숫자 배지 조합으로 오늘 날짜를 즉시 인지할 수 있습니다.

### 개선이 필요한 점

#### 2-1. 반응형 미지원 (치명적)

현재 `style.css`에 미디어 쿼리가 전혀 없습니다. 모바일(375px 기준)에서 7열 그리드가 그대로 렌더링되면 날짜 카드가 40px 미만으로 압축되어 이모지가 사실상 보이지 않게 됩니다.

#### 2-2. Pretendard 폰트 미로드

CSS에 `font-family: "Pretendard"` 가 선언되어 있지만 `<head>`에 웹폰트 import가 없습니다. 폰트가 없으면 `-apple-system` 폴백으로 렌더링되어 의도한 타이포그래피가 적용되지 않습니다.

#### 2-3. 오늘 날짜 하드코딩

`class="day today"` 가 5월 18일에 고정되어 있습니다. 다른 날 열면 오늘 표시가 틀립니다. 포트폴리오에서 날짜 계산도 못 한다는 인상을 줄 수 있습니다.

#### 2-4. 빈 칸 처리 불완전

5월 1일이 금요일이므로 앞에 5칸 빈 칸이 필요합니다. 그런데 HTML에는 빈 `<div class="day empty"></div>` 5개가 하드코딩되어 있습니다. 실제 2026년 5월 1일은 **금요일**이 맞으므로 달력 날짜 배치 자체는 정확합니다. 그러나 이 역시 하드코딩이라 유지보수에 취약합니다.

#### 2-5. 이모지 의미/맥락 부재

날짜별 이모지가 어떤 의미인지 알 수 없습니다. 특별한 날(어린이날, 스승의날 등)과 이모지를 연결한다면 훨씬 의미 있는 UI가 됩니다. 현재는 이모지 선택 기준이 불분명합니다.

#### 2-6. 다크모드 미지원

`prefers-color-scheme: dark` 에 대응하는 스타일이 없습니다.

---

## 3. 코드 품질 평가

### 잘 된 점

- CSS 커스텀 프로퍼티(변수)를 쓰지 않았음에도 색상값을 Slate 팔레트로 통일한 점은 일관성 측면에서 긍정적입니다.
- `transition` 에 `transform`과 `box-shadow`만 지정해 GPU 합성 레이어를 유도한 점이 성능에 유리합니다.
- `box-sizing: border-box` 전역 적용, 기본 마진/패딩 리셋이 올바르게 처리되어 있습니다.
- 의미 있는 한국어 주석이 적절하게 달려 있어 가독성이 좋습니다.

### 개선이 필요한 점

#### 3-1. CSS 커스텀 프로퍼티(변수) 미사용

색상 값(`#10b981`, `#f1f5f9` 등)이 CSS 전체에 흩어져 있습니다. 테마 변경이나 색상 수정 시 한 곳에서 제어할 수 없습니다.

```css
/* 권장 패턴 */
:root {
  --color-primary: #10b981;
  --color-bg: #f1f5f9;
  --color-surface: #ffffff;
  --color-text-primary: #0f172a;
  --color-text-muted: #94a3b8;
  --color-border: #e2e8f0;
  --radius-card: 12px;
}
```

#### 3-2. JavaScript 없음 — 동적 기능 전무

- 오늘 날짜 자동 계산 없음
- 날짜 클릭 이벤트 없음
- 월 이동(이전 달/다음 달) 없음
- 이 모든 기능이 없으면 "정적 이미지"와 구분되지 않습니다

#### 3-3. HTML 시맨틱 부재

캘린더 구조에 `<table>` 또는 `role="grid"` 시맨틱이 없습니다. 현재 `<div>` 중첩만으로는 보조 기술이 이것을 달력으로 인식하지 못합니다.

#### 3-4. `!important` 사용

`.day.today .num { color: #ffffff !important; }` — 명시도(specificity) 충돌을 `!important`로 해결하는 것은 유지보수를 어렵게 만드는 안티패턴입니다. `.calendar-days .day.today .num` 처럼 선택자 명시도를 높이는 방식으로 대체해야 합니다.

#### 3-5. 인라인 SVG 과다

464줄 HTML 중 대부분이 SVG 마크업입니다. SVG를 별도 파일로 분리하거나 `<symbol>` + `<use>` 패턴을 사용하면 HTML이 훨씬 간결해집니다.

#### 3-6. 빈 태그 5개 반복

```html
<div class="day empty"></div>
<div class="day empty"></div>
<!-- ... 5번 반복 -->
```
JavaScript나 CSS `grid-column-start`를 활용하면 제거할 수 있습니다.

---

## 4. 성능 고려사항

### 현재 성능 상황

| 항목 | 현황 | 평가 |
|------|------|------|
| 외부 HTTP 요청 | 0개 (폰트 제외) | 우수 |
| JavaScript 번들 | 없음 | N/A |
| 이미지 파일 | 없음 (SVG 인라인) | 우수 |
| CSS 파일 크기 | ~5KB | 우수 |
| HTML 파일 크기 | ~15KB | 양호 |
| 렌더블로킹 리소스 | CSS 1개 | 양호 |

### 잠재적 성능 이슈

#### 4-1. Pretendard 폰트 로드 전략

웹폰트를 CDN에서 로드할 경우 FOUT(Flash of Unstyled Text)가 발생할 수 있습니다. `font-display: swap`과 `<link rel="preconnect">` 를 함께 사용해야 합니다.

#### 4-2. CSS Grid 재계산

현재는 정적 그리드라 문제없지만, 동적으로 날짜를 생성할 경우 DOM 조작 최적화가 필요합니다.

#### 4-3. SVG 최적화

인라인 SVG들이 최적화 없이 작성되어 있습니다. SVGO(SVG Optimizer)를 통해 불필요한 속성 제거 및 path 단순화가 가능합니다.

---

## 5. 접근성 이슈

WCAG 2.1 기준으로 검토한 결과입니다.

### 심각 (Severity A/AA 위반)

| 항목 | 문제 | WCAG 기준 |
|------|------|-----------|
| 달력 시맨틱 없음 | `<div>` 사용 — 스크린리더가 날짜 그리드 구조를 인식 불가 | 1.3.1 Info and Relationships |
| 요일 헤더 시맨틱 없음 | `role="columnheader"` 없음 | 1.3.1 |
| 포커스 스타일 없음 | 키보드 사용자가 현재 위치를 알 수 없음 | 2.4.7 Focus Visible |
| 키보드 접근 불가 | 날짜 셀에 `tabindex`가 없어 키보드로 탐색 불가 | 2.1.1 Keyboard |
| SVG aria 레이블 없음 | 장식용 SVG에 `aria-hidden="true"` 없음 | 4.1.2 Name, Role, Value |
| `<meta name="description">` 없음 | 검색엔진 및 소셜 미리보기에 설명 없음 | — |

### 경고 (Best Practice)

- `lang="ko"` 는 올바르게 설정되어 있습니다 (양호).
- 색상 대비: 날짜 숫자(`#475569`) 대비 흰 배경(`#ffffff`) — 대비비 약 4.6:1로 AA 통과하나 AAA(7:1) 기준에는 미치지 못합니다.
- `<title>` 태그는 있으나 `<meta name="description">`이 없었습니다 (이번 세션에서 추가 완료).

---

## 6. 훌륭한 포트폴리오를 위해 부족한 요소들

포트폴리오로서 이 프로젝트가 갖춰야 할 요소와 현재 상태를 비교합니다.

### 6-1. 포트폴리오 필수 섹션 (현재 전혀 없음)

| 섹션 | 중요도 | 설명 |
|------|--------|------|
| About / 자기소개 | 필수 | 이름, 직무, 한 줄 소개 |
| Skills | 필수 | 기술 스택 시각화 |
| Projects | 필수 | 이 캘린더 포함 작업 목록 |
| Contact | 필수 | 이메일, GitHub, LinkedIn 링크 |
| Navigation | 필수 | 섹션 간 이동 |
| Hero Section | 권장 | 첫인상을 결정하는 인트로 |
| Experience / 경력 | 직무 지원 시 필수 | 회사/학교 이력 |
| Blog / 글 | 권장 | 기술 역량 심층 증명 |

### 6-2. 현재 캘린더 컴포넌트 자체의 미완성 기능

| 기능 | 현재 상태 | 필요 수준 |
|------|-----------|-----------|
| 월 이동 (이전/다음) | 없음 | 버튼 + JS 로직 |
| 날짜 클릭 이벤트 | 없음 | 메모/일정 추가 등 |
| 동적 날짜 생성 | 하드코딩 | JS로 자동 계산 |
| 공휴일 표시 | 없음 | 한국 공휴일 데이터 |
| 이모지 커스터마이징 | 없음 | 사용자가 이모지 선택 |
| 애니메이션 입장 효과 | 없음 | 카드 순차 페이드인 |
| 로컬스토리지 메모 | 없음 | 날짜별 메모 저장 |

### 6-3. SEO / 소셜 공유 인프라

- Open Graph 태그 부족 (`og:image`, `og:url` 없음)
- Twitter Card 없음
- `robots.txt` 없음
- `sitemap.xml` 없음
- `manifest.json` 없음 (PWA 미지원)
- Favicon 없음

### 6-4. 배포 및 CI/CD

- 현재 로컬 파일로만 존재
- GitHub Pages / Vercel / Netlify 배포 설정 없음
- `README.md` 없음 (프로젝트 설명 없음)

---

## 7. 우선순위별 개선 권고사항

### HIGH (즉시 처리 — 포트폴리오 기본 요건)

| # | 개선사항 | 예상 작업량 |
|---|----------|------------|
| H1 | 포트폴리오 전체 구조 설계: Hero + About + Projects + Contact 섹션 추가 | 대 (신규 개발) |
| H2 | 반응형 CSS 추가 (모바일 375px, 태블릿 768px 분기점) | 소 |
| H3 | JavaScript로 오늘 날짜 동적 계산 | 소 |
| H4 | Pretendard 웹폰트 정상 로드 설정 | 소 |
| H5 | 접근성 — 키보드 탐색, aria 레이블, 포커스 스타일 | 소-중 |
| H6 | `README.md` 및 기본 메타태그 완성 | 소 |

### MEDIUM (1-2주 이내 — 품질 향상)

| # | 개선사항 | 예상 작업량 |
|---|----------|------------|
| M1 | CSS 커스텀 프로퍼티(변수) 리팩토링 | 소 |
| M2 | 월 이동 기능 (이전/다음 버튼 + JS 동적 렌더링) | 중 |
| M3 | 날짜 클릭 인터랙션 (메모 팝업 or 이모지 선택) | 중 |
| M4 | 카드 순차 등장 애니메이션 (CSS animation + stagger) | 소 |
| M5 | 다크모드 지원 (`prefers-color-scheme`) | 소 |
| M6 | GitHub Pages 또는 Vercel 배포 설정 | 소 |
| M7 | `!important` 제거 및 선택자 명시도 정리 | 소 |

### LOW (중장기 — 차별화 요소)

| # | 개선사항 | 예상 작업량 |
|---|----------|------------|
| L1 | 한국 공휴일 API 연동 또는 하드코딩 데이터 | 중 |
| L2 | 이모지 테마 선택 기능 (봄/여름/가을/겨울) | 중 |
| L3 | 로컬스토리지 기반 날짜별 메모 기능 | 중 |
| L4 | PWA (manifest.json + Service Worker) | 중 |
| L5 | SVG `<symbol>` + `<use>` 패턴으로 HTML 정리 | 소 |
| L6 | Lighthouse CI 자동화 | 중 |
| L7 | 애니메이션 이스터에그 (31일 클릭 시 특별 효과 등) | 소 |

---

## 8. 서브 에이전트 로드맵

이 프로젝트를 훌륭한 포트폴리오로 발전시키기 위해 다음 서브 에이전트를 순차적으로 투입할 것을 권장합니다.

### Phase 1 — 동시 착수 (병렬 실행 가능)

```
AGENT: Design Agent
TASK: 포트폴리오 전체 페이지 디자인 시스템 수립
INPUTS: 현재 캘린더의 Slate 팔레트, 초록 포인트 컬러(#10b981)
OUTPUT FORMAT: CSS 커스텀 프로퍼티 토큰, 섹션별 와이어프레임 스펙
CONSTRAINTS: 기존 캘린더 디자인 언어 계승, 모바일 퍼스트
INTEGRATION POINT: Frontend Dev Agent에 디자인 토큰 전달

AGENT: Content Writer Agent
TASK: 포트폴리오 각 섹션 카피라이팅 (한국어/영어 병행)
INPUTS: 사용자 정보 (직무, 기술 스택, 프로젝트 목록)
OUTPUT FORMAT: 섹션별 텍스트 콘텐츠 (Hero 헤드라인, About 바이오, 프로젝트 설명)
CONSTRAINTS: 간결하고 임팩트 있는 문장, 기술 면접관 대상
INTEGRATION POINT: Frontend Dev Agent에 콘텐츠 전달
```

### Phase 2 — 개발 통합

```
AGENT: Frontend Dev Agent
TASK: 전체 포트폴리오 페이지 개발 (캘린더 컴포넌트 포함)
INPUTS: Design Agent 디자인 토큰, Content Writer 콘텐츠, 현재 캘린더 코드
OUTPUT FORMAT: 완성된 HTML/CSS/JS (Vanilla 또는 경량 프레임워크)
CONSTRAINTS: Vanilla JS 우선, 외부 라이브러리 최소화, IE 미지원
INTEGRATION POINT: SEO Agent, Performance Agent에 완성 코드 전달
```

### Phase 3 — 최적화 (병렬 실행 가능)

```
AGENT: SEO Agent
TASK: 메타태그, OG 태그, 구조화 데이터, sitemap 완성
INPUTS: 완성된 HTML
OUTPUT FORMAT: 수정된 <head> 섹션, sitemap.xml, robots.txt

AGENT: Performance Agent
TASK: Lighthouse 점수 90+ 달성
INPUTS: 완성된 HTML/CSS/JS
OUTPUT FORMAT: 최적화된 코드, 웹폰트 로드 전략, 캐시 헤더 설정

AGENT: Accessibility Agent
TASK: WCAG 2.1 AA 준수 검증 및 수정
INPUTS: 완성된 HTML
OUTPUT FORMAT: aria 보강, 색상 대비 수정, 키보드 플로우 개선
```

### Phase 4 — 배포

```
AGENT: Deployment Agent
TASK: GitHub Pages 또는 Vercel 배포 파이프라인 구축
INPUTS: 완성된 프로젝트 파일
OUTPUT FORMAT: 배포 설정 파일(vercel.json 또는 gh-pages workflow), 라이브 URL
CONSTRAINTS: 무료 티어, 커스텀 도메인 연결 가능한 플랫폼
```

---

## 9. 이번 세션에서 직접 적용한 개선사항

다음 항목들은 이미 파일에 반영되었습니다.

### index.html

- **메타태그 추가**: `<meta name="description">`, `<meta name="theme-color">`, Open Graph 태그 3개 추가
- **Pretendard 웹폰트 CDN 로드**: `<link rel="preconnect">` + jsdelivr CDN 연결 추가
- **main.js 연결**: `<script src="main.js">` 추가

### style.css

- **키보드 포커스 스타일**: `:focus-visible` 기반 초록 아웃라인 추가 (마우스 사용자에게는 표시 안 됨)
- **선택 상태 스타일**: `.day--selected` 추가
- **모바일 반응형**: 480px 이하 미디어 쿼리 추가 (폰트 크기, 패딩, 이모지 크기 조정)
- **태블릿 반응형**: 481~768px 미디어 쿼리 추가
- **다크모드 지원**: `@media (prefers-color-scheme: dark)` 완전한 다크 팔레트 추가

### main.js (신규 생성)

- **오늘 날짜 동적 하이라이트**: `new Date()`로 현재 날짜 계산 후 캘린더 헤더의 년/월과 비교하여 `.today` 클래스를 동적으로 부여 (하드코딩 의존 해소)
- **aria 접근성 보강**: 모든 날짜 셀에 `role="gridcell"`, `aria-label` 자동 부여
- **SVG 장식 처리**: `aria-hidden="true"` + `focusable="false"` 자동 적용
- **요일 헤더 시맨틱**: `role="columnheader"` + 전체 요일명 `aria-label` 추가
- **키보드 탐색**: 모든 날짜 셀에 `tabindex="0"` 추가, Enter/Space 키로 선택 토글

---

*이 보고서는 Portfolio Project Manager Agent가 코드 분석을 통해 자동 생성하였습니다.*  
*다음 단계: 사용자가 포트폴리오의 방향(기술 포트폴리오 / 크리에이티브 포트폴리오 / 취업용 등)을 확인해 주시면 Phase 1 서브 에이전트를 즉시 투입할 수 있습니다.*
