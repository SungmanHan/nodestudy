/* npm moduel */
const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs');
const httpErrors = require("http-errors");
const rfs = require('rotating-file-stream');

/* node mondule */
const morgan = require('morgan');
const bodyParser = require("body-parser");
const methodOverride = require('method-override');

/* default setting */
const port = 3000;
const log = console.log;

app.listen(port, () => {log("http://127.0.0.1:"+port)});

log(__dirname);
log(__filename);
log(path.join(__dirname,"public"))

/* exppress setting */
app.use("/",express.static(path.join(__dirname,"public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","pug");
app.set("views",path.join(__dirname,"views"));
app.locals.pretty = true;

/* Morgan setting */
let logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
let accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

app.use(morgan('combined', { stream: accessLogStream }))

/* Method orverride setting */ 
app.use(methodOverride('X-HTTP-Method')) //          Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override')) //      IBM
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

/* Router setting */
const boardRouter = require(path.join(__dirname,"router/board"));
const adminRouter = require(path.join(__dirname,"router/admin"));
const restRouter = require(path.join(__dirname,"router/rest"));
const apiRouter = require(path.join(__dirname,"router/api"));
const seqRouter = require(path.join(__dirname,"router/seq"));
app.use("/board",boardRouter);
app.use("/admin",adminRouter);
app.use("/rest",restRouter);
app.use("/api",apiRouter);
app.use("/seq",seqRouter);

/*
 사용자 직접 생성 미들웨어
const md = (req,res,next) => {

}
app.use(md)
*/

/* 예외처리 */
app.use((req,res,next) => {
    next(httpErrors(404));
});

app.use((error,req,res,next) => {
    res.locals.message = error.message;
    res.locals.error = error;
    res.render("error");
});