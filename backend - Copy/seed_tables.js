const db = require('./config/db');
const QRCode = require('qrcode');

const seedTables = async () => {
    console.log("🌱 Seeding Tables...");

    const tables = [
        { number: 1, capacity: 2, status: 'Occupied' },
        { number: 2, capacity: 2, status: 'Available' },
        { number: 3, capacity: 4, status: 'Available' },
        { number: 4, capacity: 4, status: 'Occupied' },
        { number: 5, capacity: 6, status: 'Available' },
        { number: 6, capacity: 4, status: 'Available' },
        { number: 7, capacity: 8, status: 'Available' },
        { number: 8, capacity: 2, status: 'Occupied' },
        { number: 9, capacity: 4, status: 'Available' },
        { number: 10, capacity: 10, status: 'Available' }
    ];

    for (const t of tables) {
        const url = `http://192.168.0.101:3000/?table=${t.number}`;
        try {
            const qrImage = await QRCode.toDataURL(url, {
                width: 300,
                color: { dark: "#0d1b0d", light: "#f5f5dc" }
            });

            const sql = "INSERT INTO tables (table_number, capacity, status, qr_code) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status=VALUES(status), qr_code=VALUES(qr_code)";

            await new Promise((resolve, reject) => {
                db.query(sql, [t.number, t.capacity, t.status, qrImage], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            console.log(`✅ Table ${t.number} added/updated.`);
        } catch (error) {
            console.error(`❌ Failed Table ${t.number}:`, error);
        }
    }
    console.log("🚀 Tables Seeded Successfully!");
    process.exit();
};

seedTables();
