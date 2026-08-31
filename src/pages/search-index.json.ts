import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../utils/posts';
import { isoDate } from '../consts';

/**
 * 검색 페이지가 불러갈 정적 색인입니다.
 * 마크다운 문법을 대충 걷어낸 본문을 함께 담아 본문 검색까지 되게 합니다.
 */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')       // 코드 블록
    .replace(/`[^`]*`/g, ' ')              // 인라인 코드
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크는 글자만 남김
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')    // 헤딩 기호
    .replace(/[*_>~|-]+/g, ' ')            // 나머지 마크다운 기호
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();

  const index = posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    date: isoDate(post.data.pubDate),
    category: post.data.category,
    tags: post.data.tags,
    // 본문은 앞부분만 담아 색인 파일이 지나치게 커지는 걸 막습니다.
    body: toPlainText(post.body ?? '').slice(0, 2000),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
