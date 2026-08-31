# rome777 devlog

학습 기록용 블로그. [Astro](https://astro.build) 로 만들고 GitHub Pages 로 배포합니다.

> 사이트: https://rome777.github.io/blog

## 빠르게 시작하기

```bash
npm install
npm run dev
```

`http://localhost:4321/blog` 에서 확인합니다. 파일을 저장하면 자동으로 새로고침됩니다.

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 로컬 개발 서버 (초안 글도 보임) |
| `npm run build` | `dist/` 에 정적 사이트 생성 |
| `npm run preview` | 빌드 결과를 그대로 미리보기 |
| `npm run new "제목"` | 새 글 파일 생성 |

## 글 쓰기

`src/content/blog/` 에 마크다운 파일을 만들면 글 하나가 됩니다.
**파일 이름이 곧 주소입니다.** `numpy-broadcasting.md` → `/posts/numpy-broadcasting`

```bash
npm run new "넘파이 브로드캐스팅 정리"
```

### frontmatter

```yaml
---
title: 글 제목                    # 필수
description: 한 줄 요약            # 선택 (목록·검색·SEO에 사용)
pubDate: 2026-08-31              # 필수, YYYY-MM-DD
updatedDate: 2026-09-02          # 선택
category: 딥러닝                  # 대분류 하나 (없으면 '기타')
tags: [PyTorch, 역전파]           # 태그 여러 개
draft: true                      # 초안이면 true — 배포에서 제외
---
```

형식이 틀리면 빌드가 실패하면서 어디가 틀렸는지 알려줍니다.
카테고리·태그 페이지는 글에서 자동으로 만들어지므로 따로 등록할 필요가 없습니다.

이미지는 `public/images/` 에 넣고 `![설명](/blog/images/파일명.png)` 으로 씁니다.

## 배포

`main` 브랜치에 push 하면 [GitHub Actions](.github/workflows/deploy.yml) 가 빌드해서 배포합니다.

```bash
git add .
git commit -m "post: 브로드캐스팅 정리"
git push
```

최초 1회만 저장소에서 설정이 필요합니다:
**Settings → Pages → Build and deployment → Source 를 `GitHub Actions` 로 변경**

## 설정 바꾸기

거의 모든 설정은 [`site.config.mjs`](site.config.mjs) 한 곳에 있습니다.
블로그 제목, 소개 문구, 메뉴, 페이지당 글 수, 댓글 설정을 여기서 고칩니다.

### 주소를 `rome777.github.io` 로 바꾸려면

1. GitHub 저장소 이름을 `rome777.github.io` 로 변경
2. `site.config.mjs` 에서 `BASE_PATH` 를 `'/'` 로 변경

### 댓글(giscus) 켜기

1. 저장소 **Settings → General → Features → Discussions** 체크
2. https://github.com/apps/giscus 설치
3. https://giscus.app 에서 `rome777/blog` 입력 → 나오는 `repoId`, `categoryId` 복사
4. `site.config.mjs` 의 `GISCUS` 에 붙여넣고 `enabled: true`

## 구조

```
site.config.mjs          # 블로그 전역 설정 — 여기부터 보세요
astro.config.mjs         # Astro / 마크다운 설정
src/
├─ content/blog/         # 글이 들어가는 곳 (.md)
├─ content.config.ts     # frontmatter 검증 규칙
├─ consts.ts             # 설정 재노출 + 공용 헬퍼 (url, slugify, formatDate…)
├─ utils/posts.ts        # 글 목록 조회 · 태그/카테고리 집계
├─ components/           # 헤더, 푸터, 글 목록, 목차, 댓글, 테마 토글
├─ layouts/              # BaseLayout(공통), PostLayout(글 상세)
├─ pages/
│  ├─ index.astro        # 홈
│  ├─ posts/             # 글 목록 · 페이지네이션 · 글 상세
│  ├─ tags/              # 태그 목록 · 태그별 글
│  ├─ categories/        # 카테고리 목록 · 카테고리별 글
│  ├─ search.astro       # 클라이언트 검색
│  ├─ search-index.json.ts  # 검색 색인 (빌드 시 생성)
│  └─ rss.xml.ts         # RSS 피드
└─ styles/global.css     # 색상 토큰 · 타이포그래피 · 레이아웃
```

## 들어있는 것

- 태그 / 카테고리 자동 분류
- 라이트 · 다크 모드 (코드 하이라이팅도 함께 전환)
- 본문까지 훑는 클라이언트 검색
- giscus 댓글 (설정하면 켜짐)
- 목차, 이전/다음 글, 읽기 시간
- RSS, sitemap, Open Graph 태그
