const db = require('./config/db');

const alterTableQuery = `
  ALTER TABLE orders
  ADD COLUMN served_at DATETIME NULL;
`;

db.query(alterTableQuery, (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column served_at already exists.');
        } else {
            console.error('Error adding column:', err);
        }
    } else {
        console.log('Successfully added served_at column to orders table.');
    }
    process.exit();
});
