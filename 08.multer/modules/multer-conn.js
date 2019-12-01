var multer  = require('multer');
var path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getPaht())
  },
  filename: function (req, file, cb) {
    var saveFile = getFile(file.originalname);
    cb(null,saveFile.saveName)
  }
})
function getPaht(){
  var newPath = path.join(__dirname,"../public/uploads/"+makePath());
  if(!fs.existsSync(newPath)){
    fs.mkdirSync(newPath);
  } // -> sync 이 때문에 동기화됨
  return newPath;
}
function makePath(){
  var d = new Date();
  var year = String(d.getFullYear()).substr(2);
  var month = d.getMonth() + 1;
  month = month < 10 ? "0"+month : month;
  return year+month;
}
function getFile(originFile){
  var ext = path.extname(originFile); //.jpg
  var fName = path.basename(originFile,ext); // sample
  var f1 = makePath(); //1912
  var f2 = Date.now(); // timestamp
  var f3 = Math.floor(Math.random() * 90 + 10); // 00~99
  var saveName = f1+'-'+f2+'-'+f3+ext;
  return {originFile,ext,fName,saveName};
}

var chkFile = (req, file, cb) => {
  var allowExt = ['.zip','.gif','.png','.img','.jpg','.jpeg'];
  var ext = path.extname(file.originalname).toLowerCase();
  if(allowExt.indexOf(ext) > -1){ // 허용하는 확장자
    req.isFileValidate= true;
    cb(null,true)
  }else{
    req.isFileValidate = false;
    cb(null,false)
  }
}

var upload = multer({ storage: storage,fileFilter:chkFile})

module.exports = {upload}