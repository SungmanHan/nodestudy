const crypto = require("crypto");

const cipher = crypto.createCipher("aes-256-cbc",'my-key');
let result = cipher.update("아버지를 아버지라...","utf8","base64");
result += cipher.final("base64");
console.log(result);

const decipher = crypto.createDecipher("aes-256-cbc",'my-key');
let result2 = decipher.update(result,"base64","utf8");
result2 += decipher.final("utf8");
console.log(result2)