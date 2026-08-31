import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from '../consts';

export type Post = CollectionEntry<'blog'>;

/**
 * 발행된 글을 최신순으로 반환합니다.
 * 개발 서버에서는 draft: true 인 글도 보이고, 빌드 시에는 제외됩니다.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export interface Group {
  /** 원래 표기 그대로의 이름 (예: 'Python 기초') */
  name: string;
  /** URL 에 쓰이는 형태 (예: 'python-기초') */
  slug: string;
  posts: Post[];
}

/** 글 목록을 태그별로 묶어 글이 많은 순 → 이름순으로 정렬합니다. */
export function groupByTag(posts: Post[]): Group[] {
  return collect(posts, (post) => post.data.tags);
}

/** 글 목록을 카테고리별로 묶습니다. */
export function groupByCategory(posts: Post[]): Group[] {
  return collect(posts, (post) => [post.data.category]);
}

function collect(posts: Post[], pick: (post: Post) => string[]): Group[] {
  const map = new Map<string, Group>();

  for (const post of posts) {
    for (const name of pick(post)) {
      const slug = slugify(name);
      const existing = map.get(slug);
      if (existing) existing.posts.push(post);
      else map.set(slug, { name, slug, posts: [post] });
    }
  }

  return [...map.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'ko')
  );
}

/** 태그명 → 글 수 (TagRow 의 counts 로 넘김) */
export function toCountMap(groups: Group[]): Record<string, number> {
  return Object.fromEntries(groups.map((g) => [g.name, g.posts.length]));
}
