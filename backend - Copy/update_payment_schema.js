const db = require('./config/db');

const updateSchema = () => {
    const queries = [
        "ALTER TABLE orders ADD COLUMN payment_mode ENUM('Cash', 'UPI', 'Card') DEFAULT 'Cash'",
        "ALTER TABLE orders ADD COLUMN payment_status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending'",
        "ALTER TABLE orders ADD COLUMN table_status ENUM('Occupied', 'Available') DEFAULT 'Occupied'"
    ];

    queries.forEach(query => {
        db.query(query, (err, result) => {
            if (err) {
                // Ignore if column already exists
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column already exists: ${query}`);
                } else {
                    console.error(`Error executing query: ${query}`, err);
                }
            } else {
                console.log(`✅ Schema updated: ${query}`);
            }
        });
    });

    setTimeout(() => process.exit(0), 2000);
};

updateSchema();
