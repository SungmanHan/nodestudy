const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getPaht())
  },
  filename: function (req, file, cb) {
    const saveFile = getFile(file.originalname);
    cb(null,saveFile.saveName)
  }
})
function getPaht(){
  const newPath = path.join(__dirname,`../public/uploads/${makePath()}`);
  if(!fs.existsSync(newPath)){
    fs.mkdirSync(newPath);
  } // -> sync 이 때문에 동기화됨
  return newPath;
}
function makePath(){
  const d = new Date();
  const year = String(d.getFullYear()).substr(2);
  let month = d.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  return year+month;
}
function getFile(originFile){
  let ext = path.extname(originFile); //.jpg
  const fName = path.basename(originFile,ext); // sample
  const f1 = makePath(); //1912
  const f2 = Date.now(); // timestamp
  const f3 = Math.floor(Math.random() * 90 + 10); // 00~99
  const saveName = `${f1}-${f2}-${f3}${ext}`;
  return {originFile,ext,fName,saveName};
}

const chkFile = (req, file, cb) => {
  const allowExt = ['.zip','.gif','.png','.img','.jpg','.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if(allowExt.indexOf(ext) > -1){ // 허용하는 확장자
    req.isFileValidate= true;
    cb(null,true)
  }else{
    req.isFileValidate = false;
    cb(null,false)
  }
}

const upload = multer({ storage: storage,fileFilter:chkFile})

module.exports = {upload}