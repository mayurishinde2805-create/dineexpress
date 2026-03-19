const db = require("./config/db");

const checkSchemas = async () => {
    const tables = ['menu', 'orders'];
    for (const table of tables) {
        db.query(`DESCRIBE ${table}`, (err, result) => {
            if (err) {
                console.log(`Error describing ${table}: (Table might not exist)`);
            } else {
                console.log(`Schema for ${table}:`, result);
            }
        });
    }
    // Wait a bit for queries to finish before exiting (simple script)
    setTimeout(() => process.exit(), 1000);
};

checkSchemas();
