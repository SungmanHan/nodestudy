const fs = require('fs');
let txt = "아버지를 아버지라.. 용왕이 나의 간을....";
let pathInfo = "./reademe.txt";

fs.writeFile(pathInfo,txt,(err) => {
    if(err) throw err;
}); // 작성


fs.readFile(pathInfo,(err,res) => {
    if(err) throw err;
    console.log(">"+res.toString());
});

txt = "아버지2를 아버지2라.. 용왕이 나의 간을....";
pathInfo = "./reademe2.txt";
fs.writeFileSync(pathInfo,txt); // 작성
let r = fs.readFileSync(pathInfo);
console.log("sync > "+r.toString());

/*
fs.readFile()
fs.writeFile()
fs.open()
fs.mkdir()
fs.opendir()
fs.rename()
fs.unlink()
fs.copuyFile()
*/