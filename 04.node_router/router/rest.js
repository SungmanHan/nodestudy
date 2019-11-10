const express = require("express");
const path = require("path")
const router = express.Router();
const {sqlExec, ...db} = require(path.join(__dirname,"../modules/mysql-conn"));
const {zp,isoDate,jsToiso} = require("../modules/util-doc")
const {alertLoc} = require("../modules/util-loc")

let sql = "";
let result = "";
let username = "";
let id = 0;
let vals = [];

router.get("/",(req,res) => {
    (async () => {
        sql = "SELECT * FROM rest ORDER BY id DESC";
        result = await sqlExec(sql);
        res.render("rest/crud.pug",{datas:jsToiso(result[0],"wdate")});
    })();
});

router.post("/",(req,res) => {
    (async () => {
        username = req.body.username;
        let wdate = isoDate(new Date(),1);
        sql = "INSERT INTO rest SET username=?, wdate=?";
        vals = [username,wdate];
        result = await sqlExec(sql,vals);
        if (result[0].affectedRows > 0){
            //res.json(result)
            res.send(alertLoc("생성 성공.", "rest/"));
        }else{
            res.send(alertLoc("생성 실패.", "rest/"));
        }
    })();
});

router.put("/",(req,res) => {
    (async () => {
        id= req.body.id;
        if(id > 0){
            username = req.body.username;
            sql = "UPDATE rest SET username=? WHERE id=?";
            vals = [username,id];
            result = await sqlExec(sql,vals);
            if (result[0].affectedRows > 0){
                //res.json(result)
                res.send(alertLoc("수정 성공.", "rest/"));
            }else{
                res.send(alertLoc("수정 실패.", "rest/"));
            }
        }else{
            res.send(alertLoc("수정 실패.", "rest/"));
        }
    })();
});

router.delete("/",(req,res) => {
    id= req.body.id;
    (async ()=> {
        if(id > 0) {
            sql = "DELETE FROM rest WHERE id="+id;
            result = await sqlExec(sql)
            if(result[0].affectedRows > 0){
                res.send(alertLoc("삭제 성공.", "rest/"));
            }else{
                res.send(alertLoc("삭제 실패.", "rest/"));
            }
        }else{
            res.send(alertLoc("삭제 실패.", "rest/"));
        }
    })();
});

module.exports = router