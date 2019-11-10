const express = require("express");
const path = require("path")
const router = express.Router();
const {sqlExec, ...db} = require(path.join(__dirname,"../modules/mysql-conn"));
const {zp,isoDate,jsToiso} = require("../modules/util-doc")
const {alertLoc} = require("../modules/util-loc")

let sql = "";
let result = "";


router.get("/",(req,res) => {
    (async () => {
        sql = "SELECT * FROM rest ORDER BY id DESC";
        result = await sqlExec(sql);
        res.render("rest/crud.pug",{datas:jsToiso(result[0],"wdate")});
    })();
});

router.post("/",(req,res) => {
    (async () => {
        let username = req.body.username;
        let wdate = isoDate(new Date(),1);
        sql = "INSERT INTO rest SET username=?, wdate=?";
        let vals = [username,wdate];
        result = await sqlExec(sql,vals);
        if (result[0].affectedRows > 0){
            //res.json(result)
            res.send(alertLoc("생성 성공.", "rest/"));
        }else{

        }
    })();
});

router.put("/",(req,res) => {
    res.send("<h1>ADMIN-UPDATE</h1>");
});

router.delete("/",(req,res) => {
    res.send("<h1>ADMIN-DELETE</h1>");
});

module.exports = router