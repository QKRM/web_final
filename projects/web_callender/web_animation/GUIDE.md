# CSS 애니메이션 구현 원리 — 초급자 가이드

이 문서는 `index.html` / `style.css`에 있는 모든 애니메이션이 **어떻게 움직이는지** 하나하나 풀어서 설명합니다. CSS를 처음 배우는 사람도 따라올 수 있게 기초부터 갑니다.

---

## 0. 먼저 알아야 할 3가지 기초

### (1) `@keyframes` — 애니메이션 "대본"

`@keyframes`는 시간에 따라 스타일이 어떻게 바뀌는지 적는 **대본**입니다.

```css
@keyframes spin {
  0%   { transform: rotate(0deg); }    /* 시작 */
  100% { transform: rotate(360deg); }  /* 끝 */
}
```

- `0%` = 애니메이션 시작 시점
- `100%` = 끝나는 시점
- `50%` 처럼 중간 지점도 자유롭게 추가 가능

### (2) `animation` 속성 — 대본을 "재생"

대본만 적으면 아무 일도 안 일어납니다. 요소에 붙여야 재생됩니다.

```css
.box {
  animation: spin 2s linear infinite;
}
```

읽는 법: **`spin`이라는 대본을 `2초` 동안 `일정한 속도(linear)`로 `무한(infinite)` 반복**

| 값 | 의미 |
|----|------|
| `spin` | 재생할 `@keyframes` 이름 |
| `2s` | 한 번 도는 데 걸리는 시간 |
| `linear` | 속도 곡선 (등속) |
| `infinite` | 반복 횟수 (무한) |

자주 보는 속도 곡선:
- `linear` : 처음부터 끝까지 같은 속도 (회전에 적합)
- `ease` : 천천히 → 빠르게 → 천천히 (자연스러움)
- `ease-in-out` : 부드러운 시작과 끝

### (3) `transform` — 위치/크기/회전을 "성능 좋게" 바꾸기

움직임은 거의 다 `transform`으로 만듭니다. 화면을 다시 계산하지 않아 부드럽습니다.

```css
transform: translateY(-20px);  /* 위로 20px 이동 */
transform: scale(1.2);         /* 1.2배 확대 */
transform: rotate(45deg);      /* 45도 회전 */
```

> 이 3가지만 이해하면 이 프로젝트의 90%가 풀립니다.

---

## 1. 로더

### Ring (회전 링)

```css
.loader-ring {
  border: 6px solid #2a3346;       /* 4면 다 회색 */
  border-top-color: #38e8ff;       /* 윗변만 하늘색 */
  border-radius: 50%;              /* 원으로 */
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

**원리**
- 테두리 4면 중 **한 변만 다른 색** → 원에서 한 부분만 색이 있는 모양
- 그걸 `rotate(360deg)`로 계속 돌리면 → 우리가 아는 로딩 스피너
- `linear` 필수 (회전은 등속이어야 자연스러움)

### Dots (통통 튀는 점)

```css
.loader-dots span {
  animation: bounce 1.2s ease-in-out infinite;
}
.loader-dots span:nth-child(2) { animation-delay: 0.2s; }  /* 0.2초 늦게 */
.loader-dots span:nth-child(3) { animation-delay: 0.4s; }  /* 0.4초 늦게 */

@keyframes bounce {
  0%, 100% { transform: translateY(0);    opacity: 0.5; }
  50%      { transform: translateY(-18px); opacity: 1; }
}
```

**핵심 = `animation-delay` (시차)**
- 세 점이 **같은 대본**을 쓰지만 시작 시간을 0.2초씩 늦춤
- → 첫째가 튀고 → 둘째가 튀고 → 셋째가 튀는 **파도 효과**
- `nth-child(2)` = "2번째 자식 요소"를 콕 집어 선택하는 문법

### Bars (늘었다 줄었다)

```css
.loader-bars span {
  animation: stretch 1s ease-in-out infinite;
}
.loader-bars span:nth-child(2) { animation-delay: 0.1s; }
/* ... 3,4,5번도 0.1초씩 더 늦게 */

