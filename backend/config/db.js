const mysql = require("mysql2");
require('dotenv').config();

// Standard pool configuration for production/local
const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "dineexpress",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Automatically enable SSL for production hosts (Render/Railway)
  ssl: (process.env.DB_HOST && !process.env.DB_HOST.includes('localhost')) 
       ? { rejectUnauthorized: false } 
       : null
};

console.log(`📡 [DB] Connecting to host: ${poolConfig.host} | DB: ${poolConfig.database}`);

// Create the pool
const db = mysql.createPool(poolConfig);

// Test connectivity immediately
db.getConnection((err, connection) => {
  if (err) {
    console.error("🔥 [DB CONNECTION FAILED]:", err.message);
  } else {
    console.log("✅ [DB CONNECTED SUCCESS]");
    connection.release();
  }
});

module.exports = db;
