# 07.node — Node.js 코어 모듈

> 학습 순서 **2번**. Express를 얹기 전에, Node가 기본으로 들고 있는 도구들을 먼저 만져 봅니다.

## 학습 목표

- `require` 로 코어 모듈을 불러오고 사용자 모듈을 만들어 내보낸다
- `os`·`path`·`url`·`querystring` 으로 실행 환경과 경로·URL을 다룬다
- `crypto` 로 비밀번호를 **단방향 해시(+salt)** 하고, 대칭키로 **암·복호화**한다
- 콜백 → `util.promisify` → `async/await` 로 같은 로직을 세 가지 형태로 써 본다
- `cluster` 로 CPU 코어 수만큼 워커를 띄운다

## 파일 지도

| 파일 | 내용 |
|---|---|
| `01.modules.js` | 전역 객체(`__dirname`, `console`, 타이머), `os`, `path`, `url`, `querystring` |
| `02.crypto.js` | `createHash`, `randomBytes`, `pbkdf2` — 콜백/Promise/async 3형태 비교 |
| `03.cipher.js` | 대칭키 암호화·복호화 ⚠️ **Node 22+ 에서 실행 불가** (아래 참고) |
| `04.fileSystem.js` | `fs` 읽기·쓰기 — 비동기(`writeFile`)와 동기(`writeFileSync`) 비교 |
| `05.Cluster.js` | `cluster` 로 멀티 프로세스 서버 (포트 3001) |
| `modules/util-cryto.js` | 비밀번호 해시를 재사용 가능한 모듈로 분리한 예 |

## 실행 방법

npm 패키지가 필요 없습니다. 코어 모듈만 씁니다.

```bash
cd 07.node
node 01.modules.js
node 02.crypto.js
node 04.fileSystem.js
node 05.Cluster.js     # http://127.0.0.1:3001
```

> `04.fileSystem.js` 는 실행하면 `reademe.txt`, `reademe2.txt` 를 **만들어 냅니다.** 예제의 산출물이지 소스가 아니므로 `.gitignore` 에 등록되어 있습니다. 실행 후 생기더라도 커밋되지 않습니다.

## 짚고 갈 지점

### 같은 비밀번호 → 같은 해시 (그래서 salt가 필요하다)

```js
crypto.createHash('sha512').update("1234").digest("base64");  // 몇 번을 돌려도 같은 값
```

`02.crypto.js` 는 이걸 일부러 두 번 출력해 보여 줍니다. 해시가 항상 같다는 건, 유출된 해시값 사전(rainbow table)만 있으면 원문을 되찾을 수 있다는 뜻입니다. 그래서 사용자마다 다른 **salt** 를 붙이고, 연산을 수만 번 반복하는 `pbkdf2` 를 씁니다.

```js
crypto.pbkdf2('1234', salt, 350850, 64, 'sha512', (err, key) => { ... })
//                          ^^^^^^ 반복 횟수 — 클수록 느려지고, 공격자도 느려진다
```

### 콜백 → Promise → async/await, 같은 일을 세 번

`02.crypto.js` 의 `key3`/`key4`/`key5` 는 **완전히 같은 작업**을 세 가지 스타일로 쓴 것입니다. 나란히 읽어 보세요.

```js
// 1) 콜백 중첩
crypto.randomBytes(64, (err, buf) => {
  crypto.pbkdf2('1234', buf.toString('base64'), ..., (err, key) => { ... })
})

// 2) util.promisify + then 체인
randomBytesPro(64)
  .then(buf => pbkdf2Pro('1234', buf.toString('base64'), ...))
  .then(key => console.log(key.toString('base64')))

// 3) async/await
(async () => {
  const buf = await randomBytesPro(64);
  const key = await pbkdf2Pro('1234', buf.toString('base64'), ...);
})();
```

`util.promisify` 는 **콜백 스타일 함수를 Promise 스타일로 바꿔 주는** 유틸입니다. 옛날 API를 `await` 로 쓰고 싶을 때 씁니다.

> ⚠️ `key3` 블록은 `await crypto.pbkdf2(...)` 처럼 **콜백 함수에 `await` 를 걸고 있는데, 이건 아무 효과가 없습니다.** `pbkdf2` 는 Promise를 반환하지 않기 때문입니다. 수업 중 시행착오가 그대로 남은 부분이니, 왜 효과가 없는지 생각해 보세요.

### 모듈로 분리하기

`modules/util-cryto.js` 는 위 3번 방식을 함수 하나로 묶어 `module.exports` 한 것입니다. 호출부는 이렇게 짧아집니다.

```js
const cryptoSalt = require("./modules/util-cryto");
console.log(cryptoSalt(pw));
```

> 반환값이 Promise이므로 `await cryptoSalt(pw)` 로 받아야 실제 값이 나옵니다. 지금처럼 `console.log` 로 바로 찍으면 `Promise { <pending> }` 이 출력됩니다. **직접 고쳐 보세요.**

### cluster — 코어 수만큼 서버를 복제한다

Node는 기본적으로 싱글 스레드라 CPU 한 개만 씁니다. `cluster` 는 프로세스를 코어 수만큼 포크해서 같은 포트를 나눠 듣게 합니다. `05.Cluster.js` 는 워커가 죽으면 `cluster.on('exit')` 에서 다시 포크하는 것까지 보여 줍니다.

## 지금은 이렇게 바뀌었습니다

- ⚠️ **`crypto.createCipher` / `createDecipher` 는 Node 22에서 제거되었습니다.** `03.cipher.js` 는 최신 Node에서 `TypeError: crypto.createCipher is not a function` 으로 죽습니다. 대체 API는 초기화 벡터(IV)를 명시적으로 넘기는 `createCipheriv` / `createDecipheriv` 입니다.

  ```js
  const key = crypto.scryptSync('my-key', 'salt', 32);   // 32바이트 키
  const iv  = crypto.randomBytes(16);                    // 16바이트 IV
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  ```

  옛 API가 사라진 이유가 바로 이것입니다 — 키에서 IV를 자동 유도하는 방식이 안전하지 않았습니다.
- `cluster.isMaster` 는 `cluster.isPrimary` 로 이름이 바뀌었습니다 (`isMaster` 도 아직 동작하지만 deprecated).
- `url.parse()` 는 legacy API입니다. 지금은 `new URL()` 을 씁니다. `01.modules.js` 는 두 방식을 모두 보여 주니 비교해 보세요.
- `fs` 를 `await` 로 쓰고 싶으면 `require("fs").promises` 또는 `require("fs/promises")` 를 씁니다.

## 연습 과제

1. `03.cipher.js` 를 `createCipheriv` / `createDecipheriv` 로 고쳐 최신 Node에서 동작하게 만드세요. IV는 암호문과 함께 보관해야 복호화할 수 있다는 점에 주의하세요.
2. `02.crypto.js` 마지막 줄의 `cryptoSalt(pw)` 를 `await` 로 받아 `{salt, key}` 를 제대로 출력하세요.
3. `04.fileSystem.js` 를 `fs/promises` + `async/await` 로 다시 쓰세요.
4. `05.Cluster.js` 를 실행한 뒤 브라우저에서 여러 번 새로고침하고, 터미널에 찍히는 `process.pid` 가 바뀌는지 확인하세요. 왜 바뀔까요?
