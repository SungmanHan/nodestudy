const express = require("express");
const app = express();
const port = 3000;

app.listen(port,() => { 
    console.log("http://127.0.0.1:"+port);
});


// static root setting
app.use("/",express.static("./public"));

// PUG setting
app.set("view engine","pug"); // View Engine 지정
app.set("views","./views"); // View가 저장된 폴더 지정

app.get("/sample",(req,res)=>{
    res.send("<h1>샘플페이지에 오신걸 환영합니다.!</h1>")
});

app.get("/pug",(req,res)=>{
    let name = req.query.name;
    // alt + shift 방향키 아래 = 한 줄 복사
    const users = [
        {id:1, name:'홍길동',age:25},
        {id:2, name:'김길동',age:26},
        {id:3, name:'최길동',age:27},
    ];
    //const vals = {name:name};
    const vals = {name,title:"pug 연습!",users}; //es6에서 요약 가능
    res.render("sample",vals);
});