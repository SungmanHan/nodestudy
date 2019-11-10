const express = require("express");
const router = express.Router();

router.get("/",(req,res) => {
    res.send("<h1>REST-READ</h1>")
});

router.post("/",(req,res) => {
    res.send("<h1>REST-POST</h1>")
});

router.put("/",(req,res) => {
    res.send("<h1>ADMIN-UPDATE</h1>")
});

router.delete("/",(req,res) => {
    res.send("<h1>ADMIN-DELETE</h1>")
});

module.exports = router