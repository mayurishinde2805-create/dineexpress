const mysql = require("mysql2");
require('dotenv').config();

const dbConfig = process.env.MYSQL_URL || process.env.DATABASE_URL ? {
  uri: process.env.MYSQL_URL || process.env.DATABASE_URL
} : {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "dineexpress",
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : null
};

const db = (process.env.MYSQL_URL || process.env.DATABASE_URL) 
  ? mysql.createConnection(process.env.MYSQL_URL || process.env.DATABASE_URL)
  : mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.log("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ Database Connected (Live/Local)");
  }
});

module.exports = db;
