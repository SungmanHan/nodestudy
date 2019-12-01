const mysql = require('mysql2/promise');
const conn = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'qwer1234',
  database : 'node_db',
  waitForConnections : true,
  debug    :  false,
  port     : 3307,
  onnectionLimit : 100,
  wait_timeout : 28800,
  connect_timeout :10
});

const sqlExec = async (sql,sqlVlues) => {
    const connect = await conn.getConnection();   // 동기화 함수
    const result = await connect.query(sql,sqlVlues);
    connect.release();
    return result;
};

/*
const sqlExec2 = async (sql,sqlVlues) => {
    conn.getConnection((err,conn) => {
      const result =  await conn.query(sql,sqlVlues);
    })
}*/

module.exports = {mysql,conn,sqlExec};