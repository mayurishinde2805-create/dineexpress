require('dotenv').config();
const db = require('./config/db');

async function inspect() {
    db.query('DESCRIBE menu', (err, res) => {
        console.log("SCHEMA [menu]:", JSON.stringify(res, null, 2));
        db.query('DESCRIBE menu_items', (err2, res2) => {
            console.log("SCHEMA [menu_items]:", JSON.stringify(res2, null, 2));
            process.exit(0);
        });
    });
}

inspect();
