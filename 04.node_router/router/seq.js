const express = require("express");
const router = express.Router();
const path = require("path");

const {User} = require(path.join(__dirname,"../modules/User"));

router.get("/", (req,res,next) => {
    console.log(req)
})

module.exports = router;