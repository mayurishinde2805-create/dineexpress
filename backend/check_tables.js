const db = require('./config/db');

db.query("SELECT id, table_number, status, capacity, qr_code FROM tables", (err, results) => {
    if (err) {
        console.error("Error querying tables:", err);
        process.exit(1);
    }
    console.log("Current Tables in DB:");
    console.log(JSON.stringify(results.map(r => ({
        id: r.id,
        table: r.table_number,
        status: r.status,
        capacity: r.capacity,
        has_qr: r.qr_code ? "YES (Length: " + r.qr_code.length + ")" : "NO"
    })), null, 2));
    process.exit(0);
});
