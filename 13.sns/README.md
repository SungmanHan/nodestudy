# 13.sns — Mongoose CRUD 종합

> 학습 순서 **11번**. 이 저장소의 마지막 백엔드 챕터이자, `10.mongodb` 에서 시작만 했던 MongoDB 연동의 **완성본**입니다.

## 학습 목표

- Mongoose 스키마와 모델을 정의한다
- 연결 끊김을 감지해 **자동으로 재연결**한다
- Mongoose 모델로 CRUD를 짠다 (`find` / `save` / `remove`)
- 프론트에서 axios로 API를 호출해 폼을 채운다 (수정 흐름)

## 파일 지도

| 경로 | 역할 |
|---|---|
| `app.js` | Express 골격 + `require("./schemas")()` 로 Mongo 연결 |
| `bin/www` | 서버 구동 (포트 3000) |
| `schemas/index.js` | ★ 연결 + 에러·끊김 이벤트 핸들링 |
| `schemas/user.js` | ★ 스키마 · 모델 정의 |
| `routes/users.js` | ★ CRUD 라우터 |
| `routes/index.js` | 홈 |
| `views/save.pug` | 목록 + 등록/수정 폼 |
| `public/javascripts/save.js` | axios로 회원 정보를 불러와 폼에 채움 |

> MongoDB 셸 명령 정리는 [`10.mongodb/mongodb-cheatsheet.md`](../10.mongodb/mongodb-cheatsheet.md) 에 있습니다.

## 실행 방법

```bash
docker run -d --name nodestudy-mongo -p 15000:27017 mongo:7

cd 13.sns
npm install
cp .env.example .env      # MongoDB 접속정보 입력
npm start                 # http://127.0.0.1:3000
```

`http://127.0.0.1:3000/users` 에서 등록·목록·삭제를 해 보세요.

## 짚고 갈 지점

### 연결은 한 번, 재연결은 자동으로

```js
module.exports = () => {
	const connect = () => {
		mongoose.connect(uri, { dbName: "..." }, (err) => {
			if(err) console.error("몽고디비 연결 오류", err);
			else console.log("몽고디비 연결 성공");
		})
	}
	connect();                                    // ← 10.mongodb 에는 이 줄이 없었다

	mongoose.connection.on("error", (err) => {
		console.error("MongooseERROR", err);
	});

	mongoose.connection.on("disconnected", () => {
		console.error("MongooseDisconnection");
		connect();                                // ← 끊기면 다시 연결
	});
}
```

`10.mongodb/schemas/index.js` 와 나란히 놓고 보세요. 무엇이 더해졌는지가 이 챕터의 핵심입니다.

**연결은 앱 시작할 때 한 번만** 합니다. 요청마다 연결하지 않습니다 — Mongoose가 내부적으로 커넥션 풀을 관리하기 때문입니다. `04.node_router` 의 MySQL 풀과 같은 개념입니다.

### 스키마 — 애플리케이션이 데이터 모양을 강제한다

```js
const userSchema = new Schema({
	userid:   { type: String, required: true, unique: true },
	username: { type: String, required: true },
	createAt: { type: Date, default: Date.now() },
});
module.exports = mongoose.model("User", userSchema);
```

MongoDB 자체는 스키마가 없지만, Mongoose가 **저장 전에 검사**해 줍니다. `required`, `unique`, `default` 가 그 장치입니다.

> ⚠️ `default: Date.now()` — **괄호가 붙어 있습니다.** 이러면 서버가 켜지는 순간의 시각이 한 번 계산되어 **모든 문서가 같은 시각**을 갖습니다. 괄호 없이 `default: Date.now` 로 **함수 자체를 넘겨야** 문서마다 저장 시점이 찍힙니다. 흔하고 찾기 어려운 버그입니다.

> `mongoose.model("User", ...)` 로 등록하면 실제 컬렉션 이름은 **소문자 복수형인 `users`** 가 됩니다. Mongoose가 자동으로 변환합니다.

### CRUD — Promise와 async/await가 섞여 있다

```js
// Promise 체인
router.get("/", (req, res, next) => {
  User.find({})
    .then((result) => { res.render("save.pug", {title:"회원가입", userLists: result}); })
    .catch((err) => { next(err); });
})

// async/await (IIFE로 감쌈)
router.get("/rv/:id", (req, res, next) => {
  (async () => {
    try { await User.remove({_id: req.params.id}); res.redirect("/users"); }
    catch (err) { next(err); }
  })();
})
```

