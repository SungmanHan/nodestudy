const crypto = require("crypto");
const util = require("util");
const randomBytesPro = util.promisify(crypto.randomBytes); // promise 모델을 생성
const pbkdf2Pro = util.promisify(crypto.pbkdf2);

module.exports = async(pw) => {
    let buf = await randomBytesPro(64);
    let salt = buf.toString('base64');
    let key = await pbkdf2Pro(pw,salt,900000,64,'sha512');
    console.log('key6 -> ',key.toString('base64'));
    return {salt,key};
};