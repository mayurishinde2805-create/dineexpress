const db = require('./config/db');

const columns = [
    "model_url VARCHAR(255) DEFAULT NULL",
    "variants TEXT DEFAULT NULL",
    "name_hi VARCHAR(255) DEFAULT NULL",
    "name_mr VARCHAR(255) DEFAULT NULL",
    "description_hi TEXT DEFAULT NULL",
    "description_mr TEXT DEFAULT NULL",
    "category_hi VARCHAR(100) DEFAULT NULL",
    "category_mr VARCHAR(100) DEFAULT NULL",
    "sub_category_hi VARCHAR(100) DEFAULT NULL",
    "sub_category_mr VARCHAR(100) DEFAULT NULL",
    "is_available TINYINT(1) DEFAULT 1",
    "type VARCHAR(50) DEFAULT 'veg'"
];

async function migrate() {
    console.log("🛠️ Starting Migration for table: menu_items");

    for (const col of columns) {
        const colName = col.split(' ')[0];
        try {
            await new Promise((resolve, reject) => {
                db.query(`ALTER TABLE menu_items ADD COLUMN ${col}`, (err) => {
                    if (err) {
                        if (err.code === 'ER_DUP_FIELDNAME') {
                            console.log(`ℹ️ Column already exists: ${colName}`);
                            resolve();
                        } else {
                            reject(err);
                        }
                    } else {
                        console.log(`✅ Added column: ${colName}`);
                        resolve();
                    }
                });
            });
        } catch (e) {
            console.error(`❌ Migration Error for ${colName}:`, e.message);
        }
    }

    console.log("🚀 Migration Complete!");
    process.exit(0);
}

migrate();
