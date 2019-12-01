var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var {Users,salt} = require("../models");
var log = console.log;

/* GET users listing. */
router.get('/', (req, res, next) => {
  if(req.session.user) res.send(`회원입니다.<p><a href="/users/logout">로그아웃</a></p>`);
  else res.render('login');
});

router.get("/logout", (req,res,next) => {
  req.session.destroy((err) => {
    res.redirect("/users")
  })
})

router.post('/login', async (req, res, next) => {
  console.log(req.body)
  var result = await Users.findOne({
    where: {
      userid: req.body.userid,
      userpw: crypto.createHash("sha512").update(req.body.userpw + salt).digest("base64")
    }
  });
  console.log(result.userid)
  console.log(result.userpw)
  console.log(result.username)
  console.log(result.createdAt)
  console.log(result.updatedAt)
  /*
  */
  if(result) {
    // 로그인에 성공했으면...
    req.session.user = {};
    req.session.user.id = result.id;
    req.session.user.userid = result.userid;
    req.session.user.username = result.username;
    res.redirect("/users");
  }else {
    res.send("로그인에 실패했습니다.");
  }
});

router.get("/join", (req,res,next) => {
  res.render("join")
})

/* POST users listing. */
router.post("/join", async (req,res,next) => {
  var result = await Users.create({
    userid: req.body.userid,
    userpw: crypto.createHash("sha512").update(req.body.userpw + salt).digest("base64"),
    username: req.body.username
  });
  if(result.id) res.redirect("/users");
  else res.send("가입에 실패하였습니다.");
});

module.exports = router;