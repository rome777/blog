import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import { SITE_URL, BASE_PATH } from './site.config.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // 라이트/다크 두 테마를 함께 심어두고 CSS 변수로 전환합니다.
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
    rehypePlugins: [
      // 헤딩에 id 를 먼저 붙여야 아래 autolink 가 걸 곳을 찾습니다.
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          // h2 · h3 옆에 링크 아이콘을 붙여 특정 단락을 공유할 수 있게 합니다.
          behavior: 'append',
          test: ['h2', 'h3'],
          properties: { class: 'heading-anchor', ariaHidden: 'true', tabIndex: -1 },
          content: { type: 'text', value: '#' },
        },
      ],
      [
        // 바깥으로 나가는 링크는 새 탭에서 연다. 글을 읽던 자리를 잃지 않게.
        // 같은 블로그 안의 상대 경로 링크는 그대로 현재 탭에서 이동한다.
        rehypeExternalLinks,
        {
          target: '_blank',
          // noopener 없이 새 탭을 열면 열린 쪽에서 window.opener 로 이 페이지를 건드릴 수 있다.
          rel: ['noopener', 'noreferrer'],
          protocols: ['http', 'https'],
        },
      ],
    ],
  },
});
