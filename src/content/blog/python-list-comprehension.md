---
title: 리스트 컴프리헨션을 언제 쓰고 언제 안 쓸까
description: 짧게 쓸 수 있다고 항상 좋은 건 아니었습니다. 읽기 어려워지는 경계선을 찾아봤습니다.
pubDate: 2026-08-24
category: Python
tags: [Python, 문법, 가독성]
---

컴프리헨션을 배우고 나면 모든 `for`문을 한 줄로 바꾸고 싶어집니다.
며칠 뒤에 제가 쓴 코드를 못 읽게 되고 나서 기준을 정했습니다.

## 기본 형태

```python
squares = [n ** 2 for n in range(10)]
evens = [n for n in range(20) if n % 2 == 0]
```

`for`문으로 쓰면 세 줄인 걸 한 줄로 줄여줍니다. 여기까지는 확실히 더 읽기 좋습니다.

## 속도 차이

같은 일을 하는데도 컴프리헨션이 조금 빠릅니다. 반복마다 `append` 메서드를 찾아 호출하는 비용이 없기 때문입니다.

```python
import timeit

loop = timeit.timeit(
    "result = []\nfor n in range(1000): result.append(n * 2)",
    number=10_000,
)
comp = timeit.timeit("[n * 2 for n in range(1000)]", number=10_000)

print(f"for문   : {loop:.3f}s")
print(f"컴프리헨션: {comp:.3f}s")
```

제 노트북에서는 컴프리헨션이 대략 **1.3배** 빨랐습니다. 큰 차이는 아니지만 손해는 아닙니다.

## 안 쓰기로 한 경우

### 조건이 두 개 이상 겹칠 때

```python
# 읽기 힘듦
result = [f(x) for x in data if x.valid if x.score > 0.5 if x.tag != "test"]
```

이건 그냥 `for`문으로 풀어 쓰는 게 낫습니다.

### 중첩이 두 겹을 넘을 때

```python
# 어느 for가 바깥인지 매번 헷갈림
flat = [cell for row in grid for cell in row if cell]
```

두 겹까지는 참지만 세 겹부터는 함수로 뺍니다.

### 부수효과가 목적일 때

```python
[print(x) for x in items]   # ❌ 리스트를 만들 이유가 없음
for x in items: print(x)    # ⭕
```

리스트를 만들지 않을 거면 컴프리헨션을 쓸 이유가 없습니다.

## 정리한 기준

| 상황 | 선택 |
| --- | --- |
| 한 줄 변환 + 조건 하나까지 | 컴프리헨션 |
| 조건 2개 이상 / 중첩 3겹 이상 | `for`문 |
| 결과를 안 쓰고 부수효과만 필요 | `for`문 |
| 아주 큰 데이터라 한 번에 안 담고 싶을 때 | 제너레이터 `( )` |

마지막 항목이 은근히 유용합니다.

```python
total = sum(n ** 2 for n in range(10_000_000))  # 리스트를 만들지 않음
```

> 한 줄에 들어가느냐가 아니라, **한 번 읽고 이해되느냐**를 기준으로 삼기로 했습니다.
