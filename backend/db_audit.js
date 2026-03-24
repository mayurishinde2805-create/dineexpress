const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'dineexpress'
        });

        console.log('--- CATEGORY AUDIT ---');
        const [cats] = await db.query('SELECT DISTINCT category, display_category FROM menu_items');
        console.table(cats);

        console.log('\n--- STARTERS SUBCATEGORY AUDIT ---');
        const [subcats] = await db.query('SELECT DISTINCT category, sub_category, display_sub_category FROM menu_items WHERE category LIKE "%starter%"');
        console.table(subcats);

        await db.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ DB AUDIT FAILED:', err.message);
        process.exit(1);
    }
})();
