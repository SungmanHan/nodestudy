# 04.node_router — 라우터 분리 · REST · Sequelize

> 학습 순서 **6번**. 이 저장소에서 가장 내용이 많은 챕터입니다. 앞에서 배운 것이 여기 모입니다.

## 학습 목표

- 라우터를 기능별 파일로 나누고 `app.use()` 로 마운트한다
- **같은 URL, 다른 HTTP 메서드**로 CRUD를 구분하는 REST 방식을 익힌다
- HTML 폼은 GET/POST만 보낼 수 있다 — `method-override` 로 PUT/DELETE를 흉내 낸다
- 접속 설정·유틸을 `modules/` 로 빼서 재사용한다
- 생 SQL(`mysql2`)과 ORM(`Sequelize`)으로 **같은 CRUD를 두 번** 짜 본다
- `morgan` + `rotating-file-stream` 으로 접속 로그를 날짜별 파일에 남긴다

## 파일 지도

```
app.js                      미들웨어 등록 + 라우터 5개 마운트
router/
  board.js   /board         스텁 (연습용 빈 라우터)
  admin.js   /admin         스텁
  rest.js    /rest          ★ 생 SQL 로 짠 REST CRUD
  api.js     /api           JSON API
  seq.js     /seq           ★ Sequelize(ORM) 로 짠 같은 CRUD
modules/
  mysql-conn.js             mysql2 커넥션 풀 + sqlExec 헬퍼
  sequelize-conn.js         Sequelize 인스턴스 + 접속 확인
  util-doc.js               날짜 포맷 (zp / isoDate / jsToiso)
  util-loc.js               alert 후 이동시키는 HTML 생성
models/
  User.js                   Sequelize 모델 — class + init 방식
  Scores.js                 Sequelize 모델 — 성적 테이블
views/
  layout/default-layout.pug 공통 레이아웃
  layout/rest-layout.pug    REST 화면용 레이아웃
  rest/crud.pug             CRUD 화면
  inc/header.pug            공통 헤더
  error.pug                 에러 화면
public/js/script.js         폼 전송
public/js/script-ajax.js    ajax 전송
```

## 실행 방법

MySQL이 필요합니다. **포트 3307**, DB 이름 `node_db`.

```bash
docker run -d --name nodestudy-mysql -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=원하는비밀번호 -e MYSQL_DATABASE=node_db mysql:8
```

`/rest` 는 `rest` 테이블을 직접 씁니다. 미리 만들어야 합니다.

```sql
CREATE TABLE rest (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  wdate DATETIME
);
```

`/seq` 가 쓰는 테이블은 Sequelize가 `sync()` 로 알아서 만듭니다.

```bash
cd 04.node_router
npm install
cp .env.example .env     # DB 접속정보 입력
node app.js              # http://127.0.0.1:3000
```

| 경로 | 무엇을 보나 |
|---|---|
| `/rest` | 생 SQL CRUD 화면 |
| `/seq` | Sequelize CRUD (JSON 응답) |
| `/api` | JSON API |
| `/board`, `/admin` | 빈 스텁 |

## 짚고 갈 지점

### REST — URL은 하나, 메서드로 구분한다

```js
router.get("/",    ...);   // 조회
router.post("/",   ...);   // 생성
router.put("/",    ...);   // 수정
router.delete("/", ...);   // 삭제
```

앞 챕터에서는 `/user/wr`, `/user/li`, `/user/rm` 처럼 **URL에 동작을 넣었습니다**(`03.node_ex/app-mysql.js`). REST는 URL이 **자원(resource)** 을 가리키고, 무엇을 할지는 HTTP 메서드가 말합니다. 두 챕터를 나란히 놓고 비교해 보세요.

### 그런데 HTML 폼은 PUT/DELETE를 못 보낸다

브라우저 `<form>` 의 `method` 는 `GET` 과 `POST` 뿐입니다. 그래서 `method-override` 를 씁니다.

```js
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
}));
```

폼에 `<input type="hidden" name="_method" value="PUT">` 을 넣어 POST로 보내면, 이 미들웨어가 가로채 **PUT 요청인 것처럼** 바꿔 줍니다. `views/rest/crud.pug` 에서 실제로 어떻게 쓰는지 확인하세요.

> 미들웨어를 `X-HTTP-Method`, `X-HTTP-Method-Override`, `X-Method-Override` 헤더용으로 세 번 더 등록해 둔 것은 Microsoft·Google·IBM이 각자 다른 헤더 이름을 썼던 역사 때문입니다.

### 생 SQL vs ORM — 같은 CRUD를 두 번

**`router/rest.js` (mysql2, 생 SQL)**

