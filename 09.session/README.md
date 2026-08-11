# 09.session — 세션 · 쿠키 로그인

> 학습 순서 **9번**. "로그인 상태"를 서버가 어떻게 기억하는지 배웁니다.

## 학습 목표

- HTTP는 상태가 없는데(stateless) 로그인이 유지되는 원리를 안다 — **쿠키 + 세션**
- `express-session` 으로 세션을 만들고, `session-file-store` 로 파일에 저장한다
- 비밀번호를 평문이 아니라 **해시로 저장**한다
- 회원가입 → 로그인 → 로그아웃 전체 흐름을 구현한다
- `config.json` 으로 환경별 DB 설정을 분리한다

## 파일 지도

| 경로 | 역할 |
|---|---|
| `app.js` | 세션 미들웨어 설정 + `sequelize.sync()` |
| `bin/www` | 서버 구동 (포트 3000) |
| `config/config.js` | 환경별 DB 설정 — `.env` 에서 값을 읽는다 |
| `models/index.js` | 모델 로더 + `salt` 상수 |
| `models/Users.js` | `members` 테이블 — `userid`(unique) / `userpw` / `username` |
| `routes/users.js` | ★ 핵심 — 회원가입 · 로그인 · 로그아웃 |
| `routes/index.js` | 홈 |
| `views/join.pug` · `login.pug` | 가입·로그인 폼 |
| `views/layout.pug` · `layout/default.pug` · `inc/header.pug` | 레이아웃 |
| `sessions/` | 세션 파일 저장 위치 (`.gitignore` 처리) |

## 실행 방법

MySQL이 필요합니다. **포트 3307**, DB 이름 `node_db`.

```bash
docker run -d --name nodestudy-mysql -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=원하는비밀번호 -e MYSQL_DATABASE=node_db mysql:8

cd 09.session
npm install
cp .env.example .env      # DB 접속정보 입력
npm start                 # http://127.0.0.1:3000
```

테이블은 `sequelize.sync()` 가 만들어 줍니다.

**해 볼 순서**

1. `/users/join` — 회원가입
2. `/users` — 로그인 폼
3. 로그인 성공 후 `/users` 재접속 → "회원입니다" 표시
4. `/users/logout` — 로그아웃
5. **브라우저 개발자 도구 → Application → Cookies** 에서 `connect.sid` 확인
6. 프로젝트의 `sessions/` 폴더에 생긴 JSON 파일 열어 보기

## 짚고 갈 지점

### 로그인이 유지되는 원리

HTTP는 요청 하나하나가 서로를 모릅니다. 그런데 로그인은 유지됩니다. 어떻게?

```
1. 로그인 성공  → 서버가 세션을 만들고 고유 ID를 발급
2. 서버 → 브라우저에 Set-Cookie: connect.sid=<세션ID>
3. 이후 모든 요청에 브라우저가 자동으로 이 쿠키를 실어 보냄
4. 서버는 세션ID로 저장소를 뒤져 "아, 홍길동이구나" 하고 알아봄
```

**쿠키에는 세션 ID만 들어갑니다.** 사용자 정보 자체는 서버가 들고 있습니다. 그래서 브라우저 쿠키를 뜯어봐도 개인정보가 나오지 않습니다.

```js
app.use(session({
  secret: 'password!!',      // 세션ID 쿠키를 서명하는 키 — 위조 방지용
  resave: false,             // 변경 없으면 다시 저장하지 않음
  saveUninitialized: true,   // 빈 세션도 일단 저장
  store: new sessionStore()  // 저장소 = 파일 (기본값은 메모리)
}))
```

`store` 를 지정하지 않으면 세션이 **메모리**에 저장되어 서버를 재시작할 때 전부 날아갑니다. `session-file-store` 는 `sessions/` 폴더에 JSON으로 남깁니다.

### 세션에 값 넣고 빼기

```js
// 로그인 성공 — 세션에 사용자 정보를 심는다
req.session.user = {};
req.session.user.id = result.id;
req.session.user.userid = result.userid;

// 어디서든 로그인 여부 확인
if(req.session.user) { ... }

// 로그아웃 — 세션 자체를 파기
req.session.destroy((err) => { res.redirect("/users") })
```

### 비밀번호는 되돌릴 수 없게 저장한다

```js
userpw: crypto.createHash("sha512").update(req.body.userpw + salt).digest("base64")
```

가입할 때 해시로 바꿔 저장하고, 로그인할 때 **입력값을 같은 방식으로 해시해서 비교**합니다. 저장된 값에서 원래 비밀번호를 되돌릴 수 없으므로 DB가 유출돼도 비밀번호 자체는 지켜집니다.

