# 프로필 카드(네임카드), 어떻게 만들어졌나

왼쪽의 흰색 **프로필 카드**가 어떤 HTML 구조와 CSS로 만들어졌는지 정리한 문서입니다.

---

## 1. HTML 구조: 위에서 아래로 쌓기

카드 한 장 안에 **사진 → 이름 → 직함 → 소개글 → 연락처**가 순서대로 들어갑니다.

```html
<div class="profile-card">
  <img class="profile-img" src="..." alt="프로필 이미지" />
  <div class="name">서재현</div>
  <div class="job-title">웹개발, AI, 프로그래밍 강사</div>
  <div class="about-me"> ...소개글... </div>
  <div>
    <a class="contact-info">📧 이메일</a>
    <a class="contact-info">💻 깃허브</a>
    <a class="contact-info">📱 인스타그램</a>
  </div>
</div>
```

- 블록 요소(`div`)는 기본이 **세로로 쌓임** → 따로 정렬 안 해도 위에서 아래로 나열됨
- 연락처 3개는 묶음 `div` 하나로 감싸서 한 덩어리로 관리

---

## 2. 카드 박스: 흰 카드 띄우기

```css
.profile-card {
  background-color: white;       /* 어두운 배경 위 흰 카드 */
  width: 350px;                  /* 너비 고정 */
  flex-shrink: 0;                /* 화면 좁아도 안 찌그러짐 */
  padding: 40px 30px;            /* 안쪽 여백 (내용이 벽에 안 붙음) */
  border-radius: 20px;           /* 둥근 모서리 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);  /* 떠 있는 그림자 */
  text-align: center;            /* 안쪽 내용 가운데 정렬 */
}
```

- `width: 350px` + `flex-shrink: 0` → 카드 크기가 항상 일정 (옆 그리드가 밀어도 안 줄어듦)
- `padding: 40px 30px` → 위아래 40, 좌우 30 여백
- `border-radius: 20px` → 부드러운 둥근 카드
- `box-shadow` → 살짝 떠 보이는 입체감
- `text-align: center` → 사진·이름·직함이 **가로 중앙**에 옴

---

## 3. 프로필 사진: 동그랗게 자르기

```css
.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;        /* 정사각형을 원으로 */
  object-fit: cover;         /* 비율 안 깨지고 꽉 채우기 */
  margin-bottom: 20px;
  border: 3px solid #10b981; /* 초록 테두리 */
}
```

- `width = height = 120px` + `border-radius: 50%` → **완전한 원**
- `object-fit: cover` → 원본이 직사각형이어도 찌그러지지 않고 잘라서 채움
- `border: 3px solid #10b981` → 초록 테두리가 포인트 색 역할

> 핵심: 정사각형(120×120)에 `border-radius: 50%`를 줘야 깨끗한 원이 됨.

---

## 4. 이름 / 직함: 글자 스타일

```css
.name {
  color: #1f2937;       /* 진한 회색(거의 검정) */
  font-size: 24px;
  font-weight: bold;    /* 굵게 */
  margin-bottom: 5px;
}

.job-title {
  color: #10b981;        /* 초록 (사진 테두리와 통일) */
  font-size: 14px;
  letter-spacing: 2px;   /* 글자 사이 간격 → 고급스러운 느낌 */
  margin-bottom: 20px;
}
```

- 이름은 크고 굵게(`24px`, `bold`) → 가장 눈에 띔
- 직함은 작게 + 초록 + `letter-spacing` → 사진 테두리 색과 맞춰 **통일감**

---

## 5. 소개글: 읽기 좋게

```css
.about-me {
  color: #4b5563;        /* 중간 회색 (이름보다 연함) */
  font-size: 15px;
  line-height: 1.6;      /* 줄 간격 넉넉히 → 가독성 */
  margin-bottom: 30px;
  text-align: left;      /* 본문은 왼쪽 정렬이 읽기 편함 */
  word-break: keep-all;  /* 한글 단어가 줄 끝에서 안 쪼개짐 */
}
```

- 카드 전체는 가운데 정렬이지만, 긴 글만 `text-align: left`로 **따로 왼쪽 정렬** (문단은 왼쪽이 읽기 편함)
- `line-height: 1.6` → 줄 사이가 답답하지 않음
- `word-break: keep-all` → "안산"이 "안\n산"처럼 어색하게 안 끊김 (한글 필수 옵션)

---

## 6. 연락처 버튼: 알약 모양 + hover

```css
.contact-info {
  display: inline-block;       /* 가로로 나란히 */
  background-color: #f3f4f6;   /* 연회색 배경 */
  color: #374151;
  padding: 8px 15px;
  border-radius: 20px;         /* 알약(pill) 모양 */
  font-size: 13px;
  margin: 5px;
  text-decoration: none;       /* 링크 밑줄 제거 */
}

.contact-info:hover {
  background-color: #10b981;   /* 올리면 초록으로 */
  color: white;
}
```

- `inline-block` + `margin` → 버튼 3개가 가로로 나란히, 좁으면 자동 줄바꿈
- `border-radius: 20px` → 둥근 **알약 버튼** 모양
- `text-decoration: none` → `<a>` 링크 기본 밑줄 제거
- `:hover` → 마우스 올리면 **초록 배경 + 흰 글씨**로 바뀜 (포인트 색 재사용)

---

## 7. 카드와 그리드를 나란히 (바깥 레이아웃)

카드 단독이 아니라 옆 그리드와 짝을 이루도록 `.layout`이 감쌉니다.

```css
.layout {
  display: flex;        /* 카드 + 그리드 가로 배치 */
  gap: 28px;
  align-items: center;  /* 세로 중앙 정렬 */
}
```

- 바깥은 **Flex**로 카드+그리드 두 덩어리 배치
- `.profile-card`의 `flex-shrink: 0` 덕분에 그리드가 커져도 카드는 350px 유지

> 그리드 쪽 자세한 설명은 [GRID_설명.md](GRID_설명.md) 참고.

---

## 한 줄 요약

> **흰 박스(`background`+`border-radius`+`box-shadow`)에 padding으로 여백 주고 → 사진은 정사각형+`border-radius:50%`로 동그랗게 → 텍스트는 가운데, 소개글만 왼쪽 → 연락처는 알약 버튼+hover → 전체를 초록(`#10b981`) 포인트 색으로 통일.**

이 조합이 깔끔하고 떠 있는 네임카드를 만듭니다.
