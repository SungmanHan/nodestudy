const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var methodOverride = require('method-override');

const app = express();
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
app.use("/board",boardRouter);
app.use("/admin",adminRouter);
app.use("/rest",restRouter);