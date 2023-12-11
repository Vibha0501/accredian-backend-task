
const mysql = require("mysql2");
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

/* const connectToDB = mysql.createConnection({ host, port, user, password, database });
connectToDB.connect((err) => {
    if (err) throw err;
    console.log('Connected Successfully!!');
}) */

const pool = mysql.createPool({
  connectionLimit: 4,
  host,
  port,
  user,
  password,
  database,
});
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected Successfully!!");
  connection.release();
});

module.exports = pool;