```js
// 로그인 — 해시끼리 비교
var result = await Users.findOne({
  where: {
    userid: req.body.userid,
    userpw: crypto.createHash("sha512").update(req.body.userpw + salt).digest("base64")
  }
});
```

> ⚠️ **이 방식은 지금 기준으로는 부족합니다.** 두 가지 문제가 남아 있습니다.
> 1. `salt` 가 **모든 사용자에게 동일**합니다 (원본 코드에는 `models/index.js` 에 `"20191201"` 로 박혀 있었고, 지금은 `.env` 로 옮겼지만 여전히 전역 고정값입니다). salt는 사용자마다 달라야 rainbow table을 막습니다.
> 2. `sha512` 는 **너무 빠릅니다.** 빠르다는 건 공격자가 초당 수십억 번 시도할 수 있다는 뜻입니다. 비밀번호용 해시는 일부러 느려야 합니다.
>
> `07.node/02.crypto.js` 에서 배운 **`pbkdf2` + 사용자별 랜덤 salt** 가 올바른 방향입니다. 지금이라면 `bcrypt` 나 `argon2` 를 씁니다.

### 세션 secret도 소스에 있으면 안 된다

원본 코드는 이랬습니다.

```js
secret: 'password!!'
```

이 값이 유출되면 **세션 쿠키를 위조**해 남의 계정으로 로그인할 수 있습니다. 지금은 `.env` 에서 읽습니다.

```js
secret: process.env.SESSION_SECRET,
```

## 알려진 결함

| 위치 | 문제 |
|---|---|
| `routes/users.js` `/login` | `if(result)` 로 null 검사를 하기 **전에** `console.log(result.userid)` 를 호출합니다. → **비밀번호를 틀리면 서버가 죽습니다** (`Cannot read properties of null`). 디버그 로그를 지우거나 검사 뒤로 옮겨야 합니다 |
| `models/index.js` | `sequelize['import']` 는 Sequelize 6에서 제거되었습니다 |
| `views/join.pug` | 가입 시 비밀번호 확인 입력이 없고, 서버에서도 중복 `userid` 를 미리 검사하지 않아 DB unique 제약 에러가 그대로 터집니다 |

## 지금은 이렇게 바뀌었습니다

- 비밀번호 해시는 `bcrypt` 또는 `argon2` 를 씁니다.

  ```js
  const bcrypt = require('bcrypt');
  const hash = await bcrypt.hash(password, 10);        // 가입
  const ok   = await bcrypt.compare(password, hash);   // 로그인
  ```

  salt를 알아서 만들어 해시 안에 함께 담아 주므로 별도 salt 관리가 필요 없습니다.
- `session-file-store` 는 서버가 여러 대면 세션이 공유되지 않습니다. 실무에서는 Redis(`connect-redis`)를 씁니다.
- 쿠키에 보안 옵션을 겁니다.

  ```js
  cookie: { httpOnly: true, secure: true, sameSite: 'lax' }
  ```

  `httpOnly` 는 JavaScript에서 쿠키를 못 읽게 해 XSS로 세션이 탈취되는 것을 막습니다.
- 세션 대신 JWT를 쓰는 방식도 널리 쓰입니다. 서버가 상태를 안 들고 있어도 되는 대신, 토큰을 즉시 무효화하기 어렵다는 트레이드오프가 있습니다.

## 연습 과제

1. `/login` 의 디버그 `console.log` 를 정리해, 비밀번호를 틀려도 서버가 죽지 않게 고치세요.
2. `salt` 를 사용자마다 다른 랜덤 값으로 바꾸세요. `members` 테이블에 `salt` 컬럼을 추가하고, `07.node/modules/util-cryto.js` 를 참고해 `pbkdf2` 로 교체하세요. 그러면 `.env` 의 `PASSWORD_SALT` 는 필요 없어집니다.
3. 쿠키에 `httpOnly` / `sameSite` 옵션을 걸고, 개발자 도구에서 `document.cookie` 로 세션 쿠키가 읽히는지 확인하세요 (걸기 전후 비교).
4. 로그인해야만 들어갈 수 있는 `/users/mypage` 를 만드세요. **로그인 검사를 미들웨어로 분리**해서 여러 라우트에 재사용하는 것이 핵심입니다.
5. 회원가입 시 아이디 중복을 미리 검사해 사용자에게 안내하세요.
6. 로그인 상태에서 개발자 도구로 `connect.sid` 쿠키를 지우고 새로고침하면 어떻게 되나요? `sessions/` 의 파일도 지우면요?
