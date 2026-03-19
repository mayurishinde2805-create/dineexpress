const db = require("./config/db");

const updateSchema = async () => {
    console.log("Starting schema update...");

    // Helper for query execution
    const runQuery = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.query(sql, params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        // 1. Update MENU table - Split into separate checks to avoid "Duplicate column" error hard stop
        // Or just suppress error if column exists.
        console.log("1. Altering menu table...");
        try {
            await runQuery("ALTER TABLE menu ADD COLUMN description TEXT");
        } catch (e) { console.log("   - Description column might already exist"); }

        try {
            await runQuery("ALTER TABLE menu ADD COLUMN image_url VARCHAR(255)");
        } catch (e) { console.log("   - Image_url column might already exist"); }

        // 2. Re-create ORDERS table
        console.log("2. Recreating orders table...");
        await runQuery("DROP TABLE IF EXISTS order_items"); // Drop child first
        await runQuery("DROP TABLE IF EXISTS orders");

        await runQuery(`
            CREATE TABLE orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                table_no VARCHAR(50),
                total_amount DECIMAL(10,2),
                status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Create ORDER_ITEMS table
        console.log("3. Creating order_items table...");
        await runQuery(`
            CREATE TABLE order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                item_id INT,
                quantity INT,
                price DECIMAL(10,2),
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);

        // 4. Seed initial MENU data
        console.log("4. Seeding menu data...");
        await runQuery("TRUNCATE TABLE menu");

        const items = [
            // Starters
            ['Paneer Tikka', 220, 'Starters', 'Spiced grilled cottage cheese cubes', 'https://t3.ftcdn.net/jpg/02/05/85/38/240_F_205853874_7o2O2Nf3O4g3P2G2F2g2F2g2.jpg'],
            ['Veg Crispy', 180, 'Starters', 'Crispy fried assorted vegetables', 'https://t3.ftcdn.net/jpg/03/05/85/38/240_F_305853874_7o2O2Nf3O4g3P2G2F2g2F2g2.jpg'], // Placeholder URLs
            // Main Course
            ['Butter Chicken', 350, 'Main Course', 'Classic rich creamy chicken curry', 'https://t4.ftcdn.net/jpg/04/05/85/38/240_F_405853874_7o2O2Nf3O4g3P2G2F2g2F2g2.jpg'],
            ['Dal Tadka', 190, 'Main Course', 'Yellow lentil tempered with spices', 'https://t4.ftcdn.net/jpg/05/05/85/38/240_F_505853874_7o2O2Nf3O4g3P2G2F2g2F2g2.jpg'],
            // Desserts
            ['Gulab Jamun', 120, 'Desserts', 'Sweet milk dumplings in syrup', 'https://t4.ftcdn.net/jpg/06/05/85/38/240_F_605853874_7o2O2Nf3O4g3P2G2F2g2F2g2.jpg'],
            ['Sizzling Brownie', 250, 'Desserts', 'Hot brownie with vanilla ice cream', 'https://t4.ftcdn.net/jpg/07/05/85/38/240_F_705853874_7o2O2Nf3O4g3P2G2F2g2F2g2.jpg'],
            // Beverages
            ['Virgin Mojito', 150, 'Beverages', 'Refreshing lime and mint cooler', 'https://t4.ftcdn.net/jpg/08/05/85/38/240_F_805853874_7o2O2Nf3O4g3P2G2F2g2F2g2.jpg']
        ];

        const sql = "INSERT INTO menu (name, price, category, description, image_url) VALUES ?";
        await runQuery(sql, [items]);

        console.log("🎉 Schema update complete!");
        process.exit();

    } catch (err) {
        console.error("❌ Schema update failed:", err);
        process.exit(1);
    }
};

updateSchema();
