const db = require('./config/db');

const alterQuery = `
    ALTER TABLE menu 
    ADD COLUMN variants_hi JSON DEFAULT NULL,
    ADD COLUMN variants_mr JSON DEFAULT NULL;
`;

db.query(alterQuery, (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Columns already exist.");
        } else {
            console.error(err);
        }
    } else {
        console.log("✅ Added variants_hi and variants_mr columns.");
    }
    process.exit();
});
