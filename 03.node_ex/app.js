const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const port = 3000;

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3307,
  user     : 'root',
  password : 'qwer1234',
  database : 'node_db',
  onnectionLimit : 100,
  waitForConnections : true,
  queueLimit :0,
  debug    :  true,
  wait_timeout : 28800,
  connect_timeout :10
});

const users = [
    {id:1, name:'홍길동',age:25},
    {id:2, name:'김길동',age:26},
    {id:3, name:'최길동',age:27},
];

app.listen(port,() => { 
    console.log("http://127.0.0.1:"+port);
});
// post body 객체 접근 가능
app.use(bodyParser.urlencoded({extended:false}));


// static root setting
app.use("/",express.static("./public"));

// PUG setting
app.set("view engine","pug"); // View Engine 지정
app.set("views","./views"); // View가 저장된 폴더 지정
//app.locals.pretty=true; // response 되는 소스를 예쁘게 보임

app.get("/sample",(req,res)=>{
    res.send("<h1>샘플페이지에 오신걸 환영합니다.!</h1>")
});

app.get(["/pug","/pug/:type"],(req,res)=>{
    let name = req.query.name;
    // alt + shift 방향키 아래 = 한 줄 복사
    let titleChk = req.query.titleChk;
    let type = req.params.type;
    //const vals = {name:name};
    const vals = {name,title:"pug 연습!",users,titleChk}; //es6에서 요약 가능
    console.log(titleChk)
    switch (type) {
        case "include":
            res.render("include",vals);
            break;
        default:
            res.render("block",vals);
            break;
    }
});

app.get("/api/:type",(req,res) => {
    let type = req.params.type;
    
    if (!type) type = "list";

    switch (type) {
        case "list":
            res.json({
                result : users
            });
            break;
        default:

            break;
    }
});

app.get("/insert-in",InsertIn)
function InsertIn (req,res) {
    const ret= {tit: "데이터 입력", subtit: "회원가입"};
    res.render("sql/insert.pug",ret);
}

app.post("/insert/:type", insertFn)
function insertFn(req,res){
    const type = req.params.type;
    const name = req.body.name;
    const age = req.body.age;
    const create_date = "2019-11-03 11:55:24";
    switch (type) {
        case "save":
            connection.connect();
            
            var sql = `INSERT INTO users SET name="${name}", age="${age}", create_date="${create_date}"`;
            console.log(sql)
            connection.query(sql, (err, results, fields) => {
                if (err) {
                    console.error(err)
                    res.send(err);
                }else{
                    console.log('The solution is: ', results[0]);
                    res.json(results[0])
                }
            });
                
            connection.end();
            //res.send("저장")
            break;
    
        default:
            res.send("취소")
            break;
    }
}