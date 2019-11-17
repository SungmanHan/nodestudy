const Sequelize = require("sequelize");
const sequelize = new Sequelize({
    dialect : "mysql",
    host     : 'localhost',
    user     : 'root',
    password : 'qwer1234',
    database : 'node_db',
    pooL : {
        waitForConnections : true,
        debug    :  true,
        port     : 3307,
        onnectionLimit : 100,
        wait_timeout : 28800,
        connect_timeout :10
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("susccess")
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {Sequelize,sequelize}