---
title: 블로그를 시작하며 — 글 쓰는 법
description: 이 블로그에 글을 추가하고 배포하는 전체 흐름을 정리했습니다. 첫 글이자 사용 설명서.
pubDate: 2026-08-31
category: 블로그
tags: [Astro, GitHub Pages, 마크다운]
---

학습한 내용을 흘려보내지 않기 위해 블로그를 만들었습니다.
이 글은 첫 글이자, 앞으로 제가 다시 볼 **사용 설명서**입니다.

## 글 하나 추가하기

`src/content/blog/` 안에 마크다운 파일을 하나 만들면 그게 곧 글 하나입니다.
파일 이름이 그대로 주소가 됩니다. `numpy-broadcasting.md` → `/posts/numpy-broadcasting`

터미널에서 아래 명령을 쓰면 오늘 날짜가 채워진 빈 글이 만들어집니다.

```bash
npm run new "넘파이 브로드캐스팅 정리"
```

## 앞머리(frontmatter) 규칙

모든 글은 `---` 사이의 설정 블록으로 시작합니다.

```yaml
---
title: 글 제목                    # 필수
description: 목록에 보일 한 줄 요약  # 선택, 있으면 좋음
pubDate: 2026-08-31              # 필수
updatedDate: 2026-09-02          # 선택, 수정했을 때만
category: 딥러닝                  # 대분류 하나
tags: [PyTorch, 역전파]           # 세부 태그 여러 개
draft: true                      # 초안이면 true — 배포에서 빠집니다
---
```

| 항목 | 필수 | 설명 |
| --- | --- | --- |
| `title` | ✅ | 제목 |
| `pubDate` | ✅ | `YYYY-MM-DD` 형식 |
| `description` | | 목록·검색·SEO에 함께 쓰입니다 |
| `category` | | 하나만. 없으면 `기타` |
| `tags` | | 여러 개. 태그 페이지가 자동 생성됩니다 |
| `draft` | | `true`면 로컬에서만 보이고 배포에는 안 올라갑니다 |

형식이 틀리면 빌드가 **실패하면서 어디가 틀렸는지 알려줍니다.** 잘못된 글이 조용히 올라가는 일은 없습니다.

## 확인하고 올리기

```bash
npm run dev
```

`http://localhost:4321/blog` 에서 바로 확인할 수 있고, 파일을 저장하면 화면이 알아서 갱신됩니다.

다 됐으면 커밋하고 푸시합니다.

```bash
git add . && git commit -m "post: 브로드캐스팅 정리" && git push
```

푸시하면 GitHub Actions가 알아서 빌드해서 배포합니다. 1~2분 뒤 사이트에 반영됩니다.

## 쓸 수 있는 것들

코드 블록은 언어를 적으면 색이 입혀집니다.

```python
def moving_average(values, window=3):
    """단순 이동평균."""
    return [
        sum(values[i : i + window]) / window
        for i in range(len(values) - window + 1)
    ]

print(moving_average([1, 2, 3, 4, 5]))  # [2.0, 3.0, 4.0]
```

> 인용문은 이렇게 씁니다. 나중의 나에게 남기는 메모에 쓰기 좋습니다.

이미지는 `public/images/` 에 넣고 `![설명](/blog/images/파일명.png)` 으로 불러옵니다.

---

이제 남은 건 꾸준히 쓰는 것뿐입니다.
