/* npm moduel */
const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');

/* node mondule */
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
app.use("/board",boardRouter);
app.use("/admin",adminRouter);
app.use("/rest",restRouter);
app.use("/api",apiRouter);