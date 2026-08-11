# 08.multer — 파일 업로드

> 학습 순서 **8번**. 텍스트가 아닌 **파일**을 받는 방법입니다.

## 학습 목표

- `multipart/form-data` 요청을 `multer` 로 받는다
- 저장 경로와 파일명 규칙을 직접 정한다 (`diskStorage`)
- 업로드 파일을 **확장자로 걸러 낸다** (`fileFilter`)
- 왜 원본 파일명을 그대로 쓰면 안 되는지 안다

## 파일 지도

| 경로 | 역할 |
|---|---|
| `app.js` | 미들웨어 + 라우터 마운트 |
| `bin/www` | 서버 구동 (포트 3000) |
| `modules/multer-conn.js` | ★ 핵심 — 저장 경로·파일명·확장자 필터 |
| `routes/multer.js` | `/multer` GET(화면) · POST(업로드) |
| `routes/users.js` | generator 기본 라우터 |
| `views/multer-list.pug` | 업로드 폼 |
| `views/layout/multer.pug` · `inc/header.pug` | 레이아웃 |
| `public/uploads/` | 업로드 저장 위치 (내용은 `.gitignore` 처리) |
| `modules/sequelize-conn.js` · `models/index.js` | Sequelize 설정 — **현재 어떤 라우터도 쓰지 않음** |

## 실행 방법

**업로드 기능만 쓸 거라면 DB가 필요 없습니다.**

```bash
cd 08.multer
npm install
npm run serve        # node ./bin/www — http://127.0.0.1:3000
```

`http://127.0.0.1:3000/multer` 로 접속해 파일을 올려 보세요.

> `npm start` 는 `supervisor ./bin/www` 라 `supervisor` 를 전역 설치해야 합니다. 지금은 `npm run serve` 를 쓰거나 `node --watch ./bin/www` 를 쓰세요.

## 짚고 갈 지점

### 저장 경로와 파일명을 직접 정한다

```js
var storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, getPaht()) },   // 어디에
  filename:    (req, file, cb) => { cb(null, getFile(file.originalname).saveName) }  // 무슨 이름으로
})
```

`destination` 은 `public/uploads/1912/` 처럼 **연월 폴더**를 만들어 반환합니다. 파일이 한 폴더에 수만 개 쌓이면 파일 시스템이 느려지기 때문에 흔히 쓰는 방법입니다.

### 원본 파일명을 그대로 쓰면 안 되는 이유

```js
function getFile(originFile){
  var ext = path.extname(originFile);                    // .jpg
  var f1 = makePath();                                   // 1912  (연월)
  var f2 = Date.now();                                   // 타임스탬프
  var f3 = Math.floor(Math.random() * 90 + 10);          // 난수 2자리
  var saveName = f1+'-'+f2+'-'+f3+ext;                   // 1912-1575170220341-42.jpg
  return {originFile, ext, fName, saveName};
}
```

원본 이름을 그대로 쓰면 세 가지가 문제입니다.

1. **덮어쓰기** — 같은 이름을 올리면 앞 파일이 사라집니다
2. **경로 조작** — `../../etc/passwd` 같은 이름으로 엉뚱한 곳에 쓸 수 있습니다
3. **한글·공백·특수문자** — OS나 브라우저마다 깨집니다

타임스탬프 + 난수 조합은 이 셋을 한 번에 피합니다.

> 다만 `Date.now()` + 2자리 난수는 **같은 밀리초에 두 명이 올리면 1/90 확률로 충돌합니다.** 실무라면 `crypto.randomUUID()` 를 쓰세요 — 연습 과제 2번.

### 확장자 필터

```js
var chkFile = (req, file, cb) => {
  var allowExt = ['.zip','.gif','.png','.img','.jpg','.jpeg'];
  var ext = path.extname(file.originalname).toLowerCase();
  if(allowExt.indexOf(ext) > -1){
    req.isFileValidate = true;
    cb(null, true)      // 받는다
  }else{
    req.isFileValidate = false;
    cb(null, false)     // 버린다
  }
}
```

`cb(null, false)` 는 **에러가 아니라 "이 파일은 안 받겠다"** 는 뜻입니다. 그래서 요청 자체는 성공하고, 라우터에서 `req.isFileValidate` 로 결과를 확인합니다.

