require('dotenv').config();
const db = require('./config/db');
db.query("UPDATE users SET role='admin' WHERE email='mayurishinde2805@gmail.com'", (err, res) => {
    if (err) console.error(err);
    else console.log("Role updated successfully!");
    process.exit();
});
