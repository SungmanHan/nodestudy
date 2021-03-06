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
const {alertLoc} = require("./modules/util-loc")
const {zp,isoDate,jsToiso} = require("./modules/util-doc")

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
app.get(["/user/:type","/user/:type/:id"],userGet);

// Rounter Post
app.post("/user/:type",userPost);

// Router CB
function userGet(req,res) {
    const type = req.params.type;
    const id = req.params.id;

    switch (type) {
        case "wr":
            const vals = {tit:"데이터 입력",subtit:"회원가입"}
            res.render("sql/insert",vals);
            break;
        case "li":
            (async () =>{
                let sql = "SELECT * FROM users ORDER BY id DESC";
                const result = await sqlExec(sql);
                const vals = {
                    tit:"데이터 출력",
                    subtit:"회원리스트", 
                    datas:jsToiso(result[0],"create_date")}
                res.render("sql/list",vals);
            })();
            break;
        case "rm":
            if(id){
                (async () => {
                    let sql = "DELETE FROM users WHERE id="+id;
                    let result = await sqlExec(sql);
                    if(result[0].affectedRows > 0){
                        res.send(alertLoc("삭제 성공.", "/user/li"));
                    }else{
                        res.send(alertLoc("삭제 실패", "/user/li"));
                    }
                })();
            }else{
                res.send(alertLoc("삭제 실패", "/user/li"));
            }
            break;
        case "up":
            if(id){
                (async () => {
                    let sql = "SELECT * FROM users WHERE id="+id;
                    let sqlVals = [req.params.id];
                    let result = await sqlExec(sql,sqlVals);
                    let vals = {
                        tit:"데이터 수정",
                        subtit:"회원정보수정화면", 
                        data:result[0][0]
                    }
                    res.render("sql/update",vals);
                })();
            }else{
                res.send(alertLoc("수정 실패", "/user/li"));
            }
            break;
        default:
            break;
    }
}

function userPost(req,res) {
    const type = req.params.type;
    let name = req.body.name;
    let age = req.body.age;
    let create_date = "";
    let id = "";
    let sql = "";
    let sqlVals = [];
    let result = "";
    switch (type) {
        case "save":
            (async () => {
                create_date = isoDate(new Date(),1);
                sql = "INSERT INTO users SET name=?, age=?, create_date=?";
                sqlVals = [name, age, create_date];
                result = await sqlExec(sql,sqlVals);
                //res.json(result);
				res.send(alertLoc("저장되었습니다.", "/user/li"));
            })();
            break;
        case "update":
            (async () => {
                id = req.body.id;
                sql = "UPDATE users SET name=?, age=? WHERE id=?";
                sqlVals = [name, age,id];
                result = await sqlExec(sql,sqlVals);
                //res.json(result);
                if (result[0].affectedRows > 0){
                    res.send(alertLoc("수정되었습니다.", "/user/li"));
                }else{
                    res.send(alertLoc("수정실패했습니다.", "/user/li"));
                }
            })();
            break;
    
        default:
            break;
    }
};