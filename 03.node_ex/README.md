# 03.node_ex — 비동기 패턴 + MySQL + pug

> 학습 순서 **4번**. 이 저장소에서 가장 중요한 두 가지가 여기서 나옵니다 — **비동기 처리**와 **DB 연동**.

## ⚠️ 실행 전에 알아 둘 것

이 챕터의 두 서버 파일은 **그대로는 실행되지 않습니다.**

```bash
$ node app.js
SyntaxError: Identifier 'age' has already been declared
```

`app.js` 는 **구문 오류라 파일이 파싱조차 되지 않습니다.** 실행이 안 되는 정도가 아니라 Node가 읽어들이지도 못합니다. `app-mysql.js` 는 문법은 멀쩡하지만 `require` 하는 모듈이 없습니다.

수업이 진행되면서 코드가 `04.node_router` 로 옮겨 갔고, 그 과정에서 여기 남은 파일들이 반쪽이 된 것입니다. 무엇이 왜 빠졌는지는 [알려진 결함](#알려진-결함)에 정리했습니다. **고치는 것 자체가 이 챕터의 연습 과제입니다.**

> 비동기 예제(`public/html/callback*.html`)와 `sql.md` 는 서버와 무관하게 그대로 볼 수 있습니다. 이 챕터의 학습 내용 절반은 거기 있습니다.

## 학습 목표

- 콜백 지옥 → Promise → `async/await` 로 넘어가는 이유를 코드로 체감한다
- `mysql` / `mysql2` 로 DB에 연결하고 CRUD SQL을 실행한다
- **SQL 인젝션을 막는 파라미터 바인딩**(`?`)을 쓴다
- 커넥션 하나(`createConnection`)와 커넥션 풀(`createPool`)의 차이를 안다
- pug 템플릿 엔진으로 서버에서 HTML을 그려 내려보낸다

## 파일 지도

| 파일 | 내용 |
|---|---|
| `app.js` | 수업 **중간 단계** — pug 렌더링, JSON API, MySQL 단일 커넥션 ⚠️ 미완성 |
| `app-mysql.js` | **완성 지향 버전** — 모듈 분리 + 커넥션 풀 + `async/await` CRUD ⚠️ 모듈 누락 |
| `sql.md` | INSERT / SELECT / DELETE / UPDATE 문법 정리 |
| `public/html/callback.html` | 콜백 중첩으로 짠 조회 로직 (콜백 지옥) |
| `public/html/callback_promise.html` | 같은 로직을 Promise 체인으로 |
| `public/html/callback_async.html` | 같은 로직을 `async/await` 로 |
| `public/html/user.html`, `public/js/user*.js` | 프론트에서 API 호출 |
| `views/block.pug` | pug 상속(`block`) 예제 |
| `views/sql/insert.pug` · `list.pug` · `update.pug` | CRUD 화면 |
| `views/sql/insert_poll.pug` | 커넥션 풀 버전 입력 화면 |

## 실행 방법

MySQL이 필요합니다. **포트 3307**, DB 이름 `node_db` 를 기본값으로 씁니다.

```bash
docker run -d --name nodestudy-mysql -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=원하는비밀번호 -e MYSQL_DATABASE=node_db mysql:8
```

테이블을 먼저 만듭니다.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  age INT,
  create_date DATETIME
);
```

```bash
cd 03.node_ex
npm install
cp .env.example .env    # DB 접속정보 입력
node app.js             # ⚠️ 지금은 SyntaxError 로 즉시 중단됩니다 — 연습 과제 2번을 먼저 하세요
```

비동기 예제(`public/html/callback*.html`)는 서버 없이 브라우저로 열어 콘솔만 봐도 됩니다.

## 짚고 갈 지점

### 같은 로직, 세 가지 비동기 스타일

`public/html/` 의 세 파일은 **완전히 같은 일**(이름으로 사용자를 찾고 → 그 id로 나이를 찾기)을 서로 다른 방식으로 씁니다. 순서대로 열어 비교하세요.

```js
// callback.html — 콜백이 콜백을 부른다
findeUser("홍길동", (err, result) => {
  if(err) console.log(err);
  else findeAge(result[0].id, (err, result) => {
    if(err) console.log(err);
    else console.log(result);
  });
});
```

들여쓰기가 오른쪽으로 계단처럼 밀리는 것이 보이시나요. 단계가 하나 늘 때마다 한 칸씩 더 밀립니다. 이게 **콜백 지옥**이고, Promise와 `async/await` 가 나온 이유입니다.

### SQL 인젝션을 막는 법

```js
// 위험 — 사용자 입력이 SQL 문자열에 그대로 박힌다
let sql = `INSERT INTO users SET name="${name}", age="${age}"`;

// 안전 — 값을 따로 넘기면 드라이버가 이스케이프한다
var sql = "INSERT INTO users SET username=?, age=?, wdate=?";
var sqlVals = [username, age, wdate];
connection.query(sql, sqlVals, (err, results) => { ... });
```

`app.js` 에는 **위험한 버전이 주석으로** 남아 있고 아래에 안전한 버전이 있습니다. 왜 바꿨는지 생각해 보세요. `name` 자리에 `"; DROP TABLE users; --` 를 넣으면 어떻게 될까요.

### 커넥션 하나 vs 커넥션 풀

