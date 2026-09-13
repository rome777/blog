---
title: AI에게 매번 프롬프트 치기 귀찮아서 만든 Git 커밋 스킬 — commit-summary
description: 코딩 후 커밋할 때마다 AI에게 시키던 Conventional Commits 요약과 PR 템플릿 작성을 자동화한 AI Agent Skill. Claude Code와 Antigravity에서 diff를 분석해 논리적 분할 커밋을 제안합니다.
pubDate: 2026-09-07
category: 프로젝트
tags: [AI스킬, ClaudeCode, Antigravity, Git, 생산성, 오픈소스]
draft: false
heroImage: /images/posts/my-skills-terminal.png
---

코딩이 끝난 뒤 커밋을 남길 때마다, AI 어시스턴트에게 매번 똑같은 프롬프트를 치고 있었습니다.

> *"방금 수정한 거 Conventional Commits 양식으로 한국어 50자 이내로 요약해줘. 서로 다른 작업 섞여 있으면 커밋 나눠주고, PR 본문 템플릿도 만들어줘."*

하루에 수십 번씩 반복하다 보니 손가락도 아프고 귀찮아서, **Claude Code**와 **Google Antigravity** 같은 AI 에이전트 도구에서 바로 불러 쓸 수 있는 맞춤형 스킬 **`commit-summary`**를 만들어 오픈소스로 공개했습니다.

> 📦 **GitHub 저장소**: [rome777/my-skills](https://github.com/rome777/my-skills)

---

## 실제 동작 화면

![commit-summary 스킬 실행 터미널 화면](/blog/images/posts/my-skills-terminal.png)

*▲ AI 어시스턴트에게 "오늘 작업한 거 커밋이랑 PR 양식으로 정리해줘"라고만 말하면, staged/unstaged 변경사항을 스스로 감지해 논리적 단위의 분할 커밋 명령어와 PR 본문을 완성해줍니다.*

---

## 💡 이 스킬이 해결해 주는 5가지

1. **`git diff` 자동 분석**
   - 사람이 변경 목록을 복사해서 붙여넣을 필요가 없습니다. 스킬이 스스로 `git status`와 `git diff`를 실행해 staged 및 unstaged 파일들의 변경 맥락을 읽어냅니다.

2. **Conventional Commits 룰 엄수**
   - `feat`, `fix`, `refactor`, `docs`, `chore` 등 표준 컨벤션에 맞춰 한국어 50자 내외의 명료한 제목을 뽑아냅니다.

3. **작업별 분할 커밋 제안 (논리적 분리)**
   - 만약 로그인 UI 컴포넌트를 수정하면서 동시에 공통 로깅 유틸리티를 손봤다면? 하나로 뭉뚱그리지 않고 각 작업별로 파일 단위의 `git add`와 `git commit` 명령어를 분리해서 조립해 줍니다.

4. **PR(Pull Request) 본문 템플릿 즉시 생성**
   - 변경 사항 개요, 상세 내역, 리뷰 포인트, 테스트 체크리스트가 포함된 완성형 마크다운 PR 템플릿을 만들어 줍니다. 복사해서 깃허브 PR 창에 넣기만 하면 됩니다.

5. **시크릿(.env) 유출 사전 차단**
   - 혹시라도 diff 속에 `.env` 환경 변수나 API Secret Key 같은 민감 데이터가 섞여 있으면, 커밋 전에 즉각 경고하고 커밋 목록에서 제외하도록 권고합니다.

---

## 🛠️ 내 프로젝트에 10초 만에 등록하기

스킬 파일(`SKILL.md`) 하나만 프로젝트나 전역 스킬 폴더에 넣어두면 바로 인식됩니다.

### 1. Claude Code에서 사용 시
프로젝트 루트에서 아래 명령을 실행합니다:

```bash
mkdir -p .claude/skills/commit-summary
curl -o .claude/skills/commit-summary/SKILL.md https://raw.githubusercontent.com/rome777/my-skills/main/.claude/skills/commit-summary/SKILL.md
```

### 2. Google Antigravity에서 사용 시
전역 스킬 경로에 배치하면 모든 작업 공간에서 쓸 수 있습니다:

```bash
# Antigravity 글로벌 스킬 경로
~/.gemini/antigravity/skills/commit-summary/SKILL.md
```

### 3. 실사용 예시
등록 후에는 AI에게 자연스럽게 말만 건네면 됩니다.
- `"커밋 메시지 써줘"`
- `"오늘 작업 PR 양식으로 정리해줘"`
- `"/commit-summary"`

```bash
# 스킬이 알아서 출력해주는 결과 예시:
git add src/components/Login.tsx
git commit -m "feat(auth): 로그인 화면에 구글 소셜 로그인 버튼 추가 (#128)"

git add src/utils/logger.ts
git commit -m "refactor(logger): 이벤트 로깅 포맷 개선 및 undefined 메타데이터 기본값 처리"
```

---

## 마치며

좋은 도구는 개발자가 본질적인 비즈니스 로직과 설계에만 집중할 수 있게 도와줍니다.

매일 반복되던 자잘한 커밋 프롬프트 작성을 잊고 편하게 코딩하고 싶으시다면, 저장소에서 스킬 파일을 받아 사용해보세요!
