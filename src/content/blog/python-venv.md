---
title: 프로젝트마다 가상환경을 따로 쓰는 이유
description: 패키지 버전이 꼬여서 하루를 날린 뒤에 venv 를 쓰기 시작했습니다.
pubDate: 2026-08-20
category: Python/환경설정
tags: [Python, venv, 환경설정]
---

한 프로젝트에서 numpy 를 올렸더니 다른 프로젝트가 망가졌습니다.
전역에 설치하면 모든 프로젝트가 같은 패키지를 공유하기 때문이었습니다.

## 가상환경 만들기

```bash
python -m venv .venv
```

프로젝트 폴더 안에 `.venv/` 가 생기고, 여기에만 패키지가 설치됩니다.

활성화 방법은 OS마다 다릅니다.

```bash
source .venv/bin/activate      # macOS / Linux
.venv\Scripts\activate         # Windows
```

프롬프트 앞에 `(.venv)` 가 붙으면 성공입니다.

## 확인하는 법

지금 어떤 파이썬을 쓰고 있는지 헷갈릴 때가 있습니다.

```bash
python -c "import sys; print(sys.executable)"
```

`.venv` 경로가 나오면 제대로 들어온 것입니다.

## 다른 사람도 같은 환경으로

```bash
pip freeze > requirements.txt   # 지금 설치된 것 기록
pip install -r requirements.txt # 받은 사람이 그대로 재현
```

## 빠뜨리기 쉬운 것

`.venv/` 는 **반드시** `.gitignore` 에 넣습니다. 용량도 크고 OS마다 내용이 달라서 공유할 이유가 없습니다.

```text
.venv/
```

| 상황 | 명령 |
| --- | --- |
| 환경 만들기 | `python -m venv .venv` |
| 나가기 | `deactivate` |
| 통째로 지우고 다시 | 폴더 삭제 후 재생성 |

지우고 다시 만드는 게 부담 없다는 게 가장 큰 장점이었습니다.
