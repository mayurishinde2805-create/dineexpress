const mysql = require("mysql2");
require('dotenv').config();

const getPoolConfig = () => {
  let url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  
  // GLOBAL SELF-HEALING: Replace ALL occurrences of the internal hostname
  if (url && url.includes('mysql.railway.internal')) {
    console.warn("⚠️ [DB] Internal Railway hostname detected in URL. Patching...");
    const publicHost = (process.env.DB_HOST && !process.env.DB_HOST.includes('railway.internal')) 
      ? process.env.DB_HOST 
      : 'caboose.proxy.rlwy.net';
    
    // Global replacement to be safe
    url = url.split('mysql.railway.internal').join(publicHost);
    console.log(`📡 [DB] Patched Host to: ${publicHost}`);
  }

  if (url) {
    console.log("📡 [DB] Initializing with URI source...");
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
