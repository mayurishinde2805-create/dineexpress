const db = require('./config/db');

const sql = `
  ALTER TABLE menu
  ADD COLUMN name_hi VARCHAR(255) DEFAULT NULL,
  ADD COLUMN name_mr VARCHAR(255) DEFAULT NULL,
  ADD COLUMN description_hi TEXT DEFAULT NULL,
  ADD COLUMN description_mr TEXT DEFAULT NULL,
  ADD COLUMN category_hi VARCHAR(100) DEFAULT NULL,
  ADD COLUMN category_mr VARCHAR(100) DEFAULT NULL,
  ADD COLUMN sub_category_hi VARCHAR(100) DEFAULT NULL,
  ADD COLUMN sub_category_mr VARCHAR(100) DEFAULT NULL;
`;

db.query(sql, (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Multilingual columns already exist.');
        } else {
            console.error('Error adding columns:', err);
        }
    } else {
        console.log('Successfully added multilingual columns.');
    }
    process.exit();
});
