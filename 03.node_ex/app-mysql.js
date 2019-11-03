// node moduel
const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const port = 3000;

// user modeul
/*
const db = require("./modules/mysql-conn");
const msyql = db.mysql;
const conn = db.conn;
const sqlExec = db.sqlExec;
*/
const {mysql,conn,sqlExec} = require("./modules/mysql-conn"); // 객체에 export된 moduel들을 괄과 값을 변수로 바로 받음


// defualt setting
app.use(bodyParser.urlencoded({extended:false}));
app.use("/",express.static("./public"));
app.set("view engine","pug");
app.set("views","./views");
app.locals.pretty = true;

// run server
app.listen(port,() => { 
    console.log("http://127.0.0.1:"+port);
});

// Router Get
app.get("/insert/:type",insertGet);

// Rounter Post
app.post("/insert/:type",insertPost);

// Router CB
function insertGet(req,res) {
    const type = req.params.type;

    switch (type) {
        case "wr":
            const vals = {tit:"데이터 입력",subtit:"회원가입"}
            res.render("sql/insert",vals);
            break;
        case "ls":
    
            break;
        default:
            break;
    }
}

function insertPost(req,res) {
    const type = req.params.type;
    switch (type) {
        case "save":
            let name = req.body.name;
            let age = req.body.age;
            let create_date = "2019-11-03 14:30:24";
            
            (async () => {
                let sql = "INSERT INTO users SET name=?, age=?, create_date=?";
                let sqlVals = [name, age, create_date];
                let result = await sqlExec(sql,sqlVals) 
                res.json(result);
            })();
            break;
    
        default:
            break;
    }
};