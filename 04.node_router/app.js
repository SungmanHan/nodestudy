const express = require("express");
const path = require("path");
const body_parser = require("body-parser");

const app = express();
const port = 3000;
const log = console.log;

app.listen(port, () => {log("http://127.0.0.1:"+port)});

log(__dirname);
log(__filename);
log(path.join(__dirname,"public"))

/* exppress setting */
app.use("/",express.static(path.join(__dirname,"public")));
app.use(body_parser.urlencoded({extended:false}));
app.set("view engine","pug");
app.set("views",path.join(__dirname,"views"));
app.locals.pretty = true;

/* Router setting */
const boardRouter = require(path.join(__dirname,"router/board"));
const adminRouter = require(path.join(__dirname,"router/admin"));
app.use("/board",boardRouter);
app.use("/admin",adminRouter);