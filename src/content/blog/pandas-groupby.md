---
title: pandas groupby, agg 와 transform 의 차이
description: 둘 다 그룹별로 계산하는데 결과 모양이 달랐습니다. 언제 무엇을 쓰는지 정리했습니다.
pubDate: 2026-08-26
category: 데이터 분석/Pandas
tags: [Pandas, Python, 집계]
---

`groupby` 뒤에 `agg` 를 쓸 때와 `transform` 을 쓸 때 결과 행 수가 달라서 한참 헤맸습니다.

## 한 줄 요약

- `agg` → **그룹 하나당 한 줄**. 요약표를 만들 때
- `transform` → **원래 행 수 그대로**. 원본에 열을 붙일 때

```python
import pandas as pd

df = pd.DataFrame({
    "반": ["A", "A", "B", "B", "B"],
    "점수": [90, 80, 70, 60, 50],
})

print(df.groupby("반")["점수"].agg("mean"))
# 반
# A    85.0
# B    60.0     ← 2줄

print(df.groupby("반")["점수"].transform("mean"))
# 0    85.0
# 1    85.0
# 2    60.0
# 3    60.0
# 4    60.0     ← 5줄, 원본과 같음
```

## transform 이 편했던 순간

"각자 점수가 자기 반 평균보다 몇 점 높은가"를 구할 때입니다.

```python
df["반평균"] = df.groupby("반")["점수"].transform("mean")
df["편차"] = df["점수"] - df["반평균"]
```

`agg` 로 하면 결과를 다시 `merge` 해야 하는데, `transform` 은 행이 그대로라 바로 대입됩니다.

| 하고 싶은 것 | 쓸 것 |
| --- | --- |
| 반별 평균 표 만들기 | `agg` |
| 각 행에 자기 그룹 평균 붙이기 | `transform` |
| 조건에 맞는 그룹만 남기기 | `filter` |

## 한 번에 여러 집계

```python
df.groupby("반")["점수"].agg(["mean", "max", "count"])
```

이름을 직접 붙이고 싶으면 이렇게 씁니다.

```python
df.groupby("반").agg(
    평균=("점수", "mean"),
    최고=("점수", "max"),
)
```

> `agg` 는 줄이고, `transform` 은 그대로 둔다 — 이렇게 외웠습니다.
