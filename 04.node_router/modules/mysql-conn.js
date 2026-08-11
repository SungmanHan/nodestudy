const mysql = require('mysql2/promise');
const conn = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  waitForConnections : true,
  debug    :  false,
  port     : Number(process.env.DB_PORT),
  onnectionLimit : 100,
  wait_timeout : 28800,
  connect_timeout :10
});

const sqlExec = async (sql, sqlVals) => {
	try {
		const connect = await conn.getConnection();
		const result = await connect.query(sql, sqlVals);
		connect.release();
		return result;
	}
	catch(error) {
		console.log("-------------------");
		console.log(error);
		console.log("-------------------");
	}
}

module.exports = {mysql,conn,sqlExec};