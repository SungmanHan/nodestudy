# 10.mongodb — MongoDB · Mongoose 입문

> 학습 순서 **10번**. 관계형 DB(MySQL)에서 문서형 DB(MongoDB)로 넘어갑니다.

## ⚠️ 껍데기 상태입니다

Express 골격만 세우고 **MongoDB 연결을 시작하다 만 챕터**입니다. 실행은 되지만 DB에는 붙지 않습니다.

- `schemas/index.js` — 연결 함수 `connect` 를 정의만 하고 **호출하지 않습니다**
- `schemas/user.js` — **빈 파일**입니다
- `app.js` — `schemas` 를 아예 `require` 하지 않습니다

완성된 형태는 다음 챕터 [`13.sns`](../13.sns/) 에 있습니다. **이 챕터는 MongoDB 자체를 익히는 데 쓰고, Mongoose 코드는 13번에서 보세요.**

## 학습 목표

- MongoDB를 설치하고 셸로 접속해 CRUD를 직접 해 본다
- 컬렉션(collection)과 도큐먼트(document)가 테이블·행과 어떻게 다른지 안다
- Mongoose로 Node에서 MongoDB에 연결한다
- Replica Set과 Sharding의 개념을 맛본다

## 파일 지도

| 경로 | 역할 |
|---|---|
| `mongodb-cheatsheet.md` | ★ **MongoDB 셸 명령 정리** — 설치·CRUD·Replica·Sharding |
| `app.js` | Express 골격 (generator 기본) |
| `bin/www` | 서버 구동 (포트 3000) |
| `schemas/index.js` | Mongoose 연결 ⚠️ 미완성 |
| `schemas/user.js` | ⚠️ 빈 파일 |
| `routes/index.js` · `users.js` | generator 기본 라우터 |

## 실행 방법

**MongoDB 띄우기** — 수업은 포트 **15000** 을 썼습니다.

```bash
docker run -d --name nodestudy-mongo -p 15000:27017 mongo:7
```

**셸 접속** (여기서 `mongodb-cheatsheet.md` 의 명령을 따라 해 보세요)

```bash
docker exec -it nodestudy-mongo mongosh
```

**Express 서버** (DB 연결은 아직 안 됩니다)

```bash
cd 10.mongodb
npm install
npm start        # http://127.0.0.1:3000
```

## 짚고 갈 지점

### MySQL과 MongoDB, 용어 대응

| MySQL | MongoDB |
|---|---|
| 데이터베이스 | 데이터베이스 |
| 테이블 | 컬렉션(collection) |
| 행(row) | 도큐먼트(document) |
| 열(column) | 필드(field) |
| `JOIN` | `$lookup` (또는 문서 안에 중첩) |

가장 큰 차이는 **스키마가 고정되어 있지 않다**는 점입니다. 같은 컬렉션 안에서 도큐먼트마다 필드가 달라도 됩니다.

```js
db.users.insertMany([
	{name: "홍길동", grade: 9},
	{name: "홍길순", grade: 9, company: {name: "홍기업", tel: "02-2222-3333"}},
])
```

두 번째 문서에만 `company` 가 있고, 그 안에 또 객체가 중첩돼 있습니다. MySQL이라면 테이블을 나누고 JOIN해야 할 구조입니다.

이 자유로움에는 대가가 있습니다 — **DB가 데이터 모양을 보장해 주지 않으므로** 애플리케이션이 책임져야 합니다. 그래서 Mongoose 같은 라이브러리가 스키마를 애플리케이션 층에서 강제합니다.

### SQL ↔ MongoDB 쿼리 대응

```sql
SELECT * FROM users WHERE name = "홍길동" AND grade > 8
```

```js
db.users.find({ name: "홍길동", grade: { $gt: 8 } })
```

`$gt`, `$lt`, `$in`, `$set` 같은 **`$` 로 시작하는 연산자**가 SQL의 키워드 자리를 대신합니다. 전체 목록은 `mongodb-cheatsheet.md` 를 보세요.

### Replica Set — 복제로 장애에 대비한다

같은 데이터를 여러 서버에 복제해 두고, 하나가 죽으면 나머지가 이어받습니다. `mongodb-cheatsheet.md` 에 3개 노드를 띄워 `rs.initiate()` 로 묶는 실습이 있습니다.

### Sharding — 분할로 규모를 늘린다

데이터를 여러 서버에 나눠 저장해 한 대가 감당 못 할 양을 처리합니다. Replica가 **같은 데이터를 복사**하는 것이라면 Sharding은 **다른 데이터를 나눠 갖는** 것입니다.

## 알려진 결함

`schemas/index.js` 한 파일에 세 가지 문제가 있습니다. **찾아보고 고치는 것이 이 챕터의 과제입니다.**

```js
const mongoose = require("mongoose");
module.exports = () => {
    const connect = () => {
        mongoose.connect("mongodb://db:00000@localhostL15000/admin",{
            adName:"db"
        })
    }
}
```

<details>
<summary>답 보기</summary>

1. `connect` 를 **정의만 하고 호출하지 않습니다.** 아래에 `connect();` 가 있어야 합니다.
2. 접속 문자열이 `localhostL15000` — 콜론(`:`)이 대문자 `L` 로 잘못 들어갔습니다.
3. 옵션 이름이 `adName` — `dbName` 의 오타입니다.

추가로 `app.js` 가 `require("./schemas")()` 를 하지 않아, 고쳐도 호출되지 않습니다. `13.sns/app.js` 와 비교해 보세요.
</details>

## 지금은 이렇게 바뀌었습니다

- `mongo` 셸은 폐기되고 **`mongosh`** 로 대체되었습니다. `mongodb-cheatsheet.md` 의 `mongo --port 15000` 은 `mongosh --port 15000` 으로 읽으세요.
- Mongoose 6부터 `useNewUrlParser`, `useUnifiedTopology` 같은 옵션이 필요 없어졌습니다 (지정하면 경고가 납니다).
- `mongoose.connect()` 가 Promise를 반환합니다. 콜백 인자는 Mongoose 7에서 제거되었습니다.

  ```js
  await mongoose.connect(uri, { dbName: "booldook" });
  ```
- Windows 경로 기준으로 적힌 설치 안내(`c:\program files\...`)는 Docker로 대체하는 편이 훨씬 간단합니다.

## 연습 과제

1. `mongodb-cheatsheet.md` 의 CRUD 명령을 `mongosh` 에서 전부 따라 해 보세요.
2. `schemas/index.js` 의 결함 3개를 고치고, `app.js` 에서 호출해 실제로 연결되는지 확인하세요. 연결 성공/실패 로그를 남기세요.
3. `schemas/user.js` 를 채우세요. `13.sns/schemas/user.js` 를 참고하되, 먼저 직접 써 보세요.
4. `routes/users.js` 에 목록 조회와 등록 라우트를 붙여 이 챕터만으로 CRUD가 돌게 만드세요.
5. `db.users.find({ grade: { $gt: 8 } })` 를 SQL로 옮기면 어떻게 되나요? 반대로 `SELECT ... ORDER BY grade DESC LIMIT 5` 는 MongoDB로 어떻게 쓰나요?
