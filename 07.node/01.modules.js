// global modules
console.log(__dirname);
console.log(__filename);

const interval = setInterval(() => {

}, 1000);

setImmediate(() => {
 //console.log("hi")
});

console.time("측정!");

for (let index = 0; index < 1000000000; index++) {

}

console.timeEnd("측정!");

console.error("error!");

const obj = {
    name:"홍길동",
    summary: {
        age:25
    }
}

console.log(obj);
console.dir(obj);

console.clear();

// OS Object
const os = require("os");
// 운여체제 정보
console.log(os.arch());
console.log(os.platform());
console.log(os.type());
console.log(os.uptime());
console.log(os.hostname());
console.log(os.release());
// 경로
console.log(os.homedir());
console.log(os.tmpdir());
// CPU 정보
console.log(os.cpus());
console.log(os.cpus().length);
// 메모리 정보
console.log(os.freemem());
console.log(os.totalmem());

// path
const path = require("path");
const fileStr = __filename;
console.log("dir : ",path.dirname(fileStr));
console.log("ext : ",path.extname(fileStr));
console.log("bas : ",path.basename(fileStr));
console.log("par : ",path.parse(fileStr));

const parse = path.parse(fileStr);
let str = path.format(parse);

console.log(str)
console.log(path.normalize("/Users/sunghan/Desktop/nodestudy/07.node/modules.js"))

str = path.join(__dirname, "../../../");
console.log(str);

console.clear();

// url
const url = require("url");
const querystring = require("querystring");
const myUrl = new URL('https://nodejs.org/dist/latest-v12.x/docs/api/url.html?aa=bbb#url_url_pathname');
console.log(myUrl);
console.log(url.format(myUrl));

const urlStr = 'https://nodejs.org/dist/latest-v12.x/docs/api/url.html?aa=bbb#url_url_pathname';
const urlPas = url.parse(urlStr);
console.log(urlPas)
console.log(url.format(urlPas));
console.clear();

// search params
console.log(myUrl.searchParams)
console.log(myUrl.searchParams.keys())
console.log(myUrl.searchParams.values())

myUrl.searchParams.append("test1","123123")
myUrl.searchParams.append("test2","asdfggh")
console.log(myUrl.searchParams)

myUrl.searchParams.delete("test1")
console.log(myUrl.searchParams)
console.log(myUrl.searchParams.toString())
console.clear();

console.log(querystring.parse(urlPas.query));
console.clear();