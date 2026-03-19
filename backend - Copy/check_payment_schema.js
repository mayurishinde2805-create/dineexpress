const mysql = require('mysql2');
const db = require('./config/db');

const checkSchema = () => {
    const queries = [
        "DESCRIBE orders",
        "DESCRIBE tables"
    ];

    queries.forEach(query => {
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error executing query:", query, err);
            } else {
                console.log(`\nSchema for query: ${query}`);
                console.table(results);
            }
        });
    });

    // Keep alive for a moment to print results then exit
    setTimeout(() => process.exit(0), 1000);
};

checkSchema();
