require('dotenv').config();
const db = require('./config/db');

db.query('SHOW TABLES', (err, res) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("TABLES:", res);
    
    db.query('SELECT COUNT(*) as count FROM menu_items', (err2, res2) => {
        if (!err2) console.log("menu_items count:", res2[0].count);
        
        db.query('SELECT COUNT(*) as count FROM menu', (err3, res3) => {
            if (!err3) console.log("menu count:", res3[0].count);
            process.exit(0);
        });
    });
});
