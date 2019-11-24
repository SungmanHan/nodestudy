var createError = require('http-errors'); // 외부 404 error를 찾는 것-mw
var express = require('express'); 
var fs = require('fs'); // node
var path = require('path'); // 경로 설정 node
var cookieParser = require('cookie-parser'); // 외부-mw
var logger = require('morgan'); // 외부-mw
var methodOverride = require('method-override'); // 외부-mw
var rfs = require('rotating-file-stream'); // 외부-mw
var sequelize = require("./models").sequelize;

// Router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/* Morgan setting */
let logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
let accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

app.use(logger('combined', { stream: accessLogStream }))

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade'); // ejs와 pug가 있음 jade == pug
app.set('view engine', 'pug');
app.locals.pretty = true;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

/* Sequelize connected */
sequelize.sync();

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
