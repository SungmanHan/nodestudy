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
        host: 'localhost',
        post: 4444,
        user: "sungman",
        password: "qwer1234",
        database: "mytable"
    });

    con.connect();

    con.end();

});