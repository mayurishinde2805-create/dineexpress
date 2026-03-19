const db = require("./config/db");

const seedMenu = async () => {
    console.log("Starting menu seed...");

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
        await runQuery("TRUNCATE TABLE menu");

        // Items with Custom 3D Images
        // paneer_tikka, butter_chicken, gulab_jamun, virgin_mojito, hyderabadi_biryani, masala_dosa

        const items = [
            // Starters
            ['Paneer Tikka', 240, 'Starters', 'Spiced grilled cottage cheese cubes with mint chutney', 'paneer_tikka_3d.png'],
            ['Masala Dosa', 160, 'Starters', 'Crispy rice crepe filled with spiced potato masala', 'masala_dosa.png'],
            ['Veg Crispy', 190, 'Starters', 'Crunchy assorted vegetables tossed in schezwan sauce', 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=300&q=80'],
            ['Hara Bhara Kebab', 210, 'Starters', 'Spinach and green pea patties, shallow fried', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=300&q=80'],
            ['Spring Rolls', 180, 'Starters', 'Crispy rolls stuffed with veggie mix', 'https://images.unsplash.com/photo-1544025162-d76690b67f66?auto=format&fit=crop&w=300&q=80'],
            ['Nachos Supreme', 220, 'Starters', 'Tortilla chips topped with cheese, jalapenos and salsa', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=300&q=80'],
            ['Chicken Wings', 280, 'Starters', 'Spicy buffalo style chicken wings', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=300&q=80'],
            ['Garlic Bread', 140, 'Starters', 'Toasted french loaf with garlic butter and herbs', 'https://images.unsplash.com/photo-1573140247632-f84660f67126?auto=format&fit=crop&w=300&q=80'],

            // Main Course
            ['Butter Chicken', 380, 'Main Course', 'Rich and creamy tomato-based chicken curry', 'butter_chicken_3d.png'],
            ['Hyderabadi Biryani', 350, 'Main Course', 'Aromatic basmati rice cooked with tender chicken and spices', 'hyderabadi_biryani.png'],
            ['Dal Tadka', 200, 'Main Course', 'Yellow lentils tempered with garlic, cumin and chillies', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80'],
            ['Paneer Butter Masala', 290, 'Main Course', 'Soft paneer cubes in a rich buttery gravy', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80'],
            ['Veg Handi', 260, 'Main Course', 'Mixed vegetables cooked in a handi with spicy gravy', 'https://images.unsplash.com/photo-1632203171982-cc0df6e9ceb4?auto=format&fit=crop&w=300&q=80'],
            ['Naan Basket', 150, 'Main Course', 'Assortment of Butter Naan, Garlic Naan, and Roti', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=300&q=80'],
            ['Chicken Tikka Masala', 360, 'Main Course', 'Roasted marinated chicken chunks in spiced curry sauce', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=300&q=80'],
            ['Pasta Alfredo', 310, 'Main Course', 'Penne pasta in creamy white sauce', 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=300&q=80'],
            ['Veg Grilled Sandwich', 180, 'Main Course', 'Loaded vegetable sandwich grilled to perfection', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80'],
            ['Margherita Pizza', 299, 'Main Course', 'Classic cheese and tomato pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80'],

            // Desserts
            ['Gulab Jamun', 140, 'Desserts', 'Soft milk dumplings soaked in rose-flavored sugar syrup', 'gulab_jamun_3d.png'],
            ['Sizzling Brownie', 280, 'Desserts', 'Hot chocolate brownie served with vanilla ice cream', 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?auto=format&fit=crop&w=300&q=80'],
            ['Rasmalai', 160, 'Desserts', 'Soft paneer discs in sweetened saffron milk', 'https://images.unsplash.com/photo-1633504824844-31518b5b530c?auto=format&fit=crop&w=300&q=80'],
            ['Chocolate Mousse', 220, 'Desserts', 'Airy and rich chocolate delight', 'https://images.unsplash.com/photo-1642686129882-95914560b73c?auto=format&fit=crop&w=300&q=80'],
            ['Ice Cream Sundae', 190, 'Desserts', 'Three scoops of ice cream with nuts and syrup', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=80'],

            // Beverages
            ['Virgin Mojito', 160, 'Beverages', 'Refreshing mix of lime, mint and soda', 'virgin_mojito_3d.png'],
            ['Mango Lassi', 120, 'Beverages', 'Thick and creamy mango flavored yogurt drink', 'https://images.unsplash.com/photo-1631557989341-3b6805d76214?auto=format&fit=crop&w=300&q=80'],
            ['Cold Coffee', 180, 'Beverages', 'Chilled coffee blended with ice cream', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&q=80'],
            ['Lemon Tea', 90, 'Beverages', 'Hot tea with a zesty lemon flavor', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80'],
            ['Watermelon Juice', 130, 'Beverages', 'Fresh pressed watermelon juice', 'https://images.unsplash.com/photo-1621538997098-b80c35532d80?auto=format&fit=crop&w=300&q=80'],
            ['Oreo Shake', 190, 'Beverages', 'Thick shake blended with Oreo cookies', 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=300&q=80']
        ];

        const sql = "INSERT INTO menu (name, price, category, description, image_url) VALUES ?";
        await runQuery(sql, [items]);

        console.log("🎉 Menu seeded with rich content!");
        process.exit();

    } catch (err) {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    }
};

seedMenu();
