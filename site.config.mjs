// ============================================================
//  블로그 전역 설정 — 여기만 고치면 사이트 전체에 반영됩니다.
// ============================================================

/** GitHub Pages 도메인 (뒤에 / 없이) */
export const SITE_URL = 'https://rome777.github.io';

/**
 * 저장소 하위 경로.
 *  - 저장소 이름이 `blog`            → '/blog'
 *  - 저장소 이름이 `rome777.github.io` → '/'
 * 저장소 이름을 바꿨다면 이 값만 '/' 로 바꾸면 됩니다.
 */
export const BASE_PATH = '/blog';

export const SITE_TITLE = 'rome777 devlog';
export const SITE_DESCRIPTION = 'AI · 데이터 · 개발을 공부하며 남기는 학습 노트.';
export const SITE_AUTHOR = 'rome777';
export const SITE_LANG = 'ko';

/** 헤더 내비게이션 */
export const NAV = [
  { label: '홈', href: '/' },
  { label: '글', href: '/posts' },
  { label: '태그', href: '/tags' },
  { label: '검색', href: '/search' },
  { label: '소개', href: '/about' },
];

/** 푸터 / 소개에 노출할 링크 */
export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/rome777' },
];

/** 한 페이지에 보여줄 글 수 */
export const POSTS_PER_PAGE = 10;

// ------------------------------------------------------------
//  댓글 (giscus) — 아래 4개 값을 채우면 자동으로 켜집니다.
//  1) 저장소 Settings → General → Features → Discussions 체크
//  2) https://github.com/apps/giscus 설치
//  3) https://giscus.app 에서 rome777/blog 입력 후 나오는 값 복사
// ------------------------------------------------------------
export const GISCUS = {
  enabled: false,          // 값을 채운 뒤 true 로 바꾸세요
  repo: 'rome777/blog',
  repoId: '',              // 예: R_kgDOxxxxxxx
  category: 'Announcements',
  categoryId: '',          // 예: DIC_kwDOxxxxxxx
  mapping: 'pathname',
  lang: 'ko',
};