@keyframes stretch {
  0%, 100% { transform: scaleY(0.3); }  /* 세로로 납작 */
  50%      { transform: scaleY(1); }    /* 세로로 꽉 */
}
```

- `scaleY` = **세로 방향만** 늘리고 줄임
- Dots와 똑같이 `animation-delay`로 시차를 줘서 음악 이퀄라이저처럼 보임

### Cube (사각형 4개 깜빡)

```css
.loader-cube {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 2x2 격자 */
  gap: 4px;
}
.loader-cube span:nth-child(2) { animation-delay: 0.2s; }
.loader-cube span:nth-child(3) { animation-delay: 0.6s; }
.loader-cube span:nth-child(4) { animation-delay: 0.4s; }

@keyframes cubeScale {
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%      { transform: scale(0.4); opacity: 0.4; }
}
```

- `grid` 2열로 정사각형 4개를 2x2 배치
- 딜레이 순서를 `2 → 4 → 3` (시계방향)으로 줘서 **돌아가는 듯한 착시**

> **로더 3총사의 공통 원리**: 대본 1개 + 자식마다 `animation-delay` 차이 = 순차 동작. 이 패턴 하나로 수십 가지 로더를 만들 수 있습니다.

---

## 2. 호버 버튼

마우스를 올렸을 때(`:hover`)만 반응합니다. 여기서 핵심은 **`transition`**입니다.

> `transition`과 `animation`의 차이
> - `animation` : 알아서 계속 반복 (대본 필요)
> - `transition` : **상태가 바뀔 때** A → B로 부드럽게 (hover 같은 트리거 필요)

### Fill (왼쪽에서 색 채우기)

```css
.btn-fill::before {
  content: "";
  position: absolute;
  inset: 0;                      /* 버튼 전체를 덮음 */
  z-index: -1;                   /* 글자 뒤로 */
  background: linear-gradient(90deg, #ff5ca0, #9b5cff);
  transform: scaleX(0);          /* 가로 0배 = 안 보임 */
  transform-origin: left;        /* 늘어나는 기준점 = 왼쪽 */
  transition: transform 0.4s ease;
}
.btn-fill:hover::before { transform: scaleX(1); }  /* 가로 1배 = 꽉 */
```

**원리**
- `::before` = 버튼 안에 **가짜 요소**를 하나 만들어 색 레이어로 사용
- 평소엔 `scaleX(0)` (가로 폭 0 → 안 보임)
- hover 하면 `scaleX(1)`로 변하고, `transition` 덕분에 **0.4초에 걸쳐 부드럽게 펼쳐짐**
- `transform-origin: left` → 왼쪽을 기준으로 늘어나서 "왼쪽에서 채워지는" 느낌

### Shine (빛이 스쳐 지나가기)

```css
.btn-shine::after {
  content: "";
  position: absolute;
  left: -120%;                   /* 처음엔 버튼 왼쪽 밖에 숨어 있음 */
  width: 60%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent);
  transition: left 0.6s ease;
}
.btn-shine:hover::after { left: 130%; }  /* 오른쪽 밖으로 지나감 */
```

- 반투명 흰색 띠를 버튼 **밖 왼쪽(-120%)**에 숨겨둠
- hover 시 `left`를 오른쪽 밖(130%)으로 → 빛줄기가 버튼을 가로지름
- 양 끝이 `transparent`라 반짝이는 빛처럼 보임

### Grow (커지면서 살짝 기울기)

```css
.btn-grow { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.btn-grow:hover {
  transform: scale(1.12) rotate(-2deg);          /* 1.12배 + -2도 */
  box-shadow: 0 8px 20px rgba(155,92,255,0.5);   /* 그림자로 떠 보임 */
}
```

가장 단순하지만 효과적. `scale`로 키우고 `rotate`로 장난스럽게 기울임. 그림자를 키워 "떠오르는" 입체감 추가.

### Border Run (테두리에 색이 도는)

```css
.btn-border::before {
  content: "";
  inset: 0;
  padding: 2px;
  background: linear-gradient(90deg, #ff5ca0, #38e8ff, #ffd166, #ff5ca0);
  background-size: 300% 100%;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;       /* 안쪽을 도려냄 → 테두리만 남음 */
  mask-composite: exclude;
  animation: gradientMove 4s linear infinite;
}
```

조금 어렵지만 원리는:
1. 그라데이션으로 꽉 찬 사각형을 만든다
2. `mask`로 **가운데를 도려내서 2px 테두리만** 남긴다
3. 그 그라데이션을 `gradientMove`로 흐르게 한다 → 테두리에 색이 도는 효과

> 입문 단계에선 "테두리 색 흐르기는 mask로 가운데를 비운다" 정도만 알아도 충분합니다.

---

## 3. 변형 도형

### Blob (몽글몽글 모양 변화)

```css
@keyframes morph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0); }
  50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: rotate(180deg); }
}
```

**핵심 = `border-radius`에 값 8개 넣기**
- 보통 `border-radius: 50%` 하나만 쓰지만, 모서리마다 다른 값을 주면 **찌그러진 유기적 모양**이 됩니다
- 그 값을 애니메이션으로 바꾸면 → 액체처럼 흐물거리는 "블롭"
- 동시에 `rotate(180deg)`까지 더해 더 살아있는 느낌

### 3D Cube (입체 회전)

```css
@keyframes rotate3d {
  0%   { transform: rotateX(0) rotateY(0); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}
```

- `rotateX` = 가로축(앞으로 넘어가듯) 회전
- `rotateY` = 세로축(좌우로 도는) 회전
- 두 축을 동시에 돌려서 입체적으로 구르는 느낌. 평면 사각형이지만 3D처럼 보임

### Heartbeat (심장 박동)

```css
.pulse-heart { transform: rotate(-45deg); }    /* 사각형을 45도 기울임 */
.pulse-heart::before { top: -25px; left: 0; }  /* 위쪽 원 */
.pulse-heart::after  { top: 0; left: 25px; }   /* 오른쪽 원 */

@keyframes heartbeat {
  0%, 100% { transform: rotate(-45deg) scale(1); }
  25%      { transform: rotate(-45deg) scale(1.2); }  /* 두근 */
  40%      { transform: rotate(-45deg) scale(1); }    /* 멈칫 */
}
```

**하트 만드는 법 (도형 합치기)**
- 사각형 1개 + 원 2개(`::before`, `::after`)를 겹쳐 하트 모양 완성
- `scale`을 `1 → 1.2 → 1`로 빠르게 바꾸면 "두근" 하는 박동
- 회전 상태를 유지해야 하므로 **모든 시점에 `rotate(-45deg)`를 같이 적는다** (안 적으면 회전이 풀림 → 중요 포인트!)

### Color Spin (회전 + 색 변화)

```css
.spin-square {
  animation: spin 3s linear infinite, colorShift 4s ease-in-out infinite;
}
@keyframes colorShift {
  0%   { background: #ff5ca0; }
  33%  { background: #38e8ff; }
  66%  { background: #ffd166; }
  100% { background: #ff5ca0; }
}
```

**애니메이션 2개 동시 적용**
- 쉼표로 구분하면 여러 대본을 한 번에 재생 가능
- `spin`(3초)은 회전, `colorShift`(4초)는 색 변화 → **시간이 달라서** 둘이 어긋나며 계속 새로운 조합이 나옴

---

## 4. 텍스트 효과

### Gradient Flow

```css
.text-gradient {
  background: linear-gradient(90deg, #ff5ca0, #ffd166, #38e8ff, #9b5cff, #ff5ca0);
  background-size: 300% 100%;          /* 그라데이션을 화면보다 3배 크게 */
  -webkit-background-clip: text;       /* 글자 모양으로 잘라내기 */
  background-clip: text;
  color: transparent;                  /* 글자 자체는 투명 → 배경이 비침 */
  animation: gradientMove 5s linear infinite;
}
@keyframes gradientMove {
  to { background-position: 300% 0; }  /* 배경을 옆으로 밀기 */
}
```

**원리 (글자에 색 흐르게 하는 정석)**
1. 글자에 무지개 그라데이션 배경을 깐다
2. `background-clip: text` + `color: transparent` → **글자 모양대로만 배경이 보이고** 나머지는 사라짐
3. `background-size: 300%`로 배경을 크게 만든 뒤 `background-position`을 애니메이션으로 옮기면 → 색이 흐르는 것처럼 보임

> `from` 없이 `to`만 적으면, "현재 상태 → to"까지 자동으로 채워줍니다.

### Wave (글자가 파도치기)

```css
.text-wave span {
  display: inline-block;   /* 중요! 글자마다 움직이게 하려면 필수 */
  animation: waveLetter 1.4s ease-in-out infinite;
}
.text-wave span:nth-child(2) { animation-delay: 0.1s; }
/* ... 글자마다 0.1초씩 딜레이 */

@keyframes waveLetter {
  0%, 100% { transform: translateY(0);    color: #38e8ff; }
  50%      { transform: translateY(-20px); color: #ff5ca0; }
}
```

**원리**
- 글자 하나하나를 `<span>`으로 감싼다
- `display: inline-block`을 줘야 `transform`(이동)이 먹습니다 — 일반 텍스트(inline)는 이동 안 됨 **(초보자가 자주 막히는 부분!)**
- 글자마다 `animation-delay`를 0.1초씩 → 파도가 글자를 타고 흐름
- 이동과 색 변화를 동시에

### Typing (타이핑 + 커서 깜빡임)

```css
.text-typing {
  border-right: 3px solid #3ddc97;  /* 오른쪽 선 = 커서 */
  white-space: nowrap;              /* 줄바꿈 금지 */
  overflow: hidden;                 /* 넘치는 글자 숨김 */
  width: 0;
  animation: typing 4s steps(14) infinite,
             caret 0.7s step-end infinite;
}
@keyframes typing {
  0% { width: 0; } 60% { width: 14ch; } 90% { width: 14ch; } 100% { width: 0; }
}
@keyframes caret { 50% { border-color: transparent; } }
```

**원리 (타자기 효과의 정석)**
- 글자를 다 써놓고 `width`로 보이는 **너비만 조절** → 너비가 늘면 글자가 하나씩 드러남
- `overflow: hidden` 덕에 너비 밖 글자는 숨겨짐
- **`steps(14)`** = 부드럽게가 아니라 **14칸씩 뚝뚝 끊어서** → 글자가 한 자씩 찍히는 느낌
- `14ch` = 글자 14개 너비 (ch = 글자 폭 단위)
- `border-right`(커서)를 `caret` 대본으로 깜빡임

### Neon (네온사인)

```css
@keyframes neon {
  from { text-shadow: 0 0 6px #38e8ff, 0 0 12px #38e8ff, 0 0 24px #9b5cff; }
  to   { text-shadow: 0 0 12px #ff5ca0, 0 0 28px #ff5ca0, 0 0 48px #9b5cff; }
}
.text-glow { animation: neon 1.8s ease-in-out infinite alternate; }
```

**원리**
- `text-shadow`를 **여러 겹** 쌓으면 글자 주변에 빛 번짐 효과
- 그림자 색과 크기를 애니메이션으로 바꿔 빛이 일렁임
- **`alternate`** = 1.8초 동안 `from→to` 갔다가, 되돌릴 때 `to→from`으로 **거꾸로 재생** → 자연스러운 깜빡임 (점프 없음)

---

## 5. 무한 장면

여러 요소를 한 무대(`position: relative` 부모)에 절대 배치(`position: absolute`)로 올린 미니 풍경입니다.

### 해 (맥동)

```css
.sun {
  background: radial-gradient(circle, #fff7d6, #ffd166);  /* 가운데 밝은 원 */
  box-shadow: 0 0 60px #ffd166;                           /* 빛 번짐 */
  animation: sunPulse 4s ease-in-out infinite;
}
@keyframes sunPulse {
  0%, 100% { box-shadow: 0 0 40px #ffd166; transform: scale(1); }
  50%      { box-shadow: 0 0 80px #ffd166; transform: scale(1.08); }
}
```

- `radial-gradient(circle, ...)` = **중심에서 바깥으로** 퍼지는 그라데이션 → 빛나는 구
- `box-shadow` 크기를 키웠다 줄여 빛이 숨 쉬듯 맥동

### 구름 (가로 이동)

```css
.cloud1 { animation: drift 18s linear infinite; }
.cloud3 { animation: drift 22s linear infinite 4s; }  /* 4초 늦게 시작 */

@keyframes drift {
  from { left: -120px; }  /* 화면 왼쪽 밖 */
  to   { left: 110%; }    /* 화면 오른쪽 밖 */
}
```

- 왼쪽 밖 → 오른쪽 밖으로 계속 이동 → 끝없이 흘러가는 구름
- 구름마다 시간(18s/22s/26s)과 시작 딜레이를 달리해 자연스럽게 흩어짐
- 구름 모양은 사각형 + `::before`/`::after` 원을 합쳐서 만듦 (하트와 같은 도형 합치기)

### 언덕 (모양만)

```css
.hill {
  border-radius: 50% 50% 0 0 / 80px 80px 0 0;  /* 위쪽만 둥글게 */
}
```

애니메이션 없음. `border-radius`로 윗변만 둥글려 언덕 실루엣. *움직이지 않아도 CSS 도형 기술의 좋은 예.*

### 물결 (반복 패턴 밀기)

```css
.wave-line {
  width: 200%;   /* 화면의 2배로 만들어 빈틈 방지 */
  background: repeating-linear-gradient(90deg, #38e8ff 0 20px, transparent 20px 40px);
  animation: waveSlide 3s linear infinite;
}
@keyframes waveSlide {
  to { transform: translateX(-40px); }  /* 한 패턴 폭만큼 밀기 */
}
```

- `repeating-linear-gradient` = 줄무늬 패턴을 자동 반복
- 패턴 한 칸(40px)만큼만 옆으로 밀면 → 끊김 없이 영원히 흐르는 물결
- 폭을 `200%`로 키운 이유: 밀어도 빈 공간이 안 보이게

---

## 6. 자주 쓰는 패턴 정리

이 프로젝트를 관통하는 핵심 기술 7가지입니다. 이것만 외워도 대부분 응용 가능합니다.

| 패턴 | 어디에 쓰였나 | 한 줄 요약 |
|------|--------------|-----------|
| **대본 1개 + `animation-delay`** | Dots, Bars, Cube, Wave, 구름 | 같은 동작에 시차를 줘 순차/파도 효과 |
| **`transform`으로만 움직이기** | 거의 전부 | 위치·크기·회전은 `translate/scale/rotate` |
| **`0%, 100%` 같게 묶기** | float, bounce, morph 등 | 끝과 시작을 이어 점프 없는 무한 반복 |
| **`background-clip: text`** | 제목, Gradient 텍스트 | 글자 모양으로 그라데이션 오려내기 |
| **`::before` / `::after` 가짜 요소** | 버튼 효과, 하트, 구름 | HTML 안 늘리고 장식 레이어 추가 |
| **`transition` + `:hover`** | 모든 버튼 | 마우스 올릴 때만 A→B 부드럽게 |
| **`alternate` / `steps()`** | Neon, Typing | 왕복 재생 / 뚝뚝 끊어 재생 |

---

## 직접 연습해보기

1. **시간 바꿔보기** : 아무 `animation`의 `2s`를 `0.5s`나 `5s`로 → 속도 체감
2. **색 바꿔보기** : `:root`의 `--pink`, `--cyan` 값을 바꾸면 → 사이트 전체 색이 한 번에 변함 (CSS 변수의 힘)
3. **딜레이 추가** : 로더 점에 `animation-delay`를 더 주거나 빼서 리듬 바꾸기
4. **`steps()` 숫자** : Typing의 `steps(14)`를 `steps(3)`으로 → 끊김이 거칠어짐

> 모든 코드는 `style.css`에 주석과 함께 있습니다. 이 문서를 옆에 두고 직접 값을 바꿔가며 실험해보세요. **바꾸고 → 새로고침 → 관찰**이 가장 빠른 학습법입니다.
