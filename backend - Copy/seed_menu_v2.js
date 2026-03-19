const db = require("./config/db");

const seedMenuV2 = async () => {
    console.log("Starting menu seed V2...");

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

        const items = [
            // --- STARTERS ---
            // Indian Starters
            ['Paneer Tikka', 240, 'Starters', 'Spiced grilled cottage cheese cubes with mint chutney', 'paneer_tikka.png', 'Indian', JSON.stringify([{ name: "Half", price: 140 }, { name: "Full", price: 240 }])],
            ['Hara Bhara Kebab', 210, 'Starters', 'Spinach and green pea patties, shallow fried', 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=300&q=80', 'Indian', JSON.stringify([{ name: "Half", price: 120 }, { name: "Full", price: 210 }])],
            // Chinese Starters
            ['Veg Crispy', 190, 'Starters', 'Crunchy assorted vegetables tossed in schezwan sauce', 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=300&q=80', 'Chinese', JSON.stringify([{ name: "Half", price: 110 }, { name: "Full", price: 190 }])],
            ['Spring Rolls', 180, 'Starters', 'Crispy rolls stuffed with veggie mix', 'https://images.unsplash.com/photo-1544025162-d76690b67f66?auto=format&fit=crop&w=300&q=80', 'Chinese', JSON.stringify([{ name: "Half", price: 100 }, { name: "Full", price: 180 }])],
            ['Manchurian Dry', 200, 'Starters', 'Fried veg balls in spicy dry sauce', 'https://images.unsplash.com/photo-1625631980666-077429776b77?auto=format&fit=crop&w=300&q=80', 'Chinese', JSON.stringify([{ name: "Half", price: 120 }, { name: "Full", price: 200 }])],
            // Mexican/Continental
            ['Nachos Supreme', 220, 'Starters', 'Tortilla chips topped with cheese, jalapenos and salsa', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=300&q=80', 'Continental', JSON.stringify([{ name: "Full", price: 220 }])],
            ['Garlic Bread', 140, 'Starters', 'Toasted french loaf with garlic butter and herbs', 'https://images.unsplash.com/photo-1573140247632-f84660f67126?auto=format&fit=crop&w=300&q=80', 'Continental', JSON.stringify([{ name: "Full", price: 140 }])],

            // --- MAIN COURSE ---
            // North Indian
            ['Butter Chicken', 380, 'Main Course', 'Rich and creamy tomato-based chicken curry', 'butter_chicken.png', 'North Indian', JSON.stringify([{ name: "Half", price: 220 }, { name: "Full", price: 380 }])],
            ['Hyderabadi Biryani', 350, 'Main Course', 'Aromatic basmati rice cooked with tender chicken and spices', 'hyderabadi_biryani.png', 'North Indian', JSON.stringify([{ name: "Half", price: 200 }, { name: "Full", price: 350 }])],
            ['Dal Tadka', 200, 'Main Course', 'Yellow lentils tempered with garlic, cumin and chillies', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80', 'North Indian', JSON.stringify([{ name: "Half", price: 120 }, { name: "Full", price: 200 }])],
            ['Paneer Butter Masala', 290, 'Main Course', 'Soft paneer cubes in a rich buttery gravy', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80', 'North Indian', JSON.stringify([{ name: "Half", price: 170 }, { name: "Full", price: 290 }])],
            ['Veg Handi', 260, 'Main Course', 'Mixed vegetables cooked in a handi with spicy gravy', 'https://images.unsplash.com/photo-1632203171982-cc0df6e9ceb4?auto=format&fit=crop&w=300&q=80', 'North Indian', JSON.stringify([{ name: "Half", price: 150 }, { name: "Full", price: 260 }])],
            ['Naan Basket', 150, 'Main Course', 'Assortment of Butter Naan, Garlic Naan, and Roti', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e3?auto=format&fit=crop&w=300&q=80', 'North Indian', null],

            // South Indian
            ['Masala Dosa', 160, 'Main Course', 'Crispy rice crepe filled with spiced potato masala', 'masala_dosa.png', 'South Indian', null],
            ['Idli Sambar', 120, 'Main Course', 'Steamed rice cakes served with lentil soup', 'https://images.unsplash.com/photo-1653554157835-519213554b73?auto=format&fit=crop&w=300&q=80', 'South Indian', null],
            ['Uttapam', 140, 'Main Course', 'Thick pancake topped with onions and tomatoes', 'https://images.unsplash.com/photo-1668236543090-d2382906e5d6?auto=format&fit=crop&w=300&q=80', 'South Indian', null],

            // Chinese Main
            ['Hakka Noodles', 220, 'Main Course', 'Stir-fried noodles with veggies', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80', 'Chinese', JSON.stringify([{ name: "Half", price: 130 }, { name: "Full", price: 220 }])],
            ['Veg Fried Rice', 200, 'Main Course', 'Wok tossed rice with vegetables', 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&w=300&q=80', 'Chinese', JSON.stringify([{ name: "Half", price: 120 }, { name: "Full", price: 200 }])],

            // Italian
            ['Pasta Alfredo', 310, 'Main Course', 'Penne pasta in creamy white sauce', 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=300&q=80', 'Italian', null],
            ['Margherita Pizza', 299, 'Main Course', 'Classic cheese and tomato pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80', 'Italian', JSON.stringify([{ name: "Medium", price: 299 }, { name: "Large", price: 499 }])],

            // --- DESSERTS ---
            ['Gulab Jamun', 140, 'Desserts', 'Soft milk dumplings soaked in rose-flavored sugar syrup', 'gulab_jamun.png', 'Indian Sweets', JSON.stringify([{ name: "2 pcs", price: 80 }, { name: "4 pcs", price: 140 }])],
            ['Sizzling Brownie', 280, 'Desserts', 'Hot chocolate brownie served with vanilla ice cream', 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?auto=format&fit=crop&w=300&q=80', 'Cake & Brownie', null],
            ['Rasmalai', 160, 'Desserts', 'Soft paneer discs in sweetened saffron milk', 'https://images.unsplash.com/photo-1542316535-649033288924?auto=format&fit=crop&w=300&q=80', 'Indian Sweets', JSON.stringify([{ name: "2 pcs", price: 90 }, { name: "4 pcs", price: 160 }])],
            ['Ice Cream Sundae', 190, 'Desserts', 'Three scoops of ice cream with nuts and syrup', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=80', 'Ice Cream', null],

            // --- BEVERAGES ---
            ['Virgin Mojito', 160, 'Beverages', 'Refreshing mix of lime, mint and soda', 'virgin_mojito.png', 'Mocktails', null],
            ['Mango Lassi', 120, 'Beverages', 'Thick and creamy mango flavored yogurt drink', 'https://images.unsplash.com/photo-1631557989341-3b6805d76214?auto=format&fit=crop&w=300&q=80', 'Cold Drinks', null],
            ['Cold Coffee', 180, 'Beverages', 'Chilled coffee blended with ice cream', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&q=80', 'Cold Drinks', null]
        ];

        const sql = "INSERT INTO menu (name, price, category, description, image_url, sub_category, variants) VALUES ?";
        await runQuery(sql, [items]);

        console.log("🎉 Menu seeded with V2 content (Subcategories & Variants)!");
        process.exit();

    } catch (err) {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    }
};

seedMenuV2();