> ⚠️ **확장자 검사만으로는 부족합니다.** `evil.php` 를 `evil.jpg` 로 바꿔 올리면 통과합니다. 실무에서는 파일의 앞부분 바이트(magic number)로 실제 형식을 확인하고, 업로드 폴더에서 스크립트 실행을 막습니다.

### 업로드는 미들웨어로 끼워 넣는다

```js
router.post('/', upload.single('img'), (req, res, next) => {
  if(req.isFileValidate) res.send("저장되었습니다." + req.file.filename);
  else res.send("저장 할 수 없습니다." + req.file.filename);
});
```

`upload.single('img')` 가 라우터 핸들러 **앞에** 들어갑니다. 파일을 다 받아 저장한 뒤에야 핸들러가 실행되고, 그때 `req.file` 이 채워져 있습니다.

| multer 메서드 | 용도 |
|---|---|
| `upload.single('img')` | 파일 1개 |
| `upload.array('imgs', 5)` | 같은 필드로 여러 개 |
| `upload.fields([...])` | 필드마다 다른 파일 |
| `upload.none()` | 파일 없이 폼 데이터만 |

### 동기 함수를 쓴 이유

```js
function getPaht(){
  var newPath = path.join(__dirname, "../public/uploads/" + makePath());
  if(!fs.existsSync(newPath)){
    fs.mkdirSync(newPath);       // ← 동기
  }
  return newPath;
}
```

`destination` 콜백은 경로를 **즉시** 돌려줘야 합니다. 그래서 비동기 `mkdir` 대신 동기 버전을 씁니다. 코드에도 `-> sync 이 때문에 동기화됨` 이라는 메모가 붙어 있습니다.

동기 함수는 이벤트 루프를 막으므로 보통 피해야 하지만, 여기처럼 **콜백이 동기 반환을 요구할 때**는 예외입니다. 대안은 `cb` 를 비동기로 호출하는 것입니다 — `fs.mkdir(path, {recursive:true}, () => cb(null, newPath))`.

## 알려진 결함

| 위치 | 문제 |
|---|---|
| `routes/multer.js` | 파일이 걸러졌을 때 `req.file` 이 `undefined` 인데 `req.file.filename` 을 읽습니다 → **허용되지 않은 확장자를 올리면 서버가 죽습니다** |
| `modules/multer-conn.js` `getPaht()` | `mkdirSync` 에 `{recursive:true}` 가 없어, `uploads/` 폴더 자체가 없으면 실패합니다 |
| `models/index.js` | `../config/config.json` 을 `require` 하는데 폴더가 없습니다. 다만 어떤 라우터도 이 파일을 쓰지 않아 실행에는 지장이 없습니다 |
| `package.json` | 의존성에 `"audit"` 이 들어 있습니다. `npm i audit` 을 잘못 실행해 들어간 **엉뚱한 패키지**입니다 |

## 지금은 이렇게 바뀌었습니다

- multer 2.x가 나왔습니다. `diskStorage` API는 거의 같지만 보안 수정이 다수 들어갔습니다.
- 업로드 파일명은 `crypto.randomUUID()` 를 쓰는 것이 표준에 가깝습니다.
- 파일을 서버 디스크에 직접 저장하는 대신 S3 같은 오브젝트 스토리지에 올리는 것이 일반적입니다. 서버를 여러 대로 늘리면 디스크가 공유되지 않기 때문입니다.
- 용량 제한을 반드시 겁니다. 지금 코드에는 없습니다.

  ```js
  multer({ storage, fileFilter: chkFile, limits: { fileSize: 5 * 1024 * 1024 } })
  ```

## 연습 과제

1. 허용되지 않은 확장자(`.txt` 등)를 올려 서버가 죽는 것을 확인하고, `req.file` 이 없을 때를 처리하도록 고치세요.
2. 파일명 생성을 `crypto.randomUUID()` 기반으로 바꾸세요.
3. `limits: { fileSize: ... }` 로 5MB 제한을 걸고, 초과 시 나오는 `MulterError` 를 에러 핸들러에서 잡아 사용자에게 안내하세요.
4. `upload.array('imgs', 5)` 로 다중 업로드를 만들고 `views/multer-list.pug` 의 폼도 함께 고치세요.
5. 업로드한 파일 정보(원본명·저장명·크기·시각)를 Sequelize 모델로 DB에 저장하세요. `modules/sequelize-conn.js` 가 이미 준비돼 있습니다.
6. `package.json` 에서 `audit` 의존성을 제거하세요.
