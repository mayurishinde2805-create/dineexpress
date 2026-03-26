require('dotenv').config();
const db = require('./config/db');
db.query('SELECT name, image_url, model_url FROM menu_items WHERE name LIKE "%Veg Spring Rolls%"', (err, res) => {
    console.log(JSON.stringify(res, null, 2));
    process.exit();
});
