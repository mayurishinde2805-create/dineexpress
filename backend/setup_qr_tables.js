require('dotenv').config();
const db = require('./config/db');
const QRCode = require('qrcode');

const run = async () => {
    // 1. ALTER ORDERS TABLE TO ACCEPT 'Table 1' STRINGS
    db.query("ALTER TABLE orders MODIFY COLUMN table_number VARCHAR(50)", async (err) => {
        if (err) console.log("Schema alter info:", err.message);
        else console.log("✅ orders.table_number explicitly migrated to VARCHAR(50)");

        // 2. CLEAR DANGLING TABLES
        db.query("DELETE FROM tables", async (err) => {
             if (err) {
                 console.error("Error clearing tables:", err.message);
                 process.exit(1);
             }
             console.log("✅ Prepared clean slate for 5 mandatory Tables.");
             
             // 3. GENERATE AND INSERT 5 UNIQUE QR TABLES
             for (let i = 1; i <= 5; i++) {
                 // Format the QR link specifically for their Render production frontend
                 const tableUrl = `https://dineexpress-frontend.onrender.com/menu?table=${i}`;
                 
                 try {
                     const qrCodeDataUrl = await QRCode.toDataURL(tableUrl);
                     const insertSql = "INSERT INTO tables (table_number, capacity, status, qr_code) VALUES (?, ?, 'Available', ?)";
                     
                     db.query(insertSql, [i.toString(), 4, qrCodeDataUrl], (err) => {
                         if (err) console.error(`🚨 Error inserting Table ${i}:`, err);
                         else console.log(`✅ Table ${i} successfully generated and bound to QR: ${tableUrl}`);
                         
                         // Terminate process cleanly after final table is injected
                         if (i === 5) {
                             setTimeout(() => {
                                 console.log("🚀 All 5 QR Tables fully injected into the Database Ecosystem!");
                                 process.exit(0);
                             }, 1000);
                         }
                     });
                 } catch (qrErr) {
                     console.error(`🚨 QR Generation failed for Table ${i}:`, qrErr);
                 }
             }
        });
    });
};

run();
