const mysql = require('mysql2/promise');
const conn = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'qwer1234',
  database : 'node_db',
  waitForConnections : true,
  debug    :  true,
  port     : 3307,
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