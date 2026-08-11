# 06.express-gen — generator 골격 + Sequelize 모델

> 학습 순서 **7번**. `03.express-generator` 골격 위에 Sequelize를 얹는 단계입니다.

## ⚠️ 실행되지 않습니다

`package.json` 의 시작 스크립트는 `node ./bin/www` 인데 **`bin/www` 가 저장소에 없습니다.** 되살리는 방법은 [실행 방법](#실행-방법)에 적었습니다.

> `models/index.js` 가 찾던 `config/config.json` 도 원래 없었습니다. 지금은 `.env` 에서 값을 읽는 `config/config.js` 로 대체해 두었습니다.

## 학습 목표

- Sequelize 모델을 **`sequelize.define`** 방식으로 정의한다 (`04.node_router` 의 class 방식과 비교)
- `models/index.js` 가 모델 파일들을 자동으로 읽어 등록하는 구조를 이해한다
- 환경(`development`/`test`/`production`)별 DB 설정을 `config.json` 으로 분리한다
- `sequelize.sync()` 로 모델 정의에서 테이블을 만든다

## 파일 지도

| 경로 | 역할 |
|---|---|
| `app.js` | 미들웨어 + 라우터 + `sequelize.sync()` |
| `config/config.js` | 환경별 DB 설정 — `.env` 에서 값을 읽는다 |
| `models/index.js` | 모델 자동 로더 — 위 설정을 읽어 Sequelize 인스턴스를 만든다 |
| `models/User.js` | `user_seqs` 테이블 — `username` |
| `models/Score.js` | 성적 테이블 ⚠️ **테이블 이름이 `User.js` 와 같습니다** (아래 참고) |
| `routes/index.js` · `users.js` | 라우터 (generator 기본 상태) |
| `views/index.pug` · `error.pug` | 화면 |
| `README.md` 원본 메모 | 수업 중 정리한 설치 명령 모음 — 아래 [수업 메모](#수업-메모)로 옮겼습니다 |

## 실행 방법

**1) `bin/www` 가져오기**

```bash
cp -r 08.multer/bin 06.express-gen/bin
```

**2) MySQL 준비 + 실행**

```bash
docker run -d --name nodestudy-mysql -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=원하는비밀번호 -e MYSQL_DATABASE=node_db mysql:8

cd 06.express-gen
npm install
cp .env.example .env     # DB 접속정보 입력
npm start                # http://127.0.0.1:3000
```

## 짚고 갈 지점

### 모델을 정의하는 두 번째 방법

```js
// 06.express-gen/models/User.js — define 방식
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_seqs', {
		username: { type: DataTypes.STRING, allowNull: false }
	}, {});
};
```

```js
// 04.node_router/models/User.js — class + init 방식
class User extends Model {}
User.init({ username: {type: Sequelize.STRING, allowNull: false} },
          { sequelize, modelName: "userlists" });
```

`define` 방식은 **함수를 내보내고**, 실제 sequelize 인스턴스는 `models/index.js` 가 나중에 주입합니다. 이 덕분에 모델 파일이 DB 연결을 몰라도 됩니다 — 의존성이 한 방향으로 정리됩니다.

### 모델 자동 로더

```js
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });
```

`models/` 폴더를 훑어서 `.js` 파일을 전부 모델로 등록합니다. 새 모델을 추가할 때 `index.js` 를 고칠 필요가 없어집니다.

> ⚠️ 그런데 바로 아래에서 `db.User`, `db.Score` 를 **수동으로 한 번 더** 등록합니다. 자동 로더가 `sequelize['import']` 때문에 동작하지 않아 손으로 채운 흔적입니다 (아래 참고).

### 환경별 설정 분리

```js
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
```

같은 코드를 개발/테스트/운영에서 각각 다른 DB에 붙이는 표준 방법입니다. `NODE_ENV=production npm start` 로 띄우면 `production` 설정을 씁니다.

**원래는 `config/config.json` 이었습니다.** express-generator + sequelize-cli 조합의 관례입니다. 그런데 JSON에는 비밀번호를 문자열로 적는 수밖에 없고, 그러면 저장소에 그대로 커밋됩니다. 그래서 이 저장소는 `.js` 로 바꿔 `process.env` 에서 읽습니다 — JSON은 값을 계산할 수 없어 확장자를 바꿔야 했습니다.

```js
// config/config.js
username: process.env.DB_USER,
password: process.env.DB_PASSWORD,
```

`.env.example` 을 `.env` 로 복사해 값을 채우세요. `.env` 는 `.gitignore` 에 있어 커밋되지 않습니다.

## 알려진 결함

| 위치 | 문제 |
|---|---|
| `models/Score.js` | 테이블 이름이 `sequelize.define('user_seqs', ...)` — **`User.js` 와 같습니다.** `User.js` 를 복사해 고치다 만 상태라 두 모델이 같은 테이블을 가리킵니다 |
| `models/index.js` | `sequelize['import']` 는 **Sequelize 6에서 제거되었습니다.** 5에서도 deprecated였습니다 |
| `app.js` | `app.use(logger(...))` 를 두 번 등록합니다 — 파일 로그용 `combined` 한 번, 콘솔용 `dev` 한 번. 의도한 것일 수도 있지만 요청마다 로그가 두 줄씩 남습니다 |
| `app.js` | `express.static` 이 주석 처리되어 있어 `public/stylesheets/style.css` 가 서빙되지 않습니다 |

## 지금은 이렇게 바뀌었습니다

- `sequelize['import']` 제거 → 모델 파일을 직접 `require` 해서 호출합니다.

  ```js
  db.User  = require("./User")(sequelize, Sequelize);
  db.Score = require("./Score")(sequelize, Sequelize);
  ```

  이 챕터 코드에 이미 이 형태가 아래쪽에 들어 있습니다. 자동 로더 블록을 지우고 이것만 남기면 됩니다.
- `sequelize-cli` 로 마이그레이션 파일을 만들어 스키마를 버전 관리하는 것이 지금의 표준입니다. `sync()` 는 개발 초기에만 씁니다.
- `var` → `const`/`let`

## 수업 메모

원본 README에 있던 설치 명령 정리입니다.

```bash
# express-generator (한 번만 전역 설치)
npm i -g express-generator
express 06.express-gen --view=pug
cd 06.express-gen && npm i
```

```bash
# 미들웨어
npm i morgan http-errors mysql2 rotating-file-stream multer express-session session-file-store
```

`package.json` 의 `^` 와 `~` 차이도 함께 정리돼 있었습니다.

- `^1.2.3` — 메이저는 고정, 마이너·패치는 올라갈 수 있음 (`1.x.x`)
- `~1.2.3` — 마이너까지 고정, 패치만 올라갈 수 있음 (`1.2.x`)

## 연습 과제

1. `bin/www` 를 되살려 서버를 띄우세요.
2. `models/Score.js` 의 테이블 이름을 `scores` 로 고치고, `kor` 외에 `eng`·`mat` 컬럼을 추가하세요.
3. `models/index.js` 의 자동 로더 블록을 지우고 수동 `require` 방식만 남기세요. Sequelize 6로 올려도 동작하게 만드는 것이 목표입니다.
4. `app.js` 의 중복된 `logger` 등록 중 하나를 정리하고, `express.static` 주석을 풀어 CSS가 적용되는지 확인하세요.
5. `routes/users.js` 에 `User` 모델을 붙여 목록 조회 라우트를 만드세요.