```js
// app.js — 요청마다 connect() / end()
connection.connect();
connection.query(...);
connection.end();

// app-mysql.js — 풀에서 빌려 쓰고 반납
const connect = await conn.getConnection();
const result = await connect.query(sql, sqlVals);
connect.release();
```

DB 연결은 비쌉니다. 요청마다 새로 맺으면 동시 접속이 몰릴 때 버티지 못합니다. 풀은 연결을 미리 만들어 두고 **빌려주고 반납받는** 방식입니다. `release()` 를 빠뜨리면 풀이 고갈되어 서버가 멈춥니다 — 흔한 실수입니다.

### `mysql` 과 `mysql2`, 무엇이 다른가

`package.json` 에 둘 다 들어 있습니다. `mysql2` 는 `mysql` 과 API 호환이면서 **Promise 인터페이스를 제공**합니다.

```js
const mysql = require('mysql2/promise');   // ← 이 경로가 핵심
const result = await conn.query(sql);      // 콜백 없이 await
```

`app-mysql.js` 가 `async/await` 를 쓸 수 있는 건 `mysql2/promise` 덕분입니다.

### pug — 서버에서 HTML을 그린다

```js
app.set("view engine", "pug");
app.set("views", "./views");
res.render("sql/list", {tit:"데이터 출력", datas: rows});
```

`res.send()` 가 문자열을 그대로 보내는 것과 달리, `res.render()` 는 템플릿에 데이터를 끼워 넣어 HTML을 만들어 보냅니다. `app.locals.pretty = true` 를 켜면 출력 HTML이 들여쓰기되어 읽기 좋아집니다.

## 알려진 결함

수업 진행 중 남은 상태 그대로입니다. **고치는 것이 과제입니다.**

| 위치 | 문제 |
|---|---|
| `app.js` `insertFn()` — **구문 오류** | `save` 분기의 `let age` 와 `save-pool` 분기의 `var age` 가 **같은 블록 안에서 충돌**합니다. `switch` 의 `case` 들은 별도 스코프가 아니라 하나의 블록을 공유하기 때문입니다. → `SyntaxError: Identifier 'age' has already been declared` 로 **파일 전체가 로드되지 않습니다** |
| `app.js` `insertFn()` — `save` 분기 | 위 구문 오류를 고쳐도 남는 문제입니다. `sqlVals = [username, age, wdate]` 에서 `username`·`wdate` 가 **정의되지 않았습니다.** 바로 위에서 읽은 건 `name` 인데 다른 이름을 씁니다. 아래 `save-pool` 분기의 `var` 변수가 호이스팅되어 `undefined` 로 들어갑니다 |
| `app.js` `insertFn()` — `save-pool` 분기 | `conn` 이 이 파일에 없습니다. `04.node_router/modules/mysql-conn.js` 에 있는 것을 쓰려던 흔적입니다 |
| `app.js` `/pug/include` 라우트 | `res.render("include", ...)` 를 호출하는데 `views/include.pug` 가 없습니다 (`block.pug` 만 있음) |
| `app-mysql.js` | `./modules/mysql-conn`, `./modules/util-loc`, `./modules/util-doc` 를 `require` 하는데 **이 챕터에 `modules/` 폴더가 없습니다.** 세 파일 모두 `04.node_router/modules/` 에 있습니다 |

## 지금은 이렇게 바뀌었습니다

- `body-parser` 는 Express 4.16+ 에 내장입니다 → `express.urlencoded({extended:false})`
- `mysql` (1세대) 패키지는 사실상 유지보수가 멈췄습니다. 새로 짠다면 `mysql2` 하나만 쓰세요.
- 날짜를 `"2019-11-03 11:55:24"` 처럼 문자열 상수로 박아 넣은 부분이 있습니다. MySQL의 `NOW()` 를 쓰거나, 컬럼을 `DEFAULT CURRENT_TIMESTAMP` 로 정의하는 편이 낫습니다.

## 연습 과제

1. `app-mysql.js` 가 동작하도록 `04.node_router/modules/` 의 세 파일을 이 챕터로 가져오거나, `require` 경로를 고치세요.
2. `app.js` 의 구문 오류를 고치세요. `switch` 의 각 `case` 를 중괄호 `{ }` 로 감싸 블록 스코프를 만들어 주는 것이 정석입니다. 고친 뒤 `node --check app.js` 로 확인하세요. 이어서 `save` 분기의 변수 이름을 맞춰 저장이 되게 하세요.
3. `views/include.pug` 를 만들어 `/pug/include` 라우트를 살리세요. pug의 `include` 문법을 찾아 쓰세요.
4. `callback.html` 의 로직을 `callback_promise.html` → `callback_async.html` 순으로 직접 다시 써 보세요 (파일을 보지 말고).
5. `create_date` 를 하드코딩된 문자열 대신 MySQL `NOW()` 로 바꾸세요.
6. `app-mysql.js` 의 `"DELETE FROM users WHERE id="+id` 와 `"SELECT * FROM users WHERE id="+id` 는 위에서 배운 파라미터 바인딩을 쓰지 않고 **문자열을 그대로 잇고 있습니다.** `?` 바인딩으로 고치세요. 같은 파일의 `save`/`update` 분기는 이미 제대로 하고 있으니 비교해 보세요.
