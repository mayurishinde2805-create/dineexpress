require('dotenv').config();
const db = require('./config/db');
const fs = require('fs');

const run = async () => {
    try {
        const getDesc = (table) => new Promise((resolve) => {
            db.query(`DESCRIBE ${table}`, (err, res) => {
                if (err) resolve(`Error: ${table} not found.`);
                else resolve(JSON.stringify(res, null, 2));
            });
        });

        const ordersSchema = await getDesc('orders');
        const tablesSchema = await getDesc('tables');

        const out = `--- ORDERS SCHEMA ---\n${ordersSchema}\n\n--- TABLES SCHEMA ---\n${tablesSchema}`;
        fs.writeFileSync('schema_dump.txt', out);
        console.log("Schema dumped to schema_dump.txt");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
