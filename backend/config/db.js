const mysql = require("mysql2");
require('dotenv').config();

const dbConfig = (process.env.MYSQL_URL || process.env.DATABASE_URL) 
  ? process.env.MYSQL_URL || process.env.DATABASE_URL
  : {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "1234",
      database: process.env.DB_NAME || "dineexpress",
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

const pool = (typeof dbConfig === 'string') 
  ? mysql.createPool(dbConfig) 
  : mysql.createPool(dbConfig);

// Use promise-based pool for easier async/await if needed
const db = pool;

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB Pool Connection failed:", err.message);
  } else {
    console.log("✅ Database Pool Connected (Live/Local)");
    connection.release();
  }
});

module.exports = db;
