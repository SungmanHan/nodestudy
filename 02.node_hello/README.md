# 02.node_hello — Express 첫 서버

> 학습 순서 **3번**. 처음으로 웹 서버를 띄웁니다.

## 학습 목표

- `express()` 로 앱을 만들고 `app.listen()` 으로 서버를 띄운다
- `app.get()` / `app.post()` 로 라우트를 등록한다
- URL에서 값을 받는 두 가지 경로 — 쿼리스트링(`req.query`)과 경로 파라미터(`req.params`)
- POST 폼 데이터를 `req.body` 로 받는다 (그러려면 미들웨어가 필요하다)
- `express.static` 으로 HTML/CSS/JS를 그대로 서빙한다
- 직접 만든 모듈을 `require` 해서 쓴다

## 파일 지도

| 파일 | 내용 |
|---|---|
| `app.js` | 서버 본체 — 라우트 전부가 여기 들어 있음 |
| `modules/util.js` | 날짜 포맷 유틸 (`zp`, `isoDate`) |
| `public/index.html` | 정적 파일 루트 |
| `public/html/join.html` | POST 폼 — `/join-save` 로 전송 |
| `public/html/main.html` | 정적 페이지 |
| `node-start.md` | 수업 중 정리한 Node·Express 설치 메모 |
| `note.txt` | `npm init -y` 한 줄 메모 |

## 실행 방법

DB가 필요 없습니다.

```bash
cd 02.node_hello
npm install
node app.js        # http://127.0.0.1:3000
```

확인해 볼 URL:

| URL | 무엇을 보나 |
|---|---|
| `http://127.0.0.1:3000/` | `public/index.html` (정적 서빙) |
| `http://127.0.0.1:3000/hello?name=홍길동` | 쿼리스트링 → `req.query.name` |
| `http://127.0.0.1:3000/books/1` | 경로 파라미터 → `req.params.id` |
| `http://127.0.0.1:3000/books` | 파라미터 없을 때 기본값 처리 |
| `http://127.0.0.1:3000/html/join.html` | 폼 제출 → POST `/join-save` |

## 짚고 갈 지점

### 값을 받는 두 가지 경로

```js
app.get("/hello", (req, res) => {
    var name = req.query.name;        // /hello?name=홍길동
});

app.get(["/books","/books/:id"], (req, res) => {
    var id = req.params.id;           // /books/1
    if(!id) id = 0;                   // /books 로 오면 undefined → 기본값
});
```

`app.get()` 에 **배열로 여러 경로**를 넘길 수 있다는 점을 눈여겨보세요. `/books` 와 `/books/:id` 를 한 핸들러가 받습니다.

### POST 바디는 그냥 오지 않는다

```js
app.use(bodyParser.urlencoded({extended:false}));
```

이 줄이 없으면 `req.body` 는 `undefined` 입니다. HTTP 본문은 스트림으로 도착하므로, **누군가 읽어서 객체로 만들어 줘야** 합니다. 그 역할이 미들웨어입니다.

### 미들웨어는 등록 순서대로 실행된다

`app.use()` 로 등록한 것들은 요청이 들어올 때 **위에서 아래로** 차례로 실행됩니다. `express.static` 을 먼저 걸었으므로, `/index.html` 요청은 아래쪽 라우트까지 내려오지 않고 정적 파일에서 끝납니다.

### 모듈 분리

```js
// modules/util.js
module.exports = {zp, isoDate}

// app.js
const util = require('./modules/util')
util.isoDate(new Date())
```

날짜 포맷처럼 여러 곳에서 쓸 로직은 이렇게 빼 둡니다. 뒤 챕터(`04.node_router`)에서 이 패턴이 본격적으로 쓰입니다.

## 지금은 이렇게 바뀌었습니다

- **`body-parser` 를 따로 설치할 필요가 없습니다.** Express 4.16부터 내장되었습니다.

  ```js
  // 예전 (이 챕터)
  const bodyParser = require("body-parser");
  app.use(bodyParser.urlencoded({extended:false}));

  // 지금
  app.use(express.urlencoded({extended:false}));
  app.use(express.json());
  ```

  뒤 챕터의 express-generator 골격은 이미 내장 방식을 씁니다 — 비교해 보세요.
- `package.json` 에 `body-parser` 가 의존성으로 없는데 `app.js` 는 `require` 합니다. Express가 내부적으로 들고 있어서 우연히 동작하는 상태이니, 직접 쓸 거라면 명시적으로 설치하는 게 맞습니다.
- 수업 메모(`node-start.md`)에 나오는 `supervisor` 는 지금 거의 쓰지 않습니다. `nodemon` 을 쓰거나, Node 18+ 라면 내장 옵션으로 충분합니다.

  ```bash
  node --watch app.js
  ```

## 연습 과제

1. `body-parser` 를 걷어내고 `express.urlencoded` 로 바꾸세요. 그리고 `package.json` 에서도 정리하세요.
2. `/books/99` 처럼 **없는 id** 로 접속하면 서버가 죽습니다. 원인을 찾고, 404 메시지를 응답하도록 고치세요.
3. `books` 배열을 `modules/books.js` 로 분리해 `require` 하세요.
4. `/join-save` 가 HTML 대신 JSON을 반환하도록 바꾸고, 브라우저 개발자 도구 Network 탭에서 응답을 확인하세요.
