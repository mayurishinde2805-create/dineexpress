const db = require('./config/db');

const sql = `
  ALTER TABLE menu
  ADD COLUMN image_url VARCHAR(500) DEFAULT NULL,
  ADD COLUMN sub_category_image VARCHAR(500) DEFAULT NULL;
`;

db.query(sql, (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Columns already exist.');
        } else {
            console.error('Error adding columns:', err);
        }
    } else {
        console.log('Successfully added image columns.');
    }
    process.exit();
});
