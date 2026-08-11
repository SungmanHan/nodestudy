# nodestudy — Node.js 백엔드 수업 실습 저장소

2019년 Node.js 수업에서 작성한 실습 코드 모음입니다. Express 기반 서버, MySQL/MongoDB 연동, 세션 로그인, 파일 업로드, Vue 프론트엔드까지 백엔드 입문 과정을 한 바퀴 돕니다.

> **읽기 전에 — 이 저장소의 성격**
> 실무 템플릿이 아니라 **수업 중 진행 상황을 그대로 남긴 기록**입니다. 그래서 일부 챕터는 미완성이거나 실행되지 않습니다. 어떤 챕터가 어떤 상태인지는 아래 [챕터 지도](#챕터-지도)의 **상태** 열에 표시했고, 각 챕터 README에 원인까지 적어 두었습니다.
> 코드는 **2019년 당시 버전 기준**입니다. Express 4, Sequelize 5, Mongoose 5, Vue 2 시절 문법이라 지금 그대로 쓰면 동작하지 않는 API가 있습니다. 각 챕터 README의 *"지금은 이렇게 바뀌었습니다"* 절을 함께 보세요.

---

## 권장 학습 순서

**폴더 번호는 학습 순서가 아닙니다.** 번호가 중간에 비고(`05` 없음), 겹치고(`03` 두 개), 내용과 순서가 어긋납니다(`00.node_maria`가 맨 앞, 가장 기초인 `07.node`가 중간). 폴더명을 바꾸면 45개 커밋 이력과 기존 링크가 끊기므로 이름은 그대로 두고, **아래 순서대로 읽는 것을 권합니다.**

| 순서 | 폴더 | 무엇을 배우나 |
|:---:|---|---|
| 1 | [`01.es6`](01.es6/) | `let`/`const`, 화살표 함수, 클래스, 구조 분해, 배열 고차 함수 |
| 2 | [`07.node`](07.node/) | Node 코어 모듈 — `os`·`path`·`url`·`crypto`·`fs`·`cluster` |
| 3 | [`02.node_hello`](02.node_hello/) | Express 첫 서버, 라우팅, 쿼리스트링·POST 바디, 정적 파일 |
| 4 | [`03.node_ex`](03.node_ex/) | 콜백→Promise→async/await, MySQL 연동, pug 템플릿 |
| 5 | [`03.express-generator`](03.express-generator/) | `express-generator`가 만들어 주는 표준 프로젝트 골격 |
| 6 | [`04.node_router`](04.node_router/) | 라우터 파일 분리, REST(GET/POST/PUT/DELETE), Sequelize, 미들웨어 |
| 7 | [`06.express-gen`](06.express-gen/) | generator 골격 + Sequelize 모델을 `define` 방식으로 정의 |
| 8 | [`08.multer`](08.multer/) | multer 파일 업로드 — 저장 경로·파일명 규칙·확장자 필터 |
| 9 | [`09.session`](09.session/) | 세션·쿠키 로그인, 비밀번호 해시, 회원가입/로그인/로그아웃 |
| 10 | [`10.mongodb`](10.mongodb/) | MongoDB 설치·셸 명령, Mongoose 연결 (입문) |
| 11 | [`13.sns`](13.sns/) | Mongoose 스키마·모델로 CRUD 완성 |
| 12 | [`11.vue`](11.vue/) | Vue 2를 CDN으로 붙여 쓰는 방식 — 디렉티브·양방향 바인딩 |
| 13 | [`12.vue-component`](12.vue-component/) | Vue CLI 프로젝트, 싱글 파일 컴포넌트(`.vue`) |
| 참고 | [`00.node_maria`](00.node_maria/) | MariaDB 연결 실습을 시작만 하고 중단한 껍데기 |

---

## 챕터 지도

| 폴더 | 주제 | DB | 포트 | 상태 |
|---|---|:---:|:---:|---|
| `01.es6` | ES6 문법 | — | — | ✅ 브라우저에서 바로 실행 |
| `07.node` | Node 코어 모듈 | — | 3001<sup>*</sup> | ⚠️ `03.cipher.js`는 Node 22+ 에서 실행 불가 |
| `02.node_hello` | Express 입문 | — | 3000 | ✅ 실행 가능 |
| `03.node_ex` | 비동기 + MySQL + pug | MySQL | 3000 | ⚠️ `app.js` 미완성 · `app-mysql.js`는 모듈 누락 |
| `03.express-generator` | 프로젝트 골격 | — | — | ⚠️ `bin/www` 미커밋 → `npm start` 불가 |
| `04.node_router` | 라우터 분리·REST | MySQL | 3000 | ✅ 실행 가능 (DB 필요) |
| `06.express-gen` | Sequelize 모델 | MySQL | — | ⚠️ `bin/www`·`config/config.json` 누락 |
| `08.multer` | 파일 업로드 | MySQL<sup>†</sup> | 3000 | ✅ 업로드 기능은 DB 없이 동작 |
| `09.session` | 세션 로그인 | MySQL | 3000 | ✅ 실행 가능 (DB 필요) |
| `10.mongodb` | MongoDB 입문 | MongoDB | 3000 | ⚠️ 연결 코드가 호출되지 않는 껍데기 |
| `13.sns` | Mongoose CRUD | MongoDB | 3000 | ✅ 실행 가능 (DB 필요) |
| `11.vue` | Vue CDN | — | — | ⚠️ 옵션 이름 오타로 동작 안 함 (README 참고) |
| `12.vue-component` | Vue CLI | — | 8080 | ✅ `npm run serve` |
| `00.node_maria` | MariaDB (중단) | MySQL | 4444 | ❌ 실행 시 즉시 크래시 |

<sup>*</sup> `07.node/05.Cluster.js` 만 서버를 띄웁니다.
<sup>†</sup> `08.multer`의 Sequelize 설정은 코드에 남아 있지만 업로드 라우트는 DB를 쓰지 않습니다.

---

## 사전 준비

### Node.js

```bash
node -v
```

당시 수업은 Node 12 기준이었습니다. 최신 LTS로도 대부분 동작하지만, `07.node/03.cipher.js`처럼 **Node 22에서 제거된 API**를 쓰는 파일이 있습니다. 해당 챕터 README에 표시해 두었습니다.

### 데이터베이스

MySQL을 쓰는 챕터(`03.node_ex`, `04.node_router`, `06.express-gen`, `08.multer`, `09.session`)는 **포트 3307**, 데이터베이스 이름 `node_db` 를 기본값으로 씁니다. Docker로 띄우는 것이 가장 간단합니다.

```bash
docker run -d --name nodestudy-mysql -p 3307:3306 -e MYSQL_ROOT_PASSWORD=원하는비밀번호 -e MYSQL_DATABASE=node_db mysql:8
```

MongoDB를 쓰는 챕터(`10.mongodb`, `13.sns`)는 **포트 15000** 을 기본값으로 씁니다.

```bash
docker run -d --name nodestudy-mongo -p 15000:27017 mongo:7
```

### 환경 변수

DB 접속정보는 코드에 하드코딩하지 않고 `.env` 파일로 분리했습니다. 각 챕터에 `.env.example` 이 있으니 복사해서 값을 채우세요.

```bash
cp .env.example .env
```

`.env` 는 `.gitignore` 에 등록되어 있어 커밋되지 않습니다. **비밀값을 코드나 저장소에 넣지 않는 것**은 이 저장소에서 가져갈 만한 습관 하나입니다.

---

## 공통 실행 방법

```bash
cd 04.node_router      # 원하는 챕터로 이동
npm install            # 의존성 설치 (챕터마다 따로)
cp .env.example .env   # 환경 변수 준비 (DB를 쓰는 챕터만)
node app.js            # 또는 npm start
```

각 챕터는 **독립된 npm 프로젝트**입니다. 루트에서 한 번에 설치하는 방식이 아니라 챕터마다 `npm install` 을 따로 해야 합니다.

---

## 알려진 한계

- **의존성이 오래되었습니다.** 2019년 버전에 고정돼 있어 GitHub Dependabot 보안 경보가 다수 열려 있습니다. 대부분 Express 4→5, Sequelize 5→6, Mongoose 5→8, Vue 2→3 같은 **메이저 업그레이드**로만 닫히는데, 그렇게 하면 예제 코드를 전부 다시 써야 해서 "수업에서 배운 그 코드"라는 이 저장소의 성격이 사라집니다. 그래서 **메이저 업그레이드는 하지 않고**, 대신 각 챕터 README에 지금 달라진 점을 적어 두는 쪽을 택했습니다.
- **테스트 코드가 없습니다.** 수업 실습 코드라 처음부터 없었습니다.
- **일부 챕터는 실행되지 않습니다.** 위 [챕터 지도](#챕터-지도)의 상태 열과 각 README를 확인하세요. 고치지 않고 남겨 둔 이유는, 무엇이 왜 빠졌는지 아는 것 자체가 학습 자료로서 의미가 있기 때문입니다. 각 README에 **직접 고쳐 보는 연습 과제**로 정리했습니다.

---

## 출처

수업 강사 임덕규 (<https://github.com/booldook>)
