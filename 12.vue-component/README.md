# 12.vue-component — Vue CLI · 싱글 파일 컴포넌트

> 학습 순서 **13번**. 앞 챕터의 CDN 방식에서 **빌드 도구를 쓰는 방식**으로 넘어갑니다.

## 학습 목표

- Vue CLI가 만들어 주는 프로젝트 구조를 이해한다
- `.vue` 싱글 파일 컴포넌트 — 템플릿·스크립트·스타일을 한 파일에 묶는다
- 컴포넌트를 `import` 해서 다른 컴포넌트 안에 넣는다
- `props` 로 부모에서 자식으로 데이터를 내려보낸다
- 개발 서버(HMR)와 프로덕션 빌드의 차이를 안다

## 파일 지도

| 경로 | 역할 |
|---|---|
| `src/main.js` | 진입점 — Vue 인스턴스를 만들어 `#app` 에 마운트 |
| `src/App.vue` | 루트 컴포넌트 |
| `src/components/HelloWorld.vue` | 자식 컴포넌트 — `msg` prop을 받는다 |
| `src/assets/logo.png` | 빌드에 포함되는 이미지 |
| `public/index.html` | HTML 템플릿 — 빌드 결과가 여기 주입된다 |
| `babel.config.js` | 트랜스파일 설정 |
| `package.json` | `serve` / `build` 스크립트 |

## 실행 방법

```bash
cd 12.vue-component
npm install
npm run serve      # 개발 서버 — http://localhost:8080
npm run build      # 프로덕션 빌드 → dist/
```

> Node 최신 버전에서는 `npm install` 이나 `npm run serve` 가 실패할 수 있습니다. 이 프로젝트가 쓰는 Vue CLI 4 / webpack 4 조합은 Node 17부터 바뀐 OpenSSL 기본값과 충돌합니다. 그럴 때는 아래처럼 회피할 수 있습니다.
>
> ```bash
> NODE_OPTIONS=--openssl-legacy-provider npm run serve
> ```

## 짚고 갈 지점

### CDN 방식과 무엇이 다른가

| | `11.vue` (CDN) | `12.vue-component` (CLI) |
|---|---|---|
| 설치 | `<script src="...">` 한 줄 | `npm install` |
| 컴포넌트 | 하나의 JS 객체 | 파일 단위로 분리 (`.vue`) |
| 빌드 | 없음 | webpack 번들링 |
| 개발 편의 | 새로고침 | HMR (고치면 즉시 반영) |
| 배포 | 파일 그대로 | `dist/` 에 최적화된 결과물 |

작은 페이지에 조금 얹는 용도라면 CDN이 낫습니다. 화면이 여러 개고 컴포넌트를 재사용하기 시작하면 빌드 방식이 필요해집니다.

### 싱글 파일 컴포넌트 (SFC)

```vue
<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
export default {
  name: 'app',
  components: { HelloWorld }
}
</script>

<style lang="less">
#app { text-align: center; color: #2c3e50; }
</style>
```

한 파일에 **구조(template) · 동작(script) · 스타일(style)** 이 함께 있습니다. HTML·JS·CSS를 파일로 나누던 방식과 반대인데, 나누는 기준을 **기술이 아니라 컴포넌트**로 바꾼 것입니다. 이 컴포넌트를 지우고 싶으면 파일 하나만 지우면 됩니다.

`<style lang="less">` 처럼 전처리기를 지정할 수 있습니다 (이 프로젝트는 `less` 를 씁니다).

### 컴포넌트를 쓰는 3단계

```js
import HelloWorld from './components/HelloWorld.vue'   // 1. 가져오고
export default {
  components: { HelloWorld }                           // 2. 등록하고
}
```
```html
<HelloWorld msg="Welcome to Your Vue.js App"/>         <!-- 3. 태그처럼 쓴다 -->
```

### props — 부모가 자식에게 데이터를 준다

`msg="..."` 로 넘긴 값을 `HelloWorld.vue` 가 `props` 로 받습니다. 데이터는 **위에서 아래로만** 흐릅니다. 자식이 부모 데이터를 직접 고칠 수 없고, 필요하면 이벤트(`$emit`)로 알려서 부모가 고치게 합니다. 데이터 흐름을 한 방향으로 유지하면 "누가 이 값을 바꿨는지" 추적하기 쉬워집니다.

### `public/` 과 `src/assets/` 의 차이

| | 처리 방식 |
|---|---|
| `src/assets/` | webpack이 처리 — 해시가 붙고 최적화되며, 작은 파일은 데이터 URL로 인라인됨 |
| `public/` | 그대로 복사 — 경로가 바뀌면 안 되는 파일(`favicon.ico`, `robots.txt`) |

`src/App.vue` 가 `src="./assets/logo.png"` 로 상대 경로를 쓸 수 있는 건 webpack이 이 경로를 빌드 시점에 실제 경로로 바꿔 주기 때문입니다.

## 지금은 이렇게 바뀌었습니다

- **Vue CLI는 유지보수 모드입니다.** 새 프로젝트는 Vite를 씁니다. 훨씬 빠릅니다.

  ```bash
  npm create vue@latest
  ```
- Vue 2 → 3에서 진입점이 바뀌었습니다.

  ```js
  // Vue 2 (이 챕터)
  import Vue from 'vue'
  new Vue({ render: h => h(App) }).$mount('#app')

  // Vue 3
  import { createApp } from 'vue'
  createApp(App).mount('#app')
  ```
- Vue 3는 `<script setup>` 문법을 권장합니다. 훨씬 짧아집니다.

  ```vue
  <script setup>
  import HelloWorld from './components/HelloWorld.vue'
  </script>
  ```

  `components` 등록이 필요 없습니다 — import만 하면 템플릿에서 바로 쓸 수 있습니다.

## 연습 과제

1. `npm run serve` 로 개발 서버를 띄우고, `HelloWorld.vue` 의 텍스트를 고쳐 보세요. 새로고침 없이 화면이 바뀌는 것(HMR)을 확인하세요.
2. `props` 를 하나 더 추가해 `App.vue` 에서 값을 내려보내세요.
3. `src/components/ProductCard.vue` 를 새로 만들고, `11.vue` 의 상품 4개를 `v-for` 로 렌더하세요. 이미지는 `src/assets/` 에 넣으세요.
4. `npm run build` 를 실행하고 `dist/` 안을 열어 보세요. 파일명에 붙은 해시는 왜 필요할까요?
5. 이 프로젝트를 Vue 3 + Vite로 옮겨 보세요.
