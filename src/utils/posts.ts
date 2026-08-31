import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify, categorySegments } from '../consts';

export type Post = CollectionEntry<'blog'>;

/**
 * 발행된 글을 최신순으로 반환합니다.
 * 개발 서버에서는 draft: true 인 글도 보이고, 빌드 시에는 제외됩니다.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

const byWeightThenName = <T extends { total?: number; name: string; posts?: Post[] }>(a: T, b: T) =>
  (b.total ?? b.posts?.length ?? 0) - (a.total ?? a.posts?.length ?? 0) ||
  a.name.localeCompare(b.name, 'ko');

// ─────────────────────────────────────────────────────────────
//  태그 — 계층 없이 평평하게
// ─────────────────────────────────────────────────────────────

export interface Group {
  /** 원래 표기 그대로의 이름 (예: 'NumPy') */
  name: string;
  /** URL 에 쓰이는 형태 (예: 'numpy') */
  slug: string;
  posts: Post[];
}

/** 글 목록을 태그별로 묶어 글이 많은 순 → 이름순으로 정렬합니다. */
export function groupByTag(posts: Post[]): Group[] {
  const map = new Map<string, Group>();

  for (const post of posts) {
    for (const name of post.data.tags) {
      const slug = slugify(name);
      const existing = map.get(slug);
      if (existing) existing.posts.push(post);
      else map.set(slug, { name, slug, posts: [post] });
    }
  }

  return [...map.values()].sort(byWeightThenName);
}

/** 태그명 → 글 수 (TagRow 의 counts 로 넘김) */
export function toCountMap(groups: Group[]): Record<string, number> {
  return Object.fromEntries(groups.map((g) => [g.name, g.posts.length]));
}

// ─────────────────────────────────────────────────────────────
//  카테고리 — '딥러닝/CNN' 처럼 '/' 로 계층을 만듭니다
// ─────────────────────────────────────────────────────────────

export interface CategoryNode {
  /** 이 단계의 이름만 (예: 'CNN') */
  name: string;
  /** 루트부터의 전체 경로 (예: '딥러닝/CNN') */
  path: string;
  /** URL 용 경로 (예: '딥러닝/cnn') */
  slug: string;
  /** 깊이. 최상위가 0 */
  depth: number;
  /** 이 단계에 직접 달린 글 */
  ownPosts: Post[];
  /** 하위까지 모두 더한 글 수 */
  total: number;
  children: CategoryNode[];
}

/** 모든 글의 category 를 훑어 계층 트리를 만듭니다. */
export function buildCategoryTree(posts: Post[]): CategoryNode[] {
  const roots: CategoryNode[] = [];

  for (const post of posts) {
    const segments = categorySegments(post.data.category);
    let siblings = roots;
    let node: CategoryNode | undefined;
    const pathParts: string[] = [];
    const slugParts: string[] = [];

    for (const [depth, segment] of segments.entries()) {
      pathParts.push(segment);
      slugParts.push(slugify(segment));
      const path = pathParts.join('/');

      node = siblings.find((child) => child.path === path);
      if (!node) {
        node = {
          name: segment,
          path,
          slug: slugParts.join('/'),
          depth,
          ownPosts: [],
          total: 0,
          children: [],
        };
        siblings.push(node);
      }
      siblings = node.children;
    }

    node?.ownPosts.push(post);
  }

  // 하위 글 수를 합산하면서 정렬까지 함께 끝냅니다.
  const settle = (node: CategoryNode): number => {
    node.total = node.ownPosts.length + node.children.reduce((sum, c) => sum + settle(c), 0);
    node.children.sort(byWeightThenName);
    return node.total;
  };

  roots.forEach(settle);
  roots.sort(byWeightThenName);
  return roots;
}

/** 트리를 깊이 우선 순서로 펼칩니다 (경로 생성·목록 표시용). */
export function flattenCategoryTree(nodes: CategoryNode[]): CategoryNode[] {
  return nodes.flatMap((node) => [node, ...flattenCategoryTree(node.children)]);
}

/** 해당 카테고리와 그 하위 카테고리의 글을 모두 모아 최신순으로 돌려줍니다. */
export function postsInCategory(node: CategoryNode): Post[] {
  const collected = [node, ...flattenCategoryTree(node.children)].flatMap((n) => n.ownPosts);
  return [...new Set(collected)].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}
