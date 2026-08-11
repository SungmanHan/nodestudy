const mongoose = require("mongoose");
module.exports = () => {
    const connect = () => {
        mongoose.connect(process.env.MONGO_URI,{
            adName: process.env.MONGO_DB_NAME
        })
    }
}