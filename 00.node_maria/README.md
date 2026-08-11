# 00.node_maria — MariaDB 연결 (중단된 실습)

> **학습 순서에서 제외된 챕터입니다.** 폴더 번호가 `00` 이라 맨 앞에 보이지만, 내용상 여기서 시작하면 안 됩니다.

## ⚠️ 실행하면 즉시 죽습니다

```
Error: Cannot find module './public/js/pw-chagne'
```

라우터로 쓰려던 파일 5개가 **전부 0바이트 빈 파일**이고, `require` 경로에도 오타가 있습니다. 손대다 만 껍데기입니다.

**MariaDB/MySQL 연동을 배우려면 [`03.node_ex`](../03.node_ex/) → [`04.node_router`](../04.node_router/) 로 가세요.** 완성된 코드가 거기 있습니다.

## 그럼 이 폴더는 왜 남겨 두었나

**깨진 코드도 읽을 가치가 있기 때문입니다.** 짧은 파일 하나에 초보자가 자주 겪는 실수가 네 종류나 들어 있습니다. 찾아보세요.

```js
const express = require("express");
const app = express();
const mysql =  require("mysql");

const login = require("./public/js/login");
const join = require("./public/js/join");
const pwChange = require("./public/js/pw-chagne");
const sad = require("./public/js/show-all-data");
const deleteInfo = require("./public/js/delte-info");

app.use("/login", login);
app.use("/join", join);
// ...

app.listen(4444, () => console.log("http://127.0.0.1:4444"));

app.get("/", (req, res, next) => {
    var con = mysql.createConnection({
        host: 'localhost',
        post: 4444,
        user: "sungman",
        password: "qwer1234",
        database: "mytable"
    });
    con.connect();
    con.end();
});
```

<details>
<summary>답 보기</summary>

**1. 존재하지 않는 파일을 `require` 한다**

`./public/js/pw-chagne` — 실제 파일은 `pw-change.js` 입니다. `chagne` ↔ `change`. 이 한 글자 때문에 서버가 시작조차 못 합니다.
(`delte-info` 는 **파일명 자체가 `delte-info.js`** 라 오타끼리 우연히 맞아 통과합니다.)

**2. 라우터 파일이 전부 비어 있다**

`public/js/` 의 5개 파일이 모두 0바이트입니다. 오타를 고쳐도 `app.use()` 에 `undefined` 가 들어가 다음 에러가 납니다. `express.Router()` 를 만들어 `module.exports` 해야 합니다.

**3. 라우터를 `public/` 안에 두었다**

`public/` 은 `express.static` 으로 **브라우저에 그대로 노출되는** 폴더입니다. 서버 코드를 여기 두면 누구나 소스를 내려받을 수 있습니다. DB 접속정보가 들어 있다면 그대로 유출됩니다. 서버 라우터는 `routes/` 나 `router/` 에 두어야 합니다 — 다른 챕터들이 그렇게 합니다.

**4. `post: 4444`**

`port` 의 오타입니다. 게다가 값이 **Express 서버 포트와 같습니다.** MySQL 포트여야 하는 자리인데(다른 챕터는 3307) 웹 서버 포트를 적었습니다. 오타 덕분에 이 옵션은 무시되고 기본값 3306이 쓰입니다 — 틀린 설정이 오타 덕에 안 터지는, 더 나쁜 상황입니다.

**보너스: 연결하고 아무것도 안 한다**

`con.connect()` 직후 `con.end()` 입니다. 쿼리가 없고, `res` 로 응답도 하지 않아 요청이 그대로 멈춥니다(타임아웃).
</details>

## 무엇을 얻어 갈 수 있나

| 실수 | 다른 챕터에서는 어떻게 하나 |
|---|---|
| 서버 코드를 `public/` 에 둠 | `routes/` · `router/` 에 분리 (`04.node_router`) |
| 요청마다 DB 연결 | 커넥션 풀 (`04.node_router/modules/mysql-conn.js`) |
| 접속정보 하드코딩 | `.env` 로 분리 (이 저장소 전체) |
| 오타로 조용히 무시되는 옵션 | — 그래서 오타에 민감해져야 합니다 |

## 연습 과제

굳이 살릴 필요는 없지만, 해 보고 싶다면:

1. `require` 경로 오타를 고치세요.
2. `public/js/` 의 파일들을 `routes/` 로 옮기고, 각각 `express.Router()` 를 내보내도록 채우세요.
3. DB 연결을 라우트 안이 아니라 모듈로 빼고 커넥션 풀로 바꾸세요. `04.node_router/modules/mysql-conn.js` 를 참고하세요.
4. `post: 4444` 를 올바른 MySQL 포트로 고치세요.
5. 로그인·회원가입·비밀번호 변경·전체조회·삭제 5개 기능을 실제로 구현하세요. `09.session` 이 좋은 참고가 됩니다.
