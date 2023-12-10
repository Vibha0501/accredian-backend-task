
const mysql = require("mysql2");
async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Vibha@2001",
      database: "accredian",
      port: 3306, 
    });
    console.log("Connected to the database!");
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

module.exports = connectDB;
