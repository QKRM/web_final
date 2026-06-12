/**
 * 포트폴리오 메인 스크립트
 * 기능:
 *   1. 내비게이션 바 스크롤 감지 (배경 전환)
 *   2. 활성 섹션에 따른 내비게이션 링크 하이라이트
 *   3. 모바일 햄버거 메뉴 토글
 *   4. 스무스 스크롤 (내부 앵커 링크)
 *   5. IntersectionObserver 기반 섹션 진입 애니메이션
 */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     1. DOM 요소 참조
  ───────────────────────────────────────── */
  const navbar      = document.querySelector(".navbar");
  const hamburger   = document.querySelector(".hamburger");
  const mobileMenu  = document.querySelector(".mobile-menu");
  const navLinks    = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const sections    = document.querySelectorAll("section[id]");
  const revealItems = document.querySelectorAll(".reveal-item");

  /* ─────────────────────────────────────────
     2. 내비게이션 바 스크롤 효과
     스크롤 위치가 10px 이상이면 .scrolled 클래스 추가 → 반투명 배경
  ───────────────────────────────────────── */
  function handleNavScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll(); // 초기 실행

  /* ─────────────────────────────────────────
     3. 활성 섹션 하이라이트
     현재 뷰포트에 보이는 섹션에 해당하는 nav-link에 .active 클래스 추가
  ───────────────────────────────────────── */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("id");

          // 모든 nav 링크에서 active 제거 후 해당 링크에 추가
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    {
      // 섹션의 40% 이상 화면에 들어오면 활성화
      threshold: 0.4,
      rootMargin: "-64px 0px 0px 0px", // 네비바 높이만큼 오프셋
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ─────────────────────────────────────────
     4. 모바일 햄버거 메뉴
  ───────────────────────────────────────── */
  function toggleMobileMenu(forceClose) {
    if (!hamburger || !mobileMenu) return;

    const isOpen = hamburger.classList.contains("is-open");
    const shouldOpen = forceClose ? false : !isOpen;

    hamburger.classList.toggle("is-open", shouldOpen);
    mobileMenu.classList.toggle("is-open", shouldOpen);
    hamburger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    mobileMenu.setAttribute("aria-hidden", shouldOpen ? "false" : "true");

    // 메뉴 열릴 때 body 스크롤 잠금
    document.body.style.overflow = shouldOpen ? "hidden" : "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => toggleMobileMenu());
  }

  // 모바일 메뉴의 링크 클릭 시 메뉴 닫기
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(true));
  });

  // 메뉴 바깥 영역 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (
      hamburger &&
      mobileMenu &&
      hamburger.classList.contains("is-open") &&
      !navbar.contains(e.target)
    ) {
      toggleMobileMenu(true);
    }
  });

  // ESC 키로 메뉴 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && hamburger && hamburger.classList.contains("is-open")) {
      toggleMobileMenu(true);
    }
  });

  /* ─────────────────────────────────────────
     5. 스무스 스크롤 (내부 앵커 링크)
     CSS scroll-behavior: smooth 를 보완하며,
     nav-bar 높이만큼 오프셋을 주어 정확한 위치로 스크롤
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetTop =
        targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });

  /* ─────────────────────────────────────────
     6. 스크롤 진입 애니메이션 (fade-up)
     .reveal-item 요소가 뷰포트에 진입하면 .is-visible 클래스 추가
     CSS에서 opacity: 0 → 1, translateY: 36px → 0 처리
  ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // 한번 보이면 더 이상 관찰할 필요 없음
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  /* ─────────────────────────────────────────
     7. 스킬 배지 호버 딜레이 (그리드 내 순서별)
     각 스킬 배지에 CSS custom property로 인덱스 주입
  ───────────────────────────────────────── */
  document.querySelectorAll(".skills-grid .skill-badge").forEach((badge, i) => {
    badge.style.setProperty("--badge-index", i);
    badge.style.transitionDelay = `${i * 0.04}s`;
  });

  /* ─────────────────────────────────────────
     8. 현재 연도 자동 업데이트 (푸터)
     HTML에 [이름] 플레이스홀더를 그대로 두고 연도만 동적 처리
  ───────────────────────────────────────── */
  // (현재 HTML에 연도가 2026 고정이므로 실제 사용 시 아래 주석 해제 가능)
  // const yearEl = document.querySelector('.footer-copy');
  // if (yearEl) {
  //   yearEl.innerHTML = yearEl.innerHTML.replace('2026', new Date().getFullYear());
  // }

  /* ─────────────────────────────────────────
     9. 프로젝트 카드 — 마우스 팔로우 글로우 효과 (선택적 강화)
     카드 위에서 마우스 위치에 따라 미묘한 그라디언트 이동
  ───────────────────────────────────────── */
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
    });
  });

})();
