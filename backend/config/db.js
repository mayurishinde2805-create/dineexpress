const mysql = require("mysql2");
require('dotenv').config();

const getPoolConfig = () => {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  if (url) {
    // For Railway/Aiven/Hero/etc URIs
    console.log("📡 [DB] Using URI for Database connection...");
    // Force SSL for cloud URIs as it's often required
    return {
      uri: url,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    };
  }

  // Standard Local Configuration
  return {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "dineexpress",
    port: process.env.DB_PORT || 3306,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
  };
};

const poolConfig = getPoolConfig();

// Safely handle URI vs Object config
const db = (poolConfig.uri) 
  ? mysql.createPool(poolConfig.uri.includes('?') 
      ? `${poolConfig.uri}&ssl={"rejectUnauthorized":false}` 
      : `${poolConfig.uri}?ssl={"rejectUnauthorized":false}`)
  : mysql.createPool(poolConfig);

db.on('error', (err) => {
  console.error('🔥 [DB POOL ERROR]:', err.code, err.message);
});

module.exports = db;
