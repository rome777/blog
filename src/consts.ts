export {
  SITE_URL,
  BASE_PATH,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_AUTHOR,
  SITE_LANG,
  NAV,
  SOCIALS,
  POSTS_PER_PAGE,
  GISCUS,
} from '../site.config.mjs';

/**
 * base 경로를 붙여 내부 링크를 만듭니다.
 * 저장소가 `blog` 면 url('/tags') → '/blog/tags'
 * 저장소가 `rome777.github.io` 면 url('/tags') → '/tags'
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const rest = path.startsWith('/') ? path : `/${path}`;
  return `${base}${rest}`;
}

/** 'Python 기초' → 'python-기초' (태그 URL 용) */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '');
}

/** 2026-08-31 → '2026년 8월 31일' */
export function formatDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** 2026-08-31 → '2026-08-31' (datetime 속성용) */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 본문 길이로 대략적인 읽기 시간 계산 (한글 기준 분당 500자) */
export function readingTime(body: string): number {
  const chars = body.replace(/\s+/g, '').length;
  return Math.max(1, Math.round(chars / 500));
}
