import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** 글 제목 */
    title: z.string(),
    /** 목록·검색·SEO 에 쓰이는 한 줄 요약 */
    description: z.string().default(''),
    /** 작성일 (YYYY-MM-DD) */
    pubDate: z.coerce.date(),
    /** 수정일 — 없으면 생략 */
    updatedDate: z.coerce.date().optional(),
    /** 대분류 하나 */
    category: z.string().default('기타'),
    /** 세부 태그 여러 개 */
    tags: z.array(z.string()).default([]),
    /** true 면 빌드에서 제외 (초안) */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
