const http = require("http");
const cluster = require("cluster");

let cpus = require("os").cpus();
let cpuCnt = cpus.length;

if(cluster.isMaster){
    for (let idx = 0; idx < cpuCnt; idx++) {
        cluster.fork(); // worker를 만든다.
    }
    cluster.on('exit', (workder,code,signer) => {
        console.log(`${workder.process.pid}번 워커가 사망하였습니다.`);
        cluster.fork();
    });
}else{
    http.createServer((req,res) => {
        console.log(process.pid+"구동");
        res.end("<h1>서버 응답</h1>");
    }).listen(3001);
    console.log(process.pid+"번 서버가 실행되었습니다.");
}