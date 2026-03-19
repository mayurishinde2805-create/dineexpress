const db = require('./config/db');

const drinksItems = [
    // ========================================
    // ☕ TEA (Merged Hot & Iced)
    // ========================================
    {
        name: "Regular Tea",
        category: "Drinks",
        sub_category: "Tea",
        price: 40,
        diet: "veg",
        description: "Traditional tea",
        variants: JSON.stringify([
            { name: "Regular", price: 40 },
            { name: "Large", price: 60 }
        ])
    },
    {
        name: "Masala Tea",
        category: "Drinks",
        sub_category: "Tea",
        price: 60,
        diet: "veg",
        description: "Spiced Indian tea",
        variants: JSON.stringify([
            { name: "Regular", price: 60 },
            { name: "Large", price: 80 }
        ])
    },
    { name: "Milk Tea", category: "Drinks", sub_category: "Tea", price: 50, diet: "veg", description: "Tea with milk" }, // No variants

    // ... (rest of items, adding variants sporadically for testing/completeness)

    // ========================================
    // ☕ COFFEE (Merged Hot & Cold)
    // ========================================
    {
        name: "Cappuccino",
        category: "Drinks",
        sub_category: "Coffee",
        price: 120,
        diet: "veg",
        description: "Espresso with steamed milk",
        variants: JSON.stringify([
            { name: "Small", price: 120 },
            { name: "Medium", price: 150 },
            { name: "Large", price: 180 }
        ])
    },
    {
        name: "Latte",
        category: "Drinks",
        sub_category: "Coffee",
        price: 130,
        diet: "veg",
        description: "Smooth milk coffee",
        variants: JSON.stringify([
            { name: "Small", price: 130 },
            { name: "Medium", price: 160 }
        ])
    },

    // ========================================
    // 🥤 MILKSHAKES
    // ========================================
    {
        name: "Vanilla Shake",
        category: "Drinks",
        sub_category: "Milkshakes",
        price: 120,
        diet: "veg",
        description: "Classic vanilla milkshake",
        variants: JSON.stringify([
            { name: "Regular", price: 120 },
            { name: "Thick", price: 150 }
        ])
    },
    {
        name: "Chocolate Shake",
        category: "Drinks",
        sub_category: "Milkshakes",
        price: 130,
        diet: "veg",
        description: "Rich chocolate shake",
        variants: JSON.stringify([
            { name: "Regular", price: 130 },
            { name: "Thick", price: 160 }
        ])
    },
    { name: "Oreo Shake", category: "Drinks", sub_category: "Milkshakes", price: 160, diet: "veg", description: "Cookies and cream shake" },
    { name: "KitKat Shake", category: "Drinks", sub_category: "Milkshakes", price: 170, diet: "veg", description: "Chocolate wafer shake" },
    { name: "Mango Shake", category: "Drinks", sub_category: "Milkshakes", price: 140, diet: "veg", description: "Tropical mango shake" },

    // ========================================
    // 🍹 MOCKTAILS
    // ========================================
    { name: "Virgin Mojito", category: "Drinks", sub_category: "Mocktails", price: 150, diet: "veg", description: "Mint and lime mocktail" },
    { name: "Lemon Mint Mojito", category: "Drinks", sub_category: "Mocktails", price: 160, diet: "veg", description: "Lemon mint refresher" },
    { name: "Blue Lagoon", category: "Drinks", sub_category: "Mocktails", price: 170, diet: "veg", description: "Blue curacao mocktail" },
    { name: "Fruit Punch", category: "Drinks", sub_category: "Mocktails", price: 160, diet: "veg", description: "Mixed fruit punch" },
    { name: "Watermelon Splash", category: "Drinks", sub_category: "Mocktails", price: 150, diet: "veg", description: "Fresh watermelon drink" },
    { name: "Mint Cooler", category: "Drinks", sub_category: "Mocktails", price: 130, diet: "veg", description: "Cooling mint drink" },

    // ========================================
    // 🧃 FRESH JUICES
    // ========================================
    { name: "Orange Juice", category: "Drinks", sub_category: "Juices", price: 100, diet: "veg", description: "Fresh orange juice" },
    { name: "Watermelon Juice", category: "Drinks", sub_category: "Juices", price: 100, diet: "veg", description: "Refreshing watermelon juice" },
    { name: "Pineapple Juice", category: "Drinks", sub_category: "Juices", price: 120, diet: "veg", description: "Tropical pineapple juice" },
    { name: "Mixed Fruit Juice", category: "Drinks", sub_category: "Juices", price: 130, diet: "veg", description: "Assorted fruit juice" },
    { name: "Sweet Lime Juice", category: "Drinks", sub_category: "Juices", price: 90, diet: "veg", description: "Sweet lime juice" },

    // ========================================
    // 🥛 TRADITIONAL
    // ========================================
    { name: "Buttermilk (Chaas)", category: "Drinks", sub_category: "Traditional", price: 60, diet: "veg", description: "Traditional buttermilk" },
    { name: "Sweet Lassi", category: "Drinks", sub_category: "Traditional", price: 80, diet: "veg", description: "Sweet yogurt drink" },
    { name: "Salted Lassi", category: "Drinks", sub_category: "Traditional", price: 80, diet: "veg", description: "Salted yogurt drink" },
    { name: "Coconut Water", category: "Drinks", sub_category: "Traditional", price: 70, diet: "veg", description: "Fresh coconut water" },

    // ========================================
    // 🥤 SOFT DRINKS
    // ========================================
    { name: "Coke", category: "Drinks", sub_category: "Soft Drinks", price: 50, diet: "veg", description: "Coca-Cola" },
    { name: "Pepsi", category: "Drinks", sub_category: "Soft Drinks", price: 50, diet: "veg", description: "Pepsi Cola" },
    { name: "Sprite", category: "Drinks", sub_category: "Soft Drinks", price: 50, diet: "veg", description: "Lemon-lime soda" },
    { name: "Red Bull", category: "Drinks", sub_category: "Soft Drinks", price: 120, diet: "veg", description: "Energy drink" },
    { name: "Sting", category: "Drinks", sub_category: "Soft Drinks", price: 60, diet: "veg", description: "Sting energy drink" },
];

const updateDrinks = async () => {
    // First, delete only drinks
    db.query("DELETE FROM menu WHERE category = 'Drinks'", (err) => {
        if (err) {
            console.error("Error clearing drinks:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, diet, description, variants) VALUES ?";
        const values = drinksItems.map(i => [
            i.name,
            i.category,
            i.sub_category,
            i.price,
            i.diet,
            i.description,
            i.variants || null
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding drinks:", err);
            } else {
                console.log(`✅ Drinks Menu Updated Successfully: ${result.affectedRows} items added.`);
            }
            process.exit();
        });
    });
};

updateDrinks();
