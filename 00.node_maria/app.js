require("dotenv").config(); // .env 파일의 값을 process.env 로 읽어들인다

const express = require("express");
const app = express();
const mysql =  require("mysql");

const login = require("./public/js/login");
const join = require("./public/js/join");
const pwChange = require("./public/js/pw-chagne");
const sad = require("./public/js/show-all-data");
const deleteInfo = require("./public/js/delte-info");

app.use("/login",login);
app.use("/join",join);
app.use("/pw-change",pwChange);
app.use("/show-all",sad);
app.use("/delte-info",deleteInfo);


app.listen(4444,()=>console.log("http://127.0.0.1:4444"));

app.get("/", (req,res,next) => {
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        post: Number(process.env.DB_PORT), // ⚠️ 'port' 오타 — README 참고
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    con.connect();

    con.end();

});