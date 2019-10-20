const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// 사용자 지정 모듈
const util = require('./modules/util')

// start server
app.listen(3000, function() {
    console.log("http://127.0.0.1:3000");
});

// Router

//----------------------------------------------------------------------------
// get
//----------------------------------------------------------------------------
// 정적 Route
app.use("/",express.static("./public"));
// app에서 x-www-form-rul/encoded 를 사용안하겠다. 옛날 방식
app.use(bodyParser.urlencoded({extended:false}));
// json형태로 받겠다
//app.use(bodyParser.json());

// 동적 Route
// /hello로 요청이 들어오면 req ,res로 보냄
app.get("/hello", function(req,res) {
    var name = req.query.name;
    res.send(`<h1>${name}님 반갑습니다.</h1>`);
});
app.get("/test", (req,res) => {
    res.send(`<h1>연습 수정</h1>`);
});
// supervisor 개발 서버 재실행 - > cmt > supervisor app_name
app.get("/test2", (req,res) => {
    res.send(`<h1>연습 2 수정</h1>`);
});

app.get(["/books","/books/:id"],(req,res) =>{
    var id = req.params.id;
    if(!id) id = 0;
    
    const books = [
        {id:0,name:"별주부전",content:"용황이 거북이에게 토끼의 간을..."},
        {id:1,name:"선녀와나무꾼",content:"나무꾼이 선녀를...."}
    ];

    res.send(`
        <h1>${books[id].name}</h1>
        <p>${books[id].content}</p>
    `);
});

//----------------------------------------------------------------------------
// post
//----------------------------------------------------------------------------
app.post("/join-save",(req,res)=>{
    var userid = req.body.userid;
    var username = req.body.username;
    res.send(`<p>저장정보 </br> ID : ${userid} </br> 이름 : ${username} </br> 등록시간 : ${util.isoDate(new Date())} </p>`);
});