```js
sql = "INSERT INTO rest SET username=?, wdate=?";
vals = [username, wdate];
result = await sqlExec(sql, vals);
if (result[0].affectedRows > 0) { ... }
```

**`router/seq.js` (Sequelize, ORM)**

```js
let result = await User.create({ username: req.body.username });
res.json(result);
```

ORM은 SQL을 대신 만들어 주고 결과를 객체로 돌려줍니다. 짧고 DB 종류에 덜 묶입니다. 대신 **어떤 SQL이 나가는지 눈에 보이지 않아** 성능 문제를 놓치기 쉽습니다. 둘 다 쓸 줄 알아야 하는 이유입니다.

### 커넥션 풀 헬퍼

```js
const sqlExec = async (sql, sqlVals) => {
	try {
		const connect = await conn.getConnection();
		const result = await connect.query(sql, sqlVals);
		connect.release();        // ← 반드시 반납
		return result;
	}
	catch(error) { console.log(error); }
}
```

이 헬퍼 하나로 모든 라우터가 DB를 씁니다. 반복되는 연결/반납 코드를 한 곳에 모은 것입니다.

> ⚠️ `release()` 가 `try` 블록 안에 있습니다. `query` 가 예외를 던지면 **반납되지 않고 풀이 새어 나갑니다.** `finally` 로 옮기는 것이 맞습니다 — 연습 과제 2번.

### 접속 로그를 파일로 남기기

```js
let accessLogStream = rfs('access.log', { interval: '1d', path: logDirectory });
app.use(morgan('combined', { stream: accessLogStream }))
```

`morgan` 은 요청 로그를 찍고, `rotating-file-stream` 은 그것을 **하루 단위로 파일을 갈아 끼우며** 저장합니다. 실행하면 `log/` 폴더가 생깁니다 (`.gitignore` 처리됨).

### Sequelize 모델 정의 — 두 가지 방식

이 챕터의 `models/User.js` 는 **class + `init`** 방식입니다.

```js
class User extends Model {}
User.init({ username: {type: Sequelize.STRING, allowNull: false} },
          { sequelize, modelName: "userlists" });
User.sync({force: false});
```

다음 챕터 `06.express-gen` 은 **`sequelize.define`** 방식을 씁니다. 결과는 같고 취향 차이입니다. 둘 다 보고 나서 마음에 드는 쪽을 쓰세요.

> `sync({force: true})` 는 **테이블을 지우고 다시 만듭니다.** 개발 중에도 데이터가 날아가므로 조심하세요. 코드에 주석으로 경고가 달려 있습니다.

## 지금은 이렇게 바뀌었습니다

- `body-parser` → Express 내장 `express.json()` / `express.urlencoded()`
- Sequelize 6부터 `Sequelize.TINYINT` 같은 타입은 `DataTypes.TINYINT` 로 접근합니다.
- `router/rest.js` 의 `sql`, `result`, `username`, `id` 는 **모듈 최상위에 선언된 공유 변수**입니다. 요청이 동시에 들어오면 서로 값을 덮어씁니다. 지금이라면 각 핸들러 안에서 `const` 로 선언합니다 — 연습 과제 3번.
- `DELETE` 분기의 `"DELETE FROM rest WHERE id=" + id` 는 문자열 연결입니다. 같은 파일의 다른 분기는 `?` 바인딩을 쓰는데 여기만 빠졌습니다.
- `modules/util-doc.js` 의 `isoDate(d, 1)` 은 원래 `2019-11-03 -11:55:24` 처럼 **시각 앞에 하이픈이 하나 더** 붙어 나왔습니다. 같은 파일 상단 주석이 규정한 형식(`2019-11-03 11:11:11`)과 어긋나는 오타여서 바로잡았습니다.

## 연습 과제

1. `router/board.js` 와 `admin.js` 는 빈 스텁입니다. `rest.js` 를 참고해 게시판 CRUD를 직접 채우세요.
2. `modules/mysql-conn.js` 의 `release()` 를 `finally` 블록으로 옮겨, 쿼리가 실패해도 커넥션이 반납되게 고치세요.
3. `router/rest.js` 최상위의 공유 변수들을 각 핸들러 안으로 옮기세요. 왜 위험한지 설명할 수 있어야 합니다.
4. `DELETE` 분기의 문자열 연결을 `?` 파라미터 바인딩으로 바꾸세요.
5. `models/Scores.js` 는 정의만 되어 있고 아무 라우터도 쓰지 않습니다. `/seq/scores` 라우트를 만들어 성적 CRUD를 붙이세요.
6. `/rest` 와 `/seq` 를 각각 호출하면서 MySQL 로그를 켜 두고, **실제로 나가는 SQL이 어떻게 다른지** 비교하세요.
