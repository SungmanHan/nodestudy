const express = require("express");
const router = express.Router();
const path = require("path");

const {User} = require(path.join(__dirname, "../models/User"));
//const {Scores} = require(path.join(__dirname, "../models/Scores"));

router.get("/", getData);
router.post("/", postData);
router.put("/", putData);
router.delete("/", deleteData);

async function getData(req,res,next){
	let result = await User.findAll({
		order : [["id","desc"]]
	});
	console.log("+++++++++++++++++++++++++++++++++++++++++++")
	console.log(result);
	console.log("+++++++++++++++++++++++++++++++++++++++++++")
	res.json(result);
}

async function postData(req,res,next){
	console.log("+++++++++++++++++++++++++++++++++++++++++++")
	console.log(req);
	console.log("+++++++++++++++++++++++++++++++++++++++++++")
	let result = await User.create({
		username:req.body.username
	});
	res.json(result);
}

async function putData(req,res,next){
	res.send("PUT")	
}

async function deleteData(req,res,next){
	res.send("DELETE")	
}

module.exports = router;