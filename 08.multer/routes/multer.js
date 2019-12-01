var express = require('express');
var router = express.Router();
var {upload} = require("../modules/multer-conn.js")

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('multer-list', { title: 'Express' });
});

router.post('/', upload.single('img'), (req, res, next) => {
  if(req.isFileValidate) res.send("저장되었습니다."+req.file.filename);
  else res.send("저장 할 수 없습니다."+req.file.filename);
});

module.exports = router;