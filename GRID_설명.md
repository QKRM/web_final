# 네임카드 옆 프로젝트 그리드, 어떻게 이쁘게 만들었나

프로필 카드 오른쪽에 붙은 **3×2 프로젝트 그리드**가 어떤 원리로 정렬되고 꾸며졌는지 정리한 문서입니다.

---

## 1. 큰 틀: 카드와 그리드를 나란히 (Flexbox)

먼저 `.layout`이 **카드 한 개 + 그리드 한 덩어리**를 가로로 나란히 세웁니다.

```css
.layout {
  display: flex;   /* 가로 배치 */
  gap: 28px;       /* 둘 사이 간격 */
  align-items: center;  /* 세로 가운데 정렬 */
}
```

- `display: flex` → 자식(`.profile-card`, `.projects-grid`)이 좌우로 붙음
- `align-items: center` → 카드 높이와 그리드 높이가 달라도 **세로 중앙**에 맞춰짐
- `.profile-card`에는 `flex-shrink: 0`을 줘서 화면이 좁아져도 카드가 찌그러지지 않음

> 포인트: 바깥은 **Flex** (큰 두 덩어리 배치), 안쪽 그리드는 **Grid** (작은 카드 배치). 역할을 나눈 게 핵심.

---

## 2. 그리드 본체: 3열 × 2행 (CSS Grid)

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 185px);  /* 185px 칸 3개 */
  grid-template-rows: repeat(2, auto);       /* 행 2개 */
  gap: 16px;                                  /* 카드 사이 간격 */
}
```

- `repeat(3, 185px)` → **딱 185px짜리 칸 3개**. 너비가 고정이라 카드 크기가 들쭉날쭉하지 않고 칼같이 정렬됨
- `gap: 16px` → 행/열 사이 간격을 한 번에 처리 (margin 안 써도 됨)
- 카드 6개를 넣으면 자동으로 3개씩 끊겨서 **2줄**이 됨

이 "칸 크기 고정 + gap"이 그리드가 정돈돼 보이는 가장 큰 이유입니다.

---

## 3. 썸네일 비율 고정 (aspect-ratio)

카드마다 이미지/썸네일 영역 높이가 달라지면 그리드가 지저분해집니다. `aspect-ratio`로 **16:9 비율을 강제**해서 막았습니다.

```css
.proj-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;   /* 가로:세로 = 16:9 고정 */
  display: flex;
  align-items: center;     /* 아이콘 가운데 */
  justify-content: center;
  overflow: hidden;
}
```

- 너비(185px)에 맞춰 높이가 **자동으로 16:9**가 됨 → 6칸 썸네일 높이가 전부 똑같음
- 안에 들어가는 이모지/아이콘은 flex로 정중앙 배치
- 나중에 실제 스크린샷을 넣으면 `object-fit: cover`로 비율 안 깨지고 꽉 채워짐

```css
.proj-thumb img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;  /* 잘라내서 꽉 채우기 */
}
```

---

## 4. 카드 자체 꾸미기 (반투명 + 둥근 모서리)

어두운 보라 배경 위에 떠 있는 느낌을 주려고 **반투명 유리** 스타일을 썼습니다.

```css
.project-card {
  background: rgba(255, 255, 255, 0.07);    /* 살짝 흰 반투명 */
  border: 1px solid rgba(255, 255, 255, 0.15);  /* 은은한 테두리 */
  border-radius: 12px;       /* 둥근 모서리 */
  overflow: hidden;          /* 둥근 모서리 밖으로 이미지 안 삐져나오게 */
  display: flex;
  flex-direction: column;    /* 썸네일 위 / 이름 아래 세로 쌓기 */
}
```

- `rgba(...0.07)` → 배경이 비치는 **glassmorphism** 느낌
- `overflow: hidden` → 썸네일 이미지가 둥근 모서리에 맞춰 깔끔하게 잘림
- `flex-direction: column` → 썸네일(위) + 이름(아래) 구조

---

## 5. 마우스 올리면 살아나는 hover 효과

정적인 그리드도 hover 한 줄로 "이쁘다" 소리 나옵니다.

```css
.project-card {
  transition: transform 0.25s ease,
              border-color 0.25s ease,
              box-shadow 0.25s ease;
}

.project-card:hover {
  transform: translateY(-6px);                  /* 살짝 위로 떠오름 */
  border-color: rgba(16, 185, 129, 0.7);        /* 초록 테두리 강조 */
  box-shadow: 0 10px 28px rgba(16, 185, 129, 0.2);  /* 초록 그림자 */
}
```

- `transform: translateY(-6px)` → 카드가 **위로 둥실** 뜨는 느낌
- `transition`을 평소 상태에 미리 걸어둬서 들어갈 때/나올 때 **둘 다 부드럽게** 움직임
- 초록색(`#10b981`)은 프로필 사진 테두리·직함 색과 맞춰 **통일감** 줌

---

## 6. 카드마다 다른 색 (nth-child 그라데이션)

썸네일이 비어 있어도 심심하지 않게, 카드 6개에 **각각 다른 그라데이션**을 깔았습니다.

```css
.project-card:nth-child(1) .proj-thumb { background: linear-gradient(135deg, #1a1a4e, #3a3080); }
.project-card:nth-child(2) .proj-thumb { background: linear-gradient(135deg, #0f3460, #1a6090); }
.project-card:nth-child(3) .proj-thumb { background: linear-gradient(135deg, #2d1b69, #6a3fa0); }
/* ... 4,5,6번도 각각 다른 색 ... */
```

- `:nth-child(n)` → **몇 번째 카드인지**로 골라서 색 지정
- `linear-gradient(135deg, ...)` → 대각선 그라데이션이라 더 입체적
- 전부 어두운 톤이라 배경과 따로 놀지 않으면서도 칸마다 개성이 생김

---

## 7. 화면 크기별 대응 (반응형)

좁은 화면에서도 안 깨지게 `@media`로 칸 수를 줄입니다.

```css
@media (max-width: 900px) {
  .layout { flex-direction: column; }  /* 카드 위 / 그리드 아래로 세로 전환 */
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);  /* 고정 185px → 비율(1fr)로 */
    width: 350px;
  }
}

@media (max-width: 500px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);   /* 폰에선 2열 */
    width: 320px;
  }
}
```

- 900px 이하 → 카드와 그리드가 **세로로** 쌓임, 칸 너비는 고정(px)에서 비율(`1fr`)로 바뀜
- 500px 이하(폰) → **2열**로 줄여서 카드가 너무 작아지지 않게 함

---

## 한 줄 요약

> **바깥은 Flex로 카드+그리드 나란히 → 안쪽은 Grid로 3×2 칼정렬 → 썸네일은 aspect-ratio로 높이 통일 → hover로 살짝 띄우고 → nth-child로 색 입히고 → media query로 반응형.**

이 6단계가 겹쳐서 "딱 떨어지게 이쁜" 그리드가 완성됩니다.
