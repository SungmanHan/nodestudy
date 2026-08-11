# 03.express-generator — 프로젝트 골격 자동 생성

> 학습 순서 **5번**. 지금까지 `app.js` 한 파일에 몰아넣던 것을, 표준 구조로 쪼갭니다.

## ⚠️ 실행되지 않습니다

`package.json` 의 시작 스크립트는 `node ./bin/www` 인데 **`bin/www` 가 저장소에 없습니다.** generator가 만들어 준 파일 중 이것만 커밋되지 않았습니다. 살리는 방법은 [실행 방법](#실행-방법)에 적었습니다.

## 학습 목표

- `express-generator` 가 만들어 주는 표준 디렉터리 구조를 이해한다
- 서버 구동(`bin/www`)과 앱 설정(`app.js`)이 왜 분리되어 있는지 안다
- 라우터를 별도 파일로 빼고 `app.use()` 로 마운트한다
- 404와 에러를 미들웨어로 처리한다
- pug 레이아웃 상속(`layout.pug` ← `index.pug`)을 쓴다

## 파일 지도

| 경로 | 역할 |
|---|---|
| `app.js` | 앱 설정 — 미들웨어 등록, 라우터 마운트, 에러 핸들러. **서버를 띄우지는 않는다** |
| `bin/www` | ⚠️ 없음. 원래 여기서 포트를 정하고 `app.listen()` 을 호출 |
| `routes/index.js` | `/` 라우터 |
| `routes/users.js` | `/users` 라우터 |
| `views/layout.pug` | 공통 레이아웃 |
| `views/index.pug` | 홈 화면 (layout 상속) |
| `views/error.pug` | 에러 화면 |
| `public/stylesheets/style.css` | 정적 CSS |

## 실행 방법

`bin/www` 를 되살려야 합니다. 두 가지 방법이 있습니다.

**방법 A — 다른 챕터에서 가져오기** (가장 빠름)

```bash
cp -r 08.multer/bin 03.express-generator/bin
cd 03.express-generator && npm install && npm start
```

**방법 B — generator로 새로 만들어 비교하기** (권장, 배우는 게 더 많음)

```bash
npx express-generator --view=pug /tmp/gen-sample
```

만들어진 `/tmp/gen-sample/bin/www` 를 열어 보고, 이 챕터의 `app.js` 와 어떻게 맞물리는지 확인한 뒤 가져오세요.

접속: `http://127.0.0.1:3000`

## 짚고 갈 지점

### 왜 `app.js` 와 `bin/www` 를 나눌까

```js
// app.js 마지막 줄 — 앱 "객체"를 내보낼 뿐, 서버를 띄우지 않는다
module.exports = app;

// bin/www — 여기서 포트를 정하고 실제로 듣기 시작한다
var app = require('../app');
server.listen(port);
```

앞 챕터(`02.node_hello`)는 `app.listen(3000)` 이 `app.js` 안에 있었습니다. 분리하면:

- 포트·HTTPS 같은 **실행 환경 설정**이 앱 로직과 섞이지 않습니다
- 테스트에서 `require('../app')` 만 해서 서버를 띄우지 않고 앱을 검사할 수 있습니다
- 같은 앱을 다른 포트로 여러 개 띄울 수 있습니다

### 라우터 분리

```js
// routes/index.js
var router = express.Router();
router.get('/', (req, res) => { res.render('index', { title: 'Express' }); });
module.exports = router;

// app.js
app.use('/', indexRouter);
app.use('/users', usersRouter);
```

`express.Router()` 는 **미니 앱**입니다. 라우트를 모아 두었다가 `app.use()` 로 특정 경로 아래에 통째로 붙입니다. `usersRouter` 안에서 `router.get('/')` 라고 쓰면 실제 경로는 `/users` 가 됩니다 — 마운트 지점이 앞에 붙기 때문입니다.

이 패턴이 다음 챕터 `04.node_router` 에서 5개 라우터로 확장됩니다.

### 404와 에러는 "맨 마지막" 미들웨어

```js
// 여기까지 아무 라우트도 안 걸렸다 = 없는 주소다
app.use(function(req, res, next) {
  next(createError(404));
});

// 인자가 4개(err, req, res, next)면 Express가 에러 핸들러로 인식한다
app.use(function(err, req, res, next) {
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
```

두 가지를 기억하세요.

1. **순서가 전부입니다.** 이 두 개는 반드시 모든 라우트 뒤에 와야 합니다. 위로 올리면 모든 요청이 404가 됩니다.
2. **에러 핸들러는 인자 개수로 구분됩니다.** `(err, req, res, next)` 4개짜리여야 Express가 에러용으로 인식합니다. 3개면 그냥 일반 미들웨어입니다.

그리고 `개발 환경일 때만 에러 상세를 내려보내는` 부분을 눈여겨보세요. 운영에서 스택 트레이스를 노출하면 내부 구조가 새어 나갑니다.

## 지금은 이렇게 바뀌었습니다

- `var` 대신 `const`/`let` 을 씁니다. 이 챕터 코드가 전부 `var` 인 건 generator 템플릿이 그랬기 때문입니다.
- Express 5부터 에러 핸들링이 달라졌습니다. `async` 라우트에서 던진 에러가 **자동으로** 에러 핸들러로 갑니다. Express 4에서는 `next(err)` 를 직접 불러 줘야 했습니다.
- `express-generator` 자체는 지금도 쓸 수 있지만, 새 프로젝트라면 필요한 것만 직접 설치하는 편이 일반적입니다. generator가 넣어 주는 `debug`, `cookie-parser` 는 안 쓰는 경우가 많습니다.

## 연습 과제

1. `bin/www` 를 되살리고 서버를 띄우세요. 파일을 열어 `normalizePort`, `onError`, `onListening` 이 각각 무엇을 하는지 읽어 보세요.
2. `routes/users.js` 에 `/users/:id` 라우트를 추가해 `req.params.id` 를 화면에 출력하세요.
3. 일부러 없는 주소(`/nothing`)로 접속해 404 화면을 확인하세요. 그다음 `app.use` 404 블록을 라우터 **위로** 옮기면 어떻게 되는지 확인하고 되돌리세요.
4. `views/layout.pug` 를 고쳐 모든 페이지 하단에 공통 푸터를 넣으세요.
