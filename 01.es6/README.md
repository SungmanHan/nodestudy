# 01.es6 — ES6 문법 기초

> 학습 순서 **1번**. Node를 배우기 전에 JavaScript 자체를 정리하는 단계입니다.

## 학습 목표

- `var` 와 `let`/`const` 의 스코프 차이를 눈으로 확인한다
- 함수 선언문 · 함수 표현식 · 화살표 함수의 차이를 안다
- ES5 프로토타입 방식과 ES6 `class` 방식으로 같은 객체를 만들어 본다
- 배열을 `for`, `for...in`, `for...of`, `forEach`, `map`, `filter` 로 각각 순회해 본다

## 파일 지도

| 파일 | 내용 |
|---|---|
| `01.es6.html` | 변수 선언, 함수 3형태, 객체 리터럴, IIFE, ES5 프로토타입 객체 vs ES6 `class`, 템플릿 리터럴 |
| `02.es6.html` | 배열 순회 5가지, `map`/`filter`, `Object.entries`/`keys`/`values`, 구조 분해 |

## 실행 방법

서버가 필요 없습니다. 브라우저로 파일을 열고 **개발자 도구 콘솔**을 보면 됩니다.

```bash
open 01.es6/01.es6.html    # macOS
```

VS Code를 쓴다면 Live Server 확장으로 열어도 됩니다.

## 짚고 갈 지점

### `var` 는 for 문 밖에서도 살아 있다

```js
for (var i = 0; i < 10 ; i++) {}
console.log(i)   // 10 — 블록 밖인데 출력된다
```

`01.es6.html` 에는 `let` 버전이 주석으로 막혀 있습니다. **주석을 풀어서 에러를 직접 보세요.** `let j` 로 바꾸면 `ReferenceError: j is not defined` 가 납니다. 이 차이가 `let`/`const` 를 쓰는 이유입니다.

### 같은 객체, 두 가지 방법

`Sample2` 는 IIFE + `prototype` 으로 만든 ES5 방식이고, `Sample3` 는 `class` 로 만든 ES6 방식입니다. **둘을 나란히 놓고 읽어 보세요.** ES6 `class` 는 새로운 개념이 아니라 위 방식의 문법 설탕(syntactic sugar)입니다.

### 문자열을 잇는 두 가지 방법

```js
console.log("기본 스트링 : " + this.name + "은 " + this.age + "입니다.");
console.log(`템플릿 스트링 : ${this.name}은(는) ${this.age}살 입니다.`);
```

이 저장소의 뒷 챕터들은 대부분 템플릿 리터럴을 씁니다.

### `for...in` 은 인덱스, `for...of` 는 값

```js
for (var i in str) console.log(str[i]);   // i = "0","1","2" (인덱스, 문자열)
for (var v of str) console.log(v);        // v = "a","b","c" (값)
```

`for...in` 이 주는 인덱스는 **숫자가 아니라 문자열**입니다. 헷갈리기 쉬운 지점입니다.

## 지금은 이렇게 바뀌었습니다

- `Object.entries()` 로 배열을 순회하면 `[인덱스, 값]` 쌍이 나옵니다. 배열이라면 `arr.entries()` 가 더 직관적입니다.
- 배열 마지막 원소는 이제 `arr.at(-1)` 로 꺼낼 수 있습니다 (`arr[arr.length - 1]` 대신).
- 옵셔널 체이닝 `obj?.addr?.post` 과 널 병합 `value ?? "기본값"` 이 표준입니다. 이 챕터가 작성된 뒤에 들어온 문법이라 예제에는 없습니다.

## 연습 과제

1. `01.es6.html` 의 주석 처리된 `let j` 블록을 풀고 콘솔 에러를 확인하세요.
2. `Sample3` 클래스에 `birthYear()` 메서드를 추가해 나이로 출생 연도를 계산해 출력하세요.
3. `02.es6.html` 의 `korOver` 필터를 화살표 함수로 바꾸고, **국어·영어·수학 평균이 60점 이상**인 학생만 뽑도록 고쳐 보세요.
4. `result.student` 를 `map` 으로 돌려 `{name, total, avg}` 형태의 새 배열을 만들어 보세요.