두 스타일이 한 파일에 공존합니다. 수업이 진행되며 스타일이 바뀐 흔적입니다. **하나로 통일하는 것이 연습 과제 3번입니다.**

`(async () => { ... })()` 로 감싼 이유는 Express 4의 라우트 핸들러가 `async` 함수의 거절(rejection)을 자동으로 잡아 주지 않기 때문입니다. Express 5부터는 핸들러를 그냥 `async` 로 선언해도 됩니다.

### 에러는 `next(err)` 로 넘긴다

`catch` 안에서 직접 응답하지 않고 `next(err)` 를 부릅니다. 그러면 `app.js` 맨 아래의 **에러 핸들러 미들웨어**가 받아 `error.pug` 를 렌더합니다. 에러 처리를 한 곳으로 모으는 방식입니다.

### 프론트에서 API 호출하기

```js
function userChg(id) {
	axios.get("/users/li/" + id)
	.then(function(result){
		var f = document.querySelector("#userForm");
		f.userid.value = result.data[0].userid;
		f._id.value = result.data[0]._id;
		f.action = "/users/chg";      // ← 폼의 목적지를 수정용으로 바꾼다
	})
}
```

목록에서 "수정"을 누르면 서버에서 해당 회원 정보를 JSON으로 받아 폼을 채우고, 폼의 `action` 을 등록용에서 수정용으로 바꿉니다. 등록 폼 하나를 수정에도 재사용하는 흔한 방법입니다.

## 알려진 결함

| 위치 | 문제 |
|---|---|
| `routes/users.js` | 폼이 보내는 `/users/chg` (수정) 라우트가 **없습니다.** `save.js` 가 `f.action` 을 거기로 바꾸지만 서버에 받는 쪽이 없어 404가 납니다 |
| `schemas/user.js` | `default: Date.now()` — 괄호 때문에 모든 문서가 같은 시각을 갖습니다 |
| `public/javascripts/save.js` | `.catch(function(error) { console.log(err); })` — 매개변수는 `error` 인데 `err` 를 출력합니다. 에러가 나면 **에러 처리 코드 자체가 에러를 냅니다** |
| `schemas/user.js` | 필드명이 `createAt` — `createdAt` 의 오타로 보입니다 |

## 지금은 이렇게 바뀌었습니다

- **`Model.remove()` 는 Mongoose 7에서 제거되었습니다.** `deleteOne()` / `deleteMany()` 를 쓰세요.

  ```js
  await User.deleteOne({ _id: id });
  ```
- `mongoose.connect()` 의 **콜백 인자도 제거되었습니다.** Promise로 받으세요.

  ```js
  try { await mongoose.connect(uri, { dbName: "..." }); console.log("연결 성공"); }
  catch (err) { console.error("연결 오류", err); }
  ```
- `timestamps: true` 옵션을 주면 `createdAt`/`updatedAt` 을 Mongoose가 알아서 관리합니다. 직접 `createAt` 필드를 두지 않아도 됩니다.

  ```js
  new Schema({ userid: ..., username: ... }, { timestamps: true });
  ```
- axios는 여전히 쓰지만, 브라우저 내장 `fetch` 로도 충분합니다.

## 연습 과제

1. `Model.remove()` 를 `deleteOne()` 으로 바꾸세요.
2. `schemas/user.js` 의 `default: Date.now()` 괄호를 없애고, 문서 두 개를 시간 차를 두고 저장해 `createAt` 이 달라지는지 확인하세요.
3. `routes/users.js` 의 Promise 체인과 `async/await` 를 **하나의 스타일로 통일**하세요.
4. 빠져 있는 `POST /users/chg` (수정) 라우트를 만들어 수정 기능을 완성하세요.
5. `save.js` 의 `catch` 매개변수 오타를 고치세요.
6. 스키마에 `timestamps: true` 를 적용하고 `createAt` 필드를 제거하세요.
7. `09.session` 의 로그인을 이 챕터에 붙여, 로그인한 사용자만 회원 목록을 볼 수 있게 만드세요.
