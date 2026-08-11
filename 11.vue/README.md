# 11.vue — Vue 2 (CDN 방식)

> 학습 순서 **12번**. 백엔드를 마치고 프론트엔드로 넘어갑니다. 빌드 도구 없이 `<script>` 태그 하나로 시작합니다.

## ⚠️ 동작하지 않습니다

화면은 뜨지만 **검색 폼이 반응하지 않고 상품 목록도 보이지 않습니다.** 원인이 세 군데 있습니다 — [알려진 결함](#알려진-결함)에서 직접 찾아보세요. 이 챕터의 실질적인 과제입니다.

## 학습 목표

- Vue 인스턴스를 만들고 `el` 로 DOM에 붙인다
- `data` 의 값이 바뀌면 화면이 자동으로 갱신되는 **반응형(reactive)** 동작을 본다
- 주요 디렉티브를 쓴다 — `v-model`, `v-on`, `v-bind`, `v-for`, `v-show`
- 이벤트 수식어(`.prevent`)로 기본 동작을 막는다

## 파일 지도

| 경로 | 역할 |
|---|---|
| `index.html` | 화면 — Vue CDN, Bootstrap 4, Font Awesome |
| `index.js` | Vue 인스턴스 — 상품 데이터와 검색 로직 |
| `all.min.css`, `webfonts/` | Font Awesome 아이콘 |
| `imags/` | 상품 이미지 4장 (폴더명 오타는 원본 그대로) |

## 실행 방법

빌드가 필요 없습니다. 다만 `index.js` 를 `type="module"` 로 불러오므로 **`file://` 로 열면 CORS 정책에 막힙니다.** 간단한 정적 서버를 띄우세요.

```bash
cd 11.vue
npx serve .          # 또는 python3 -m http.server 8000
```

## 짚고 갈 지점

### 디렉티브 — HTML 속성으로 동작을 붙인다

```html
<form v-on:submit.prevent="onSubmit">
  <input type="text" class="form-control" v-model="query">
  <i v-show="query.length" v-on:click="queryRev" class="fas fa-times"></i>
</form>
<div>{{ query }}</div>
<ul>
  <li v-for="item in prds" v-show="results">
    <img v-bind:src="item.src" v-bind:alt="item.title">
    <div>{{ item.title }}</div>
  </li>
</ul>
```

| 디렉티브 | 하는 일 | 축약형 |
|---|---|---|
| `v-model` | 입력값과 `data` 를 **양방향** 연결 | — |
| `v-on:이벤트` | 이벤트 핸들러 등록 | `@click` |
| `v-bind:속성` | 속성값을 데이터에 연결 | `:src` |
| `v-for` | 배열을 돌며 엘리먼트 반복 | — |
| `v-show` | 조건에 따라 `display:none` | — |
| `{{ }}` | 텍스트 보간 | — |

### 양방향 바인딩이 무엇을 없애 주는가

`v-model="query"` 한 줄이 이 일을 대신합니다.

```js
// 순수 JavaScript였다면
input.addEventListener('input', e => {
  state.query = e.target.value;
  display.textContent = e.target.value;   // 화면 갱신도 직접
});
```

입력창에 타이핑하면 `data.query` 가 바뀌고, `{{ query }}` 부분이 **자동으로** 다시 그려집니다. DOM을 직접 건드리는 코드가 사라집니다.

### `.prevent` 수식어

```html
<form v-on:submit.prevent="onSubmit">
```

`.prevent` 는 `event.preventDefault()` 를 대신합니다. 없으면 폼이 제출되면서 페이지가 새로고침돼 Vue 상태가 초기화됩니다.

### `v-show` vs `v-if`

`v-show` 는 엘리먼트를 만들어 두고 CSS로 숨깁니다. `v-if` 는 아예 만들지 않습니다. 자주 토글된다면 `v-show`, 조건이 거의 안 바뀐다면 `v-if` 가 유리합니다.

## 알려진 결함

먼저 직접 찾아보세요. `index.js` 와 `index.html` 을 한 줄씩 읽으면 보입니다.

<details>
<summary>답 보기</summary>

**1. `index.js` — 옵션 이름이 `method`**

```js
new Vue({
    el: "#app",
    data: { ... },
    method: {          // ← methods 여야 한다 (복수형)
        queryRev(e){ ... },
        onSubmit(e){ ... }
    }
});
```

Vue는 `methods` 만 인식합니다. `method` 라고 쓰면 **조용히 무시**되고, `onSubmit` 을 호출할 때 "그런 메서드 없다"는 경고만 콘솔에 남습니다. 오타 하나로 기능 전체가 죽는 사례입니다.

**2. `index.html` — `v-for` 변수 이름이 안 맞는다**

```html
<li v-for="time in prds">
  <img v-bind:src="item.src">     <!-- item? time인데? -->
  <div>{{ item.title }}</div>
</li>
```

`v-for="time in prds"` 로 선언해 놓고 안에서는 `item` 을 씁니다. `item` 은 존재하지 않습니다. 둘 중 하나로 맞춰야 합니다.

**3. `results` 가 계속 `false`**

```js
data: { query: "", prds: [], results: false }
```

`v-show="results"` 인데 `results` 를 `true` 로 바꾸는 코드가 어디에도 없습니다. `onSubmit` 에서 `this.prds = Product` 와 함께 `this.results = true` 를 해 줘야 합니다.

세 개를 다 고쳐야 검색이 동작합니다.
</details>

## 지금은 이렇게 바뀌었습니다

- **Vue 2는 2023년 12월 지원이 종료되었습니다.** 새 프로젝트는 Vue 3를 씁니다.
- Vue 3에서는 인스턴스 생성 방식이 바뀌었습니다.

  ```js
  // Vue 2 (이 챕터)
  new Vue({ el: "#app", data: { ... }, methods: { ... } });

  // Vue 3
  Vue.createApp({ data() { return { ... } }, methods: { ... } }).mount("#app");
  ```

  `data` 가 **객체가 아니라 함수**가 된 점을 눈여겨보세요. 컴포넌트 인스턴스마다 데이터를 따로 갖게 하기 위한 변경입니다.
- Vue 3는 Composition API(`setup`, `ref`, `computed`)를 권장합니다.
- CDN 방식은 지금도 간단한 페이지에 유효합니다. 규모가 커지면 다음 챕터의 빌드 방식으로 넘어갑니다.

## 연습 과제

1. 결함 3개를 모두 고쳐 검색이 동작하게 만드세요.
2. 검색어(`query`)로 상품을 **실제로 필터링**하세요. 지금은 `onSubmit` 이 전체 목록을 그대로 넣습니다. `computed` 속성을 쓰면 `v-model` 입력에 따라 실시간으로 걸러집니다.
3. `v-show` 를 `v-if` 로 바꿔 보고 개발자 도구 Elements 탭에서 차이를 확인하세요.
4. 상품이 하나도 없을 때 "검색 결과가 없습니다" 를 표시하세요.
5. 같은 화면을 Vue 3 `createApp` 방식으로 다시 쓰세요.
