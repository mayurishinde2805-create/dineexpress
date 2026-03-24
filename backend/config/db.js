const mysql = require("mysql2");
require('dotenv').config();

const getPoolConfig = () => {
  const mysqlUrl = process.env.MYSQL_URL || process.env.DATABASE_URL || "";
  const dbHost = process.env.DB_HOST || "localhost";
  const dbUser = process.env.DB_USER || "root";
  const dbPass = process.env.DB_PASSWORD || "1234";
  const dbName = process.env.DB_NAME || "dineexpress";
  const dbPort = process.env.DB_PORT || 3306;

  // If MYSQL_URL is internal OR DB_HOST is already provided as a public proxy,
  // we prefer the individual components to be 100% sure.
  if (mysqlUrl.includes('mysql.railway.internal') || 
      (dbHost && !dbHost.includes('railway.internal') && dbHost !== 'localhost')) {
    
    console.log(`📡 [DB] Connecting via Public Host: ${dbHost}`);
    return {
      host: dbHost,
      user: dbUser,
      password: dbPass,
      database: dbName,
      port: dbPort,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    };
  }

  // Fallback to URI if it seems okay
  if (mysqlUrl) {
    console.log("📡 [DB] Initializing with URI source...");
    return {
      uri: mysqlUrl.includes('?') 
          ? `${mysqlUrl}&ssl={"rejectUnauthorized":false}` 
          : `${mysqlUrl}?ssl={"rejectUnauthorized":false}`,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    };
  }

  // Local Default
  return {
    host: "localhost",
    user: "root",
    password: "password", // fallback
    database: "dineexpress",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
};

const poolConfig = getPoolConfig();
const db = (poolConfig.uri) ? mysql.createPool(poolConfig.uri) : mysql.createPool(poolConfig);

db.on('error', (err) => {
  console.error('🔥 [DB POOL ERROR]:', err.code, err.message);
});

module.exports = db;
