const db = require("./config/db");

const addBirthdateColumn = () => {
    const sql = "ALTER TABLE users ADD COLUMN birthdate DATE AFTER mobile";
    db.query(sql, (err) => {
        if (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
                console.log("Column 'birthdate' already exists. Skipping.");
            } else {
                console.error("Error adding column:", err);
            }
        } else {
            console.log("Column 'birthdate' added successfully.");
        }
        process.exit();
    });
};

addBirthdateColumn();
