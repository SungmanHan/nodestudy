
// crypto
const crypto = require("crypto");

let sha511 = crypto.createHash('sha512').update("1234").digest("base64");
console.log(sha511);
let sha512 = crypto.createHash('sha512').update("1234").digest("base64");
console.log(sha512);
// 이렇게 하면 같은 결과를 볼 수 있다.(해커들에게 뚤어달라고 하는 것)

let sha513 = crypto.createHash('sha512').update("4321").digest("base64");
console.log(sha513);

crypto.randomBytes(64,(err,buf) =>{
    const salt = buf.toString('base64'); // 1234라는 비밀번호에 랜덤하게 설정된 추가 번호를 붙여서 저장
    console.log('salt -> ',salt);
    // 보통 아래 부분만 사용하고 salt->다른 키를 생성
    crypto.pbkdf2('1234',salt,35085,64,'sha512', (err,key)=>{
        console.log('key -> ',key.toString('base64'));
    })
});

//console.time('pw');
// 보통 이렇게 사용함 
crypto.pbkdf2('1234','mykey',350850,64,'sha512', (err,key)=>{
    console.log('key2 -> ',key.toString('base64'));
    //console.timeEnd('pw');
});
// 보통 100만 이하를 사용 350850

// util를 사용한 간단한 promise 생성
const util = require("util");
const randomBytesPro = util.promisify(crypto.randomBytes); // promise 모델을 생성
const pbkdf2Pro = util.promisify(crypto.pbkdf2);

crypto.randomBytes(64,(err,buf) =>{
    const salt = buf.toString('base64'); // 1234라는 비밀번호에 랜덤하게 설정된 추가 번호를 붙여서 저장
    console.log('salt -> ',salt);
    // 보통 아래 부분만 사용하고 salt->다른 키를 생성
    crypto.pbkdf2('1234',salt,35085,64,'sha512', (err,key)=>{
        console.log('key -> ',key.toString('base64'));
    })
});

console.clear();

console.time('pw');
crypto.randomBytes(64,async (err,buf) => {
    const salt = buf.toString('base64'); // 1234라는 비밀번호에 랜덤하게 설정된 추가 번호를 붙여서 저장
    await crypto.pbkdf2('1234',salt,1000000,64,'sha512', async (err,key)=>{
        await console.log('key3 -> ',key.toString('base64'));
        console.timeEnd('pw');
    })
})

randomBytesPro(64)
.then(buf => pbkdf2Pro('1234', buf.toString('base64'),1000000,64,'sha512'))
.then(key => console.log('key4 -> ',key.toString('base64')))
.catch((err) => {
    console.log(err);
});

(async () => {
    let buf = await randomBytesPro(64);
    let salt = buf.toString('base64');
    let key = await pbkdf2Pro('1234',salt,1000000,64,'sha512');
    console.log('key5 -> ',key.toString('base64'));
})();

const cryptoSalt = require("./modules/util-cryto");
const pw ='12345'
console.log(cryptoSalt(pw));