const mongoose = require("mongoose");
module.exports = () => {
    const connect = () => {
        mongoose.connect("mongodb://db:00000@localhostL15000/admin",{
            adName:"db"
        })
    }
}