const Sequelize = require("sequelize");
const sequelize = new Sequelize({
    dialect  : "mysql",
    port     : 3307,
    host     : 'localhost',
    username : 'root',
    password : 'qwer1234',
    database : 'node_db',
    pool: {
        waitForConnections : true,
        debug    :  false,
        onnectionLimit : 100,
        wait_timeout : 28800,
        connect_timeout :10,
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

(async () => {
	try {
		await sequelize.authenticate();
		console.log("success");
	}
	catch(err) {
		throw new Error(err);
	}
})();

module.exports = {Sequelize, sequelize}