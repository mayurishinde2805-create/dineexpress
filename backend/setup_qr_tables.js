const db = require('./config/db');
const QRCode = require('qrcode');

exports.setupTables = async (callback) => {
    console.log("Synchronizing Tables Schema & QR Codes...");

    // 1. Create Tables table if not exists
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS tables (
            id INT AUTO_INCREMENT PRIMARY KEY,
            table_number VARCHAR(50) UNIQUE NOT NULL,
            capacity INT DEFAULT 4,
            status ENUM('Available', 'Occupied', 'Cleaning') DEFAULT 'Available',
            qr_code LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(createTableSql, async (err) => {
        if (err) {
            console.error("Error creating tables table:", err);
            if (callback) callback(err);
            return;
        }

        // 2. Ensure orders table uses VARCHAR for table_number
        db.query("ALTER TABLE orders MODIFY COLUMN table_number VARCHAR(50)", async (err2) => {
            // Ignore error if column missing (unlikely)
            
            // 3. Clear existing tables to prevent duplicates during reseed
            db.query("DELETE FROM tables", async (err3) => {
                if (err3) {
                    console.error("Error clearing tables:", err3);
                    if (callback) callback(err3);
                    return;
                }

                console.log("✅ Clean slate for QR Tables.");
                
                let completed = 0;
                const totalTables = 5;

                for (let i = 1; i <= totalTables; i++) {
                    const tableUrl = `https://dineexpress-frontend.onrender.com/menu?table=${i}`;
                    
                    try {
                        const qrCodeDataUrl = await QRCode.toDataURL(tableUrl);
                        const insertSql = "INSERT INTO tables (table_number, capacity, status, qr_code) VALUES (?, ?, 'Available', ?)";
                        
                        db.query(insertSql, [i.toString(), 4, qrCodeDataUrl], (err4) => {
                            completed++;
                            if (err4) console.error(`🚨 Error inserting Table ${i}:`, err4);
                            
                            if (completed === totalTables) {
                                console.log("🚀 All 5 QR Tables fully injected!");
                                if (callback) callback(null);
                            }
                        });
                    } catch (qrErr) {
                        completed++;
                        console.error(`🚨 QR Generation failed for Table ${i}:`, qrErr);
                        if (completed === totalTables) {
                            if (callback) callback(null);
                        }
                    }
                }
            });
        });
    });
};

if (require.main === module) {
    exports.setupTables((err) => {
        if (err) { console.error("Setup failed:", err); process.exit(1); }
        else { console.log("Setup finished successfully."); process.exit(0); }
    });
}
